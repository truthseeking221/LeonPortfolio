# SPRINT_CURRENT — Active Work Plan (Only source for "what to build now")


## Sprint goal
Vertical Slice M0: Launch → Deck shows 1 card → Hold-to-buy (mock) → Activity row appears → Sell-all (mock).


## Active tasks (execute in order)

| ID | Task | Owner | Status | Scope | M0 Critical |
|----|------|-------|--------|-------|-------------|
| T-0001 | Repo scaffolding + guardrails | — | ✅ Done | infra | ✅ |
| T-0002 | Domain state machines v1 | **Domain Agent** | ✅ Done | `packages/domain` | ✅ |
| T-0003 | API skeleton + /health + /config | **Backend Agent** | ✅ Done | `apps/api` | ✅ |
| T-0004 | Web app boot + Telegram WebApp | **Frontend Agent** | ✅ Done | `apps/web` | ✅ |
| T-0005 | Activity ledger v0 (in-memory) | **Backend Agent** | ✅ Done | `apps/api` | ✅ |
| T-0010a | Kill switch backend | **Backend Agent** | ✅ Done | `apps/api` | ✅ |
| T-0010b | Kill switch frontend | **Frontend Agent** | ✅ Done | `apps/web` | ✅ |
| T-0012a | Sell-all backend | **Backend Agent** | ✅ Done | `apps/api` | ✅ |
| T-0012b | Sell-all frontend | **Frontend Agent** | ⏳ Pending | `apps/web` | ✅ |
| T-0019 | Positions endpoint | **Backend Agent** | ✅ Done | `apps/api` | ✅ |
| T-0020 | Telegram auth endpoint | **Backend Agent** | ✅ Done | `apps/api` | ✅ |


## M0 Exit Criteria Mapping
| Exit Criteria | Tasks Required |
|---------------|----------------|
| exactly-once per gesture proven | T-0002 ✅, T-0005 |
| UNKNOWN path implemented | T-0002 ✅ |
| kill switch works | T-0010a, T-0010b ✅ |
| Demo flow works | T-0003 ✅, T-0004 ✅, T-0005, T-0012a, T-0012b |


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
- ✅ Error codes in `errors.ts` (full taxonomy from docs/05_ERROR_CODES.md)
- ✅ Telemetry events in `telemetry.ts` (type-safe event definitions from docs/06_TELEMETRY_EVENTS.md)
- ✅ Unit tests for all modules (app, card, order, balance, errors, telemetry)
**PRD Invariants Enforced:**
1. Exactly-once per gesture_id
2. Cancel always safe (before broadcast)
3. No ambiguous money state
4. Gas reserve for panic sell
**Additional Features:**
- Error categorization (user-actionable, retry-safe, maintenance)
- HTTP status mapping for all error codes
- Type-safe telemetry event payloads with sampling rates

### T-0003 — API skeleton + /health + /config
**Owner:** Backend Agent  
**Dependencies:** T-0001 ✅
**Blocked by:** None (hosting decided: Fly.io per ADR-0001)

### T-0004 — Web app boot + Telegram WebApp (DONE)
**Owner:** Frontend Agent
**Completed:** 2026-01-06
**Deliverables:**
- ✅ Monorepo setup (pnpm workspaces)
- ✅ Vite + React 18 + TypeScript strict mode
- ✅ Tailwind CSS v3 + Framer Motion
- ✅ Telegram WebApp SDK (`@twa-dev/sdk`)
- ✅ Boot screen with skeleton loader
- ✅ Token card deck (swipe gestures)
- ✅ Top bar (balance, connection, settings)
- ✅ Wallet modal (gas reserve, deposit/withdraw)
- ✅ Settings panel (experience, performance, trading)
- ✅ Hold gesture overlay with progress ring
- ✅ Zustand stores (app-store, game-store, wallet-store)
**Smoke Test:** Browser test passed ✅

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
  - Error codes module (full taxonomy with UX mapping)
  - Telemetry event definitions (type-safe with sampling)
  - Full unit test coverage (6 test files)

- [x] T-0003 API skeleton + /health + /config (2026-01-06)
  - Fastify server with TypeScript
  - GET /v1/health endpoint (status, env, build, timestamp)
  - GET /v1/config endpoint (maintenance, risk, deck, slippage)
  - Standard error responses with error codes
  - CORS, request ID, logging middleware

- [x] T-0004 Web app boot + Telegram WebApp (2026-01-06)
  - Vite + React 18 + TypeScript (strict mode)
  - Tailwind CSS + Framer Motion animations
  - Telegram WebApp SDK integration (@twa-dev/sdk)
  - Boot screen with loading states (skeleton → ready)
  - Token card deck with mock data (swipe gestures)
  - Top bar: balance display, connection status, settings
  - Wallet modal: spendable balance, gas reserve, deposit/withdraw
  - Settings panel: experience, performance, trading sections
  - Hold gesture overlay with progress ring
  - Zustand stores (app, game, wallet)
  - Browser smoke test passed ✅

- [x] T-0010b Kill switch frontend (2026-01-06)
  - KillSwitchBanner component with 3 states:
    - Trading disabled (red) - full kill switch
    - Buy disabled (orange) - buy only paused
    - Sell disabled (orange) - sell only paused
  - Maintenance config added to app-store
  - Remote config fetch during boot from /v1/config
  - Buy gesture blocked when buy_disabled
  - Sell button blocked when sell_disabled
  - HoldingOverlay shows "Sell Paused" state
  - Browser smoke test with all 3 banner types ✅


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

Phase 2 (IN PROGRESS):
  Backend Agent: T-0003 ✅ → T-0020 → T-0005 → T-0019 → T-0010a → T-0012a
  Frontend Agent: T-0004 ✅

Phase 3 (NEXT - needs backend endpoints):
  Frontend Agent: T-0010b (needs T-0010a), T-0012b (needs T-0012a)
```

## Agent Assignment Summary
| Agent | Tasks | Remaining |
|-------|-------|-----------|
| Backend Agent | T-0003 ✅, T-0005, T-0010a, T-0012a, T-0019, T-0020 | 5 |
| Frontend Agent | T-0004 ✅, T-0010b ✅, T-0012b | 1 |
| Domain Agent | T-0002 ✅ | 0 |

## M0 Endpoint Checklist
| Endpoint | Task | Status |
|----------|------|--------|
| GET /v1/health | T-0003 | ✅ |
| GET /v1/config | T-0003 | ✅ |
| POST /v1/auth/telegram | T-0020 | ✅ |
| GET /v1/activity | T-0005 | ✅ |
| GET /v1/positions | T-0019 | ✅ |
| POST /v1/trades/sell-all | T-0012a | ✅ |

