/**
 * SendingOverlay - Trade execution feedback
 * Implements PRD F-12, F-13: Optimistic UI
 * 
 * States: SENDING → SENT → OPTIMISTIC → CONFIRMED
 */

import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Activity, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { useAppStore } from '@/stores/app-store'

type SendingStatus = 
  | 'SENDING' 
  | 'SENT' 
  | 'OPTIMISTIC' 
  | 'CONFIRMED' 
  | 'FAILED'
  | 'UNKNOWN'
  | null

interface SendingOverlayProps {
  status: SendingStatus
  onDismiss?: () => void
  errorMessage?: string
}

export function SendingOverlay({ status, onDismiss, errorMessage }: SendingOverlayProps) {
  const safeMode = useAppStore((s) => s.safeMode)

  if (!status) return null

  return (
    <AnimatePresence>
      <motion.div
        key={status}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-40 bg-black/95 flex flex-col items-center justify-center"
      >
        {status === 'SENDING' && (
          <div className="flex flex-col items-center gap-4">
            {/* Spinner */}
            <div className="relative w-20 h-20">
              <motion.div
                className="absolute inset-0 border-4 border-dope-border border-t-neon-green rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap size={24} className="text-neon-green" />
              </div>
            </div>
            <span className="text-xl font-bold font-mono text-dope-muted uppercase tracking-widest">
              Sending...
            </span>
          </div>
        )}

        {status === 'SENT' && (
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Success icon */}
            <motion.div 
              className="p-5 bg-neon-green rounded-full shadow-[0_0_40px_rgba(0,255,136,0.5)]"
              animate={safeMode ? {} : {
                boxShadow: [
                  '0 0 40px rgba(0, 255, 136, 0.5)',
                  '0 0 60px rgba(0, 255, 136, 0.3)',
                  '0 0 40px rgba(0, 255, 136, 0.5)',
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Zap size={40} className="text-black fill-current" />
            </motion.div>
            
            {/* Title with glitch effect */}
            <GlitchTitle text="ORDER SENT" safeMode={safeMode} />
            
            <span className="text-sm font-mono text-dope-muted">
              Confirming on chain...
            </span>
          </motion.div>
        )}

        {status === 'OPTIMISTIC' && (
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Activity size={48} className="text-neon-green" />
            </motion.div>
            <span className="text-lg font-bold font-mono text-neon-green uppercase tracking-widest">
              Pending On-Chain
            </span>
            <span className="text-xs font-mono text-dope-muted">
              This may take a few seconds
            </span>
          </div>
        )}

        {status === 'CONFIRMED' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div 
              className="p-4 bg-neon-green/20 rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircle size={48} className="text-neon-green" />
            </motion.div>
            <h2 className="text-3xl font-black italic text-neon-green">
              CONFIRMED
            </h2>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="mt-4 px-6 py-2 text-dope-muted text-sm font-mono uppercase tracking-wider hover:text-white transition-colors"
              >
                Continue
              </button>
            )}
          </motion.div>
        )}

        {status === 'FAILED' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-4 px-6 text-center"
          >
            <motion.div 
              className="p-4 bg-neon-pink/20 rounded-full"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <XCircle size={48} className="text-neon-pink" />
            </motion.div>
            <h2 className="text-2xl font-black italic text-neon-pink">
              FAILED
            </h2>
            {errorMessage && (
              <p className="text-sm text-dope-muted max-w-xs">
                {errorMessage}
              </p>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="mt-4 px-6 py-3 bg-neon-pink/10 border border-neon-pink/30 text-neon-pink font-bold uppercase tracking-wider hover:bg-neon-pink/20 transition-colors"
              >
                Try Again
              </button>
            )}
          </motion.div>
        )}

        {status === 'UNKNOWN' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-4 px-6 text-center"
          >
            <motion.div 
              className="p-4 bg-neon-yellow/20 rounded-full"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertTriangle size={48} className="text-neon-yellow" />
            </motion.div>
            <h2 className="text-2xl font-black italic text-neon-yellow">
              CHECKING...
            </h2>
            <p className="text-sm text-dope-muted max-w-xs">
              We couldn't confirm the status. Check Activity for updates.
            </p>
            {onDismiss && (
              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={onDismiss}
                  className="px-6 py-3 bg-dope-surface border border-dope-border text-white font-bold uppercase tracking-wider hover:bg-dope-border transition-colors"
                >
                  View Activity
                </button>
                <span className="text-xs text-dope-muted font-mono">
                  Do not retry yet
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* Flash effect for SENT */}
        {status === 'SENT' && !safeMode && (
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-white pointer-events-none mix-blend-overlay"
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}

// Glitch title component
function GlitchTitle({ text, safeMode }: { text: string; safeMode: boolean }) {
  if (safeMode) {
    return (
      <h2 className="text-5xl font-black italic text-white tracking-tighter">
        {text}
      </h2>
    )
  }

  return (
    <h2 className="relative text-5xl font-black italic text-white tracking-tighter">
      <span className="relative z-10">{text}</span>
      <motion.span
        className="absolute top-0 left-0 -z-10 text-neon-pink opacity-70"
        animate={{ x: [-2, 2, -1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 0.2, repeat: Infinity, repeatType: 'reverse' }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 -z-10 text-neon-cyan opacity-70"
        animate={{ x: [2, -2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 0.15, repeat: Infinity, repeatType: 'reverse' }}
      >
        {text}
      </motion.span>
    </h2>
  )
}

