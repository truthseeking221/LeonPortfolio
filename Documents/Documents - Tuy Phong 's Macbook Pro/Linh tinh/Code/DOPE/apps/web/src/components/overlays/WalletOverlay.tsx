/**
 * WalletOverlay - Wallet management sheet
 * Implements PRD F-03: Wallet Connect / Create
 * 
 * Shows:
 * - Balance (spendable)
 * - Deposit/Withdraw actions
 * - Recent activity teaser
 * - Disconnect option
 */

import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Zap, TrendingUp, LogOut, Copy, ExternalLink, 
  AlertCircle, CheckCircle 
} from 'lucide-react'
import { useState } from 'react'
import { useWalletStore, selectIsConnected } from '@/stores/wallet-store'
import { useTradeStore } from '@/stores/trade-store'
import { GAS_CONFIG } from '@/lib/config'
import { haptic } from '@/lib/telegram'

interface WalletOverlayProps {
  isOpen: boolean
  onClose: () => void
  onOpenActivity: () => void
}

export function WalletOverlay({ isOpen, onClose, onOpenActivity }: WalletOverlayProps) {
  const balance = useWalletStore((s) => s.balance)
  const spendableBalance = useWalletStore((s) => s.spendableBalance)
  const address = useWalletStore((s) => s.address)
  const isConnected = useWalletStore(selectIsConnected)
  const walletState = useWalletStore((s) => s.walletState)
  const connect = useWalletStore((s) => s.connect)
  const disconnect = useWalletStore((s) => s.disconnect)
  
  const trades = useTradeStore((s) => s.trades)
  const recentTrades = trades.slice(0, 3)

  const [copied, setCopied] = useState(false)

  const handleCopyAddress = async () => {
    if (!address) return
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      haptic.notification('success')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      haptic.notification('error')
    }
  }

  const handleConnect = async () => {
    haptic.impact('medium')
    await connect()
  }

  const handleDisconnect = () => {
    haptic.impact('heavy')
    disconnect()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 h-[85vh] z-[60] bg-dope-black border-t border-dope-border rounded-t-3xl flex flex-col shadow-2xl"
          >
            {/* Handle */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1 bg-dope-border rounded-full" />
            </div>

            {/* Header */}
            <div className="flex justify-between items-center px-6 pb-6">
              <h2 className="text-2xl font-black italic text-white uppercase">
                Wallet
              </h2>
              <button 
                onClick={onClose}
                className="p-2 bg-dope-surface rounded-full hover:bg-dope-border transition-colors"
              >
                <X size={20} className="text-dope-text" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {isConnected ? (
                <>
                  {/* Balance Card */}
                  <div className="bg-gradient-to-br from-dope-surface to-dope-black p-6 rounded-2xl border border-dope-border relative overflow-hidden mb-6">
                    {/* Glow */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-neon-green/10 rounded-full blur-3xl" />
                    
                    <div className="relative z-10">
                      <span className="text-dope-muted font-mono text-xs uppercase tracking-widest">
                        Spendable Balance
                      </span>
                      <div className="text-4xl font-mono font-bold text-white mt-2 mb-1 tracking-tighter">
                        {spendableBalance.toFixed(4)} 
                        <span className="text-sm text-neon-green ml-2">TON</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-dope-muted font-mono">
                        <span>Total: {balance.toFixed(4)} TON</span>
                        <span>•</span>
                        <span>Reserving {GAS_CONFIG.RESERVE_BASE} TON for gas</span>
                      </div>
                    </div>

                    {/* Address */}
                    <button
                      onClick={handleCopyAddress}
                      className="mt-4 flex items-center gap-2 text-xs font-mono text-dope-muted hover:text-white transition-colors"
                    >
                      <span className="truncate max-w-[180px]">{address}</span>
                      {copied ? (
                        <CheckCircle size={12} className="text-neon-green shrink-0" />
                      ) : (
                        <Copy size={12} className="shrink-0" />
                      )}
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button className="bg-neon-green hover:bg-neon-greenDim text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wide transition-colors active:scale-95">
                      <Zap size={18} /> Deposit
                    </button>
                    <button className="bg-dope-surface hover:bg-dope-border text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wide border border-dope-border transition-colors active:scale-95">
                      <TrendingUp size={18} /> Withdraw
                    </button>
                  </div>

                  {/* Recent Activity */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-dope-muted font-mono text-xs uppercase tracking-widest">
                        Recent Activity
                      </span>
                      <button 
                        onClick={() => {
                          onClose()
                          onOpenActivity()
                        }}
                        className="text-neon-green text-xs font-bold uppercase hover:underline"
                      >
                        View All
                      </button>
                    </div>

                    <div className="space-y-2">
                      {recentTrades.length > 0 ? (
                        recentTrades.map((trade) => (
                          <div 
                            key={trade.id}
                            className="flex justify-between items-center bg-dope-surface/50 p-3 rounded-lg border border-dope-border"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${
                                trade.status === 'CONFIRMED' 
                                  ? 'bg-neon-green' 
                                  : trade.status.includes('FAILED')
                                    ? 'bg-neon-pink'
                                    : 'bg-neon-yellow animate-pulse'
                              }`} />
                              <span className="font-bold text-sm text-white">
                                {trade.side} {trade.symbol}
                              </span>
                            </div>
                            <span className="font-mono text-xs text-dope-muted">
                              {trade.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-dope-muted text-xs py-4 font-mono">
                          No recent trades
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Disconnect */}
                  <button 
                    onClick={handleDisconnect}
                    className="w-full border border-neon-pink/30 text-neon-pink py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wide font-bold hover:bg-neon-pink/10 transition-colors active:scale-95"
                  >
                    <LogOut size={18} /> Disconnect
                  </button>
                </>
              ) : (
                /* Not Connected State */
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <div className="w-20 h-20 bg-dope-surface rounded-full flex items-center justify-center mb-6 border border-dope-border">
                    <Zap size={32} className="text-dope-muted" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">
                    Connect Wallet
                  </h3>
                  <p className="text-dope-muted text-sm text-center mb-8 max-w-xs">
                    Connect your TON wallet to start trading memecoins
                  </p>

                  <button
                    onClick={handleConnect}
                    disabled={walletState === 'CONNECTING'}
                    className="w-full bg-neon-green hover:bg-neon-greenDim text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wide transition-colors disabled:opacity-50 active:scale-95"
                  >
                    {walletState === 'CONNECTING' ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Zap size={18} /> Connect with TON
                      </>
                    )}
                  </button>

                  <button className="mt-4 text-dope-muted text-sm font-mono hover:text-white transition-colors">
                    Browse first →
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

