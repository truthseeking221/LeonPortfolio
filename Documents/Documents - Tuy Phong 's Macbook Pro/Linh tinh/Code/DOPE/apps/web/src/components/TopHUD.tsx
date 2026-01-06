/**
 * TopHUD - Top heads-up display
 * Implements PRD Part 2 B1: TopHUD component
 * 
 * Contains:
 * - WalletPill (balance + connection status)
 * - NetworkDot (connection quality)
 * - SettingsButton
 */

import { Wallet, Settings, Wifi, WifiOff, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useWalletStore, selectIsConnected, selectNeedsReconnect } from '@/stores/wallet-store'
import { useAppStore } from '@/stores/app-store'
import { GAS_CONFIG } from '@/lib/config'

interface TopHUDProps {
  onOpenWallet: () => void
  onOpenSettings: () => void
}

export function TopHUD({ onOpenWallet, onOpenSettings }: TopHUDProps) {
  const balance = useWalletStore((s) => s.balance)
  const spendableBalance = useWalletStore((s) => s.spendableBalance)
  const isConnected = useWalletStore(selectIsConnected)
  const needsReconnect = useWalletStore(selectNeedsReconnect)
  const walletState = useWalletStore((s) => s.walletState)
  
  const connectionQuality = useAppStore((s) => s.connectionQuality)

  // Network dot color
  const networkColor = {
    good: 'bg-neon-green',
    degraded: 'bg-neon-yellow',
    offline: 'bg-neon-pink',
  }[connectionQuality]

  const networkIcon = connectionQuality === 'offline' ? WifiOff : Wifi

  return (
    <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-4 pt-safe pointer-events-none">
      {/* Wallet Pill */}
      <motion.button
        onClick={onOpenWallet}
        whileTap={{ scale: 0.95 }}
        className="pointer-events-auto"
      >
        <div className="flex items-center gap-3 bg-black/80 backdrop-blur-xl px-4 py-2.5 border border-dope-border border-l-4 border-l-neon-green shadow-[0_0_20px_rgba(0,255,136,0.15)] skew-x-[-8deg]">
          <div className="skew-x-[8deg] flex items-center gap-3">
            {/* Connection indicator */}
            <div className="relative">
              <Wallet 
                size={18} 
                className={isConnected ? 'text-neon-green' : 'text-dope-muted'} 
              />
              {needsReconnect && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-neon-pink rounded-full animate-pulse" />
              )}
            </div>

            {/* Balance display */}
            {isConnected ? (
              <div className="flex flex-col">
                <span className="text-sm font-mono font-bold text-white tracking-wider">
                  {balance.toFixed(2)} <span className="text-neon-green text-xs">TON</span>
                </span>
                {spendableBalance < balance && (
                  <span className="text-[9px] font-mono text-dope-muted -mt-0.5">
                    {spendableBalance.toFixed(2)} spendable
                  </span>
                )}
              </div>
            ) : walletState === 'CONNECTING' ? (
              <span className="text-sm font-mono text-dope-muted animate-pulse">
                Connecting...
              </span>
            ) : (
              <span className="text-sm font-mono text-dope-muted">
                {needsReconnect ? 'Reconnect' : 'Connect'}
              </span>
            )}
          </div>
        </div>
      </motion.button>

      {/* Right side controls */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Network status */}
        <div className="flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-xl rounded-lg border border-dope-border">
          {connectionQuality === 'offline' ? (
            <WifiOff size={14} className="text-neon-pink" />
          ) : (
            <Wifi size={14} className={connectionQuality === 'good' ? 'text-neon-green' : 'text-neon-yellow'} />
          )}
          <div className={`w-2 h-2 rounded-full ${networkColor} ${connectionQuality !== 'good' ? 'animate-pulse' : ''}`} />
        </div>

        {/* Settings button */}
        <motion.button
          onClick={onOpenSettings}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 bg-black/60 backdrop-blur-xl border border-dope-border rounded-lg hover:border-dope-muted transition-colors group"
        >
          <Settings 
            size={20} 
            className="text-dope-text group-hover:rotate-90 transition-transform duration-500" 
          />
        </motion.button>
      </div>
    </div>
  )
}

// Separate component for gas warning toast
export function GasWarningBanner() {
  const balance = useWalletStore((s) => s.balance)
  const isConnected = useWalletStore(selectIsConnected)
  
  const showWarning = isConnected && balance < GAS_CONFIG.RESERVE_BASE * 2

  if (!showWarning) return null

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-20 left-4 right-4 z-40 flex items-center gap-2 px-4 py-2 bg-neon-yellow/10 border border-neon-yellow/30 rounded-lg"
    >
      <AlertCircle size={16} className="text-neon-yellow shrink-0" />
      <span className="text-xs font-mono text-neon-yellow">
        Low balance — deposit to keep trading
      </span>
    </motion.div>
  )
}

