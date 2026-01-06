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
  
  // Current position (if holding)
  position: Position | null
  
  // PnL display state (PRD Part 3 §3)
  pnlState: 'LIVE' | 'STALE' | 'DEGRADED' | 'PENDING' | 'SYNCING'
  lastPriceUpdate: number
  
  // Actions
  setInteractionState: (state: CardInteractionState) => void
  
  // Hold gesture
  startHold: () => void
  updateHold: (durationMs: number) => void
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

// Mock deck data
const MOCK_DECK: Token[] = [
  {
    id: 'pepe',
    symbol: 'PEPE',
    name: 'Pepe The Frog',
    price: 0.0000420,
    change24h: 12.4,
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop',
    color: '#4ade80',
    stats: { marketCap: '$4.2B', volume: '$240M', holders: '150k' },
    risk: { level: 'LOW', signals: ['Top 10 CEX', 'Renounced', 'High Liq'] },
  },
  {
    id: 'bonk',
    symbol: 'BONK',
    name: 'Bonk Inu',
    price: 0.0000156,
    change24h: 8.2,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000&auto=format&fit=crop',
    color: '#fbbf24',
    stats: { marketCap: '$1.8B', volume: '$120M', holders: '320k' },
    risk: { level: 'MED', signals: ['Community Takeover', 'Vol Spike'] },
  },
  {
    id: 'wif',
    symbol: 'WIF',
    name: 'Dogwifhat',
    price: 2.45,
    change24h: -3.1,
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1000&auto=format&fit=crop',
    color: '#f97316',
    stats: { marketCap: '$2.1B', volume: '$500M', holders: '80k' },
    risk: { level: 'LOW', signals: ['Blue Chip', 'Hat stays on'] },
  },
  {
    id: 'doge',
    symbol: 'DOGE',
    name: 'Dogecoin',
    price: 0.12,
    change24h: 5.7,
    image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?q=80&w=1000&auto=format&fit=crop',
    color: '#eab308',
    stats: { marketCap: '$15B', volume: '$1.2B', holders: '5M' },
    risk: { level: 'LOW', signals: ['OG Meme', 'Elon Approved'] },
  },
]

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
    deck: MOCK_DECK,
    
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
      if (current !== 'HOLD_POSSIBLE' && current !== 'HOLD_ARMED') return
      
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

