# OPS_03_SUPPORT_DISPUTES — Support, Disputes, "I didn't mean to buy"

## Goal
Handle angry users with:
- truth
- speed
- minimal ambiguity
- minimal back-and-forth

Support policy principle:
- DOPE is a tool; token outcomes are market risk.
- Our job is to prove what happened and guide safe next steps.

---

## 0) The first instruction to every user
"Open Activity in DOPE. It shows the authoritative status of your trade."

---

## 1) Common complaint scripts + operator checklist

### A) "I bought but don't see the coin"
Operator steps:
1) Ask user to open Activity and read the trade status
2) If PENDING:
   - explain "still confirming" and advise waiting
3) If CONFIRMED but UI not updated:
   - instruct "reopen app" (RESUME_SYNC)
   - collect: trade_id, timestamp, wallet address
4) If FAILED:
   - show reason and suggested action (deposit/lower slippage)
5) If UNKNOWN:
   - advise: do not retry
   - instruct: keep checking + refresh Activity

Template reply:
"Please open Activity → tap the latest BUY. If it says PENDING, it's still confirming. If it says CONFIRMED, the position will sync shortly. If it says UNKNOWN, do not retry yet—tap Refresh and we'll reconcile it."

---

### B) "I sold but it didn't sell"
Steps:
1) Activity status?
2) If FAILED_DETERMINISTIC:
   - likely: no liquidity / slippage / token restriction
   - explain and offer "increase sell slippage" or "try later"
3) If PENDING/UNKNOWN:
   - advise not to spam sell
   - keep checking + reconciliation
4) If gas not enough:
   - instruct deposit base for fees or use sponsor sell (if enabled)

Template reply:
"Open Activity → latest SELL. If it's FAILED, the reason will tell you what to change (slippage/liquidity). If it's PENDING/UNKNOWN, please don't spam SELL ALL; hit Refresh and we'll reconcile."

---

### C) "I accidentally bought"
Steps:
1) Confirm whether trade is CONFIRMED or FAILED
2) If confirmed:
   - explain hold/release action and how cancel works
   - suggest enabling safety rails / lowering presets
3) Log event:
   - accidental_buy_report
4) If complaints spike after a release:
   - escalate to incident playbook and consider rollback

Template reply:
"DOPE buys on hold → release. You can cancel by sliding up before release. If this happened unintentionally, we recommend lowering presets and enabling threshold confirmations in Settings."

---

### D) "You scammed me / token rugged"
Steps:
1) Acknowledge emotion but stay factual
2) Provide:
   - token address + explorer link (if user wants)
3) Encourage reporting token in app
4) Explain: DOPE cannot guarantee token safety; it provides signals + rails.

Template reply:
"DOPE doesn't custody funds and can't guarantee token safety. Open Activity to see your transaction details and tap 'Report token' so we can suppress it for you and other users."

---

## 2) What support must collect (minimum)
- user wallet address
- trade_id (from Activity)
- gesture_id (if available in details)
- timestamp + timezone
- app version
- screenshots (optional)

---

## 3) Refund policy language (recommended)
- No refunds for market losses.
- Refunds only for verified platform errors (rare), decided case-by-case.

---

## 4) Support escalation path
- SEV triggers go to OPS_02 immediately (unknown spike, duplicates, provider down).

