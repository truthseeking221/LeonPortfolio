# Contributing to DOPE

## For Humans & AI Agents

### Before You Start
1. Read [AGENTS.md](AGENTS.md) — operating rules
2. Read [docs/00_INDEX.md](docs/00_INDEX.md) — doc navigation
3. Read [docs/02_ARCH_GUARDRAILS.md](docs/02_ARCH_GUARDRAILS.md) — no-spaghetti law

### Development Workflow

1. **Pick a task** from `docs/work/SPRINT_CURRENT.md`
2. **Create a branch** from `staging`
3. **Implement** following architecture guardrails
4. **Test** — unit tests for domain, integration tests for API
5. **Update docs** — API contracts, error codes, telemetry events
6. **Create PR** — reference task ID
7. **Update daily log** — `docs/work/daily/YYYY-MM-DD.md`

### Code Style

- Use TypeScript strict mode
- Follow ESLint + Prettier config
- No `any` types without justification
- Document public APIs

### Architecture Rules

```
packages/domain  → packages/contracts → packages/infra → apps/*
```

- `packages/domain` — pure functions, state machines, NO IO
- `packages/contracts` — shared types, zod schemas
- `packages/infra` — db, http, telemetry adapters
- `apps/web` — UI only, no business rules
- `apps/api` — REST + WS endpoints

### PR Checklist

- [ ] Task ID in title
- [ ] Tests pass (`pnpm test`)
- [ ] Lint passes (`pnpm lint`)
- [ ] Types pass (`pnpm typecheck`)
- [ ] No secrets in code
- [ ] Docs updated if API/behavior changed
- [ ] Daily log updated

### Commit Messages

Format: `[T-XXXX] <type>: <description>`

Types:
- `feat` — new feature
- `fix` — bug fix
- `refactor` — code restructure
- `docs` — documentation only
- `test` — tests only
- `chore` — maintenance

Example: `[T-0002] feat: implement card state machine`

