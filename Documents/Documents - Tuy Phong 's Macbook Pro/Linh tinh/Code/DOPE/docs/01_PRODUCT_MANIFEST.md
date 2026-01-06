# 01_PRODUCT_MANIFEST — Locked Decisions


## Product
- DOPE = swipe-first memecoin trading game.
- Mantra: Don't invest. Just swipe.
- Primary surface: Mobile, Telegram Mini App webview.


## Launch Track (locked)
- Track A (Telegram Mini App): TON + TON Connect only.
  - Use Telegram WebApp capabilities like SecureStorage/DeviceStorage where available.
- Track B (non-TON chains): external web app only (not Mini App).


## Non-goals (MVP)
- No full chart suite.
- No complex order types.
- No multi-chain inside Telegram Mini App.


## Hard invariants (must hold)
1. **Exactly-once trade per gesture_id**
   - One hold-release produces at most one order attempt
   - Client lock + server idempotency enforced

2. **Cancel always safe**
   - Cancel MUST guarantee no order created

3. **No ambiguous money state**
   - User can always answer: "Did it send? Is it pending? Did it fail? Can I retry safely?"

4. **Gas reserve so user can sell at least once (panic sell)**
   - Enforce spendable balance rules to prevent "trapped" positions


## Primary persona
**"The Degen"**
- Low patience for text/charts
- Trades on meme + social proof + momentum
- Extremely sensitive to latency and ambiguous states


## Core experience
- **Perceived time-to-buy < 3s** (from seeing coin to "Order Sent")
- **Feedback < 100ms** for every user input


## Navigation rule
**No tabs. No portfolio page.**
- Main canvas: Deck (discover) or Holding (PnL)
- Overlays: Onboarding, Wallet, Settings, Activity, Errors

