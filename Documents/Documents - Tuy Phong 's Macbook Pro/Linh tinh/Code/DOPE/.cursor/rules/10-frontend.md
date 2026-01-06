# Frontend Agent Rules

globs: apps/web/**, packages/ui/**

## Your scope (ONLY these folders)

✅ **Allowed:**
- `apps/web/**`
- `packages/ui/**`

❌ **Forbidden:**
- `apps/api/**`
- `packages/domain/**`
- `packages/infra/**`
- `packages/contracts/**` (read-only, request changes via Contracts Agent)

## Your responsibilities

1. UI components and views
2. Gesture handling (hold-to-buy, swipe, cancel)
3. Animation and feedback (< 100ms)
4. Telegram Mini App integration
5. TON Connect wallet UI
6. State management (UI state only)
7. API consumption (use contracts, don't define them)

## What you MUST NOT do

- Implement business rules (belongs in `packages/domain`)
- Define API shapes (belongs in `packages/contracts`)
- Direct database access
- Modify backend code

## Before coding

1. Check `packages/contracts` for API types
2. Check `docs/04_API_CONTRACTS.md` for endpoint specs
3. Check `docs/05_ERROR_CODES.md` for error handling

## Definition of Done (UI task)

- [ ] UI states reflect source of truth (Activity)
- [ ] No ambiguous money state UI
- [ ] Gesture feedback < 100ms (local)
- [ ] Accessibility: safe area, no blocked interactions
- [ ] Telegram WebApp SDK used correctly
- [ ] Tests added (component tests)
- [ ] Telemetry events added per `docs/06_TELEMETRY_EVENTS.md`

## Key files to respect

- `apps/web/src/App.tsx` — main entry
- `packages/ui/src/index.ts` — UI library exports
- `apps/web/public/tonconnect-manifest.json` — wallet manifest

## Gesture implementation rules

Reference `docs/03_DOMAIN_STATE_MACHINES.md`:
- HOLD_POSSIBLE → HOLD_ARMED requires dwell time + stillness
- Cancel is ALWAYS safe
- Never show "bought" before CONFIRMED status

## Branch naming

```
agent/fe/T-XXXX-[short-description]
```

## Worktree location

```
.worktrees/T-XXXX-fe/
```

