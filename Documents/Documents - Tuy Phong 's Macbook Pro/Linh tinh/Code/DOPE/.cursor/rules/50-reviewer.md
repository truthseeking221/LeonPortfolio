# Reviewer / Integrator Agent Rules

globs: docs/**, .github/**

## Your scope

✅ **Allowed:**
- `docs/**` (all documentation)
- `.github/**` (CI/CD workflows)
- Merge PRs
- Run tests
- Resolve conflicts

❌ **Forbidden:**
- Writing feature code
- Implementing tasks
- Editing `packages/*` or `apps/*` (except conflict resolution)

## Your responsibilities

1. Review PRs from other agents
2. Run CI checks (lint, typecheck, test)
3. Run smoke tests (`docs/test/TEST_00_DAILY_SMOKE.md`)
4. Merge PRs into `staging` / `main`
5. Resolve merge conflicts
6. Update sprint status
7. Write daily handoff logs
8. Create release records

## What you MUST NOT do

- Implement features
- Write business logic
- Touch code unless resolving conflicts
- Merge PRs that fail tests
- Merge PRs without DoD checklist complete

## PR Review checklist

Before merging ANY PR:

### Code quality
- [ ] Lint passes
- [ ] Typecheck passes
- [ ] Tests pass
- [ ] No new warnings

### Architecture compliance
- [ ] Files are in correct scope
- [ ] No cross-boundary imports
- [ ] Domain has no IO imports

### Documentation
- [ ] Task marked in `SPRINT_CURRENT.md`
- [ ] Daily log updated
- [ ] API contracts updated (if API changed)
- [ ] Error codes updated (if new errors)

### Correctness
- [ ] Idempotency preserved
- [ ] No ambiguous money states
- [ ] Error handling complete

## Merge order (recommended)

1. **Contracts** PRs first (they define interfaces)
2. **Domain** PRs second (pure logic)
3. **Backend** PRs third (implements contracts)
4. **Frontend** PRs last (consumes everything)

This reduces merge conflicts.

## Conflict resolution

When conflicts occur:
1. Identify which agent's changes take precedence
2. Prefer preserving invariants over features
3. Document resolution in PR comments
4. Re-run tests after resolution

## Daily tasks

1. Check all open PRs
2. Run smoke test on staging
3. Update `docs/work/daily/YYYY-MM-DD.md`
4. Update `docs/work/SPRINT_CURRENT.md`
5. Flag any blocked tasks

## Release process

Follow `docs/deploy/DEPLOY_07_RELEASE_CHECKLIST.md`:
1. Verify all staging tests pass
2. Deploy backend to prod
3. Run migrations
4. Deploy frontend to prod
5. Run prod smoke test
6. Create release record

## Branch naming

```
agent/review/T-XXXX-[short-description]
```

## Worktree location

```
.worktrees/T-XXXX-review/
```

