# DEPLOY_09_CICD — How CI/CD Works (Agent-Friendly)

## Goal
Agents should deploy without guessing.

---

## 1) Branch discipline
- `staging` branch => staging deploy
- `main` branch => prod deploy

No direct commits to main:
- PR required
- CI must pass

---

## 2) GitHub Secrets
Repo secrets (or per-environment secrets):
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `FLY_API_TOKEN`

Runtime secrets are NOT in GitHub; they live in Fly/Render.

---

## 3) Production safety
Use GitHub Environment "production" with:
- required reviewers
- manual approval gate (recommended)

---

## 4) Deployment verification
After any deploy, run:
- `docs/test/TEST_00_DAILY_SMOKE.md` on staging (and minimal subset on prod).

---

## 5) Rollback
- Use DEPLOY_06_ROLLBACK_KILL_SWITCH.md
- Rule: kill switch first, rollback second.

---

## 6) CI Workflow files
Located in `infra/ci/`:
- `WORKFLOW_ci.yml` — PR checks (lint, typecheck, test, gitleaks)
- `WORKFLOW_deploy_staging.yml` — staging deploy on push to staging
- `WORKFLOW_deploy_prod.yml` — prod deploy on push to main

Copy these to `.github/workflows/` when ready:
```bash
cp infra/ci/WORKFLOW_ci.yml .github/workflows/ci.yml
cp infra/ci/WORKFLOW_deploy_staging.yml .github/workflows/deploy-staging.yml
cp infra/ci/WORKFLOW_deploy_prod.yml .github/workflows/deploy-prod.yml
```

