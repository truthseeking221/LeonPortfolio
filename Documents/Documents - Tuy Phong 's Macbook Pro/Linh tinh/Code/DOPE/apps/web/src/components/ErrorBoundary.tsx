/**
 * ErrorBoundary - Catch React errors and show recovery UI
 * Prevents white screen of death
 */

import { Component, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AlertOctagon, RefreshCw, Home, Bug } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console and potentially to telemetry
    console.error('[ErrorBoundary] Caught error:', error)
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack)
    
    this.setState({ errorInfo })
    
    // TODO: Send to telemetry service
    // telemetry.trackError({ error, componentStack: errorInfo.componentStack })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleGoHome = () => {
    // Clear state and reload
    localStorage.removeItem('dope_session')
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="fixed inset-0 bg-dope-black flex flex-col items-center justify-center p-6 text-center">
          {/* Background effect */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(255, 51, 102, 0.1) 2px,
                    rgba(255, 51, 102, 0.1) 4px
                  )
                `,
              }}
            />
          </div>

          {/* Content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10 max-w-md"
          >
            {/* Icon */}
            <motion.div
              animate={{ 
                rotate: [0, -5, 5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-6"
            >
              <div className="w-24 h-24 mx-auto bg-neon-pink/20 rounded-full flex items-center justify-center border-2 border-neon-pink/50">
                <AlertOctagon size={48} className="text-neon-pink" />
              </div>
            </motion.div>

            {/* Title */}
            <h1 className="text-3xl font-black italic text-white mb-2">
              SOMETHING BROKE
            </h1>
            <p className="text-dope-muted mb-6 font-mono text-sm">
              Don't worry, your funds are safe in your wallet.
            </p>

            {/* Error details (collapsible) */}
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-xs text-dope-muted font-mono cursor-pointer hover:text-white transition-colors flex items-center gap-2">
                  <Bug size={12} />
                  Show error details
                </summary>
                <div className="mt-2 p-3 bg-dope-surface rounded-lg border border-dope-border overflow-auto max-h-32">
                  <code className="text-[10px] text-neon-pink font-mono break-all">
                    {this.state.error.message}
                  </code>
                </div>
              </details>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 py-4 bg-neon-green text-black font-bold uppercase tracking-wider rounded-xl hover:bg-neon-greenDim transition-colors active:scale-95"
              >
                <RefreshCw size={18} />
                Reload App
              </button>

              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 py-3 bg-dope-surface border border-dope-border text-white font-bold uppercase tracking-wider rounded-xl hover:bg-dope-border transition-colors active:scale-95"
              >
                Try Again
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full flex items-center justify-center gap-2 py-3 text-dope-muted font-mono text-sm uppercase tracking-wider hover:text-white transition-colors"
              >
                <Home size={14} />
                Clear & Restart
              </button>
            </div>

            {/* Support hint */}
            <p className="mt-6 text-[10px] text-dope-border font-mono">
              If this keeps happening, contact support with the error details above.
            </p>
          </motion.div>

          {/* Version */}
          <div className="absolute bottom-6 text-dope-border text-xs font-mono">
            v0.0.1 • Error Recovery
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

