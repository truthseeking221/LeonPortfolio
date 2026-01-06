/**
 * Telemetry Event Definitions
 * 
 * Type-safe event definitions based on docs/06_TELEMETRY_EVENTS.md
 * Pure domain types - no IO, used by all layers for consistent event tracking.
 */

// ============================================================================
// Event Names
// ============================================================================

export const TelemetryEvent = {
  // App Lifecycle
  APP_BOOT: 'app_boot',
  APP_READY: 'app_ready',
  APP_BACKGROUND: 'app_background',
  APP_RESUME: 'app_resume',
  APP_ERROR: 'app_error',

  // Auth
  AUTH_START: 'auth_start',
  AUTH_SUCCESS: 'auth_success',
  AUTH_FAILURE: 'auth_failure',

  // Wallet
  WALLET_CONNECT_START: 'wallet_connect_start',
  WALLET_CONNECT_SUCCESS: 'wallet_connect_success',
  WALLET_CONNECT_FAILURE: 'wallet_connect_failure',
  WALLET_DISCONNECT: 'wallet_disconnect',

  // Deck
  DECK_CARD_VIEWED: 'deck_card_viewed',
  DECK_CARD_SWIPED: 'deck_card_swiped',
  DECK_BATCH_LOADED: 'deck_batch_loaded',

  // Trade
  HOLD_ARMED: 'hold_armed',
  HOLD_CANCELED: 'hold_canceled',
  TRADE_COMMIT_START: 'trade_commit_start',
  TRADE_COMMIT_SUCCESS: 'trade_commit_success',
  TRADE_COMMIT_FAILURE: 'trade_commit_failure',
  TRADE_STATUS_UPDATE: 'trade_status_update',
  TRADE_CONFIRMED: 'trade_confirmed',

  // Sell
  SELL_ALL_START: 'sell_all_start',
  SELL_ALL_SUCCESS: 'sell_all_success',
  SELL_ALL_FAILURE: 'sell_all_failure',

  // Activity
  ACTIVITY_OPENED: 'activity_opened',
  ACTIVITY_TRADE_TAPPED: 'activity_trade_tapped',
  ACTIVITY_REFRESH: 'activity_refresh',

  // Error
  ERROR_DISPLAYED: 'error_displayed',
  ERROR_RETRY_TAPPED: 'error_retry_tapped',

  // Safety
  TOKEN_REPORTED: 'token_reported',
  ACCIDENTAL_BUY_REPORT: 'accidental_buy_report',
  RISK_SIGNAL_SHOWN: 'risk_signal_shown',

  // Performance
  FRAME_DROP: 'frame_drop',
  MEDIA_LOAD_FAILURE: 'media_load_failure',
} as const;

export type TelemetryEvent = (typeof TelemetryEvent)[keyof typeof TelemetryEvent];

// ============================================================================
// Event Property Types
// ============================================================================

/** Common properties for all events */
export interface BaseEventProperties {
  readonly event_id: string;
  readonly timestamp: string;
  readonly session_id: string;
  readonly user_id?: string;
  readonly app_version: string;
  readonly platform: 'telegram_mini_app' | 'web';
  readonly env: 'staging' | 'prod';
}

// App Lifecycle
export interface AppBootProperties {
  readonly boot_source: 'cold' | 'warm' | 'resume';
}

export interface AppReadyProperties {
  readonly load_time_ms: number;
}

export interface AppBackgroundProperties {
  readonly had_active_hold: boolean;
}

export interface AppResumeProperties {
  readonly time_in_background_ms: number;
}

export interface AppErrorProperties {
  readonly error_type: string;
  readonly error_message: string;
  readonly stack?: string;
}

// Auth
export interface AuthStartProperties {
  readonly method: 'telegram';
}

export interface AuthSuccessProperties {
  readonly method: 'telegram';
}

export interface AuthFailureProperties {
  readonly method: 'telegram';
  readonly error_code: string;
}

// Wallet
export interface WalletConnectStartProperties {
  readonly wallet_type: 'tonconnect';
}

export interface WalletConnectSuccessProperties {
  readonly wallet_type: 'tonconnect';
  readonly wallet_address: string;
}

export interface WalletConnectFailureProperties {
  readonly wallet_type: 'tonconnect';
  readonly error_code: string;
}

export interface WalletDisconnectProperties {
  readonly wallet_type: 'tonconnect';
  readonly reason: 'user' | 'error';
}

// Deck
export interface DeckCardViewedProperties {
  readonly token_id: string;
  readonly position_in_deck: number;
}

