/**
 * DexScreener API Provider
 * Free API for DEX data across all chains including TON
 * 
 * Docs: https://docs.dexscreener.com/api/reference
 */

const BASE_URL = 'https://api.dexscreener.com/latest/dex'

// Types
export interface DexScreenerToken {
  address: string
  name: string
  symbol: string
}

export interface DexScreenerPair {
  chainId: string
  dexId: string
  url: string
  pairAddress: string
  baseToken: DexScreenerToken
  quoteToken: DexScreenerToken
  priceNative: string
  priceUsd: string
  txns: {
    m5: { buys: number; sells: number }
    h1: { buys: number; sells: number }
    h6: { buys: number; sells: number }
    h24: { buys: number; sells: number }
  }
  volume: {
    h24: number
    h6: number
    h1: number
    m5: number
  }
  priceChange: {
    m5: number
    h1: number
    h6: number
    h24: number
  }
  liquidity?: {
    usd: number
    base: number
    quote: number
  }
  fdv?: number
  marketCap?: number
  pairCreatedAt?: number
  info?: {
    imageUrl?: string
    websites?: { label: string; url: string }[]
    socials?: { type: string; url: string }[]
  }
}

export interface DexScreenerResponse {
  schemaVersion: string
  pairs: DexScreenerPair[] | null
}

// API Functions
export async function searchTokens(query: string): Promise<DexScreenerPair[]> {
  const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`)
  if (!response.ok) throw new Error('DexScreener search failed')
  
  const data: DexScreenerResponse = await response.json()
  
  // Filter only TON pairs
  return (data.pairs || []).filter(p => p.chainId === 'ton')
}

export async function getTokenPairs(tokenAddress: string): Promise<DexScreenerPair[]> {
  const response = await fetch(`${BASE_URL}/tokens/${tokenAddress}`)
  if (!response.ok) throw new Error('DexScreener token lookup failed')
  
  const data: DexScreenerResponse = await response.json()
  return (data.pairs || []).filter(p => p.chainId === 'ton')
}

export async function getPairInfo(pairAddress: string): Promise<DexScreenerPair | null> {
  const response = await fetch(`${BASE_URL}/pairs/ton/${pairAddress}`)
  if (!response.ok) throw new Error('DexScreener pair lookup failed')
  
  const data: DexScreenerResponse = await response.json()
  return data.pairs?.[0] || null
}

export async function getTrendingTON(): Promise<DexScreenerPair[]> {
  // DexScreener doesn't have a direct trending endpoint
  // We can search for popular TON tokens or use boosted tokens
  const response = await fetch(`${BASE_URL}/search?q=ton`)
  if (!response.ok) throw new Error('DexScreener trending failed')
  
  const data: DexScreenerResponse = await response.json()
  
  // Filter TON pairs and sort by volume
  return (data.pairs || [])
    .filter(p => p.chainId === 'ton')
    .sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0))
    .slice(0, 50)
}

// Transform to app Token format
export function transformToToken(pair: DexScreenerPair): {
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
} {
  const price = parseFloat(pair.priceUsd) || 0
  const change24h = pair.priceChange?.h24 || 0
  const volume24h = pair.volume?.h24 || 0
  const liquidity = pair.liquidity?.usd || 0
  const fdv = pair.fdv || 0
  
  // Determine risk level based on liquidity and age
  let riskLevel: 'LOW' | 'MED' | 'HIGH' = 'HIGH'
  const reasons: string[] = []
  
  if (liquidity < 10000) {
    reasons.push('Low liquidity (<$10k)')
  } else if (liquidity < 50000) {
    riskLevel = 'MED'
    reasons.push('Medium liquidity')
  } else {
    riskLevel = 'LOW'
  }
  
  const ageHours = pair.pairCreatedAt 
    ? (Date.now() - pair.pairCreatedAt) / (1000 * 60 * 60)
    : 0
  
  if (ageHours < 24) {
    riskLevel = 'HIGH'
    reasons.push('New token (<24h)')
  } else if (ageHours < 168) {
    if (riskLevel === 'LOW') riskLevel = 'MED'
    reasons.push('Young token (<7d)')
  }
  
  // Generate color from symbol hash
  const hash = pair.baseToken.symbol.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  const hue = Math.abs(hash) % 360
  const color = `hsl(${hue}, 70%, 50%)`
  
  return {
    id: pair.baseToken.address,
    symbol: pair.baseToken.symbol,
    name: pair.baseToken.name,
    price,
    change24h,
    image: pair.info?.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${pair.baseToken.symbol}`,
    color,
    stats: {
      marketCap: formatNumber(fdv),
      volume: formatNumber(volume24h),
      holders: 'N/A', // DexScreener doesn't provide holder count
    },
    risk: {
      level: riskLevel,
      reasons: reasons.length > 0 ? reasons : ['No major risks detected'],
    },
    address: pair.baseToken.address,
    pairAddress: pair.pairAddress,
  }
}

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toFixed(0)
}

