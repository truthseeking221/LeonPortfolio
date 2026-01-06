import { describe, it, expect } from 'vitest';
import {
  TelemetryEvent,
  EventSamplingRate,
  shouldSample,
  createEventPayload,
} from './telemetry.js';

describe('Telemetry Module', () => {
  describe('TelemetryEvent enum', () => {
    it('should have app lifecycle events', () => {
      expect(TelemetryEvent.APP_BOOT).toBe('app_boot');
      expect(TelemetryEvent.APP_READY).toBe('app_ready');
      expect(TelemetryEvent.APP_BACKGROUND).toBe('app_background');
      expect(TelemetryEvent.APP_RESUME).toBe('app_resume');
      expect(TelemetryEvent.APP_ERROR).toBe('app_error');
    });

    it('should have auth events', () => {
      expect(TelemetryEvent.AUTH_START).toBe('auth_start');
      expect(TelemetryEvent.AUTH_SUCCESS).toBe('auth_success');
      expect(TelemetryEvent.AUTH_FAILURE).toBe('auth_failure');
    });

    it('should have wallet events', () => {
      expect(TelemetryEvent.WALLET_CONNECT_START).toBe('wallet_connect_start');
      expect(TelemetryEvent.WALLET_CONNECT_SUCCESS).toBe('wallet_connect_success');
      expect(TelemetryEvent.WALLET_CONNECT_FAILURE).toBe('wallet_connect_failure');
      expect(TelemetryEvent.WALLET_DISCONNECT).toBe('wallet_disconnect');
    });

    it('should have deck events', () => {
      expect(TelemetryEvent.DECK_CARD_VIEWED).toBe('deck_card_viewed');
      expect(TelemetryEvent.DECK_CARD_SWIPED).toBe('deck_card_swiped');
      expect(TelemetryEvent.DECK_BATCH_LOADED).toBe('deck_batch_loaded');
    });

    it('should have trade events', () => {
      expect(TelemetryEvent.HOLD_ARMED).toBe('hold_armed');
      expect(TelemetryEvent.HOLD_CANCELED).toBe('hold_canceled');
      expect(TelemetryEvent.TRADE_COMMIT_START).toBe('trade_commit_start');
      expect(TelemetryEvent.TRADE_COMMIT_SUCCESS).toBe('trade_commit_success');
      expect(TelemetryEvent.TRADE_COMMIT_FAILURE).toBe('trade_commit_failure');
      expect(TelemetryEvent.TRADE_STATUS_UPDATE).toBe('trade_status_update');
      expect(TelemetryEvent.TRADE_CONFIRMED).toBe('trade_confirmed');
    });

    it('should have sell events', () => {
      expect(TelemetryEvent.SELL_ALL_START).toBe('sell_all_start');
      expect(TelemetryEvent.SELL_ALL_SUCCESS).toBe('sell_all_success');
      expect(TelemetryEvent.SELL_ALL_FAILURE).toBe('sell_all_failure');
    });

    it('should have safety events', () => {
      expect(TelemetryEvent.TOKEN_REPORTED).toBe('token_reported');
      expect(TelemetryEvent.ACCIDENTAL_BUY_REPORT).toBe('accidental_buy_report');
      expect(TelemetryEvent.RISK_SIGNAL_SHOWN).toBe('risk_signal_shown');
    });

    it('should have performance events', () => {
      expect(TelemetryEvent.FRAME_DROP).toBe('frame_drop');
      expect(TelemetryEvent.MEDIA_LOAD_FAILURE).toBe('media_load_failure');
    });
  });

  describe('EventSamplingRate', () => {
    it('should have 100% sample rate for critical events', () => {
      expect(EventSamplingRate[TelemetryEvent.TRADE_COMMIT_START]).toBe(1);
      expect(EventSamplingRate[TelemetryEvent.TRADE_COMMIT_SUCCESS]).toBe(1);
      expect(EventSamplingRate[TelemetryEvent.TRADE_COMMIT_FAILURE]).toBe(1);
      expect(EventSamplingRate[TelemetryEvent.TRADE_CONFIRMED]).toBe(1);
    });

    it('should have 100% sample rate for deck events', () => {
      expect(EventSamplingRate[TelemetryEvent.DECK_CARD_VIEWED]).toBe(1);
    });

    it('should have reduced sample rate for high-frequency events', () => {
      expect(EventSamplingRate[TelemetryEvent.FRAME_DROP]).toBe(0.1);
    });

    it('should have sample rate defined for all events', () => {
      for (const event of Object.values(TelemetryEvent)) {
        expect(EventSamplingRate[event]).toBeDefined();
        expect(EventSamplingRate[event]).toBeGreaterThan(0);
        expect(EventSamplingRate[event]).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('shouldSample', () => {
    it('should always return true for 100% sample rate events', () => {
      // Run multiple times to ensure consistency
      for (let i = 0; i < 10; i++) {
        expect(shouldSample(TelemetryEvent.TRADE_COMMIT_START)).toBe(true);
        expect(shouldSample(TelemetryEvent.APP_BOOT)).toBe(true);
      }
    });

    it('should sometimes return false for low sample rate events', () => {
      // FRAME_DROP has 10% sample rate
      // Run many times and expect some false values
      let falseCount = 0;
      for (let i = 0; i < 100; i++) {
        if (!shouldSample(TelemetryEvent.FRAME_DROP)) {
          falseCount++;
        }
      }
      // With 10% sample rate, we expect ~90 false values
      // Allow some variance: expect at least 50 false values
      expect(falseCount).toBeGreaterThan(50);
    });
  });

  describe('createEventPayload', () => {
    it('should create type-safe event payload for app_boot', () => {
      const payload = createEventPayload(TelemetryEvent.APP_BOOT, {
        boot_source: 'cold',
      });

      expect(payload.event).toBe('app_boot');
      expect(payload.properties.boot_source).toBe('cold');
    });

    it('should create type-safe event payload for trade events', () => {
      const payload = createEventPayload(TelemetryEvent.TRADE_COMMIT_START, {
        gesture_id: 'gesture-123',
        token_id: 'token-456',
        side: 'BUY',
        amount_base: '1000000000',
      });

      expect(payload.event).toBe('trade_commit_start');
      expect(payload.properties.gesture_id).toBe('gesture-123');
      expect(payload.properties.side).toBe('BUY');
    });

    it('should create type-safe event payload for hold events', () => {
      const armedPayload = createEventPayload(TelemetryEvent.HOLD_ARMED, {
        token_id: 'token-123',
        dwell_time_ms: 350,
      });

      expect(armedPayload.event).toBe('hold_armed');
      expect(armedPayload.properties.dwell_time_ms).toBe(350);

      const canceledPayload = createEventPayload(TelemetryEvent.HOLD_CANCELED, {
        token_id: 'token-123',
        cancel_method: 'swipe_up',
      });

      expect(canceledPayload.event).toBe('hold_canceled');
      expect(canceledPayload.properties.cancel_method).toBe('swipe_up');
    });

    it('should create type-safe event payload for error events', () => {
      const payload = createEventPayload(TelemetryEvent.ERROR_DISPLAYED, {
        error_code: 'INSUFFICIENT_BALANCE',
        screen: 'deck',
      });

      expect(payload.event).toBe('error_displayed');
      expect(payload.properties.error_code).toBe('INSUFFICIENT_BALANCE');
    });

    it('should create type-safe event payload for performance events', () => {
      const payload = createEventPayload(TelemetryEvent.FRAME_DROP, {
        screen: 'deck',
        dropped_frames: 5,
        duration_ms: 100,
      });

      expect(payload.event).toBe('frame_drop');
      expect(payload.properties.dropped_frames).toBe(5);
    });
  });

  describe('Event naming conventions', () => {
    it('all events should use snake_case', () => {
      for (const event of Object.values(TelemetryEvent)) {
        expect(event).toMatch(/^[a-z]+(_[a-z]+)*$/);
      }
    });

    it('event keys should use SCREAMING_SNAKE_CASE', () => {
      const keys = Object.keys(TelemetryEvent);
      for (const key of keys) {
        expect(key).toMatch(/^[A-Z]+(_[A-Z]+)*$/);
      }
    });
  });
});

