/**
 * App Lifecycle State Machine
 * 
 * Manages the application's overall lifecycle states:
 * BOOT → READY ↔ BACKGROUND → RESUME_SYNC → READY
 * 
 * Degrade states:
 * - OFFLINE_DEGRADED
 * - MAINTENANCE
 * 
 * Rules:
 * - entering BACKGROUND cancels any active hold
 * - RESUME_SYNC reconciles wallet + pending trades + stream
 */

import {
  type AppContext,
  type AppState,
  type AppEvent,
  type Timestamp,
  type TransitionResult,
  AppState as States,
  AppEvent as Events,
} from './types.js';

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create initial app context in BOOT state
 */
export function createAppContext(): AppContext {
  return {
    state: States.BOOT,
    lastSyncAt: null,
    isOnline: true,
  };
}

// ============================================================================
// State Transition Logic
// ============================================================================

/**
 * Valid transitions for each state
 */
const VALID_TRANSITIONS: Record<AppState, readonly AppEvent[]> = {
  [States.BOOT]: [Events.INIT_COMPLETE, Events.NETWORK_LOST, Events.MAINTENANCE_START],
  [States.READY]: [Events.GO_BACKGROUND, Events.NETWORK_LOST, Events.MAINTENANCE_START],
  [States.BACKGROUND]: [Events.RESUME, Events.NETWORK_LOST, Events.MAINTENANCE_START],
  [States.RESUME_SYNC]: [Events.SYNC_COMPLETE, Events.NETWORK_LOST, Events.MAINTENANCE_START],
  [States.OFFLINE_DEGRADED]: [Events.NETWORK_RESTORED, Events.MAINTENANCE_START],
  [States.MAINTENANCE]: [Events.MAINTENANCE_END],
} as const;

/**
 * Check if a transition is valid from current state
 */
export function canTransition(state: AppState, event: AppEvent): boolean {
  const validEvents = VALID_TRANSITIONS[state];
  return validEvents.includes(event);
}

/**
 * Get the next state for a given state and event
 * Returns null if transition is invalid
 */
function getNextState(state: AppState, event: AppEvent): AppState | null {
  if (!canTransition(state, event)) {
    return null;
  }

  switch (state) {
    case States.BOOT:
      switch (event) {
        case Events.INIT_COMPLETE:
          return States.READY;
        case Events.NETWORK_LOST:
          return States.OFFLINE_DEGRADED;
        case Events.MAINTENANCE_START:
          return States.MAINTENANCE;
        default:
          return null;
      }

    case States.READY:
      switch (event) {
        case Events.GO_BACKGROUND:
          return States.BACKGROUND;
        case Events.NETWORK_LOST:
          return States.OFFLINE_DEGRADED;
        case Events.MAINTENANCE_START:
          return States.MAINTENANCE;
        default:
          return null;
      }

    case States.BACKGROUND:
      switch (event) {
        case Events.RESUME:
          return States.RESUME_SYNC;
        case Events.NETWORK_LOST:
          return States.OFFLINE_DEGRADED;
        case Events.MAINTENANCE_START:
          return States.MAINTENANCE;
        default:
          return null;
      }

    case States.RESUME_SYNC:
      switch (event) {
        case Events.SYNC_COMPLETE:
          return States.READY;
        case Events.NETWORK_LOST:
          return States.OFFLINE_DEGRADED;
        case Events.MAINTENANCE_START:
          return States.MAINTENANCE;
        default:
          return null;
      }

    case States.OFFLINE_DEGRADED:
      switch (event) {
        case Events.NETWORK_RESTORED:
          return States.RESUME_SYNC;
        case Events.MAINTENANCE_START:
          return States.MAINTENANCE;
        default:
          return null;
      }

    case States.MAINTENANCE:
      switch (event) {
        case Events.MAINTENANCE_END:
          return States.RESUME_SYNC;
        default:
          return null;
      }

    default:
      return null;
  }
}

// ============================================================================
// Transition Function
// ============================================================================

export interface AppTransitionInput {
  readonly event: AppEvent;
  readonly now: Timestamp;
}

/**
 * Pure function to transition app state
 * Returns new context with changed flag
 */
export function transitionApp(
  ctx: AppContext,
  input: AppTransitionInput
): TransitionResult<AppContext> {
  const nextState = getNextState(ctx.state, input.event);

  if (nextState === null) {
    // Invalid transition - return unchanged
    return { context: ctx, changed: false };
  }

  // Build new context based on transition
  let newContext: AppContext = {
    ...ctx,
    state: nextState,
  };

  // Apply state-specific side effects
  switch (input.event) {
    case Events.SYNC_COMPLETE:
      newContext = {
        ...newContext,
        lastSyncAt: input.now,
      };
      break;

    case Events.NETWORK_LOST:
      newContext = {
        ...newContext,
        isOnline: false,
      };
      break;

    case Events.NETWORK_RESTORED:
      newContext = {
        ...newContext,
        isOnline: true,
      };
      break;
  }

  return { context: newContext, changed: true };
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Check if app is in a state that allows trading
 */
export function canTrade(ctx: AppContext): boolean {
  return ctx.state === States.READY && ctx.isOnline;
}

/**
 * Check if app is in a degraded state
 */
export function isDegraded(ctx: AppContext): boolean {
  return ctx.state === States.OFFLINE_DEGRADED || ctx.state === States.MAINTENANCE;
}

/**
 * Check if app needs synchronization
 */
export function needsSync(ctx: AppContext): boolean {
  return ctx.state === States.RESUME_SYNC;
}

/**
 * Check if app is ready for user interaction
 */
export function isReady(ctx: AppContext): boolean {
  return ctx.state === States.READY;
}

/**
 * Check if app is in background
 */
export function isBackground(ctx: AppContext): boolean {
  return ctx.state === States.BACKGROUND;
}

/**
 * Check if app is booting
 */
export function isBooting(ctx: AppContext): boolean {
  return ctx.state === States.BOOT;
}

