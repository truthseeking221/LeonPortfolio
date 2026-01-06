# 05_ERROR_CODES — Backend Error Taxonomy + UX Mapping

## Format
All API errors return:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  }
}
```

---

## Authentication Errors (4xx)

| Code | HTTP | Description | UX Action |
|------|------|-------------|-----------|
| `INVALID_INIT_DATA` | 401 | Telegram initData signature invalid | Show "Session expired, reopen app" |
| `EXPIRED_INIT_DATA` | 401 | initData too old | Show "Session expired, reopen app" |
| `INVALID_TOKEN` | 401 | Access token invalid | Redirect to auth flow |
| `TOKEN_EXPIRED` | 401 | Access token expired | Silent refresh or reauth |

---

## Trading Errors (4xx)

| Code | HTTP | Description | UX Action |
|------|------|-------------|-----------|
| `MAINTENANCE_TRADING_DISABLED` | 503 | Kill switch active | Show banner "Trading paused" |
| `MAINTENANCE_BUY_DISABLED` | 503 | Buy disabled | Show "Buying temporarily disabled" |
| `MAINTENANCE_SELL_DISABLED` | 503 | Sell disabled | Show "Selling temporarily disabled" |
| `INSUFFICIENT_BALANCE` | 400 | Not enough base asset | Show "Deposit more [TON]" |
| `INSUFFICIENT_GAS` | 400 | Not enough for fees | Show "Deposit [X] for gas fees" |
| `QUOTE_EXPIRED` | 400 | Quote no longer valid | Auto-refresh quote |
| `NO_ROUTE` | 400 | No swap route found | Show "Cannot trade this token" |
| `SLIPPAGE_EXCEEDED` | 400 | Price moved too much | Show "Price changed, retry?" |
| `TOKEN_NOT_TRADEABLE` | 400 | Token restricted/delisted | Show "Token unavailable" |
| `POSITION_TOO_SMALL` | 400 | Below dust threshold | Show "Position too small to sell" |
| `RATE_LIMITED` | 429 | Too many requests | Show "Slow down" + backoff |

---

## Idempotency Errors (4xx)

| Code | HTTP | Description | UX Action |
|------|------|-------------|-----------|
| `GESTURE_ALREADY_USED` | 409 | Duplicate gesture_id | Return existing trade, no retry |
| `TRADE_ALREADY_EXISTS` | 409 | Trade exists for gesture | Return existing trade |

---

## Server Errors (5xx)

| Code | HTTP | Description | UX Action |
|------|------|-------------|-----------|
| `INTERNAL_ERROR` | 500 | Unexpected server error | Show "Something went wrong" + retry |
| `PROVIDER_ERROR` | 502 | Swap/price provider failed | Show "Network issue, try again" |
| `RPC_ERROR` | 502 | Blockchain RPC failed | Show "Network issue, try again" |
| `TIMEOUT` | 504 | Request timed out | Show "Timed out, check Activity" |

---

## Trade Status Codes

| Status | Terminal? | Description | UX Display |
|--------|-----------|-------------|------------|
| `CREATED` | No | Trade record created | "Preparing..." |
| `SIGNED` | No | Transaction signed | "Signing..." |
| `BROADCASTED` | No | Sent to network | "Sending..." |
| `PENDING` | No | Awaiting confirmation | "Confirming..." |
| `CONFIRMED` | Yes | Successfully confirmed | "✓ Confirmed" |
| `FAILED_DETERMINISTIC` | Yes | Failed, do not retry | "✗ Failed: [reason]" |
| `FAILED_TRANSIENT` | Yes | Failed, can retry | "✗ Failed - Retry?" |
| `UNKNOWN` | No | Status unclear | "⚠ Checking..." |

---

## Error → UX Mapping Rules

1. **User-actionable errors** — show specific guidance
   - `INSUFFICIENT_BALANCE` → "Deposit more TON"
   - `SLIPPAGE_EXCEEDED` → "Increase slippage in Settings"

2. **Retry-safe errors** — show retry button
   - `PROVIDER_ERROR`, `RPC_ERROR`, `TIMEOUT`

3. **Non-retryable errors** — no retry button
   - `GESTURE_ALREADY_USED` — return existing trade
   - `TOKEN_NOT_TRADEABLE` — explain why

4. **Maintenance errors** — show banner, disable actions
   - `MAINTENANCE_*` — global banner + disabled buttons

5. **Unknown/ambiguous** — direct to Activity
   - "Check Activity for status"
   - NEVER show "Success" if status is UNKNOWN

