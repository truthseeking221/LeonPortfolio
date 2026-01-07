/**
 * DepositOverlay - TON deposit flow
 * Shows QR code with wallet address for deposits
 * 
 * Features:
 * - QR code generation
 * - Address copy
 * - Deposit instructions
 * - Pending deposit detection (mock)
 */

import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Copy, CheckCircle, Zap, 
  ExternalLink, Clock, AlertTriangle 
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useWalletStore } from '@/stores/wallet-store'
import { haptic } from '@/lib/telegram'

interface DepositOverlayProps {
  isOpen: boolean
  onClose: () => void
}

// Mock QR code component - in production would use a real QR library
function QRCodeDisplay({ value, size = 200 }: { value: string; size?: number }) {
  // Generate a simple visual pattern based on address hash
  const generatePattern = () => {
    const cells = []
    const gridSize = 21
    const cellSize = size / gridSize
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        // Create deterministic pattern from address
        const hash = (value.charCodeAt(x % value.length) + y * gridSize + x) % 3
        if (hash === 0 || (x < 7 && y < 7) || (x >= 14 && y < 7) || (x < 7 && y >= 14)) {
          cells.push(
            <rect 
              key={`${x}-${y}`} 
              x={x * cellSize} 
              y={y * cellSize} 
              width={cellSize} 
              height={cellSize} 
              fill="#00FF88"
            />
          )
        }
      }
    }
    
    // Add finder patterns (corners)
    const addFinderPattern = (cx: number, cy: number) => {
      const patterns = [
        <rect key={`fp-outer-${cx}-${cy}`} x={cx * cellSize} y={cy * cellSize} width={7 * cellSize} height={7 * cellSize} fill="#00FF88" />,
        <rect key={`fp-inner-white-${cx}-${cy}`} x={(cx + 1) * cellSize} y={(cy + 1) * cellSize} width={5 * cellSize} height={5 * cellSize} fill="#0a0a0a" />,
        <rect key={`fp-inner-${cx}-${cy}`} x={(cx + 2) * cellSize} y={(cy + 2) * cellSize} width={3 * cellSize} height={3 * cellSize} fill="#00FF88" />,
      ]
      return patterns
    }
    
    return [
      ...addFinderPattern(0, 0),
      ...addFinderPattern(14, 0),
      ...addFinderPattern(0, 14),
      ...cells,
    ]
  }

  return (
    <div className="bg-[#0a0a0a] p-4 rounded-2xl">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {generatePattern()}
      </svg>
    </div>
  )
}

