/**
 * Domain types for DOPE state machines
 * 
 * NOTE: These types should eventually be imported from @dope/contracts
 * when that package is available. For now, we define them locally.
 */

// ============================================================================
// Common Types
// ============================================================================

/** Unique identifier for a gesture (pointer interaction) */
export type GestureId = string & { readonly _brand: 'GestureId' };

/** Unique identifier for an order */
export type OrderId = string & { readonly _brand: 'OrderId' };

/** Unique identifier for a card/token */
export type CardId = string & { readonly _brand: 'CardId' };

/** Unix timestamp in milliseconds */
export type Timestamp = number;

// ============================================================================
// App Lifecycle Types
// ============================================================================

export const AppState = {
  BOOT: 'BOOT',
  READY: 'READY',
  BACKGROUND: 'BACKGROUND',
  RESUME_SYNC: 'RESUME_SYNC',
  OFFLINE_DEGRADED: 'OFFLINE_DEGRADED',
  MAINTENANCE: 'MAINTENANCE',
} as const;

export type AppState = (typeof AppState)[keyof typeof AppState];

export const AppEvent = {
  INIT_COMPLETE: 'INIT_COMPLETE',
  GO_BACKGROUND: 'GO_BACKGROUND',
  RESUME: 'RESUME',
  SYNC_COMPLETE: 'SYNC_COMPLETE',
  NETWORK_LOST: 'NETWORK_LOST',
  NETWORK_RESTORED: 'NETWORK_RESTORED',
  MAINTENANCE_START: 'MAINTENANCE_START',
  MAINTENANCE_END: 'MAINTENANCE_END',
} as const;

export type AppEvent = (typeof AppEvent)[keyof typeof AppEvent];

export interface AppContext {
  readonly state: AppState;
  readonly lastSyncAt: Timestamp | null;
  readonly isOnline: boolean;
}

// ============================================================================
// Card Interaction Types
// ============================================================================

export const CardState = {
  DISCOVERING: 'DISCOVERING',
  HOLD_POSSIBLE: 'HOLD_POSSIBLE',
  HOLD_ARMED: 'HOLD_ARMED',
  HOLD_CANCELED: 'HOLD_CANCELED',
  COMMITTING_BUY: 'COMMITTING_BUY',
  HOLDING_POSITION: 'HOLDING_POSITION',
  COMMITTING_SELL: 'COMMITTING_SELL',
  RESOLVED: 'RESOLVED',
} as const;

export type CardState = (typeof CardState)[keyof typeof CardState];

export const CardEvent = {
  POINTER_DOWN: 'POINTER_DOWN',
  POINTER_MOVE: 'POINTER_MOVE',
  POINTER_UP: 'POINTER_UP',
  ARM_TIMEOUT: 'ARM_TIMEOUT',
  CANCEL: 'CANCEL',
  COMMIT_BUY: 'COMMIT_BUY',
  BUY_SUCCESS: 'BUY_SUCCESS',
  BUY_FAILED: 'BUY_FAILED',
  PANIC_SELL: 'PANIC_SELL',
  SELL_SUCCESS: 'SELL_SUCCESS',
  SELL_FAILED: 'SELL_FAILED',
  SWIPE_DETECTED: 'SWIPE_DETECTED',
  RESET: 'RESET',
} as const;

export type CardEvent = (typeof CardEvent)[keyof typeof CardEvent];

/** Configuration for gesture disambiguation */
export interface GestureConfig {
  /** Minimum dwell time in ms before arming buy */
  readonly ARM_MS: number;
  /** Maximum movement in px allowed during hold */
  readonly MOVE_PX: number;
}

/** Default gesture configuration */
export const DEFAULT_GESTURE_CONFIG: GestureConfig = {
  ARM_MS: 300,
  MOVE_PX: 10,
} as const;

export interface PointerPosition {
  readonly x: number;
  readonly y: number;
}

export interface CardContext {
  readonly state: CardState;
  readonly cardId: CardId | null;
  readonly gestureId: GestureId | null;
  readonly holdStartAt: Timestamp | null;
  readonly holdStartPosition: PointerPosition | null;
  readonly totalMovement: number;
  readonly orderId: OrderId | null;
}

// ============================================================================
// Order Resolution Types
// ============================================================================

export const OrderState = {
  NOT_CREATED: 'NOT_CREATED',
  CREATED: 'CREATED',
  SIGNED: 'SIGNED',
  BROADCASTED: 'BROADCASTED',
  CONFIRMED: 'CONFIRMED',
  FAILED_DETERMINISTIC: 'FAILED_DETERMINISTIC',
  FAILED_TRANSIENT: 'FAILED_TRANSIENT',
  UNKNOWN: 'UNKNOWN',
} as const;

export type OrderState = (typeof OrderState)[keyof typeof OrderState];

export const OrderEvent = {
  CREATE: 'CREATE',
  SIGN: 'SIGN',
  BROADCAST: 'BROADCAST',
  CONFIRM: 'CONFIRM',
  FAIL_DETERMINISTIC: 'FAIL_DETERMINISTIC',
  FAIL_TRANSIENT: 'FAIL_TRANSIENT',
  MARK_UNKNOWN: 'MARK_UNKNOWN',
  RETRY: 'RETRY',
  CANCEL: 'CANCEL',
} as const;

export type OrderEvent = (typeof OrderEvent)[keyof typeof OrderEvent];

export const OrderType = {
  BUY: 'BUY',
  SELL: 'SELL',
} as const;

export type OrderType = (typeof OrderType)[keyof typeof OrderType];

export const FailureReason = {
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  SLIPPAGE_EXCEEDED: 'SLIPPAGE_EXCEEDED',
  USER_REJECTED: 'USER_REJECTED',
  NO_ROUTE: 'NO_ROUTE',
  TIMEOUT: 'TIMEOUT',
  NETWORK_CONGESTION: 'NETWORK_CONGESTION',
  UNKNOWN: 'UNKNOWN',
} as const;

export type FailureReason = (typeof FailureReason)[keyof typeof FailureReason];

export interface OrderContext {
  readonly state: OrderState;
  readonly orderId: OrderId | null;
  readonly gestureId: GestureId;
  readonly orderType: OrderType;
  readonly cardId: CardId;
  readonly createdAt: Timestamp | null;
  readonly signedAt: Timestamp | null;
  readonly broadcastedAt: Timestamp | null;
  readonly resolvedAt: Timestamp | null;
  readonly failureReason: FailureReason | null;
  readonly retryCount: number;
  readonly maxRetries: number;
}

// ============================================================================
// State Machine Result Types
// ============================================================================

export interface TransitionResult<TContext> {
  readonly context: TContext;
  readonly changed: boolean;
}

/** Terminal states that cannot transition further */
export const TERMINAL_ORDER_STATES: readonly OrderState[] = [
  OrderState.CONFIRMED,
  OrderState.FAILED_DETERMINISTIC,
] as const;

/** States that allow retry */
export const RETRYABLE_ORDER_STATES: readonly OrderState[] = [
  OrderState.FAILED_TRANSIENT,
] as const;

