/**
 * Balance Validation Module
 * 
 * Enforces spendable balance rules to prevent "trapped" positions.
 * 
 * PRD Hard Invariant #4:
 * "Gas reserve so user can sell at least once (panic sell)"
 * 
 * Key rules:
 * 1. Always reserve enough gas for at least one sell transaction
 * 2. User should never be stuck with a position they can't exit
 * 3. Show clear feedback when balance is insufficient
 */

import type { Timestamp } from './types.js';

// ============================================================================
// Types
// ============================================================================

/** Token/coin amount in smallest unit (e.g., nanoTON) */
export type TokenAmount = bigint;

/** Balance information for a wallet */
export interface WalletBalance {
  /** Total balance in wallet (smallest unit) */
  readonly total: TokenAmount;
  /** Reserved for gas (panic sell reserve) */
  readonly gasReserve: TokenAmount;
  /** Currently locked in pending orders */
  readonly lockedInOrders: TokenAmount;
  /** Last updated timestamp */
  readonly updatedAt: Timestamp;
}

/** Gas estimation for different operations */
export interface GasEstimates {
  /** Estimated gas for a buy transaction */
  readonly buyGas: TokenAmount;
  /** Estimated gas for a sell transaction (panic sell) */
  readonly sellGas: TokenAmount;
  /** Buffer multiplier for gas estimation (e.g., 1.2 = 20% buffer) */
  readonly bufferMultiplier: number;
}

/** Result of a spendable balance calculation */
export interface SpendableBalanceResult {
  /** Amount user can spend on buying */
  readonly spendable: TokenAmount;
  /** Total balance */
  readonly total: TokenAmount;
  /** Gas reserve held back */
  readonly gasReserve: TokenAmount;
  /** Amount locked in pending orders */
  readonly lockedInOrders: TokenAmount;
  /** Whether user can make a purchase */
  readonly canBuy: boolean;
  /** Reason if canBuy is false */
  readonly reason: SpendableReason | null;
}

export const SpendableReason = {
  INSUFFICIENT_FOR_GAS: 'INSUFFICIENT_FOR_GAS',
  INSUFFICIENT_FOR_BUY_AND_SELL: 'INSUFFICIENT_FOR_BUY_AND_SELL',
  BALANCE_LOCKED: 'BALANCE_LOCKED',
  ZERO_BALANCE: 'ZERO_BALANCE',
} as const;

export type SpendableReason = (typeof SpendableReason)[keyof typeof SpendableReason];

/** Position held by user */
export interface Position {
  /** Token/card ID */
  readonly tokenId: string;
  /** Amount held */
  readonly amount: TokenAmount;
  /** Estimated value in base currency */
  readonly estimatedValue: TokenAmount;
}

/** Result of panic sell check */
export interface PanicSellCheckResult {
  /** Whether user can execute panic sell */
  readonly canSell: boolean;
  /** Available gas for sell */
  readonly availableGas: TokenAmount;
  /** Required gas for sell */
  readonly requiredGas: TokenAmount;
  /** Reason if canSell is false */
  readonly reason: PanicSellReason | null;
}

export const PanicSellReason = {
  NO_GAS: 'NO_GAS',
  INSUFFICIENT_GAS: 'INSUFFICIENT_GAS',
  NO_POSITION: 'NO_POSITION',
} as const;

export type PanicSellReason = (typeof PanicSellReason)[keyof typeof PanicSellReason];

// ============================================================================
// Constants
// ============================================================================

/** Default gas estimates for TON network (in nanoTON) */
export const DEFAULT_GAS_ESTIMATES: GasEstimates = {
  buyGas: 50_000_000n, // 0.05 TON
  sellGas: 50_000_000n, // 0.05 TON
  bufferMultiplier: 1.5, // 50% buffer for safety
} as const;

/** Minimum balance threshold below which we warn user (in nanoTON) */
export const MIN_BALANCE_WARNING_THRESHOLD = 100_000_000n; // 0.1 TON

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create a wallet balance object
 */