export function DepositOverlay({ isOpen, onClose }: DepositOverlayProps) {
  const address = useWalletStore((s) => s.address)
  const addBalance = useWalletStore((s) => s.addBalance)
  
  const [copied, setCopied] = useState(false)
  const [pendingDeposit, setPendingDeposit] = useState<number | null>(null)
  const [depositConfirmed, setDepositConfirmed] = useState(false)

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

  // Mock: simulate deposit detection
  const handleSimulateDeposit = () => {
    const amount = Math.floor(Math.random() * 10 + 5) // 5-15 TON
    setPendingDeposit(amount)
    haptic.impact('medium')
    
    // Simulate confirmation after 3 seconds
    setTimeout(() => {
      addBalance(amount)
      setDepositConfirmed(true)
      haptic.notification('success')
      
      // Close after showing success
      setTimeout(() => {
        setPendingDeposit(null)
        setDepositConfirmed(false)
        onClose()
      }, 2000)
    }, 3000)
  }

  // Reset state when overlay closes
  useEffect(() => {
    if (!isOpen) {
      setPendingDeposit(null)
      setDepositConfirmed(false)
      setCopied(false)
    }
  }, [isOpen])

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
            className="absolute inset-0 z-[70] bg-black/80 backdrop-blur-md"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 z-[80] bg-dope-black border-t border-neon-green/30 rounded-t-3xl flex flex-col shadow-[0_-10px_50px_rgba(0,255,136,0.15)]"
          >
            {/* Handle */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1 bg-neon-green/30 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex justify-between items-center px-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neon-green/20 rounded-full flex items-center justify-center">
                  <Zap size={20} className="text-neon-green" />
                </div>
                <h2 className="text-2xl font-black italic text-white uppercase">
                  Deposit
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-dope-surface rounded-full hover:bg-dope-border transition-colors"
              >
                <X size={20} className="text-dope-text" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-8">
              {/* Pending/Confirmed State */}
              {pendingDeposit !== null ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center py-8"
                >
                  {depositConfirmed ? (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 10 }}
                        className="w-24 h-24 bg-neon-green/20 rounded-full flex items-center justify-center mb-6"
                      >
                        <CheckCircle size={48} className="text-neon-green" />
                      </motion.div>
                      <h3 className="text-2xl font-black text-neon-green mb-2">
                        Deposit Confirmed!
                      </h3>
                      <p className="text-4xl font-mono font-bold text-white">
                        +{pendingDeposit.toFixed(2)} TON
                      </p>
                    </>
                  ) : (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-24 h-24 border-4 border-neon-green/20 border-t-neon-green rounded-full mb-6"
                      />
                      <h3 className="text-xl font-bold text-white mb-2">
                        Detecting Deposit...
                      </h3>
                      <p className="text-2xl font-mono font-bold text-neon-yellow">
                        {pendingDeposit.toFixed(2)} TON
                      </p>
                      <p className="text-dope-muted text-sm mt-2">
                        Waiting for network confirmation
                      </p>
                    </>
                  )}
                </motion.div>
              ) : (
                <>
                  {/* QR Code */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative">
                      <QRCodeDisplay value={address || ''} size={200} />
                      {/* Center logo */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-dope-black rounded-lg flex items-center justify-center border-2 border-neon-green">
                          <span className="text-neon-green font-black text-lg">$</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-dope-muted text-xs mt-4 text-center font-mono">
                      Scan with your TON wallet to deposit
                    </p>
                  </div>

                  {/* Address */}
                  <div className="bg-dope-surface border border-dope-border rounded-xl p-4 mb-6">
                    <span className="text-dope-muted text-xs font-mono uppercase tracking-widest mb-2 block">
                      Your Deposit Address
                    </span>
                    <div className="flex items-center gap-3">
                      <code className="flex-1 text-white text-sm font-mono break-all leading-relaxed">
                        {address}
                      </code>
                      <button
                        onClick={handleCopyAddress}
                        className={`p-3 rounded-lg transition-all shrink-0 ${
                          copied 
                            ? 'bg-neon-green/20 text-neon-green' 
                            : 'bg-dope-border text-white hover:bg-neon-green/10'
                        }`}
                      >
                        {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Network Info */}
                  <div className="bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={20} className="text-neon-cyan shrink-0 mt-0.5" />
                      <div>
                        <p className="text-neon-cyan font-bold text-sm mb-1">
                          TON Network Only
                        </p>
                        <p className="text-white/70 text-xs leading-relaxed">
                          Only send TON to this address. Sending other tokens may result in permanent loss.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timing Info */}
                  <div className="flex items-center gap-3 text-dope-muted text-sm mb-6">
                    <Clock size={16} />
                    <span>Deposits usually arrive within 1-2 minutes</span>
                  </div>

                  {/* Mock deposit button (dev only) */}
                  {import.meta.env.DEV && (
                    <button
                      onClick={handleSimulateDeposit}
                      className="w-full bg-dope-surface border border-dope-border text-dope-muted py-3 rounded-xl text-sm font-mono hover:bg-dope-border transition-colors"
                    >
                      [DEV] Simulate Deposit
                    </button>
                  )}

                  {/* Open in wallet link */}
                  <button 
                    className="w-full mt-4 text-neon-green text-sm font-bold flex items-center justify-center gap-2 hover:underline"
                    onClick={() => {
                      // In production, would open ton:// deep link
                      haptic.impact('light')
                    }}
                  >
                    <ExternalLink size={16} />
                    Open in TON Wallet
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

