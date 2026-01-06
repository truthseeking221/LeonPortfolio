# DEPLOY_03_DB_MIGRATIONS — Postgres + Migration Discipline (No DB Chaos)

## Goal
- Staging and Prod DBs are isolated
- Migrations are deterministic, reviewed, and reproducible
- No "manual edits in prod"
- Clear rollback policy (mostly forward-fix)

---

## 0) Principles (non-negotiable)
1) Every schema change MUST be a migration committed to git.
2) Migrations MUST run on staging before prod.
3) Prod migrations MUST be:
   - applied once
   - tracked (migration table)
   - observable (logs)
4) Rollback is generally a forward-fix (unless a safe down migration exists).

---

## 1) Recommended migration tool
Pick ONE and lock it early:
- Drizzle migrations (recommended)
- Prisma migrations
- node-pg-migrate
- Flyway/Liquibase (heavier)

Rule: The tool must:
- store migration files in repo
- track applied migrations in DB
- be runnable in CI and locally

Suggested location:
- `apps/api/migrations/`

---

## 2) Database setup (staging and prod)
You MUST create separate databases:
- `dope_staging`
- `dope_prod`

Create separate DB users:
- `dope_staging_app`
- `dope_prod_app`

Permissions:
- app user: read/write tables
- migration user (optional): can alter schema
- never run the app as superuser

---

## 3) Migration workflow (daily)

### Step A — Create migration
- generate a new migration file
- name includes timestamp + short description
  - `20260106_01_create_trades.sql`

### Step B — Apply locally
- run migrations locally against local DB
- run unit tests + integration smoke tests

### Step C — Apply to staging
- run migrations against staging DB
- verify:
  - health check
  - basic deck fetch
  - trade commit path (even if mocked)

### Step D — Apply to prod
- deploy backend (or put it in maintenance)
- apply migrations (same command)
- deploy backend
- verify smoke test

---

## 4) Backups and recovery (required)
- Staging: weekly backup is enough
- Prod: daily automated backups + point-in-time recovery if available

You MUST document:
- where backups live
- how to restore into a fresh database
- who has access

---

## 5) Safe change rules (to avoid breaking prod)

### 5.1 Additive-first
Prefer:
- add columns (nullable)
- backfill in a worker
- then enforce constraints later

Avoid:
- dropping columns in the same deploy
- rewriting huge tables in a single migration

### 5.2 Lock time awareness
For any migration that may lock tables:
- schedule during low traffic
- add explicit notes in the migration header

---

## 6) "Done when" checklist
- [ ] local DB migrations run from scratch
- [ ] staging DB migrations run cleanly
- [ ] prod DB migrations run cleanly
- [ ] restore procedure documented and tested once in staging

