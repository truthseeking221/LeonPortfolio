# 02_ARCH_GUARDRAILS — No Spaghetti Law


## Layering (one-way)

```
packages/domain → packages/contracts → packages/infra → apps/*
```

**Rule: domain MUST NOT import infra or apps.**


## What belongs where

### packages/domain
- State machines
- Invariants
- Pure functions (no IO)
- Business rules

### packages/contracts
- Shared types
- Zod schemas
- API request/response shapes
- Error code enums

### packages/infra
- DB clients
- HTTP clients
- Telemetry emitter
- Adapters (wallet/swap/price) interfaces

### apps/web
- UI components
- View models
- Invokes domain machines and API calls
- NO business rules beyond UI state

### apps/api
- REST + WS endpoints
- Trade ledger
- Idempotency enforcement
- Reconciliation worker


## PR rules

1. **No PR touches more than 3 modules** unless ADR exists
2. **Any new dependency across layers** requires ADR
3. **Any feature must include:**
   - Tests for domain rules
   - Telemetry events implemented
   - Error mapping


## Import rules (enforced)

```typescript
// ✅ OK
// packages/domain/src/card.ts
import { CardState } from '@dope/contracts';

// ❌ FORBIDDEN
// packages/domain/src/card.ts
import { db } from '@dope/infra';       // NO IO in domain
import { CardView } from '@dope/web';   // NO app imports
```


## Testing rules

- `packages/domain` — unit tests only, 100% pure
- `packages/infra` — integration tests with mocks
- `apps/api` — integration tests, can hit test DB
- `apps/web` — component tests + E2E smoke


## File naming

- `*.ts` — code
- `*.test.ts` — tests
- `*.d.ts` — type declarations only
- `index.ts` — public exports only

