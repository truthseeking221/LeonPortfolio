# DEPLOY_07_RELEASE_CHECKLIST — Reproducible Staging → Prod Promotion

## Goal
A release is boring and repeatable.

---

## 0) Preconditions
- [ ] All tasks for the release are marked done in `docs/work/SPRINT_CURRENT.md`
- [ ] Today's smoke test passed (`docs/test/TEST_00_DAILY_SMOKE.md`)
- [ ] No open P0 risks in `docs/work/RISKS.md`

---

## 1) Staging verification (must pass)

### 1.1 Web
- [ ] Mini App opens from staging bot menu button
- [ ] No blank screen / SPA routing works
- [ ] Deck renders and swipe is smooth

### 1.2 Backend
- [ ] `/v1/health` ok (staging)
- [ ] `/v1/config` returns expected flags
- [ ] WS connection works
- [ ] auth flow works (initData verified)

### 1.3 Money-state clarity checks (even if mocked)
- [ ] Commit path shows SENT/PENDING/CONFIRMED/FAILED properly
- [ ] Activity shows the source of truth
- [ ] Unknown state path shows conservative guidance

---

## 2) Production deployment steps (order matters)
1) Confirm kill switch is OFF in prod (`maintenance.trading_disabled=false`)
2) Deploy backend prod
3) Run DB migrations (if any) and verify
4) Deploy frontend prod
5) Verify prod bot points to prod URL
6) Run post-deploy smoke on prod (small scale)

---

## 3) Post-deploy monitoring (first 30 minutes)
Watch:
- commit latency
- error rates by code
- unknown_state_rate
- idempotency_conflict_rate
- WS disconnect rate

If any anomalies:
1) flip kill switch (DEPLOY_06)
2) decide rollback vs forward fix

---

## 4) Release record (required)
Create:
- `docs/work/releases/YYYY-MM-DD_prod.md` (use template below)

### Release record template
```markdown
# Release — YYYY-MM-DD (prod)

## Versions
- web: <commit sha>
- api: <commit sha>
- db migrations: <latest migration>

## Changes included
- ...

## Verification
- staging: passed
- prod smoke: passed

## Metrics after 30 min
- ...

## Notes
- ...
```

