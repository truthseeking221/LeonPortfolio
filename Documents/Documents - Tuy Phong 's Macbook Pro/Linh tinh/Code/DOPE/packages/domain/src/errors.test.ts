import { describe, it, expect } from 'vitest';
import {
  ErrorCode,
  AuthErrorCode,
  TradingErrorCode,
  IdempotencyErrorCode,
  ServerErrorCode,
  createError,
  isUserActionable,
  isRetrySafe,
  isNonRetryable,
  isMaintenanceError,
  requiresAuthRefresh,
  requiresAppReopen,
  getErrorMessage,
  getErrorActionHint,
  getHttpStatus,
} from './errors.js';

describe('Error Codes Module', () => {
  describe('ErrorCode enum', () => {
    it('should have all auth error codes', () => {
      expect(ErrorCode.INVALID_INIT_DATA).toBe('INVALID_INIT_DATA');
      expect(ErrorCode.EXPIRED_INIT_DATA).toBe('EXPIRED_INIT_DATA');
      expect(ErrorCode.INVALID_TOKEN).toBe('INVALID_TOKEN');
      expect(ErrorCode.TOKEN_EXPIRED).toBe('TOKEN_EXPIRED');
    });

    it('should have all trading error codes', () => {
      expect(ErrorCode.MAINTENANCE_TRADING_DISABLED).toBe('MAINTENANCE_TRADING_DISABLED');
      expect(ErrorCode.INSUFFICIENT_BALANCE).toBe('INSUFFICIENT_BALANCE');
      expect(ErrorCode.INSUFFICIENT_GAS).toBe('INSUFFICIENT_GAS');
      expect(ErrorCode.SLIPPAGE_EXCEEDED).toBe('SLIPPAGE_EXCEEDED');
      expect(ErrorCode.NO_ROUTE).toBe('NO_ROUTE');
    });

    it('should have all idempotency error codes', () => {
      expect(ErrorCode.GESTURE_ALREADY_USED).toBe('GESTURE_ALREADY_USED');
      expect(ErrorCode.TRADE_ALREADY_EXISTS).toBe('TRADE_ALREADY_EXISTS');
    });

    it('should have all server error codes', () => {
      expect(ErrorCode.INTERNAL_ERROR).toBe('INTERNAL_ERROR');
      expect(ErrorCode.PROVIDER_ERROR).toBe('PROVIDER_ERROR');
      expect(ErrorCode.RPC_ERROR).toBe('RPC_ERROR');
      expect(ErrorCode.TIMEOUT).toBe('TIMEOUT');
    });
  });

  describe('createError', () => {
    it('should create error with code and message', () => {
      const error = createError(ErrorCode.INSUFFICIENT_BALANCE, 'Not enough TON');
      expect(error.code).toBe('INSUFFICIENT_BALANCE');
      expect(error.message).toBe('Not enough TON');
      expect(error.details).toBeUndefined();
    });

    it('should create error with details', () => {
      const error = createError(
        ErrorCode.INSUFFICIENT_BALANCE,
        'Not enough TON',
        { required: '1.5', available: '0.5' }
      );
      expect(error.details).toEqual({ required: '1.5', available: '0.5' });
    });
  });

  describe('isUserActionable', () => {
    it('should return true for actionable errors', () => {
      expect(isUserActionable(TradingErrorCode.INSUFFICIENT_BALANCE)).toBe(true);
      expect(isUserActionable(TradingErrorCode.INSUFFICIENT_GAS)).toBe(true);
      expect(isUserActionable(TradingErrorCode.SLIPPAGE_EXCEEDED)).toBe(true);
      expect(isUserActionable(TradingErrorCode.QUOTE_EXPIRED)).toBe(true);
    });

    it('should return false for non-actionable errors', () => {
      expect(isUserActionable(ServerErrorCode.INTERNAL_ERROR)).toBe(false);
      expect(isUserActionable(AuthErrorCode.INVALID_TOKEN)).toBe(false);
    });
  });

  describe('isRetrySafe', () => {
    it('should return true for retry-safe errors', () => {
      expect(isRetrySafe(ServerErrorCode.PROVIDER_ERROR)).toBe(true);
      expect(isRetrySafe(ServerErrorCode.RPC_ERROR)).toBe(true);
      expect(isRetrySafe(ServerErrorCode.TIMEOUT)).toBe(true);
      expect(isRetrySafe(TradingErrorCode.QUOTE_EXPIRED)).toBe(true);
    });

    it('should return false for non-retry-safe errors', () => {
      expect(isRetrySafe(IdempotencyErrorCode.GESTURE_ALREADY_USED)).toBe(false);
      expect(isRetrySafe(TradingErrorCode.TOKEN_NOT_TRADEABLE)).toBe(false);
    });
  });

  describe('isNonRetryable', () => {
    it('should return true for non-retryable errors', () => {
      expect(isNonRetryable(IdempotencyErrorCode.GESTURE_ALREADY_USED)).toBe(true);
      expect(isNonRetryable(IdempotencyErrorCode.TRADE_ALREADY_EXISTS)).toBe(true);
      expect(isNonRetryable(TradingErrorCode.TOKEN_NOT_TRADEABLE)).toBe(true);
      expect(isNonRetryable(TradingErrorCode.NO_ROUTE)).toBe(true);
    });

    it('should return false for retryable errors', () => {
      expect(isNonRetryable(ServerErrorCode.TIMEOUT)).toBe(false);
      expect(isNonRetryable(TradingErrorCode.SLIPPAGE_EXCEEDED)).toBe(false);
    });
  });

  describe('isMaintenanceError', () => {
    it('should return true for maintenance errors', () => {
      expect(isMaintenanceError(TradingErrorCode.MAINTENANCE_TRADING_DISABLED)).toBe(true);
      expect(isMaintenanceError(TradingErrorCode.MAINTENANCE_BUY_DISABLED)).toBe(true);
      expect(isMaintenanceError(TradingErrorCode.MAINTENANCE_SELL_DISABLED)).toBe(true);
    });

    it('should return false for non-maintenance errors', () => {
      expect(isMaintenanceError(ServerErrorCode.INTERNAL_ERROR)).toBe(false);
      expect(isMaintenanceError(TradingErrorCode.INSUFFICIENT_BALANCE)).toBe(false);
    });
  });

  describe('requiresAuthRefresh', () => {
    it('should return true for token errors', () => {
      expect(requiresAuthRefresh(AuthErrorCode.TOKEN_EXPIRED)).toBe(true);
      expect(requiresAuthRefresh(AuthErrorCode.INVALID_TOKEN)).toBe(true);
    });

    it('should return false for other errors', () => {
      expect(requiresAuthRefresh(AuthErrorCode.INVALID_INIT_DATA)).toBe(false);
      expect(requiresAuthRefresh(ServerErrorCode.INTERNAL_ERROR)).toBe(false);
    });
  });

  describe('requiresAppReopen', () => {
    it('should return true for init data errors', () => {
      expect(requiresAppReopen(AuthErrorCode.INVALID_INIT_DATA)).toBe(true);
      expect(requiresAppReopen(AuthErrorCode.EXPIRED_INIT_DATA)).toBe(true);
    });

    it('should return false for other errors', () => {
      expect(requiresAppReopen(AuthErrorCode.TOKEN_EXPIRED)).toBe(false);
      expect(requiresAppReopen(ServerErrorCode.INTERNAL_ERROR)).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('should return user-friendly messages for auth errors', () => {
      expect(getErrorMessage(AuthErrorCode.INVALID_INIT_DATA)).toContain('reopen');
      expect(getErrorMessage(AuthErrorCode.TOKEN_EXPIRED)).toContain('sign in');
    });

    it('should return user-friendly messages for trading errors', () => {
      expect(getErrorMessage(TradingErrorCode.INSUFFICIENT_BALANCE)).toContain('balance');
      expect(getErrorMessage(TradingErrorCode.SLIPPAGE_EXCEEDED)).toContain('Price');
      expect(getErrorMessage(TradingErrorCode.NO_ROUTE)).toContain('route');
    });

    it('should return user-friendly messages for maintenance errors', () => {
      expect(getErrorMessage(TradingErrorCode.MAINTENANCE_TRADING_DISABLED)).toContain('paused');
    });

    it('should return user-friendly messages for server errors', () => {
      expect(getErrorMessage(ServerErrorCode.TIMEOUT)).toContain('timed out');
      expect(getErrorMessage(ServerErrorCode.PROVIDER_ERROR)).toContain('Network');
    });
  });

  describe('getErrorActionHint', () => {
    it('should return action hints for actionable errors', () => {
      expect(getErrorActionHint(TradingErrorCode.INSUFFICIENT_BALANCE)).toContain('deposit');
      expect(getErrorActionHint(TradingErrorCode.SLIPPAGE_EXCEEDED)).toContain('retry');
      expect(getErrorActionHint(ServerErrorCode.TIMEOUT)).toContain('Activity');
    });

    it('should return null for errors without hints', () => {
      expect(getErrorActionHint(AuthErrorCode.INVALID_INIT_DATA)).toBeNull();
      expect(getErrorActionHint(TradingErrorCode.TOKEN_NOT_TRADEABLE)).toBeNull();
    });
  });

  describe('getHttpStatus', () => {
    it('should return 401 for auth errors', () => {
      expect(getHttpStatus(AuthErrorCode.INVALID_INIT_DATA)).toBe(401);
      expect(getHttpStatus(AuthErrorCode.TOKEN_EXPIRED)).toBe(401);
    });

    it('should return 409 for idempotency errors', () => {
      expect(getHttpStatus(IdempotencyErrorCode.GESTURE_ALREADY_USED)).toBe(409);
      expect(getHttpStatus(IdempotencyErrorCode.TRADE_ALREADY_EXISTS)).toBe(409);
    });

    it('should return 429 for rate limit', () => {
      expect(getHttpStatus(TradingErrorCode.RATE_LIMITED)).toBe(429);
    });

    it('should return 503 for maintenance', () => {
      expect(getHttpStatus(TradingErrorCode.MAINTENANCE_TRADING_DISABLED)).toBe(503);
    });

    it('should return 5xx for server errors', () => {
      expect(getHttpStatus(ServerErrorCode.INTERNAL_ERROR)).toBe(500);
      expect(getHttpStatus(ServerErrorCode.PROVIDER_ERROR)).toBe(502);
      expect(getHttpStatus(ServerErrorCode.TIMEOUT)).toBe(504);
    });

    it('should return 400 for trading errors', () => {
      expect(getHttpStatus(TradingErrorCode.INSUFFICIENT_BALANCE)).toBe(400);
      expect(getHttpStatus(TradingErrorCode.SLIPPAGE_EXCEEDED)).toBe(400);
    });
  });

  describe('Error handling UX rules', () => {
    it('UX Rule 1: User-actionable errors should have specific guidance', () => {
      const actionableErrors = [
        TradingErrorCode.INSUFFICIENT_BALANCE,
        TradingErrorCode.INSUFFICIENT_GAS,
        TradingErrorCode.SLIPPAGE_EXCEEDED,
      ];

      for (const code of actionableErrors) {
        expect(isUserActionable(code)).toBe(true);
        expect(getErrorMessage(code)).toBeTruthy();
        // Most should have action hints
      }
    });

    it('UX Rule 2: Retry-safe errors should show retry option', () => {
      const retrySafeErrors = [
        ServerErrorCode.PROVIDER_ERROR,
        ServerErrorCode.RPC_ERROR,
        ServerErrorCode.TIMEOUT,
      ];

      for (const code of retrySafeErrors) {
        expect(isRetrySafe(code)).toBe(true);
        expect(isNonRetryable(code)).toBe(false);
      }
    });

    it('UX Rule 3: Non-retryable errors should not show retry button', () => {
      const nonRetryableErrors = [
        IdempotencyErrorCode.GESTURE_ALREADY_USED,
        TradingErrorCode.TOKEN_NOT_TRADEABLE,
      ];

      for (const code of nonRetryableErrors) {
        expect(isNonRetryable(code)).toBe(true);
        expect(isRetrySafe(code)).toBe(false);
      }
    });

    it('UX Rule 4: Maintenance errors should show banner', () => {
      const maintenanceErrors = [
        TradingErrorCode.MAINTENANCE_TRADING_DISABLED,
        TradingErrorCode.MAINTENANCE_BUY_DISABLED,
        TradingErrorCode.MAINTENANCE_SELL_DISABLED,
      ];

      for (const code of maintenanceErrors) {
        expect(isMaintenanceError(code)).toBe(true);
        expect(getHttpStatus(code)).toBe(503);
      }
    });
  });
});

