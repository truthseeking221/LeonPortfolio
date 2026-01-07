/**
 * Wallet endpoints - Deposit & Withdraw flow
 * 
 * GET  /v1/wallet          - Get wallet info + deposit address
 * GET  /v1/wallet/balance  - Get current balance
 * POST /v1/wallet/deposit  - Simulate deposit (mock for M0)
 * POST /v1/wallet/withdraw - Request withdrawal
 * GET  /v1/wallet/history  - Deposit/Withdraw history
 * 
 * For M0: In-memory storage, mock TON addresses
 * Production: TON Connect integration + blockchain monitoring
 */

import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { validateAccessToken } from './auth.js';
import { ApiError, ErrorCode } from '../types/errors.js';
import { generateId, nowMs } from './utils.js';
import { getConfig } from '../config/index.js';

// ============================================================================
// Types
// ============================================================================

export interface WalletInfo {
  readonly user_id: string;
  readonly deposit_address: string;
  readonly balance_ton: string;
  readonly balance_usd: string;
  readonly spendable_ton: string;  // Balance minus gas reserve
  readonly gas_reserve_ton: string;
  readonly pending_deposits: number;
  readonly pending_withdrawals: number;
}

export interface BalanceResponse {
  readonly balance_ton: string;
  readonly balance_usd: string;
  readonly spendable_ton: string;
  readonly gas_reserve_ton: string;
  readonly last_updated_at: string;
}

export interface DepositRequest {
  readonly amount_ton: string;
  readonly tx_hash?: string;  // For real deposits
}

export interface DepositResponse {
  readonly deposit_id: string;
  readonly amount_ton: string;
  readonly status: DepositStatus;
  readonly created_at: string;
  readonly confirmed_at: string | null;
}

export interface WithdrawRequest {
  readonly amount_ton: string;
  readonly to_address: string;
}

export interface WithdrawResponse {
  readonly withdrawal_id: string;
  readonly amount_ton: string;
  readonly to_address: string;
  readonly fee_ton: string;
  readonly status: WithdrawStatus;
  readonly tx_hash: string | null;
  readonly created_at: string;
}

export type DepositStatus = 'PENDING' | 'CONFIRMED' | 'FAILED';
export type WithdrawStatus = 'PENDING' | 'PROCESSING' | 'CONFIRMED' | 'FAILED';

export interface WalletTransaction {
  readonly id: string;
  readonly type: 'DEPOSIT' | 'WITHDRAWAL';
  readonly amount_ton: string;
  readonly fee_ton: string;
  readonly status: string;
  readonly tx_hash: string | null;
  readonly to_address?: string;
  readonly created_at: string;
  readonly confirmed_at: string | null;
}

// ============================================================================
// Constants
// ============================================================================

const GAS_RESERVE_TON = '0.1';  // Reserve 0.1 TON for panic sell gas
const WITHDRAWAL_FEE_TON = '0.01';  // Network fee for withdrawal
const TON_USD_PRICE = 5.5;  // Mock price for M0

// ============================================================================
// In-memory stores (for M0)
// ============================================================================

interface UserWallet {
  userId: string;
  depositAddress: string;
  balanceTon: number;
  lastUpdated: number;
}

interface Deposit {
  depositId: string;
  userId: string;
  amountTon: number;
  status: DepositStatus;
  txHash: string | null;
  createdAt: number;
  confirmedAt: number | null;
}

interface Withdrawal {
  withdrawalId: string;
  userId: string;
  amountTon: number;
  toAddress: string;
  feeTon: number;
  status: WithdrawStatus;
  txHash: string | null;
  createdAt: number;
  confirmedAt: number | null;
}

// Map: userId -> UserWallet
const userWallets = new Map<string, UserWallet>();

// Map: depositId -> Deposit
const deposits = new Map<string, Deposit>();

// Map: withdrawalId -> Withdrawal
const withdrawals = new Map<string, Withdrawal>();

// Map: userId -> transaction ids (for history)
const userTransactions = new Map<string, string[]>();

// ============================================================================
// Helper Functions
// ============================================================================

function generateDepositAddress(userId: string): string {
  // Mock TON address format: EQ + base64-like string
  const hash = Buffer.from(userId + '_deposit_' + Date.now())
    .toString('base64')
    .replace(/[+/=]/g, '')
    .slice(0, 46);
  return `EQ${hash}`;
}

