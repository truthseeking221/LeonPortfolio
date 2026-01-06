/**
 * @dope/domain - Pure domain logic for DOPE
 * 
 * This package contains:
 * - State machines (app lifecycle, card interaction, order resolution)
 * - Balance validation (gas reserve, spendable balance)
 * - Business invariants
 * - Pure functions (no IO)
 * - Validation rules
 * 
 * Key invariants enforced:
 * 1. Exactly-once trade per gesture_id
 * 2. Cancel always safe (before broadcast)
 * 3. No ambiguous money state
 * 4. Gas reserve for panic sell (prevent trapped positions)
 * 5. Deterministic transitions
 */

// ============================================================================
// Types
// ============================================================================

export {
  // Common types
  type GestureId,
  type OrderId,
  type CardId,
  type Timestamp,
  type TransitionResult,

  // App lifecycle
  AppState,
  AppEvent,
  type AppContext,

  // Card interaction
  CardState,
  CardEvent,
  type CardContext,
  type GestureConfig,
  type PointerPosition,
  DEFAULT_GESTURE_CONFIG,

  // Order resolution
  OrderState,
  OrderEvent,
  OrderType,
  FailureReason,
  type OrderContext,
  TERMINAL_ORDER_STATES,
  RETRYABLE_ORDER_STATES,
} from './types.js';

// ============================================================================
// App Lifecycle Machine
// ============================================================================

export {
  // Factory
  createAppContext,

  // Transition
  transitionApp,
  canTransition as canTransitionApp,
  type AppTransitionInput,

  // Queries
  canTrade,
  isDegraded,
  needsSync,
  isReady,
  isBackground,
  isBooting,
} from './app.js';

// ============================================================================
// Card Interaction Machine
// ============================================================================

export {
  // Factory
  createCardContext,
  createGestureId,

  // Geometry
  calculateDistance,

  // Transition
  transitionCard,
  canTransition as canTransitionCard,
  type CardTransitionInput,
  type PointerDownInput,
  type PointerMoveInput,
  type PointerUpInput,
  type ArmTimeoutInput,
  type BuySuccessInput,
  type BuyFailedInput,
  type PanicSellInput,
  type SellSuccessInput,
  type SellFailedInput,

  // Queries
  isArmed,
  isCommitting,
  isHolding,
  isCancelSafe as isCardCancelSafe,
  isResolved,
  isGestureActive,
  getHoldDuration,
  shouldArm,
} from './card.js';

// ============================================================================
// Order Resolution Machine
// ============================================================================

export {
  // Factory
  createOrderContext,
  createOrderId,
  type CreateOrderContextInput,

  // Transition
  transitionOrder,
  canTransition as canTransitionOrder,
  type OrderTransitionInput,
  type CreateInput,
  type SignInput,
  type BroadcastInput,
  type ConfirmInput,
  type FailDeterministicInput,
  type FailTransientInput,
  type MarkUnknownInput,
  type RetryInput,
  type CancelInput,

  // Queries
  isTerminal,
  canRetry,
  isCancelSafe as isOrderCancelSafe,
  isConfirmed,
  isFailed,
  isUnknown,
  isInProgress,
  isBroadcasted,
  getStatusMessage,
  validateGestureOwnership,
} from './order.js';

// ============================================================================
// Balance Validation (PRD Invariant #4: Gas reserve for panic sell)
// ============================================================================

export {
  // Types
  type TokenAmount,
  type WalletBalance,
  type GasEstimates,
  type SpendableBalanceResult,
  type Position,
  type PanicSellCheckResult,
  SpendableReason,
  PanicSellReason,

  // Constants
  DEFAULT_GAS_ESTIMATES,
  MIN_BALANCE_WARNING_THRESHOLD,

  // Factory
  createWalletBalance,

  // Core calculations
  calculateGasReserve,
  calculateSpendableBalance,
  checkPanicSell,
  validateBuyAmount,

  // Query functions
  isLowBalance,
  isTrappedRisk,
  getSpendableReasonMessage,
  getPanicSellReasonMessage,

  // Utilities
  formatTokenAmount,
  parseTokenAmount,
  calculatePercentage,
} from './balance.js';

// ============================================================================
// Error Codes (based on docs/05_ERROR_CODES.md)
// ============================================================================

export {
  // Enums
  AuthErrorCode,
  TradingErrorCode,
  IdempotencyErrorCode,
  ServerErrorCode,
  ErrorCode,

  // Types
  type DomainError,

  // Factory
  createError,

  // Category checks
  isUserActionable,
  isRetrySafe,
  isNonRetryable,
  isMaintenanceError,
  requiresAuthRefresh,
  requiresAppReopen,

  // User-facing
  getErrorMessage,
  getErrorActionHint,
  getHttpStatus,
} from './errors.js';

// ============================================================================
// Telemetry Events (based on docs/06_TELEMETRY_EVENTS.md)
// ============================================================================

export {
  // Event names
  TelemetryEvent,

  // Common types
  type BaseEventProperties,

  // Event property types
  type AppBootProperties,
  type AppReadyProperties,
  type AppBackgroundProperties,
  type AppResumeProperties,
  type AppErrorProperties,
  type AuthStartProperties,
  type AuthSuccessProperties,
  type AuthFailureProperties,
  type WalletConnectStartProperties,
  type WalletConnectSuccessProperties,
  type WalletConnectFailureProperties,
  type WalletDisconnectProperties,
  type DeckCardViewedProperties,
  type DeckCardSwipedProperties,
  type DeckBatchLoadedProperties,
  type HoldArmedProperties,
  type HoldCanceledProperties,
  type TradeCommitStartProperties,
  type TradeCommitSuccessProperties,
  type TradeCommitFailureProperties,
  type TradeStatusUpdateProperties,
  type TradeConfirmedProperties,
  type SellAllStartProperties,
  type SellAllSuccessProperties,
  type SellAllFailureProperties,
  type ActivityOpenedProperties,
  type ActivityTradeTappedProperties,
  type ActivityRefreshProperties,
  type ErrorDisplayedProperties,
  type ErrorRetryTappedProperties,
  type TokenReportedProperties,
  type AccidentalBuyReportProperties,
  type RiskSignalShownProperties,
  type FrameDropProperties,
  type MediaLoadFailureProperties,

  // Type mapping
  type EventPropertyMap,

  // Sampling
  EventSamplingRate,
  shouldSample,

  // Helper
  createEventPayload,
} from './telemetry.js';

