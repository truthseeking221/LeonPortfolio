import { describe, it, expect } from 'vitest';
import {
  createWalletBalance,
  calculateGasReserve,
  calculateSpendableBalance,
  checkPanicSell,
  validateBuyAmount,
  isLowBalance,
  isTrappedRisk,
  getSpendableReasonMessage,
  getPanicSellReasonMessage,
  formatTokenAmount,
  parseTokenAmount,
  calculatePercentage,
  DEFAULT_GAS_ESTIMATES,
  MIN_BALANCE_WARNING_THRESHOLD,
  SpendableReason,
  PanicSellReason,
  type GasEstimates,
  type Position,
} from './balance.js';

describe('Balance Validation Module', () => {
  // 1 TON = 1_000_000_000 nanoTON
  const TON = 1_000_000_000n;

  describe('createWalletBalance', () => {
    it('should create wallet balance with all fields', () => {
      const balance = createWalletBalance(
        10n * TON,
        1n * TON,
        2n * TON,
        1704067200000
      );

      expect(balance.total).toBe(10n * TON);
      expect(balance.gasReserve).toBe(1n * TON);
      expect(balance.lockedInOrders).toBe(2n * TON);
      expect(balance.updatedAt).toBe(1704067200000);
    });

    it('should use defaults for optional fields', () => {
      const balance = createWalletBalance(5n * TON, 500_000_000n);

      expect(balance.total).toBe(5n * TON);
      expect(balance.gasReserve).toBe(500_000_000n);
      expect(balance.lockedInOrders).toBe(0n);
      expect(balance.updatedAt).toBeGreaterThan(0);
    });
  });

  describe('calculateGasReserve', () => {
    it('should calculate gas reserve with default estimates', () => {
      const reserve = calculateGasReserve();
      // 50_000_000n * 1.5 = 75_000_000n
      expect(reserve).toBe(75_000_000n);
    });

    it('should calculate gas reserve with custom estimates', () => {
      const customEstimates: GasEstimates = {
        buyGas: 100_000_000n,
        sellGas: 100_000_000n,
        bufferMultiplier: 2.0,
      };
      const reserve = calculateGasReserve(customEstimates);
      // 100_000_000n * 2.0 = 200_000_000n
      expect(reserve).toBe(200_000_000n);
    });
  });

  describe('calculateSpendableBalance', () => {
    it('should return zero spendable for zero balance', () => {
      const balance = createWalletBalance(0n, 0n);
      const result = calculateSpendableBalance(balance);

      expect(result.spendable).toBe(0n);
      expect(result.canBuy).toBe(false);
      expect(result.reason).toBe(SpendableReason.ZERO_BALANCE);
    });

    it('should return zero spendable when balance <= gas reserve', () => {
      const balance = createWalletBalance(50_000_000n, 0n); // 0.05 TON
      const result = calculateSpendableBalance(balance);

      expect(result.spendable).toBe(0n);
      expect(result.canBuy).toBe(false);
      expect(result.reason).toBe(SpendableReason.INSUFFICIENT_FOR_GAS);
    });

    it('should calculate spendable correctly with sufficient balance', () => {
      // 10 TON total, 0.1 TON gas reserve, nothing locked
      const balance = createWalletBalance(10n * TON, 100_000_000n, 0n);
      const result = calculateSpendableBalance(balance);

      // Spendable = Total - max(gasReserve, minReserve) - lockedInOrders - buyGasWithBuffer
      // minReserve = 75_000_000 (sellGas * 1.5)
      // actualReserve = max(100_000_000, 75_000_000) = 100_000_000
      // buyGasWithBuffer = 50_000_000 * 1.5 = 75_000_000
      // Spendable = 10_000_000_000 - 100_000_000 - 0 - 75_000_000 = 9_825_000_000
      expect(result.spendable).toBe(9_825_000_000n);
      expect(result.canBuy).toBe(true);
      expect(result.reason).toBeNull();
    });

    it('should account for locked orders', () => {
      const balance = createWalletBalance(10n * TON, 100_000_000n, 5n * TON);
      const result = calculateSpendableBalance(balance);

      // Spendable = 10 TON - 0.1 TON - 5 TON - 0.075 TON = 4.825 TON
      expect(result.spendable).toBe(4_825_000_000n);
      expect(result.canBuy).toBe(true);
      expect(result.lockedInOrders).toBe(5n * TON);
    });

    it('should return BALANCE_LOCKED when all funds locked', () => {
      const balance = createWalletBalance(10n * TON, 100_000_000n, 10n * TON);
      const result = calculateSpendableBalance(balance);

      expect(result.spendable).toBe(0n);
      expect(result.canBuy).toBe(false);
      expect(result.reason).toBe(SpendableReason.BALANCE_LOCKED);
    });

    it('should return INSUFFICIENT_FOR_BUY_AND_SELL when barely enough for reserves', () => {
      // Just enough for gas reserve but not buy gas
      const balance = createWalletBalance(100_000_000n, 0n, 0n);
      const result = calculateSpendableBalance(balance);

      expect(result.canBuy).toBe(false);
      expect(result.reason).toBe(SpendableReason.INSUFFICIENT_FOR_BUY_AND_SELL);
    });
  });

  describe('checkPanicSell', () => {
    it('should return NO_POSITION when no position', () => {
      const balance = createWalletBalance(10n * TON, 100_000_000n);
      const result = checkPanicSell(balance, null);

      expect(result.canSell).toBe(false);
      expect(result.reason).toBe(PanicSellReason.NO_POSITION);
    });

    it('should return NO_POSITION when position amount is zero', () => {
      const balance = createWalletBalance(10n * TON, 100_000_000n);
      const position: Position = {
        tokenId: 'token-1',
        amount: 0n,
        estimatedValue: 0n,
      };
      const result = checkPanicSell(balance, position);

      expect(result.canSell).toBe(false);
      expect(result.reason).toBe(PanicSellReason.NO_POSITION);
    });

    it('should return NO_GAS when zero available gas', () => {
      const balance = createWalletBalance(0n, 0n);
      const position: Position = {
        tokenId: 'token-1',
        amount: 100n * TON,
        estimatedValue: 100n * TON,
      };
      const result = checkPanicSell(balance, position);

      expect(result.canSell).toBe(false);
      expect(result.reason).toBe(PanicSellReason.NO_GAS);
    });

    it('should return INSUFFICIENT_GAS when not enough for sell', () => {
      // Has some gas but not enough (less than 75_000_000n)
      const balance = createWalletBalance(50_000_000n, 0n);
      const position: Position = {
        tokenId: 'token-1',
        amount: 100n * TON,
        estimatedValue: 100n * TON,
      };
      const result = checkPanicSell(balance, position);

      expect(result.canSell).toBe(false);
      expect(result.reason).toBe(PanicSellReason.INSUFFICIENT_GAS);
    });

    it('should return canSell=true with sufficient gas', () => {
      const balance = createWalletBalance(1n * TON, 100_000_000n);
      const position: Position = {
        tokenId: 'token-1',
        amount: 100n * TON,
        estimatedValue: 100n * TON,
      };
      const result = checkPanicSell(balance, position);

      expect(result.canSell).toBe(true);
      expect(result.reason).toBeNull();
      expect(result.availableGas).toBe(1n * TON);
      expect(result.requiredGas).toBe(75_000_000n);
    });

    it('should exclude locked orders from available gas', () => {
      const balance = createWalletBalance(1n * TON, 0n, 900_000_000n);
      const position: Position = {
        tokenId: 'token-1',
        amount: 100n * TON,
        estimatedValue: 100n * TON,
      };
      const result = checkPanicSell(balance, position);

      // Available = 1 TON - 0.9 TON locked = 0.1 TON = 100_000_000n
      expect(result.canSell).toBe(true);
      expect(result.availableGas).toBe(100_000_000n);
    });
  });

  describe('validateBuyAmount', () => {
    it('should validate amount within spendable', () => {
      const balance = createWalletBalance(10n * TON, 100_000_000n);
      const result = validateBuyAmount(1n * TON, balance);

      expect(result.valid).toBe(true);
      expect(result.reason).toBeNull();
    });

    it('should reject amount exceeding spendable', () => {
      const balance = createWalletBalance(10n * TON, 100_000_000n);
      const result = validateBuyAmount(15n * TON, balance);

      expect(result.valid).toBe(false);
      expect(result.maxAmount).toBeLessThan(15n * TON);
      expect(result.reason).toContain('Maximum spendable');
    });

    it('should reject when cannot buy at all', () => {
      const balance = createWalletBalance(0n, 0n);
      const result = validateBuyAmount(1n * TON, balance);

      expect(result.valid).toBe(false);
      expect(result.maxAmount).toBe(0n);
    });
  });

  describe('isLowBalance', () => {
    it('should return true below threshold', () => {
      const balance = createWalletBalance(50_000_000n, 0n); // 0.05 TON
      expect(isLowBalance(balance)).toBe(true);
    });

    it('should return false above threshold', () => {
      const balance = createWalletBalance(1n * TON, 0n);
      expect(isLowBalance(balance)).toBe(false);
    });

    it('should return true at exactly threshold', () => {
      const balance = createWalletBalance(MIN_BALANCE_WARNING_THRESHOLD - 1n, 0n);
      expect(isLowBalance(balance)).toBe(true);
    });
  });

  describe('isTrappedRisk', () => {
    it('should return false with no position', () => {
      const balance = createWalletBalance(0n, 0n);
      expect(isTrappedRisk(balance, null)).toBe(false);
    });

    it('should return true when has position but cannot sell', () => {
      const balance = createWalletBalance(10_000_000n, 0n); // Only 0.01 TON
      const position: Position = {
        tokenId: 'token-1',
        amount: 100n * TON,
        estimatedValue: 100n * TON,
      };
      expect(isTrappedRisk(balance, position)).toBe(true);
    });

    it('should return false when can sell', () => {
      const balance = createWalletBalance(1n * TON, 0n);
      const position: Position = {
        tokenId: 'token-1',
        amount: 100n * TON,
        estimatedValue: 100n * TON,
      };
      expect(isTrappedRisk(balance, position)).toBe(false);
    });
  });

  describe('getSpendableReasonMessage', () => {
    it('should return appropriate messages', () => {
      expect(getSpendableReasonMessage(SpendableReason.ZERO_BALANCE))
        .toContain('empty');
      expect(getSpendableReasonMessage(SpendableReason.INSUFFICIENT_FOR_GAS))
        .toContain('transaction fees');
      expect(getSpendableReasonMessage(SpendableReason.INSUFFICIENT_FOR_BUY_AND_SELL))
        .toContain('reserve gas');
      expect(getSpendableReasonMessage(SpendableReason.BALANCE_LOCKED))
        .toContain('locked');
      expect(getSpendableReasonMessage(null)).toBe('');
    });
  });

  describe('getPanicSellReasonMessage', () => {
    it('should return appropriate messages', () => {
      expect(getPanicSellReasonMessage(PanicSellReason.NO_GAS))
        .toContain('No funds');
      expect(getPanicSellReasonMessage(PanicSellReason.INSUFFICIENT_GAS))
        .toContain('Insufficient');
      expect(getPanicSellReasonMessage(PanicSellReason.NO_POSITION))
        .toContain('No position');
      expect(getPanicSellReasonMessage(null)).toBe('');
    });
  });

  describe('formatTokenAmount', () => {
    it('should format whole numbers', () => {
      expect(formatTokenAmount(1n * TON)).toBe('1');
      expect(formatTokenAmount(10n * TON)).toBe('10');
      expect(formatTokenAmount(0n)).toBe('0');
    });

    it('should format fractional amounts', () => {
      expect(formatTokenAmount(1_500_000_000n)).toBe('1.5');
      expect(formatTokenAmount(1_234_567_890n)).toBe('1.23456789');
      expect(formatTokenAmount(100_000_000n)).toBe('0.1');
    });

    it('should trim trailing zeros', () => {
      expect(formatTokenAmount(1_100_000_000n)).toBe('1.1');
      expect(formatTokenAmount(1_010_000_000n)).toBe('1.01');
    });
  });

  describe('parseTokenAmount', () => {
    it('should parse whole numbers', () => {
      expect(parseTokenAmount('1')).toBe(1n * TON);
      expect(parseTokenAmount('10')).toBe(10n * TON);
      expect(parseTokenAmount('0')).toBe(0n);
    });

    it('should parse fractional amounts', () => {
      expect(parseTokenAmount('1.5')).toBe(1_500_000_000n);
      expect(parseTokenAmount('0.1')).toBe(100_000_000n);
      expect(parseTokenAmount('1.23456789')).toBe(1_234_567_890n);
    });

    it('should handle trailing decimals', () => {
      expect(parseTokenAmount('1.10')).toBe(1_100_000_000n);
    });
  });

  describe('calculatePercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(calculatePercentage(50n * TON, 100n * TON)).toBe(50);
      expect(calculatePercentage(25n * TON, 100n * TON)).toBe(25);
      expect(calculatePercentage(1n * TON, 100n * TON)).toBe(1);
    });

    it('should handle zero total', () => {
      expect(calculatePercentage(50n * TON, 0n)).toBe(0);
    });

    it('should handle fractional percentages', () => {
      expect(calculatePercentage(1n * TON, 300n * TON)).toBeCloseTo(0.33, 1);
    });
  });

  describe('PRD Invariant: Panic sell always possible', () => {
    it('INVARIANT: If user has position, panic sell check indicates trapped risk', () => {
      const lowBalance = createWalletBalance(10_000_000n, 0n);
      const position: Position = {
        tokenId: 'token-1',
        amount: 1000n * TON,
        estimatedValue: 1000n * TON,
      };

      const canSell = checkPanicSell(lowBalance, position);
      const isTrapped = isTrappedRisk(lowBalance, position);

      // Both should agree
      expect(canSell.canSell).toBe(false);
      expect(isTrapped).toBe(true);

      // User gets clear message
      expect(getPanicSellReasonMessage(canSell.reason)).toBeTruthy();
    });

    it('INVARIANT: Spendable calculation always reserves sell gas', () => {
      const balance = createWalletBalance(1n * TON, 0n);
      const spendable = calculateSpendableBalance(balance);

      // Even if user spends all spendable, they should have sell gas left
      const afterBuy = createWalletBalance(
        balance.total - spendable.spendable,
        0n
      );

      const position: Position = {
        tokenId: 'token-1',
        amount: 100n * TON,
        estimatedValue: spendable.spendable,
      };

      const canSellAfterBuy = checkPanicSell(afterBuy, position);
      expect(canSellAfterBuy.canSell).toBe(true);
    });
  });
});

