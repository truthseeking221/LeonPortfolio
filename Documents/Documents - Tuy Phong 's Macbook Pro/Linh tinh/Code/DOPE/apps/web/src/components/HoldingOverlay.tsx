/**
 * HoldingOverlay - Position PnL display
 * Implements PRD Part 3 Section 2: Holding Overlay UI
 * 
 * Shows:
 * - Live PnL
 * - Position stats
 * - State badge (LIVE/STALE/DEGRADED)
 * - Panic Sell button
 */

import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Zap, AlertTriangle } from 'lucide-react'
import { useGameStore, type Position } from '@/stores/game-store'
import { useAppStore } from '@/stores/app-store'
import { haptic } from '@/lib/telegram'

interface HoldingOverlayProps {
  position: Position
  onPanicSell: () => void
  isSelling: boolean
}

export function HoldingOverlay({ position, onPanicSell, isSelling }: HoldingOverlayProps) {
  const pnlState = useGameStore((s) => s.pnlState)
  const safeMode = useAppStore((s) => s.safeMode)
  
  const isPositive = position.unrealizedPnl >= 0
  const pnlColor = isPositive ? 'text-neon-green' : 'text-neon-pink'
  const pnlBgColor = isPositive ? 'from-neon-green/20' : 'from-neon-pink/20'

  const handlePanicSell = () => {
    if (isSelling) return
    haptic.impact('heavy')
    onPanicSell()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex flex-col"
      >
        {/* Background with gradient */}
        <div className={`absolute inset-0 bg-gradient-to-b ${pnlBgColor} to-black/95 backdrop-blur-sm`} />

        {/* State Badge */}
        <div className="relative z-10 flex justify-center pt-20">
          <StateBadge state={pnlState} />
        </div>

        {/* PnL Center */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-10">
          {/* Symbol */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-lg font-bold text-dope-muted mb-2"
          >
            ${position.symbol}
          </motion.div>

          {/* Big PnL */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            {/* Percentage */}
            <motion.div
              className={`flex items-center gap-3 ${pnlColor}`}
              animate={safeMode ? {} : {
                scale: [1, 1.02, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {isPositive ? (
                <TrendingUp size={40} className="opacity-70" />
              ) : (
                <TrendingDown size={40} className="opacity-70" />
              )}
              <span 
                className="text-7xl sm:text-8xl font-black italic tracking-tighter"
                style={{
                  textShadow: isPositive 
                    ? '0 0 40px rgba(0, 255, 136, 0.5)' 
                    : '0 0 40px rgba(255, 51, 102, 0.5)',
                }}
              >
                {isPositive ? '+' : ''}{position.unrealizedPnlPercent.toFixed(2)}%
              </span>
            </motion.div>

            {/* USD Value */}
            <div className={`text-2xl font-mono font-bold mt-2 ${pnlColor}`}>
              {isPositive ? '+' : ''}{position.unrealizedPnl.toFixed(4)} TON
            </div>
          </motion.div>

          {/* Position Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4 px-6 w-full max-w-md">
            <StatItem label="Size" value={`${position.balance.toFixed(2)}`} />
            <StatItem label="Entry" value={`$${position.entryPrice.toFixed(6)}`} />
            <StatItem label="Value" value={`${position.currentValue.toFixed(4)} TON`} />
          </div>
        </div>

        {/* Panic Sell Button */}
        <div className="relative z-10 p-6 pb-safe">
          <motion.button
            onClick={handlePanicSell}
            disabled={isSelling}
            className={`w-full py-5 rounded-xl font-black italic text-xl uppercase tracking-wider flex items-center justify-center gap-3 transition-all ${
              isSelling 
                ? 'bg-dope-surface text-dope-muted cursor-not-allowed'
                : 'bg-neon-pink text-white shadow-[0_0_30px_rgba(255,51,102,0.4)] hover:shadow-[0_0_50px_rgba(255,51,102,0.6)] active:scale-95'
            }`}
            whileTap={isSelling ? {} : { scale: 0.95 }}
          >
            {isSelling ? (
              <>
                <motion.div
                  className="w-6 h-6 border-3 border-dope-muted border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Selling...
              </>
            ) : (
              <>
                <Zap size={24} className="fill-current" />
                Sell All
              </>
            )}
          </motion.button>

          {/* Warning text */}
          {pnlState === 'STALE' && (
            <p className="text-center text-xs text-neon-yellow mt-3 font-mono">
              ⚠️ Price data delayed — sell may execute at different price
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center bg-black/30 rounded-lg py-3 px-2">
      <span className="text-[10px] font-mono text-dope-muted uppercase tracking-wider">
        {label}
      </span>
      <span className="text-sm font-mono font-bold text-white mt-1 truncate w-full text-center">
        {value}
      </span>
    </div>
  )
}

function StateBadge({ state }: { state: string }) {
  const config = {
    LIVE: {
      color: 'bg-neon-green/20 text-neon-green border-neon-green/30',
      label: 'LIVE',
      pulse: false,
    },
    STALE: {
      color: 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30',
      label: 'STALE',
      pulse: true,
    },
    DEGRADED: {
      color: 'bg-neon-pink/20 text-neon-pink border-neon-pink/30',
      label: 'DEGRADED',
      pulse: true,
    },
    PENDING: {
      color: 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30',
      label: 'PENDING',
      pulse: true,
    },
    SYNCING: {
      color: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
      label: 'SYNCING',
      pulse: true,
    },
  }[state] || {
    color: 'bg-dope-surface text-dope-muted border-dope-border',
    label: state,
    pulse: false,
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest ${config.color} ${config.pulse ? 'animate-pulse' : ''}`}>
      <div className={`w-2 h-2 rounded-full ${config.pulse ? 'animate-pulse' : ''}`} 
        style={{ backgroundColor: 'currentColor' }} 
      />
      {config.label}
    </div>
  )
}

