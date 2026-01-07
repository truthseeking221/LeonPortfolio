/**
 * WithdrawOverlay - TON withdrawal flow
 * Multi-step withdrawal with amount input and confirmation
 * 
 * Steps:
 * 1. Enter amount + destination
 * 2. Review + confirm
 * 3. Processing
 * 4. Success/Failure
 */

import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, TrendingUp, ArrowRight, CheckCircle, AlertTriangle,
  Wallet, ChevronLeft, XCircle
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useWalletStore } from '@/stores/wallet-store'
import { haptic } from '@/lib/telegram'

interface WithdrawOverlayProps {
  isOpen: boolean
  onClose: () => void
}

type WithdrawStep = 'amount' | 'confirm' | 'processing' | 'success' | 'error'

// Preset amounts
const PRESETS = [
  { label: '25%', factor: 0.25 },
  { label: '50%', factor: 0.5 },
  { label: '75%', factor: 0.75 },
  { label: 'MAX', factor: 1 },
]

// Network fee (mock)
const NETWORK_FEE = 0.01

export function WithdrawOverlay({ isOpen, onClose }: WithdrawOverlayProps) {
  const spendableBalance = useWalletStore((s) => s.spendableBalance)
  const deductBalance = useWalletStore((s) => s.deductBalance)
  
  const [step, setStep] = useState<WithdrawStep>('amount')
  const [amount, setAmount] = useState('')
  const [destinationAddress, setDestinationAddress] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  const numericAmount = parseFloat(amount) || 0
  const totalWithFee = numericAmount + NETWORK_FEE
  const isValidAmount = numericAmount > 0 && numericAmount <= spendableBalance
  const isValidAddress = destinationAddress.startsWith('UQ') || destinationAddress.startsWith('EQ')

  // Reset state when overlay closes
  useEffect(() => {
    if (!isOpen) {
      setStep('amount')
      setAmount('')
      setDestinationAddress('')
      setError(null)
      setTxHash(null)
    }
  }, [isOpen])

  const handlePresetClick = (factor: number) => {
    const presetAmount = (spendableBalance * factor).toFixed(4)
    setAmount(presetAmount)
    haptic.impact('light')
  }

  const handleAmountChange = (value: string) => {
    // Only allow valid number input
    if (/^\d*\.?\d{0,4}$/.test(value) || value === '') {
      setAmount(value)
      setError(null)
    }
  }

  const handleContinue = () => {
    if (!isValidAmount) {
      setError('Invalid amount')
      haptic.notification('error')
      return
    }
    if (!isValidAddress) {
      setError('Invalid TON address')
      haptic.notification('error')
      return
    }
    setStep('confirm')
    haptic.impact('medium')
  }

  const handleConfirm = async () => {
    setStep('processing')
    haptic.impact('heavy')

    try {
      // Simulate withdrawal processing
      await new Promise((resolve) => setTimeout(resolve, 2500))

      // Mock: 90% success rate
      if (Math.random() > 0.1) {
        // Success
        deductBalance(totalWithFee)
        setTxHash(`tx_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`)
        setStep('success')
        haptic.notification('success')
      } else {
        // Simulated failure
        throw new Error('Transaction failed. Please try again.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Withdrawal failed')
      setStep('error')
      haptic.notification('error')
    }
  }

  const handleBack = () => {
    setStep('amount')
    setError(null)
  }

  const handleDone = () => {
    onClose()
  }

  const handleRetry = () => {
    setStep('amount')
    setError(null)
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
            onClick={step === 'amount' ? onClose : undefined}
            className="absolute inset-0 z-[70] bg-black/80 backdrop-blur-md"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 z-[80] bg-dope-black border-t border-dope-border rounded-t-3xl flex flex-col shadow-2xl"
          >
            {/* Handle */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1 bg-dope-border rounded-full" />
            </div>

            {/* Header */}
            <div className="flex justify-between items-center px-6 pb-4">
              <div className="flex items-center gap-3">
                {step === 'confirm' && (
                  <button 
                    onClick={handleBack}
                    className="p-2 bg-dope-surface rounded-full hover:bg-dope-border transition-colors mr-1"
                  >
                    <ChevronLeft size={20} className="text-dope-text" />
                  </button>
                )}
                <div className="w-10 h-10 bg-dope-surface rounded-full flex items-center justify-center border border-dope-border">
                  <TrendingUp size={20} className="text-white" />
                </div>
                <h2 className="text-2xl font-black italic text-white uppercase">
                  Withdraw
                </h2>
              </div>
              {step === 'amount' && (
                <button 
                  onClick={onClose}
                  className="p-2 bg-dope-surface rounded-full hover:bg-dope-border transition-colors"
                >
                  <X size={20} className="text-dope-text" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Amount Input */}
                {step === 'amount' && (
                  <motion.div
                    key="amount"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* Available Balance */}
                    <div className="text-center mb-6">
                      <span className="text-dope-muted text-xs font-mono uppercase tracking-widest">
                        Available to Withdraw
                      </span>
                      <div className="text-2xl font-mono font-bold text-white mt-1">
                        {spendableBalance.toFixed(4)} <span className="text-neon-green">TON</span>
                      </div>
                    </div>

                    {/* Amount Input */}
                    <div className="bg-dope-surface border border-dope-border rounded-2xl p-6 mb-4">
                      <label className="text-dope-muted text-xs font-mono uppercase tracking-widest mb-3 block">
                        Amount
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={amount}
                          onChange={(e) => handleAmountChange(e.target.value)}
                          placeholder="0.00"
                          className="flex-1 bg-transparent text-4xl font-mono font-bold text-white outline-none placeholder:text-dope-border"
                        />
                        <span className="text-neon-green font-bold text-xl">TON</span>
                      </div>

                      {/* Preset Buttons */}
                      <div className="flex gap-2 mt-4">
                        {PRESETS.map((preset) => (
                          <button
                            key={preset.label}
                            onClick={() => handlePresetClick(preset.factor)}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                              numericAmount === spendableBalance * preset.factor
                                ? 'bg-neon-green text-black'
                                : 'bg-dope-border text-white hover:bg-dope-border/80'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Destination Address */}
                    <div className="bg-dope-surface border border-dope-border rounded-2xl p-4 mb-4">
                      <label className="text-dope-muted text-xs font-mono uppercase tracking-widest mb-2 block">
                        Destination Address
                      </label>
                      <input
                        type="text"
                        value={destinationAddress}
                        onChange={(e) => {
                          setDestinationAddress(e.target.value)
                          setError(null)
                        }}
                        placeholder="UQ... or EQ..."
                        className="w-full bg-transparent text-white font-mono text-sm outline-none placeholder:text-dope-border"
                      />
                    </div>

                    {/* Error */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-neon-pink/10 border border-neon-pink/30 rounded-xl p-3 mb-4 flex items-center gap-2"
                      >
                        <AlertTriangle size={16} className="text-neon-pink shrink-0" />
                        <span className="text-neon-pink text-sm">{error}</span>
                      </motion.div>
                    )}

                    {/* Fee Info */}
                    <div className="flex justify-between items-center text-sm text-dope-muted mb-6">
                      <span>Network Fee</span>
                      <span className="font-mono">{NETWORK_FEE} TON</span>
                    </div>

                    {/* Continue Button */}
                    <button
                      onClick={handleContinue}
                      disabled={!isValidAmount || !destinationAddress}
                      className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wide transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                    >
                      Continue <ArrowRight size={18} />
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Confirm */}
                {step === 'confirm' && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {/* Summary */}
                    <div className="bg-dope-surface border border-dope-border rounded-2xl p-6 mb-6">
                      <div className="text-center mb-6">
                        <span className="text-dope-muted text-xs font-mono uppercase tracking-widest">
                          Withdrawing
                        </span>
                        <div className="text-4xl font-mono font-bold text-white mt-2">
                          {numericAmount.toFixed(4)} <span className="text-neon-green">TON</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-dope-border">
                          <span className="text-dope-muted text-sm">To</span>
                          <span className="text-white font-mono text-xs truncate max-w-[200px]">
                            {destinationAddress}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-dope-border">
                          <span className="text-dope-muted text-sm">Network Fee</span>
                          <span className="text-white font-mono text-sm">{NETWORK_FEE} TON</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-white font-bold">Total</span>
                          <span className="text-neon-green font-mono font-bold">
                            {totalWithFee.toFixed(4)} TON
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-neon-yellow/10 border border-neon-yellow/30 rounded-xl p-4 mb-6 flex items-start gap-3">
                      <AlertTriangle size={20} className="text-neon-yellow shrink-0 mt-0.5" />
                      <div>
                        <p className="text-neon-yellow font-bold text-sm mb-1">
                          Confirm Details
                        </p>
                        <p className="text-white/70 text-xs leading-relaxed">
                          Please verify the address carefully. Transactions cannot be reversed.
                        </p>
                      </div>
                    </div>

                    {/* Confirm Button */}
                    <button
                      onClick={handleConfirm}
                      className="w-full bg-neon-green hover:bg-neon-greenDim text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wide transition-all active:scale-95"
                    >
                      <Wallet size={18} /> Confirm Withdrawal
                    </button>
                  </motion.div>
                )}

                {/* Step 3: Processing */}
                {step === 'processing' && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      className="w-20 h-20 border-4 border-neon-green/20 border-t-neon-green rounded-full mb-6"
                    />
                    <h3 className="text-xl font-bold text-white mb-2">
                      Processing Withdrawal
                    </h3>
                    <p className="text-dope-muted text-sm text-center">
                      Please wait while we process your transaction...
                    </p>
                    <div className="mt-6 text-2xl font-mono font-bold text-neon-yellow">
                      {numericAmount.toFixed(4)} TON
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Success */}
                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 10, delay: 0.1 }}
                      className="w-24 h-24 bg-neon-green/20 rounded-full flex items-center justify-center mb-6"
                    >
                      <CheckCircle size={48} className="text-neon-green" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-black text-neon-green mb-2">
                      Withdrawal Sent!
                    </h3>
                    <p className="text-4xl font-mono font-bold text-white mb-4">
                      {numericAmount.toFixed(4)} TON
                    </p>
                    
                    <div className="bg-dope-surface border border-dope-border rounded-xl p-4 w-full mb-6">
                      <span className="text-dope-muted text-xs font-mono uppercase tracking-widest block mb-1">
                        Transaction Hash
                      </span>
                      <code className="text-white text-sm font-mono break-all">
                        {txHash}
                      </code>
                    </div>

                    <button
                      onClick={handleDone}
                      className="w-full bg-white text-black font-bold py-4 rounded-xl uppercase tracking-wide transition-all active:scale-95"
                    >
                      Done
                    </button>
                  </motion.div>
                )}

                {/* Step 5: Error */}
                {step === 'error' && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 10, delay: 0.1 }}
                      className="w-24 h-24 bg-neon-pink/20 rounded-full flex items-center justify-center mb-6"
                    >
                      <XCircle size={48} className="text-neon-pink" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-black text-neon-pink mb-2">
                      Withdrawal Failed
                    </h3>
                    <p className="text-dope-muted text-sm text-center mb-6 max-w-xs">
                      {error || 'Something went wrong. Please try again.'}
                    </p>

                    <div className="flex gap-4 w-full">
                      <button
                        onClick={handleDone}
                        className="flex-1 bg-dope-surface border border-dope-border text-white font-bold py-4 rounded-xl uppercase tracking-wide transition-all active:scale-95"
                      >
                        Close
                      </button>
                      <button
                        onClick={handleRetry}
                        className="flex-1 bg-white text-black font-bold py-4 rounded-xl uppercase tracking-wide transition-all active:scale-95"
                      >
                        Retry
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

