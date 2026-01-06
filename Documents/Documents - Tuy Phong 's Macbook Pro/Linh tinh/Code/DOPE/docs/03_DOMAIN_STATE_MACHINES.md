# 03_DOMAIN_STATE_MACHINES — Core State Machines

## Gesture disambiguation (required)

State: HOLD_POSSIBLE
- entered on pointer down
- does NOT show buy arming UI
- transitions to HOLD_ARMED only if:
  - dwell time >= ARM_MS
  - AND total movement <= MOVE_PX
- if user moves beyond MOVE_PX before ARM_MS:
  - treat as swipe/scroll intent; NEVER arm buy

This prevents accidental buys while swiping quickly.

---

## App lifecycle
```
BOOT → READY ↔ BACKGROUND → RESUME_SYNC → READY
```

Degrade states:
- OFFLINE_DEGRADED
- MAINTENANCE

Rules:
- entering BACKGROUND cancels any active hold
- RESUME_SYNC reconciles wallet + pending trades + stream

---

## Card state machine
```
DISCOVERING → (hold intent) HOLD_ARMED
HOLD_ARMED → (cancel gesture) HOLD_CANCELED → DISCOVERING
HOLD_ARMED → (release) COMMITTING_BUY → SENT/PENDING → RESOLVED
If buy success => HOLDING_POSITION
HOLDING_POSITION → (panic sell) COMMITTING_SELL → SENT/PENDING → RESOLVED → DISCOVERING
```

---

## Order resolution (authoritative)
```
NOT_CREATED → CREATED → SIGNED (if needed) → BROADCASTED → terminal
```

Terminal states:
- CONFIRMED
- FAILED_DETERMINISTIC (insufficient funds, slippage, user rejected, no route)
- FAILED_TRANSIENT (timeout/congestion) → retryable
- UNKNOWN (rare; triggers reconciliation)