function getOrCreateWallet(userId: string): UserWallet {
  let wallet = userWallets.get(userId);
  if (!wallet) {
    wallet = {
      userId,
      depositAddress: generateDepositAddress(userId),
      balanceTon: 0,
      lastUpdated: nowMs(),
    };
    userWallets.set(userId, wallet);
  }
  return wallet;
}

function addTransaction(userId: string, txId: string): void {
  const txs = userTransactions.get(userId) ?? [];
  txs.unshift(txId);  // Add to front (newest first)
  userTransactions.set(userId, txs);
}

function tonToUsd(ton: number): string {
  return (ton * TON_USD_PRICE).toFixed(2);
}

function getSpendableBalance(balanceTon: number): number {
  const gasReserve = parseFloat(GAS_RESERVE_TON);
  return Math.max(0, balanceTon - gasReserve);
}

// ============================================================================
// Auth middleware helper
// ============================================================================

function extractUserId(authHeader: string | undefined): string {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(ErrorCode.INVALID_TOKEN, 'Missing or invalid Authorization header');
  }

  const token = authHeader.slice(7);
  const validated = validateAccessToken(token);
  
  if (!validated) {
    throw new ApiError(ErrorCode.TOKEN_EXPIRED, 'Token expired or invalid');
  }

  return validated.userId;
}

// ============================================================================
// Request Schemas
// ============================================================================

const DepositRequestSchema = z.object({
  amount_ton: z.string().refine(val => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, 'amount_ton must be a positive number'),
  tx_hash: z.string().optional(),
});

const WithdrawRequestSchema = z.object({
  amount_ton: z.string().refine(val => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, 'amount_ton must be a positive number'),
  to_address: z.string().min(1, 'to_address is required').refine(
    val => val.startsWith('EQ') || val.startsWith('UQ') || val.startsWith('0:'),
    'Invalid TON address format'
  ),
});

// ============================================================================
// Route Registration
// ============================================================================

