/**
 * Card Interaction State Machine
 * 
 * Handles the card/token interaction lifecycle with gesture disambiguation:
 * 
 * DISCOVERING → (hold intent) HOLD_ARMED
 * HOLD_ARMED → (cancel gesture) HOLD_CANCELED → DISCOVERING
 * HOLD_ARMED → (release) COMMITTING_BUY → RESOLVED
 * If buy success => HOLDING_POSITION
 * HOLDING_POSITION → (panic sell) COMMITTING_SELL → RESOLVED → DISCOVERING
 * 
 * Gesture Disambiguation (critical for preventing accidental buys):
 * - HOLD_POSSIBLE: entered on pointer down, does NOT show buy arming UI
 * - Transitions to HOLD_ARMED only if:
 *   - dwell time >= ARM_MS
 *   - AND total movement <= MOVE_PX
 * - If user moves beyond MOVE_PX before ARM_MS: treat as swipe, NEVER arm
 */

import {
  type CardContext,
  type CardState,
  type CardEvent,
  type CardId,
  type GestureId,
  type GestureConfig,
  type OrderId,
  type PointerPosition,
  type Timestamp,
  type TransitionResult,
  CardState as States,
  CardEvent as Events,
  DEFAULT_GESTURE_CONFIG,
} from './types.js';

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create initial card context in DISCOVERING state
 */
export function createCardContext(cardId: CardId | null = null): CardContext {
  return {
    state: States.DISCOVERING,
    cardId,
    gestureId: null,
    holdStartAt: null,
    holdStartPosition: null,
    totalMovement: 0,
    orderId: null,
  };
}

/**
 * Generate a new gesture ID
 * Must be called externally and passed in (domain is pure, no IO)
 */
export function createGestureId(id: string): GestureId {
  return id as GestureId;
}

// ============================================================================
// Geometry Helpers
// ============================================================================

/**
 * Calculate distance between two positions
 */
export function calculateDistance(a: PointerPosition, b: PointerPosition): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// ============================================================================
// State Transition Logic
// ============================================================================

/**
 * Valid transitions for each state
 */
const VALID_TRANSITIONS: Record<CardState, readonly CardEvent[]> = {
  [States.DISCOVERING]: [Events.POINTER_DOWN],
  [States.HOLD_POSSIBLE]: [
    Events.POINTER_MOVE,
    Events.POINTER_UP,
    Events.ARM_TIMEOUT,
    Events.SWIPE_DETECTED,
    Events.CANCEL,
  ],
  [States.HOLD_ARMED]: [Events.POINTER_UP, Events.CANCEL],
  [States.HOLD_CANCELED]: [Events.RESET],
  [States.COMMITTING_BUY]: [Events.BUY_SUCCESS, Events.BUY_FAILED, Events.CANCEL],
  [States.HOLDING_POSITION]: [Events.PANIC_SELL],
  [States.COMMITTING_SELL]: [Events.SELL_SUCCESS, Events.SELL_FAILED],
  [States.RESOLVED]: [Events.RESET],
} as const;

/**
 * Check if a transition is valid from current state
 */
export function canTransition(state: CardState, event: CardEvent): boolean {
  const validEvents = VALID_TRANSITIONS[state];
  return validEvents.includes(event);
}

// ============================================================================
// Transition Inputs
// ============================================================================

export interface PointerDownInput {
  readonly event: typeof Events.POINTER_DOWN;
  readonly gestureId: GestureId;
  readonly cardId: CardId;
  readonly position: PointerPosition;
  readonly now: Timestamp;
}

export interface PointerMoveInput {
  readonly event: typeof Events.POINTER_MOVE;
  readonly position: PointerPosition;
  readonly config?: GestureConfig;
}

export interface PointerUpInput {
  readonly event: typeof Events.POINTER_UP;
  readonly now: Timestamp;
}

export interface ArmTimeoutInput {
  readonly event: typeof Events.ARM_TIMEOUT;
  readonly now: Timestamp;
  readonly config?: GestureConfig;
}

export interface BuySuccessInput {
  readonly event: typeof Events.BUY_SUCCESS;
  readonly orderId: OrderId;
  readonly now: Timestamp;
}

export interface BuyFailedInput {
  readonly event: typeof Events.BUY_FAILED;
  readonly now: Timestamp;
}

export interface PanicSellInput {
  readonly event: typeof Events.PANIC_SELL;
  readonly gestureId: GestureId;
  readonly now: Timestamp;
}

export interface SellSuccessInput {
  readonly event: typeof Events.SELL_SUCCESS;
  readonly now: Timestamp;
}

export interface SellFailedInput {
  readonly event: typeof Events.SELL_FAILED;
  readonly now: Timestamp;
}

