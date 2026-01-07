/**
 * Positions endpoint
 * 
 * GET /v1/positions - Get user's current token holdings
 * 
 * For M0: Mock data, no real blockchain integration
 */

import type { FastifyInstance } from 'fastify';
import { validateAccessToken } from './auth.js';
import { ApiError, ErrorCode } from '../types/errors.js';

// ============================================================================
// Types
// ============================================================================

export interface Position {
  readonly token_id: string;
  readonly symbol: string;
  readonly name: string;
  readonly amount: string;
  readonly cost_basis_usd: string;
  readonly current_value_usd: string;
  readonly pnl_usd: string;
  readonly pnl_pct: number;
  readonly acquired_at: string;
}

export interface PositionsResponse {
  readonly positions: Position[];
  readonly total_value_usd: string;
  readonly total_pnl_usd: string;
  readonly total_pnl_pct: number;
}

// ============================================================================
// In-memory positions store (for M0)
// ============================================================================

// Map: userId -> Position[]
const userPositions = new Map<string, Position[]>();

/**
 * Add or update position (internal use, called after successful buy)
 */
export function addPosition(
  userId: string,
  tokenId: string,
  symbol: string,
  name: string,
  amount: string,
  costBasisUsd: string
): Position {
  const positions = userPositions.get(userId) ?? [];
  
  // Check if position already exists
  const existingIndex = positions.findIndex(p => p.token_id === tokenId);
  
  const position: Position = {
    token_id: tokenId,
    symbol,
    name,
    amount,
    cost_basis_usd: costBasisUsd,
    current_value_usd: costBasisUsd, // Same as cost for new position
    pnl_usd: '0',
    pnl_pct: 0,
    acquired_at: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    // Update existing position (add to amount)
    const existing = positions[existingIndex];
    if (existing) {
      const newAmount = parseFloat(existing.amount) + parseFloat(amount);
      const newCostBasis = parseFloat(existing.cost_basis_usd) + parseFloat(costBasisUsd);
      
      const updatedPosition: Position = {
        ...existing,
        amount: newAmount.toString(),
        cost_basis_usd: newCostBasis.toString(),
        current_value_usd: newCostBasis.toString(), // Simplified for M0
      };
      positions[existingIndex] = updatedPosition;
    }
  } else {
    positions.push(position);
  }

  userPositions.set(userId, positions);
  return position;
}

/**
 * Remove or reduce position (internal use, called after successful sell)
 */
export function removePosition(
  userId: string,
  tokenId: string,
  amountToSell: string
): boolean {
  const positions = userPositions.get(userId) ?? [];
  const index = positions.findIndex(p => p.token_id === tokenId);
  
  if (index < 0) return false;

  const position = positions[index];
  if (!position) return false;
  
  const currentAmount = parseFloat(position.amount);
  const sellAmount = parseFloat(amountToSell);
  
  if (sellAmount >= currentAmount) {
    // Remove entire position
    positions.splice(index, 1);
  } else {
    // Reduce position
    const newAmount = currentAmount - sellAmount;
    const ratio = newAmount / currentAmount;
    
    const updatedPosition: Position = {
      ...position,
      amount: newAmount.toString(),
      cost_basis_usd: (parseFloat(position.cost_basis_usd) * ratio).toString(),
      current_value_usd: (parseFloat(position.current_value_usd) * ratio).toString(),
    };
    positions[index] = updatedPosition;
  }

  userPositions.set(userId, positions);
  return true;
}

/**
 * Update position prices (would be called by price feed in production)
 */
export function updatePositionPrice(
  userId: string,
  tokenId: string,
  newValueUsd: string
): void {
  const positions = userPositions.get(userId) ?? [];
  const index = positions.findIndex(p => p.token_id === tokenId);
  
  if (index < 0) return;

  const position = positions[index];
  if (!position) return;
  
  const costBasis = parseFloat(position.cost_basis_usd);
  const currentValue = parseFloat(newValueUsd);
  const pnlUsd = currentValue - costBasis;
  const pnlPct = costBasis > 0 ? (pnlUsd / costBasis) * 100 : 0;

  const updatedPosition: Position = {
    ...position,
    current_value_usd: newValueUsd,
    pnl_usd: pnlUsd.toFixed(2),
    pnl_pct: parseFloat(pnlPct.toFixed(2)),
  };
  positions[index] = updatedPosition;
  userPositions.set(userId, positions);
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

export async function positionsRoutes(fastify: FastifyInstance): Promise<void> {
  /**
   * GET /v1/positions
   * Get user's current token holdings
   */
  fastify.get<{
    Reply: PositionsResponse;
  }>('/positions', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            positions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  token_id: { type: 'string' },
                  symbol: { type: 'string' },
                  name: { type: 'string' },
                  amount: { type: 'string' },
                  cost_basis_usd: { type: 'string' },
                  current_value_usd: { type: 'string' },
                  pnl_usd: { type: 'string' },
                  pnl_pct: { type: 'number' },
                  acquired_at: { type: 'string' },
                },
              },
            },
            total_value_usd: { type: 'string' },
            total_pnl_usd: { type: 'string' },
            total_pnl_pct: { type: 'number' },
          },
        },
      },
    },
  }, async (request, _reply) => {
    const userId = extractUserId(request.headers.authorization);
    const positions = userPositions.get(userId) ?? [];

    // Calculate totals
    let totalValue = 0;
    let totalCostBasis = 0;

    for (const pos of positions) {
      totalValue += parseFloat(pos.current_value_usd);
      totalCostBasis += parseFloat(pos.cost_basis_usd);
    }

    const totalPnlUsd = totalValue - totalCostBasis;
    const totalPnlPct = totalCostBasis > 0 ? (totalPnlUsd / totalCostBasis) * 100 : 0;

    return {
      positions,
      total_value_usd: totalValue.toFixed(2),
      total_pnl_usd: totalPnlUsd.toFixed(2),
      total_pnl_pct: parseFloat(totalPnlPct.toFixed(2)),
    };
  });
}

/**
 * Get all positions for a user (exported for use by other modules)
 */
export function getUserPositions(userId: string): Position[] {
  return userPositions.get(userId) ?? [];
}

