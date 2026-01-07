/**
 * TonAPI Client - Official TON blockchain API
 * 
 * Docs: https://tonapi.io/docs
 * 
 * Features:
 * - Jetton (token) data
 * - Account balances
 * - Transaction history
 * - NFT data
 */

import { z } from 'zod';

// ============================================================================
// Configuration
// ============================================================================

const TONAPI_BASE_URL = 'https://tonapi.io/v2';

export interface TonApiConfig {
  apiKey?: string;  // Optional, increases rate limits
  baseUrl?: string;
}

// ============================================================================
// Response Schemas
// ============================================================================

export const JettonInfoSchema = z.object({
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
  decimals: z.number(),
  image: z.string().optional(),
  description: z.string().optional(),
  social: z.array(z.string()).optional(),
  websites: z.array(z.string()).optional(),
  verification: z.enum(['whitelist', 'blacklist', 'none']).optional(),
});

export const JettonBalanceSchema = z.object({
  balance: z.string(),
  wallet_address: z.object({
    address: z.string(),
  }),
  jetton: JettonInfoSchema,
  price: z.object({
    prices: z.record(z.number()).optional(),
    diff_24h: z.record(z.string()).optional(),
    diff_7d: z.record(z.string()).optional(),
  }).optional(),
});

export const AccountJettonsSchema = z.object({
  balances: z.array(JettonBalanceSchema),
});

export const JettonHoldersSchema = z.object({
  total: z.number(),
  addresses: z.array(z.object({
    address: z.string(),
    balance: z.string(),
  })),
});

export type JettonInfo = z.infer<typeof JettonInfoSchema>;
export type JettonBalance = z.infer<typeof JettonBalanceSchema>;

// ============================================================================
// TonAPI Client
// ============================================================================

export class TonApiClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor(config: TonApiConfig = {}) {
    this.baseUrl = config.baseUrl ?? TONAPI_BASE_URL;
    this.apiKey = config.apiKey;
  }

  private async fetch<T>(endpoint: string, schema: z.ZodType<T>): Promise<T> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, { headers });

    if (!response.ok) {
      throw new Error(`TonAPI error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return schema.parse(data);
  }

  /**
   * Get jetton (token) info by address
   */
  async getJettonInfo(jettonAddress: string): Promise<JettonInfo> {
    return this.fetch(`/jettons/${jettonAddress}`, JettonInfoSchema);
  }

  /**
   * Get all jetton balances for an account
   */
  async getAccountJettons(accountAddress: string): Promise<JettonBalance[]> {
    const result = await this.fetch(
      `/accounts/${accountAddress}/jettons?currencies=usd`,
      AccountJettonsSchema
    );
    return result.balances;
  }

  /**
   * Get specific jetton balance for an account
   */
  async getJettonBalance(
    accountAddress: string,
    jettonAddress: string
  ): Promise<JettonBalance | null> {
    const balances = await this.getAccountJettons(accountAddress);
    return balances.find(b => b.jetton.address === jettonAddress) ?? null;
  }

  /**
   * Get TON balance for an account
   */
  async getTonBalance(accountAddress: string): Promise<string> {
    const AccountSchema = z.object({
      balance: z.number(),
    });
    const result = await this.fetch(`/accounts/${accountAddress}`, AccountSchema);
    // Convert from nanoton to TON
    return (result.balance / 1e9).toFixed(9);
  }

  /**
   * Get jetton holders count and top holders
   */
  async getJettonHolders(jettonAddress: string, limit = 100): Promise<{
    total: number;
    holders: Array<{ address: string; balance: string }>;
  }> {
    const result = await this.fetch(
      `/jettons/${jettonAddress}/holders?limit=${limit}`,
      JettonHoldersSchema
    );
    return {
      total: result.total,
      holders: result.addresses.map(h => ({
        address: h.address,
        balance: h.balance,
      })),
    };
  }
}

// ============================================================================
// Singleton instance
// ============================================================================

let _client: TonApiClient | null = null;

export function getTonApiClient(config?: TonApiConfig): TonApiClient {
  if (!_client) {
    _client = new TonApiClient(config);
  }
  return _client;
}

