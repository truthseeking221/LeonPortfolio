# DEPLOY_00_OVERVIEW — Reference Deployment (Staging + Prod)

## Goal
Deploy DOPE so that:
- Telegram opens the Mini App reliably (HTTPS in prod)
- Frontend can call backend API
- Wallet connect works (TON Connect manifest reachable)
- You can roll back and disable trading fast

## Canonical environments
We use three environments:

### 1) Local
- Purpose: fastest iteration
- Constraints: Telegram production requires HTTPS, so local usually needs a tunnel.

### 2) Staging
- Purpose: end-to-end testing (bot + wallet + ws + chaos)
- MUST be isolated: separate domain + separate backend + separate DB.

### 3) Production
- Purpose: money + real users
- MUST be isolated and reproducible.

---

## Reference stack (recommended default)
This is a *reference*, not a religion. It's chosen to minimize spaghetti and maximize reproducibility.

- Frontend: static SPA hosting (Cloudflare Pages or Vercel)
- Backend API + WebSocket: single Node service hosting (Fly.io / Render / Railway) — WS-friendly
- Database: Postgres (Supabase / Neon / RDS)
- Optional: Redis (Upstash) for idempotency cache + rate limiting

> Important: WebSockets are easier with a WS-friendly host. Don't pick serverless-only hosting for WS unless you know what you're doing.

---

## Domains (example)
- Staging web: https://staging.dope.example
- Prod web:    https://dope.example
- Staging API: https://api-staging.dope.example
- Prod API:    https://api.dope.example

---

## Environment variables (minimum)

### Frontend
- `VITE_API_BASE_URL` = backend base URL (staging vs prod)
- `VITE_ENV` = local|staging|prod

### Backend
- `DATABASE_URL`
- `TELEGRAM_BOT_TOKEN` (env-specific bot)
- `JWT_SECRET` (or auth secret)
- `CORS_ALLOWED_ORIGINS` (web domains)
- `MAINTENANCE_TRADING_DISABLED` (or remote config)
- Provider keys (swap/prices/rpc), stored server-side only

---

## Release flow (high-level)
1) Deploy backend to staging
2) Deploy frontend to staging (points to staging API)
3) Configure staging bot / menu button to staging URL
4) Run acceptance script (docs/test/TEST_00_DAILY_SMOKE.md)
5) Promote:
   - deploy backend prod
   - deploy frontend prod
   - switch prod bot menu button to prod URL
6) Verify: wallet connect + deck + buy/sell (small amount) + Activity ledger

---

## Rollback principle
Rollback must be possible in < 2 minutes by:
- reverting frontend deployment
- reverting backend deployment
- flipping a remote kill switch `trading_disabled=true`

(We define the exact procedure in DEPLOY_06_ROLLBACK_KILL_SWITCH.md)

---

## Verification checklist (every deploy)
- [ ] Mini App opens via Telegram menu button
- [ ] `telegram-web-app.js` loads before app code
- [ ] `/v1/health` returns 200
- [ ] `/v1/config` returns config version
- [ ] TON Connect manifest reachable via direct GET
- [ ] Wallet connect works
- [ ] Activity shows truth for last trade

