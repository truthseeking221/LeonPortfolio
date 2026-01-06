/**
 * BootScreen - App loading screen
 * Implements PRD F-01: Launch from Telegram → Boot
 * 
 * Requirements:
 * - Show 0.5-1.5s max
 * - Skeleton background (no blank screen)
 * - Show "Still loading..." after 2s with Retry
 */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, RefreshCw, WifiOff } from 'lucide-react'
import { useAppStore } from '@/stores/app-store'
import { UX_TIMING } from '@/lib/config'

export function BootScreen() {
  const bootStatus = useAppStore((s) => s.bootStatus)
  const bootError = useAppStore((s) => s.bootError)
  const bootStartTime = useAppStore((s) => s.bootStartTime)
  const startBoot = useAppStore((s) => s.startBoot)
  
  const [showSlowMessage, setShowSlowMessage] = useState(false)
  const [dots, setDots] = useState('')

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'))
    }, 400)
    return () => clearInterval(interval)
  }, [])

  // Slow boot detection
  useEffect(() => {
    if (!bootStartTime) return
    
    const timeout = setTimeout(() => {
      setShowSlowMessage(true)
    }, UX_TIMING.BOOT_SLOW_THRESHOLD_MS)

    return () => clearTimeout(timeout)
  }, [bootStartTime])

  const handleRetry = () => {
    setShowSlowMessage(false)
    startBoot()
    // App.tsx will handle the actual boot logic
    window.location.reload()
  }

  const isFailed = bootStatus === 'failed'

  return (
    <div className="fixed inset-0 bg-dope-black flex flex-col items-center justify-center overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Glow effect */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 136, 0.15) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'backOut' }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Icon */}
        <motion.div
          className="relative mb-6"
          animate={isFailed ? {} : { rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-neon-green/20 to-neon-purple/20 rounded-2xl flex items-center justify-center border border-neon-green/30 glow-green">
            <Zap 
              size={40} 
              className={`${isFailed ? 'text-neon-pink' : 'text-neon-green'} fill-current`}
            />
          </div>
          
          {/* Pulse rings */}
          {!isFailed && (
            <>
              <motion.div
                className="absolute inset-0 border-2 border-neon-green/30 rounded-2xl"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 border-2 border-neon-green/20 rounded-2xl"
                animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-5xl font-black italic tracking-tighter text-white mb-2"
          animate={isFailed ? {} : { 
            textShadow: [
              '0 0 20px rgba(0, 255, 136, 0.5)',
              '0 0 40px rgba(0, 255, 136, 0.3)',
              '0 0 20px rgba(0, 255, 136, 0.5)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          DOPE
        </motion.h1>

        {/* Tagline */}
        <p className="text-dope-muted text-sm font-mono tracking-widest uppercase mb-8">
          Don't invest. Just swipe.
        </p>

        {/* Status */}
        <AnimatePresence mode="wait">
          {isFailed ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-2 text-neon-pink">
                <WifiOff size={16} />
                <span className="text-sm font-mono">{bootError || 'Connection failed'}</span>
              </div>
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-6 py-3 bg-neon-green/10 border border-neon-green/30 text-neon-green font-bold uppercase tracking-wider text-sm hover:bg-neon-green/20 transition-colors active:scale-95"
              >
                <RefreshCw size={16} />
                Retry
              </button>
            </motion.div>
          ) : showSlowMessage ? (
            <motion.div
              key="slow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-4"
            >
              <span className="text-dope-muted text-sm font-mono">
                Still loading{dots}
              </span>
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-4 py-2 text-neon-green text-sm font-bold uppercase tracking-wider hover:underline"
              >
                <RefreshCw size={14} />
                Retry
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              {/* Loading bar */}
              <div className="w-48 h-1 bg-dope-surface rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-neon-green to-neon-cyan"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              
              {/* Status text */}
              <span className="text-dope-muted text-xs font-mono uppercase tracking-widest">
                {bootStatus === 'loading_config' && 'Loading config'}
                {bootStatus === 'restoring_session' && 'Restoring session'}
                {bootStatus === 'warming_providers' && 'Connecting'}
                {bootStatus === 'initializing' && 'Initializing'}
                {dots}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Version */}
      <div className="absolute bottom-8 text-dope-border text-xs font-mono">
        v0.0.1 • M0
      </div>
    </div>
  )
}

