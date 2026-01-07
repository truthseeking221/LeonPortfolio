/**
 * Deck Service
 * Fetches and manages the token deck for the app
 * 
 * Data sources (in priority order):
 * 1. GeckoTerminal trending pools
 * 2. DexScreener search
 * 3. Fallback mock data
 */

import { 
  getTrendingPools, 
  getNewPools,
  transformGeckoPoolToToken,
  type GeckoPool,
} from '../providers/geckoterminal'

import {
  getTrendingTON,
  searchTokens,
  transformToToken,
  type DexScreenerPair,
} from '../providers/dexscreener'

export interface DeckToken {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  image: string
  color: string
  stats: {
    marketCap: string
    volume: string
    holders: string
  }
  risk: {
    level: 'LOW' | 'MED' | 'HIGH'
    reasons: string[]
  }
  address: string
  pairAddress: string
}

export interface DeckConfig {
  minLiquidity?: number  // Minimum liquidity in USD
  minAge?: number        // Minimum age in hours
  maxRisk?: 'LOW' | 'MED' | 'HIGH'
  excludeSymbols?: string[]
}

const DEFAULT_CONFIG: DeckConfig = {
  minLiquidity: 1000,  // $1k minimum
  minAge: 0,           // No minimum age
  maxRisk: 'HIGH',     // Allow all risk levels
  excludeSymbols: [],
}

/**
 * Fetch tokens for the deck
 */
export async function fetchDeck(config: DeckConfig = {}): Promise<DeckToken[]> {
  const cfg = { ...DEFAULT_CONFIG, ...config }
  
  try {
    // Try GeckoTerminal first (better data quality)
    const [trending, newPools] = await Promise.all([
      getTrendingPools().catch(() => []),
      getNewPools().catch(() => []),
    ])
    
    const allPools = [...trending, ...newPools]
    
    if (allPools.length > 0) {
      const tokens = allPools
        .map(pool => transformGeckoPoolToToken(pool))
        .filter(token => filterToken(token, cfg))
      
      // Dedupe by symbol
      const seen = new Set<string>()
      const uniqueTokens = tokens.filter(t => {
        if (seen.has(t.symbol)) return false
        seen.add(t.symbol)
        return true
      })
      
      if (uniqueTokens.length >= 5) {
        return shuffleArray(uniqueTokens)
      }
    }
    
    // Fallback to DexScreener
    const dexPairs = await getTrendingTON().catch(() => [])
    
    if (dexPairs.length > 0) {
      const tokens = dexPairs
        .map(pair => transformToToken(pair))
        .filter(token => filterToken(token, cfg))
      
      // Dedupe by symbol
      const seen = new Set<string>()
      const uniqueTokens = tokens.filter(t => {
        if (seen.has(t.symbol)) return false
        seen.add(t.symbol)
        return true
      })
      
      return shuffleArray(uniqueTokens)
    }
    
    // Return empty if no data
    return []
    
  } catch (error) {
    console.error('[DeckService] Failed to fetch deck:', error)
    return []
  }
}

/**
 * Search for tokens
 */
export async function searchDeck(query: string): Promise<DeckToken[]> {
  if (!query || query.length < 2) return []
  
  try {
    const results = await searchTokens(query)
    return results.map(pair => transformToToken(pair))
  } catch (error) {
    console.error('[DeckService] Search failed:', error)
    return []
  }
}

/**
 * Refresh a single token's data
 */
export async function refreshToken(address: string): Promise<DeckToken | null> {
  try {
    const pairs = await searchTokens(address)
    const pair = pairs.find(p => 
      p.baseToken.address.toLowerCase() === address.toLowerCase()
    )
    
    if (pair) {
      return transformToToken(pair)
    }
    
    return null
  } catch (error) {
    console.error('[DeckService] Token refresh failed:', error)
    return null
  }
}

// Filter tokens based on config
function filterToken(token: DeckToken, config: DeckConfig): boolean {
  // Exclude specific symbols
  if (config.excludeSymbols?.includes(token.symbol)) {
    return false
  }
  
  // Filter by risk level
  const riskOrder = { 'LOW': 0, 'MED': 1, 'HIGH': 2 }
  if (config.maxRisk && riskOrder[token.risk.level] > riskOrder[config.maxRisk]) {
    return false
  }
  
  return true
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

