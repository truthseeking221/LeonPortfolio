# AGENTS.md — Operating Rules for Claude Code / Codex Agents


## 0) Prime directive
Do not lose context, do not invent requirements, do not create spaghetti code.


## 1) Before doing anything (required)
1. Read `docs/00_INDEX.md`
2. Read `docs/01_PRODUCT_MANIFEST.md`
3. Read `docs/work/SPRINT_CURRENT.md`
4. Read the latest file in `docs/work/daily/` (today-1 if continuing)
5. Read your agent-specific rules in `.cursor/rules/`
6. If a decision is missing, write an ADR in `docs/decisions/`


## 2) Task claiming (required before ANY code)
- Find your task in `docs/work/SPRINT_CURRENT.md`
- Verify it shows YOUR agent as Owner
- Verify the Scope matches your allowed folders
- If unclaimed or assigned to another agent → **STOP**


## 3) Agent roles and scopes (hard boundaries)

| Agent | Allowed Folders | Rules File |
|-------|-----------------|------------|
| **Domain** | `packages/domain/**` | `.cursor/rules/30-domain.md` |
| **Contracts** | `packages/contracts/**` | `.cursor/rules/40-contracts.md` |
| **Backend** | `apps/api/**`, `packages/infra/**` | `.cursor/rules/20-backend.md` |
| **Frontend** | `apps/web/**`, `packages/ui/**` | `.cursor/rules/10-frontend.md` |
| **Reviewer** | merges only, no features | `.cursor/rules/50-reviewer.md` |
| **Planner** | `docs/work/**`, `docs/decisions/**` | `.cursor/rules/60-planner.md` |

**Rule: If a task touches 2 scopes, split it into 2 tasks.**


## 4) No spaghetti: architecture guardrails (required)
```
packages/domain → packages/contracts → packages/infra → apps/*
```

- Domain rules live in `packages/domain` only (NO IO)
- API schema/types live in `packages/contracts`
- Apps/web may not implement business rules beyond UI state
- Any cross-cutting concern goes through `packages/infra` wrappers


## 5) Hard anti-collision rules (NEVER violate)
- [ ] **No two agents edit the same scope at the same time**
- [ ] **No direct commits to `main` or `staging`**
- [ ] **No PR that touches >3 modules without an ADR**
- [ ] **One task = one PR**
- [ ] **PR must list: files touched, tests run, DoD checklist**
- [ ] **No editing files another agent is working on**


## 6) Branch + worktree discipline

### Branch naming
```
agent/<role>/T-<id>-<short-description>
```

Examples:
- `agent/fe/T-0007-hold-gesture`
- `agent/be/T-0008-trade-commit`
- `agent/domain/T-0002-state-machines`

### Worktree setup (for parallel agents)
```bash
# Create worktree for a task
git worktree add .worktrees/T-0007-fe -b agent/fe/T-0007-hold-gesture

# Each agent opens their worktree folder in separate Cursor window
# This prevents file conflicts entirely
```

### Worktree location
```
.worktrees/T-<id>-<role>/
```


## 7) Interface-first sequencing (reduces conflicts)

Execute in this order to minimize cross-agent blocking:

1. **Contracts Agent** updates `packages/contracts` + `docs/04_API_CONTRACTS.md`
2. **Domain Agent** implements state machines using those types
3. **Backend Agent** implements endpoints using contracts + domain
4. **Frontend Agent** consumes contracts and calls backend
5. **Reviewer** verifies invariants and merges


## 8) End-of-day handoff (required)
At the end of each work session:
1. Update `docs/work/daily/YYYY-MM-DD.md` using HANDOFF_TEMPLATE
2. Update `docs/work/SPRINT_CURRENT.md`:
   - mark tasks done, add PR/commit references
   - note blocked tasks
3. If new decisions were made, add ADRs
4. Push your branch
5. Open PR if task is complete


## 9) Hard stops (required)
If any of the below occurs, **STOP and log immediately** in `docs/work/RISKS.md`:
- Ambiguous money state detected
- Duplicate trade possibility
- Gesture ambiguity causes accidental buy
- Token/media pipeline unsafe
- Deploy step cannot be reproduced deterministically
- Another agent is editing your scope


## 10) Merge gate (single integrator)

Only the **Reviewer/Integrator** agent merges PRs:
1. All other agents open PRs and stop at "Ready for review"
2. Reviewer runs: tests, lint, typecheck, smoke test
3. Reviewer checks: docs updated, DoD complete
4. Reviewer merges in correct order (contracts → domain → backend → frontend)


## 11) Daily continuity checklist

Any agent starting a new day:
1. ✅ Read `docs/00_INDEX.md`
2. ✅ Read `docs/01_PRODUCT_MANIFEST.md`
3. ✅ Read `docs/work/SPRINT_CURRENT.md`
4. ✅ Read yesterday's `docs/work/daily/` log
5. ✅ Check if your task is still assigned to you
6. ✅ Pull latest from `staging`
7. ✅ Continue from where you left off


## 12) Quick reference: what goes where

| Thing | Location |
|-------|----------|
| Business rules | `packages/domain` |
| Shared types | `packages/contracts` |
| Zod schemas | `packages/contracts` |
| DB/HTTP clients | `packages/infra` |
| API endpoints | `apps/api` |
| UI components | `apps/web`, `packages/ui` |
| State machines | `packages/domain` |
| Error codes | `docs/05_ERROR_CODES.md` |
| API specs | `docs/04_API_CONTRACTS.md` |