export function createWalletBalance(
  total: TokenAmount,
  gasReserve: TokenAmount,
  lockedInOrders: TokenAmount = 0n,
  updatedAt: Timestamp = Date.now()
): WalletBalance {
  return {
    total,
    gasReserve,
    lockedInOrders,
    updatedAt,
  };
}

// ============================================================================
// Core Calculation Functions
// ============================================================================

/**
 * Calculate the minimum gas reserve needed for panic sell
 * 
 * This ensures user can ALWAYS sell their position, preventing trapped funds.
 */
export function calculateGasReserve(
  gasEstimates: GasEstimates = DEFAULT_GAS_ESTIMATES
): TokenAmount {
  const baseGas = gasEstimates.sellGas;
  const buffer = BigInt(Math.ceil(Number(baseGas) * (gasEstimates.bufferMultiplier - 1)));
  return baseGas + buffer;
}

/**
 * Calculate spendable balance for buying
 * 
 * Spendable = Total - GasReserve - LockedInOrders - BuyGas
 * 
 * INVARIANT: Always reserve enough for panic sell
 */
export function calculateSpendableBalance(
  balance: WalletBalance,
  gasEstimates: GasEstimates = DEFAULT_GAS_ESTIMATES
): SpendableBalanceResult {
  const { total, gasReserve, lockedInOrders } = balance;

  // Check zero balance
  if (total === 0n) {
    return {
      spendable: 0n,
      total,
      gasReserve,
      lockedInOrders,
      canBuy: false,
      reason: SpendableReason.ZERO_BALANCE,
    };
  }

  // Calculate minimum reserve (for panic sell)
  const minReserve = calculateGasReserve(gasEstimates);
  const actualReserve = gasReserve > minReserve ? gasReserve : minReserve;

  // Calculate available after reserves
  const afterReserve = total - actualReserve - lockedInOrders;

  // Check if we have enough for gas reserve
  if (afterReserve <= 0n) {
    return {
      spendable: 0n,
      total,
      gasReserve: actualReserve,
      lockedInOrders,
      canBuy: false,
      reason: total <= actualReserve
        ? SpendableReason.INSUFFICIENT_FOR_GAS
        : SpendableReason.BALANCE_LOCKED,
    };
  }

  // Also need to reserve gas for the buy transaction itself
  const buyGasWithBuffer = BigInt(
    Math.ceil(Number(gasEstimates.buyGas) * gasEstimates.bufferMultiplier)
  );

  const spendable = afterReserve - buyGasWithBuffer;

  if (spendable <= 0n) {
    return {
      spendable: 0n,
      total,
      gasReserve: actualReserve,
      lockedInOrders,
      canBuy: false,
      reason: SpendableReason.INSUFFICIENT_FOR_BUY_AND_SELL,
    };
  }

  return {
    spendable,
    total,
    gasReserve: actualReserve,
    lockedInOrders,
    canBuy: true,
    reason: null,
  };
}

/**
 * Check if user can execute a panic sell
 * 
 * INVARIANT: Panic sell must ALWAYS be possible if user has a position
 */
export function checkPanicSell(
  balance: WalletBalance,
  position: Position | null,
  gasEstimates: GasEstimates = DEFAULT_GAS_ESTIMATES
): PanicSellCheckResult {
  // No position = nothing to sell
  if (!position || position.amount === 0n) {
    return {
      canSell: false,
      availableGas: balance.total - balance.lockedInOrders,
      requiredGas: 0n,
      reason: PanicSellReason.NO_POSITION,
    };
  }

  const requiredGas = calculateGasReserve(gasEstimates);
  const availableGas = balance.total - balance.lockedInOrders;

  if (availableGas === 0n) {
    return {
      canSell: false,
      availableGas,
      requiredGas,
      reason: PanicSellReason.NO_GAS,
    };
  }

  if (availableGas < requiredGas) {
    return {
      canSell: false,
      availableGas,
      requiredGas,
      reason: PanicSellReason.INSUFFICIENT_GAS,
    };
  }

  return {
    canSell: true,
    availableGas,
    requiredGas,
    reason: null,
  };
}

