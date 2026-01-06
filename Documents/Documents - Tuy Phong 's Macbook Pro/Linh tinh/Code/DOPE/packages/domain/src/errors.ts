/**
 * Domain Error Codes
 * 
 * Comprehensive error taxonomy based on docs/05_ERROR_CODES.md
 * Pure domain definitions - no IO, used by all layers.
 */

// ============================================================================
// Error Code Enums
// ============================================================================

/**
 * Authentication Errors (4xx)
 */
export const AuthErrorCode = {
  INVALID_INIT_DATA: 'INVALID_INIT_DATA',
  EXPIRED_INIT_DATA: 'EXPIRED_INIT_DATA',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
} as const;

export type AuthErrorCode = (typeof AuthErrorCode)[keyof typeof AuthErrorCode];

/**
 * Trading Errors (4xx)
 */
export const TradingErrorCode = {
  // Maintenance
  MAINTENANCE_TRADING_DISABLED: 'MAINTENANCE_TRADING_DISABLED',
  MAINTENANCE_BUY_DISABLED: 'MAINTENANCE_BUY_DISABLED',
  MAINTENANCE_SELL_DISABLED: 'MAINTENANCE_SELL_DISABLED',

  // Balance
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  INSUFFICIENT_GAS: 'INSUFFICIENT_GAS',
  POSITION_TOO_SMALL: 'POSITION_TOO_SMALL',

  // Quote/Pricing
  QUOTE_EXPIRED: 'QUOTE_EXPIRED',
  NO_ROUTE: 'NO_ROUTE',
  SLIPPAGE_EXCEEDED: 'SLIPPAGE_EXCEEDED',

  // Token
  TOKEN_NOT_TRADEABLE: 'TOKEN_NOT_TRADEABLE',

  // Rate limit
  RATE_LIMITED: 'RATE_LIMITED',
} as const;

export type TradingErrorCode = (typeof TradingErrorCode)[keyof typeof TradingErrorCode];

/**
 * Idempotency Errors (4xx)
 */
export const IdempotencyErrorCode = {
  GESTURE_ALREADY_USED: 'GESTURE_ALREADY_USED',
  TRADE_ALREADY_EXISTS: 'TRADE_ALREADY_EXISTS',
} as const;

export type IdempotencyErrorCode = (typeof IdempotencyErrorCode)[keyof typeof IdempotencyErrorCode];

/**
 * Server Errors (5xx)
 */
export const ServerErrorCode = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  PROVIDER_ERROR: 'PROVIDER_ERROR',
  RPC_ERROR: 'RPC_ERROR',
  TIMEOUT: 'TIMEOUT',
} as const;

export type ServerErrorCode = (typeof ServerErrorCode)[keyof typeof ServerErrorCode];

/**
 * All error codes combined
 */
