/**
 * GeckoTerminal API Client - DEX data aggregator
 * 
 * Docs: https://www.geckoterminal.com/dex-api
 * 
 * Features:
 * - Multi-chain DEX pool data
 * - Token prices from DEX
 * - Trending tokens
 * - OHLCV data
 * 
 * TON network ID: "ton"
 */

import { z } from 'zod';

// ============================================================================
// Configuration
// ============================================================================

const GECKOTERMINAL_API_URL = 'https://api.geckoterminal.com/api/v2';
const TON_NETWORK = 'ton';

// ============================================================================
// Response Schemas
// ============================================================================

const TokenAttributesSchema = z.object({
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
  decimals: z.number().nullable(),
  image_url: z.string().nullable(),
  coingecko_coin_id: z.string().nullable(),
  total_supply: z.string().nullable(),
  price_usd: z.string().nullable(),
  fdv_usd: z.string().nullable(),
  total_reserve_in_usd: z.string().nullable(),
  volume_usd: z.object({
    h24: z.string().nullable(),
  }).nullable(),
  market_cap_usd: z.string().nullable(),
});

const PoolAttributesSchema = z.object({
  address: z.string(),
  name: z.string(),
  pool_created_at: z.string().nullable(),
  fdv_usd: z.string().nullable(),
  market_cap_usd: z.string().nullable(),
  price_change_percentage: z.object({
    h1: z.string().nullable(),
    h6: z.string().nullable(),
    h24: z.string().nullable(),
  }).nullable(),
  transactions: z.object({
    h1: z.object({ buys: z.number(), sells: z.number() }).nullable(),
    h24: z.object({ buys: z.number(), sells: z.number() }).nullable(),
  }).nullable(),
  volume_usd: z.object({
    h1: z.string().nullable(),
    h24: z.string().nullable(),
  }).nullable(),
  reserve_in_usd: z.string().nullable(),
  base_token_price_usd: z.string().nullable(),
  quote_token_price_usd: z.string().nullable(),
});

const PoolDataSchema = z.object({
  id: z.string(),
  type: z.literal('pool'),
  attributes: PoolAttributesSchema,
  relationships: z.object({
    base_token: z.object({
      data: z.object({ id: z.string(), type: z.string() }),
    }).optional(),
    quote_token: z.object({
      data: z.object({ id: z.string(), type: z.string() }),
    }).optional(),
    dex: z.object({
      data: z.object({ id: z.string(), type: z.string() }),
    }).optional(),
  }).optional(),
});

const TokenDataSchema = z.object({
  id: z.string(),
  type: z.literal('token'),
  attributes: TokenAttributesSchema,
});

const TrendingPoolsResponseSchema = z.object({
  data: z.array(PoolDataSchema),
});

const TokenInfoResponseSchema = z.object({
  data: TokenDataSchema,
});

const PoolsResponseSchema = z.object({
  data: z.array(PoolDataSchema),
  included: z.array(TokenDataSchema).optional(),
});

export type PoolData = z.infer<typeof PoolDataSchema>;
export type TokenData = z.infer<typeof TokenDataSchema>;

// ============================================================================
// Simplified types for app use
// ============================================================================

export interface MemeToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  imageUrl: string | null;
  priceUsd: number | null;
  priceChange24h: number | null;
  volume24hUsd: number | null;
  liquidityUsd: number | null;
  marketCapUsd: number | null;
  fdvUsd: number | null;
  poolAddress: string | null;
  createdAt: string | null;
}

// ============================================================================
// GeckoTerminal Client
// ============================================================================

export class GeckoTerminalClient {
  private baseUrl: string;
  private network: string;

  constructor(network: string = TON_NETWORK, baseUrl: string = GECKOTERMINAL_API_URL) {
    this.baseUrl = baseUrl;
    this.network = network;
  }

