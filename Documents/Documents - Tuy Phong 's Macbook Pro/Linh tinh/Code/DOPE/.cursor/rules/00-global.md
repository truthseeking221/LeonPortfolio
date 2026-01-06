# Global Rules — All Agents

## Before ANY work

1. Read `docs/00_INDEX.md`
2. Read `docs/01_PRODUCT_MANIFEST.md`
3. Read `docs/work/SPRINT_CURRENT.md`
4. Read the latest file in `docs/work/daily/`
5. Check if your task is **claimed** — if not, claim it first

## Task claiming (required)

Before editing ANY code:
1. Find your task in `docs/work/SPRINT_CURRENT.md`
2. Verify it shows YOUR agent as Owner
3. Verify the Scope matches your allowed folders
4. If unclaimed, add claim block:

```md
### T-XXXX — [Task name]
Owner: Agent-[ROLE]
Scope: [folders]
Branch: agent/[role]/T-XXXX-[short]
Status: In Progress
```

**If task is claimed by another agent → STOP. Do not touch it.**

## Hard boundaries (NEVER violate)

- **NO direct commits to `main` or `staging`**
- **NO PR that touches >3 modules without an ADR**
- **One task = One PR**
- **NO editing files outside your scope**
- **NO editing files another agent is working on**

## Architecture law (always enforce)

```
packages/domain → packages/contracts → packages/infra → apps/*
```

- `packages/domain` MUST NOT import from `apps/*` or `packages/infra`
- Business rules belong ONLY in `packages/domain`
- UI components ONLY in `apps/web` or `packages/ui`

## End of session (required)

1. Update `docs/work/daily/YYYY-MM-DD.md`
2. Update task status in `docs/work/SPRINT_CURRENT.md`
3. Push branch
4. Open PR if task is complete

## Hard stops

If ANY of these occur, STOP immediately and log in `docs/work/RISKS.md`:
- Ambiguous money state detected
- Duplicate trade possibility
- Gesture ambiguity causes accidental buy
- Token/media pipeline unsafe
- Deploy step cannot be reproduced

## Non-negotiable invariants

1. **Exactly-once trade per gesture_id**
2. **Cancel always safe**
3. **No ambiguous money state**
4. **No silent UI** (feedback < 100ms)
5. **Always-sellable constraint**

