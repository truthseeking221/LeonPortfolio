import { describe, it, expect } from 'vitest';
import {
  createOrderContext,
  createOrderId,
  transitionOrder,
  canTransition as canTransitionOrder,
  isTerminal,
  canRetry,
  isCancelSafe as isOrderCancelSafe,
  isConfirmed,
  isFailed,
  isUnknown,
  isInProgress,
  isBroadcasted,
  getStatusMessage,
  validateGestureOwnership,
} from './order.js';
import {
  OrderState,
  OrderEvent,
  OrderType,
  FailureReason,
  type GestureId,
  type CardId,
} from './types.js';

// Test helpers
const createGestureIdTest = (id: string) => id as GestureId;
const createCardIdTest = (id: string) => id as CardId;

describe('Order Resolution State Machine', () => {
  describe('createOrderContext', () => {
    it('should create context in NOT_CREATED state', () => {
      const ctx = createOrderContext({
        gestureId: createGestureIdTest('gesture-1'),
        orderType: OrderType.BUY,
        cardId: createCardIdTest('card-1'),
      });

      expect(ctx.state).toBe(OrderState.NOT_CREATED);
      expect(ctx.orderId).toBeNull();
      expect(ctx.gestureId).toBe(createGestureIdTest('gesture-1'));
      expect(ctx.orderType).toBe(OrderType.BUY);
      expect(ctx.cardId).toBe(createCardIdTest('card-1'));
      expect(ctx.createdAt).toBeNull();
      expect(ctx.signedAt).toBeNull();
      expect(ctx.broadcastedAt).toBeNull();
      expect(ctx.resolvedAt).toBeNull();
      expect(ctx.failureReason).toBeNull();
      expect(ctx.retryCount).toBe(0);
      expect(ctx.maxRetries).toBe(3);
    });

    it('should allow custom maxRetries', () => {
      const ctx = createOrderContext({
        gestureId: createGestureIdTest('gesture-1'),
        orderType: OrderType.SELL,
        cardId: createCardIdTest('card-1'),
        maxRetries: 5,
      });

      expect(ctx.maxRetries).toBe(5);
    });
  });

  describe('NOT_CREATED transitions', () => {
    const getNotCreatedCtx = () =>
      createOrderContext({
        gestureId: createGestureIdTest('gesture-1'),
        orderType: OrderType.BUY,
        cardId: createCardIdTest('card-1'),
      });

    it('should transition to CREATED on CREATE', () => {
      const ctx = getNotCreatedCtx();
      const orderId = createOrderId('order-1');
      const result = transitionOrder(ctx, {
        event: OrderEvent.CREATE,
        orderId,
        now: 1000,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(OrderState.CREATED);
      expect(result.context.orderId).toBe(orderId);
      expect(result.context.createdAt).toBe(1000);
    });

    it('should transition to FAILED_DETERMINISTIC on CANCEL', () => {
      const ctx = getNotCreatedCtx();
      const result = transitionOrder(ctx, {
        event: OrderEvent.CANCEL,
        now: 1000,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(OrderState.FAILED_DETERMINISTIC);
      expect(result.context.failureReason).toBe(FailureReason.USER_REJECTED);
      expect(result.context.resolvedAt).toBe(1000);
    });
  });

  describe('CREATED transitions', () => {
    const getCreatedCtx = () => {
      let ctx = createOrderContext({
        gestureId: createGestureIdTest('gesture-1'),
        orderType: OrderType.BUY,
        cardId: createCardIdTest('card-1'),
      });
      ctx = transitionOrder(ctx, {
        event: OrderEvent.CREATE,
        orderId: createOrderId('order-1'),
        now: 1000,
      }).context;
      return ctx;
    };

    it('should transition to SIGNED on SIGN', () => {
      const ctx = getCreatedCtx();
      const result = transitionOrder(ctx, {
        event: OrderEvent.SIGN,
        now: 1100,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(OrderState.SIGNED);
      expect(result.context.signedAt).toBe(1100);
    });

    it('should transition to BROADCASTED on BROADCAST (skip signing)', () => {
      const ctx = getCreatedCtx();
      const result = transitionOrder(ctx, {
        event: OrderEvent.BROADCAST,
        now: 1100,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(OrderState.BROADCASTED);
      expect(result.context.broadcastedAt).toBe(1100);
    });

    it('should transition to FAILED_DETERMINISTIC on FAIL_DETERMINISTIC', () => {
      const ctx = getCreatedCtx();
      const result = transitionOrder(ctx, {
        event: OrderEvent.FAIL_DETERMINISTIC,
        reason: FailureReason.INSUFFICIENT_FUNDS,
        now: 1100,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(OrderState.FAILED_DETERMINISTIC);
      expect(result.context.failureReason).toBe(FailureReason.INSUFFICIENT_FUNDS);
    });

    it('should transition to FAILED_DETERMINISTIC on CANCEL', () => {
      const ctx = getCreatedCtx();
      const result = transitionOrder(ctx, {
        event: OrderEvent.CANCEL,
        now: 1100,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(OrderState.FAILED_DETERMINISTIC);
      expect(result.context.failureReason).toBe(FailureReason.USER_REJECTED);
    });
  });

  describe('SIGNED transitions', () => {
    const getSignedCtx = () => {
      let ctx = createOrderContext({
        gestureId: createGestureIdTest('gesture-1'),
        orderType: OrderType.BUY,
        cardId: createCardIdTest('card-1'),
      });
      ctx = transitionOrder(ctx, {
        event: OrderEvent.CREATE,
        orderId: createOrderId('order-1'),
        now: 1000,
      }).context;
      ctx = transitionOrder(ctx, {
        event: OrderEvent.SIGN,
        now: 1100,
      }).context;
      return ctx;
    };

    it('should transition to BROADCASTED on BROADCAST', () => {
      const ctx = getSignedCtx();
      const result = transitionOrder(ctx, {
        event: OrderEvent.BROADCAST,
        now: 1200,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(OrderState.BROADCASTED);
      expect(result.context.broadcastedAt).toBe(1200);
    });

    it('should allow CANCEL before broadcast', () => {
      const ctx = getSignedCtx();
      expect(isOrderCancelSafe(ctx)).toBe(true);

      const result = transitionOrder(ctx, {
        event: OrderEvent.CANCEL,
        now: 1200,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(OrderState.FAILED_DETERMINISTIC);
    });
  });

  describe('BROADCASTED transitions', () => {
    const getBroadcastedCtx = () => {
      let ctx = createOrderContext({
        gestureId: createGestureIdTest('gesture-1'),
        orderType: OrderType.BUY,
        cardId: createCardIdTest('card-1'),
      });
      ctx = transitionOrder(ctx, {
        event: OrderEvent.CREATE,
        orderId: createOrderId('order-1'),
        now: 1000,
      }).context;
      ctx = transitionOrder(ctx, {
        event: OrderEvent.BROADCAST,
        now: 1100,
      }).context;
      return ctx;
    };

    it('should transition to CONFIRMED on CONFIRM', () => {
      const ctx = getBroadcastedCtx();
      const result = transitionOrder(ctx, {
        event: OrderEvent.CONFIRM,
        now: 1200,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(OrderState.CONFIRMED);
      expect(result.context.resolvedAt).toBe(1200);
    });

    it('should transition to FAILED_DETERMINISTIC on FAIL_DETERMINISTIC', () => {
      const ctx = getBroadcastedCtx();
      const result = transitionOrder(ctx, {
        event: OrderEvent.FAIL_DETERMINISTIC,
        reason: FailureReason.SLIPPAGE_EXCEEDED,
        now: 1200,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(OrderState.FAILED_DETERMINISTIC);
      expect(result.context.failureReason).toBe(FailureReason.SLIPPAGE_EXCEEDED);
    });

    it('should transition to FAILED_TRANSIENT on FAIL_TRANSIENT', () => {
      const ctx = getBroadcastedCtx();
      const result = transitionOrder(ctx, {
        event: OrderEvent.FAIL_TRANSIENT,
        reason: FailureReason.TIMEOUT,
        now: 1200,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(OrderState.FAILED_TRANSIENT);
      expect(result.context.failureReason).toBe(FailureReason.TIMEOUT);
    });

    it('should transition to UNKNOWN on MARK_UNKNOWN', () => {
      const ctx = getBroadcastedCtx();
      const result = transitionOrder(ctx, {
        event: OrderEvent.MARK_UNKNOWN,
        now: 1200,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(OrderState.UNKNOWN);
    });

    it('should not allow CANCEL after broadcast', () => {
      const ctx = getBroadcastedCtx();
      expect(isOrderCancelSafe(ctx)).toBe(false);

      const result = transitionOrder(ctx, {
        event: OrderEvent.CANCEL,
        now: 1200,
      });

      expect(result.changed).toBe(false);
    });
  });

  describe('Terminal states', () => {
    it('CONFIRMED should not allow any transitions', () => {
      let ctx = createOrderContext({
        gestureId: createGestureIdTest('gesture-1'),
        orderType: OrderType.BUY,
        cardId: createCardIdTest('card-1'),
      });
      ctx = transitionOrder(ctx, {
        event: OrderEvent.CREATE,
        orderId: createOrderId('order-1'),
        now: 1000,
      }).context;
      ctx = transitionOrder(ctx, {
        event: OrderEvent.BROADCAST,
        now: 1100,
      }).context;
      ctx = transitionOrder(ctx, {
        event: OrderEvent.CONFIRM,
        now: 1200,
      }).context;

      expect(ctx.state).toBe(OrderState.CONFIRMED);
      expect(isTerminal(ctx)).toBe(true);

      // Try various transitions - none should work
      expect(transitionOrder(ctx, { event: OrderEvent.CREATE, orderId: createOrderId('o2'), now: 1300 }).changed).toBe(false);
      expect(transitionOrder(ctx, { event: OrderEvent.RETRY, now: 1300 }).changed).toBe(false);
      expect(transitionOrder(ctx, { event: OrderEvent.CANCEL, now: 1300 }).changed).toBe(false);
    });

    it('FAILED_DETERMINISTIC should not allow any transitions', () => {
      let ctx = createOrderContext({
        gestureId: createGestureIdTest('gesture-1'),
        orderType: OrderType.BUY,
        cardId: createCardIdTest('card-1'),
      });
      ctx = transitionOrder(ctx, {
        event: OrderEvent.CREATE,
        orderId: createOrderId('order-1'),
        now: 1000,
      }).context;
      ctx = transitionOrder(ctx, {
        event: OrderEvent.FAIL_DETERMINISTIC,
        reason: FailureReason.INSUFFICIENT_FUNDS,
        now: 1100,
      }).context;

      expect(ctx.state).toBe(OrderState.FAILED_DETERMINISTIC);
      expect(isTerminal(ctx)).toBe(true);
      expect(transitionOrder(ctx, { event: OrderEvent.RETRY, now: 1200 }).changed).toBe(false);
    });
  });

  describe('FAILED_TRANSIENT and retry logic', () => {
    const getFailedTransientCtx = () => {
      let ctx = createOrderContext({
        gestureId: createGestureIdTest('gesture-1'),
        orderType: OrderType.BUY,
        cardId: createCardIdTest('card-1'),
        maxRetries: 2,
      });
      ctx = transitionOrder(ctx, {
        event: OrderEvent.CREATE,
        orderId: createOrderId('order-1'),
        now: 1000,
      }).context;
      ctx = transitionOrder(ctx, {
        event: OrderEvent.BROADCAST,
        now: 1100,
      }).context;
      ctx = transitionOrder(ctx, {
        event: OrderEvent.FAIL_TRANSIENT,
        reason: FailureReason.TIMEOUT,
        now: 1200,
      }).context;
      return ctx;
    };

    it('should allow retry when retryCount < maxRetries', () => {
      const ctx = getFailedTransientCtx();
      expect(ctx.retryCount).toBe(0);
      expect(canRetry(ctx)).toBe(true);

      const result = transitionOrder(ctx, {
        event: OrderEvent.RETRY,
        now: 1300,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(OrderState.CREATED);
      expect(result.context.retryCount).toBe(1);
      expect(result.context.failureReason).toBeNull();
    });

    it('should transition to FAILED_DETERMINISTIC when retries exhausted', () => {
      let ctx = getFailedTransientCtx();

      // First retry
      ctx = transitionOrder(ctx, { event: OrderEvent.RETRY, now: 1300 }).context;
      ctx = transitionOrder(ctx, { event: OrderEvent.BROADCAST, now: 1400 }).context;
      ctx = transitionOrder(ctx, {
        event: OrderEvent.FAIL_TRANSIENT,
        reason: FailureReason.TIMEOUT,
        now: 1500,
      }).context;
      expect(ctx.retryCount).toBe(1);
      expect(canRetry(ctx)).toBe(true);

      // Second retry
      ctx = transitionOrder(ctx, { event: OrderEvent.RETRY, now: 1600 }).context;
      ctx = transitionOrder(ctx, { event: OrderEvent.BROADCAST, now: 1700 }).context;
      ctx = transitionOrder(ctx, {
        event: OrderEvent.FAIL_TRANSIENT,
        reason: FailureReason.TIMEOUT,
        now: 1800,
      }).context;
      expect(ctx.retryCount).toBe(2);
      expect(canRetry(ctx)).toBe(false);

      // Third retry should fail (max 2)
      const result = transitionOrder(ctx, { event: OrderEvent.RETRY, now: 1900 });
      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(OrderState.FAILED_DETERMINISTIC);
    });
  });

  describe('UNKNOWN state', () => {
    const getUnknownCtx = () => {
      let ctx = createOrderContext({
        gestureId: createGestureIdTest('gesture-1'),
        orderType: OrderType.BUY,
        cardId: createCardIdTest('card-1'),
      });
      ctx = transitionOrder(ctx, {
        event: OrderEvent.CREATE,
        orderId: createOrderId('order-1'),
        now: 1000,
      }).context;
      ctx = transitionOrder(ctx, {
        event: OrderEvent.BROADCAST,
        now: 1100,
      }).context;
      ctx = transitionOrder(ctx, {
        event: OrderEvent.MARK_UNKNOWN,
        now: 1200,
      }).context;
      return ctx;
    };

    it('should allow transition to CONFIRMED after reconciliation', () => {
      const ctx = getUnknownCtx();
      const result = transitionOrder(ctx, {
        event: OrderEvent.CONFIRM,
        now: 1300,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(OrderState.CONFIRMED);
    });

    it('should allow transition to FAILED_DETERMINISTIC after reconciliation', () => {
      const ctx = getUnknownCtx();
      const result = transitionOrder(ctx, {
        event: OrderEvent.FAIL_DETERMINISTIC,
        reason: FailureReason.NO_ROUTE,
        now: 1300,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(OrderState.FAILED_DETERMINISTIC);
    });

    it('should allow transition to FAILED_TRANSIENT after reconciliation', () => {
      const ctx = getUnknownCtx();
      const result = transitionOrder(ctx, {
        event: OrderEvent.FAIL_TRANSIENT,
        reason: FailureReason.NETWORK_CONGESTION,
        now: 1300,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(OrderState.FAILED_TRANSIENT);
    });
  });

  describe('Query functions', () => {
    it('isTerminal should return true for terminal states', () => {
      const ctx = createOrderContext({
        gestureId: createGestureIdTest('g1'),
        orderType: OrderType.BUY,
        cardId: createCardIdTest('c1'),
      });

      expect(isTerminal(ctx)).toBe(false);

      let confirmedCtx = transitionOrder(ctx, {
        event: OrderEvent.CREATE,
        orderId: createOrderId('o1'),
        now: 1000,
      }).context;
      confirmedCtx = transitionOrder(confirmedCtx, {
        event: OrderEvent.BROADCAST,
        now: 1100,
      }).context;
      confirmedCtx = transitionOrder(confirmedCtx, {
        event: OrderEvent.CONFIRM,
        now: 1200,
      }).context;
      expect(isTerminal(confirmedCtx)).toBe(true);
    });

    it('isOrderCancelSafe should return true before broadcast', () => {
      let ctx = createOrderContext({
        gestureId: createGestureIdTest('g1'),
        orderType: OrderType.BUY,
        cardId: createCardIdTest('c1'),
      });
      expect(isOrderCancelSafe(ctx)).toBe(true);

      ctx = transitionOrder(ctx, {
        event: OrderEvent.CREATE,
        orderId: createOrderId('o1'),
        now: 1000,
      }).context;
      expect(isOrderCancelSafe(ctx)).toBe(true);

      ctx = transitionOrder(ctx, {
        event: OrderEvent.SIGN,
        now: 1100,
      }).context;
      expect(isOrderCancelSafe(ctx)).toBe(true);

      ctx = transitionOrder(ctx, {
        event: OrderEvent.BROADCAST,
        now: 1200,
      }).context;
      expect(isOrderCancelSafe(ctx)).toBe(false);
    });

    it('isConfirmed should return true only in CONFIRMED state', () => {
      let ctx = createOrderContext({
        gestureId: createGestureIdTest('g1'),
        orderType: OrderType.BUY,
        cardId: createCardIdTest('c1'),
      });
      expect(isConfirmed(ctx)).toBe(false);

      ctx = transitionOrder(ctx, {
        event: OrderEvent.CREATE,
        orderId: createOrderId('o1'),
        now: 1000,
      }).context;
      ctx = transitionOrder(ctx, {
        event: OrderEvent.BROADCAST,
        now: 1100,
      }).context;
      ctx = transitionOrder(ctx, {
        event: OrderEvent.CONFIRM,
        now: 1200,
      }).context;
      expect(isConfirmed(ctx)).toBe(true);
    });

    it('isFailed should return true for failed states', () => {
      let ctx = createOrderContext({
        gestureId: createGestureIdTest('g1'),
        orderType: OrderType.BUY,
        cardId: createCardIdTest('c1'),
      });
      expect(isFailed(ctx)).toBe(false);

      ctx = transitionOrder(ctx, {
        event: OrderEvent.CREATE,
        orderId: createOrderId('o1'),
        now: 1000,
      }).context;
      ctx = transitionOrder(ctx, {
        event: OrderEvent.FAIL_DETERMINISTIC,
        reason: FailureReason.INSUFFICIENT_FUNDS,
        now: 1100,
      }).context;
      expect(isFailed(ctx)).toBe(true);
    });

    it('isUnknown should return true only in UNKNOWN state', () => {
      let ctx = createOrderContext({
        gestureId: createGestureIdTest('g1'),
        orderType: OrderType.BUY,
        cardId: createCardIdTest('c1'),
      });
      expect(isUnknown(ctx)).toBe(false);

      ctx = transitionOrder(ctx, {
        event: OrderEvent.CREATE,
        orderId: createOrderId('o1'),
        now: 1000,
      }).context;
      ctx = transitionOrder(ctx, {
        event: OrderEvent.BROADCAST,
        now: 1100,
      }).context;
      ctx = transitionOrder(ctx, {
        event: OrderEvent.MARK_UNKNOWN,
        now: 1200,
      }).context;
      expect(isUnknown(ctx)).toBe(true);
    });

    it('isInProgress should return true for non-terminal, non-unknown states', () => {
      let ctx = createOrderContext({
        gestureId: createGestureIdTest('g1'),
        orderType: OrderType.BUY,
        cardId: createCardIdTest('c1'),
      });
      expect(isInProgress(ctx)).toBe(true);

      ctx = transitionOrder(ctx, {
        event: OrderEvent.CREATE,
        orderId: createOrderId('o1'),
        now: 1000,
      }).context;
      expect(isInProgress(ctx)).toBe(true);

      ctx = transitionOrder(ctx, {
        event: OrderEvent.BROADCAST,
        now: 1100,
      }).context;
      expect(isInProgress(ctx)).toBe(true);

      ctx = transitionOrder(ctx, {
        event: OrderEvent.CONFIRM,
        now: 1200,
      }).context;
      expect(isInProgress(ctx)).toBe(false);
    });

    it('isBroadcasted should return true if broadcastedAt is set', () => {
      let ctx = createOrderContext({
        gestureId: createGestureIdTest('g1'),
        orderType: OrderType.BUY,
        cardId: createCardIdTest('c1'),
      });
      expect(isBroadcasted(ctx)).toBe(false);

      ctx = transitionOrder(ctx, {
        event: OrderEvent.CREATE,
        orderId: createOrderId('o1'),
        now: 1000,
      }).context;
      expect(isBroadcasted(ctx)).toBe(false);

      ctx = transitionOrder(ctx, {
        event: OrderEvent.BROADCAST,
        now: 1100,
      }).context;
      expect(isBroadcasted(ctx)).toBe(true);
    });

    it('validateGestureOwnership should check gesture ID match', () => {
      const ctx = createOrderContext({
        gestureId: createGestureIdTest('gesture-1'),
        orderType: OrderType.BUY,
        cardId: createCardIdTest('c1'),
      });

      expect(validateGestureOwnership(ctx, createGestureIdTest('gesture-1'))).toBe(true);
      expect(validateGestureOwnership(ctx, createGestureIdTest('gesture-2'))).toBe(false);
    });
  });

  describe('getStatusMessage', () => {
    it('should return appropriate messages for each state', () => {
      let ctx = createOrderContext({
        gestureId: createGestureIdTest('g1'),
        orderType: OrderType.BUY,
        cardId: createCardIdTest('c1'),
      });
      expect(getStatusMessage(ctx)).toBe('Preparing order...');

      ctx = transitionOrder(ctx, {
        event: OrderEvent.CREATE,
        orderId: createOrderId('o1'),
        now: 1000,
      }).context;
      expect(getStatusMessage(ctx)).toBe('Order created, awaiting signature...');

      ctx = transitionOrder(ctx, {
        event: OrderEvent.SIGN,
        now: 1100,
      }).context;
      expect(getStatusMessage(ctx)).toBe('Order signed, broadcasting...');

      ctx = transitionOrder(ctx, {
        event: OrderEvent.BROADCAST,
        now: 1200,
      }).context;
      expect(getStatusMessage(ctx)).toBe('Order sent! Waiting for confirmation...');

      ctx = transitionOrder(ctx, {
        event: OrderEvent.CONFIRM,
        now: 1300,
      }).context;
      expect(getStatusMessage(ctx)).toBe('Order confirmed!');
    });

    it('should return appropriate failure messages', () => {
      let ctx = createOrderContext({
        gestureId: createGestureIdTest('g1'),
        orderType: OrderType.BUY,
        cardId: createCardIdTest('c1'),
      });
      ctx = transitionOrder(ctx, {
        event: OrderEvent.CREATE,
        orderId: createOrderId('o1'),
        now: 1000,
      }).context;
      ctx = transitionOrder(ctx, {
        event: OrderEvent.FAIL_DETERMINISTIC,
        reason: FailureReason.INSUFFICIENT_FUNDS,
        now: 1100,
      }).context;
      expect(getStatusMessage(ctx)).toBe('Insufficient funds.');

      // Test slippage
      ctx = createOrderContext({
        gestureId: createGestureIdTest('g2'),
        orderType: OrderType.BUY,
        cardId: createCardIdTest('c1'),
      });
      ctx = transitionOrder(ctx, {
        event: OrderEvent.CREATE,
        orderId: createOrderId('o2'),
        now: 1000,
      }).context;
      ctx = transitionOrder(ctx, {
        event: OrderEvent.FAIL_DETERMINISTIC,
        reason: FailureReason.SLIPPAGE_EXCEEDED,
        now: 1100,
      }).context;
      expect(getStatusMessage(ctx)).toBe('Price changed too much. Try again.');
    });
  });

  describe('Invariants', () => {
    it('INVARIANT: Same gesture_id = same trade (exactly-once)', () => {
      const gestureId = createGestureIdTest('gesture-1');
      const ctx = createOrderContext({
        gestureId,
        orderType: OrderType.BUY,
        cardId: createCardIdTest('card-1'),
      });

      // Validate ownership throughout lifecycle
      expect(validateGestureOwnership(ctx, gestureId)).toBe(true);

      const created = transitionOrder(ctx, {
        event: OrderEvent.CREATE,
        orderId: createOrderId('order-1'),
        now: 1000,
      }).context;
      expect(validateGestureOwnership(created, gestureId)).toBe(true);

      const broadcasted = transitionOrder(created, {
        event: OrderEvent.BROADCAST,
        now: 1100,
      }).context;
      expect(validateGestureOwnership(broadcasted, gestureId)).toBe(true);

      const confirmed = transitionOrder(broadcasted, {
        event: OrderEvent.CONFIRM,
        now: 1200,
      }).context;
      expect(validateGestureOwnership(confirmed, gestureId)).toBe(true);
    });

    it('INVARIANT: Cancel before BROADCASTED = no on-chain trade', () => {
      let ctx = createOrderContext({
        gestureId: createGestureIdTest('gesture-1'),
        orderType: OrderType.BUY,
        cardId: createCardIdTest('card-1'),
      });

      // Cancel at NOT_CREATED
      expect(isOrderCancelSafe(ctx)).toBe(true);

      // Cancel at CREATED
      ctx = transitionOrder(ctx, {
        event: OrderEvent.CREATE,
        orderId: createOrderId('order-1'),
        now: 1000,
      }).context;
      expect(isOrderCancelSafe(ctx)).toBe(true);

      // Cancel at SIGNED
      ctx = transitionOrder(ctx, {
        event: OrderEvent.SIGN,
        now: 1100,
      }).context;
      expect(isOrderCancelSafe(ctx)).toBe(true);

      // After broadcast - not safe
      ctx = transitionOrder(ctx, {
        event: OrderEvent.BROADCAST,
        now: 1200,
      }).context;
      expect(isOrderCancelSafe(ctx)).toBe(false);
    });

    it('INVARIANT: No ambiguous money state - user always knows status', () => {
      let ctx = createOrderContext({
        gestureId: createGestureIdTest('gesture-1'),
        orderType: OrderType.BUY,
        cardId: createCardIdTest('card-1'),
      });

      // Every state should have a clear message
      expect(getStatusMessage(ctx)).toBeTruthy();

      ctx = transitionOrder(ctx, {
        event: OrderEvent.CREATE,
        orderId: createOrderId('order-1'),
        now: 1000,
      }).context;
      expect(getStatusMessage(ctx)).toBeTruthy();

      ctx = transitionOrder(ctx, {
        event: OrderEvent.BROADCAST,
        now: 1100,
      }).context;
      expect(getStatusMessage(ctx)).toBeTruthy();

      // Even UNKNOWN has a message
      ctx = transitionOrder(ctx, {
        event: OrderEvent.MARK_UNKNOWN,
        now: 1200,
      }).context;
      expect(getStatusMessage(ctx)).toBe('Order status unknown. Checking...');
    });
  });

  describe('Full order lifecycle', () => {
    it('should handle complete buy flow: NOT_CREATED → CREATED → SIGNED → BROADCASTED → CONFIRMED', () => {
      let ctx = createOrderContext({
        gestureId: createGestureIdTest('gesture-1'),
        orderType: OrderType.BUY,
        cardId: createCardIdTest('card-1'),
      });
      expect(ctx.state).toBe(OrderState.NOT_CREATED);

      // Create
      ctx = transitionOrder(ctx, {
        event: OrderEvent.CREATE,
        orderId: createOrderId('order-1'),
        now: 1000,
      }).context;
      expect(ctx.state).toBe(OrderState.CREATED);
      expect(ctx.createdAt).toBe(1000);

      // Sign
      ctx = transitionOrder(ctx, {
        event: OrderEvent.SIGN,
        now: 1100,
      }).context;
      expect(ctx.state).toBe(OrderState.SIGNED);
      expect(ctx.signedAt).toBe(1100);

      // Broadcast
      ctx = transitionOrder(ctx, {
        event: OrderEvent.BROADCAST,
        now: 1200,
      }).context;
      expect(ctx.state).toBe(OrderState.BROADCASTED);
      expect(ctx.broadcastedAt).toBe(1200);

      // Confirm
      ctx = transitionOrder(ctx, {
        event: OrderEvent.CONFIRM,
        now: 1300,
      }).context;
      expect(ctx.state).toBe(OrderState.CONFIRMED);
      expect(ctx.resolvedAt).toBe(1300);
      expect(isTerminal(ctx)).toBe(true);
    });

    it('should handle retry flow: BROADCASTED → FAILED_TRANSIENT → CREATED → BROADCASTED → CONFIRMED', () => {
      let ctx = createOrderContext({
        gestureId: createGestureIdTest('gesture-1'),
        orderType: OrderType.BUY,
        cardId: createCardIdTest('card-1'),
        maxRetries: 3,
      });

      // First attempt
      ctx = transitionOrder(ctx, {
        event: OrderEvent.CREATE,
        orderId: createOrderId('order-1'),
        now: 1000,
      }).context;
      ctx = transitionOrder(ctx, {
        event: OrderEvent.BROADCAST,
        now: 1100,
      }).context;
      ctx = transitionOrder(ctx, {
        event: OrderEvent.FAIL_TRANSIENT,
        reason: FailureReason.TIMEOUT,
        now: 1200,
      }).context;
      expect(ctx.state).toBe(OrderState.FAILED_TRANSIENT);
      expect(ctx.retryCount).toBe(0);

      // Retry
      ctx = transitionOrder(ctx, {
        event: OrderEvent.RETRY,
        now: 1300,
      }).context;
      expect(ctx.state).toBe(OrderState.CREATED);
      expect(ctx.retryCount).toBe(1);

      // Second attempt succeeds
      ctx = transitionOrder(ctx, {
        event: OrderEvent.BROADCAST,
        now: 1400,
      }).context;
      ctx = transitionOrder(ctx, {
        event: OrderEvent.CONFIRM,
        now: 1500,
      }).context;
      expect(ctx.state).toBe(OrderState.CONFIRMED);
    });
  });
});