export const ErrorCode = {
  ...AuthErrorCode,
  ...TradingErrorCode,
  ...IdempotencyErrorCode,
  ...ServerErrorCode,
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

// ============================================================================
// Error Result Types
// ============================================================================

/**
 * Standard error response shape
 */
export interface DomainError {
  readonly code: ErrorCode;
  readonly message: string;
  readonly details?: Record<string, unknown>;
}

/**
 * Create a domain error
 */
export function createError(
  code: ErrorCode,
  message: string,
  details?: Record<string, unknown>
): DomainError {
  if (details !== undefined) {
    return { code, message, details };
  }
  return { code, message };
}

// ============================================================================
// Error Categories
// ============================================================================

/**
 * Check if error is user-actionable (user can fix it)
 */
export function isUserActionable(code: ErrorCode): boolean {
  return (
    code === TradingErrorCode.INSUFFICIENT_BALANCE ||
    code === TradingErrorCode.INSUFFICIENT_GAS ||
    code === TradingErrorCode.SLIPPAGE_EXCEEDED ||
    code === TradingErrorCode.QUOTE_EXPIRED
  );
}

/**
 * Check if error is retry-safe
 */
export function isRetrySafe(code: ErrorCode): boolean {
  return (
    code === ServerErrorCode.PROVIDER_ERROR ||
    code === ServerErrorCode.RPC_ERROR ||
    code === ServerErrorCode.TIMEOUT ||
    code === TradingErrorCode.QUOTE_EXPIRED
  );
}

/**
 * Check if error should NOT allow retry
 */
export function isNonRetryable(code: ErrorCode): boolean {
  return (
    code === IdempotencyErrorCode.GESTURE_ALREADY_USED ||
    code === IdempotencyErrorCode.TRADE_ALREADY_EXISTS ||
    code === TradingErrorCode.TOKEN_NOT_TRADEABLE ||
    code === TradingErrorCode.NO_ROUTE
  );
}

/**
 * Check if error is a maintenance error
 */
export function isMaintenanceError(code: ErrorCode): boolean {
  return (
    code === TradingErrorCode.MAINTENANCE_TRADING_DISABLED ||
    code === TradingErrorCode.MAINTENANCE_BUY_DISABLED ||
    code === TradingErrorCode.MAINTENANCE_SELL_DISABLED
  );
}

/**
 * Check if error requires auth refresh
 */
export function requiresAuthRefresh(code: ErrorCode): boolean {
  return (
    code === AuthErrorCode.TOKEN_EXPIRED ||
    code === AuthErrorCode.INVALID_TOKEN
  );
}

/**
 * Check if error requires app reopen
 */
export function requiresAppReopen(code: ErrorCode): boolean {
  return (
    code === AuthErrorCode.INVALID_INIT_DATA ||
    code === AuthErrorCode.EXPIRED_INIT_DATA
  );
}

// ============================================================================
// User-Facing Messages
// ============================================================================

/**
 * Get user-friendly message for error code
 */
export function getErrorMessage(code: ErrorCode): string {
  switch (code) {
    // Auth
    case AuthErrorCode.INVALID_INIT_DATA:
    case AuthErrorCode.EXPIRED_INIT_DATA:
      return 'Session expired, please reopen the app.';
    case AuthErrorCode.INVALID_TOKEN:
    case AuthErrorCode.TOKEN_EXPIRED:
      return 'Please sign in again.';

    // Maintenance
    case TradingErrorCode.MAINTENANCE_TRADING_DISABLED:
      return 'Trading is temporarily paused.';
    case TradingErrorCode.MAINTENANCE_BUY_DISABLED:
      return 'Buying is temporarily disabled.';
    case TradingErrorCode.MAINTENANCE_SELL_DISABLED:
      return 'Selling is temporarily disabled.';

    // Balance
    case TradingErrorCode.INSUFFICIENT_BALANCE:
      return 'Insufficient balance. Deposit more funds.';
    case TradingErrorCode.INSUFFICIENT_GAS:
      return 'Not enough for transaction fees.';
    case TradingErrorCode.POSITION_TOO_SMALL:
      return 'Position too small to sell.';

    // Quote/Pricing
    case TradingErrorCode.QUOTE_EXPIRED:
      return 'Price quote expired. Getting new price...';
    case TradingErrorCode.NO_ROUTE:
      return 'No trading route available for this token.';
    case TradingErrorCode.SLIPPAGE_EXCEEDED:
      return 'Price changed too much. Try again or increase slippage.';

    // Token
    case TradingErrorCode.TOKEN_NOT_TRADEABLE:
      return 'This token is currently unavailable.';

    // Rate limit
    case TradingErrorCode.RATE_LIMITED:
      return 'Too many requests. Please slow down.';

    // Idempotency
    case IdempotencyErrorCode.GESTURE_ALREADY_USED:
    case IdempotencyErrorCode.TRADE_ALREADY_EXISTS:
      return 'This trade has already been submitted.';

    // Server
    case ServerErrorCode.INTERNAL_ERROR:
      return 'Something went wrong. Please try again.';
    case ServerErrorCode.PROVIDER_ERROR:
    case ServerErrorCode.RPC_ERROR:
      return 'Network issue. Please try again.';
    case ServerErrorCode.TIMEOUT:
      return 'Request timed out. Check Activity for status.';

    default:
      return 'An error occurred.';
  }
}

/**
 * Get action hint for error
 */
export function getErrorActionHint(code: ErrorCode): string | null {
  switch (code) {
    case TradingErrorCode.INSUFFICIENT_BALANCE:
      return 'Tap to deposit';
    case TradingErrorCode.INSUFFICIENT_GAS:
      return 'Tap to deposit for gas';
    case TradingErrorCode.SLIPPAGE_EXCEEDED:
      return 'Tap to retry or adjust slippage in Settings';
    case TradingErrorCode.QUOTE_EXPIRED:
      return 'Refreshing price...';
    case ServerErrorCode.TIMEOUT:
      return 'Tap to check Activity';
    case ServerErrorCode.PROVIDER_ERROR:
    case ServerErrorCode.RPC_ERROR:
      return 'Tap to retry';
    default:
      return null;
  }
}

// ============================================================================
// HTTP Status Mapping
// ============================================================================

/**
 * Get HTTP status code for error
 */
export function getHttpStatus(code: ErrorCode): number {
  // Auth errors
  if (Object.values(AuthErrorCode).includes(code as AuthErrorCode)) {
    return 401;
  }

  // Idempotency errors
  if (Object.values(IdempotencyErrorCode).includes(code as IdempotencyErrorCode)) {
    return 409;
  }

  // Rate limit
  if (code === TradingErrorCode.RATE_LIMITED) {
    return 429;
  }

  // Maintenance
  if (isMaintenanceError(code)) {
    return 503;
  }

  // Server errors
  if (code === ServerErrorCode.INTERNAL_ERROR) {
    return 500;
  }
  if (code === ServerErrorCode.PROVIDER_ERROR || code === ServerErrorCode.RPC_ERROR) {
    return 502;
  }
  if (code === ServerErrorCode.TIMEOUT) {
    return 504;
  }

  // Trading errors default to 400
  return 400;
}

