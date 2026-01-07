/**
 * Card Component - The main deck card
 * Implements PRD Part 2 B2: Card component
 * 
 * Layers:
 * - MediaLayer (video/gif/image/gradient fallback)
 * - TokenHeader (name, symbol)
 * - PrimaryStat (price, change)
 * - SignalLines
 * - HoldHint
 */

import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, TrendingDown, Users, BarChart3, Activity, 
  Info, Crosshair, ShieldCheck, ShieldAlert, ImageOff 
} from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import type { Token } from '@/stores/game-store'
import { useAppStore } from '@/stores/app-store'

interface CardProps {
  token: Token
  isArming: boolean
  isCanceled: boolean
  isNext?: boolean
  onOpenRisk?: () => void
}

export function Card({ token, isArming, isCanceled, isNext = false, onOpenRisk }: CardProps) {
  const safeMode = useAppStore((s) => s.safeMode)
  const isPositiveChange = token.change24h >= 0
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  // Reset image state when token changes
  useEffect(() => {
    setImageError(false)
    setImageLoading(true)
  }, [token.id])

  const handleImageError = useCallback(() => {
    setImageError(true)
    setImageLoading(false)
  }, [])

  const handleImageLoad = useCallback(() => {
    setImageLoading(false)
  }, [])

  // Next card (preview behind current)
  if (isNext) {
    return (
      <div className="absolute inset-0 w-full h-full bg-dope-dark rounded-lg border border-dope-border scale-95 translate-y-4 opacity-50 overflow-hidden pointer-events-none">
        {imageError ? (
          <MediaFallback color={token.color} />
        ) : (
          <img 
            src={token.image} 
            className="w-full h-full object-cover grayscale opacity-30" 
            alt=""
            onError={() => setImageError(true)}
          />
        )}
      </div>
    )
  }

  return (
    <motion.div
      className="relative w-full h-full bg-dope-black overflow-hidden border border-dope-border shadow-2xl touch-none rounded-lg"
      animate={{
        scale: isArming ? 0.98 : 1,
        borderColor: isCanceled ? 'rgba(255, 51, 102, 0.5)' : 'rgba(42, 42, 58, 1)',
      }}
      transition={{ duration: 0.15 }}
    >
      {/* Media Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Loading skeleton */}
        {imageLoading && !imageError && (
          <div className="absolute inset-0 bg-dope-surface animate-pulse" />
        )}
        
        {/* Fallback for failed images */}
        {imageError ? (
          <MediaFallback color={token.color} isArming={isArming} />
        ) : (
          <motion.img
            src={token.image}
            className="w-full h-full object-cover"
            alt={token.name}
            onError={handleImageError}
            onLoad={handleImageLoad}
            animate={{
              scale: isArming ? 1.05 : 1,
              filter: isArming 
                ? 'grayscale(100%) brightness(40%)' 
                : 'grayscale(30%) brightness(70%)',
            }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
        
        {/* Aura border glow */}
        {!safeMode && !isArming && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: `inset 0 0 60px ${token.color}20`,
            }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="absolute bottom-32 left-6 right-6 z-10 pointer-events-auto">
        <motion.div
          animate={{ opacity: isArming ? 0.3 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Rank & Live indicator */}
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-white/10 text-white backdrop-blur-md text-[10px] font-bold px-2 py-1 uppercase border border-white/10 rounded">
              #{Math.floor(Math.random() * 100) + 1}
            </span>
            <span className="flex items-center gap-1.5 text-neon-green font-mono text-xs">
              <motion.div 
                className="w-1.5 h-1.5 bg-neon-green rounded-full"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              Live
            </span>
            <RiskBadge level={token.risk.level} />
          </div>

          {/* Symbol */}
          <GlitchText
            text={`$${token.symbol}`}
            intensity={isArming ? 3 : 0}
            safeMode={safeMode}
            className="text-7xl sm:text-8xl font-black italic text-white tracking-tighter leading-none"
          />

          {/* Name & Change */}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-dope-muted font-mono text-sm uppercase tracking-widest">
              // {token.name}
            </span>
            <span className={`flex items-center gap-1 font-mono font-bold text-lg ${isPositiveChange ? 'text-neon-green' : 'text-neon-pink'}`}>
              {isPositiveChange ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {isPositiveChange ? '+' : ''}{token.change24h.toFixed(1)}%
            </span>
          </div>

          {/* Stats Ticker */}
          <InfoTicker 
            stats={token.stats} 
            color={token.color} 
            onClick={onOpenRisk}
          />
        </motion.div>
      </div>

      {/* Hold Hint (only when idle) */}
      <AnimatePresence>
        {!isArming && !isCanceled && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-10 w-full flex justify-center pointer-events-none"
          >
            <motion.div 
              className="flex flex-col items-center gap-2"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="p-3 rounded-full border border-white/20 bg-white/5">
                <Crosshair size={24} className="text-white" />
              </div>
              <p className="text-[10px] font-mono text-dope-muted tracking-[0.4em] uppercase">
                Hold to Ape
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Risk badge component
function RiskBadge({ level }: { level: 'LOW' | 'MED' | 'HIGH' }) {
  const colors = {
    LOW: 'text-neon-green border-neon-green/30 bg-neon-green/10',
    MED: 'text-neon-yellow border-neon-yellow/30 bg-neon-yellow/10',
    HIGH: 'text-neon-pink border-neon-pink/30 bg-neon-pink/10',
  }[level]

  const Icon = level === 'HIGH' ? ShieldAlert : ShieldCheck

  return (
    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${colors}`}>
      <Icon size={10} />
      {level}
    </span>
  )
}

// Stats ticker with rotating info
function InfoTicker({ 
  stats, 
  color, 
  onClick 
}: { 
  stats: Token['stats']
  color: string
  onClick?: () => void 
}) {
  const [index, setIndex] = useState(0)
  
  const dataPoints = [
    { label: 'MCAP', value: stats.marketCap, icon: BarChart3 },
    { label: 'VOL', value: stats.volume, icon: Activity },
    { label: 'HOLDERS', value: stats.holders, icon: Users },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % dataPoints.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [dataPoints.length])

  const CurrentIcon = dataPoints[index]?.icon ?? BarChart3

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 mt-3 bg-black/40 backdrop-blur-md px-3 py-2 rounded-lg border border-white/5 w-fit overflow-hidden active:bg-white/10 transition-colors"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <CurrentIcon size={12} style={{ color }} />
          <span className="text-[10px] font-mono text-dope-muted tracking-wider">
            {dataPoints[index]?.label}:
          </span>
          <span className="text-xs font-mono font-bold text-white">
            {dataPoints[index]?.value}
          </span>
        </motion.div>
      </AnimatePresence>
      <Info size={10} className="text-dope-muted ml-1" />
    </button>
  )
}

// Glitch text effect
function GlitchText({ 
  text, 
  className, 
  intensity = 0, 
  safeMode 
}: { 
  text: string
  className?: string
  intensity?: number
  safeMode?: boolean
}) {
  if (safeMode || intensity === 0) {
    return <h1 className={className}>{text}</h1>
  }

  return (
    <h1 className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <motion.span
        className="absolute top-0 left-0 -z-10 w-full h-full text-neon-pink opacity-70"
        animate={{ 
          x: [-2 * intensity, 2 * intensity, -1 * intensity], 
          opacity: [0.5, 0.8, 0.5] 
        }}
        transition={{ duration: 0.2, repeat: Infinity, repeatType: 'reverse' }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 -z-10 w-full h-full text-neon-cyan opacity-70"
        animate={{ 
          x: [2 * intensity, -2 * intensity, 1 * intensity], 
          opacity: [0.5, 0.8, 0.5] 
        }}
        transition={{ duration: 0.15, repeat: Infinity, repeatType: 'reverse' }}
      >
        {text}
      </motion.span>
    </h1>
  )
}

// Media fallback when image fails to load
function MediaFallback({ 
  color, 
  isArming = false 
}: { 
  color: string
  isArming?: boolean
}) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      animate={{
        scale: isArming ? 1.05 : 1,
        filter: isArming 
          ? 'brightness(40%)' 
          : 'brightness(70%)',
      }}
      transition={{ duration: 0.3 }}
      style={{
        background: `
          linear-gradient(135deg, 
            ${color}15 0%, 
            rgba(15, 15, 23, 1) 50%, 
            ${color}10 100%
          )
        `,
      }}
    >
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute w-64 h-64 rounded-full blur-[80px]"
        style={{ background: `${color}20` }}
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full blur-[60px]"
        style={{ background: `${color}15` }}
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Fallback icon */}
      <div className="relative z-10 flex flex-col items-center gap-2 text-dope-muted">
        <ImageOff size={32} className="opacity-30" />
        <span className="text-[10px] font-mono uppercase tracking-widest opacity-50">
          Image unavailable
        </span>
      </div>
    </motion.div>
  )
}

