/**
 * InsufficientBalanceOverlay - Shown when user tries to buy with insufficient funds
 * Clear explanation + deposit CTA
 */

import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, AlertCircle, Zap, X } from 'lucide-react'
import { haptic } from '@/lib/telegram'

interface InsufficientBalanceOverlayProps {
  isOpen: boolean
  requiredAmount: number
  availableAmount: number
  onClose: () => void
  onDeposit: () => void
}

export function InsufficientBalanceOverlay({
  isOpen,
  requiredAmount,
  availableAmount,
  onClose,
  onDeposit,
}: InsufficientBalanceOverlayProps) {
  const shortfall = requiredAmount - availableAmount

  const handleDeposit = () => {
    haptic.impact('medium')
    onClose()
    onDeposit()
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
            className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[90] bg-dope-black border border-dope-border rounded-2xl p-6 max-w-md mx-auto shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-dope-muted hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-neon-yellow/20 rounded-full flex items-center justify-center border-2 border-neon-yellow/50"
              >
                <Wallet size={28} className="text-neon-yellow" />
              </motion.div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-black italic text-white text-center mb-2">
              NOT ENOUGH FUNDS
            </h2>

            {/* Balance comparison */}
            <div className="bg-dope-surface rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-dope-border">
                <span className="text-sm text-dope-muted font-mono">Required</span>
                <span className="text-lg font-bold text-white font-mono">
                  {requiredAmount.toFixed(2)} <span className="text-neon-green text-xs">TON</span>
                </span>
              </div>
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-dope-border">
                <span className="text-sm text-dope-muted font-mono">Available</span>
                <span className="text-lg font-bold text-white font-mono">
                  {availableAmount.toFixed(2)} <span className="text-neon-green text-xs">TON</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neon-pink font-mono">Shortfall</span>
                <span className="text-lg font-bold text-neon-pink font-mono">
                  {shortfall.toFixed(2)} <span className="text-xs">TON</span>
                </span>
              </div>
            </div>

            {/* Explanation */}
            <div className="flex items-start gap-2 bg-neon-yellow/10 border border-neon-yellow/30 rounded-lg p-3 mb-6">
              <AlertCircle size={16} className="text-neon-yellow shrink-0 mt-0.5" />
              <p className="text-xs text-neon-yellow">
                We reserve a small amount for gas fees so you can always sell your position.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleDeposit}
                className="w-full flex items-center justify-center gap-2 py-4 bg-neon-green text-black font-bold uppercase tracking-wider rounded-xl hover:bg-neon-greenDim transition-colors active:scale-95"
              >
                <Zap size={18} />
                Deposit TON
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 text-dope-muted font-mono text-sm uppercase tracking-wider hover:text-white transition-colors"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default InsufficientBalanceOverlay

