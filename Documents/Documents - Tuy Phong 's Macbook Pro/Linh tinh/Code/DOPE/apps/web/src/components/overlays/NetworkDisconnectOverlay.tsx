/**
 * NetworkDisconnectOverlay - Shown when network connection is lost
 * Handles: reconnecting, retry, offline mode guidance
 */

import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff, RefreshCw, CloudOff, Wifi } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAppStore } from '@/stores/app-store'
import { haptic } from '@/lib/telegram'

interface NetworkDisconnectOverlayProps {
  isOpen: boolean
  onRetry: () => void
  onDismiss?: () => void
}

export function NetworkDisconnectOverlay({ 
  isOpen, 
  onRetry,
  onDismiss,
}: NetworkDisconnectOverlayProps) {
  const connectionQuality = useAppStore((s) => s.connectionQuality)
  const [isRetrying, setIsRetrying] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Auto-retry logic
  useEffect(() => {
    if (!isOpen) {
      setRetryCount(0)
      return
    }

    // Auto-dismiss if connection restored
    if (connectionQuality === 'good') {
      haptic.notification('success')
      onDismiss?.()
    }
  }, [isOpen, connectionQuality, onDismiss])

  const handleRetry = async () => {
    setIsRetrying(true)
    haptic.impact('medium')
    
    try {
      // Check actual connectivity
      const online = await checkConnectivity()
      
      if (online) {
        haptic.notification('success')
        onRetry()
        onDismiss?.()
      } else {
        setRetryCount((c) => c + 1)
        haptic.notification('error')
      }
    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-dope-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-6"
        >
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Scanning line effect */}
            <motion.div
              className="absolute w-full h-1 bg-gradient-to-r from-transparent via-neon-pink/30 to-transparent"
              animate={{ 
                y: ['-100vh', '100vh'],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>

          {/* Content */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="relative z-10 flex flex-col items-center max-w-sm text-center"
          >
            {/* Icon */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: isRetrying ? 360 : 0,
              }}
              transition={isRetrying 
                ? { duration: 1, repeat: Infinity, ease: 'linear' }
                : { duration: 2, repeat: Infinity }
              }
              className="mb-6"
            >
              <div className="w-24 h-24 bg-neon-pink/20 rounded-full flex items-center justify-center border-2 border-neon-pink/50 relative">
                {isRetrying ? (
                  <RefreshCw size={40} className="text-neon-pink" />
                ) : (
                  <WifiOff size={40} className="text-neon-pink" />
                )}
                
                {/* Pulse effect */}
                <motion.div
                  className="absolute inset-0 border-2 border-neon-pink/30 rounded-full"
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Title */}
            <h2 className="text-3xl font-black italic text-white mb-2">
              {isRetrying ? 'RECONNECTING...' : 'CONNECTION LOST'}
            </h2>

            {/* Description */}
            <p className="text-dope-muted text-sm font-mono mb-6">
              {isRetrying 
                ? 'Trying to reach the server...'
                : "Can't reach the server. Your funds are safe in your wallet."
              }
            </p>

            {/* Status */}
            <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-dope-surface rounded-lg border border-dope-border">
              <div className="flex items-center gap-2">
                <CloudOff size={14} className="text-neon-pink" />
                <span className="text-xs font-mono text-dope-muted">Server Status:</span>
              </div>
              <span className="text-xs font-bold text-neon-pink uppercase">Unreachable</span>
            </div>

            {/* Retry count */}
            {retryCount > 0 && !isRetrying && (
              <p className="text-xs text-dope-muted font-mono mb-4">
                Failed attempts: {retryCount}
              </p>
            )}

            {/* Actions */}
            <div className="w-full space-y-3">
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="w-full flex items-center justify-center gap-2 py-4 bg-neon-green text-black font-bold uppercase tracking-wider rounded-xl disabled:opacity-50 hover:bg-neon-greenDim transition-colors active:scale-95"
              >
                {isRetrying ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <RefreshCw size={18} />
                    </motion.div>
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw size={18} />
                    Try Again
                  </>
                )}
              </button>

              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="w-full py-3 text-dope-muted font-mono text-sm uppercase tracking-wider hover:text-white transition-colors"
                >
                  Browse Offline
                </button>
              )}
            </div>

            {/* Hint */}
            <div className="mt-6 flex items-start gap-2 text-left">
              <Wifi size={14} className="text-dope-muted shrink-0 mt-0.5" />
              <p className="text-[10px] text-dope-muted">
                Check your internet connection. If the problem persists, the service may be temporarily unavailable.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Helper to check actual connectivity
async function checkConnectivity(): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const response = await fetch('/api/v1/health', {
      method: 'HEAD',
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    return response.ok
  } catch {
    // Try navigator.onLine as fallback
    return navigator.onLine
  }
}

export default NetworkDisconnectOverlay

