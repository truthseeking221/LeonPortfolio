/**
 * EmptyDeckState - Shown when no tokens available
 * Handles: empty deck, loading more, refresh
 */

import { motion } from 'framer-motion'
import { Inbox, RefreshCw, WifiOff } from 'lucide-react'
import { useAppStore } from '@/stores/app-store'
import { haptic } from '@/lib/telegram'

interface EmptyDeckStateProps {
  isLoading?: boolean
  isOffline?: boolean
  errorMessage?: string
  onRefresh: () => void
}

export function EmptyDeckState({ 
  isLoading = false, 
  isOffline = false,
  errorMessage,
  onRefresh 
}: EmptyDeckStateProps) {
  const connectionQuality = useAppStore((s) => s.connectionQuality)
  const actualOffline = isOffline || connectionQuality === 'offline'

  const handleRefresh = () => {
    haptic.impact('light')
    onRefresh()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(0, 255, 136, 0.1) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          animate={isLoading ? { rotate: 360 } : { y: [0, -5, 0] }}
          transition={isLoading 
            ? { duration: 1, repeat: Infinity, ease: 'linear' }
            : { duration: 2, repeat: Infinity }
          }
          className="mb-6"
        >
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center border-2 ${
            actualOffline 
              ? 'bg-neon-pink/10 border-neon-pink/30' 
              : isLoading
                ? 'bg-neon-green/10 border-neon-green/30'
                : 'bg-dope-surface border-dope-border'
          }`}>
            {actualOffline ? (
              <WifiOff size={32} className="text-neon-pink" />
            ) : isLoading ? (
              <RefreshCw size={32} className="text-neon-green" />
            ) : (
              <Inbox size={32} className="text-dope-muted" />
            )}
          </div>
        </motion.div>

        {/* Title */}
        <h2 className="text-2xl font-black italic text-white mb-2">
          {actualOffline 
            ? 'NO CONNECTION' 
            : isLoading 
              ? 'LOADING DECK...'
              : 'DECK EMPTY'
          }
        </h2>

        {/* Description */}
        <p className="text-dope-muted text-sm font-mono mb-6 max-w-xs">
          {actualOffline 
            ? "Can't reach the server. Check your internet connection."
            : isLoading
              ? 'Finding the hottest memecoins for you...'
              : errorMessage || "No tokens available right now. Pull to refresh or check back later."
          }
        </p>

        {/* Refresh button */}
        {!isLoading && (
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-neon-green/10 border border-neon-green/30 text-neon-green font-bold uppercase tracking-wider rounded-xl hover:bg-neon-green/20 transition-colors active:scale-95"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-neon-green rounded-full"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ 
                  duration: 0.8, 
                  repeat: Infinity, 
                  delay: i * 0.2 
                }}
              />
            ))}
          </div>
        )}

        {/* Hint */}
        {!actualOffline && !isLoading && (
          <p className="mt-6 text-[10px] text-dope-border font-mono uppercase tracking-widest">
            Swipe down to refresh
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default EmptyDeckState

