/**
 * @dope/contracts - Shared types and API schemas
 * 
 * This package is the source of truth for:
 * - API request/response types
 * - Zod schemas for validation
 * - Error codes and types
 * - WebSocket event types
 * 
 * Rules:
 * - Contracts agent owns this package
 * - Other packages import from here
 * - Types must match docs/04_API_CONTRACTS.md
 */

import { z } from 'zod';

// ============================================================================
// Common Types
// ============================================================================

/** Branded type for gesture IDs */
export type GestureId = string & { readonly _brand: 'GestureId' };

/** Branded type for order IDs */
export type OrderId = string & { readonly _brand: 'OrderId' };

/** Branded type for trade IDs */
export type TradeId = string & { readonly _brand: 'TradeId' };

/** Branded type for token IDs */
export type TokenId = string & { readonly _brand: 'TokenId' };

/** Branded type for user IDs */
export type UserId = string & { readonly _brand: 'UserId' };

/** Branded type for session IDs */
export type SessionId = string & { readonly _brand: 'SessionId' };

// ============================================================================
// Health Endpoint
// ============================================================================

export const HealthResponseSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  env: z.string(),
  build: z.string(),
  timestamp: z.string().datetime(),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

// ============================================================================
// Config Endpoint
// ============================================================================

export const ConfigResponseSchema = z.object({
  version: z.number(),
  maintenance: z.object({
    trading_disabled: z.boolean(),
    buy_disabled: z.boolean(),
    sell_disabled: z.boolean(),
  }),
  risk: z.object({
    min_liquidity: z.number(),
    min_age_minutes: z.number(),
  }),
  deck: z.object({
    seen_ttl_hours: z.number(),
    no_repeat_last_n: z.number(),
  }),
  slippage: z.object({
    sell_default_bps: z.number(),
    sell_max_user_bps: z.number(),
  }),
});

export type ConfigResponse = z.infer<typeof ConfigResponseSchema>;

// ============================================================================
// Error Response
// ============================================================================

export const ErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.unknown()).optional(),
  }),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// ============================================================================
// Trade Side
// ============================================================================

export const TradeSide = {
  BUY: 'BUY',
  SELL: 'SELL',
} as const;

export type TradeSide = (typeof TradeSide)[keyof typeof TradeSide];

// ============================================================================
// Trade Status
// ============================================================================

export const TradeStatus = {
  CREATED: 'CREATED',
  SIGNED: 'SIGNED',
  BROADCASTED: 'BROADCASTED',
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  FAILED_DETERMINISTIC: 'FAILED_DETERMINISTIC',
  FAILED_TRANSIENT: 'FAILED_TRANSIENT',
  UNKNOWN: 'UNKNOWN',
} as const;

export type TradeStatus = (typeof TradeStatus)[keyof typeof TradeStatus];

// ============================================================================
// Future exports (to be added by Contracts Agent)
// ============================================================================

// Auth
// export { AuthRequestSchema, AuthResponseSchema } from './auth.js';

// Deck
// export { DeckBatchRequestSchema, DeckBatchResponseSchema, CardSchema } from './deck.js';

// Trading
// export { QuoteRequestSchema, QuoteResponseSchema } from './trading.js';
// export { CommitRequestSchema, CommitResponseSchema } from './trading.js';

// Activity
// export { ActivityResponseSchema, TradeDetailSchema } from './activity.js';

// WebSocket
// export { WsServerEvent, WsClientEvent } from './websocket.js';

