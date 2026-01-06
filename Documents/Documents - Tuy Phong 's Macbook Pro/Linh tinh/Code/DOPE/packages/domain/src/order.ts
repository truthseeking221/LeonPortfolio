/**
 * Order Resolution State Machine
 * 
 * Tracks the lifecycle of a trade order with exactly-once guarantee:
 * NOT_CREATED → CREATED → SIGNED (if needed) → BROADCASTED → terminal
 * 
 * Terminal states:
 * - CONFIRMED
 * - FAILED_DETERMINISTIC (insufficient funds, slippage, user rejected, no route)
 * - FAILED_TRANSIENT (timeout/congestion) → retryable
 * - UNKNOWN (rare; triggers reconciliation)
 * 
 * Key invariants:
 * 1. Exactly-once per gesture_id - same gesture_id = same trade
 * 2. Cancel before CREATED = no order created
 * 3. No ambiguous money state - user always knows order status
 */

import {
  type OrderContext,
  type OrderState,
  type OrderEvent,
  type OrderId,
  type GestureId,
  type CardId,
  type OrderType,
  type FailureReason,
  type Timestamp,
  type TransitionResult,
  OrderState as States,
  OrderEvent as Events,
  FailureReason as Reasons,
  TERMINAL_ORDER_STATES,
  RETRYABLE_ORDER_STATES,
} from './types.js';

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_MAX_RETRIES = 3;

// ============================================================================
// Factory Functions
// ============================================================================

export interface CreateOrderContextInput {
  readonly gestureId: GestureId;
  readonly orderType: OrderType;
  readonly cardId: CardId;
  readonly maxRetries?: number;
}

/**
 * Create initial order context in NOT_CREATED state
 */
export function createOrderContext(input: CreateOrderContextInput): OrderContext {
  return {
    state: States.NOT_CREATED,
    orderId: null,
    gestureId: input.gestureId,
    orderType: input.orderType,
    cardId: input.cardId,
    createdAt: null,
    signedAt: null,
    broadcastedAt: null,
    resolvedAt: null,
    failureReason: null,
    retryCount: 0,
    maxRetries: input.maxRetries ?? DEFAULT_MAX_RETRIES,
  };
}

/**
 * Create an order ID (must be generated externally - domain is pure)
 */
export function createOrderId(id: string): OrderId {
  return id as OrderId;
}

// ============================================================================
// State Transition Logic
// ============================================================================

/**
 * Valid transitions for each state
 */
const VALID_TRANSITIONS: Record<OrderState, readonly OrderEvent[]> = {
  [States.NOT_CREATED]: [Events.CREATE, Events.CANCEL],
  [States.CREATED]: [Events.SIGN, Events.BROADCAST, Events.FAIL_DETERMINISTIC, Events.CANCEL],
  [States.SIGNED]: [Events.BROADCAST, Events.FAIL_DETERMINISTIC, Events.CANCEL],
  [States.BROADCASTED]: [
    Events.CONFIRM,
    Events.FAIL_DETERMINISTIC,
    Events.FAIL_TRANSIENT,
    Events.MARK_UNKNOWN,
  ],
  [States.CONFIRMED]: [],
  [States.FAILED_DETERMINISTIC]: [],
  [States.FAILED_TRANSIENT]: [Events.RETRY],
  [States.UNKNOWN]: [Events.CONFIRM, Events.FAIL_DETERMINISTIC, Events.FAIL_TRANSIENT],
} as const;

/**
 * Check if a transition is valid from current state
 */
export function canTransition(state: OrderState, event: OrderEvent): boolean {
  const validEvents = VALID_TRANSITIONS[state];
  return validEvents.includes(event);
}

// ============================================================================
// Transition Inputs
// ============================================================================

export interface CreateInput {
  readonly event: typeof Events.CREATE;
  readonly orderId: OrderId;
  readonly now: Timestamp;
}

export interface SignInput {
  readonly event: typeof Events.SIGN;
  readonly now: Timestamp;
}

export interface BroadcastInput {
  readonly event: typeof Events.BROADCAST;
  readonly now: Timestamp;
}

