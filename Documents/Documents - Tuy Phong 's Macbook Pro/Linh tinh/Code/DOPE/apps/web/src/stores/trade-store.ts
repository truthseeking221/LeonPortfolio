/**
 * Trade Store - Trading state and activity log
 * Implements PRD Part 3 Section 6: Activity & Audit View
 * 
 * Trade state machine (PRD §4.3):
 * NOT_CREATED → CREATED → SIGNED → BROADCASTED → terminal
 * Terminal: CONFIRMED | FAILED_DETERMINISTIC | FAILED_TRANSIENT | UNKNOWN
 */

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

// Trade status (PRD §4.3)
export type TradeStatus = 
  | 'NOT_CREATED'
  | 'CREATED'
  | 'SIGNED'
  | 'BROADCASTED'
  | 'CONFIRMED'
  | 'FAILED_DETERMINISTIC'
  | 'FAILED_TRANSIENT'
  | 'UNKNOWN'

export type TradeSide = 'BUY' | 'SELL'

export interface Trade {
  id: string
  gestureId: string
  tokenId: string
  symbol: string
  side: TradeSide
  amount: number
  amountUnit: 'BASE' | 'TOKEN'
  status: TradeStatus
  statusReasonCode?: string
  retryable: boolean
  attemptCount: number
  chainTxId?: string
  createdAt: number
  updatedAt: number
  
  // For UI
  presetLevel?: 'L1' | 'L2' | 'L3'
}

export interface TradeState {
  // Activity log (PRD Section 6)
  trades: Trade[]
  
  // Current active trade (only one at a time - PRD Invariant)
  activeTrade: Trade | null
  
  // Session stats (for cap enforcement)
  sessionSpent: number
  daySpent: number
  sessionStartTime: number
  
  // Actions
  createTrade: (trade: Omit<Trade, 'id' | 'createdAt' | 'updatedAt' | 'attemptCount' | 'retryable'>) => Trade
  updateTradeStatus: (id: string, status: TradeStatus, extra?: Partial<Trade>) => void
  setActiveTrade: (trade: Trade | null) => void
  addToSessionSpent: (amount: number) => void
  resetSessionSpent: () => void
  
  // Selectors
  getTradeById: (id: string) => Trade | undefined
  getTradeByGestureId: (gestureId: string) => Trade | undefined
  getPendingTrades: () => Trade[]
  getRecentTrades: (limit?: number) => Trade[]
}

export const useTradeStore = create<TradeState>()(
  subscribeWithSelector((set, get) => ({
    trades: [],
    activeTrade: null,
    sessionSpent: 0,
    daySpent: 0,
    sessionStartTime: Date.now(),
    
    createTrade: (tradeData) => {
      const now = Date.now()
      const trade: Trade = {
        ...tradeData,
        id: `trade_${now}_${Math.random().toString(36).slice(2, 9)}`,
        createdAt: now,
        updatedAt: now,
        attemptCount: 1,
        retryable: false,
      }
      
      set((state) => ({
        trades: [trade, ...state.trades],
        activeTrade: trade,
      }))
      
      return trade
    },
    
    updateTradeStatus: (id, status, extra) => {
      set((state) => ({
        trades: state.trades.map((t) => 
          t.id === id 
            ? { 
                ...t, 
                ...extra,
                status, 
                updatedAt: Date.now(),
                retryable: status === 'FAILED_TRANSIENT',
              } 
            : t
        ),
        activeTrade: state.activeTrade?.id === id
          ? { 
              ...state.activeTrade, 
              ...extra,
              status, 
              updatedAt: Date.now(),
              retryable: status === 'FAILED_TRANSIENT',
            }
          : state.activeTrade,
      }))
    },
    
    setActiveTrade: (trade) => set({ activeTrade: trade }),
    
    addToSessionSpent: (amount) => set((state) => ({
      sessionSpent: state.sessionSpent + amount,
      daySpent: state.daySpent + amount,
    })),
    
    resetSessionSpent: () => set({ 
      sessionSpent: 0, 
      sessionStartTime: Date.now() 
    }),
    
    // Selectors
    getTradeById: (id) => get().trades.find((t) => t.id === id),
    
    getTradeByGestureId: (gestureId) => 
      get().trades.find((t) => t.gestureId === gestureId),
    
    getPendingTrades: () => 
      get().trades.filter((t) => 
        ['CREATED', 'SIGNED', 'BROADCASTED', 'UNKNOWN'].includes(t.status)
      ),
    
    getRecentTrades: (limit = 10) => get().trades.slice(0, limit),
  }))
)

