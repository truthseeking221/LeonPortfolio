/**
 * Deck endpoints - Token discovery
 * 
 * POST /v1/deck/batch - Get batch of tokens for swiping
 * GET  /v1/deck/token/:id - Get single token details
 * POST /v1/deck/search - Search for tokens
 * 
 * Uses real data from GeckoTerminal and DexScreener APIs
 */

import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { validateAccessToken } from './auth.js';
import { ApiError, ErrorCode } from '../types/errors.js';

// Import deck service from infra package
// For now, we'll create inline implementation that calls the APIs directly

// ============================================================================
// Types
// ============================================================================

export interface Card {
  readonly token_id: string;
  readonly symbol: string;
  readonly name: string;
  readonly price_usd: string;
  readonly change_24h_pct: number;
  readonly liquidity_usd: string;
  readonly volume_24h_usd: string;
  readonly age_minutes: number;
  readonly media_url: string;
  readonly risk_signals: string[];
  readonly pair_address: string;
}

export interface DeckBatchResponse {
  readonly cards: Card[];
  readonly cursor: string | null;
}

// ============================================================================
// API Clients (inline for now)
// ============================================================================

const DEXSCREENER_BASE = 'https://api.dexscreener.com/latest/dex';
const GECKOTERMINAL_BASE = 'https://api.geckoterminal.com/api/v2';

interface DexScreenerPair {
  chainId: string;
  dexId: string;
  pairAddress: string;
  baseToken: { address: string; name: string; symbol: string };
  quoteToken: { address: string; name: string; symbol: string };
  priceUsd: string;
  priceChange?: { h24?: number };
  volume?: { h24?: number };
  liquidity?: { usd?: number };
  fdv?: number;
  pairCreatedAt?: number;
  info?: { imageUrl?: string };
}

async function fetchTrendingTON(): Promise<DexScreenerPair[]> {
  try {
    const response = await fetch(`${DEXSCREENER_BASE}/search?q=ton`);
    if (!response.ok) return [];
    
    const data = await response.json() as { pairs?: DexScreenerPair[] };
    return (data.pairs || [])
      .filter((p: DexScreenerPair) => p.chainId === 'ton')
      .sort((a: DexScreenerPair, b: DexScreenerPair) => 
        (b.volume?.h24 || 0) - (a.volume?.h24 || 0)
      )
      .slice(0, 50);
  } catch {
    return [];
  }
}

interface GeckoPool {
  attributes?: {
    address?: string;
    name?: string;
    base_token_price_usd?: string;
    price_change_percentage?: { h24?: string };
    volume_usd?: { h24?: string };
    reserve_in_usd?: string;
    fdv_usd?: string;
    pool_created_at?: string;
  };
  relationships?: {
    base_token?: { data?: { id?: string } };
  };
}

async function fetchGeckoTrending(): Promise<DexScreenerPair[]> {
  try {
    const response = await fetch(`${GECKOTERMINAL_BASE}/networks/ton/trending_pools`);
    if (!response.ok) return [];
    
    const data = await response.json() as { data?: GeckoPool[] };
    
    // Transform GeckoTerminal format to DexScreener-like format
    return (data.data || []).map((pool: GeckoPool) => ({
      chainId: 'ton',
      dexId: 'geckoterminal',
      pairAddress: pool.attributes?.address || '',
      baseToken: {
        address: pool.relationships?.base_token?.data?.id?.split('_')[1] || '',
        name: pool.attributes?.name?.split(' / ')[0] || 'Unknown',
        symbol: pool.attributes?.name?.split(' / ')[0]?.split(' ')[0] || '???',
      },
      quoteToken: {
        address: '',
        name: 'TON',
        symbol: 'TON',
      },
      priceUsd: pool.attributes?.base_token_price_usd || '0',
      priceChange: {
        h24: parseFloat(pool.attributes?.price_change_percentage?.h24 || '0'),
      },
      volume: {
        h24: parseFloat(pool.attributes?.volume_usd?.h24 || '0'),
      },
      liquidity: {
        usd: parseFloat(pool.attributes?.reserve_in_usd || '0'),
      },
      fdv: parseFloat(pool.attributes?.fdv_usd || '0'),
      pairCreatedAt: pool.attributes?.pool_created_at 
        ? new Date(pool.attributes.pool_created_at).getTime() 
        : undefined,
    }));
  } catch {
    return [];
  }
}

