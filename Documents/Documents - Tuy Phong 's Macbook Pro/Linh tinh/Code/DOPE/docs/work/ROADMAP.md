# ROADMAP — Milestones (M0..M3) with Exit Criteria

## M0 — Vertical Slice (3–5 days)
Goal: one full flow for one token (even mocked):
- open -> deck shows 1 card
- hold-to-buy -> commit idempotency path
- Activity records trade
- sell-all path works

Exit criteria:
- exactly-once per gesture proven under spam test
- UNKNOWN path implemented (even crude)
- kill switch works

## M1 — MVP Beta (Week 1–2)
- deck batching + dedupe
- hold-to-buy + cancel
- sell-all button
- Activity + reconciliation
- settings: presets/caps/slippage

Exit criteria:
- commit accepted p95 < 1.5s (normal)
- unknown rate <= 1% in beta
- no silent UI reports

## M2 — Vibe Release (Week 3)
- media pipeline + fallback ladder + perf downgrade
- sound/haptics pack (minimal)
- PnL pill while swiping (if chosen)

Exit criteria:
- stable fps on mid-tier devices
- no accidental trade spike after vibe polish

## M3 — Monetization & Growth (Week 4+)
- Stars payments (if inside Telegram) for promoted/premium
- promoted policy enforcement
- referral hooks

Exit criteria:
- monetization doesn't bypass safety constraints
- disputes playbook operational

