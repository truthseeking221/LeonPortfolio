/**
 * SettingsOverlay - App settings sheet
 * Implements PRD Part 4: Settings & Safety Rails
 * 
 * Sections:
 * - Experience (sound, haptics, safe mode)
 * - Trading (presets, slippage) - simplified for MVP
 * - Safety (caps) - simplified for MVP
 */

import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Volume2, VolumeX, Smartphone, ShieldAlert, 
  Sparkles, Gauge, Zap, AlertTriangle
} from 'lucide-react'
import { useAppStore } from '@/stores/app-store'
import { haptic } from '@/lib/telegram'

interface SettingsOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsOverlay({ isOpen, onClose }: SettingsOverlayProps) {
  const safeMode = useAppStore((s) => s.safeMode)
  const setSafeMode = useAppStore((s) => s.setSafeMode)
  const perfMode = useAppStore((s) => s.perfMode)
  const setPerfMode = useAppStore((s) => s.setPerfMode)
  const isAudioUnlocked = useAppStore((s) => s.isAudioUnlocked)
  const setAudioUnlocked = useAppStore((s) => s.setAudioUnlocked)

  const handleToggleSafeMode = () => {
    haptic.selection()
    setSafeMode(!safeMode)
  }

  const handleToggleSound = () => {
    if (!isAudioUnlocked) {
      // Unlock audio with user gesture
      setAudioUnlocked(true)
      haptic.notification('success')
    } else {
      setAudioUnlocked(false)
      haptic.selection()
    }
  }

  const handlePerfModeChange = (mode: 'auto' | 'high' | 'low') => {
    haptic.selection()
    setPerfMode(mode)
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
            className="absolute inset-x-0 bottom-0 max-h-[70vh] z-[60] bg-dope-black border-t border-dope-border rounded-t-3xl flex flex-col shadow-2xl"
          >
            {/* Handle */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1 bg-dope-border rounded-full" />
            </div>

            {/* Header */}
            <div className="flex justify-between items-center px-6 pb-4">
              <h2 className="text-2xl font-black italic text-white uppercase">
                Settings
              </h2>
              <button 
                onClick={onClose}
                className="p-2 bg-dope-surface rounded-full hover:bg-dope-border transition-colors"
              >
                <X size={20} className="text-dope-text" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-6">
              {/* Experience Section */}
              <div>
                <h3 className="text-xs font-mono text-dope-muted uppercase tracking-widest mb-3">
                  Experience
                </h3>
                <div className="space-y-2">
                  {/* Safe Mode */}
                  <SettingToggle
                    icon={ShieldAlert}
                    label="Safe Mode"
                    description="Reduce motion & flashes"
                    isActive={safeMode}
                    onToggle={handleToggleSafeMode}
                    activeColor="text-neon-green"
                  />

                  {/* Sound */}
                  <SettingToggle
                    icon={isAudioUnlocked ? Volume2 : VolumeX}
                    label="Sound Effects"
                    description={isAudioUnlocked ? "Audio enabled" : "Tap to enable audio"}
                    isActive={isAudioUnlocked}
                    onToggle={handleToggleSound}
                    activeColor="text-neon-cyan"
                  />
                </div>
              </div>

              {/* Performance Section */}
              <div>
                <h3 className="text-xs font-mono text-dope-muted uppercase tracking-widest mb-3">
                  Performance
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <PerfModeButton
                    mode="auto"
                    label="Auto"
                    icon={Sparkles}
                    isActive={perfMode === 'auto'}
                    onSelect={() => handlePerfModeChange('auto')}
                  />
                  <PerfModeButton
                    mode="high"
                    label="Quality"
                    icon={Zap}
                    isActive={perfMode === 'high'}
                    onSelect={() => handlePerfModeChange('high')}
                  />
                  <PerfModeButton
                    mode="low"
                    label="Battery"
                    icon={Gauge}
                    isActive={perfMode === 'low'}
                    onSelect={() => handlePerfModeChange('low')}
                  />
                </div>
                <p className="text-[10px] text-dope-muted mt-2 font-mono">
                  {perfMode === 'auto' && 'Automatically adjusts based on device'}
                  {perfMode === 'high' && 'Best visuals, may use more battery'}
                  {perfMode === 'low' && 'Reduced effects for better performance'}
                </p>
              </div>

              {/* Trading Section - Placeholder for MVP */}
              <div>
                <h3 className="text-xs font-mono text-dope-muted uppercase tracking-widest mb-3">
                  Trading
                </h3>
                <div className="p-4 bg-dope-surface rounded-xl border border-dope-border">
                  <div className="flex items-center gap-3 text-dope-muted">
                    <AlertTriangle size={16} className="text-neon-yellow" />
                    <span className="text-xs font-mono">
                      Advanced trading settings coming soon
                    </span>
                  </div>
                </div>
              </div>

              {/* Version */}
              <div className="pt-4 border-t border-dope-border">
                <div className="flex justify-between items-center text-xs font-mono text-dope-muted">
                  <span>DOPE v0.0.1</span>
                  <span>M0 Build</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface SettingToggleProps {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  description: string
  isActive: boolean
  onToggle: () => void
  activeColor: string
}

function SettingToggle({ 
  icon: Icon, 
  label, 
  description, 
  isActive, 
  onToggle,
  activeColor 
}: SettingToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 bg-dope-surface/50 rounded-xl border border-dope-border hover:bg-dope-surface transition-colors"
    >
      <div className="flex items-center gap-3">
        <Icon 
          size={20} 
          className={isActive ? activeColor : 'text-dope-muted'} 
        />
        <div className="flex flex-col items-start">
          <span className="font-bold text-sm text-white">{label}</span>
          <span className="text-[10px] text-dope-muted">{description}</span>
        </div>
      </div>
      
      {/* Toggle */}
      <div className={`w-11 h-6 rounded-full relative transition-colors ${isActive ? 'bg-neon-green' : 'bg-dope-border'}`}>
        <motion.div 
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
          animate={{ left: isActive ? 24 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
    </button>
  )
}

interface PerfModeButtonProps {
  mode: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  isActive: boolean
  onSelect: () => void
}

function PerfModeButton({ label, icon: Icon, isActive, onSelect }: PerfModeButtonProps) {
  return (
    <button
      onClick={onSelect}
      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
        isActive 
          ? 'bg-neon-green/10 border-neon-green/30 text-neon-green' 
          : 'bg-dope-surface/50 border-dope-border text-dope-muted hover:bg-dope-surface'
      }`}
    >
      <Icon size={20} />
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </button>
  )
}

