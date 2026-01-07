/**
 * DOPE - Main Application
 * Implements PRD App Lifecycle State Machine (§4.1)
 * 
 * Boot flow: BOOT → READY
 * Main loop: Deck → Hold-to-Buy → Activity → Sell
 */

import { useEffect, useRef, useCallback, useState } from 'react'
import { motion, useAnimation, useMotionValue } from 'framer-motion'
import { 
  useAppStore, 
  selectIsBooting, 
  selectIsBuyDisabled,
  selectIsSellDisabled,
} from '@/stores/app-store'
import { 
  useGameStore, 
  selectCurrentToken, 
  selectNextToken,
  selectIsHolding,
  selectHasPosition,
  selectDeckLoading,
  type BuyLevel 
} from '@/stores/game-store'
import { useWalletStore, selectIsConnected, selectCanTrade } from '@/stores/wallet-store'
import { useTradeStore } from '@/stores/trade-store'
import { 
  BootScreen, 
  TopHUD, 
  GasWarningBanner,
  KillSwitchBanner,
  Card, 
  LevelRing, 
  CancelOverlay,
  SendingOverlay,
  HoldingOverlay,
  WalletOverlay,
  ActivityOverlay,
  SettingsOverlay,
  RiskSheet,
  ErrorBoundary,
  EmptyDeckState,
  InsufficientBalanceOverlay,
  ConsentModal,
  NetworkDisconnectOverlay,
} from '@/components'
import { initTelegramWebApp, haptic } from '@/lib/telegram'
import { GESTURE_CONFIG, UX_TIMING, API_ENDPOINTS, parseMaintenanceConfig, type RemoteConfig } from '@/lib/config'

type SendingStatus = 'SENDING' | 'SENT' | 'OPTIMISTIC' | 'CONFIRMED' | 'FAILED' | null

