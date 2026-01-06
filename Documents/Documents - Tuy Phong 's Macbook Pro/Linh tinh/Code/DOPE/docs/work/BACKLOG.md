# BACKLOG — Master Task Ledger


## Conventions
- Task IDs: T-0001, T-0002...
- Each task: Goal, DoD, Files, Tests, Owner.
- Only tasks linked from SPRINT_CURRENT are "active".


---


## T-0001 — Repo scaffolding + guardrails ✅ COMPLETED
**Goal:** Create docs + code structure, linting, CI skeleton.
**DoD:**
- [x] folders exist as per repo layout
- [x] AGENTS.md present
- [x] 00_INDEX present
- [x] ARCH_GUARDRAILS present
- [x] CI runs typecheck + lint
**Files:** README.md, AGENTS.md, docs/*, infra/ci/*
**Tests:** CI green
**Owner:** —
**Completed:** 2026-01-06


## T-0002 — Domain state machines v1 ✅ COMPLETED
**Goal:** Implement core state machines in packages/domain.
**DoD:**
- [x] App lifecycle machine (BOOT → READY → BACKGROUND → RESUME)
- [x] Card interaction machine (DISCOVERING → HOLD_ARMED → COMMITTING)
- [x] Order resolution machine (NOT_CREATED → CONFIRMED/FAILED/UNKNOWN)
- [x] Balance validation (gas reserve for panic sell)
- [x] Unit tests for all transitions
- [x] No IO imports
**Files:** packages/domain/src/*.ts
**Tests:** Unit tests cover all states and transitions
**Owner:** Domain Agent
**Scope:** `packages/domain/**`
**Completed:** 2026-01-06
**PRD Invariants Enforced:**
1. Exactly-once per gesture_id
2. Cancel always safe (before broadcast)
3. No ambiguous money state
4. Gas reserve for panic sell


## T-0003 — API skeleton + /health + /config
**Goal:** Basic Fastify server with health and config endpoints.
**DoD:**
- [ ] Fastify server runs
- [ ] GET /v1/health returns status + build
- [ ] GET /v1/config returns maintenance flags
- [ ] CORS configured
- [ ] Docker build works
**Files:** apps/api/*
**Tests:** curl scripts or integration tests
**Owner:** Backend Agent
**Scope:** `apps/api/**`


## T-0004 — Web app boot + Telegram WebApp integration
**Goal:** React app that loads in Telegram Mini App context.
**DoD:**
- [ ] Vite + React + TypeScript setup
- [ ] telegram-web-app.js loaded correctly
- [ ] Detects Telegram WebApp context
- [ ] Reads initData
- [ ] Shows placeholder deck UI
**Files:** apps/web/*
**Tests:** Manual test in Telegram
**Owner:** Frontend Agent
**Scope:** `apps/web/**`


## T-0005 — Activity ledger v0 (in-memory)
**Goal:** Basic activity tracking for trades.
**DoD:**
- [ ] In-memory store for trade records
- [ ] GET /v1/activity endpoint
- [ ] Trade status tracking
- [ ] Idempotency via gesture_id
**Files:** apps/api/src/activity/*
**Tests:** Integration tests
**Owner:** Backend Agent
**Scope:** `apps/api/**`
**Dependencies:** T-0003


## T-0006 — TON Connect integration
**Goal:** Wallet connection via TON Connect.
**DoD:**
- [ ] tonconnect-manifest.json deployed
- [ ] Connect modal works
- [ ] Wallet address persisted in session
- [ ] Disconnect works
**Files:** apps/web/src/wallet/*
**Tests:** Manual test with Tonkeeper
**Owner:** Frontend Agent
**Scope:** `apps/web/**`
**Milestone:** M1


## T-0007 — Hold-to-buy gesture
**Goal:** Implement hold gesture with HOLD_POSSIBLE → HOLD_ARMED gating.
**DoD:**
- [ ] Pointer down starts HOLD_POSSIBLE
- [ ] ARM_MS dwell + MOVE_PX threshold gates HOLD_ARMED
- [ ] Arming haptic feedback
- [ ] Cancel via swipe up
- [ ] Release triggers commit
**Files:** apps/web/src/gesture/*
**Tests:** Unit tests + manual testing
**Owner:** Frontend Agent
**Scope:** `apps/web/**`
**Dependencies:** T-0002 (card state machine), T-0004
**Milestone:** M1
**Note:** Uses domain card machine from T-0002


## T-0008 — Trade commit flow
**Goal:** Full quote → commit → status flow.
**DoD:**
- [ ] POST /v1/trades/quote endpoint
- [ ] POST /v1/trades/commit endpoint (idempotent)
- [ ] Gesture_id idempotency enforced
- [ ] Status updates via Activity
- [ ] Error codes mapped to UI
**Files:** apps/api/src/trades/*
**Tests:** Integration tests, idempotency tests
**Owner:** Backend Agent
**Scope:** `apps/api/**`
**Dependencies:** T-0003, T-0005
**Milestone:** M1
**Note:** Frontend integration (apps/web/src/trade/*) is separate task for Frontend Agent


## T-0008b — Trade commit UI integration
**Goal:** Frontend integration for trade commit flow.
**DoD:**
- [ ] Trade commit UI states
- [ ] Error display based on API error codes
- [ ] Loading states during commit
**Files:** apps/web/src/trade/*
**Tests:** Component tests
**Owner:** Frontend Agent
**Scope:** `apps/web/**`
**Dependencies:** T-0008
**Milestone:** M1


## T-0009 — Deck batch endpoint
**Goal:** Fetch cards for the infinite deck.
**DoD:**
- [ ] POST /v1/deck/batch endpoint
- [ ] Returns cards with token info + risk signals
- [ ] Excludes already-seen tokens
- [ ] Cursor-based pagination
**Files:** apps/api/src/deck/*
**Tests:** Integration tests
**Owner:** Backend Agent
**Scope:** `apps/api/**`
**Milestone:** M1


## T-0010 — Kill switch implementation (split)

### T-0010a — Kill switch backend
**Goal:** Backend trading disable capability.
**DoD:**
- [ ] maintenance.trading_disabled in config
- [ ] Backend rejects commits when disabled
- [ ] Admin path to toggle (DB or env)
**Files:** apps/api/src/config/*
**Tests:** Integration tests
**Owner:** Backend Agent
**Scope:** `apps/api/**`
**Milestone:** M0 (required for M0 exit criteria)

### T-0010b — Kill switch frontend
**Goal:** Frontend maintenance banner.
**DoD:**
- [ ] Frontend shows banner when trading disabled
- [ ] Disables buy/sell buttons
**Files:** apps/web/src/maintenance/*
**Tests:** Component tests
**Owner:** Frontend Agent
**Scope:** `apps/web/**`
**Dependencies:** T-0010a
**Milestone:** M0


## T-0011 — WebSocket server + TRADE_UPDATE
**Goal:** Real-time trade status updates.
**DoD:**
- [ ] GET /v1/stream upgrades to WS
- [ ] Auth via token query param
- [ ] TRADE_UPDATE events on status change
- [ ] SYSTEM_STATUS for maintenance
- [ ] Reconnection handling
**Files:** apps/api/src/ws/*
**Tests:** WS integration tests
**Owner:** Backend Agent
**Scope:** `apps/api/**`
**Milestone:** M1


## T-0012 — Sell-all functionality (split)

### T-0012a — Sell-all backend
**Goal:** Backend sell-all endpoint.
**DoD:**
- [ ] POST /v1/trades/sell-all endpoint
- [ ] Uses full balance (minus dust)
- [ ] Returns trade status
**Files:** apps/api/src/trades/*
**Tests:** Integration tests
**Owner:** Backend Agent
**Scope:** `apps/api/**`
**Milestone:** M0

### T-0012b — Sell-all frontend
**Goal:** Sell-all UI on holding card.
**DoD:**
- [ ] Sell-all button on holding card
- [ ] Shows progress states
- [ ] Handles failures gracefully
**Files:** apps/web/src/sell/*
**Tests:** Component tests
**Owner:** Frontend Agent
**Scope:** `apps/web/**`
**Dependencies:** T-0012a
**Milestone:** M0


## T-0013 — Database setup + migrations
**Goal:** PostgreSQL with migration discipline.
**DoD:**
- [ ] Drizzle ORM configured
- [ ] Migration files in git
- [ ] Staging + prod DBs created (Neon)
- [ ] trades, sessions, config tables
**Files:** apps/api/src/db/*, apps/api/migrations/*
**Tests:** Migration runs cleanly
**Owner:** Backend Agent
**Scope:** `apps/api/**`, `packages/infra/**`
**Milestone:** M1


## T-0014 — CI/CD pipeline
**Goal:** Automated staging + prod deploys.
**DoD:**
- [ ] CI checks on PR (lint, typecheck, test)
- [ ] Staging deploy on staging branch
- [ ] Prod deploy on main branch
- [ ] Gitleaks secret scanning
**Files:** .github/workflows/*
**Tests:** CI green
**Owner:** Reviewer Agent
**Scope:** `.github/**`, `infra/ci/**`
**Milestone:** M0 (partial complete)


## T-0015 — Reconciliation worker
**Goal:** Resolve UNKNOWN/PENDING trades.
**DoD:**
- [ ] Worker queries pending trades
- [ ] Checks on-chain status
- [ ] Updates trade status
- [ ] Runs on resume + Activity open
**Files:** apps/api/src/workers/*
**Tests:** Integration tests
**Owner:** Backend Agent
**Scope:** `apps/api/**`
**Milestone:** M1


---

## T-0016 — Contracts package setup
**Goal:** Shared types and Zod schemas in packages/contracts.
**DoD:**
- [ ] Package scaffolded with package.json + tsconfig
- [ ] Zod schemas for API request/response shapes
- [ ] Error code enums exported
- [ ] Types from domain/types.ts migrated here
- [ ] Published as @dope/contracts workspace package
**Files:** packages/contracts/*
**Tests:** TypeScript compiles, schemas validate
**Owner:** Contracts Agent
**Scope:** `packages/contracts/**`
**Milestone:** M0
**Note:** T-0002 domain types should be moved here once this is ready


## T-0017 — Infra package setup
**Goal:** IO adapters and clients in packages/infra.
**DoD:**
- [ ] Package scaffolded with package.json + tsconfig
- [ ] Telemetry emitter interface
- [ ] HTTP client wrapper
- [ ] Wallet/swap adapter interfaces (stubs for M0)
**Files:** packages/infra/*
**Tests:** TypeScript compiles
**Owner:** Backend Agent
**Scope:** `packages/infra/**`
**Milestone:** M1


## T-0018 — UI component library
**Goal:** Shared UI components in packages/ui.
**DoD:**
- [ ] Package scaffolded with package.json + tsconfig
- [ ] Base components (Button, Card, etc.)
- [ ] Theme tokens (colors, spacing)
- [ ] Storybook setup (optional for M0)
**Files:** packages/ui/*
**Tests:** Component tests
**Owner:** Frontend Agent
**Scope:** `packages/ui/**`
**Milestone:** M1


## T-0019 — Positions endpoint
**Goal:** GET /v1/positions for holding card PnL display.
**DoD:**
- [ ] GET /v1/positions returns user's token holdings
- [ ] Includes balance, avg buy price, current price, PnL
- [ ] Updates from WebSocket price ticks
**Files:** apps/api/src/positions/*
**Tests:** Integration tests
**Owner:** Backend Agent
**Scope:** `apps/api/**`
**Milestone:** M0
**Dependencies:** T-0003, T-0005
**Note:** Required for holding card view


## T-0020 — Telegram auth endpoint
**Goal:** POST /v1/auth/telegram for session management.
**DoD:**
- [ ] Validates Telegram initData signature
- [ ] Creates/retrieves user session
- [ ] Returns access token
- [ ] Token expiry handling
**Files:** apps/api/src/auth/*
**Tests:** Integration tests
**Owner:** Backend Agent
**Scope:** `apps/api/**`
**Milestone:** M0
**Dependencies:** T-0003