export interface ConfirmInput {
  readonly event: typeof Events.CONFIRM;
  readonly now: Timestamp;
}

export interface FailDeterministicInput {
  readonly event: typeof Events.FAIL_DETERMINISTIC;
  readonly reason: FailureReason;
  readonly now: Timestamp;
}

export interface FailTransientInput {
  readonly event: typeof Events.FAIL_TRANSIENT;
  readonly reason: FailureReason;
  readonly now: Timestamp;
}

export interface MarkUnknownInput {
  readonly event: typeof Events.MARK_UNKNOWN;
  readonly now: Timestamp;
}

export interface RetryInput {
  readonly event: typeof Events.RETRY;
  readonly now: Timestamp;
}

export interface CancelInput {
  readonly event: typeof Events.CANCEL;
  readonly now: Timestamp;
}

export type OrderTransitionInput =
  | CreateInput
  | SignInput
  | BroadcastInput
  | ConfirmInput
  | FailDeterministicInput
  | FailTransientInput
  | MarkUnknownInput
  | RetryInput
  | CancelInput;

// ============================================================================
// Transition Function
// ============================================================================

/**
 * Pure function to transition order state
 * Returns new context with changed flag
 * 
 * INVARIANT: Same gesture_id = same trade (exactly-once)
 * INVARIANT: Cancel before BROADCASTED = no order on chain
 */
export function transitionOrder(
  ctx: OrderContext,
  input: OrderTransitionInput
): TransitionResult<OrderContext> {
  if (!canTransition(ctx.state, input.event)) {
    return { context: ctx, changed: false };
  }

  switch (ctx.state) {
    case States.NOT_CREATED:
      return handleNotCreated(ctx, input);

    case States.CREATED:
      return handleCreated(ctx, input);

    case States.SIGNED:
      return handleSigned(ctx, input);

    case States.BROADCASTED:
      return handleBroadcasted(ctx, input);

    case States.FAILED_TRANSIENT:
      return handleFailedTransient(ctx, input);

    case States.UNKNOWN:
      return handleUnknown(ctx, input);

    // Terminal states - no transitions allowed
    case States.CONFIRMED:
    case States.FAILED_DETERMINISTIC:
      return { context: ctx, changed: false };

    default:
      return { context: ctx, changed: false };
  }
}

// ============================================================================
// State Handlers
// ============================================================================

function handleNotCreated(
  ctx: OrderContext,
  input: OrderTransitionInput
): TransitionResult<OrderContext> {
  switch (input.event) {
    case Events.CREATE: {
      const createInput = input as CreateInput;
      return {
        context: {
          ...ctx,
          state: States.CREATED,
          orderId: createInput.orderId,
          createdAt: createInput.now,
        },
        changed: true,
      };
    }

    case Events.CANCEL:
      // Cancel before creation = deterministic failure (no order)
      return {
        context: {
          ...ctx,
          state: States.FAILED_DETERMINISTIC,
          failureReason: Reasons.USER_REJECTED,
          resolvedAt: (input as CancelInput).now,
        },
        changed: true,
      };

    default:
      return { context: ctx, changed: false };
  }
}

function handleCreated(
  ctx: OrderContext,
  input: OrderTransitionInput
): TransitionResult<OrderContext> {
  switch (input.event) {
    case Events.SIGN: {
      const signInput = input as SignInput;
      return {
        context: {
          ...ctx,
          state: States.SIGNED,
          signedAt: signInput.now,
        },
        changed: true,
      };
    }

    case Events.BROADCAST: {
      // Some orders skip signing (e.g., server-side execution)
      const broadcastInput = input as BroadcastInput;
      return {
        context: {
          ...ctx,
          state: States.BROADCASTED,
          broadcastedAt: broadcastInput.now,
        },
        changed: true,
      };
    }

    case Events.FAIL_DETERMINISTIC: {
      const failInput = input as FailDeterministicInput;
      return {
        context: {
          ...ctx,
          state: States.FAILED_DETERMINISTIC,
          failureReason: failInput.reason,
          resolvedAt: failInput.now,
        },
        changed: true,
      };
    }

    case Events.CANCEL: {
      // Cancel after creation but before broadcast = safe
      const cancelInput = input as CancelInput;
      return {
        context: {
          ...ctx,
          state: States.FAILED_DETERMINISTIC,
          failureReason: Reasons.USER_REJECTED,
          resolvedAt: cancelInput.now,
        },
        changed: true,
      };
    }

    default:
      return { context: ctx, changed: false };
  }
}

