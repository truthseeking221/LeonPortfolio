import { describe, it, expect } from 'vitest';
import {
  createAppContext,
  transitionApp,
  canTransition as canTransitionApp,
  canTrade,
  isDegraded,
  needsSync,
  isReady,
  isBackground,
  isBooting,
} from './app.js';
import { AppState, AppEvent } from './types.js';

describe('App Lifecycle State Machine', () => {
  describe('createAppContext', () => {
    it('should create context in BOOT state', () => {
      const ctx = createAppContext();
      expect(ctx.state).toBe(AppState.BOOT);
      expect(ctx.lastSyncAt).toBeNull();
      expect(ctx.isOnline).toBe(true);
    });
  });

  describe('BOOT state transitions', () => {
    it('should transition to READY on INIT_COMPLETE', () => {
      const ctx = createAppContext();
      const result = transitionApp(ctx, {
        event: AppEvent.INIT_COMPLETE,
        now: Date.now(),
      });
      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(AppState.READY);
    });

    it('should transition to OFFLINE_DEGRADED on NETWORK_LOST', () => {
      const ctx = createAppContext();
      const result = transitionApp(ctx, {
        event: AppEvent.NETWORK_LOST,
        now: Date.now(),
      });
      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(AppState.OFFLINE_DEGRADED);
      expect(result.context.isOnline).toBe(false);
    });

    it('should transition to MAINTENANCE on MAINTENANCE_START', () => {
      const ctx = createAppContext();
      const result = transitionApp(ctx, {
        event: AppEvent.MAINTENANCE_START,
        now: Date.now(),
      });
      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(AppState.MAINTENANCE);
    });

    it('should not transition on invalid event', () => {
      const ctx = createAppContext();
      const result = transitionApp(ctx, {
        event: AppEvent.GO_BACKGROUND,
        now: Date.now(),
      });
      expect(result.changed).toBe(false);
      expect(result.context.state).toBe(AppState.BOOT);
    });
  });

  describe('READY state transitions', () => {
    it('should transition to BACKGROUND on GO_BACKGROUND', () => {
      let ctx = createAppContext();
      ctx = transitionApp(ctx, { event: AppEvent.INIT_COMPLETE, now: Date.now() }).context;

      const result = transitionApp(ctx, {
        event: AppEvent.GO_BACKGROUND,
        now: Date.now(),
      });
      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(AppState.BACKGROUND);
    });

    it('should transition to OFFLINE_DEGRADED on NETWORK_LOST', () => {
      let ctx = createAppContext();
      ctx = transitionApp(ctx, { event: AppEvent.INIT_COMPLETE, now: Date.now() }).context;

      const result = transitionApp(ctx, {
        event: AppEvent.NETWORK_LOST,
        now: Date.now(),
      });
      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(AppState.OFFLINE_DEGRADED);
    });
  });

  describe('BACKGROUND state transitions', () => {
    it('should transition to RESUME_SYNC on RESUME', () => {
      let ctx = createAppContext();
      ctx = transitionApp(ctx, { event: AppEvent.INIT_COMPLETE, now: Date.now() }).context;
      ctx = transitionApp(ctx, { event: AppEvent.GO_BACKGROUND, now: Date.now() }).context;

      const result = transitionApp(ctx, {
        event: AppEvent.RESUME,
        now: Date.now(),
      });
      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(AppState.RESUME_SYNC);
    });
  });

  describe('RESUME_SYNC state transitions', () => {
    it('should transition to READY on SYNC_COMPLETE and update lastSyncAt', () => {
      let ctx = createAppContext();
      ctx = transitionApp(ctx, { event: AppEvent.INIT_COMPLETE, now: Date.now() }).context;
      ctx = transitionApp(ctx, { event: AppEvent.GO_BACKGROUND, now: Date.now() }).context;
      ctx = transitionApp(ctx, { event: AppEvent.RESUME, now: Date.now() }).context;

      const syncTime = Date.now();
      const result = transitionApp(ctx, {
        event: AppEvent.SYNC_COMPLETE,
        now: syncTime,
      });
      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(AppState.READY);
      expect(result.context.lastSyncAt).toBe(syncTime);
    });
  });

  describe('OFFLINE_DEGRADED state transitions', () => {
    it('should transition to RESUME_SYNC on NETWORK_RESTORED', () => {
      let ctx = createAppContext();
      ctx = transitionApp(ctx, { event: AppEvent.NETWORK_LOST, now: Date.now() }).context;

      const result = transitionApp(ctx, {
        event: AppEvent.NETWORK_RESTORED,
        now: Date.now(),
      });
      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(AppState.RESUME_SYNC);
      expect(result.context.isOnline).toBe(true);
    });
  });

  describe('MAINTENANCE state transitions', () => {
    it('should transition to RESUME_SYNC on MAINTENANCE_END', () => {
      let ctx = createAppContext();
      ctx = transitionApp(ctx, { event: AppEvent.MAINTENANCE_START, now: Date.now() }).context;

      const result = transitionApp(ctx, {
        event: AppEvent.MAINTENANCE_END,
        now: Date.now(),
      });
      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(AppState.RESUME_SYNC);
    });
  });

  describe('canTransitionApp', () => {
    it('should return true for valid transitions', () => {
      expect(canTransitionApp(AppState.BOOT, AppEvent.INIT_COMPLETE)).toBe(true);
      expect(canTransitionApp(AppState.READY, AppEvent.GO_BACKGROUND)).toBe(true);
    });

    it('should return false for invalid transitions', () => {
      expect(canTransitionApp(AppState.BOOT, AppEvent.GO_BACKGROUND)).toBe(false);
      expect(canTransitionApp(AppState.READY, AppEvent.INIT_COMPLETE)).toBe(false);
    });
  });

  describe('Query functions', () => {
    it('canTrade should return true only when READY and online', () => {
      const bootCtx = createAppContext();
      expect(canTrade(bootCtx)).toBe(false);

      const readyCtx = transitionApp(bootCtx, {
        event: AppEvent.INIT_COMPLETE,
        now: Date.now(),
      }).context;
      expect(canTrade(readyCtx)).toBe(true);

      const offlineCtx = transitionApp(readyCtx, {
        event: AppEvent.NETWORK_LOST,
        now: Date.now(),
      }).context;
      expect(canTrade(offlineCtx)).toBe(false);
    });

    it('isDegraded should return true for degraded states', () => {
      const bootCtx = createAppContext();
      expect(isDegraded(bootCtx)).toBe(false);

      const offlineCtx = transitionApp(bootCtx, {
        event: AppEvent.NETWORK_LOST,
        now: Date.now(),
      }).context;
      expect(isDegraded(offlineCtx)).toBe(true);

      const maintenanceCtx = transitionApp(bootCtx, {
        event: AppEvent.MAINTENANCE_START,
        now: Date.now(),
      }).context;
      expect(isDegraded(maintenanceCtx)).toBe(true);
    });

    it('needsSync should return true only in RESUME_SYNC', () => {
      let ctx = createAppContext();
      expect(needsSync(ctx)).toBe(false);

      ctx = transitionApp(ctx, { event: AppEvent.INIT_COMPLETE, now: Date.now() }).context;
      ctx = transitionApp(ctx, { event: AppEvent.GO_BACKGROUND, now: Date.now() }).context;
      ctx = transitionApp(ctx, { event: AppEvent.RESUME, now: Date.now() }).context;
      expect(needsSync(ctx)).toBe(true);
    });

    it('isReady should return true only in READY state', () => {
      const bootCtx = createAppContext();
      expect(isReady(bootCtx)).toBe(false);

      const readyCtx = transitionApp(bootCtx, {
        event: AppEvent.INIT_COMPLETE,
        now: Date.now(),
      }).context;
      expect(isReady(readyCtx)).toBe(true);
    });

    it('isBackground should return true only in BACKGROUND state', () => {
      let ctx = createAppContext();
      expect(isBackground(ctx)).toBe(false);

      ctx = transitionApp(ctx, { event: AppEvent.INIT_COMPLETE, now: Date.now() }).context;
      ctx = transitionApp(ctx, { event: AppEvent.GO_BACKGROUND, now: Date.now() }).context;
      expect(isBackground(ctx)).toBe(true);
    });

    it('isBooting should return true only in BOOT state', () => {
      const bootCtx = createAppContext();
      expect(isBooting(bootCtx)).toBe(true);

      const readyCtx = transitionApp(bootCtx, {
        event: AppEvent.INIT_COMPLETE,
        now: Date.now(),
      }).context;
      expect(isBooting(readyCtx)).toBe(false);
    });
  });

  describe('Full lifecycle', () => {
    it('should handle complete app lifecycle: BOOT → READY → BACKGROUND → RESUME_SYNC → READY', () => {
      let ctx = createAppContext();
      expect(ctx.state).toBe(AppState.BOOT);

      // Boot complete
      ctx = transitionApp(ctx, { event: AppEvent.INIT_COMPLETE, now: 1000 }).context;
      expect(ctx.state).toBe(AppState.READY);

      // Go to background
      ctx = transitionApp(ctx, { event: AppEvent.GO_BACKGROUND, now: 2000 }).context;
      expect(ctx.state).toBe(AppState.BACKGROUND);

      // Resume
      ctx = transitionApp(ctx, { event: AppEvent.RESUME, now: 3000 }).context;
      expect(ctx.state).toBe(AppState.RESUME_SYNC);

      // Sync complete
      ctx = transitionApp(ctx, { event: AppEvent.SYNC_COMPLETE, now: 4000 }).context;
      expect(ctx.state).toBe(AppState.READY);
      expect(ctx.lastSyncAt).toBe(4000);
    });

    it('should handle network loss and recovery', () => {
      let ctx = createAppContext();
      ctx = transitionApp(ctx, { event: AppEvent.INIT_COMPLETE, now: 1000 }).context;
      expect(ctx.isOnline).toBe(true);

      // Network lost
      ctx = transitionApp(ctx, { event: AppEvent.NETWORK_LOST, now: 2000 }).context;
      expect(ctx.state).toBe(AppState.OFFLINE_DEGRADED);
      expect(ctx.isOnline).toBe(false);

      // Network restored
      ctx = transitionApp(ctx, { event: AppEvent.NETWORK_RESTORED, now: 3000 }).context;
      expect(ctx.state).toBe(AppState.RESUME_SYNC);
      expect(ctx.isOnline).toBe(true);

      // Sync complete
      ctx = transitionApp(ctx, { event: AppEvent.SYNC_COMPLETE, now: 4000 }).context;
      expect(ctx.state).toBe(AppState.READY);
    });
  });
});