export interface DeckCardSwipedProperties {
  readonly token_id: string;
  readonly direction: 'left' | 'right';
  readonly dwell_time_ms: number;
}

export interface DeckBatchLoadedProperties {
  readonly count: number;
  readonly load_time_ms: number;
}

// Trade
export interface HoldArmedProperties {
  readonly token_id: string;
  readonly dwell_time_ms: number;
}

export interface HoldCanceledProperties {
  readonly token_id: string;
  readonly cancel_method: 'swipe_up' | 'timeout' | 'background';
}

export interface TradeCommitStartProperties {
  readonly gesture_id: string;
  readonly token_id: string;
  readonly side: 'BUY' | 'SELL';
  readonly amount_base: string;
}

export interface TradeCommitSuccessProperties {
  readonly gesture_id: string;
  readonly trade_id: string;
  readonly status: string;
}

export interface TradeCommitFailureProperties {
  readonly gesture_id: string;
  readonly error_code: string;
}

export interface TradeStatusUpdateProperties {
  readonly trade_id: string;
  readonly old_status: string;
  readonly new_status: string;
}

export interface TradeConfirmedProperties {
  readonly trade_id: string;
  readonly time_to_confirm_ms: number;
}

// Sell
export interface SellAllStartProperties {
  readonly token_id: string;
  readonly amount_token: string;
}

export interface SellAllSuccessProperties {
  readonly trade_id: string;
}

export interface SellAllFailureProperties {
  readonly error_code: string;
}

// Activity
export interface ActivityOpenedProperties {
  // empty
}

export interface ActivityTradeTappedProperties {
  readonly trade_id: string;
  readonly status: string;
}

export interface ActivityRefreshProperties {
  readonly trigger: 'pull' | 'button';
}

// Error
export interface ErrorDisplayedProperties {
  readonly error_code: string;
  readonly screen: string;
}

export interface ErrorRetryTappedProperties {
  readonly error_code: string;
}

// Safety
export interface TokenReportedProperties {
  readonly token_id: string;
  readonly reason: string;
}

export interface AccidentalBuyReportProperties {
  readonly trade_id: string;
}

export interface RiskSignalShownProperties {
  readonly token_id: string;
  readonly signals: string[];
}

// Performance
export interface FrameDropProperties {
  readonly screen: string;
  readonly dropped_frames: number;
  readonly duration_ms: number;
}

export interface MediaLoadFailureProperties {
  readonly token_id: string;
  readonly media_type: 'image' | 'video';
  readonly error: string;
}

// ============================================================================
// Event Type Mapping
// ============================================================================

export interface EventPropertyMap {
  [TelemetryEvent.APP_BOOT]: AppBootProperties;
  [TelemetryEvent.APP_READY]: AppReadyProperties;
  [TelemetryEvent.APP_BACKGROUND]: AppBackgroundProperties;
  [TelemetryEvent.APP_RESUME]: AppResumeProperties;
  [TelemetryEvent.APP_ERROR]: AppErrorProperties;
  [TelemetryEvent.AUTH_START]: AuthStartProperties;
  [TelemetryEvent.AUTH_SUCCESS]: AuthSuccessProperties;
  [TelemetryEvent.AUTH_FAILURE]: AuthFailureProperties;
  [TelemetryEvent.WALLET_CONNECT_START]: WalletConnectStartProperties;
  [TelemetryEvent.WALLET_CONNECT_SUCCESS]: WalletConnectSuccessProperties;
  [TelemetryEvent.WALLET_CONNECT_FAILURE]: WalletConnectFailureProperties;
  [TelemetryEvent.WALLET_DISCONNECT]: WalletDisconnectProperties;
  [TelemetryEvent.DECK_CARD_VIEWED]: DeckCardViewedProperties;
  [TelemetryEvent.DECK_CARD_SWIPED]: DeckCardSwipedProperties;
  [TelemetryEvent.DECK_BATCH_LOADED]: DeckBatchLoadedProperties;
  [TelemetryEvent.HOLD_ARMED]: HoldArmedProperties;
  [TelemetryEvent.HOLD_CANCELED]: HoldCanceledProperties;
  [TelemetryEvent.TRADE_COMMIT_START]: TradeCommitStartProperties;
  [TelemetryEvent.TRADE_COMMIT_SUCCESS]: TradeCommitSuccessProperties;
  [TelemetryEvent.TRADE_COMMIT_FAILURE]: TradeCommitFailureProperties;
  [TelemetryEvent.TRADE_STATUS_UPDATE]: TradeStatusUpdateProperties;
  [TelemetryEvent.TRADE_CONFIRMED]: TradeConfirmedProperties;
  [TelemetryEvent.SELL_ALL_START]: SellAllStartProperties;
  [TelemetryEvent.SELL_ALL_SUCCESS]: SellAllSuccessProperties;
  [TelemetryEvent.SELL_ALL_FAILURE]: SellAllFailureProperties;
  [TelemetryEvent.ACTIVITY_OPENED]: ActivityOpenedProperties;
  [TelemetryEvent.ACTIVITY_TRADE_TAPPED]: ActivityTradeTappedProperties;
  [TelemetryEvent.ACTIVITY_REFRESH]: ActivityRefreshProperties;
  [TelemetryEvent.ERROR_DISPLAYED]: ErrorDisplayedProperties;
  [TelemetryEvent.ERROR_RETRY_TAPPED]: ErrorRetryTappedProperties;
  [TelemetryEvent.TOKEN_REPORTED]: TokenReportedProperties;
  [TelemetryEvent.ACCIDENTAL_BUY_REPORT]: AccidentalBuyReportProperties;
  [TelemetryEvent.RISK_SIGNAL_SHOWN]: RiskSignalShownProperties;
  [TelemetryEvent.FRAME_DROP]: FrameDropProperties;
  [TelemetryEvent.MEDIA_LOAD_FAILURE]: MediaLoadFailureProperties;
}

