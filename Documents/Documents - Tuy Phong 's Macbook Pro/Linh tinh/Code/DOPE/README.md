# DOPE

> **Don't invest. Just swipe.**

DOPE is a swipe-first memecoin trading game: an infinite deck of coins where users swipe to discover, hold-to-buy, see an always-on PnL game HUD, and panic sell in one action.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Run tests
pnpm test

# Lint & typecheck
pnpm lint
pnpm typecheck
```

## Documentation

Start with [docs/00_INDEX.md](docs/00_INDEX.md) for navigation.

Key docs:
- [Product Manifest](docs/01_PRODUCT_MANIFEST.md) — locked decisions
- [Architecture Guardrails](docs/02_ARCH_GUARDRAILS.md) — no-spaghetti rules
- [Domain State Machines](docs/03_DOMAIN_STATE_MACHINES.md) — canonical behavior
- [Deploy Overview](docs/deploy/DEPLOY_00_OVERVIEW.md) — deployment guide

## For AI Agents

Read [AGENTS.md](AGENTS.md) before doing any work.

## Project Structure

```
/
├── docs/           # Source of truth documentation
├── apps/
│   ├── web/        # Telegram Mini App web UI
│   └── api/        # REST + WS + trade workers
├── packages/
│   ├── contracts/  # Shared types + API schemas
│   ├── domain/     # Pure domain logic (state machines)
│   ├── ui/         # UI primitives + design tokens
│   └── infra/      # HTTP clients, db, telemetry wrappers
└── infra/
    ├── docker/     # Local compose
    └── ci/         # CI workflow templates
```

## License

Proprietary. All rights reserved.

