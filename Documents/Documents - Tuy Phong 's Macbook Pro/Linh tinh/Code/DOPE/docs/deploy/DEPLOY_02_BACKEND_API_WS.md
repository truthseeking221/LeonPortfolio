# DEPLOY_02_BACKEND_API_WS — Deploy Backend (REST + WebSocket)

## What this runbook covers
- Deploy a WS-friendly backend for:
  - REST API (config, deck, trades, activity)
  - WebSocket (trade updates, price ticks, system status)
- Staging + Prod separation
- Health checks, CORS, secrets, verification
- Two concrete deployment paths:
  - Default: Fly.io (good WS support, Docker-first)
  - Alternative: Render (simple Docker web service)

---

## 0) Principles (non-negotiable)
1) WS must be stable: do NOT deploy the WebSocket server to a platform that randomly kills long-lived connections.
2) Never trust the client:
   - quote binding and commit validation are server-authoritative
3) Staging and Prod are isolated:
   - separate app instances, separate DBs, separate bot tokens

---

## 1) Required backend endpoints (minimum)

### REST
- `GET /v1/health` — returns 200, includes build SHA and env
- `GET /v1/config` — returns remote config (feature flags, safety floors, maintenance)
- `POST /v1/auth/telegram` — verifies initData, returns access token + session_id
- `POST /v1/deck/batch`
- `POST /v1/trades/quote`
- `POST /v1/trades/commit` (idempotent via gesture_id)
- `GET /v1/activity?cursor=...`
- `GET /v1/activity/:trade_id`

### WebSocket
- `GET /v1/stream` (upgrades to WS)
  - connect params: token/session_id
  - sends events: PRICE_TICK, TRADE_UPDATE, SYSTEM_STATUS

---

## 2) Docker-first requirement (recommended)
Backend MUST be deployable from a Docker image. This keeps deploy reproducible and prevents env drift.

Expected files:
- `apps/api/Dockerfile`
- (optional) `infra/docker/docker-compose.yml` for local

---

## 3) Environment variables (backend)
Minimum required:
- `NODE_ENV=production`
- `APP_ENV=staging|prod`
- `PORT=8080` (or platform-defined)
- `DATABASE_URL=...`
- `TELEGRAM_BOT_TOKEN=...` (staging/prod bots differ)
- `JWT_SECRET=...`
- `CORS_ALLOWED_ORIGINS=https://staging.dope.example,https://dope.example`
- Provider keys (swap/prices/rpc) — never in frontend

Recommended:
- `LOG_LEVEL=info`
- `BUILD_SHA=<git sha>`
- `MAINTENANCE_TRADING_DISABLED=false` (or via DB/remote-config table)
- `RATE_LIMIT_RPS=...`
- `WS_MAX_CONN_PER_USER=...`

---

## 4) Default deploy path: Fly.io

### 4.1 Create apps
Create two Fly apps (don't reuse):
- `dope-api-staging`
- `dope-api-prod`

### 4.2 Fly launch (staging)
From repo root:
```bash
cd apps/api
fly launch --name dope-api-staging --no-deploy
```

### 4.3 Configure secrets
```bash
fly secrets set \
  APP_ENV=staging \
  DATABASE_URL="..." \
  TELEGRAM_BOT_TOKEN="..." \
  JWT_SECRET="..." \
  CORS_ALLOWED_ORIGINS="https://staging.dope.example" \
  --app dope-api-staging
```

### 4.4 Deploy
```bash
fly deploy --app dope-api-staging
```

### 4.5 Health check verification
```bash
curl -sS https://<STAGING_API_HOST>/v1/health
curl -sS https://<STAGING_API_HOST>/v1/config
```

Expected:
- health returns env/build
- config returns maintenance flags + config version

### 4.6 Repeat for prod
Same steps, but:
- app name `dope-api-prod`
- `APP_ENV=prod`
- `CORS_ALLOWED_ORIGINS=https://dope.example`
- prod DB + prod secrets

---

## 5) Alternative deploy path: Render (Docker web service)

### 5.1 Create Render Web Service (staging)
- Runtime: Docker
- Branch: staging
- Health check path: /v1/health

### 5.2 Set environment variables
Use Render's env var UI:
- `APP_ENV=staging`
- `DATABASE_URL=...`
- `TELEGRAM_BOT_TOKEN=...`
- etc.

### 5.3 Enable WebSockets
Ensure the service is configured for WS (Render supports WS for standard web services; avoid serverless functions).

### 5.4 Repeat for prod
- Separate service
- Branch: main
- Separate env vars

---

## 6) CORS and origin safety (required)
Backend MUST allow only known frontend origins:
- staging web origin
- prod web origin

Backend MUST reject:
- wildcard origin in production
- requests without Authorization on protected endpoints

---

## 7) WebSocket correctness + backpressure (required)
Backend MUST:
- cap events per second per client
- downsample PRICE_TICK
- send TRADE_UPDATE reliably on status transitions
- on reconnect, client must be able to fetch missed truth from GET /v1/activity

---

## 8) "Done when" checklist
- [ ] Staging REST + WS works over HTTPS/WSS
- [ ] Prod REST + WS works over HTTPS/WSS
- [ ] Only allowed CORS origins pass
- [ ] /v1/health and /v1/config stable
- [ ] Telegram auth endpoint works (initData verified)
- [ ] WS reconnect does not cause ambiguous trade state

