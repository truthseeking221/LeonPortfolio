/**
 * RiskSheet - Token risk information
 * Implements PRD F-08: Token Risk/Signal Sheet
 * 
 * Shows:
 * - Token info
 * - Risk level
 * - Risk signals
 * - Actions (hide, report)
 */

import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, ShieldCheck, ShieldAlert, Copy, ExternalLink,
  EyeOff, Flag, CheckCircle
} from 'lucide-react'
import { useState } from 'react'
import type { Token } from '@/stores/game-store'
import { haptic } from '@/lib/telegram'

interface RiskSheetProps {
  isOpen: boolean
  onClose: () => void
  token: Token | null
}

export function RiskSheet({ isOpen, onClose, token }: RiskSheetProps) {
  const [copied, setCopied] = useState(false)

  if (!token) return null

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(token.id)
      setCopied(true)
      haptic.notification('success')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      haptic.notification('error')
    }
  }

  const handleHideToken = () => {
    haptic.impact('medium')
    // In real app: hide token from deck
    onClose()
  }

  const handleReportToken = () => {
    haptic.impact('medium')
    // In real app: open report modal
  }

  const riskColor = {
    LOW: 'text-neon-green',
    MED: 'text-neon-yellow',
    HIGH: 'text-neon-pink',
  }[token.risk.level]

  const riskBg = {
    LOW: 'bg-neon-green/10 border-neon-green/30',
    MED: 'bg-neon-yellow/10 border-neon-yellow/30',
    HIGH: 'bg-neon-pink/10 border-neon-pink/30',
  }[token.risk.level]

  const RiskIcon = token.risk.level === 'HIGH' ? ShieldAlert : ShieldCheck

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 z-[80] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-dope-black w-full max-w-sm rounded-2xl border border-dope-border p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <img 
                src={token.image} 
                className="w-14 h-14 rounded-xl object-cover border border-dope-border" 
                alt={token.name} 
              />
              <div className="flex-1">
                <h3 className="text-xl font-black italic text-white">
                  ${token.symbol}
                </h3>
                <span className="text-xs font-mono text-dope-muted">
                  {token.name}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-dope-surface rounded-full hover:bg-dope-border transition-colors"
              >
                <X size={16} className="text-dope-muted" />
              </button>
            </div>

            {/* Risk Level */}
            <div className={`flex items-center gap-3 p-4 rounded-xl border mb-4 ${riskBg}`}>
              <RiskIcon size={24} className={riskColor} />
              <div>
                <span className={`font-bold text-lg ${riskColor}`}>
                  {token.risk.level} RISK
                </span>
                <p className="text-xs text-dope-muted">
                  Based on liquidity, age, and contract analysis
                </p>
              </div>
            </div>

            {/* Risk Signals */}
            <div className="space-y-2 mb-6">
              <span className="text-xs font-mono text-dope-muted uppercase tracking-widest">
                Signals
              </span>
              {token.risk.signals.map((signal, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-2 text-sm text-dope-text p-2 bg-dope-surface/50 rounded-lg"
                >
                  <CheckCircle size={14} className="text-neon-green shrink-0" />
                  {signal}
                </div>
              ))}
            </div>

            {/* Token Address */}
            <div className="mb-6">
              <span className="text-xs font-mono text-dope-muted uppercase tracking-widest">
                Contract
              </span>
              <button
                onClick={handleCopyAddress}
                className="mt-1 w-full flex items-center justify-between p-3 bg-dope-surface rounded-lg hover:bg-dope-border transition-colors"
              >
                <span className="text-xs font-mono text-dope-text truncate">
                  {token.id}
                </span>
                {copied ? (
                  <CheckCircle size={14} className="text-neon-green shrink-0 ml-2" />
                ) : (
                  <Copy size={14} className="text-dope-muted shrink-0 ml-2" />
                )}
              </button>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button 
                onClick={() => window.open(`https://tonviewer.com/address/${token.id}`, '_blank')}
                className="w-full bg-dope-surface hover:bg-dope-border text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <ExternalLink size={16} />
                View on Explorer
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={handleHideToken}
                  className="bg-dope-surface/50 hover:bg-dope-surface text-dope-muted font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
                >
                  <EyeOff size={14} />
                  Hide
                </button>
                <button 
                  onClick={handleReportToken}
                  className="bg-neon-pink/10 hover:bg-neon-pink/20 text-neon-pink font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
                >
                  <Flag size={14} />
                  Report
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

