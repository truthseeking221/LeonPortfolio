/**
 * Config endpoint
 * 
 * GET /v1/config - No auth required
 * 
 * Response 200:
 * {
 *   "version": 1,
 *   "maintenance": {
 *     "trading_disabled": false,
 *     "buy_disabled": false,
 *     "sell_disabled": false
 *   },
 *   "risk": {
 *     "min_liquidity": 1000,
 *     "min_age_minutes": 5
 *   },
 *   "deck": {
 *     "seen_ttl_hours": 24,
 *     "no_repeat_last_n": 50
 *   },
 *   "slippage": {
 *     "sell_default_bps": 500,
 *     "sell_max_user_bps": 5000
 *   }
 * }
 */

import type { FastifyInstance } from 'fastify';
import { getConfig } from '../config/index.js';

export interface ConfigResponse {
  readonly version: number;
  readonly maintenance: {
    readonly trading_disabled: boolean;
    readonly buy_disabled: boolean;
    readonly sell_disabled: boolean;
  };
  readonly risk: {
    readonly min_liquidity: number;
    readonly min_age_minutes: number;
  };
  readonly deck: {
    readonly seen_ttl_hours: number;
    readonly no_repeat_last_n: number;
  };
  readonly slippage: {
    readonly sell_default_bps: number;
    readonly sell_max_user_bps: number;
  };
}

export async function configRoutes(fastify: FastifyInstance): Promise<void> {
  const config = getConfig();

  fastify.get<{
    Reply: ConfigResponse;
  }>('/config', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            version: { type: 'number' },
            maintenance: {
              type: 'object',
              properties: {
                trading_disabled: { type: 'boolean' },
                buy_disabled: { type: 'boolean' },
                sell_disabled: { type: 'boolean' },
              },
            },
            risk: {
              type: 'object',
              properties: {
                min_liquidity: { type: 'number' },
                min_age_minutes: { type: 'number' },
              },
            },
            deck: {
              type: 'object',
              properties: {
                seen_ttl_hours: { type: 'number' },
                no_repeat_last_n: { type: 'number' },
              },
            },
            slippage: {
              type: 'object',
              properties: {
                sell_default_bps: { type: 'number' },
                sell_max_user_bps: { type: 'number' },
              },
            },
          },
        },
      },
    },
  }, async (_request, _reply) => {
    // Return config with snake_case keys to match API contract
    return {
      version: 1,
      maintenance: {
        trading_disabled: config.maintenance.tradingDisabled,
        buy_disabled: config.maintenance.buyDisabled,
        sell_disabled: config.maintenance.sellDisabled,
      },
      risk: {
        min_liquidity: config.risk.minLiquidity,
        min_age_minutes: config.risk.minAgeMinutes,
      },
      deck: {
        seen_ttl_hours: config.deck.seenTtlHours,
        no_repeat_last_n: config.deck.noRepeatLastN,
      },
      slippage: {
        sell_default_bps: config.slippage.sellDefaultBps,
        sell_max_user_bps: config.slippage.sellMaxUserBps,
      },
    };
  });
}
