# OPS_01_OPERATIONS — Daily Monitoring & Operations

## 1) Key metrics to monitor

### System health
- commit latency distribution
- WS connect/disconnect rates
- provider health (swap, prices, rpc)
- reconciliation job success rate

### Trade pipeline
- trade status counts by state (CREATED/SIGNED/BROADCASTED/CONFIRMED/FAILED/UNKNOWN)
- unknown_state_rate
- retry_exhaust_rate
- time_to_confirm distribution

### Abuse & safety
- rate limit triggers per user/session/ip bucket
- token report volume
- promoted impressions vs hides/reports (if enabled)

---

## 2) Daily ops checklist (15 minutes)
1) Check kill switch status (prod):
   - maintenance.trading_disabled should be false unless intentionally paused
2) Check provider health:
   - swap provider status
   - price stream status
   - rpc status
3) Check correctness metrics:
   - unknown_state_rate (24h)
   - any duplicate suspicion signals (see OPS_02)
4) Review top errors (24h):
   - slippage exceeded
   - insufficient funds
   - route not found
   - rpc unavailable
5) Review top support complaints (if any):
   - categorize + link to corresponding runbook steps

Log results in `docs/work/daily/YYYY-MM-DD.md`.

---

## 3) Weekly ops checklist (60 minutes)
1) Confirm backups are working (prod DB)
2) Run restore drill into a staging DB once/month
3) Review dependency updates & security scans
4) Review token moderation efficacy:
   - report->suppression time
   - false positives/negatives
5) Review cost + scaling:
   - DB load
   - WS load
   - cache hit rates (if redis)

---

## 4) Remote config knobs (must exist)
- maintenance.trading_disabled (global kill)
- maintenance.buy_disabled
- maintenance.sell_disabled
- feature.gas_sponsor_sell_enabled (if implemented)
- risk.min_liquidity
- risk.min_age_minutes
- deck.seen_ttl_hours
- deck.no_repeat_last_n
- retry.max_attempts
- retry.backoff_profile
- slippage.sell_default_bps
- slippage.sell_max_user_bps
- iosSafeMode (if applicable)

---

## 5) "When in doubt" rules
- If any ambiguity risk: flip kill switch first, then investigate.
- If provider/rpc unstable: degrade trading, keep browsing.
- If unknown states spike: run reconciliation + pause trading.

