# Backend Agent Rules

globs: apps/api/**, packages/infra/**

## Your scope (ONLY these folders)

✅ **Allowed:**
- `apps/api/**`
- `packages/infra/**`

❌ **Forbidden:**
- `apps/web/**`
- `packages/ui/**`
- `packages/domain/**` (import only, don't modify)
- `packages/contracts/**` (read-only, request changes via Contracts Agent)

## Your responsibilities

1. REST API endpoints
2. WebSocket server (trade updates, prices)
3. Database access and migrations
4. Telegram initData verification
5. Trade commit + idempotency
6. Reconciliation worker
7. Kill switch enforcement
8. Rate limiting
9. CORS configuration

## What you MUST NOT do

- Implement business rules (import from `packages/domain`)
- Define shared types (belongs in `packages/contracts`)
- Touch frontend code
- Create UI components

## Before coding

1. Check `packages/contracts` for request/response types
2. Check `docs/04_API_CONTRACTS.md` for endpoint specs
3. Check `docs/05_ERROR_CODES.md` for error codes to return
4. Import business logic from `packages/domain`

## Definition of Done (API task)

- [ ] Endpoint implemented per `docs/04_API_CONTRACTS.md`
- [ ] Error codes mapped per `docs/05_ERROR_CODES.md`
- [ ] Idempotency enforced (gesture_id)
- [ ] Auth rules enforced
- [ ] CORS allows only known origins
- [ ] Integration test or curl script added
- [ ] Logs include: trade_id, user_id, gesture_id
- [ ] Kill switch check on commit endpoints

## Key files to respect

- `apps/api/src/server.ts` — main entry
- `apps/api/src/routes/` — endpoint definitions
- `apps/api/src/ws/` — WebSocket handlers
- `apps/api/migrations/` — DB migrations
- `packages/infra/src/` — adapters (db, http, telemetry)

## Idempotency rules (critical)

- `gesture_id` is the idempotency key for commits
- On duplicate gesture_id: return existing trade, HTTP 409
- NEVER create two trades for same gesture_id

## Kill switch enforcement

Every commit endpoint MUST check:
1. `HARD_KILL_TRADING` env var
2. `maintenance.trading_disabled` config

Return `MAINTENANCE_TRADING_DISABLED` if either is true.

## Branch naming

```
agent/be/T-XXXX-[short-description]
```

## Worktree location

```
.worktrees/T-XXXX-be/
```

