# RISKS — Live Risk Register

## Format
- R-XXXX
- Risk statement
- Severity (P0/P1/P2)
- Signal (how we detect it)
- Mitigation (what we do)
- Owner
- Status (open/mitigated/closed)

---

## R-0001 — Gesture ambiguity causes accidental buys
**Severity:** P0
**Signal:** accidental_buy_report spikes, session replays show hold triggered during swipe
**Mitigation:** 
- ✅ HOLD_POSSIBLE → HOLD_ARMED gating (time+stillness) — implemented in T-0002
- ⏳ Arming haptic feedback — T-0007
- ⏳ Safe zones at screen edges — T-0007
**Owner:** Frontend Agent (implementation), Domain Agent (logic)
**Status:** 🟡 Partially mitigated (domain logic done, UI implementation pending)
**Related Tasks:** T-0002 ✅, T-0007

## R-0002 — Deposit wall kills conversion
**Severity:** P0
**Signal:** high drop-off at wallet connect / first trade
**Mitigation:**
- ⏳ Sponsor SELL gas for first-time users — M2
- ⏳ Deposit overlay with clear instructions — T-0004
- ⏳ Demo mode (simulate trades without real money) — Backlog
- ⏳ Optional on-ramp integration — M3
**Owner:** Frontend Agent (UX), Backend Agent (sponsor logic)
**Status:** 🔴 Open
**Related Tasks:** T-0004, T-0006

## R-0003 — Token feed becomes scam amplifier
**Severity:** P0
**Signal:** report rate spikes, support "rug" complaints
**Mitigation:**
- ⏳ Fail-closed risk gating (no trade if unsure) — T-0008
- ⏳ Report button + auto-suppress — M1
- ⏳ Min liquidity/age filters — T-0009 (deck batch)
- ⏳ Sell-route check before showing token — T-0009
**Owner:** Backend Agent (filters), Product (policy)
**Status:** 🔴 Open
**Related Tasks:** T-0009

---

## R-0004 — Kill switch fails in emergency
**Severity:** P0
**Signal:** Unable to stop trading during incident
**Mitigation:**
- ⏳ Backend config flag — T-0010a
- ⏳ Frontend banner + disabled buttons — T-0010b
- ⏳ Test kill switch in staging before launch
**Owner:** Backend Agent (T-0010a), Frontend Agent (T-0010b)
**Status:** 🔴 Open
**Related Tasks:** T-0010a, T-0010b
**Note:** M0 exit criteria — must be working before launch

## R-0005 — Duplicate trades from network issues
**Severity:** P0
**Signal:** Multiple trades for same gesture_id
**Mitigation:**
- ✅ Client-side gesture_id generation — T-0002
- ✅ Server-side idempotency check — T-0002 (domain logic)
- ⏳ HTTP 409 response for duplicate — T-0008
**Owner:** Domain Agent (logic), Backend Agent (enforcement)
**Status:** 🟡 Partially mitigated (domain logic done, API pending)
**Related Tasks:** T-0002 ✅, T-0005, T-0008

## R-0006 — User trapped with unsellable position
**Severity:** P0
**Signal:** Support complaints "can't sell", users with 0 gas
**Mitigation:**
- ✅ Gas reserve logic in balance validation — T-0002
- ⏳ UI prevents spending below reserve — T-0007
- ⏳ Clear error message if insufficient gas — T-0008b
**Owner:** Domain Agent (logic), Frontend Agent (UI)
**Status:** 🟡 Partially mitigated (domain logic done, UI pending)
**Related Tasks:** T-0002 ✅, T-0007, T-0008b

