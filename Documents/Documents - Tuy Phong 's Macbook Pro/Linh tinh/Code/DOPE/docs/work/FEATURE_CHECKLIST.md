# FEATURE_CHECKLIST — Implementing a Feature Without Spaghetti

For every feature PR, confirm:

## 1) Architecture placement
- [ ] Domain rules in packages/domain
- [ ] Shared types in packages/contracts
- [ ] IO / adapters in packages/infra
- [ ] UI glue only in apps/web
- [ ] API endpoints in apps/api

## 2) Contracts & errors
- [ ] API contract updated (docs/04_API_CONTRACTS.md)
- [ ] Error code mapping updated (docs/05_ERROR_CODES.md)
- [ ] Client handles every error with an actionable UI

## 3) Correctness invariants
- [ ] exactly-once per gesture_id preserved
- [ ] cancel always safe
- [ ] no fake "sold" before confirmed
- [ ] Activity/Audit is source of truth

## 4) Telemetry
- [ ] events added/updated in docs/06_TELEMETRY_EVENTS.md
- [ ] sampling strategy defined (if needed)

## 5) Tests
- [ ] unit tests (domain)
- [ ] integration test (api)
- [ ] UI sanity steps added to daily smoke if relevant

## 6) Docs + handoff
- [ ] sprint task updated as done
- [ ] daily log updated with verification steps

