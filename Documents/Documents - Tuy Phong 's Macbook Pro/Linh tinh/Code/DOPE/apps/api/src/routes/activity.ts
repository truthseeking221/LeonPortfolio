/**
 * Activity endpoints
 * 
 * GET /v1/activity - List user's trade activity
 * GET /v1/activity/:trade_id - Get single trade details
 * 
 * For M0: In-memory storage, mock data
 */

import type { FastifyInstance } from 'fastify';
import { validateAccessToken } from './auth.js';
import { ApiError, ErrorCode } from '../types/errors.js';
import { generateId } from './utils.js';

// ============================================================================
// Types
// ============================================================================

export interface Trade {
  readonly trade_id: string;
  readonly gesture_id: string;
  readonly token_id: string;
  readonly side: 'BUY' | 'SELL';
  readonly status: TradeStatus;
  readonly amount_base: string;
  readonly amount_token: string;
  readonly tx_hash: string | null;
  readonly error_code: string | null;
  readonly error_message: string | null;
  readonly created_at: string;
  readonly confirmed_at: string | null;
}

export type TradeStatus = 
  | 'CREATED'
  | 'SIGNED'
  | 'BROADCASTED'
  | 'PENDING'
  | 'CONFIRMED'
  | 'FAILED_DETERMINISTIC'
  | 'FAILED_TRANSIENT'
  | 'UNKNOWN';

export interface ActivityResponse {
  readonly trades: Trade[];
  readonly cursor: string | null;
}

// ============================================================================
// In-memory trade store (for M0)
// ============================================================================

// Map: userId -> Trade[]
const userTrades = new Map<string, Trade[]>();

// Map: gestureId -> Trade (for idempotency)
const gestureToTrade = new Map<string, Trade>();

/**
 * Create a new trade (internal use)
 */
export function createTrade(
  userId: string,
  gestureId: string,
  tokenId: string,
  side: 'BUY' | 'SELL',
  amountBase: string,
  amountToken: string
): Trade {
  // Check idempotency - if trade exists for gesture, return it
  const existingTrade = gestureToTrade.get(gestureId);
  if (existingTrade) {
    return existingTrade;
  }

  const trade: Trade = {
    trade_id: generateId('trade'),
    gesture_id: gestureId,
    token_id: tokenId,
    side,
    status: 'CREATED',
    amount_base: amountBase,
    amount_token: amountToken,
    tx_hash: null,
    error_code: null,
    error_message: null,
    created_at: new Date().toISOString(),
    confirmed_at: null,
  };

  // Store trade
  const trades = userTrades.get(userId) ?? [];
  trades.unshift(trade); // Add to front (most recent first)
  userTrades.set(userId, trades);
  
  // Store for idempotency
  gestureToTrade.set(gestureId, trade);

  return trade;
}

/**
 * Update trade status (internal use)
 */
export function updateTradeStatus(
  tradeId: string,
  status: TradeStatus,
  txHash?: string,
  errorCode?: string,
  errorMessage?: string
): Trade | null {
  // Find trade across all users
  for (const [userId, trades] of userTrades.entries()) {
    const index = trades.findIndex(t => t.trade_id === tradeId);
    if (index !== -1) {
      const trade = trades[index];
      if (!trade) continue;
      
      const updatedTrade: Trade = {
        ...trade,
        status,
        tx_hash: txHash ?? trade.tx_hash,
        error_code: errorCode ?? trade.error_code,
        error_message: errorMessage ?? trade.error_message,
        confirmed_at: status === 'CONFIRMED' ? new Date().toISOString() : trade.confirmed_at,
      };
      
      trades[index] = updatedTrade;
      userTrades.set(userId, trades);
      
      // Update idempotency map
      gestureToTrade.set(trade.gesture_id, updatedTrade);
      
      return updatedTrade;
    }
  }
  return null;
}

/**
 * Get trade by gesture ID (for idempotency check)
 */
export function getTradeByGestureId(gestureId: string): Trade | null {
  return gestureToTrade.get(gestureId) ?? null;
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
// Route Registration
// ============================================================================

export async function activityRoutes(fastify: FastifyInstance): Promise<void> {
  /**
   * GET /v1/activity
   * List user's trade activity
   */
  fastify.get<{
    Querystring: { cursor?: string; limit?: string };
    Reply: ActivityResponse;
  }>('/activity', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          cursor: { type: 'string' },
          limit: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            trades: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  trade_id: { type: 'string' },
                  gesture_id: { type: 'string' },
                  token_id: { type: 'string' },
                  side: { type: 'string', enum: ['BUY', 'SELL'] },
                  status: { type: 'string' },
                  amount_base: { type: 'string' },
                  amount_token: { type: 'string' },
                  tx_hash: { type: 'string', nullable: true },
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
    const cursorIndex = request.query.cursor 
      ? parseInt(request.query.cursor, 10) 
      : 0;

    const trades = userTrades.get(userId) ?? [];
    const paginatedTrades = trades.slice(cursorIndex, cursorIndex + limit);
    const nextCursor = cursorIndex + limit < trades.length 
      ? String(cursorIndex + limit) 
      : null;

    return {
      trades: paginatedTrades,
      cursor: nextCursor,
    };
  });

  /**
   * GET /v1/activity/:trade_id
   * Get single trade details
   */
  fastify.get<{
    Params: { trade_id: string };
    Reply: Trade;
  }>('/activity/:trade_id', {
    schema: {
      params: {
        type: 'object',
        required: ['trade_id'],
        properties: {
          trade_id: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            trade_id: { type: 'string' },
            gesture_id: { type: 'string' },
            token_id: { type: 'string' },
            side: { type: 'string', enum: ['BUY', 'SELL'] },
            status: { type: 'string' },
            amount_base: { type: 'string' },
            amount_token: { type: 'string' },
            tx_hash: { type: 'string', nullable: true },
            error_code: { type: 'string', nullable: true },
            error_message: { type: 'string', nullable: true },
            created_at: { type: 'string' },
            confirmed_at: { type: 'string', nullable: true },
          },
        },
      },
    },
  }, async (request, _reply) => {
    const userId = extractUserId(request.headers.authorization);
    const { trade_id } = request.params;

    const trades = userTrades.get(userId) ?? [];
    const trade = trades.find(t => t.trade_id === trade_id);

    if (!trade) {
      throw new ApiError(ErrorCode.NOT_FOUND, 'Trade not found');
    }

    return trade;
  });
}