/**
 * Validate a buy amount against spendable balance
 */
export function validateBuyAmount(
  amount: TokenAmount,
  balance: WalletBalance,
  gasEstimates: GasEstimates = DEFAULT_GAS_ESTIMATES
): { valid: boolean; maxAmount: TokenAmount; reason: string | null } {
  const spendable = calculateSpendableBalance(balance, gasEstimates);

  if (!spendable.canBuy) {
    return {
      valid: false,
      maxAmount: 0n,
      reason: getSpendableReasonMessage(spendable.reason),
    };
  }

  if (amount > spendable.spendable) {
    return {
      valid: false,
      maxAmount: spendable.spendable,
      reason: `Maximum spendable amount is ${formatTokenAmount(spendable.spendable)}`,
    };
  }

  return {
    valid: true,
    maxAmount: spendable.spendable,
    reason: null,
  };
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Check if balance is below warning threshold
 */
export function isLowBalance(balance: WalletBalance): boolean {
  return balance.total < MIN_BALANCE_WARNING_THRESHOLD;
}

/**
 * Check if user might get trapped (has position but low gas)
 */
export function isTrappedRisk(
  balance: WalletBalance,
  position: Position | null,
  gasEstimates: GasEstimates = DEFAULT_GAS_ESTIMATES
): boolean {
  if (!position || position.amount === 0n) {
    return false;
  }

  const panicSellCheck = checkPanicSell(balance, position, gasEstimates);
  return !panicSellCheck.canSell;
}

/**
 * Get user-friendly message for spendable reason
 */
export function getSpendableReasonMessage(reason: SpendableReason | null): string {
  switch (reason) {
    case SpendableReason.ZERO_BALANCE:
      return 'Your wallet is empty. Deposit funds to trade.';
    case SpendableReason.INSUFFICIENT_FOR_GAS:
      return 'Not enough balance for transaction fees.';
    case SpendableReason.INSUFFICIENT_FOR_BUY_AND_SELL:
      return 'Need to reserve gas for selling. Deposit more funds.';
    case SpendableReason.BALANCE_LOCKED:
      return 'Your funds are locked in pending orders.';
    default:
      return '';
  }
}

/**
 * Get user-friendly message for panic sell reason
 */
export function getPanicSellReasonMessage(reason: PanicSellReason | null): string {
  switch (reason) {
    case PanicSellReason.NO_GAS:
      return 'No funds available for transaction fees.';
    case PanicSellReason.INSUFFICIENT_GAS:
      return 'Insufficient funds for sell transaction fees.';
    case PanicSellReason.NO_POSITION:
      return 'No position to sell.';
    default:
      return '';
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format token amount for display (converts from smallest unit)
 * Assumes 9 decimals (TON standard)
 */
export function formatTokenAmount(
  amount: TokenAmount,
  decimals: number = 9
): string {
  const divisor = 10n ** BigInt(decimals);
  const whole = amount / divisor;
  const fraction = amount % divisor;

  if (fraction === 0n) {
    return whole.toString();
  }

  const fractionStr = fraction.toString().padStart(decimals, '0');
  // Trim trailing zeros
  const trimmedFraction = fractionStr.replace(/0+$/, '');

  return `${whole}.${trimmedFraction}`;
}

/**
 * Parse token amount from string (converts to smallest unit)
 */
export function parseTokenAmount(
  amountStr: string,
  decimals: number = 9
): TokenAmount {
  const [whole, fraction = ''] = amountStr.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(whole + paddedFraction);
}

/**
 * Calculate percentage of balance
 */
export function calculatePercentage(
  amount: TokenAmount,
  total: TokenAmount
): number {
  if (total === 0n) return 0;
  return Number((amount * 10000n) / total) / 100;
}