function handleSigned(
  ctx: OrderContext,
  input: OrderTransitionInput
): TransitionResult<OrderContext> {
  switch (input.event) {
    case Events.BROADCAST: {
      const broadcastInput = input as BroadcastInput;
      return {
        context: {
          ...ctx,
          state: States.BROADCASTED,
          broadcastedAt: broadcastInput.now,
        },
        changed: true,
      };
    }

    case Events.FAIL_DETERMINISTIC: {
      const failInput = input as FailDeterministicInput;
      return {
        context: {
          ...ctx,
          state: States.FAILED_DETERMINISTIC,
          failureReason: failInput.reason,
          resolvedAt: failInput.now,
        },
        changed: true,
      };
    }

    case Events.CANCEL: {
      // Cancel after signing but before broadcast = safe
      const cancelInput = input as CancelInput;
      return {
        context: {
          ...ctx,
          state: States.FAILED_DETERMINISTIC,
          failureReason: Reasons.USER_REJECTED,
          resolvedAt: cancelInput.now,
        },
        changed: true,
      };
    }

    default:
      return { context: ctx, changed: false };
  }
}

function handleBroadcasted(
  ctx: OrderContext,
  input: OrderTransitionInput
): TransitionResult<OrderContext> {
  switch (input.event) {
    case Events.CONFIRM: {
      const confirmInput = input as ConfirmInput;
      return {
        context: {
          ...ctx,
          state: States.CONFIRMED,
          resolvedAt: confirmInput.now,
        },
        changed: true,
      };
    }

    case Events.FAIL_DETERMINISTIC: {
      const failInput = input as FailDeterministicInput;
      return {
        context: {
          ...ctx,
          state: States.FAILED_DETERMINISTIC,
          failureReason: failInput.reason,
          resolvedAt: failInput.now,
        },
        changed: true,
      };
    }

    case Events.FAIL_TRANSIENT: {
      const failInput = input as FailTransientInput;
      return {
        context: {
          ...ctx,
          state: States.FAILED_TRANSIENT,
          failureReason: failInput.reason,
        },
        changed: true,
      };
    }

    case Events.MARK_UNKNOWN: {
      return {
        context: {
          ...ctx,
          state: States.UNKNOWN,
        },
        changed: true,
      };
    }

    default:
      return { context: ctx, changed: false };
  }
}

function handleFailedTransient(
  ctx: OrderContext,
  input: OrderTransitionInput
): TransitionResult<OrderContext> {
  if (input.event !== Events.RETRY) {
    return { context: ctx, changed: false };
  }

  // Check if retries exhausted
  if (ctx.retryCount >= ctx.maxRetries) {
    return {
      context: {
        ...ctx,
        state: States.FAILED_DETERMINISTIC,
        resolvedAt: (input as RetryInput).now,
      },
      changed: true,
    };
  }

  // Allow retry - go back to CREATED state
  return {
    context: {
      ...ctx,
      state: States.CREATED,
      retryCount: ctx.retryCount + 1,
      failureReason: null,
    },
    changed: true,
  };
}

