/**
 * DeDust API Client - TON DEX
 * 
 * Docs: https://docs.dedust.io/
 * 
 * Features:
 * - Token prices from liquidity pools
 * - Swap quotes
 * - Pool data (liquidity, volume)
 */

import { z } from 'zod';

// ============================================================================
// Configuration
// ============================================================================

const DEDUST_API_URL = 'https://api.dedust.io/v2';

// ============================================================================
// Response Schemas
// ============================================================================

export const AssetSchema = z.object({
  type: z.enum(['native', 'jetton']),
  address: z.string().optional(),
});

export const PoolSchema = z.object({
  address: z.string(),
  lt: z.string(),
  totalSupply: z.string(),
  type: z.string(),
  tradeFee: z.string(),
  assets: z.array(AssetSchema),
  reserves: z.array(z.string()),
  fees: z.array(z.string()),
  volume: z.object({
    '24h': z.string().optional(),
    '7d': z.string().optional(),
    '30d': z.string().optional(),
    all: z.string().optional(),
  }).optional(),
  stats: z.object({
    tvl: z.string().optional(),
    apr: z.string().optional(),
  }).optional(),
});

export const SwapQuoteSchema = z.object({
  amountIn: z.string(),
  amountOut: z.string(),
  priceImpact: z.string(),
  route: z.array(z.object({
    pool: z.string(),
    assetIn: AssetSchema,
    assetOut: AssetSchema,
  })),
});

export type Pool = z.infer<typeof PoolSchema>;
export type SwapQuote = z.infer<typeof SwapQuoteSchema>;

// ============================================================================
// DeDust Client
// ============================================================================

export class DeDustClient {
  private baseUrl: string;

  constructor(baseUrl: string = DEDUST_API_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, schema: z.ZodType<T>): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`DeDust API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return schema.parse(data);
  }

  /**
   * Get all pools
   */
  async getPools(): Promise<Pool[]> {
    return this.fetch('/pools', z.array(PoolSchema));
  }

  /**
   * Get pool by address
   */
  async getPool(poolAddress: string): Promise<Pool> {
    return this.fetch(`/pools/${poolAddress}`, PoolSchema);
  }

  /**
   * Get pools for a specific jetton
   */
  async getJettonPools(jettonAddress: string): Promise<Pool[]> {
    const pools = await this.getPools();
    return pools.filter(pool => 
      pool.assets.some(asset => 
        asset.type === 'jetton' && asset.address === jettonAddress
      )
    );
  }

  /**
   * Get swap quote
   * @param assetIn - Input asset (native for TON, or jetton address)
   * @param assetOut - Output asset
   * @param amountIn - Amount in smallest units
   */
  async getSwapQuote(
    assetIn: { type: 'native' } | { type: 'jetton'; address: string },
    assetOut: { type: 'native' } | { type: 'jetton'; address: string },
    amountIn: string
  ): Promise<SwapQuote> {
    const params = new URLSearchParams({
      amount: amountIn,
    });

    if (assetIn.type === 'native') {
      params.set('from', 'native');
    } else {
      params.set('from', `jetton:${assetIn.address}`);
    }

    if (assetOut.type === 'native') {
      params.set('to', 'native');
    } else {
      params.set('to', `jetton:${assetOut.address}`);
    }

    return this.fetch(`/swap/quote?${params}`, SwapQuoteSchema);
  }

  /**
   * Get price of jetton in TON
   */
  async getJettonPriceInTon(jettonAddress: string): Promise<number | null> {
    try {
      const quote = await this.getSwapQuote(
        { type: 'jetton', address: jettonAddress },
        { type: 'native' },
        '1000000000' // 1 token (assuming 9 decimals)
      );
      // Price = amountOut / amountIn
      const amountIn = BigInt(quote.amountIn);
      const amountOut = BigInt(quote.amountOut);
      if (amountIn === 0n) return null;
      return Number(amountOut) / Number(amountIn);
    } catch {
      return null;
    }
  }
}

// ============================================================================
// Singleton instance
// ============================================================================

let _client: DeDustClient | null = null;

export function getDeDustClient(): DeDustClient {
  if (!_client) {
    _client = new DeDustClient();
  }
  return _client;
}

