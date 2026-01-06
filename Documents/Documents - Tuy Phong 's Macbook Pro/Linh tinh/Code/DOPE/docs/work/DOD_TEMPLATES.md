# DOD_TEMPLATES — Definition of Done by Task Type

## A) Domain task (packages/domain)
DoD:
- [ ] Domain logic implemented as pure functions/state machines
- [ ] Unit tests cover invariants and edge cases
- [ ] No imports from apps/* or infra/*
- [ ] Telemetry/event names updated if relevant
- [ ] Docs updated (state machine spec if changed)

## B) API task (apps/api)
DoD:
- [ ] Endpoint implemented with contract in docs/04_API_CONTRACTS.md
- [ ] Error codes mapped in docs/05_ERROR_CODES.md
- [ ] Idempotency + auth rules enforced
- [ ] Integration test or curl script added
- [ ] Observability: logs include trade_id, user_id, gesture_id

## C) UI task (apps/web)
DoD:
- [ ] UI states reflect source of truth (Activity)
- [ ] No ambiguous money state UI
- [ ] Gesture feedback <100ms (local)
- [ ] Accessibility: safe area, no blocked interactions
- [ ] QA checklist updated

## D) Deploy/infra task (docs/deploy + infra/)
DoD:
- [ ] Runbook updated with reproducible steps
- [ ] Staging verified with daily smoke test
- [ ] Rollback path validated
- [ ] Secrets not leaked (gitleaks passes)

## E) Security task
DoD:
- [ ] Threat noted in docs/07_SECURITY_MODEL.md
- [ ] Mitigation implemented + tested
- [ ] Abuse case tests added (replay, spam, tampering)
- [ ] Kill switch impact understood

