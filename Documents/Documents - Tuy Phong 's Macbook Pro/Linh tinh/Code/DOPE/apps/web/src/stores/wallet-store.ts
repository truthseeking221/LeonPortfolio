/**
 * Wallet Store - Wallet connection and balance state
 * Implements PRD Part 2: F-03 Wallet Connect / Create
 * 
 * Wallet states:
 * DISCONNECTED → CONNECTING → CONNECTED | SESSION_EXPIRED | ERROR
 */

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { GAS_CONFIG } from '@/lib/config'

// Wallet connection states (PRD F-03)
export type WalletState = 
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'SESSION_EXPIRED'
  | 'ERROR'

export interface WalletStore {
  // Connection state
  walletState: WalletState
  walletError: string | null
  
  // Wallet info (when connected)
  address: string | null
  balance: number
  
  // Computed: spendable balance (PRD Appendix A3)
  spendableBalance: number
  
  // Actions
  setWalletState: (state: WalletState, error?: string) => void
  setAddress: (address: string | null) => void
  setBalance: (balance: number) => void
  
  // Connect flow
  connect: () => Promise<void>
  disconnect: () => void
  
  // Balance operations
  canSpend: (amount: number) => boolean
  deductBalance: (amount: number) => void
  addBalance: (amount: number) => void
}

// Calculate spendable balance (Invariant G - PRD Appendix A3)
const calculateSpendable = (balance: number): number => {
  const reserved = GAS_CONFIG.RESERVE_BASE + GAS_CONFIG.WORST_CASE_FEES
  return Math.max(0, balance - reserved)
}

export const useWalletStore = create<WalletStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    walletState: 'DISCONNECTED',
    walletError: null,
    address: null,
    balance: 0,
    spendableBalance: 0,
    
    // Actions
    setWalletState: (walletState, error) => set({ 
      walletState, 
      walletError: error || null 
    }),
    
    setAddress: (address) => set({ address }),
    
    setBalance: (balance) => set({ 
      balance,
      spendableBalance: calculateSpendable(balance),
    }),
    
    // Connect flow (mock for MVP, will be TON Connect)
    connect: async () => {
      set({ walletState: 'CONNECTING', walletError: null })
      
      try {
        // Simulate connection delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        
        // Mock successful connection
        const mockAddress = 'UQ' + 'x'.repeat(46)
        const mockBalance = 69.42
        
        set({
          walletState: 'CONNECTED',
          address: mockAddress,
          balance: mockBalance,
          spendableBalance: calculateSpendable(mockBalance),
        })
      } catch (error) {
        set({
          walletState: 'ERROR',
          walletError: error instanceof Error ? error.message : 'Connection failed',
        })
      }
    },
    
    disconnect: () => {
      set({
        walletState: 'DISCONNECTED',
        address: null,
        balance: 0,
        spendableBalance: 0,
        walletError: null,
      })
    },
    
    // Balance operations
    canSpend: (amount) => {
      return get().spendableBalance >= amount
    },
    
    deductBalance: (amount) => {
      const newBalance = Math.max(0, get().balance - amount)
      set({
        balance: newBalance,
        spendableBalance: calculateSpendable(newBalance),
      })
    },
    
    addBalance: (amount) => {
      const newBalance = get().balance + amount
      set({
        balance: newBalance,
        spendableBalance: calculateSpendable(newBalance),
      })
    },
  }))
)

// Selectors
export const selectIsConnected = (state: WalletStore) =>
  state.walletState === 'CONNECTED'

export const selectNeedsReconnect = (state: WalletStore) =>
  state.walletState === 'SESSION_EXPIRED' ||
  state.walletState === 'ERROR'

export const selectCanTrade = (state: WalletStore) =>
  state.walletState === 'CONNECTED' && state.spendableBalance > 0

