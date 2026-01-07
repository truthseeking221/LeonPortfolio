/**
 * Kill Switch Banner (T-0010b)
 * Shows when trading is disabled via remote config
 * 
 * States:
 * - Trading fully disabled (red)
 * - Buy only disabled (orange)
 * - Sell only disabled (orange)
 */

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, ShieldOff, TrendingDown, TrendingUp } from 'lucide-react'
import { 
  useAppStore,
  selectIsTradingDisabled,
  selectIsBuyDisabled,
  selectIsSellDisabled,
  selectMaintenanceMessage,
  selectHasAnyKillSwitch,
} from '@/stores/app-store'

export function KillSwitchBanner() {
  const isTradingDisabled = useAppStore(selectIsTradingDisabled)
  const isBuyDisabled = useAppStore(selectIsBuyDisabled)
  const isSellDisabled = useAppStore(selectIsSellDisabled)
  const message = useAppStore(selectMaintenanceMessage)
  const hasAnyKillSwitch = useAppStore(selectHasAnyKillSwitch)

  if (!hasAnyKillSwitch) return null

  // Determine banner type and content
  const getBannerConfig = () => {
    if (isTradingDisabled) {
      return {
        icon: ShieldOff,
        title: 'Trading Paused',
        subtitle: message || 'Trading is temporarily disabled for maintenance',
        bgClass: 'bg-red-500/20 border-red-500/50',
        iconClass: 'text-red-400',
        textClass: 'text-red-300',
      }
    }
    if (isBuyDisabled && isSellDisabled) {
      return {
        icon: AlertTriangle,
        title: 'Trading Paused',
        subtitle: message || 'Buy and sell actions are temporarily disabled',
        bgClass: 'bg-orange-500/20 border-orange-500/50',
        iconClass: 'text-orange-400',
        textClass: 'text-orange-300',
      }
    }
    if (isBuyDisabled) {
      return {
        icon: TrendingUp,
        title: 'Buying Paused',
        subtitle: message || 'New buys are temporarily disabled. Selling is still available.',
        bgClass: 'bg-orange-500/20 border-orange-500/50',
        iconClass: 'text-orange-400',
        textClass: 'text-orange-300',
      }
    }
    if (isSellDisabled) {
      return {
        icon: TrendingDown,
        title: 'Selling Paused',
        subtitle: message || 'Selling is temporarily disabled. Hold tight!',
        bgClass: 'bg-orange-500/20 border-orange-500/50',
        iconClass: 'text-orange-400',
        textClass: 'text-orange-300',
      }
    }
    return null
  }

  const config = getBannerConfig()
  if (!config) return null

  const Icon = config.icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`
          fixed top-16 left-4 right-4 z-40
          ${config.bgClass}
          border rounded-xl backdrop-blur-sm
          px-4 py-3
          flex items-center gap-3
        `}
      >
        {/* Pulsing icon */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`flex-shrink-0 ${config.iconClass}`}
        >
          <Icon size={24} />
        </motion.div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className={`font-mono font-bold text-sm tracking-wide ${config.textClass}`}>
            {config.title.toUpperCase()}
          </div>
          <div className="text-white/60 text-xs truncate">
            {config.subtitle}
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`w-2 h-2 rounded-full ${
              isTradingDisabled ? 'bg-red-400' : 'bg-orange-400'
            }`}
          />
          <span className="text-white/40 text-[10px] font-mono">LIVE</span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default KillSwitchBanner

