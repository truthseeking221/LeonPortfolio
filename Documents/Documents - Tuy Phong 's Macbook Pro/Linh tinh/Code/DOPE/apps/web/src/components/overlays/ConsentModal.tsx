/**
 * ConsentModal - 18+ and Risk Acknowledgment
 * PRD F-02: Consent required before trading
 * 
 * Must accept before any trading actions are allowed
 */

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Shield, Skull, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { haptic } from '@/lib/telegram'

interface ConsentModalProps {
  isOpen: boolean
  onAccept: (version: string) => void
}

const CONSENT_VERSION = '1.0.0'

export function ConsentModal({ isOpen, onAccept }: ConsentModalProps) {
  const [step, setStep] = useState<'age' | 'risk' | 'done'>('age')
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [riskConfirmed, setRiskConfirmed] = useState(false)

  const handleAgeConfirm = () => {
    haptic.impact('medium')
    setAgeConfirmed(true)
    setStep('risk')
  }

  const handleRiskConfirm = () => {
    haptic.impact('medium')
    setRiskConfirmed(true)
    setStep('done')
    
    // Small delay for animation
    setTimeout(() => {
      haptic.notification('success')
      onAccept(CONSENT_VERSION)
    }, 800)
  }

  const handleDecline = () => {
    haptic.notification('error')
    // Show message or close app
    window.location.href = 'https://google.com'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-dope-black flex items-center justify-center p-4"
        >
          {/* Background effect */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute w-[600px] h-[600px] rounded-full blur-[150px]"
              style={{
                background: 'radial-gradient(circle, rgba(255, 51, 102, 0.1) 0%, transparent 70%)',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          {/* Content */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="relative z-10 w-full max-w-md"
          >
            <AnimatePresence mode="wait">
              {/* Step 1: Age Verification */}
              {step === 'age' && (
                <motion.div
                  key="age"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-dope-surface border border-dope-border rounded-2xl p-6"
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-neon-yellow/20 rounded-full flex items-center justify-center border-2 border-neon-yellow/50">
                      <Shield size={28} className="text-neon-yellow" />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-black italic text-white text-center mb-2">
                    AGE VERIFICATION
                  </h2>

                  <p className="text-dope-muted text-sm text-center mb-6 font-mono">
                    You must be 18 years or older to use this app.
                  </p>

                  {/* Checkbox */}
                  <label className="flex items-start gap-3 p-4 bg-dope-black rounded-xl border border-dope-border cursor-pointer mb-6 hover:border-neon-green/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={ageConfirmed}
                      onChange={(e) => setAgeConfirmed(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-dope-border bg-dope-black text-neon-green focus:ring-neon-green focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-sm text-white">
                      I confirm that I am <strong>18 years of age or older</strong> and legally permitted to use financial services in my jurisdiction.
                    </span>
                  </label>

                  {/* Actions */}
                  <div className="space-y-3">
                    <button
                      onClick={handleAgeConfirm}
                      disabled={!ageConfirmed}
                      className="w-full py-4 bg-neon-green text-black font-bold uppercase tracking-wider rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neon-greenDim transition-colors active:scale-95"
                    >
                      Continue
                    </button>
                    <button
                      onClick={handleDecline}
                      className="w-full py-3 text-dope-muted text-sm uppercase tracking-wider hover:text-neon-pink transition-colors"
                    >
                      I'm under 18
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Risk Acknowledgment */}
              {step === 'risk' && (
                <motion.div
                  key="risk"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-dope-surface border border-dope-border rounded-2xl p-6"
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <motion.div 
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-16 h-16 bg-neon-pink/20 rounded-full flex items-center justify-center border-2 border-neon-pink/50"
                    >
                      <Skull size={28} className="text-neon-pink" />
                    </motion.div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-black italic text-white text-center mb-2">
                    RISK WARNING
                  </h2>

                  <p className="text-dope-muted text-sm text-center mb-4 font-mono">
                    Memecoins are extremely volatile and risky.
                  </p>

                  {/* Risk items */}
                  <div className="space-y-2 mb-6">
                    <RiskItem text="You can lose 100% of your investment" />
                    <RiskItem text="Tokens may have no liquidity (can't sell)" />
                    <RiskItem text="Many projects are scams or rugs" />
                    <RiskItem text="Past performance means nothing" />
                    <RiskItem text="DOPE does not provide financial advice" />
                  </div>

                  {/* Checkbox */}
                  <label className="flex items-start gap-3 p-4 bg-dope-black rounded-xl border border-dope-border cursor-pointer mb-6 hover:border-neon-pink/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={riskConfirmed}
                      onChange={(e) => setRiskConfirmed(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-dope-border bg-dope-black text-neon-pink focus:ring-neon-pink focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-sm text-white">
                      I understand the risks and accept that <strong>I may lose all my funds</strong>. I will only trade with money I can afford to lose.
                    </span>
                  </label>

                  {/* Actions */}
                  <button
                    onClick={handleRiskConfirm}
                    disabled={!riskConfirmed}
                    className="w-full py-4 bg-neon-pink text-white font-bold uppercase tracking-wider rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neon-pinkDim transition-colors active:scale-95"
                  >
                    I Understand, Let Me In
                  </button>
                </motion.div>
              )}

              {/* Step 3: Done */}
              {step === 'done' && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-24 h-24 bg-neon-green rounded-full flex items-center justify-center mb-4 shadow-[0_0_60px_rgba(0,255,136,0.5)]"
                  >
                    <CheckCircle size={48} className="text-black" />
                  </motion.div>
                  <h2 className="text-3xl font-black italic text-white">
                    LET'S GO
                  </h2>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function RiskItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <AlertTriangle size={14} className="text-neon-pink shrink-0" />
      <span className="text-dope-text">{text}</span>
    </div>
  )
}

export default ConsentModal

