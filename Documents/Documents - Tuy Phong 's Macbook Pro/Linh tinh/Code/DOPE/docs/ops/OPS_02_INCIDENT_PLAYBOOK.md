# OPS_02_INCIDENT_PLAYBOOK — Incidents (SEV), Kill Switch, Communications, Postmortems

## Goal
Respond to incidents without causing:
- money-state ambiguity
- duplicate trades
- reputational damage due to unclear comms

---

## 1) Severity levels

### SEV-0 (Catastrophic)
- confirmed duplicate executions possible
- widespread UNKNOWN states
- commit endpoint returning inconsistent trade_ids for same gesture_id

Action: immediate kill switch + freeze trading

### SEV-1 (High)
- provider outage preventing commits reliably
- WS down causing missing TRADE_UPDATEs
- DB errors causing Activity unavailable

Action: kill switch OR disable affected operations (buy/sell)

### SEV-2 (Medium)
- elevated latency
- partial degradation (prices stale)

Action: degrade UI + monitor; may pause trading if persists

### SEV-3 (Low)
- cosmetic issues
- minor UX regressions

Action: schedule fix

---

## 2) Incident triggers (examples)
- unknown_state_rate > 1% (15 min window)
- retry_exhaust_rate spikes
- activity endpoint 5xx > threshold
- provider errors > threshold
- duplicate detection heuristic fires (see below)

---

## 3) Immediate response (first 2 minutes)
1) Flip kill switch:
   - maintenance.trading_disabled=true
2) Confirm backend enforces it:
   - commits return MAINTENANCE_TRADING_DISABLED
3) Confirm UI reflects it:
   - banner "Trading paused"
4) Start a war-room log in today's daily file:
   - `docs/work/daily/YYYY-MM-DD.md`

---

## 4) Duplicate-trade suspicion detection (must implement signals)
Raise SEV-0 if:
- two distinct tx hashes recorded for same (user_id, gesture_id)
- or two confirmed trades share same gesture_id
- or reconciliation finds >1 confirmed buy for one gesture

---

## 5) Stabilization steps

### If provider/RPC outage
- keep kill switch on
- disable retries if they risk duplicates
- degrade browsing only mode

### If WS outage
- ensure polling via activity/trade status works
- ensure Activity refresh resolves pending/unknown

### If DB issues
- prioritize Activity availability
- if needed, deploy read-only fallback for Activity

---

## 6) User communications (Telegram)

### Short announcement template
"Trading is temporarily paused due to network/provider instability. Your funds remain in your wallet. We are reconciling pending transactions and will update shortly."

### Follow-up template
"Update: We resolved <issue>. Trading will resume after verification. If you had a pending trade, open Activity to see the final status."

---

## 7) Recovery procedure
1) Run reconciliation worker to settle pending/unknown
2) Verify unknown_state_rate returns to normal
3) Verify no duplicate signals
4) Disable kill switch:
   - maintenance.trading_disabled=false
5) Closely monitor for 30 minutes

---

## 8) Postmortem (within 24–48h)
Create:
- `docs/work/postmortems/YYYY-MM-DD_<sev>.md`

Template:
- Summary
- Timeline
- Root cause
- Impact
- What went well
- What failed
- Action items (with task IDs)
- Prevent recurrence (tests/alerts)

