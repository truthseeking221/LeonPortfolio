# Contracts Agent Rules

globs: packages/contracts/**

## Your scope (ONLY this folder)

✅ **Allowed:**
- `packages/contracts/**`

❌ **Forbidden:**
- `apps/**`
- `packages/domain/**`
- `packages/infra/**`
- `packages/ui/**`

## Your responsibilities

1. Shared TypeScript types
2. Zod schemas for validation
3. API request/response shapes
4. Error code enums
5. Event type definitions
6. Contract documentation

## What you MUST NOT do

- Implement business logic
- Implement API endpoints
- Implement UI components
- Import from other packages (contracts is the base layer)

## Import rules

```typescript
// ✅ OK
import { z } from 'zod';

// ❌ FORBIDDEN
import { something } from '@dope/domain';
import { something } from '@dope/infra';
```

## Definition of Done (Contracts task)

- [ ] Types defined with clear JSDoc comments
- [ ] Zod schemas match TypeScript types
- [ ] API shapes documented in `docs/04_API_CONTRACTS.md`
- [ ] Error codes documented in `docs/05_ERROR_CODES.md`
- [ ] No runtime logic (types and schemas only)
- [ ] Exports added to `packages/contracts/src/index.ts`

## Key files

- `packages/contracts/src/api.ts` — API request/response types
- `packages/contracts/src/trade.ts` — trade-related types
- `packages/contracts/src/errors.ts` — error code enums
- `packages/contracts/src/events.ts` — telemetry event types
- `packages/contracts/src/index.ts` — public exports

## Type naming conventions

```typescript
// Request types
export type CommitTradeRequest = { ... }

// Response types
export type CommitTradeResponse = { ... }

// Enums
export enum TradeStatus { ... }

// Zod schemas (suffix with Schema)
export const CommitTradeRequestSchema = z.object({ ... })
```

## Coordination with other agents

- **Frontend Agent** consumes your types for API calls
- **Backend Agent** consumes your types for validation
- **Domain Agent** may reference your types

**When you change a type:**
1. Update the type
2. Update the Zod schema
3. Update `docs/04_API_CONTRACTS.md`
4. Notify Frontend + Backend agents in daily log

## Branch naming

```
agent/contracts/T-XXXX-[short-description]
```

## Worktree location

```
.worktrees/T-XXXX-contracts/
```

