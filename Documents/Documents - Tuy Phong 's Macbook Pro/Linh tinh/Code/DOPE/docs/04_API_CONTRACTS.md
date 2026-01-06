# 04_API_CONTRACTS — API Endpoint Specifications

## Base URLs
- Staging: `https://api-staging.dope.example`
- Production: `https://api.dope.example`

## Authentication
All protected endpoints require `Authorization: Bearer <token>` header.
Token obtained from `POST /v1/auth/telegram`.

---

## Health & Config

### GET /v1/health
**Auth:** None

**Response 200:**
```json
{
  "status": "ok",
  "env": "staging",
  "build": "abc123",
  "timestamp": "2026-01-06T12:00:00Z"
}
```

### GET /v1/config
**Auth:** None

**Response 200:**
```json
{
  "version": 1,
  "maintenance": {
    "trading_disabled": false,
    "buy_disabled": false,
    "sell_disabled": false
  },
  "risk": {
    "min_liquidity": 1000,
    "min_age_minutes": 5
  },
  "deck": {
    "seen_ttl_hours": 24,
    "no_repeat_last_n": 50
  },
  "slippage": {
    "sell_default_bps": 500,
    "sell_max_user_bps": 5000
  }
}
```

---

## Authentication

### POST /v1/auth/telegram
**Auth:** None

**Request:**
```json
{
  "init_data": "<telegram initData string>"
}
```

**Response 200:**
```json
{
  "access_token": "eyJ...",
  "session_id": "sess_abc123",
  "user_id": "user_123",
  "expires_at": "2026-01-07T12:00:00Z"
}
```

**Errors:**
- `INVALID_INIT_DATA` — signature verification failed
- `EXPIRED_INIT_DATA` — initData too old

---

## Deck

### POST /v1/deck/batch
**Auth:** Required

**Request:**
```json
{
  "count": 10,
  "exclude_ids": ["token_abc", "token_def"]
}
```

**Response 200:**
```json
{
  "cards": [
    {
      "token_id": "token_xyz",
      "symbol": "DOGE",
      "name": "Dogecoin",
      "price_usd": "0.15",
      "change_24h_pct": 5.2,
      "liquidity_usd": "50000",
      "age_minutes": 120,
      "media_url": "https://...",
      "risk_signals": ["LOW_LIQUIDITY"]
    }
  ],
  "cursor": "cursor_abc"
}
```

---

## Trading

### POST /v1/trades/quote
**Auth:** Required

**Request:**
```json
{
  "token_id": "token_xyz",
  "side": "BUY",
  "amount_base": "1.0",
  "slippage_bps": 500
}
```

**Response 200:**
```json
{
  "quote_id": "quote_abc",
  "token_id": "token_xyz",
  "side": "BUY",
  "amount_base": "1.0",
  "amount_token": "6.66",
  "price": "0.15",
  "slippage_bps": 500,
  "expires_at": "2026-01-06T12:01:00Z",
  "route": { ... }
}
```

**Errors:**
- `INSUFFICIENT_BALANCE` — not enough base asset
- `NO_ROUTE` — no swap route found
- `TOKEN_NOT_TRADEABLE` — token restricted

### POST /v1/trades/commit
**Auth:** Required

**Request:**
```json
{
  "gesture_id": "gest_abc123",
  "quote_id": "quote_abc"
}
```

**Response 200:**
```json
{
  "trade_id": "trade_xyz",
  "gesture_id": "gest_abc123",
  "status": "CREATED",
  "token_id": "token_xyz",
  "side": "BUY",
  "created_at": "2026-01-06T12:00:30Z"
}
```

**Response 409 (idempotent):**
```json
{
  "trade_id": "trade_xyz",
  "gesture_id": "gest_abc123",
  "status": "CONFIRMED",
  "message": "Trade already exists for this gesture"
}
```

**Errors:**
- `MAINTENANCE_TRADING_DISABLED` — kill switch active
- `QUOTE_EXPIRED` — quote no longer valid
- `INSUFFICIENT_BALANCE` — balance changed since quote
- `GESTURE_ALREADY_USED` — duplicate gesture (returns existing trade)

### POST /v1/trades/sell-all
**Auth:** Required

