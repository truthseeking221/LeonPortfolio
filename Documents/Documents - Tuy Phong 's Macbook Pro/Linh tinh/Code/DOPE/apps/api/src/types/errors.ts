/**
 * Error types and codes per docs/05_ERROR_CODES.md
 * 
 * All API errors return:
 * {
 *   "error": {
 *     "code": "ERROR_CODE",
 *     "message": "Human readable message",
 *     "details": { ... }
 *   }
 * }
 */

// ============================================================================
// Error Codes
// ============================================================================

export const ErrorCode = {
  // Authentication Errors (4xx)
  INVALID_INIT_DATA: 'INVALID_INIT_DATA',
  EXPIRED_INIT_DATA: 'EXPIRED_INIT_DATA',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Trading Errors (4xx)
  MAINTENANCE_TRADING_DISABLED: 'MAINTENANCE_TRADING_DISABLED',
  MAINTENANCE_BUY_DISABLED: 'MAINTENANCE_BUY_DISABLED',
  MAINTENANCE_SELL_DISABLED: 'MAINTENANCE_SELL_DISABLED',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  INSUFFICIENT_GAS: 'INSUFFICIENT_GAS',
  QUOTE_EXPIRED: 'QUOTE_EXPIRED',
  NO_ROUTE: 'NO_ROUTE',
  SLIPPAGE_EXCEEDED: 'SLIPPAGE_EXCEEDED',
  TOKEN_NOT_TRADEABLE: 'TOKEN_NOT_TRADEABLE',
  POSITION_TOO_SMALL: 'POSITION_TOO_SMALL',
  RATE_LIMITED: 'RATE_LIMITED',
  
  // Idempotency Errors (4xx)
  GESTURE_ALREADY_USED: 'GESTURE_ALREADY_USED',
  TRADE_ALREADY_EXISTS: 'TRADE_ALREADY_EXISTS',
  
  // Validation Errors (4xx)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  
  // Server Errors (5xx)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  PROVIDER_ERROR: 'PROVIDER_ERROR',
  RPC_ERROR: 'RPC_ERROR',
  TIMEOUT: 'TIMEOUT',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

// ============================================================================
// HTTP Status Code Mapping
// ============================================================================

export const ErrorHttpStatus: Record<ErrorCode, number> = {
  // Auth - 401
  INVALID_INIT_DATA: 401,
  EXPIRED_INIT_DATA: 401,
  INVALID_TOKEN: 401,
  TOKEN_EXPIRED: 401,
  
  // Maintenance - 503
  MAINTENANCE_TRADING_DISABLED: 503,
  MAINTENANCE_BUY_DISABLED: 503,
  MAINTENANCE_SELL_DISABLED: 503,
  
  // Client errors - 400
  INSUFFICIENT_BALANCE: 400,
  INSUFFICIENT_GAS: 400,
  QUOTE_EXPIRED: 400,
  NO_ROUTE: 400,
  SLIPPAGE_EXCEEDED: 400,
  TOKEN_NOT_TRADEABLE: 400,
  POSITION_TOO_SMALL: 400,
  VALIDATION_ERROR: 400,
  
  // Rate limit - 429
  RATE_LIMITED: 429,
  
  // Idempotency - 409
  GESTURE_ALREADY_USED: 409,
  TRADE_ALREADY_EXISTS: 409,
  
  // Not found - 404
  NOT_FOUND: 404,
  
  // Server errors - 5xx
  INTERNAL_ERROR: 500,
  PROVIDER_ERROR: 502,
  RPC_ERROR: 502,
  TIMEOUT: 504,
} as const;

// ============================================================================
// Error Response Types
// ============================================================================

export interface ErrorDetails {
  readonly [key: string]: unknown;
}

export interface ApiErrorResponse {
  readonly error: {
    readonly code: ErrorCode;
    readonly message: string;
    readonly details?: ErrorDetails;
  };
}

// ============================================================================
// Custom Error Class
// ============================================================================

export class ApiError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly details?: ErrorDetails;

  constructor(code: ErrorCode, message: string, details?: ErrorDetails) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = ErrorHttpStatus[code];
    this.details = details;
  }

  toResponse(): ApiErrorResponse {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.details && { details: this.details }),
      },
    };
  }
}

// ============================================================================
// Error Factory Functions
// ============================================================================

export function maintenanceError(): ApiError {
  return new ApiError(
    ErrorCode.MAINTENANCE_TRADING_DISABLED,
    'Trading is temporarily disabled for maintenance'
  );
}

export function buyDisabledError(): ApiError {
  return new ApiError(
    ErrorCode.MAINTENANCE_BUY_DISABLED,
    'Buying is temporarily disabled'
  );
}

export function sellDisabledError(): ApiError {
  return new ApiError(
    ErrorCode.MAINTENANCE_SELL_DISABLED,
    'Selling is temporarily disabled'
  );
}

export function validationError(message: string, details?: ErrorDetails): ApiError {
  return new ApiError(ErrorCode.VALIDATION_ERROR, message, details);
}

export function notFoundError(resource: string): ApiError {
  return new ApiError(ErrorCode.NOT_FOUND, `${resource} not found`);
}

export function internalError(message = 'An unexpected error occurred'): ApiError {
  return new ApiError(ErrorCode.INTERNAL_ERROR, message);
}

export function rateLimitedError(): ApiError {
  return new ApiError(ErrorCode.RATE_LIMITED, 'Too many requests, please slow down');
}

