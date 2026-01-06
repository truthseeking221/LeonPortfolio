/**
 * App Store - Global application state
 * Implements the App Lifecycle State Machine from PRD Part 1: §4.1
 * 
 * States:
 * BOOT → READY ↔ BACKGROUND → RESUME_SYNC → READY
 * Plus: OFFLINE_DEGRADED, MAINTENANCE
 */

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { DEFAULT_FEATURE_FLAGS, type FeatureFlags } from '@/lib/config'

// App lifecycle states (PRD §4.1)
export type AppLifecycleState = 
  | 'BOOT'
  | 'READY'
  | 'BACKGROUND'
  | 'RESUME_SYNC'
  | 'OFFLINE_DEGRADED'
  | 'MAINTENANCE'

// Boot status for more granular UI
export type BootStatus = 
  | 'initializing'
  | 'loading_config'
  | 'restoring_session'
  | 'warming_providers'
  | 'ready'
  | 'failed'

export interface AppState {
  // Lifecycle
  lifecycleState: AppLifecycleState
  bootStatus: BootStatus
  bootError: string | null
  bootStartTime: number | null
  
  // Config (from remote)
  featureFlags: FeatureFlags
  configVersion: string | null
  
  // Network status
  isOnline: boolean
  connectionQuality: 'good' | 'degraded' | 'offline'
  
  // Consent (PRD F-02)
  hasConsent: boolean
  consentVersion: string | null
  
  // Audio unlock (PRD Appendix A5)
  isAudioUnlocked: boolean
  
  // Safe mode (accessibility)
  safeMode: boolean
  
  // Performance mode
  perfMode: 'auto' | 'high' | 'low'
  
  // Actions
  setLifecycleState: (state: AppLifecycleState) => void
  setBootStatus: (status: BootStatus, error?: string) => void
  setFeatureFlags: (flags: Partial<FeatureFlags>) => void
  setConfigVersion: (version: string) => void
  setIsOnline: (online: boolean) => void
  setConnectionQuality: (quality: 'good' | 'degraded' | 'offline') => void
  setHasConsent: (consent: boolean, version?: string) => void
  setAudioUnlocked: (unlocked: boolean) => void
  setSafeMode: (safe: boolean) => void
  setPerfMode: (mode: 'auto' | 'high' | 'low') => void
  
  // Boot flow
  startBoot: () => void
  completeBoot: () => void
  failBoot: (error: string) => void
  
  // Background/resume (PRD §4.1)
  enterBackground: () => void
  startResume: () => void
  completeResume: () => void
}

export const useAppStore = create<AppState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    lifecycleState: 'BOOT',
    bootStatus: 'initializing',
    bootError: null,
    bootStartTime: null,
    
    featureFlags: DEFAULT_FEATURE_FLAGS,
    configVersion: null,
    
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    connectionQuality: 'good',
    
    hasConsent: false,
    consentVersion: null,
    
    isAudioUnlocked: false,
    
    safeMode: false,
    
    perfMode: 'auto',
    
    // Actions
    setLifecycleState: (state) => set({ lifecycleState: state }),
    
    setBootStatus: (status, error) => set({ 
      bootStatus: status, 
      bootError: error || null 
    }),
    
    setFeatureFlags: (flags) => set((state) => ({ 
      featureFlags: { ...state.featureFlags, ...flags } 
    })),
    
    setConfigVersion: (version) => set({ configVersion: version }),
    
    setIsOnline: (online) => set({ 
      isOnline: online,
      connectionQuality: online ? get().connectionQuality : 'offline',
    }),
    
    setConnectionQuality: (quality) => set({ connectionQuality: quality }),
    
    setHasConsent: (consent, version) => set({ 
      hasConsent: consent, 
      consentVersion: version || null 
    }),
    
    setAudioUnlocked: (unlocked) => set({ isAudioUnlocked: unlocked }),
    
    setSafeMode: (safe) => set({ safeMode: safe }),
    
    setPerfMode: (mode) => set({ perfMode: mode }),
    
    // Boot flow
    startBoot: () => set({ 
      lifecycleState: 'BOOT',
      bootStatus: 'initializing',
      bootStartTime: Date.now(),
      bootError: null,
    }),
    
    completeBoot: () => set({ 
      lifecycleState: 'READY',
      bootStatus: 'ready',
    }),
    
    failBoot: (error) => set({ 
      bootStatus: 'failed',
      bootError: error,
      lifecycleState: 'OFFLINE_DEGRADED',
    }),
    
    // Background/resume
    enterBackground: () => {
      const current = get().lifecycleState
      if (current === 'READY') {
        set({ lifecycleState: 'BACKGROUND' })
      }
    },
    
    startResume: () => {
      const current = get().lifecycleState
      if (current === 'BACKGROUND') {
        set({ lifecycleState: 'RESUME_SYNC' })
      }
    },
    
    completeResume: () => {
      const current = get().lifecycleState
      if (current === 'RESUME_SYNC') {
        set({ lifecycleState: 'READY' })
      }
    },
  }))
)

// Selectors
export const selectIsBooting = (state: AppState) => 
  state.lifecycleState === 'BOOT'

export const selectIsReady = (state: AppState) => 
  state.lifecycleState === 'READY'

export const selectCanTrade = (state: AppState) => 
  state.lifecycleState === 'READY' && 
  state.featureFlags.tradingEnabled &&
  state.hasConsent

export const selectIsDegraded = (state: AppState) =>
  state.lifecycleState === 'OFFLINE_DEGRADED' ||
  state.lifecycleState === 'MAINTENANCE' ||
  state.connectionQuality !== 'good'