export interface SimpleInput {
  readonly event:
    | typeof Events.SWIPE_DETECTED
    | typeof Events.CANCEL
    | typeof Events.RESET;
  readonly now: Timestamp;
}

export type CardTransitionInput =
  | PointerDownInput
  | PointerMoveInput
  | PointerUpInput
  | ArmTimeoutInput
  | BuySuccessInput
  | BuyFailedInput
  | PanicSellInput
  | SellSuccessInput
  | SellFailedInput
  | SimpleInput;

// ============================================================================
// Transition Function
// ============================================================================

/**
 * Pure function to transition card state
 * Returns new context with changed flag
 * 
 * INVARIANT: Same gesture_id = same trade (exactly-once per gesture)
 * INVARIANT: Cancel before COMMITTING = no trade
 */
export function transitionCard(
  ctx: CardContext,
  input: CardTransitionInput
): TransitionResult<CardContext> {
  if (!canTransition(ctx.state, input.event)) {
    return { context: ctx, changed: false };
  }

  switch (ctx.state) {
    case States.DISCOVERING:
      return handleDiscovering(ctx, input);

    case States.HOLD_POSSIBLE:
      return handleHoldPossible(ctx, input);

    case States.HOLD_ARMED:
      return handleHoldArmed(ctx, input);

    case States.HOLD_CANCELED:
      return handleHoldCanceled(ctx, input);

    case States.COMMITTING_BUY:
      return handleCommittingBuy(ctx, input);

    case States.HOLDING_POSITION:
      return handleHoldingPosition(ctx, input);

    case States.COMMITTING_SELL:
      return handleCommittingSell(ctx, input);

    case States.RESOLVED:
      return handleResolved(ctx, input);

    default:
      return { context: ctx, changed: false };
  }
}

// ============================================================================
// State Handlers
// ============================================================================

function handleDiscovering(
  ctx: CardContext,
  input: CardTransitionInput
): TransitionResult<CardContext> {
  if (input.event !== Events.POINTER_DOWN) {
    return { context: ctx, changed: false };
  }

  const pointerInput = input as PointerDownInput;

  return {
    context: {
      ...ctx,
      state: States.HOLD_POSSIBLE,
      cardId: pointerInput.cardId,
      gestureId: pointerInput.gestureId,
      holdStartAt: pointerInput.now,
      holdStartPosition: pointerInput.position,
      totalMovement: 0,
    },
    changed: true,
  };
}

function handleHoldPossible(
  ctx: CardContext,
  input: CardTransitionInput
): TransitionResult<CardContext> {
  const config = 'config' in input && input.config ? input.config : DEFAULT_GESTURE_CONFIG;

  switch (input.event) {
    case Events.POINTER_MOVE: {
      const moveInput = input as PointerMoveInput;
      if (!ctx.holdStartPosition) {
        return { context: ctx, changed: false };
      }

      const distance = calculateDistance(ctx.holdStartPosition, moveInput.position);
      const newTotalMovement = ctx.totalMovement + distance;

      // If movement exceeds threshold, transition to swipe (cancel hold)
      if (newTotalMovement > config.MOVE_PX) {
        return {
          context: {
            ...ctx,
            state: States.HOLD_CANCELED,
            totalMovement: newTotalMovement,
          },
          changed: true,
        };
      }

      // Update movement but stay in HOLD_POSSIBLE
      return {
        context: {
          ...ctx,
          totalMovement: newTotalMovement,
          holdStartPosition: moveInput.position,
        },
        changed: true,
      };
    }

    case Events.ARM_TIMEOUT: {
      // Only arm if movement is still within threshold
      if (ctx.totalMovement <= config.MOVE_PX) {
        return {
          context: {
            ...ctx,
            state: States.HOLD_ARMED,
          },
          changed: true,
        };
      }
      // Movement exceeded - cancel
      return {
        context: {
          ...ctx,
          state: States.HOLD_CANCELED,
        },
        changed: true,
      };
    }

    case Events.POINTER_UP:
      // Released before arm timeout - cancel
      return {
        context: {
          ...ctx,
          state: States.HOLD_CANCELED,
        },
        changed: true,
      };

    case Events.SWIPE_DETECTED:
    case Events.CANCEL:
      return {
        context: {
          ...ctx,
          state: States.HOLD_CANCELED,
        },
        changed: true,
      };

    default:
      return { context: ctx, changed: false };
  }
}

function handleHoldArmed(
  ctx: CardContext,
  input: CardTransitionInput
): TransitionResult<CardContext> {
  switch (input.event) {
    case Events.POINTER_UP:
      // Release after armed = commit buy
      return {
        context: {
          ...ctx,
          state: States.COMMITTING_BUY,
        },
        changed: true,
      };

    case Events.CANCEL:
      // Cancel is always safe before COMMITTING
      return {
        context: {
          ...ctx,
          state: States.HOLD_CANCELED,
        },
        changed: true,
      };

    default:
      return { context: ctx, changed: false };
  }
}

