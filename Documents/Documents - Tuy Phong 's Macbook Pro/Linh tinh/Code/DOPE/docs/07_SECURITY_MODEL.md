# 07_SECURITY_MODEL — Threat Model + Mitigations + Kill Switches

## Principles
1. Backend is authoritative for all money state
2. Frontend is untrusted — validation is convenience, not security
3. Fail closed on ambiguity
4. Kill switches must work without redeploy

---

## Threat Categories

### T1: Duplicate Trade Execution
**Risk:** P0 — User executes same trade multiple times
**Attack vector:** 
- Rapid retries
- Network issues causing resends
- Client bugs

**Mitigations:**
- `gesture_id` idempotency key (client generates, server enforces)
- Server rejects duplicate `gesture_id` with 409, returns existing trade
- Client locks UI during commit
- Reconciliation detects duplicates

**Detection signals:**
- `idempotency_conflict_rate` metric
- Reconciliation finding >1 tx per gesture

---

### T2: Race Condition in Cancel
**Risk:** P0 — Cancel doesn't prevent trade
**Attack vector:**
- Cancel request arrives after commit started

**Mitigations:**
- Cancel only valid before CREATED state
- Once CREATED, trade proceeds (user informed)
- Client shows clear "canceling..." vs "sending..." states

---

### T3: Replay Attacks
**Risk:** P1 — Attacker replays old requests
**Attack vector:**
- Captured auth tokens
- Captured signed transactions

**Mitigations:**
- Short token expiry (1 hour)
- `gesture_id` is unique per attempt
- Quote expiry (30s)
- Server-side timestamp validation

---

### T4: Session Hijacking
**Risk:** P1 — Attacker steals session
**Attack vector:**
- XSS
- Token leakage

**Mitigations:**
- Telegram initData validation (signature check)
- Token stored in memory only (not localStorage)
- HTTPS everywhere
- CSP headers

---

### T5: Price Manipulation
**Risk:** P1 — Stale or fake prices shown
**Attack vector:**
- MITM on price feed
- Provider manipulation

**Mitigations:**
- Server-side price validation
- Quote binding (price locked at quote time)
- Slippage protection
- Multiple price sources (future)

---

### T6: Spam/Abuse
**Risk:** P2 — User or bot spams requests
**Attack vector:**
- Rapid deck refreshes
- Quote spam
- WS connection spam

**Mitigations:**
- Rate limiting per user/session/IP
- WS connection limits per user
- Deck batch cooldown
- Quote rate limit

---

### T7: Token Feed Manipulation
**Risk:** P1 — Scam tokens promoted
**Attack vector:**
- Fake liquidity
- Pump and dump coordination

**Mitigations:**
- Minimum liquidity threshold
- Minimum age threshold
- Fail-closed risk gating
- User reporting → suppression
- Sell-route verification before showing

---

### T8: Accidental Trades
**Risk:** P0 — User buys unintentionally
**Attack vector:**
- Gesture confusion (swipe vs hold)
- UI lag causing misinterpretation

**Mitigations:**
- HOLD_POSSIBLE → HOLD_ARMED gating
- Minimum dwell time (ARM_MS)
- Maximum movement threshold (MOVE_PX)
- Arming haptic feedback
- Cancel gesture (swipe up)
- Safe zones on card

---

## Kill Switch Layers

### Layer A: Hard Kill (env var)
```
HARD_KILL_TRADING=true
```
- Requires backend restart/redeploy
- Most reliable fallback

### Layer B: Remote Config Kill (DB)
```
maintenance.trading_disabled=true
maintenance.buy_disabled=true
maintenance.sell_disabled=true
```
- Instant effect via `/v1/config`
- Preferred for incidents

### Layer C: Frontend Kill (display)
- Reads `/v1/config` on boot + interval
- Disables buttons, shows banner
- NOT security (backend must enforce)

---

## Authentication Security

### Telegram initData Validation
1. Parse initData query string
2. Extract `hash` parameter
3. Compute HMAC-SHA256 of data-check-string
4. Compare hashes
5. Validate `auth_date` not too old (e.g., 1 hour)

### Token Security
- JWT with short expiry
- Signed with server secret
- Contains: user_id, session_id, exp
- Refresh via re-auth only

---

## Data Security

### Sensitive Data Handling
- Wallet private keys: NEVER touched by our servers
- User data: minimal collection (Telegram ID only)
- Trade history: user-scoped, not public

### Secrets Management
- Runtime secrets in platform secret store
- Never in git
- Rotated periodically
- Separate secrets per environment

---

## Monitoring & Alerting

### Security Metrics
- `auth_failure_rate` — spike = attack?
- `idempotency_conflict_rate` — spike = bug or abuse
- `rate_limit_trigger_rate` — spike = abuse
- `unknown_state_rate` — spike = incident

### Alert Thresholds
- `unknown_state_rate > 1%` (15 min) → SEV-1
- `duplicate_trade_detected` → SEV-0
- `auth_failure_rate > 10%` (5 min) → investigate