export async function walletRoutes(fastify: FastifyInstance): Promise<void> {
  
  /**
   * GET /v1/wallet
   * Get wallet info including deposit address
   */
  fastify.get<{
    Reply: WalletInfo;
  }>('/wallet', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            user_id: { type: 'string' },
            deposit_address: { type: 'string' },
            balance_ton: { type: 'string' },
            balance_usd: { type: 'string' },
            spendable_ton: { type: 'string' },
            gas_reserve_ton: { type: 'string' },
            pending_deposits: { type: 'number' },
            pending_withdrawals: { type: 'number' },
          },
        },
      },
    },
  }, async (request, _reply) => {
    const userId = extractUserId(request.headers.authorization);
    const wallet = getOrCreateWallet(userId);

    // Count pending transactions
    const txIds = userTransactions.get(userId) ?? [];
    let pendingDeposits = 0;
    let pendingWithdrawals = 0;
    
    for (const txId of txIds) {
      const deposit = deposits.get(txId);
      if (deposit && deposit.status === 'PENDING') pendingDeposits++;
      
      const withdrawal = withdrawals.get(txId);
      if (withdrawal && (withdrawal.status === 'PENDING' || withdrawal.status === 'PROCESSING')) {
        pendingWithdrawals++;
      }
    }

    return {
      user_id: userId,
      deposit_address: wallet.depositAddress,
      balance_ton: wallet.balanceTon.toFixed(4),
      balance_usd: tonToUsd(wallet.balanceTon),
      spendable_ton: getSpendableBalance(wallet.balanceTon).toFixed(4),
      gas_reserve_ton: GAS_RESERVE_TON,
      pending_deposits: pendingDeposits,
      pending_withdrawals: pendingWithdrawals,
    };
  });

  /**
   * GET /v1/wallet/balance
   * Get current balance (lightweight)
   */
  fastify.get<{
    Reply: BalanceResponse;
  }>('/wallet/balance', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            balance_ton: { type: 'string' },
            balance_usd: { type: 'string' },
            spendable_ton: { type: 'string' },
            gas_reserve_ton: { type: 'string' },
            last_updated_at: { type: 'string' },
          },
        },
      },
    },
  }, async (request, _reply) => {
    const userId = extractUserId(request.headers.authorization);
    const wallet = getOrCreateWallet(userId);

    return {
      balance_ton: wallet.balanceTon.toFixed(4),
      balance_usd: tonToUsd(wallet.balanceTon),
      spendable_ton: getSpendableBalance(wallet.balanceTon).toFixed(4),
      gas_reserve_ton: GAS_RESERVE_TON,
      last_updated_at: new Date(wallet.lastUpdated).toISOString(),
    };
  });

  /**
   * POST /v1/wallet/deposit
   * Simulate a deposit (for M0 testing)
   * In production: This would be detected via blockchain monitoring
   */
  fastify.post<{
    Body: z.infer<typeof DepositRequestSchema>;
    Reply: DepositResponse;
  }>('/wallet/deposit', {
    schema: {
      body: {
        type: 'object',
        required: ['amount_ton'],
        properties: {
          amount_ton: { type: 'string' },
          tx_hash: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            deposit_id: { type: 'string' },
            amount_ton: { type: 'string' },
            status: { type: 'string' },
            created_at: { type: 'string' },
            confirmed_at: { type: 'string', nullable: true },
          },
        },
      },
    },
  }, async (request, _reply) => {
    const userId = extractUserId(request.headers.authorization);
    
    // Validate request
    const parsed = DepositRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new ApiError(
        ErrorCode.VALIDATION_ERROR,
        'Invalid request body',
        { issues: parsed.error.issues }
      );
    }

    const { amount_ton, tx_hash } = parsed.data;
    const amountTon = parseFloat(amount_ton);
    const wallet = getOrCreateWallet(userId);

    // Create deposit record
    const depositId = generateId('dep');
    const now = nowMs();
    
    const deposit: Deposit = {
      depositId,
      userId,
      amountTon,
      status: 'PENDING',
      txHash: tx_hash ?? `mock_tx_${generateId('tx')}`,
      createdAt: now,
      confirmedAt: null,
    };
    
    deposits.set(depositId, deposit);
    addTransaction(userId, depositId);

    request.log.info({
      userId,
      depositId,
      amountTon,
    }, 'Deposit initiated');

    // For M0: Auto-confirm after short delay
    setTimeout(() => {
      const dep = deposits.get(depositId);
      if (dep && dep.status === 'PENDING') {
        dep.status = 'CONFIRMED';
        dep.confirmedAt = nowMs();
        deposits.set(depositId, dep);

        // Credit balance
        wallet.balanceTon += amountTon;
        wallet.lastUpdated = nowMs();
        userWallets.set(userId, wallet);

        request.log.info({
          userId,
          depositId,
          amountTon,
          newBalance: wallet.balanceTon,
        }, 'Deposit confirmed');
      }
    }, 1000);  // 1 second delay for mock confirmation

    return {
      deposit_id: depositId,
      amount_ton: amountTon.toFixed(4),
      status: deposit.status,
      created_at: new Date(deposit.createdAt).toISOString(),
      confirmed_at: deposit.confirmedAt ? new Date(deposit.confirmedAt).toISOString() : null,
    };
  });

  /**
   * POST /v1/wallet/withdraw
   * Request withdrawal to external address
   */
  fastify.post<{
    Body: z.infer<typeof WithdrawRequestSchema>;
    Reply: WithdrawResponse;
  }>('/wallet/withdraw', {
    schema: {
      body: {
        type: 'object',
        required: ['amount_ton', 'to_address'],
        properties: {
          amount_ton: { type: 'string' },
          to_address: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            withdrawal_id: { type: 'string' },
            amount_ton: { type: 'string' },
            to_address: { type: 'string' },
            fee_ton: { type: 'string' },
            status: { type: 'string' },
            tx_hash: { type: 'string', nullable: true },
            created_at: { type: 'string' },
          },
        },
      },
    },
  }, async (request, _reply) => {
    const userId = extractUserId(request.headers.authorization);
    const config = getConfig();

    // Check if withdrawals are disabled (part of kill switch)
    if (config.maintenance.tradingDisabled) {
      throw new ApiError(
        ErrorCode.MAINTENANCE_TRADING_DISABLED,
        'Withdrawals are temporarily disabled'
      );
    }
    
    // Validate request
    const parsed = WithdrawRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new ApiError(
        ErrorCode.VALIDATION_ERROR,
        'Invalid request body',
        { issues: parsed.error.issues }
      );
    }

    const { amount_ton, to_address } = parsed.data;
    const amountTon = parseFloat(amount_ton);
    const feeTon = parseFloat(WITHDRAWAL_FEE_TON);
    const totalRequired = amountTon + feeTon;

    const wallet = getOrCreateWallet(userId);

    // Check balance
    if (wallet.balanceTon < totalRequired) {
      throw new ApiError(
        ErrorCode.INSUFFICIENT_BALANCE,
        `Insufficient balance. Required: ${totalRequired.toFixed(4)} TON (${amountTon.toFixed(4)} + ${feeTon.toFixed(4)} fee), Available: ${wallet.balanceTon.toFixed(4)} TON`
      );
    }

    // Check minimum gas reserve
    const remainingAfter = wallet.balanceTon - totalRequired;
    if (remainingAfter < 0) {
      throw new ApiError(
        ErrorCode.INSUFFICIENT_GAS,
        `Cannot withdraw full amount. Must keep gas reserve for future transactions.`
      );
    }

    // Create withdrawal record
    const withdrawalId = generateId('wdr');
    const now = nowMs();

    const withdrawal: Withdrawal = {
      withdrawalId,
      userId,
      amountTon,
      toAddress: to_address,
      feeTon,
      status: 'PENDING',
      txHash: null,
      createdAt: now,
      confirmedAt: null,
    };

    withdrawals.set(withdrawalId, withdrawal);
    addTransaction(userId, withdrawalId);

    // Deduct balance immediately (optimistic)
    wallet.balanceTon -= totalRequired;
    wallet.lastUpdated = nowMs();
    userWallets.set(userId, wallet);

    request.log.info({
      userId,
      withdrawalId,
      amountTon,
      toAddress: to_address,
      feeTon,
      newBalance: wallet.balanceTon,
    }, 'Withdrawal initiated');

    // For M0: Auto-confirm after delay
    setTimeout(() => {
      const wdr = withdrawals.get(withdrawalId);
      if (wdr && wdr.status === 'PENDING') {
        wdr.status = 'PROCESSING';
        withdrawals.set(withdrawalId, wdr);
        
        // Simulate blockchain confirmation
        setTimeout(() => {
          const w = withdrawals.get(withdrawalId);
          if (w && w.status === 'PROCESSING') {
            w.status = 'CONFIRMED';
            w.txHash = `mock_tx_${generateId('tx')}`;
            w.confirmedAt = nowMs();
            withdrawals.set(withdrawalId, w);

            request.log.info({
              userId,
              withdrawalId,
              txHash: w.txHash,
            }, 'Withdrawal confirmed');
          }
        }, 2000);  // 2 more seconds for "blockchain confirmation"
      }
    }, 1000);  // 1 second for initial processing

    return {
      withdrawal_id: withdrawalId,
      amount_ton: amountTon.toFixed(4),
      to_address: to_address,
      fee_ton: feeTon.toFixed(4),
      status: withdrawal.status,
      tx_hash: withdrawal.txHash,
      created_at: new Date(withdrawal.createdAt).toISOString(),
    };
  });

  /**
   * GET /v1/wallet/history
   * Get deposit/withdrawal history
   */
  fastify.get<{
    Querystring: { limit?: string; cursor?: string };
    Reply: { transactions: WalletTransaction[]; cursor: string | null };
  }>('/wallet/history', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'string' },
          cursor: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            transactions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  type: { type: 'string', enum: ['DEPOSIT', 'WITHDRAWAL'] },
                  amount_ton: { type: 'string' },
                  fee_ton: { type: 'string' },
                  status: { type: 'string' },
                  tx_hash: { type: 'string', nullable: true },
                  to_address: { type: 'string' },
                  created_at: { type: 'string' },
                  confirmed_at: { type: 'string', nullable: true },
                },
              },
            },
            cursor: { type: 'string', nullable: true },
          },
        },
      },
    },
  }, async (request, _reply) => {
    const userId = extractUserId(request.headers.authorization);
    const limit = Math.min(parseInt(request.query.limit ?? '50', 10), 50);
    const cursorIndex = request.query.cursor ? parseInt(request.query.cursor, 10) : 0;

    const txIds = userTransactions.get(userId) ?? [];
    const paginatedIds = txIds.slice(cursorIndex, cursorIndex + limit);

    const transactions: WalletTransaction[] = [];

    for (const txId of paginatedIds) {
      const deposit = deposits.get(txId);
      if (deposit) {
        transactions.push({
          id: deposit.depositId,
          type: 'DEPOSIT',
          amount_ton: deposit.amountTon.toFixed(4),
          fee_ton: '0',
          status: deposit.status,
          tx_hash: deposit.txHash,
          created_at: new Date(deposit.createdAt).toISOString(),
          confirmed_at: deposit.confirmedAt ? new Date(deposit.confirmedAt).toISOString() : null,
        });
        continue;
      }

      const withdrawal = withdrawals.get(txId);
      if (withdrawal) {
        transactions.push({
          id: withdrawal.withdrawalId,
          type: 'WITHDRAWAL',
          amount_ton: withdrawal.amountTon.toFixed(4),
          fee_ton: withdrawal.feeTon.toFixed(4),
          status: withdrawal.status,
          tx_hash: withdrawal.txHash,
          to_address: withdrawal.toAddress,
          created_at: new Date(withdrawal.createdAt).toISOString(),
          confirmed_at: withdrawal.confirmedAt ? new Date(withdrawal.confirmedAt).toISOString() : null,
        });
      }
    }

    const nextCursor = cursorIndex + limit < txIds.length
      ? String(cursorIndex + limit)
      : null;

    return {
      transactions,
      cursor: nextCursor,
    };
  });

  /**
   * GET /v1/wallet/deposit/:deposit_id
   * Get deposit status
   */
  fastify.get<{
    Params: { deposit_id: string };
    Reply: DepositResponse;
  }>('/wallet/deposit/:deposit_id', {
    schema: {
      params: {
        type: 'object',
        required: ['deposit_id'],
        properties: {
          deposit_id: { type: 'string' },
        },
      },
    },
  }, async (request, _reply) => {
    const userId = extractUserId(request.headers.authorization);
    const { deposit_id } = request.params;

    const deposit = deposits.get(deposit_id);
    if (!deposit || deposit.userId !== userId) {
      throw new ApiError(ErrorCode.NOT_FOUND, 'Deposit not found');
    }

    return {
      deposit_id: deposit.depositId,
      amount_ton: deposit.amountTon.toFixed(4),
      status: deposit.status,
      created_at: new Date(deposit.createdAt).toISOString(),
      confirmed_at: deposit.confirmedAt ? new Date(deposit.confirmedAt).toISOString() : null,
    };
  });

  /**
   * GET /v1/wallet/withdrawal/:withdrawal_id
   * Get withdrawal status
   */
  fastify.get<{
    Params: { withdrawal_id: string };
    Reply: WithdrawResponse;
  }>('/wallet/withdrawal/:withdrawal_id', {
    schema: {
      params: {
        type: 'object',
        required: ['withdrawal_id'],
        properties: {
          withdrawal_id: { type: 'string' },
        },
      },
    },
  }, async (request, _reply) => {
    const userId = extractUserId(request.headers.authorization);
    const { withdrawal_id } = request.params;

    const withdrawal = withdrawals.get(withdrawal_id);
    if (!withdrawal || withdrawal.userId !== userId) {
      throw new ApiError(ErrorCode.NOT_FOUND, 'Withdrawal not found');
    }

    return {
      withdrawal_id: withdrawal.withdrawalId,
      amount_ton: withdrawal.amountTon.toFixed(4),
      to_address: withdrawal.toAddress,
      fee_ton: withdrawal.feeTon.toFixed(4),
      status: withdrawal.status,
      tx_hash: withdrawal.txHash,
      created_at: new Date(withdrawal.createdAt).toISOString(),
    };
  });
}

// ============================================================================
// Exported functions for use by other modules (e.g., trades)
// ============================================================================

/**
 * Get user's spendable balance (for trade validation)
 */
export function getSpendableBalanceTon(userId: string): number {
  const wallet = userWallets.get(userId);
  if (!wallet) return 0;
  return getSpendableBalance(wallet.balanceTon);
}

/**
 * Deduct from user's balance (for trade execution)
 */
export function deductBalance(userId: string, amountTon: number): boolean {
  const wallet = userWallets.get(userId);
  if (!wallet) return false;
  
  if (wallet.balanceTon < amountTon) return false;
  
  wallet.balanceTon -= amountTon;
  wallet.lastUpdated = nowMs();
  userWallets.set(userId, wallet);
  return true;
}

/**
 * Credit to user's balance (for trade execution - sell)
 */
export function creditBalance(userId: string, amountTon: number): void {
  const wallet = getOrCreateWallet(userId);
  wallet.balanceTon += amountTon;
  wallet.lastUpdated = nowMs();
  userWallets.set(userId, wallet);
}

