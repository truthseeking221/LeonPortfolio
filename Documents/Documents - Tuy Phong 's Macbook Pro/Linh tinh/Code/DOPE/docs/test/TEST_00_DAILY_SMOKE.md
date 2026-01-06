# TEST_00_DAILY_SMOKE — The 90-second "Is it alive?" test (run daily)

## Purpose
Every work day (and after every deploy), run this test on STAGING.
This prevents silent drift and keeps multi-day agent work coherent.

---

## Inputs
Set these env vars locally:
```bash
export WEB_BASE=https://staging.dope.example
export API_BASE=https://api-staging.dope.example
```

(Optional)
```bash
export TG_STARTAPP=ref_test123
```

---

## Smoke steps (manual or scripted)

### 1) Frontend is reachable
```bash
curl -I "$WEB_BASE" | head
```
Expect: 200 and HTML.

### 2) Backend health + config
```bash
curl -sS "$API_BASE/v1/health"
curl -sS "$API_BASE/v1/config"
```
Expect: JSON, and env=staging.

### 3) Telegram init (dev sanity)
Open Mini App from the staging bot.
Expect:
- app renders without blank screen
- logs show the Telegram WebApp object exists

### 4) WS connectivity (basic)
If you have wscat:
```bash
npx wscat -c "$API_BASE/v1/stream"
```
Expect:
- connection established
- server sends SYSTEM_STATUS or a welcome frame

### 5) Critical UI sanity
In the app:
- [ ] Deck renders at least 1 card (even placeholder)
- [ ] Swiping does not freeze
- [ ] Holding shows HoldOverlay feedback <100ms
- [ ] Cancel works

---

## Record results (required)
Update today's file:
- `docs/work/daily/YYYY-MM-DD.md`

Include:
- pass/fail
- any anomalies
- links to logs

---

## Automated smoke script (optional)
Create `scripts/smoke-staging.sh`:
```bash
#!/bin/bash
set -e

WEB_BASE="${WEB_BASE:-https://staging.dope.example}"
API_BASE="${API_BASE:-https://api-staging.dope.example}"

echo "=== Smoke Test: Staging ==="

echo "1) Frontend..."
curl -sSf -o /dev/null "$WEB_BASE" && echo "OK" || echo "FAIL"

echo "2) Health..."
curl -sSf "$API_BASE/v1/health" | jq . || echo "FAIL"

echo "3) Config..."
curl -sSf "$API_BASE/v1/config" | jq . || echo "FAIL"

echo "=== Done ==="
```

---

## Prod smoke (after release)
Same steps, but:
```bash
export WEB_BASE=https://dope.example
export API_BASE=https://api.dope.example
```

Be careful with prod — don't spam trades.

