# DOPE — App Overview (Agent Canon)

## 1) One-liner
DOPE is a swipe-first memecoin trading **game**: an infinite deck of coins where users **swipe to discover**, **hold-to-buy** (fast, continuous gesture), see an **always-on PnL game HUD**, and **panic sell** in one action.

Product mantra: **Don't invest. Just swipe.**

---

## 2) The promise (what we must optimize)
- **Perceived time-to-buy < 3s**
  - measured from first seeing a coin to UI confirming **"Order Sent"** (optimistic) — not chain finality.
- **Feedback < 100ms** for every user input (gesture → visual/haptic response).

---

## 3) What DOPE is NOT (explicit non-goals for MVP)
- Not a charting terminal (no full candlestick suite, indicators, research dashboards).
- Not complex orders (Not "rug-proof" or "guaranteed safe."
- Not a traditional portfolio app with tabs; **the card becomes the portfolio**.

---

## 4) Who this is for (primary persona)
**"The Degen"**
- low patience for text/charts
- trades on meme + social proof + momentum
- extremely sensitive to latency and ambiguous states

---

## 5) Core mental model (how the app feels)
Think **TikTok/Tinder** for discovery + **arcade scoreboard** for holding:
- Swipe through an infinite feed of coin cards.
- When a coin hits the vibe, buy instantly via a single continuous gesture.
- After buying, the same card becomes a live "score screen" (PnL).
- Exiting is always one action away: **SELL ALL**.

---

## 6) Primary surfaces
- **Main canvas** (always 1)
  1) Deck (discover + hold-to-buy)
  2) Holding (PnL + panic sell)
- **Overlays** (sheets/modals)
  - Onboarding (18+ + risk consent)
  - Wallet connect/session restore
  - Settings
  - Risk/Signal sheet (hide/report)
  - Error/Retry sheet
  - Activity/Audit (source of truth)
  - Maintenance banner

Navigation rule: **No tabs. No portfolio page.**

---

## 7) Non-negotiable invariants (must never break)
1) **Exactly-once trade per gesture**
   - one hold-release => at most one order attempt (client lock + server idempotency)
2) **Cancel is always safe**
   - cancel MUST guarantee no order created
3) **No ambiguous money state**
   - user can always answer:
     - "Did it send?"
     - "Is it pending?"
     - "Did it fail?"
     - "Can I retry safely?"
4) **No silent UI**
   - every input produces feedback <100ms
5) **Always-sellable constraint**
   - enforce gas reserve / spendable balance so user doesn't get trapped unable to sell

---

## 8) State machines (high-level)
DOPE behavior is defined by 3 interacting machines:

### 8.1 App lifecycle
```
BOOT → READY ↔ BACKGROUND → RESUME_SYNC → READY
```

Degrade states:
- OFFLINE_DEGRADED
- MAINTENANCE

Rules:
- entering BACKGROUND cancels any active hold
- RESUME_SYNC reconciles wallet + pending trades + stream

### 8.2 Card state machine
```
DISCOVERING → (hold intent) HOLD_ARMED
HOLD_ARMED → (cancel gesture) HOLD_CANCELED → DISCOVERING
HOLD_ARMED → (release) COMMITTING_BUY → SENT/PENDING → RESOLVED
If buy success => HOLDING_POSITION
HOLDING_POSITION → (panic sell) COMMITTING_SELL → SENT/PENDING → RESOLVED → DISCOVERING
```

### 8.3 Order resolution (authoritative)
```
NOT_CREATED → CREATED → SIGNED (if needed) → BROADCASTED → terminal
```

Terminal states:
- CONFIRMED
- FAILED_DETERMINISTIC (insufficient funds, slippage, user rejected, no route)
- FAILED_TRANSIENT (timeout/congestion) → retryable
- UNKNOWN (rare; triggers reconciliation)

---

## 9) "SELL ALL" in plain terms
SELL ALL means:
- sell the user's entire position (minus dust tolerance) into base asset (SOL/TON/…)
- prioritize exiting fast over price perfection
- never show "Sold" before confirmed
- if it can't sell (no liquidity / restrictions / no gas), the UI must say so clearly and provide next actions

---

## 10) Activity/Audit (the trust anchor)
Activity/Audit is the source of truth for all trades.
- Every buy/sell appears with status: SENT/PENDING/CONFIRMED/FAILED/UNKNOWN
- From any ambiguous state, the user can go to Activity to verify reality
- Reconciliation runs on resume and when Activity opens

---

## 11) Platform track (locked for agents)
Primary surface is Telegram Mini App webview.
Launch Track rules are defined in `docs/01_PRODUCT_MANIFEST.md`:
- In Telegram Mini App: TON + TON Connect only (unless explicitly changed by an ADR).
- Any non-TON chain belongs to an external web app track.

Agents MUST NOT "secretly implement" another chain inside Mini App.

---

## 12) Agent rules (do not violate)
When implementing:
- Keep business rules in `packages/domain` (pure, testable).
- API shapes in `packages/contracts`.
- IO/adapters in `packages/infra`.
- UI glue in `apps/web`.
- Backend in `apps/api`.

If unclear, write an ADR; do not guess requirements.

