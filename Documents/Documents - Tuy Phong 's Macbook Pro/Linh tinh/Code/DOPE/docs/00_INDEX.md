# 00_INDEX — DOPE Canon + Reading Order


## Read order (always)
1) 01_PRODUCT_MANIFEST.md
2) 02_ARCH_GUARDRAILS.md
3) 03_DOMAIN_STATE_MACHINES.md
4) 04_API_CONTRACTS.md
5) deploy/DEPLOY_00_OVERVIEW.md
6) work/SPRINT_CURRENT.md
7) latest work/daily/YYYY-MM-DD.md


## Canon (source of truth)
- Product decisions: 01_PRODUCT_MANIFEST.md
- Correctness: 03_DOMAIN_STATE_MACHINES.md
- API behavior: 04_API_CONTRACTS.md + 05_ERROR_CODES.md
- Security model: 07_SECURITY_MODEL.md
- Deploy procedure: docs/deploy/*
- Active work: work/SPRINT_CURRENT.md


## Quick links

### Core docs
- [App Overview](00_APP_OVERVIEW.md) — what DOPE is
- [Product Manifest](01_PRODUCT_MANIFEST.md) — locked decisions
- [Architecture Guardrails](02_ARCH_GUARDRAILS.md) — no-spaghetti law
- [Domain State Machines](03_DOMAIN_STATE_MACHINES.md) — canonical behavior
- [API Contracts](04_API_CONTRACTS.md) — endpoint specs
- [Error Codes](05_ERROR_CODES.md) — error taxonomy
- [Telemetry Events](06_TELEMETRY_EVENTS.md) — event catalog
- [Security Model](07_SECURITY_MODEL.md) — threats + mitigations
- [Perf Budgets](08_PERF_BUDGETS.md) — fps targets

### Work management
- [Roadmap](work/ROADMAP.md) — milestones M0–M3
- [Backlog](work/BACKLOG.md) — all tasks
- [Sprint Current](work/SPRINT_CURRENT.md) — active work
- [Risks](work/RISKS.md) — live risk register
- [Daily logs](work/daily/) — handoff logs

### Deployment
- [Deploy Overview](deploy/DEPLOY_00_OVERVIEW.md)
- [Frontend](deploy/DEPLOY_01_FRONTEND_WEBAPP.md)
- [Backend](deploy/DEPLOY_02_BACKEND_API_WS.md)
- [Database](deploy/DEPLOY_03_DB_MIGRATIONS.md)
- [Telegram Bot](deploy/DEPLOY_04_TELEGRAM_BOT_SETUP.md)
- [TON Connect](deploy/DEPLOY_05_TON_CONNECT_MANIFEST.md)
- [Rollback & Kill Switch](deploy/DEPLOY_06_ROLLBACK_KILL_SWITCH.md)

### Operations
- [Ops Runbooks](ops/OPS_01_OPERATIONS.md)
- [Incident Playbook](ops/OPS_02_INCIDENT_PLAYBOOK.md)
- [Support & Disputes](ops/OPS_03_SUPPORT_DISPUTES.md)

### Decisions
- [ADR Template](decisions/ADR_TEMPLATE.md)
- [ADR-0001 Tech Stack](decisions/ADR_0001_TECH_STACK.md)