async function searchTokens(query: string): Promise<DexScreenerPair[]> {
  try {
    const response = await fetch(`${DEXSCREENER_BASE}/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) return [];
    
    const data = await response.json() as { pairs?: DexScreenerPair[] };
    return (data.pairs || []).filter((p: DexScreenerPair) => p.chainId === 'ton');
  } catch {
    return [];
  }
}

function transformToCard(pair: DexScreenerPair): Card {
  const price = parseFloat(pair.priceUsd) || 0;
  const change24h = pair.priceChange?.h24 || 0;
  const volume24h = pair.volume?.h24 || 0;
  const liquidity = pair.liquidity?.usd || 0;
  
  // Calculate age in minutes
  const ageMs = pair.pairCreatedAt 
    ? Date.now() - pair.pairCreatedAt 
    : 0;
  const ageMinutes = Math.floor(ageMs / (1000 * 60));
  
  // Determine risk signals
  const riskSignals: string[] = [];
  if (liquidity < 10000) riskSignals.push('LOW_LIQUIDITY');
  if (ageMinutes < 60 * 24) riskSignals.push('NEW_TOKEN');
  if (change24h > 100) riskSignals.push('HIGH_VOLATILITY');
  if (change24h < -50) riskSignals.push('PRICE_DUMP');
  
  // Generate placeholder image if none provided
  const imageUrl = pair.info?.imageUrl || 
    `https://api.dicebear.com/7.x/shapes/svg?seed=${pair.baseToken.symbol}&backgroundColor=1a1a2e`;
  
  return {
    token_id: pair.baseToken.address,
    symbol: pair.baseToken.symbol,
    name: pair.baseToken.name,
    price_usd: price.toFixed(price < 0.01 ? 8 : 4),
    change_24h_pct: parseFloat(change24h.toFixed(2)),
    liquidity_usd: liquidity.toFixed(0),
    volume_24h_usd: volume24h.toFixed(0),
    age_minutes: ageMinutes,
    media_url: imageUrl,
    risk_signals: riskSignals,
    pair_address: pair.pairAddress,
  };
}

// ============================================================================
// Request Schemas
// ============================================================================

const DeckBatchRequestSchema = z.object({
  count: z.number().min(1).max(20).default(10),
  exclude_ids: z.array(z.string()).optional().default([]),
});

const DeckSearchRequestSchema = z.object({
  query: z.string().min(1).max(100),
});

// ============================================================================
// Auth helper
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
// In-memory cache
// ============================================================================

interface CacheEntry {
  data: Card[];
  timestamp: number;
}

let deckCache: CacheEntry | null = null;
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache

async function getCachedDeck(): Promise<Card[]> {
  const now = Date.now();
  
  if (deckCache && (now - deckCache.timestamp) < CACHE_TTL_MS) {
    return deckCache.data;
  }
  
  // Fetch from both sources in parallel
  const [dexPairs, geckoPairs] = await Promise.all([
    fetchTrendingTON(),
    fetchGeckoTrending(),
  ]);
  
  // Combine and dedupe by token address
  const allPairs = [...geckoPairs, ...dexPairs];
  const seen = new Set<string>();
  const uniquePairs = allPairs.filter(pair => {
    const key = pair.baseToken.address.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  
  const cards = uniquePairs.map(transformToCard);
  
  deckCache = { data: cards, timestamp: now };
  return cards;
}

// ============================================================================
// Route Registration
// ============================================================================

export async function deckRoutes(fastify: FastifyInstance): Promise<void> {
  
  /**
   * POST /v1/deck/batch
   * Get batch of tokens for swiping
   */
  fastify.post<{
    Body: z.infer<typeof DeckBatchRequestSchema>;
    Reply: DeckBatchResponse;
  }>('/deck/batch', {
    schema: {
      body: {
        type: 'object',
        properties: {
          count: { type: 'number', minimum: 1, maximum: 20, default: 10 },
          exclude_ids: { type: 'array', items: { type: 'string' } },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            cards: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  token_id: { type: 'string' },
                  symbol: { type: 'string' },
                  name: { type: 'string' },
                  price_usd: { type: 'string' },
                  change_24h_pct: { type: 'number' },
                  liquidity_usd: { type: 'string' },
                  volume_24h_usd: { type: 'string' },
                  age_minutes: { type: 'number' },
                  media_url: { type: 'string' },
                  risk_signals: { type: 'array', items: { type: 'string' } },
                  pair_address: { type: 'string' },
                },
              },
            },
            cursor: { type: 'string', nullable: true },
          },
        },
      },
    },
  }, async (request, _reply) => {
    // Validate auth
    extractUserId(request.headers.authorization);
    
    // Parse request
    const parsed = DeckBatchRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new ApiError(
        ErrorCode.VALIDATION_ERROR,
        'Invalid request body',
        { issues: parsed.error.issues }
      );
    }
    
    const { count, exclude_ids } = parsed.data;
    
    // Get cached deck
    const allCards = await getCachedDeck();
    
    // Filter excluded tokens
    const filteredCards = allCards.filter(
      card => !exclude_ids.includes(card.token_id)
    );
    
    // Return requested count
    const cards = filteredCards.slice(0, count);
    
    return {
      cards,
      cursor: filteredCards.length > count ? String(count) : null,
    };
  });

  /**
   * GET /v1/deck/token/:token_id
   * Get single token details
   */
  fastify.get<{
    Params: { token_id: string };
    Reply: Card;
  }>('/deck/token/:token_id', {
    schema: {
      params: {
        type: 'object',
        required: ['token_id'],
        properties: {
          token_id: { type: 'string' },
        },
      },
    },
  }, async (request, _reply) => {
    extractUserId(request.headers.authorization);
    
    const { token_id } = request.params;
    
    // Try to find in cache first
    const cachedCards = await getCachedDeck();
    const cachedCard = cachedCards.find(c => c.token_id === token_id);
    if (cachedCard) return cachedCard;
    
    // Search for it
    const pairs = await searchTokens(token_id);
    const pair = pairs.find(p => 
      p.baseToken.address.toLowerCase() === token_id.toLowerCase()
    );
    
    if (!pair) {
      throw new ApiError(ErrorCode.NOT_FOUND, 'Token not found');
    }
    
    return transformToCard(pair);
  });

  /**
   * POST /v1/deck/search
   * Search for tokens
   */
  fastify.post<{
    Body: z.infer<typeof DeckSearchRequestSchema>;
    Reply: DeckBatchResponse;
  }>('/deck/search', {
    schema: {
      body: {
        type: 'object',
        required: ['query'],
        properties: {
          query: { type: 'string', minLength: 1, maxLength: 100 },
        },
      },
    },
  }, async (request, _reply) => {
    extractUserId(request.headers.authorization);
    
    const parsed = DeckSearchRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new ApiError(
        ErrorCode.VALIDATION_ERROR,
        'Invalid request body',
        { issues: parsed.error.issues }
      );
    }
    
    const { query } = parsed.data;
    
    const pairs = await searchTokens(query);
    const cards = pairs.slice(0, 20).map(transformToCard);
    
    return {
      cards,
      cursor: null,
    };
  });
}

