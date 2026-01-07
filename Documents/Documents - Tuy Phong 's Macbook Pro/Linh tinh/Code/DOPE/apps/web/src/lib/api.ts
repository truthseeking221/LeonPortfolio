/**
 * API Service - Backend API client
 * Handles authentication and API calls
 */

import { ENV } from './config'

// ============================================================================
// Types (matching backend response types)
// ============================================================================

export interface ApiCard {
  readonly token_id: string
  readonly symbol: string
  readonly name: string
  readonly price_usd: string
  readonly change_24h_pct: number
  readonly liquidity_usd: string
  readonly volume_24h_usd: string
  readonly age_minutes: number
  readonly media_url: string
  readonly risk_signals: string[]
  readonly pair_address: string
}

export interface DeckBatchResponse {
  readonly cards: ApiCard[]
  readonly cursor: string | null
}

export interface AuthResponse {
  readonly access_token: string
  readonly session_id: string
  readonly user_id: string
  readonly expires_at: string
}

// ============================================================================
// Token Storage
// ============================================================================

let accessToken: string | null = null
let tokenExpiry: number | null = null

export function setAccessToken(token: string, expiresAt: string): void {
  accessToken = token
  tokenExpiry = new Date(expiresAt).getTime()
}

export function getAccessToken(): string | null {
  if (!accessToken) return null
  if (tokenExpiry && Date.now() > tokenExpiry) {
    accessToken = null
    tokenExpiry = null
    return null
  }
  return accessToken
}

export function clearAccessToken(): void {
  accessToken = null
  tokenExpiry = null
}

// ============================================================================
// Auth
// ============================================================================

/**
 * Authenticate with Telegram initData
 * For dev: Uses mock:12345 initData
 * For prod: Uses real Telegram WebApp initData
 */
export async function authenticate(initData?: string): Promise<AuthResponse> {
  // Use real Telegram initData if available, otherwise use mock for dev
  const data = initData || (
    typeof window !== 'undefined' && window.Telegram?.WebApp?.initData
  ) || 'mock:12345'

  const response = await fetch(`${ENV.apiBaseUrl}/v1/auth/telegram`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ init_data: data }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Authentication failed')
  }

  const result = await response.json() as AuthResponse
  setAccessToken(result.access_token, result.expires_at)
  
  return result
}

// ============================================================================
// Deck API
// ============================================================================

/**
 * Fetch batch of tokens for deck
 */
export async function fetchDeckBatch(
  count: number = 20,
  excludeIds: string[] = []
): Promise<DeckBatchResponse> {
  const token = getAccessToken()
  if (!token) {
    // Try to authenticate first
    await authenticate()
  }

  const response = await fetch(`${ENV.apiBaseUrl}/v1/deck/batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify({
      count,
      exclude_ids: excludeIds,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    
    // If unauthorized, try to re-authenticate
    if (response.status === 401) {
      clearAccessToken()
      await authenticate()
      return fetchDeckBatch(count, excludeIds)
    }
    
    throw new Error(error.message || 'Failed to fetch deck')
  }

  return response.json() as Promise<DeckBatchResponse>
}

/**
 * Search for tokens
 */
export async function searchTokens(query: string): Promise<DeckBatchResponse> {
  const token = getAccessToken()
  if (!token) {
    await authenticate()
  }

  const response = await fetch(`${ENV.apiBaseUrl}/v1/deck/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify({ query }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Search failed')
  }

  return response.json() as Promise<DeckBatchResponse>
}

/**
 * Get single token details
 */
export async function getToken(tokenId: string): Promise<ApiCard> {
  const token = getAccessToken()
  if (!token) {
    await authenticate()
  }

  const response = await fetch(`${ENV.apiBaseUrl}/v1/deck/token/${encodeURIComponent(tokenId)}`, {
    headers: {
      'Authorization': `Bearer ${getAccessToken()}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Token not found')
  }

  return response.json() as Promise<ApiCard>
}

