# DEPLOY_06_ROLLBACK_KILL_SWITCH — Stop Trading Fast + Roll Back Cleanly

## Goal
In production, we need:
- a 30-second "STOP TRADING" switch (no redeploy required)
- a 2-minute rollback path for web + api
- a clear incident flow to avoid ambiguous money states

This file defines how to do that.

---

## 0) Terminology
- "Kill switch": disables money-moving actions (BUY/SELL commits), while still allowing browsing.
- "Rollback": deploy previous known-good versions of web/app.

---

## 1) Kill switch design (must exist in code)
We require **3 layers** of kill controls:

### 1.1 Layer A — Runtime hard kill (backend env override)
- Env var: `HARD_KILL_TRADING=true|false`
- Behavior:
  - If true, backend MUST reject all commit endpoints with `MAINTENANCE_TRADING_DISABLED`.
  - WS SYSTEM_STATUS must broadcast trading_disabled=true.
- Pros: very safe
- Cons: requires platform secret update + restart/redeploy

### 1.2 Layer B — Remote-config kill (DB-driven)
- Config key: `maintenance.trading_disabled`
- Stored in DB (or config store) and returned by `/v1/config`
- Backend MUST check it on every commit request.
- Pros: fastest (no redeploy)
- Cons: requires a secure admin path to flip it

### 1.3 Layer C — Frontend UX kill (display + input disable)
- Web app MUST:
  - read `/v1/config` on boot and on interval (e.g., every 30–60s)
  - if trading disabled:
    - disable hold-to-buy and sell actions
    - show banner "Trading paused"
- NOTE: frontend kill is NOT security (backend must enforce).

---

## 2) "Stop trading" procedure (production)

### Fastest path (preferred): flip remote-config kill
1) Set `maintenance.trading_disabled = true` in DB/config store
2) Verify:
   - `GET /v1/config` returns disabled
   - `POST /v1/trades/commit` returns `MAINTENANCE_TRADING_DISABLED`
3) Confirm frontend shows banner and disables actions

### Second fastest: set backend HARD_KILL_TRADING
1) Update backend secret/env `HARD_KILL_TRADING=true`
2) Restart/redeploy backend
3) Verify same as above

---

## 3) What happens during kill switch
When trading is disabled:
- BUY/SELL commits are rejected deterministically
- Activity/Audit remains available
- Reconciliation MUST continue (resolve unknown/pending)
- Browsing MAY remain available (unless you also disable deck)

---

## 4) Rollback strategy (must be pre-planned)
We roll back web and backend separately.

### 4.1 Web rollback (Cloudflare Pages)
- Use Pages "Rollback to previous deployment" for prod project
- Verify:
  - web loads
  - points to correct API
  - no broken routing

### 4.2 Backend rollback (Fly.io)
- Redeploy previous image/commit SHA
- Verify:
  - `/v1/health` build SHA matches expected
  - `/v1/config` works
  - commit endpoints behave correctly

> Rule: If a bad deploy is suspected, flip kill switch FIRST, then roll back.

---

## 5) Incident playbook (minimal)

### Trigger conditions (examples)
- unknown_state_rate spikes
- duplicate trade suspected
- commit latency explodes
- provider outage / RPC unstable

### Response
1) Flip kill switch (Layer B preferred)
2) Announce in Telegram Support channel: "Trading paused, funds remain in your wallet."
3) Check Activity/Audit consistency
4) Run reconciliation worker for unresolved trades
5) Decide:
   - rollback to last good
   - or hotfix forward if rollback not safe (schema changes)

---

## 6) Verification checklist (after rollback)
- [ ] trading disabled stays enforced server-side
- [ ] web UI shows disabled banner
- [ ] Activity loads and shows truthful states
- [ ] reconciliation runs and reduces UNKNOWN/PENDING
- [ ] error codes map to actionable UI (no generic 500)

