/**
 * LevelRing - Hold-to-buy level indicator
 * Shows the current buy level based on hold duration
 * 
 * PRD F-10: Hold start → power fill
 * Levels: L1 (0.1) → L2 (0.5) → L3 (FULL SEND)
 */

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import { GESTURE_CONFIG, BUY_PRESETS } from '@/lib/config'
import type { BuyLevel } from '@/stores/game-store'
import { useAppStore } from '@/stores/app-store'

interface LevelRingProps {
  progressMs: number
  currentLevel: BuyLevel
  isVisible: boolean
}

export function LevelRing({ progressMs, currentLevel, isVisible }: LevelRingProps) {
  const safeMode = useAppStore((s) => s.safeMode)
  
  // Calculate progress (0-1) for the ring
  const maxTime = GESTURE_CONFIG.LEVEL_THRESHOLDS.L3
  const progress = Math.min(progressMs / maxTime, 1)
  
  // Ring calculations
  const radius = 130
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress * circumference)
  
  // Colors based on level
  const levelColors = {
    L1: '#22c55e',  // green
    L2: '#eab308',  // yellow
    L3: '#ef4444',  // red
  }
  const color = currentLevel ? levelColors[currentLevel] : '#22c55e'
  
  // Get preset config
  const preset = currentLevel ? BUY_PRESETS[currentLevel] : null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
        >
          {/* Cancel hint at top */}
          <div className="absolute top-16 flex flex-col items-center gap-1 opacity-60">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ChevronUp size={28} className="text-neon-pink" />
            </motion.div>
            <span className="text-[10px] font-bold text-neon-pink uppercase tracking-widest">
              Slide up to cancel
            </span>
          </div>

          {/* Ring container */}
          <motion.div
            animate={safeMode ? {} : { scale: [1, 1.02, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="relative w-[280px] h-[280px] flex items-center justify-center"
          >
            {/* Background ring */}
            <div 
              className="absolute inset-0 rounded-full opacity-30"
              style={{
                border: '4px solid rgba(255,255,255,0.1)',
              }}
            />

            {/* Progress ring */}
            <svg 
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 280 280"
            >
              {/* Track */}
              <circle
                cx="140"
                cy="140"
                r={radius}
                fill="transparent"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              
              {/* Progress */}
              <motion.circle
                cx="140"
                cy="140"
                r={radius}
                fill="transparent"
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  filter: `drop-shadow(0 0 10px ${color})`,
                }}
              />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                {preset ? (
                  <motion.div
                    key={currentLevel}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col items-center"
                  >
                    {/* Amount */}
                    <motion.span
                      className="text-6xl font-black italic text-white tracking-tighter"
                      style={{ 
                        textShadow: `0 0 30px ${color}`,
                      }}
                      animate={safeMode ? {} : {
                        textShadow: [
                          `0 0 20px ${color}`,
                          `0 0 40px ${color}`,
                          `0 0 20px ${color}`,
                        ]
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {preset.amount}
                    </motion.span>
                    
                    {/* Label */}
                    <span 
                      className="text-sm font-bold tracking-widest uppercase mt-1"
                      style={{ color }}
                    >
                      {preset.label}
                    </span>
                    
                    {/* TON unit */}
                    <span className="text-xs font-mono text-dope-muted mt-2 uppercase tracking-wider">
                      TON
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center"
                  >
                    <span className="text-xs font-mono text-dope-muted uppercase tracking-widest">
                      Holding...
                    </span>
                    <motion.div
                      className="mt-3 flex gap-1"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-neon-green rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ 
                            duration: 0.6, 
                            repeat: Infinity, 
                            delay: i * 0.2 
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Level indicators */}
            <div className="absolute inset-0 pointer-events-none">
              {/* L1 marker */}
              <LevelMarker 
                level="L1" 
                angle={-90 + (GESTURE_CONFIG.LEVEL_THRESHOLDS.L1 / maxTime) * 360}
                isActive={progressMs >= GESTURE_CONFIG.LEVEL_THRESHOLDS.L1}
                color={levelColors.L1}
              />
              {/* L2 marker */}
              <LevelMarker 
                level="L2" 
                angle={-90 + (GESTURE_CONFIG.LEVEL_THRESHOLDS.L2 / maxTime) * 360}
                isActive={progressMs >= GESTURE_CONFIG.LEVEL_THRESHOLDS.L2}
                color={levelColors.L2}
              />
              {/* L3 marker */}
              <LevelMarker 
                level="L3" 
                angle={-90 + (GESTURE_CONFIG.LEVEL_THRESHOLDS.L3 / maxTime) * 360}
                isActive={progressMs >= GESTURE_CONFIG.LEVEL_THRESHOLDS.L3}
                color={levelColors.L3}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function LevelMarker({ 
  level, 
  angle, 
  isActive, 
  color 
}: { 
  level: string
  angle: number
  isActive: boolean
  color: string
}) {
  const radius = 155 // Outside the ring
  const x = 140 + radius * Math.cos((angle * Math.PI) / 180)
  const y = 140 + radius * Math.sin((angle * Math.PI) / 180)

  return (
    <motion.div
      className="absolute text-[10px] font-bold font-mono"
      style={{
        left: x - 12,
        top: y - 8,
        color: isActive ? color : 'rgba(255,255,255,0.3)',
      }}
      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      {level}
    </motion.div>
  )
}

// Cancel overlay component
export function CancelOverlay({ isVisible }: { isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 bg-neon-pink/20 backdrop-blur-sm flex flex-col items-center pt-32"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="p-5 bg-neon-pink rounded-full mb-4 shadow-[0_0_50px_rgba(255,51,102,0.5)]"
          >
            <span className="text-4xl">✕</span>
          </motion.div>
          <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">
            Release to Cancel
          </h2>
          <p className="text-dope-muted text-sm mt-2 font-mono">
            No order will be sent
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