function handleUnknown(
  ctx: OrderContext,
  input: OrderTransitionInput
): TransitionResult<OrderContext> {
  switch (input.event) {
    case Events.CONFIRM: {
      const confirmInput = input as ConfirmInput;
      return {
        context: {
          ...ctx,
          state: States.CONFIRMED,
          resolvedAt: confirmInput.now,
        },
        changed: true,
      };
    }

    case Events.FAIL_DETERMINISTIC: {
      const failInput = input as FailDeterministicInput;
      return {
        context: {
          ...ctx,
          state: States.FAILED_DETERMINISTIC,
          failureReason: failInput.reason,
          resolvedAt: failInput.now,
        },
        changed: true,
      };
    }

    case Events.FAIL_TRANSIENT: {
      const failInput = input as FailTransientInput;
      return {
        context: {
          ...ctx,
          state: States.FAILED_TRANSIENT,
          failureReason: failInput.reason,
        },
        changed: true,
      };
    }

    default:
      return { context: ctx, changed: false };
  }
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Check if order is in a terminal state
 */
export function isTerminal(ctx: OrderContext): boolean {
  return (TERMINAL_ORDER_STATES as readonly OrderState[]).includes(ctx.state);
}

/**
 * Check if order can be retried
 */
export function canRetry(ctx: OrderContext): boolean {
  return (
    (RETRYABLE_ORDER_STATES as readonly OrderState[]).includes(ctx.state) &&
    ctx.retryCount < ctx.maxRetries
  );
}

/**
 * Check if cancel is still safe (no on-chain effect)
 * INVARIANT: Cancel before BROADCASTED = guaranteed no on-chain trade
 */
export function isCancelSafe(ctx: OrderContext): boolean {
  return (
    ctx.state === States.NOT_CREATED ||
    ctx.state === States.CREATED ||
    ctx.state === States.SIGNED
  );
}

/**
 * Check if order has been confirmed
 */
export function isConfirmed(ctx: OrderContext): boolean {
  return ctx.state === States.CONFIRMED;
}

/**
 * Check if order has failed
 */
export function isFailed(ctx: OrderContext): boolean {
  return (
    ctx.state === States.FAILED_DETERMINISTIC ||
    ctx.state === States.FAILED_TRANSIENT
  );
}

/**
 * Check if order status is unknown (requires reconciliation)
 */
export function isUnknown(ctx: OrderContext): boolean {
  return ctx.state === States.UNKNOWN;
}

/**
 * Check if order is in progress (not terminal, not unknown)
 */
export function isInProgress(ctx: OrderContext): boolean {
  return (
    ctx.state === States.NOT_CREATED ||
    ctx.state === States.CREATED ||
    ctx.state === States.SIGNED ||
    ctx.state === States.BROADCASTED
  );
}

/**
 * Check if order has been broadcasted to chain
 */
export function isBroadcasted(ctx: OrderContext): boolean {
  return ctx.broadcastedAt !== null;
}

/**
 * Get user-friendly status message
 * Helps answer: "Did it send? Is it pending? Did it fail? Can I retry safely?"
 */
export function getStatusMessage(ctx: OrderContext): string {
  switch (ctx.state) {
    case States.NOT_CREATED:
      return 'Preparing order...';
    case States.CREATED:
      return 'Order created, awaiting signature...';
    case States.SIGNED:
      return 'Order signed, broadcasting...';
    case States.BROADCASTED:
      return 'Order sent! Waiting for confirmation...';
    case States.CONFIRMED:
      return 'Order confirmed!';
    case States.FAILED_DETERMINISTIC:
      return getFailureMessage(ctx.failureReason);
    case States.FAILED_TRANSIENT:
      return canRetry(ctx) ? 'Order timed out. Tap to retry.' : 'Order failed after retries.';
    case States.UNKNOWN:
      return 'Order status unknown. Checking...';
    default:
      return 'Unknown status';
  }
}

function getFailureMessage(reason: FailureReason | null): string {
  switch (reason) {
    case Reasons.INSUFFICIENT_FUNDS:
      return 'Insufficient funds.';
    case Reasons.SLIPPAGE_EXCEEDED:
      return 'Price changed too much. Try again.';
    case Reasons.USER_REJECTED:
      return 'Order cancelled.';
    case Reasons.NO_ROUTE:
      return 'No trading route available.';
    case Reasons.TIMEOUT:
      return 'Order timed out.';
    case Reasons.NETWORK_CONGESTION:
      return 'Network busy. Try again.';
    default:
      return 'Order failed.';
  }
}

/**
 * Validate that order belongs to gesture (exactly-once invariant)
 */
export function validateGestureOwnership(
  ctx: OrderContext,
  gestureId: GestureId
): boolean {
  return ctx.gestureId === gestureId;
}