export function App() {
  // === Stores ===
  const isBooting = useAppStore(selectIsBooting)
  const startBoot = useAppStore((s) => s.startBoot)
  const completeBoot = useAppStore((s) => s.completeBoot)
  const setBootStatus = useAppStore((s) => s.setBootStatus)
  const setMaintenance = useAppStore((s) => s.setMaintenance)
  const safeMode = useAppStore((s) => s.safeMode)
  const isBuyDisabled = useAppStore(selectIsBuyDisabled)
  const isSellDisabled = useAppStore(selectIsSellDisabled)
  const hasConsent = useAppStore((s) => s.hasConsent)
  const setHasConsent = useAppStore((s) => s.setHasConsent)
  const connectionQuality = useAppStore((s) => s.connectionQuality)
  const setIsOnline = useAppStore((s) => s.setIsOnline)

  const interactionState = useGameStore((s) => s.interactionState)
  const holdDuration = useGameStore((s) => s.holdDuration)
  const currentLevel = useGameStore((s) => s.currentLevel)
  const currentToken = useGameStore(selectCurrentToken)
  const nextToken = useGameStore(selectNextToken)
  const isHolding = useGameStore(selectIsHolding)
  const hasPosition = useGameStore(selectHasPosition)
  const position = useGameStore((s) => s.position)
  const startHold = useGameStore((s) => s.startHold)
  const updateHold = useGameStore((s) => s.updateHold)
  const releaseHold = useGameStore((s) => s.releaseHold)
  const setDragY = useGameStore((s) => s.setDragY)
  const resetToDiscovering = useGameStore((s) => s.resetToDiscovering)
  const nextCard = useGameStore((s) => s.nextCard)
  const prevCard = useGameStore((s) => s.prevCard)
  const setPosition = useGameStore((s) => s.setPosition)
  const gestureId = useGameStore((s) => s.gestureId)
  const loadDeck = useGameStore((s) => s.loadDeck)
  const refreshDeck = useGameStore((s) => s.refreshDeck)
  const deckLoading = useGameStore(selectDeckLoading)

  const spendableBalance = useWalletStore((s) => s.spendableBalance)
  const isConnected = useWalletStore(selectIsConnected)
  const canTrade = useWalletStore(selectCanTrade)
  const connect = useWalletStore((s) => s.connect)
  const deductBalance = useWalletStore((s) => s.deductBalance)
  const addBalance = useWalletStore((s) => s.addBalance)

  const createTrade = useTradeStore((s) => s.createTrade)
  const updateTradeStatus = useTradeStore((s) => s.updateTradeStatus)

  // === Local State ===
  const [sendingStatus, setSendingStatus] = useState<SendingStatus>(null)
  const [isSelling, setIsSelling] = useState(false)
  
  // Overlays
  const [isWalletOpen, setIsWalletOpen] = useState(false)
  const [isActivityOpen, setIsActivityOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isRiskOpen, setIsRiskOpen] = useState(false)
  const [isInsufficientBalanceOpen, setIsInsufficientBalanceOpen] = useState(false)
  const [insufficientBalanceData, setInsufficientBalanceData] = useState({ required: 0, available: 0 })
  const [isNetworkDisconnectOpen, setIsNetworkDisconnectOpen] = useState(false)

  const isMenuOpen = isWalletOpen || isActivityOpen || isSettingsOpen || isRiskOpen

  // === Refs ===
  const startPos = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const holdInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const holdStartTime = useRef<number>(0)

  // === Motion Values ===
  const y = useMotionValue(0)
  const controls = useAnimation()
  const shakeX = useMotionValue(0)
  const shakeY = useMotionValue(0)

  // === Boot Flow ===
  useEffect(() => {
    const boot = async () => {
      startBoot()
      
      // Initialize Telegram WebApp
      setBootStatus('initializing')
      initTelegramWebApp()
      
      // Load remote config (includes kill switch state)
      setBootStatus('loading_config')
      try {
        const response = await fetch(API_ENDPOINTS.config)
        if (response.ok) {
          const config = await response.json() as RemoteConfig
          // Parse and set maintenance/kill switch config
          setMaintenance(parseMaintenanceConfig(config.maintenance))
          console.log('[Boot] Config loaded:', config)
        }
      } catch (err) {
        console.warn('[Boot] Failed to load remote config, using defaults:', err)
      }
      
      // Simulate session restore
      setBootStatus('restoring_session')
      await new Promise((r) => setTimeout(r, 300))
      
      // Auto-connect wallet for demo
      setBootStatus('warming_providers')
      await connect()
      
      // Load deck from API
      setBootStatus('loading_deck')
      await loadDeck()
      
      // Ensure minimum boot time for UX
      const elapsed = Date.now() - (useAppStore.getState().bootStartTime || 0)
      if (elapsed < UX_TIMING.BOOT_MIN_MS) {
        await new Promise((r) => setTimeout(r, UX_TIMING.BOOT_MIN_MS - elapsed))
      }
      
      completeBoot()
    }

    boot()
  }, [])

  // === Network Status Listener ===
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setIsNetworkDisconnectOpen(false)
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      setIsNetworkDisconnectOpen(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setIsOnline])

  // === Gesture Handlers ===
  const triggerShake = useCallback((intensity: number) => {
    if (safeMode) return
    shakeX.set((Math.random() - 0.5) * intensity)
    shakeY.set((Math.random() - 0.5) * intensity)
  }, [safeMode, shakeX, shakeY])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (interactionState !== 'DISCOVERING' || isMenuOpen || hasPosition) return

    startPos.current = { x: e.clientX, y: e.clientY }
    isDragging.current = false

    // Start long-press timer
    longPressTimer.current = setTimeout(() => {
      if (!isDragging.current) {
        // Check if can trade
        if (!isConnected) {
          haptic.notification('warning')
          setIsWalletOpen(true)
          return
        }

        // T-0010b: Check if buy is disabled via kill switch
        if (isBuyDisabled) {
          haptic.notification('error')
          console.log('[KillSwitch] Buy disabled - blocking hold gesture')
          return
        }

        // Start hold
        startHold()
        haptic.impact('light')
        holdStartTime.current = Date.now()

        // Start hold duration tracking
        holdInterval.current = setInterval(() => {
          const elapsed = Date.now() - holdStartTime.current
          const levelChanged = updateHold(elapsed)
          
          if (levelChanged) {
            haptic.impact('medium')
          }
          
          // Shake intensity increases with time
          if (elapsed > 200) {
            triggerShake(Math.min(elapsed / 150, 8))
          }
        }, 16)
      }
    }, GESTURE_CONFIG.LONG_PRESS_DELAY)
  }, [interactionState, isMenuOpen, hasPosition, isConnected, isBuyDisabled, startHold, updateHold, triggerShake])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const distY = e.clientY - startPos.current.y
    const absDist = Math.hypot(
      e.clientX - startPos.current.x,
      e.clientY - startPos.current.y
    )

    // Disambiguation: check if dragging
    if (interactionState === 'DISCOVERING' && absDist > GESTURE_CONFIG.DRAG_TOLERANCE) {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
        longPressTimer.current = null
      }
      isDragging.current = true
      y.set(distY)
    }

    // Track cancel zone during hold
    if (isHolding) {
      setDragY(distY)
    }
  }, [interactionState, isHolding, setDragY, y])

  const handlePointerUp = useCallback(async (e: React.PointerEvent) => {
    // Clear timers
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    if (holdInterval.current) {
      clearInterval(holdInterval.current)
      holdInterval.current = null
    }

    // Reset shake
    shakeX.set(0)
    shakeY.set(0)

    const distY = e.clientY - startPos.current.y

    // Handle swipe (deck navigation)
    if (interactionState === 'DISCOVERING' && isDragging.current) {
      if (Math.abs(distY) > GESTURE_CONFIG.SWIPE_THRESHOLD) {
        haptic.impact('medium')
        const dir = distY > 0 ? 1 : -1
        await controls.start({ y: dir * window.innerHeight, transition: { duration: 0.2 } })
        if (dir > 0) prevCard()
        else nextCard()
        controls.set({ y: -dir * window.innerHeight })
        controls.start({ y: 0 })
      } else {
        controls.start({ y: 0 })
      }
      y.set(0)
      isDragging.current = false
      return
    }

    // Handle hold release
    if (isHolding) {
      const result = releaseHold()
      
      if (result) {
        // Execute buy
        await executeBuy(result.level, result.amount)
      } else {
        // Canceled
        haptic.notification('warning')
      }
    }

    isDragging.current = false
  }, [interactionState, isHolding, releaseHold, controls, y, shakeX, shakeY, nextCard, prevCard])

  // === Deck Refresh ===
  const handleDeckRefresh = useCallback(async () => {
    await refreshDeck()
  }, [refreshDeck])

  // === Trade Execution ===
  const executeBuy = async (level: BuyLevel, amount: number) => {
    if (!level || !gestureId || !currentToken) return

    // Check spendable balance - show overlay instead of silent fail
    if (!canTrade || spendableBalance < amount) {
      haptic.notification('error')
      setInsufficientBalanceData({ required: amount, available: spendableBalance })
      setIsInsufficientBalanceOpen(true)
      resetToDiscovering()
      return
    }

    // Create trade record
    const trade = createTrade({
      gestureId,
      tokenId: currentToken.id,
      symbol: currentToken.symbol,
      side: 'BUY',
      amount,
      amountUnit: 'BASE',
      status: 'CREATED',
      presetLevel: level,
    })

    // SENDING state
    setSendingStatus('SENDING')
    
    // Simulate wallet signing
    await new Promise((r) => setTimeout(r, 800))
    
    // SENT state (optimistic)
    setSendingStatus('SENT')
    haptic.notification('success')
    deductBalance(amount)
    updateTradeStatus(trade.id, 'BROADCASTED')

    // Simulate chain confirmation
    await new Promise((r) => setTimeout(r, 1500))

    // CONFIRMED
    setSendingStatus('CONFIRMED')
    updateTradeStatus(trade.id, 'CONFIRMED', {
      chainTxId: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    })

    // Transition to holding position
    await new Promise((r) => setTimeout(r, 500))
    setSendingStatus(null)

    // Create mock position
    setPosition({
      tokenId: currentToken.id,
      symbol: currentToken.symbol,
      balance: amount * 1000, // Mock token amount
      costBasis: amount,
      entryPrice: currentToken.price,
      currentValue: amount,
      unrealizedPnl: 0,
      unrealizedPnlPercent: 0,
      lastUpdate: Date.now(),
    })

    resetToDiscovering()
  }

  // === Panic Sell ===
  const handlePanicSell = async () => {
    if (!position || isSelling) return

    // T-0010b: Check if sell is disabled via kill switch
    if (isSellDisabled) {
      haptic.notification('error')
      console.log('[KillSwitch] Sell disabled - blocking panic sell')
      return
    }

    setIsSelling(true)
    haptic.impact('heavy')

    // Create sell trade
    const trade = createTrade({
      gestureId: `sell_${Date.now()}`,
      tokenId: position.tokenId,
      symbol: position.symbol,
      side: 'SELL',
      amount: position.balance,
      amountUnit: 'TOKEN',
      status: 'CREATED',
    })

    // Simulate sell
    await new Promise((r) => setTimeout(r, 1000))
    updateTradeStatus(trade.id, 'CONFIRMED')
    
    // Add proceeds
    const proceeds = position.currentValue
    addBalance(proceeds)
    
    haptic.notification('success')
    setPosition(null)
    setIsSelling(false)
  }

  // === PnL Simulation ===
  useEffect(() => {
    if (!hasPosition || !position) return

    const interval = setInterval(() => {
      const change = (Math.random() - 0.45) * 0.5
      const newValue = position.currentValue * (1 + change / 100)
      const newPnl = newValue - position.costBasis
      const newPnlPercent = (newPnl / position.costBasis) * 100

      setPosition({
        ...position,
        currentValue: newValue,
        unrealizedPnl: newPnl,
        unrealizedPnlPercent: newPnlPercent,
        lastUpdate: Date.now(),
      })
    }, 500)

    return () => clearInterval(interval)
  }, [hasPosition, position, setPosition])

  // === Close All Menus ===
  const closeAllMenus = () => {
    setIsWalletOpen(false)
    setIsActivityOpen(false)
    setIsSettingsOpen(false)
    setIsRiskOpen(false)
  }

  // === Consent Handler ===
  const handleConsentAccept = useCallback((version: string) => {
    setHasConsent(true, version)
    // Persist to local storage
    localStorage.setItem('dope_consent', JSON.stringify({ version, timestamp: Date.now() }))
  }, [setHasConsent])

  // === Check stored consent on mount ===
  useEffect(() => {
    const stored = localStorage.getItem('dope_consent')
    if (stored) {
      try {
        const { version } = JSON.parse(stored)
        setHasConsent(true, version)
      } catch {
        // Invalid stored consent
      }
    }
  }, [setHasConsent])

  // === Render ===
  if (isBooting) {
    return <BootScreen />
  }

  const isArming = interactionState === 'HOLD_ARMED' || interactionState === 'HOLD_POSSIBLE'
  const isCanceled = interactionState === 'HOLD_CANCELED'
  const isDeckEmpty = !currentToken

  // Show consent modal if not yet accepted
  if (!hasConsent) {
    return <ConsentModal isOpen={true} onAccept={handleConsentAccept} />
  }

  return (
    <ErrorBoundary>
    <div 
      className="relative w-full h-screen bg-dope-black text-white overflow-hidden select-none touch-none font-sans"
      onContextMenu={(e) => e.preventDefault()}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Top HUD */}
      <TopHUD 
        onOpenWallet={() => setIsWalletOpen(true)} 
        onOpenSettings={() => setIsSettingsOpen(true)} 
      />
      <GasWarningBanner />
      
      {/* Kill Switch Banner (T-0010b) */}
      <KillSwitchBanner />

      {/* Main content area */}
      <motion.div 
        className="relative w-full h-full p-4 pb-24 pt-20"
        style={{ x: shakeX, y: shakeY }}
        animate={{
          scale: (isArming || isMenuOpen) ? 0.95 : 1,
          filter: (isArming || isMenuOpen) ? 'brightness(0.6)' : 'brightness(1)',
          borderRadius: isMenuOpen ? '20px' : '0px',
        }}
        onClick={isMenuOpen ? closeAllMenus : undefined}
      >
        {/* Empty deck state */}
        {isDeckEmpty ? (
          <EmptyDeckState 
            isLoading={deckLoading}
            isOffline={connectionQuality === 'offline'}
            onRefresh={handleDeckRefresh}
          />
        ) : currentToken && (
          <>
            {/* Next card (behind) */}
            {nextToken && (
              <Card 
                token={nextToken} 
                isArming={false}
                isCanceled={false}
                isNext={true} 
              />
            )}

            {/* Current card */}
            <motion.div 
              className="w-full h-full relative"
              style={{ y }}
              animate={controls}
            >
              <Card 
                token={currentToken}
                isArming={isArming}
                isCanceled={isCanceled}
                onOpenRisk={() => setIsRiskOpen(true)}
              />
            </motion.div>
          </>
        )}

        {/* Level Ring */}
        <LevelRing 
          progressMs={holdDuration}
          currentLevel={currentLevel}
          isVisible={isArming}
        />

        {/* Cancel Overlay */}
        <CancelOverlay isVisible={isCanceled} />

        {/* Sending Overlay */}
        <SendingOverlay 
          status={sendingStatus}
          onDismiss={() => setSendingStatus(null)}
        />

        {/* Holding Overlay (PnL) */}
        {hasPosition && position && (
          <HoldingOverlay 
            position={position}
            onPanicSell={handlePanicSell}
            isSelling={isSelling}
          />
        )}
      </motion.div>

      {/* Insufficient Balance Overlay */}
      <InsufficientBalanceOverlay
        isOpen={isInsufficientBalanceOpen}
        requiredAmount={insufficientBalanceData.required}
        availableAmount={insufficientBalanceData.available}
        onClose={() => setIsInsufficientBalanceOpen(false)}
        onDeposit={() => {
          setIsInsufficientBalanceOpen(false)
          setIsWalletOpen(true)
        }}
      />

      {/* Network Disconnect Overlay */}
      <NetworkDisconnectOverlay
        isOpen={isNetworkDisconnectOpen && connectionQuality === 'offline'}
        onRetry={() => {
          // Trigger reconnection attempt
          window.location.reload()
        }}
        onDismiss={() => setIsNetworkDisconnectOpen(false)}
      />

      {/* Overlays */}
      <WalletOverlay 
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        onOpenActivity={() => {
          setIsWalletOpen(false)
          setIsActivityOpen(true)
        }}
      />
      <ActivityOverlay 
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
      />
      <SettingsOverlay 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <RiskSheet 
        isOpen={isRiskOpen}
        onClose={() => setIsRiskOpen(false)}
        token={currentToken ?? null}
      />
    </div>
    </ErrorBoundary>
  )
}

