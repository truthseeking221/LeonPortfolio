/**
 * Game Store - Card interaction state machine
 * Implements PRD Part 1: §4.2 Card interaction state machine
 * 
 * States:
 * DISCOVERING → HOLD_ARMED → HOLD_CANCELED | COMMITTING_BUY
 * → BUY_SENT_OPTIMISTIC → BUY_RESOLVED
 * → HOLDING_POSITION → COMMITTING_SELL → SELL_RESOLVED
 */

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { BUY_PRESETS, GESTURE_CONFIG } from '@/lib/config'
import { fetchDeckBatch, type ApiCard } from '@/lib/api'

// Card interaction states (PRD §4.2)
export type CardInteractionState = 
  | 'DISCOVERING'
  | 'HOLD_POSSIBLE'      // Finger down, waiting for dwell
  | 'HOLD_ARMED'         // Armed, tracking levels
  | 'HOLD_CANCELED'      // Dragged to cancel zone
  | 'COMMITTING_BUY'     // Processing buy
  | 'BUY_SENT_OPTIMISTIC'
  | 'BUY_RESOLVED'
  | 'HOLDING_POSITION'   // Has position, showing PnL
  | 'COMMITTING_SELL'
  | 'SELL_SENT_OPTIMISTIC'
  | 'SELL_RESOLVED'

export type BuyLevel = 'L1' | 'L2' | 'L3' | null

// Mock token data for MVP
export interface Token {
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
    signals: string[]
  }
}

// Position data
export interface Position {
  tokenId: string
  symbol: string
  balance: number
  costBasis: number
  entryPrice: number
  currentValue: number
  unrealizedPnl: number
  unrealizedPnlPercent: number
  lastUpdate: number
}

export interface GameState {
  // Card interaction state
  interactionState: CardInteractionState
  
  // Hold tracking
  holdStartTime: number | null
  holdDuration: number
  currentLevel: BuyLevel
  gestureId: string | null
  
  // Drag tracking
  dragY: number
  isDragging: boolean
  isInCancelZone: boolean
  
  // Deck
  deckIndex: number
  deck: Token[]
  deckLoading: boolean
  deckError: string | null
  
  // Current position (if holding)
  position: Position | null
  
  // PnL display state (PRD Part 3 §3)
  pnlState: 'LIVE' | 'STALE' | 'DEGRADED' | 'PENDING' | 'SYNCING'
  lastPriceUpdate: number
  
  // Actions
  setInteractionState: (state: CardInteractionState) => void
  
  // Hold gesture
  startHold: () => void
  updateHold: (durationMs: number) => boolean
  cancelHold: () => void
  releaseHold: () => { level: BuyLevel; amount: number } | null
  
  // Drag
  setDragY: (y: number) => void
  setIsDragging: (dragging: boolean) => void
  checkCancelZone: () => boolean
  
  // Deck navigation
  nextCard: () => void
  prevCard: () => void
  setDeckIndex: (index: number) => void
  
  // Deck loading
  loadDeck: () => Promise<void>
  refreshDeck: () => Promise<void>
  
  // Position
  setPosition: (position: Position | null) => void
  updatePnl: (currentPrice: number) => void
  
  // PnL state
  setPnlState: (state: GameState['pnlState']) => void
  
  // Reset
  resetToDiscovering: () => void
}

// Get level from hold duration
const getLevelFromDuration = (durationMs: number): BuyLevel => {
  if (durationMs >= GESTURE_CONFIG.LEVEL_THRESHOLDS.L3) return 'L3'
  if (durationMs >= GESTURE_CONFIG.LEVEL_THRESHOLDS.L2) return 'L2'
  if (durationMs >= GESTURE_CONFIG.LEVEL_THRESHOLDS.L1) return 'L1'
  return null
}

