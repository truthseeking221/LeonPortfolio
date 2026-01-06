/**
 * Telegram WebApp SDK Integration
 * Provides type-safe access to Telegram Mini App features
 * 
 * References:
 * - PRD Appendix X1.3: Required Telegram WebApp capabilities
 * - PRD F-01: Launch from Telegram → Boot
 */

import WebApp from '@twa-dev/sdk'

// Re-export the SDK for direct access
export { WebApp }

// Check if running inside Telegram
export const isTelegramWebApp = (): boolean => {
  try {
    return WebApp.initData !== ''
  } catch {
    return false
  }
}

// Initialize Telegram WebApp
export const initTelegramWebApp = (): boolean => {
  try {
    if (!isTelegramWebApp()) {
      console.log('[Telegram] Not running inside Telegram WebApp')
      return false
    }

    // Expand to full height
    WebApp.expand()

    // Set header color to match our theme
    WebApp.setHeaderColor('#0a0a0f')
    WebApp.setBackgroundColor('#0a0a0f')

    // Enable closing confirmation (prevents accidental close during trades)
    WebApp.enableClosingConfirmation()

    // Ready signal - tells Telegram we're done loading
    WebApp.ready()

    console.log('[Telegram] WebApp initialized successfully', {
      version: WebApp.version,
      platform: WebApp.platform,
      colorScheme: WebApp.colorScheme,
      viewportHeight: WebApp.viewportHeight,
      viewportStableHeight: WebApp.viewportStableHeight,
    })

    return true
  } catch (error) {
    console.error('[Telegram] Failed to initialize WebApp:', error)
    return false
  }
}

// Get safe area insets
export const getSafeAreaInsets = () => {
  if (!isTelegramWebApp()) {
    return {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }
  }

  // Telegram provides safe area via CSS variables
  const style = getComputedStyle(document.documentElement)
  return {
    top: parseInt(style.getPropertyValue('--tg-safe-area-inset-top') || '0', 10),
    bottom: parseInt(style.getPropertyValue('--tg-safe-area-inset-bottom') || '0', 10),
    left: parseInt(style.getPropertyValue('--tg-safe-area-inset-left') || '0', 10),
    right: parseInt(style.getPropertyValue('--tg-safe-area-inset-right') || '0', 10),
  }
}

// Haptic feedback helpers (PRD: feedback < 100ms)
export const haptic = {
  impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => {
    try {
      WebApp.HapticFeedback.impactOccurred(style)
    } catch {
      // Fallback to navigator.vibrate
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        const patterns: Record<string, number> = {
          light: 10,
          medium: 20,
          heavy: 40,
          rigid: 30,
          soft: 15,
        }
        navigator.vibrate(patterns[style] || 20)
      }
    }
  },
  notification: (type: 'error' | 'success' | 'warning') => {
    try {
      WebApp.HapticFeedback.notificationOccurred(type)
    } catch {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        const patterns: Record<string, number | number[]> = {
          error: [50, 50, 50],
          success: [30, 30],
          warning: [40],
        }
        navigator.vibrate(patterns[type] || 20)
      }
    }
  },
  selection: () => {
    try {
      WebApp.HapticFeedback.selectionChanged()
    } catch {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(5)
      }
    }
  },
}

// Cloud storage helpers (PRD: SecureStorage/DeviceStorage)
export const storage = {
  get: async (key: string): Promise<string | null> => {
    if (!isTelegramWebApp()) {
      return localStorage.getItem(key)
    }
    
    return new Promise((resolve) => {
      WebApp.CloudStorage.getItem(key, (error, value) => {
        if (error) {
          console.warn('[Telegram] CloudStorage.getItem error:', error)
          resolve(localStorage.getItem(key))
        } else {
          resolve(value || null)
        }
      })
    })
  },
  
  set: async (key: string, value: string): Promise<boolean> => {
    if (!isTelegramWebApp()) {
      localStorage.setItem(key, value)
      return true
    }
    
    return new Promise((resolve) => {
      WebApp.CloudStorage.setItem(key, value, (error) => {
        if (error) {
          console.warn('[Telegram] CloudStorage.setItem error:', error)
          localStorage.setItem(key, value)
          resolve(false)
        } else {
          resolve(true)
        }
      })
    })
  },
  
  remove: async (key: string): Promise<boolean> => {
    if (!isTelegramWebApp()) {
      localStorage.removeItem(key)
      return true
    }
    
    return new Promise((resolve) => {
      WebApp.CloudStorage.removeItem(key, (error) => {
        if (error) {
          console.warn('[Telegram] CloudStorage.removeItem error:', error)
          localStorage.removeItem(key)
          resolve(false)
        } else {
          resolve(true)
        }
      })
    })
  },
}

// Theme helpers
export const getThemeParams = () => {
  if (!isTelegramWebApp()) {
    return {
      bgColor: '#0a0a0f',
      textColor: '#e4e4eb',
      buttonColor: '#00ff88',
      buttonTextColor: '#000000',
      secondaryBgColor: '#12121a',
      headerBgColor: '#0a0a0f',
      accentTextColor: '#00ff88',
      sectionBgColor: '#1a1a24',
      sectionHeaderTextColor: '#6b6b7b',
      subtitleTextColor: '#6b6b7b',
      destructiveTextColor: '#ff3366',
    }
  }
  
  return WebApp.themeParams
}

// Share helpers (PRD: viral loop)
export const share = (text: string, url?: string) => {
  try {
    if (isTelegramWebApp()) {
      WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(url || '')}&text=${encodeURIComponent(text)}`)
    } else if (navigator.share) {
      navigator.share({ text, url })
    }
  } catch (error) {
    console.error('[Telegram] Share failed:', error)
  }
}

// Close app helper
export const closeApp = () => {
  if (isTelegramWebApp()) {
    WebApp.close()
  } else {
    window.close()
  }
}

// Back button helpers
export const backButton = {
  show: () => {
    if (isTelegramWebApp()) {
      WebApp.BackButton.show()
    }
  },
  hide: () => {
    if (isTelegramWebApp()) {
      WebApp.BackButton.hide()
    }
  },
  onClick: (callback: () => void) => {
    if (isTelegramWebApp()) {
      WebApp.BackButton.onClick(callback)
    }
  },
  offClick: (callback: () => void) => {
    if (isTelegramWebApp()) {
      WebApp.BackButton.offClick(callback)
    }
  },
}

// Main button helpers
export const mainButton = {
  show: (text: string, onClick?: () => void) => {
    if (isTelegramWebApp()) {
      WebApp.MainButton.setText(text)
      if (onClick) {
        WebApp.MainButton.onClick(onClick)
      }
      WebApp.MainButton.show()
    }
  },
  hide: () => {
    if (isTelegramWebApp()) {
      WebApp.MainButton.hide()
    }
  },
  setLoading: (loading: boolean) => {
    if (isTelegramWebApp()) {
      if (loading) {
        WebApp.MainButton.showProgress()
      } else {
        WebApp.MainButton.hideProgress()
      }
    }
  },
}