**Description:** Panic sell — sell entire position of a token at market. Prioritizes speed over price.

**Request:**
```json
{
  "gesture_id": "gest_sell_abc123",
  "token_id": "token_xyz",
  "slippage_bps": 1000
}
```

**Response 200:**
```json
{
  "trade_id": "trade_sell_xyz",
  "gesture_id": "gest_sell_abc123",
  "token_id": "token_xyz",
  "side": "SELL",
  "status": "CREATED",
  "amount_token": "6.66",
  "estimated_base": "0.99",
  "created_at": "2026-01-06T12:05:00Z"
}
```

**Response 409 (idempotent):**
```json
{
  "trade_id": "trade_sell_xyz",
  "gesture_id": "gest_sell_abc123",
  "status": "CONFIRMED",
  "message": "Sell already exists for this gesture"
}
```

**Errors:**
- `MAINTENANCE_TRADING_DISABLED` — kill switch active
- `MAINTENANCE_SELL_DISABLED` — sell specifically disabled
- `NO_POSITION` — user doesn't hold this token
- `POSITION_TOO_SMALL` — below dust threshold
- `NO_ROUTE` — no sell route available
- `INSUFFICIENT_GAS` — not enough for transaction fees
- `GESTURE_ALREADY_USED` — duplicate gesture (returns existing trade)

**Notes:**
- Uses full balance minus dust tolerance
- Higher default slippage (1000 bps = 10%) for speed
- Idempotent via gesture_id

---

## Positions

### GET /v1/positions
**Auth:** Required

**Description:** Get user's current token holdings for the holding card view.

**Response 200:**
```json
{
  "positions": [
    {
      "token_id": "token_xyz",
      "symbol": "DOGE",
      "name": "Dogecoin",
      "balance": "6.66",
      "avg_buy_price": "0.15",
      "current_price": "0.18",
      "pnl_usd": "0.20",
      "pnl_pct": 20.0,
      "value_usd": "1.20",
      "media_url": "https://...",
      "last_updated_at": "2026-01-06T12:10:00Z"
    }
  ],
  "total_value_usd": "1.20"
}
```

**Notes:**
- Returns empty array if no positions
- PnL calculated from avg_buy_price
- Prices update every ~10s via WebSocket

---

## Activity

### GET /v1/activity
**Auth:** Required

**Query params:**
- `cursor` — pagination cursor
- `limit` — max 50

**Response 200:**
```json
{
  "trades": [
    {
      "trade_id": "trade_xyz",
      "gesture_id": "gest_abc123",
      "token_id": "token_xyz",
      "side": "BUY",
      "status": "CONFIRMED",
      "amount_base": "1.0",
      "amount_token": "6.66",
      "tx_hash": "0x...",
      "created_at": "2026-01-06T12:00:30Z",
      "confirmed_at": "2026-01-06T12:00:45Z"
    }
  ],
  "cursor": "cursor_next"
}
```

### GET /v1/activity/:trade_id
**Auth:** Required

**Response 200:**
```json
{
  "trade_id": "trade_xyz",
  "gesture_id": "gest_abc123",
  "token_id": "token_xyz",
  "side": "BUY",
  "status": "CONFIRMED",
  "amount_base": "1.0",
  "amount_token": "6.66",
  "tx_hash": "0x...",
  "error_code": null,
  "error_message": null,
  "created_at": "2026-01-06T12:00:30Z",
  "confirmed_at": "2026-01-06T12:00:45Z"
}
```

---

## WebSocket

### GET /v1/stream
**Upgrade to WebSocket**

**Query params:**
- `token` — access token

**Server events:**
```json
{ "type": "SYSTEM_STATUS", "trading_disabled": false }
{ "type": "PRICE_TICK", "token_id": "token_xyz", "price": "0.16" }
{ "type": "TRADE_UPDATE", "trade_id": "trade_xyz", "status": "CONFIRMED" }
```

**Client events:**
```json
{ "type": "SUBSCRIBE_PRICES", "token_ids": ["token_xyz"] }
{ "type": "UNSUBSCRIBE_PRICES", "token_ids": ["token_xyz"] }
{ "type": "PING" }
```

