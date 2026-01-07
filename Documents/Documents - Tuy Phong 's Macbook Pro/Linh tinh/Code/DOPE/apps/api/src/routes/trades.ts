/**
 * Trading endpoints
 * 
 * POST /v1/trades/sell-all - Sell all positions for a token
 * 
 * For M0: Mock trading, no real blockchain transactions
 */

import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { validateAccessToken } from './auth.js';
import { ApiError, ErrorCode, maintenanceError, sellDisabledError } from '../types/errors.js';
import { isTradingDisabled, isSellDisabled } from '../config/index.js';
import { createTrade, getTradeByGestureId, updateTradeStatus } from './activity.js';
import { getUserPositions, removePosition } from './positions.js';
import { generateId } from './utils.js';

// ============================================================================
// Request Schemas
// ============================================================================

const SellAllRequestSchema = z.object({
  gesture_id: z.string().min(1, 'gesture_id is required'),
  token_id: z.string().min(1, 'token_id is required'),
  slippage_bps: z.number().min(0).max(5000).optional().default(500),
});

// ============================================================================
// Response Types
// ============================================================================

export interface SellAllResponse {
  readonly trade_id: string;
  readonly gesture_id: string;
  readonly token_id: string;
  readonly status: string;
  readonly amount_token: string;
  readonly estimated_usd: string;
  readonly created_at: string;
}

export interface DuplicateTradeResponse {
  readonly trade_id: string;
  readonly gesture_id: string;
  readonly status: string;
  readonly message: string;
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
// Kill switch check
// ============================================================================

function checkKillSwitch(): void {
  if (isTradingDisabled()) {
    throw maintenanceError();
  }
}

function checkSellEnabled(): void {
  if (isSellDisabled()) {
    throw sellDisabledError();
  }
}

// ============================================================================
// Route Registration
// ============================================================================

export async function tradesRoutes(fastify: FastifyInstance): Promise<void> {
  /**
   * POST /v1/trades/sell-all
   * Sell all holdings of a specific token
   * 
   * Implements:
   * - Kill switch enforcement
   * - Idempotency via gesture_id
   * - Position lookup and removal
   */
  fastify.post<{
    Body: z.infer<typeof SellAllRequestSchema>;
    Reply: SellAllResponse | DuplicateTradeResponse;
  }>('/trades/sell-all', {
    schema: {
      body: {
        type: 'object',
        required: ['gesture_id', 'token_id'],
        properties: {
          gesture_id: { type: 'string' },
          token_id: { type: 'string' },
          slippage_bps: { type: 'number' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            trade_id: { type: 'string' },
            gesture_id: { type: 'string' },
            token_id: { type: 'string' },
            status: { type: 'string' },
            amount_token: { type: 'string' },
            estimated_usd: { type: 'string' },
            created_at: { type: 'string' },
          },
        },
        // 409 for idempotent duplicate
        409: {
          type: 'object',
          properties: {
            trade_id: { type: 'string' },
            gesture_id: { type: 'string' },
            status: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    // 1. Check kill switch FIRST (per Backend Agent rules)
    checkKillSwitch();
    checkSellEnabled();

    // 2. Validate auth
    const userId = extractUserId(request.headers.authorization);

    // 3. Validate request body
    const parsed = SellAllRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new ApiError(
        ErrorCode.VALIDATION_ERROR,
        'Invalid request body',
        { issues: parsed.error.issues }
      );
    }

    const { gesture_id, token_id } = parsed.data;

    // 4. Idempotency check - if trade exists for gesture, return it
    const existingTrade = getTradeByGestureId(gesture_id);
    if (existingTrade) {
      request.log.info({
        gesture_id,
        trade_id: existingTrade.trade_id,
      }, 'Duplicate gesture_id, returning existing trade');

      // Return 409 with existing trade info
      return reply.status(409).send({
        trade_id: existingTrade.trade_id,
        gesture_id: existingTrade.gesture_id,
        status: existingTrade.status,
        message: 'Trade already exists for this gesture',
      });
    }

    // 5. Get user's position for this token
    const positions = getUserPositions(userId);
    const position = positions.find(p => p.token_id === token_id);

    if (!position) {
      throw new ApiError(
        ErrorCode.NOT_FOUND,
        'No position found for this token'
      );
    }

    // 6. Check position size
    const amount = parseFloat(position.amount);
    if (amount <= 0) {
      throw new ApiError(
        ErrorCode.POSITION_TOO_SMALL,
        'Position too small to sell'
      );
    }

    // 7. Create trade record
    const trade = createTrade(
      userId,
      gesture_id,
      token_id,
      'SELL',
      position.current_value_usd, // amount in base currency (USD for M0)
      position.amount // amount in tokens
    );

    request.log.info({
      userId,
      trade_id: trade.trade_id,
      gesture_id,
      token_id,
      amount: position.amount,
    }, 'Sell-all trade created');

    // 8. For M0: Simulate instant confirmation
    // In production: This would be async with status updates via WebSocket
    setTimeout(() => {
      // Remove position
      removePosition(userId, token_id, position.amount);
      
      // Update trade to confirmed
      updateTradeStatus(
        trade.trade_id,
        'CONFIRMED',
        `mock_tx_${generateId('tx')}` // Mock tx hash
      );
    }, 100);

    // 9. Return immediate response (trade is CREATED, will be confirmed shortly)
    return {
      trade_id: trade.trade_id,
      gesture_id: trade.gesture_id,
      token_id: trade.token_id,
      status: trade.status,
      amount_token: position.amount,
      estimated_usd: position.current_value_usd,
      created_at: trade.created_at,
    };
  });
}