// ============================================================================
// Sampling Rates
// ============================================================================

export const EventSamplingRate: Record<TelemetryEvent, number> = {
  [TelemetryEvent.APP_BOOT]: 1,
  [TelemetryEvent.APP_READY]: 1,
  [TelemetryEvent.APP_BACKGROUND]: 1,
  [TelemetryEvent.APP_RESUME]: 1,
  [TelemetryEvent.APP_ERROR]: 1,
  [TelemetryEvent.AUTH_START]: 1,
  [TelemetryEvent.AUTH_SUCCESS]: 1,
  [TelemetryEvent.AUTH_FAILURE]: 1,
  [TelemetryEvent.WALLET_CONNECT_START]: 1,
  [TelemetryEvent.WALLET_CONNECT_SUCCESS]: 1,
  [TelemetryEvent.WALLET_CONNECT_FAILURE]: 1,
  [TelemetryEvent.WALLET_DISCONNECT]: 1,
  [TelemetryEvent.DECK_CARD_VIEWED]: 1,
  [TelemetryEvent.DECK_CARD_SWIPED]: 1,
  [TelemetryEvent.DECK_BATCH_LOADED]: 1,
  [TelemetryEvent.HOLD_ARMED]: 1,
  [TelemetryEvent.HOLD_CANCELED]: 1,
  [TelemetryEvent.TRADE_COMMIT_START]: 1,
  [TelemetryEvent.TRADE_COMMIT_SUCCESS]: 1,
  [TelemetryEvent.TRADE_COMMIT_FAILURE]: 1,
  [TelemetryEvent.TRADE_STATUS_UPDATE]: 1,
  [TelemetryEvent.TRADE_CONFIRMED]: 1,
  [TelemetryEvent.SELL_ALL_START]: 1,
  [TelemetryEvent.SELL_ALL_SUCCESS]: 1,
  [TelemetryEvent.SELL_ALL_FAILURE]: 1,
  [TelemetryEvent.ACTIVITY_OPENED]: 1,
  [TelemetryEvent.ACTIVITY_TRADE_TAPPED]: 1,
  [TelemetryEvent.ACTIVITY_REFRESH]: 1,
  [TelemetryEvent.ERROR_DISPLAYED]: 1,
  [TelemetryEvent.ERROR_RETRY_TAPPED]: 1,
  [TelemetryEvent.TOKEN_REPORTED]: 1,
  [TelemetryEvent.ACCIDENTAL_BUY_REPORT]: 1,
  [TelemetryEvent.RISK_SIGNAL_SHOWN]: 1,
  [TelemetryEvent.FRAME_DROP]: 0.1, // 10%
  [TelemetryEvent.MEDIA_LOAD_FAILURE]: 1,
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if event should be sampled (based on sampling rate)
 */
export function shouldSample(event: TelemetryEvent): boolean {
  const rate = EventSamplingRate[event];
  if (rate >= 1) return true;
  return Math.random() < rate;
}

/**
 * Type-safe event creation (domain only creates the payload shape)
 * Actual emission happens in infra layer
 */
export function createEventPayload<E extends TelemetryEvent>(
  event: E,
  properties: EventPropertyMap[E]
): { event: E; properties: EventPropertyMap[E] } {
  return { event, properties };
}