// Generate gesture ID (for idempotency)
const generateGestureId = (): string => {
  return `g_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

// Transform API card to UI Token format
function transformApiCard(card: ApiCard): Token {
  const price = parseFloat(card.price_usd)
  const volume = parseFloat(card.volume_24h_usd)
  const liquidity = parseFloat(card.liquidity_usd)
  
  // Determine risk level from signals
  let riskLevel: 'LOW' | 'MED' | 'HIGH' = 'LOW'
  if (card.risk_signals.includes('LOW_LIQUIDITY') || card.risk_signals.includes('HIGH_VOLATILITY')) {
    riskLevel = 'HIGH'
  } else if (card.risk_signals.includes('NEW_TOKEN') || card.risk_signals.includes('PRICE_DUMP')) {
    riskLevel = 'MED'
  }

  // Format numbers for display
  const formatValue = (val: number): string => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`
    if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`
    if (val >= 1e3) return `$${(val / 1e3).toFixed(1)}K`
    return `$${val.toFixed(0)}`
  }

  // Generate color from symbol hash
  const colors = ['#4ade80', '#fbbf24', '#f97316', '#eab308', '#22d3ee', '#a855f7', '#ec4899']
  const colorIndex = card.symbol.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length

  return {
    id: card.token_id,
    symbol: card.symbol,
    name: card.name,
    price,
    change24h: card.change_24h_pct,
    image: card.media_url,
    color: colors[colorIndex],
    stats: {
      marketCap: formatValue(liquidity * 10), // Estimate mcap as 10x liquidity
      volume: formatValue(volume),
      holders: 'N/A', // Not available from API
    },
    risk: {
      level: riskLevel,
      signals: card.risk_signals.map(s => s.replace(/_/g, ' ')),
    },
  }
}

export const useGameStore = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    interactionState: 'DISCOVERING',
    
    holdStartTime: null,
    holdDuration: 0,
    currentLevel: null,
    gestureId: null,
    
    dragY: 0,
    isDragging: false,
    isInCancelZone: false,
    
    deckIndex: 0,
    deck: [], // Start empty, load from API
    deckLoading: false,
    deckError: null,
    
    position: null,
    
    pnlState: 'LIVE',
    lastPriceUpdate: Date.now(),
    
    // Actions
    setInteractionState: (state) => set({ interactionState: state }),
    
    startHold: () => {
      const current = get().interactionState
      if (current !== 'DISCOVERING') return
      
      set({
        interactionState: 'HOLD_POSSIBLE',
        holdStartTime: Date.now(),
        holdDuration: 0,
        currentLevel: null,
        gestureId: generateGestureId(),
        isInCancelZone: false,
      })
    },
    
    updateHold: (durationMs) => {
      const current = get().interactionState
      if (current !== 'HOLD_POSSIBLE' && current !== 'HOLD_ARMED') return false
      
      const newLevel = getLevelFromDuration(durationMs)
      const prevLevel = get().currentLevel
      
      // Transition to ARMED once we pass L1 threshold
      const newState = durationMs >= GESTURE_CONFIG.LEVEL_THRESHOLDS.L1 
        ? 'HOLD_ARMED' 
        : 'HOLD_POSSIBLE'
      
      set({
        interactionState: newState,
        holdDuration: durationMs,
        currentLevel: newLevel,
      })
      
      // Return true if level changed (for haptic feedback)
      return newLevel !== prevLevel && newLevel !== null
    },
    
    cancelHold: () => {
      set({
        interactionState: 'HOLD_CANCELED',
        isInCancelZone: true,
      })
    },
    
    releaseHold: () => {
      const { interactionState, currentLevel, isInCancelZone } = get()
      
      // If canceled or not armed, return null
      if (
        interactionState === 'HOLD_CANCELED' ||
        isInCancelZone ||
        !currentLevel ||
        (interactionState !== 'HOLD_ARMED' && interactionState !== 'HOLD_POSSIBLE')
      ) {
        get().resetToDiscovering()
        return null
      }
      
      // Get amount from level
      const amount = BUY_PRESETS[currentLevel].amount
      
      set({ interactionState: 'COMMITTING_BUY' })
      
      return { level: currentLevel, amount }
    },
    
    setDragY: (y) => {
      const isInCancel = y < GESTURE_CONFIG.CANCEL_THRESHOLD_PX
      set({ 
        dragY: y,
        isInCancelZone: isInCancel,
      })
      
      // Auto-transition to canceled state
      if (isInCancel && get().interactionState === 'HOLD_ARMED') {
        set({ interactionState: 'HOLD_CANCELED' })
      } else if (!isInCancel && get().interactionState === 'HOLD_CANCELED') {
        set({ interactionState: 'HOLD_ARMED' })
      }
    },
    
    setIsDragging: (dragging) => set({ isDragging: dragging }),
    
    checkCancelZone: () => get().isInCancelZone,
    
    nextCard: () => set((state) => ({
      deckIndex: (state.deckIndex + 1) % state.deck.length,
    })),
    
    prevCard: () => set((state) => ({
      deckIndex: (state.deckIndex - 1 + state.deck.length) % state.deck.length,
    })),
    
    setDeckIndex: (index) => set({ deckIndex: index }),
    
    // Load deck from API
    loadDeck: async () => {
      const { deckLoading, deck } = get()
      if (deckLoading || deck.length > 0) return // Already loading or loaded
      
      set({ deckLoading: true, deckError: null })
      
      try {
        const response = await fetchDeckBatch(20) // API max is 20
        const tokens = response.cards.map(transformApiCard)
        
        set({
          deck: tokens,
          deckLoading: false,
          deckError: null,
        })
        
        console.log('[Deck] Loaded', tokens.length, 'tokens from API')
      } catch (error) {
        console.error('[Deck] Failed to load:', error)
        set({
          deckLoading: false,
          deckError: error instanceof Error ? error.message : 'Failed to load deck',
        })
      }
    },
    
    // Refresh deck (force reload)
    refreshDeck: async () => {
      set({ deckLoading: true, deckError: null })
      
      try {
        const seenIds = get().deck.slice(0, get().deckIndex).map(t => t.id)
        const response = await fetchDeckBatch(20, seenIds) // API max is 20
        const tokens = response.cards.map(transformApiCard)
        
        set({
          deck: tokens,
          deckIndex: 0,
          deckLoading: false,
          deckError: null,
        })
        
        console.log('[Deck] Refreshed with', tokens.length, 'tokens')
      } catch (error) {
        console.error('[Deck] Failed to refresh:', error)
        set({
          deckLoading: false,
          deckError: error instanceof Error ? error.message : 'Failed to refresh deck',
        })
      }
    },
    
    setPosition: (position) => set({ 
      position,
      interactionState: position ? 'HOLDING_POSITION' : 'DISCOVERING',
    }),
    
    updatePnl: (currentPrice) => {
      const position = get().position
      if (!position) return
      
      const currentValue = position.balance * currentPrice
      const unrealizedPnl = currentValue - position.costBasis
      const unrealizedPnlPercent = position.costBasis > 0 
        ? (unrealizedPnl / position.costBasis) * 100 
        : 0
      
      set({
        position: {
          ...position,
          currentValue,
          unrealizedPnl,
          unrealizedPnlPercent,
          lastUpdate: Date.now(),
        },
        lastPriceUpdate: Date.now(),
        pnlState: 'LIVE',
      })
    },
    
    setPnlState: (pnlState) => set({ pnlState }),
    
    resetToDiscovering: () => set({
      interactionState: 'DISCOVERING',
      holdStartTime: null,
      holdDuration: 0,
      currentLevel: null,
      gestureId: null,
      dragY: 0,
      isDragging: false,
      isInCancelZone: false,
    }),
  }))
)

// Selectors
export const selectCurrentToken = (state: GameState) => 
  state.deck[state.deckIndex]

export const selectNextToken = (state: GameState) =>
  state.deck[(state.deckIndex + 1) % state.deck.length]

export const selectIsHolding = (state: GameState) =>
  state.interactionState === 'HOLD_ARMED' || 
  state.interactionState === 'HOLD_POSSIBLE'

export const selectIsCommitting = (state: GameState) =>
  state.interactionState === 'COMMITTING_BUY' ||
  state.interactionState === 'COMMITTING_SELL'

export const selectHasPosition = (state: GameState) =>
  state.interactionState === 'HOLDING_POSITION' && state.position !== null

export const selectDeckLoading = (state: GameState) => state.deckLoading

export const selectDeckError = (state: GameState) => state.deckError

export const selectIsDeckEmpty = (state: GameState) => 
  !state.deckLoading && state.deck.length === 0

