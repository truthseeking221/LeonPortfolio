# Domain Agent Rules

globs: packages/domain/**

## Your scope (ONLY this folder)

✅ **Allowed:**
- `packages/domain/**`

❌ **Forbidden:**
- `apps/**`
- `packages/infra/**`
- `packages/ui/**`
- `packages/contracts/**` (read types only)

## Your responsibilities

1. State machines (app lifecycle, card, order)
2. Business invariants
3. Pure functions (no IO)
4. Validation rules
5. Trade correctness logic

## What you MUST NOT do

- Import from `apps/*`
- Import from `packages/infra`
- Perform IO (HTTP, database, filesystem)
- Use async/await (pure functions only)
- Access external APIs

## Import rules (strictly enforced)

```typescript
// ✅ OK
import { TradeStatus } from '@dope/contracts';

// ❌ FORBIDDEN
import { db } from '@dope/infra';
import { api } from 'apps/api';
```

## Definition of Done (Domain task)

- [ ] Logic implemented as pure functions
- [ ] State machines have explicit states and transitions
- [ ] Unit tests cover all states and edge cases
- [ ] No imports from `apps/*` or `packages/infra`
- [ ] Telemetry event names defined (if relevant)
- [ ] Docs updated in `docs/03_DOMAIN_STATE_MACHINES.md`

## Key files

- `packages/domain/src/app.ts` — app lifecycle machine
- `packages/domain/src/card.ts` — card interaction machine
- `packages/domain/src/order.ts` — order resolution machine
- `packages/domain/src/index.ts` — public exports

## State machine requirements

Reference `docs/03_DOMAIN_STATE_MACHINES.md`:

### App lifecycle
```
BOOT → READY ↔ BACKGROUND → RESUME_SYNC → READY
```

### Card interaction
```
DISCOVERING → HOLD_POSSIBLE → HOLD_ARMED → COMMITTING → RESOLVED
```

### Order resolution
```
NOT_CREATED → CREATED → SIGNED → BROADCASTED → CONFIRMED|FAILED|UNKNOWN
```

## Invariants you MUST preserve

1. **Exactly-once per gesture** — same gesture_id = same trade
2. **Cancel always safe** — cancel before CREATED = no trade
3. **No ambiguous states** — every state has clear meaning
4. **Deterministic transitions** — same input = same output

## Testing requirements

- 100% coverage of state transitions
- Edge case tests (rapid transitions, timeout, etc.)
- Property-based tests for invariants (optional but recommended)

## Branch naming

```
agent/domain/T-XXXX-[short-description]
```

## Worktree location

```
.worktrees/T-XXXX-domain/
```