function handleHoldCanceled(
  ctx: CardContext,
  input: CardTransitionInput
): TransitionResult<CardContext> {
  if (input.event !== Events.RESET) {
    return { context: ctx, changed: false };
  }

  // Reset to discovering, clearing gesture state
  return {
    context: {
      ...ctx,
      state: States.DISCOVERING,
      gestureId: null,
      holdStartAt: null,
      holdStartPosition: null,
      totalMovement: 0,
    },
    changed: true,
  };
}

function handleCommittingBuy(
  ctx: CardContext,
  input: CardTransitionInput
): TransitionResult<CardContext> {
  switch (input.event) {
    case Events.BUY_SUCCESS: {
      const successInput = input as BuySuccessInput;
      return {
        context: {
          ...ctx,
          state: States.HOLDING_POSITION,
          orderId: successInput.orderId,
        },
        changed: true,
      };
    }

    case Events.BUY_FAILED:
      return {
        context: {
          ...ctx,
          state: States.RESOLVED,
        },
        changed: true,
      };

    case Events.CANCEL:
      // Cancel during commit - still possible if not yet broadcasted
      // The order machine handles whether cancel is actually effective
      return {
        context: {
          ...ctx,
          state: States.HOLD_CANCELED,
        },
        changed: true,
      };

    default:
      return { context: ctx, changed: false };
  }
}

function handleHoldingPosition(
  ctx: CardContext,
  input: CardTransitionInput
): TransitionResult<CardContext> {
  if (input.event !== Events.PANIC_SELL) {
    return { context: ctx, changed: false };
  }

  const sellInput = input as PanicSellInput;

  return {
    context: {
      ...ctx,
      state: States.COMMITTING_SELL,
      gestureId: sellInput.gestureId,
    },
    changed: true,
  };
}

function handleCommittingSell(
  ctx: CardContext,
  input: CardTransitionInput
): TransitionResult<CardContext> {
  switch (input.event) {
    case Events.SELL_SUCCESS:
    case Events.SELL_FAILED:
      return {
        context: {
          ...ctx,
          state: States.RESOLVED,
        },
        changed: true,
      };

    default:
      return { context: ctx, changed: false };
  }
}

function handleResolved(
  ctx: CardContext,
  input: CardTransitionInput
): TransitionResult<CardContext> {
  if (input.event !== Events.RESET) {
    return { context: ctx, changed: false };
  }

  // Full reset to discovering
  return {
    context: createCardContext(ctx.cardId),
    changed: true,
  };
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Check if card is in a state that shows buy arming UI
 */
export function isArmed(ctx: CardContext): boolean {
  return ctx.state === States.HOLD_ARMED;
}

/**
 * Check if card is currently committing a trade
 */
export function isCommitting(ctx: CardContext): boolean {
  return ctx.state === States.COMMITTING_BUY || ctx.state === States.COMMITTING_SELL;
}

/**
 * Check if card is holding a position
 */
export function isHolding(ctx: CardContext): boolean {
  return ctx.state === States.HOLDING_POSITION;
}

/**
 * Check if cancel is safe (no trade will be created)
 * INVARIANT: Cancel before COMMITTING_BUY = guaranteed no trade
 */
export function isCancelSafe(ctx: CardContext): boolean {
  return (
    ctx.state === States.DISCOVERING ||
    ctx.state === States.HOLD_POSSIBLE ||
    ctx.state === States.HOLD_ARMED ||
    ctx.state === States.HOLD_CANCELED
  );
}

/**
 * Check if the card is in a terminal state for this interaction
 */
export function isResolved(ctx: CardContext): boolean {
  return ctx.state === States.RESOLVED;
}

/**
 * Check if user is potentially about to buy (gesture in progress)
 */
export function isGestureActive(ctx: CardContext): boolean {
  return (
    ctx.state === States.HOLD_POSSIBLE ||
    ctx.state === States.HOLD_ARMED
  );
}

/**
 * Get elapsed hold time in milliseconds
 */
export function getHoldDuration(ctx: CardContext, now: Timestamp): number {
  if (ctx.holdStartAt === null) {
    return 0;
  }
  return now - ctx.holdStartAt;
}

/**
 * Check if hold duration meets arm threshold
 */
export function shouldArm(
  ctx: CardContext,
  now: Timestamp,
  config: GestureConfig = DEFAULT_GESTURE_CONFIG
): boolean {
  if (ctx.state !== States.HOLD_POSSIBLE) {
    return false;
  }
  const duration = getHoldDuration(ctx, now);
  return duration >= config.ARM_MS && ctx.totalMovement <= config.MOVE_PX;
}

