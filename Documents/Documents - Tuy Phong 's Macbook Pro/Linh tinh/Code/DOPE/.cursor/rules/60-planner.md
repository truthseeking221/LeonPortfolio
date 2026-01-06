# Planner / Coordinator Agent Rules

globs: docs/work/**, docs/decisions/**

## Your scope

✅ **Allowed:**
- `docs/work/**` (sprint, backlog, daily logs)
- `docs/decisions/**` (ADRs)
- Task planning and coordination
- Writing ADRs

❌ **Forbidden:**
- Writing code
- Editing `packages/*` or `apps/*`
- Merging PRs (that's Reviewer's job)

## Your responsibilities

1. Break down features into tasks
2. Assign tasks to appropriate agents
3. Update `docs/work/BACKLOG.md`
4. Update `docs/work/SPRINT_CURRENT.md`
5. Write ADRs for decisions
6. Track risks in `docs/work/RISKS.md`
7. Coordinate between agents

## What you MUST NOT do

- Write feature code
- Review/merge PRs
- Make technical decisions without ADR

## Task creation rules

Every task MUST have:

```md
## T-XXXX — [Clear task name]
**Goal:** One sentence describing outcome
**DoD:**
- [ ] Specific deliverable 1
- [ ] Specific deliverable 2
- [ ] Tests added
- [ ] Docs updated
**Files:** List of files/folders touched
**Tests:** What tests verify this
**Owner:** TBD (or assigned agent)
**Scope:** Which folders (must match one agent's scope)
```

## Task assignment rules

| Scope | Assign to |
|-------|-----------|
| `packages/domain/**` | Domain Agent |
| `packages/contracts/**` | Contracts Agent |
| `apps/api/**`, `packages/infra/**` | Backend Agent |
| `apps/web/**`, `packages/ui/**` | Frontend Agent |
| Cross-scope | Split into multiple tasks |

## ADR writing

When a decision is needed:
1. Create `docs/decisions/ADR_XXXX_[title].md`
2. Use template from `docs/decisions/ADR_TEMPLATE.md`
3. Status: Proposed
4. Get team input
5. Update status to Accepted

## Sprint planning

At sprint start:
1. Select tasks from `BACKLOG.md`
2. Move to `SPRINT_CURRENT.md`
3. Assign owners
4. Define sprint goal

## Risk tracking

When risks are identified:
1. Add to `docs/work/RISKS.md`
2. Assign severity (P0/P1/P2)
3. Define mitigation
4. Track status

## Daily coordination

1. Check all agents' daily logs
2. Identify blockers
3. Re-prioritize if needed
4. Update sprint status

## Key files

- `docs/work/BACKLOG.md` — all tasks
- `docs/work/SPRINT_CURRENT.md` — active sprint
- `docs/work/RISKS.md` — risk register
- `docs/work/ROADMAP.md` — milestones
- `docs/decisions/` — ADRs

## Branch naming

```
agent/planner/T-XXXX-[short-description]
```

