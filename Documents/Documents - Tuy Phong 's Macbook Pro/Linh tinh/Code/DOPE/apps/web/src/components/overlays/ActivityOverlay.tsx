/**
 * ActivityOverlay - Trade activity log
 * Implements PRD Part 3 Section 6: Activity & Audit View
 * 
 * Shows:
 * - All trades with status
 * - TX details
 * - Reconciliation status
 */

import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, FileText, ExternalLink, RefreshCw, 
  CheckCircle, XCircle, AlertTriangle, Clock 
} from 'lucide-react'
import { useTradeStore, type Trade, type TradeStatus } from '@/stores/trade-store'
import { haptic } from '@/lib/telegram'

interface ActivityOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function ActivityOverlay({ isOpen, onClose }: ActivityOverlayProps) {
  const trades = useTradeStore((s) => s.trades)
  const getPendingTrades = useTradeStore((s) => s.getPendingTrades)
  
  const pendingCount = getPendingTrades().length

  const handleRefresh = () => {
    haptic.impact('light')
    // In real app: trigger reconciliation for pending/unknown trades
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
            className="absolute inset-0 z-60 bg-black/60 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 h-[90vh] z-[70] bg-dope-black border-t border-dope-border rounded-t-3xl flex flex-col shadow-2xl"
          >
            {/* Handle */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1 bg-dope-border rounded-full" />
            </div>

            {/* Header */}
            <div className="flex justify-between items-center px-6 pb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black italic text-white uppercase">
                  Activity
                </h2>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 bg-neon-yellow/20 text-neon-yellow text-xs font-bold rounded-full">
                    {pendingCount} pending
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  className="p-2 bg-dope-surface rounded-full hover:bg-dope-border transition-colors"
                >
                  <RefreshCw size={18} className="text-dope-muted" />
                </button>
                <button 
                  onClick={onClose}
                  className="p-2 bg-dope-surface rounded-full hover:bg-dope-border transition-colors"
                >
                  <X size={20} className="text-dope-text" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {trades.length > 0 ? (
                <div className="space-y-3">
                  {trades.map((trade) => (
                    <TradeRow key={trade.id} trade={trade} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-dope-muted">
                  <FileText size={48} className="mb-4 opacity-20" />
                  <span className="text-sm font-mono uppercase tracking-widest">
                    No Records Found
                  </span>
                  <p className="text-xs mt-2 text-center max-w-xs">
                    Your trade history will appear here once you make your first trade
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function TradeRow({ trade }: { trade: Trade }) {
  const statusConfig = getStatusConfig(trade.status)
  const StatusIcon = statusConfig.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dope-surface p-4 rounded-xl border border-dope-border"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-black italic text-lg text-white">
            {trade.side} {trade.symbol}
          </h3>
          <span className="text-xs font-mono text-dope-muted">
            {formatTime(trade.createdAt)}
          </span>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${statusConfig.className}`}>
          <StatusIcon size={12} />
          {trade.status.replace(/_/g, ' ')}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm font-mono">
          <span className="text-dope-muted">Amount</span>
          <span className="text-white font-bold">
            {trade.amount} {trade.amountUnit === 'BASE' ? 'TON' : trade.symbol}
          </span>
        </div>

        {trade.presetLevel && (
          <div className="flex justify-between items-center text-sm font-mono">
            <span className="text-dope-muted">Level</span>
            <span className="text-dope-text">{trade.presetLevel}</span>
          </div>
        )}

        {trade.chainTxId && (
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-dope-muted">TX ID</span>
            <a 
              href={`https://tonviewer.com/transaction/${trade.chainTxId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-neon-cyan hover:underline"
            >
              <span className="truncate max-w-[100px]">{trade.chainTxId}</span>
              <ExternalLink size={10} />
            </a>
          </div>
        )}

        {trade.statusReasonCode && (
          <div className="mt-2 p-2 bg-dope-black/50 rounded-lg">
            <span className="text-xs font-mono text-dope-muted">
              {trade.statusReasonCode}
            </span>
          </div>
        )}

        {/* Retry button for transient failures */}
        {trade.retryable && (
          <button className="mt-2 w-full py-2 bg-neon-green/10 border border-neon-green/30 text-neon-green text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neon-green/20 transition-colors">
            Retry
          </button>
        )}

        {/* Warning for unknown state */}
        {trade.status === 'UNKNOWN' && (
          <div className="mt-2 p-3 bg-neon-yellow/10 border border-neon-yellow/30 rounded-lg">
            <p className="text-xs text-neon-yellow">
              ⚠️ Status uncertain. Do not retry yet. We're checking the chain.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function getStatusConfig(status: TradeStatus) {
  switch (status) {
    case 'CONFIRMED':
      return {
        icon: CheckCircle,
        className: 'bg-neon-green/20 text-neon-green border border-neon-green/30',
      }
    case 'FAILED_DETERMINISTIC':
    case 'FAILED_TRANSIENT':
      return {
        icon: XCircle,
        className: 'bg-neon-pink/20 text-neon-pink border border-neon-pink/30',
      }
    case 'UNKNOWN':
      return {
        icon: AlertTriangle,
        className: 'bg-neon-yellow/20 text-neon-yellow border border-neon-yellow/30 animate-pulse',
      }
    default:
      return {
        icon: Clock,
        className: 'bg-neon-yellow/20 text-neon-yellow border border-neon-yellow/30 animate-pulse',
      }
  }
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // Less than 1 minute
  if (diff < 60000) {
    return 'Just now'
  }
  
  // Less than 1 hour
  if (diff < 3600000) {
    const mins = Math.floor(diff / 60000)
    return `${mins}m ago`
  }
  
  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours}h ago`
  }
  
  // Format date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

