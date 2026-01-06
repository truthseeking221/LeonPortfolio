# SPRINT_CURRENT — Active Work Plan (Only source for "what to build now")


## Sprint goal
Vertical Slice M0: Launch → Deck shows 1 card → Hold-to-buy (mock) → Activity row appears → Sell-all (mock).


## Active tasks (execute in order)

| ID | Task | Owner | Status | Scope | M0 Critical |
|----|------|-------|--------|-------|-------------|
| T-0001 | Repo scaffolding + guardrails | — | ✅ Done | infra | ✅ |
| T-0002 | Domain state machines v1 | **Domain Agent** | ✅ Done | `packages/domain` | ✅ |
| T-0003 | API skeleton + /health + /config | **Backend Agent** | ⏳ Pending | `apps/api` | ✅ |
| T-0004 | Web app boot + Telegram WebApp | **Frontend Agent** | ⏳ Pending | `apps/web` | ✅ |
| T-0005 | Activity ledger v0 (in-memory) | **Backend Agent** | ⏳ Pending | `apps/api` | ✅ |
| T-0010a | Kill switch backend | **Backend Agent** | ⏳ Pending | `apps/api` | ✅ |
| T-0010b | Kill switch frontend | **Frontend Agent** | ⏳ Pending | `apps/web` | ✅ |
| T-0012a | Sell-all backend | **Backend Agent** | ⏳ Pending | `apps/api` | ✅ |
| T-0012b | Sell-all frontend | **Frontend Agent** | ⏳ Pending | `apps/web` | ✅ |
| T-0019 | Positions endpoint | **Backend Agent** | ⏳ Pending | `apps/api` | ✅ |
| T-0020 | Telegram auth endpoint | **Backend Agent** | ⏳ Pending | `apps/api` | ✅ |


## M0 Exit Criteria Mapping
| Exit Criteria | Tasks Required |
|---------------|----------------|
| exactly-once per gesture proven | T-0002 ✅, T-0005 |
| UNKNOWN path implemented | T-0002 ✅ |
| kill switch works | T-0010a, T-0010b |
| Demo flow works | T-0003, T-0004, T-0005, T-0012a, T-0012b |


## Task Details

### T-0002 — Domain state machines v1 (DONE)
**Owner:** Domain Agent
**Completed:** 2026-01-06
**Deliverables:**
- ✅ Types in `packages/domain/src/types.ts` (branded IDs, states, events, contexts)
- ✅ App lifecycle machine in `app.ts` (BOOT → READY ↔ BACKGROUND → RESUME_SYNC)
- ✅ Card interaction machine in `card.ts` (gesture disambiguation, HOLD_POSSIBLE → HOLD_ARMED)
- ✅ Order resolution machine in `order.ts` (NOT_CREATED → BROADCASTED → terminal states)
- ✅ Balance validation in `balance.ts` (gas reserve, spendable balance, panic sell check)
- ✅ Unit tests for all modules (app.test.ts, card.test.ts, order.test.ts, balance.test.ts)
**PRD Invariants Enforced:**
1. Exactly-once per gesture_id
2. Cancel always safe (before broadcast)
3. No ambiguous money state
4. Gas reserve for panic sell

### T-0003 — API skeleton + /health + /config
**Owner:** Backend Agent  
**Dependencies:** T-0001 ✅
**Blocked by:** None (hosting decided: Fly.io per ADR-0001)

### T-0004 — Web app boot + Telegram WebApp
**Owner:** Frontend Agent
**Dependencies:** T-0001 ✅
**Blocked by:** None

### T-0005 — Activity ledger v0
**Owner:** Backend Agent
**Dependencies:** T-0003
**Blocked by:** None (DB decided: Neon per ADR-0001)

### T-0010a — Kill switch backend
**Owner:** Backend Agent
**Dependencies:** T-0003
**Goal:** maintenance.trading_disabled in config, backend rejects commits when disabled

### T-0010b — Kill switch frontend
**Owner:** Frontend Agent
**Dependencies:** T-0004, T-0010a
**Goal:** Frontend shows banner + disables buy/sell buttons when trading disabled

### T-0012a — Sell-all backend
**Owner:** Backend Agent
**Dependencies:** T-0003
**Goal:** POST /v1/trades/sell-all endpoint (mock for M0)

### T-0012b — Sell-all frontend
**Owner:** Frontend Agent
**Dependencies:** T-0004, T-0012a
**Goal:** Sell-all button on holding card with progress states

### T-0019 — Positions endpoint
**Owner:** Backend Agent
**Dependencies:** T-0003, T-0005
**Goal:** GET /v1/positions for holding card PnL display

### T-0020 — Telegram auth endpoint
**Owner:** Backend Agent
**Dependencies:** T-0003
**Goal:** POST /v1/auth/telegram for session management


## Definition of Done (Sprint)
- Demo script runs end-to-end on staging.
- No ambiguous states in UI for the demo flows.
- Daily handoff logs exist for each day of work.


## Completed tasks
- [x] T-0001 Repo scaffolding + guardrails (2026-01-06)
  - Docs system + agent workflow
  - Deploy runbooks (web/api/db)
  - CI templates + kill switch plan
  - GitHub Actions workflows deployed

- [x] T-0002 Domain state machines v1 (2026-01-06)
  - App lifecycle machine (BOOT → READY → BACKGROUND → RESUME_SYNC)
  - Card interaction machine with gesture disambiguation
  - Order resolution machine (exactly-once guarantee)
  - Balance validation module (gas reserve for panic sell)
  - Full unit test coverage


## Blocked tasks
(none — all blocking decisions resolved via ADR-0001)


## Decisions Log
- **2026-01-06:** Hosting = Fly.io, DB = Neon (ADR-0001 accepted)


## Notes
- M0 is about proving the critical path works
- Mock providers are OK for M0
- Kill switch must work even in M0

## Execution Order (parallel where possible)

```
Phase 1 (DONE):
  T-0001 ✅ → T-0002 ✅

Phase 2 (NOW - parallel):
  Backend Agent: T-0003 → T-0020 → T-0005 → T-0019 → T-0010a → T-0012a
  Frontend Agent: T-0004 (can start now, parallel with backend)

Phase 3 (after Phase 2):
  Frontend Agent: T-0010b, T-0012b (needs backend endpoints ready)
```

## Agent Assignment Summary
| Agent | Tasks | Count |
|-------|-------|-------|
| Backend Agent | T-0003, T-0005, T-0010a, T-0012a, T-0019, T-0020 | 6 |
| Frontend Agent | T-0004, T-0010b, T-0012b | 3 |
| Domain Agent | (M0 complete) | 0 |

## M0 Endpoint Checklist
| Endpoint | Task | Status |
|----------|------|--------|
| GET /v1/health | T-0003 | ⏳ |
| GET /v1/config | T-0003 | ⏳ |
| POST /v1/auth/telegram | T-0020 | ⏳ |
| GET /v1/activity | T-0005 | ⏳ |
| GET /v1/positions | T-0019 | ⏳ |
| POST /v1/trades/sell-all | T-0012a | ⏳ |