  private async fetch<T>(endpoint: string, schema: z.ZodType<T>): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`GeckoTerminal API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return schema.parse(data);
  }

  /**
   * Get trending pools on TON
   */
  async getTrendingPools(page = 1): Promise<PoolData[]> {
    const result = await this.fetch(
      `/networks/${this.network}/trending_pools?page=${page}`,
      TrendingPoolsResponseSchema
    );
    return result.data;
  }

  /**
   * Get new pools on TON (sorted by creation time)
   */
  async getNewPools(page = 1): Promise<PoolData[]> {
    const result = await this.fetch(
      `/networks/${this.network}/new_pools?page=${page}`,
      TrendingPoolsResponseSchema
    );
    return result.data;
  }

  /**
   * Get pools for a specific token
   */
  async getTokenPools(tokenAddress: string): Promise<PoolData[]> {
    const result = await this.fetch(
      `/networks/${this.network}/tokens/${tokenAddress}/pools`,
      PoolsResponseSchema
    );
    return result.data;
  }

  /**
   * Get token info by address
   */
  async getTokenInfo(tokenAddress: string): Promise<TokenData> {
    const result = await this.fetch(
      `/networks/${this.network}/tokens/${tokenAddress}`,
      TokenInfoResponseSchema
    );
    return result.data;
  }

  /**
   * Get pool info by address
   */
  async getPoolInfo(poolAddress: string): Promise<PoolData> {
    const result = await this.fetch(
      `/networks/${this.network}/pools/${poolAddress}`,
      z.object({ data: PoolDataSchema })
    );
    return result.data;
  }

  /**
   * Search tokens by query
   */
  async searchTokens(query: string): Promise<TokenData[]> {
    const result = await this.fetch(
      `/search/pools?query=${encodeURIComponent(query)}&network=${this.network}`,
      PoolsResponseSchema
    );
    return result.included ?? [];
  }

  // ========================================================================
  // High-level methods for app use
  // ========================================================================

  /**
   * Get trending meme tokens (simplified format)
   */
  async getTrendingMemeTokens(limit = 20): Promise<MemeToken[]> {
    const pools = await this.getTrendingPools();
    
    return pools.slice(0, limit).map(pool => this.poolToMemeToken(pool));
  }

  /**
   * Get new meme tokens (simplified format)
   */
  async getNewMemeTokens(limit = 20): Promise<MemeToken[]> {
    const pools = await this.getNewPools();
    
    return pools.slice(0, limit).map(pool => this.poolToMemeToken(pool));
  }

  /**
   * Get token details (simplified format)
   */
  async getMemeToken(tokenAddress: string): Promise<MemeToken | null> {
    try {
      const pools = await this.getTokenPools(tokenAddress);
      if (pools.length === 0) return null;
      
      // Use the most liquid pool
      const pool = pools[0];
      if (!pool) return null;
      
      return this.poolToMemeToken(pool, tokenAddress);
    } catch {
      return null;
    }
  }

  private poolToMemeToken(pool: PoolData, tokenAddress?: string): MemeToken {
    const attrs = pool.attributes;
    
    // Extract token address from pool name or use provided
    const address = tokenAddress ?? this.extractTokenAddress(pool);
    
    // Parse numeric values safely
    const parseNum = (val: string | null | undefined): number | null => {
      if (!val) return null;
      const num = parseFloat(val);
      return isNaN(num) ? null : num;
    };

    return {
      address,
      name: attrs.name.split(' / ')[0] ?? attrs.name,
      symbol: attrs.name.split(' / ')[0]?.split(' ')[0] ?? '',
      decimals: 9, // TON jettons typically use 9 decimals
      imageUrl: null, // GeckoTerminal doesn't provide this directly
      priceUsd: parseNum(attrs.base_token_price_usd),
      priceChange24h: parseNum(attrs.price_change_percentage?.h24),
      volume24hUsd: parseNum(attrs.volume_usd?.h24),
      liquidityUsd: parseNum(attrs.reserve_in_usd),
      marketCapUsd: parseNum(attrs.market_cap_usd),
      fdvUsd: parseNum(attrs.fdv_usd),
      poolAddress: attrs.address,
      createdAt: attrs.pool_created_at,
    };
  }

  private extractTokenAddress(pool: PoolData): string {
    // Try to get from relationships
    const baseToken = pool.relationships?.base_token?.data?.id;
    if (baseToken) {
      // Format: "ton_address"
      const parts = baseToken.split('_');
      return parts[1] ?? baseToken;
    }
    return pool.attributes.address;
  }
}

// ============================================================================
// Singleton instance
// ============================================================================

let _client: GeckoTerminalClient | null = null;

export function getGeckoTerminalClient(): GeckoTerminalClient {
  if (!_client) {
    _client = new GeckoTerminalClient();
  }
  return _client;
}
