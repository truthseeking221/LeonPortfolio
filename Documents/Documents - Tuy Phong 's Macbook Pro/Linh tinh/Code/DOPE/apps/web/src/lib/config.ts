/**
 * DOPE Configuration
 * Centralized config for the app based on PRD specs
 * 
 * References:
 * - PRD Part 1: Product constraints & decisions
 * - PRD Part 4: Settings & Safety Rails
 * - PRD Appendix A3: Gas Reserve Invariant
 */

// Environment
export const ENV = {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  env: import.meta.env.VITE_ENV || 'development',
} as const

// Gesture config (PRD Part 2: F-10, F-11)
export const GESTURE_CONFIG = {
  // Hold timing thresholds (ms)
  LONG_PRESS_DELAY: 150,      // Wait before HOLD_ARMED (Canon Sec 10)
  DRAG_TOLERANCE: 8,          // px movement allowed during delay (Canon Sec 10)
  
  // Level thresholds (ms) - PRD Part 2 F-10
  LEVEL_THRESHOLDS: {
    L1: 150,   // Enter L1 preview
    L2: 700,   // Enter L2 preview
    L3: 1400,  // Enter L3 preview (FULL SEND)
  },
  
  // Cancel gesture (PRD Part 2 F-11)
  CANCEL_THRESHOLD_PX: -60,   // Drag up to cancel (negative = upward)
  CANCEL_ZONE_TOP: 150,       // Top area for cancel (px from top)
  
  // Swipe
  SWIPE_THRESHOLD: 100,       // px to trigger deck swipe
  SWIPE_VELOCITY: 0.5,        // Velocity threshold for swipe
  
  // Timing
  DEBOUNCE_MS: 100,           // Debounce rapid actions
} as const

// Buy presets (PRD Part 4: §4.1)
export const BUY_PRESETS = {
  L1: { amount: 0.1, label: 'APE 0.1' },
  L2: { amount: 0.5, label: 'APE 0.5' },
  L3: { amount: 1.0, label: 'FULL SEND' },
} as const

// Safety defaults (PRD Part 4: §5)
export const SAFETY_DEFAULTS = {
  enabled: true,
  maxPerTrade: 1.0,
  maxPerSession: 2.0,
  maxPerDay: 5.0,
  largeTradeThreshold: 1.0,
  requireExtraConfirmAboveThreshold: true,
  hardSwipeSellEnabled: false,
} as const

// Gas reserve (PRD Appendix A3)
export const GAS_CONFIG = {
  // Minimum base asset to keep for gas (prevents "can't sell" trap)
  RESERVE_BASE: 0.05,         // TON amount to reserve
  WORST_CASE_FEES: 0.02,      // Max expected fees per trade
} as const

// Slippage defaults (PRD Part 4: §4.2)
export const SLIPPAGE_DEFAULTS = {
  buyBps: 200,   // 2%
  sellBps: 800,  // 8%
  maxBps: 2500,  // 25% max
} as const

// UX timing (PRD Part 1: perceived < 3s)
export const UX_TIMING = {
  // Feedback < 100ms
  FEEDBACK_MAX_MS: 100,
  
  // Boot screen limits (PRD F-01)
  BOOT_MIN_MS: 500,
  BOOT_MAX_MS: 1500,
  BOOT_SLOW_THRESHOLD_MS: 2000,
  
  // Trade flow
  OPTIMISTIC_DELAY_MS: 250,   // Max time before showing "Order Sent"
  
  // Animation
  TRANSITION_FAST: 150,
  TRANSITION_NORMAL: 300,
  TRANSITION_SLOW: 500,
} as const

// PnL display (PRD Part 3: §3.5)
export const PNL_CONFIG = {
  // Staleness thresholds
  LIVE_THRESHOLD_MS: 3000,     // < 3s = LIVE
  STALE_THRESHOLD_MS: 10000,   // 3-10s = STALE
  // > 10s = DEGRADED (freeze display)
  
  // Smoothing
  EMA_ALPHA: 0.3,  // Exponential moving average factor
} as const

// Deck config (PRD Part 5: §8)
export const DECK_CONFIG = {
  BATCH_SIZE: 10,
  PREFETCH_BUFFER: 5,    // Cards to keep loaded ahead
  MEDIA_PRELOAD: 2,      // Media to preload ahead
  
  // Dedupe
  SEEN_TTL_HOURS: 24,
  NO_REPEAT_WITHIN: 50,  // Don't repeat within last N cards
} as const

// Performance (PRD Appendix A6)
export const PERF_CONFIG = {
  TARGET_FPS: 60,
  LOW_FPS_THRESHOLD: 30,
  
  // Auto-downgrade thresholds
  FPS_CHECK_INTERVAL_MS: 1000,
  DOWNGRADE_AFTER_FRAMES: 30,  // Consecutive low frames before downgrade
} as const

// Feature flags (controlled by remote config)
export type FeatureFlags = {
  tradingEnabled: boolean
  promotedEnabled: boolean
  hardSwipeSellEnabled: boolean
  gasSponsored: boolean
  iosSafeMode: boolean
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  tradingEnabled: true,
  promotedEnabled: false,
  hardSwipeSellEnabled: false,
  gasSponsored: false,
  iosSafeMode: false,
}

