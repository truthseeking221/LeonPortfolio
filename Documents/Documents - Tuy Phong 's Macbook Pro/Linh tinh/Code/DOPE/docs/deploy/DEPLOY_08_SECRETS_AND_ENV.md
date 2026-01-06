# DEPLOY_08_SECRETS_AND_ENV — Secrets Discipline (No Leaks, No Drift)

## Goal
- Agents can deploy for days without losing context
- Secrets never end up in git
- Staging and prod stay isolated
- "Works on staging" reliably predicts "works on prod"

---

## 1) Rules (non-negotiable)
1) Never commit `.env` files with real values.
2) Runtime secrets live in the hosting platform secret store (Fly/Render/Supabase), not in the frontend.
3) Frontend env vars are NOT secrets (anything in web bundle is public).
4) Staging and prod MUST have separate secrets and separate databases.

---

## 2) Required secret locations

### 2.1 Backend runtime secrets
Store in:
- Fly secrets / Render env vars / etc.

Examples:
- `DATABASE_URL`
- `TELEGRAM_BOT_TOKEN`
- `JWT_SECRET`
- Provider keys (RPC, swap, prices)
- `HARD_KILL_TRADING`

### 2.2 CI deploy secrets (limited)
GitHub Actions should only have deploy tokens, not app secrets:
- `FLY_API_TOKEN`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

---

## 3) GitHub Environments (required)
Create two GitHub environments:
- `staging`
- `production`

Use them for:
- environment-specific deploy workflows
- required reviewers for production deploy
- separate deploy tokens if needed

---

## 4) .env.example files (required)
Create:
- `apps/web/.env.example`
- `apps/api/.env.example`

They must list variables but no real values:
```
VITE_API_BASE_URL=
VITE_ENV=
```

```
DATABASE_URL=
JWT_SECRET=
TELEGRAM_BOT_TOKEN=
```

---

## 5) Secret leak prevention (required)

### 5.1 Add gitleaks to CI
Run gitleaks on every PR and on main/staging branches.

### 5.2 Pre-commit (recommended)
Add a local pre-commit hook to run:
- `gitleaks protect`
- `eslint`
- `typecheck`

---

## 6) CORS & origin allowlists
Backend must use explicit allowlist:
- staging web origin
- prod web origin

No wildcard in prod.

---

## 7) Verification checklist (every week)
- [ ] No secrets in repo history (gitleaks passes)
- [ ] Staging DB != Prod DB
- [ ] Staging bot token != Prod bot token
- [ ] Backend rejects unknown origins

