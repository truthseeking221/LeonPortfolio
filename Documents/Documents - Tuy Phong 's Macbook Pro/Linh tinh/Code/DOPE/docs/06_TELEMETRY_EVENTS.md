# 06_TELEMETRY_EVENTS — Event Catalog

## Principles
1. Every user action should be traceable
2. No PII in event properties
3. Sample high-frequency events (e.g., PRICE_TICK)
4. Always include session context

## Common Properties (all events)
```typescript
{
  event_id: string;       // unique event ID
  timestamp: string;      // ISO 8601
  session_id: string;     // user session
  user_id?: string;       // if authenticated
  app_version: string;    // build version
  platform: string;       // "telegram_mini_app" | "web"
  env: string;            // "staging" | "prod"
}
```

---

## App Lifecycle Events

### `app_boot`
App started loading.
```typescript
{ boot_source: "cold" | "warm" | "resume" }
```

### `app_ready`
App fully loaded and interactive.
```typescript
{ load_time_ms: number }
```

### `app_background`
App moved to background.
```typescript
{ had_active_hold: boolean }
```

### `app_resume`
App resumed from background.
```typescript
{ time_in_background_ms: number }
```

### `app_error`
Unhandled error occurred.
```typescript
{ error_type: string; error_message: string; stack?: string }
```

---

## Auth Events

### `auth_start`
Auth flow initiated.
```typescript
{ method: "telegram" }
```

### `auth_success`
Auth completed successfully.
```typescript
{ method: "telegram" }
```

### `auth_failure`
Auth failed.
```typescript
{ method: "telegram"; error_code: string }
```

---

## Wallet Events

### `wallet_connect_start`
Wallet connection initiated.
```typescript
{ wallet_type: "tonconnect" }
```

### `wallet_connect_success`
Wallet connected.
```typescript
{ wallet_type: "tonconnect"; wallet_address: string }
```

### `wallet_connect_failure`
Wallet connection failed.
```typescript
{ wallet_type: "tonconnect"; error_code: string }
```

### `wallet_disconnect`
Wallet disconnected.
```typescript
{ wallet_type: "tonconnect"; reason: "user" | "error" }
```

---

## Deck Events

### `deck_card_viewed`
Card became visible.
```typescript
{ token_id: string; position_in_deck: number }
```
**Sampling:** 100%

### `deck_card_swiped`
Card swiped away.
```typescript
{ token_id: string; direction: "left" | "right"; dwell_time_ms: number }
```

### `deck_batch_loaded`
New batch of cards loaded.
```typescript
{ count: number; load_time_ms: number }
```

---

## Trade Events

### `hold_armed`
Hold gesture armed (ready to buy).
```typescript
{ token_id: string; dwell_time_ms: number }
```

### `hold_canceled`
Hold gesture canceled before commit.
```typescript
{ token_id: string; cancel_method: "swipe_up" | "timeout" | "background" }
```

### `trade_commit_start`
Trade commit initiated.
```typescript
{ gesture_id: string; token_id: string; side: "BUY" | "SELL"; amount_base: string }
```

### `trade_commit_success`
Trade commit accepted by server.
```typescript
{ gesture_id: string; trade_id: string; status: string }
```

### `trade_commit_failure`
Trade commit failed.
```typescript
{ gesture_id: string; error_code: string }
```

### `trade_status_update`
Trade status changed.
```typescript
{ trade_id: string; old_status: string; new_status: string }
```

### `trade_confirmed`
Trade confirmed on-chain.
```typescript
{ trade_id: string; time_to_confirm_ms: number }
```

---

## Sell Events

### `sell_all_start`
Sell all initiated.
```typescript
{ token_id: string; amount_token: string }
```

### `sell_all_success`
Sell all completed.
```typescript
{ trade_id: string }
```

### `sell_all_failure`
Sell all failed.
```typescript
{ error_code: string }
```

---

## Activity Events

### `activity_opened`
Activity view opened.
```typescript
{}
```

### `activity_trade_tapped`
Trade row tapped in activity.
```typescript
{ trade_id: string; status: string }
```

### `activity_refresh`
Activity manually refreshed.
```typescript
{ trigger: "pull" | "button" }
```

---

## Error Events

### `error_displayed`
Error shown to user.
```typescript
{ error_code: string; screen: string }
```

### `error_retry_tapped`
User tapped retry on error.
```typescript
{ error_code: string }
```

---

## Safety Events

### `token_reported`
User reported a token.
```typescript
{ token_id: string; reason: string }
```

### `accidental_buy_report`
User indicated accidental buy.
```typescript
{ trade_id: string }
```

### `risk_signal_shown`
Risk signal displayed.
```typescript
{ token_id: string; signals: string[] }
```

---

## Performance Events

### `frame_drop`
Significant frame drop detected.
```typescript
{ screen: string; dropped_frames: number; duration_ms: number }
```
**Sampling:** 10%

### `media_load_failure`
Media failed to load.
```typescript
{ token_id: string; media_type: "image" | "video"; error: string }
```

---

## Sampling Strategy

| Event | Sample Rate |
|-------|-------------|
| `deck_card_viewed` | 100% |
| `trade_*` | 100% |
| `frame_drop` | 10% |
| `price_tick_received` | 1% |
| All others | 100% |

