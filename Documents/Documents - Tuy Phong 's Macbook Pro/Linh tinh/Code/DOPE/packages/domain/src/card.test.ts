import { describe, it, expect } from 'vitest';
import {
  createCardContext,
  createGestureId,
  transitionCard,
  canTransition as canTransitionCard,
  calculateDistance,
  isArmed,
  isCommitting,
  isHolding,
  isCancelSafe as isCardCancelSafe,
  isResolved,
  isGestureActive,
  getHoldDuration,
  shouldArm,
} from './card.js';
import {
  CardState,
  CardEvent,
  type CardId,
  type OrderId,
  type GestureConfig,
  DEFAULT_GESTURE_CONFIG,
} from './types.js';

// Test helpers
const createCardId = (id: string) => id as CardId;
const createOrderIdTest = (id: string) => id as OrderId;

describe('Card Interaction State Machine', () => {
  describe('createCardContext', () => {
    it('should create context in DISCOVERING state', () => {
      const ctx = createCardContext();
      expect(ctx.state).toBe(CardState.DISCOVERING);
      expect(ctx.cardId).toBeNull();
      expect(ctx.gestureId).toBeNull();
      expect(ctx.holdStartAt).toBeNull();
      expect(ctx.holdStartPosition).toBeNull();
      expect(ctx.totalMovement).toBe(0);
      expect(ctx.orderId).toBeNull();
    });

    it('should create context with cardId', () => {
      const cardId = createCardId('card-1');
      const ctx = createCardContext(cardId);
      expect(ctx.cardId).toBe(cardId);
    });
  });

  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      expect(calculateDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
      expect(calculateDistance({ x: 0, y: 0 }, { x: 0, y: 0 })).toBe(0);
      expect(calculateDistance({ x: 1, y: 1 }, { x: 1, y: 1 })).toBe(0);
    });
  });

  describe('DISCOVERING → HOLD_POSSIBLE', () => {
    it('should transition on POINTER_DOWN', () => {
      const ctx = createCardContext(createCardId('card-1'));
      const gestureId = createGestureId('gesture-1');

      const result = transitionCard(ctx, {
        event: CardEvent.POINTER_DOWN,
        gestureId,
        cardId: createCardId('card-1'),
        position: { x: 100, y: 200 },
        now: 1000,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(CardState.HOLD_POSSIBLE);
      expect(result.context.gestureId).toBe(gestureId);
      expect(result.context.holdStartAt).toBe(1000);
      expect(result.context.holdStartPosition).toEqual({ x: 100, y: 200 });
      expect(result.context.totalMovement).toBe(0);
    });
  });

  describe('HOLD_POSSIBLE transitions (gesture disambiguation)', () => {
    const getHoldPossibleCtx = () => {
      const ctx = createCardContext(createCardId('card-1'));
      return transitionCard(ctx, {
        event: CardEvent.POINTER_DOWN,
        gestureId: createGestureId('gesture-1'),
        cardId: createCardId('card-1'),
        position: { x: 100, y: 100 },
        now: 1000,
      }).context;
    };

    it('should track movement on POINTER_MOVE', () => {
      const ctx = getHoldPossibleCtx();
      const result = transitionCard(ctx, {
        event: CardEvent.POINTER_MOVE,
        position: { x: 105, y: 100 },
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(CardState.HOLD_POSSIBLE);
      expect(result.context.totalMovement).toBe(5);
    });

    it('should transition to HOLD_CANCELED if movement exceeds threshold', () => {
      const ctx = getHoldPossibleCtx();
      const result = transitionCard(ctx, {
        event: CardEvent.POINTER_MOVE,
        position: { x: 115, y: 100 }, // 15px movement > 10px threshold
        config: DEFAULT_GESTURE_CONFIG,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(CardState.HOLD_CANCELED);
    });

    it('should transition to HOLD_ARMED on ARM_TIMEOUT if movement is within threshold', () => {
      const ctx = getHoldPossibleCtx();
      const result = transitionCard(ctx, {
        event: CardEvent.ARM_TIMEOUT,
        now: 1300,
        config: DEFAULT_GESTURE_CONFIG,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(CardState.HOLD_ARMED);
    });

    it('should transition to HOLD_CANCELED if movement exceeded before ARM_TIMEOUT', () => {
      let ctx = getHoldPossibleCtx();

      // Move beyond threshold
      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_MOVE,
        position: { x: 115, y: 100 },
        config: DEFAULT_GESTURE_CONFIG,
      }).context;

      expect(ctx.state).toBe(CardState.HOLD_CANCELED);
    });

    it('should transition to HOLD_CANCELED on POINTER_UP before ARM_TIMEOUT', () => {
      const ctx = getHoldPossibleCtx();
      const result = transitionCard(ctx, {
        event: CardEvent.POINTER_UP,
        now: 1100, // Before ARM_MS threshold
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(CardState.HOLD_CANCELED);
    });

    it('should transition to HOLD_CANCELED on SWIPE_DETECTED', () => {
      const ctx = getHoldPossibleCtx();
      const result = transitionCard(ctx, {
        event: CardEvent.SWIPE_DETECTED,
        now: 1100,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(CardState.HOLD_CANCELED);
    });

    it('should transition to HOLD_CANCELED on CANCEL', () => {
      const ctx = getHoldPossibleCtx();
      const result = transitionCard(ctx, {
        event: CardEvent.CANCEL,
        now: 1100,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(CardState.HOLD_CANCELED);
    });
  });

  describe('HOLD_ARMED transitions', () => {
    const getArmedCtx = () => {
      let ctx = createCardContext(createCardId('card-1'));
      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_DOWN,
        gestureId: createGestureId('gesture-1'),
        cardId: createCardId('card-1'),
        position: { x: 100, y: 100 },
        now: 1000,
      }).context;
      ctx = transitionCard(ctx, {
        event: CardEvent.ARM_TIMEOUT,
        now: 1300,
        config: DEFAULT_GESTURE_CONFIG,
      }).context;
      return ctx;
    };

    it('should transition to COMMITTING_BUY on POINTER_UP', () => {
      const ctx = getArmedCtx();
      const result = transitionCard(ctx, {
        event: CardEvent.POINTER_UP,
        now: 1400,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(CardState.COMMITTING_BUY);
    });

    it('should transition to HOLD_CANCELED on CANCEL', () => {
      const ctx = getArmedCtx();
      const result = transitionCard(ctx, {
        event: CardEvent.CANCEL,
        now: 1400,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(CardState.HOLD_CANCELED);
    });
  });

  describe('COMMITTING_BUY transitions', () => {
    const getCommittingCtx = () => {
      let ctx = createCardContext(createCardId('card-1'));
      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_DOWN,
        gestureId: createGestureId('gesture-1'),
        cardId: createCardId('card-1'),
        position: { x: 100, y: 100 },
        now: 1000,
      }).context;
      ctx = transitionCard(ctx, {
        event: CardEvent.ARM_TIMEOUT,
        now: 1300,
      }).context;
      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_UP,
        now: 1400,
      }).context;
      return ctx;
    };

    it('should transition to HOLDING_POSITION on BUY_SUCCESS', () => {
      const ctx = getCommittingCtx();
      const orderId = createOrderIdTest('order-1');
      const result = transitionCard(ctx, {
        event: CardEvent.BUY_SUCCESS,
        orderId,
        now: 1500,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(CardState.HOLDING_POSITION);
      expect(result.context.orderId).toBe(orderId);
    });

    it('should transition to RESOLVED on BUY_FAILED', () => {
      const ctx = getCommittingCtx();
      const result = transitionCard(ctx, {
        event: CardEvent.BUY_FAILED,
        now: 1500,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(CardState.RESOLVED);
    });

    it('should transition to HOLD_CANCELED on CANCEL', () => {
      const ctx = getCommittingCtx();
      const result = transitionCard(ctx, {
        event: CardEvent.CANCEL,
        now: 1500,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(CardState.HOLD_CANCELED);
    });
  });

  describe('HOLDING_POSITION transitions', () => {
    const getHoldingCtx = () => {
      let ctx = createCardContext(createCardId('card-1'));
      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_DOWN,
        gestureId: createGestureId('gesture-1'),
        cardId: createCardId('card-1'),
        position: { x: 100, y: 100 },
        now: 1000,
      }).context;
      ctx = transitionCard(ctx, {
        event: CardEvent.ARM_TIMEOUT,
        now: 1300,
      }).context;
      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_UP,
        now: 1400,
      }).context;
      ctx = transitionCard(ctx, {
        event: CardEvent.BUY_SUCCESS,
        orderId: createOrderIdTest('order-1'),
        now: 1500,
      }).context;
      return ctx;
    };

    it('should transition to COMMITTING_SELL on PANIC_SELL', () => {
      const ctx = getHoldingCtx();
      const result = transitionCard(ctx, {
        event: CardEvent.PANIC_SELL,
        gestureId: createGestureId('gesture-2'),
        now: 2000,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(CardState.COMMITTING_SELL);
      expect(result.context.gestureId).toBe(createGestureId('gesture-2'));
    });
  });

  describe('COMMITTING_SELL transitions', () => {
    const getCommittingSellCtx = () => {
      let ctx = createCardContext(createCardId('card-1'));
      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_DOWN,
        gestureId: createGestureId('gesture-1'),
        cardId: createCardId('card-1'),
        position: { x: 100, y: 100 },
        now: 1000,
      }).context;
      ctx = transitionCard(ctx, {
        event: CardEvent.ARM_TIMEOUT,
        now: 1300,
      }).context;
      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_UP,
        now: 1400,
      }).context;
      ctx = transitionCard(ctx, {
        event: CardEvent.BUY_SUCCESS,
        orderId: createOrderIdTest('order-1'),
        now: 1500,
      }).context;
      ctx = transitionCard(ctx, {
        event: CardEvent.PANIC_SELL,
        gestureId: createGestureId('gesture-2'),
        now: 2000,
      }).context;
      return ctx;
    };

    it('should transition to RESOLVED on SELL_SUCCESS', () => {
      const ctx = getCommittingSellCtx();
      const result = transitionCard(ctx, {
        event: CardEvent.SELL_SUCCESS,
        now: 2100,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(CardState.RESOLVED);
    });

    it('should transition to RESOLVED on SELL_FAILED', () => {
      const ctx = getCommittingSellCtx();
      const result = transitionCard(ctx, {
        event: CardEvent.SELL_FAILED,
        now: 2100,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(CardState.RESOLVED);
    });
  });

  describe('HOLD_CANCELED and RESOLVED reset', () => {
    it('should reset to DISCOVERING from HOLD_CANCELED on RESET', () => {
      let ctx = createCardContext(createCardId('card-1'));
      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_DOWN,
        gestureId: createGestureId('gesture-1'),
        cardId: createCardId('card-1'),
        position: { x: 100, y: 100 },
        now: 1000,
      }).context;
      ctx = transitionCard(ctx, {
        event: CardEvent.CANCEL,
        now: 1100,
      }).context;

      expect(ctx.state).toBe(CardState.HOLD_CANCELED);

      const result = transitionCard(ctx, {
        event: CardEvent.RESET,
        now: 1200,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(CardState.DISCOVERING);
      expect(result.context.gestureId).toBeNull();
      expect(result.context.holdStartAt).toBeNull();
    });

    it('should reset to DISCOVERING from RESOLVED on RESET', () => {
      let ctx = createCardContext(createCardId('card-1'));
      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_DOWN,
        gestureId: createGestureId('gesture-1'),
        cardId: createCardId('card-1'),
        position: { x: 100, y: 100 },
        now: 1000,
      }).context;
      ctx = transitionCard(ctx, {
        event: CardEvent.ARM_TIMEOUT,
        now: 1300,
      }).context;
      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_UP,
        now: 1400,
      }).context;
      ctx = transitionCard(ctx, {
        event: CardEvent.BUY_FAILED,
        now: 1500,
      }).context;

      expect(ctx.state).toBe(CardState.RESOLVED);

      const result = transitionCard(ctx, {
        event: CardEvent.RESET,
        now: 1600,
      });

      expect(result.changed).toBe(true);
      expect(result.context.state).toBe(CardState.DISCOVERING);
    });
  });

  describe('Query functions', () => {
    it('isArmed should return true only in HOLD_ARMED state', () => {
      let ctx = createCardContext();
      expect(isArmed(ctx)).toBe(false);

      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_DOWN,
        gestureId: createGestureId('g1'),
        cardId: createCardId('c1'),
        position: { x: 0, y: 0 },
        now: 1000,
      }).context;
      expect(isArmed(ctx)).toBe(false);

      ctx = transitionCard(ctx, {
        event: CardEvent.ARM_TIMEOUT,
        now: 1300,
      }).context;
      expect(isArmed(ctx)).toBe(true);
    });

    it('isCommitting should return true in COMMITTING states', () => {
      let ctx = createCardContext();
      expect(isCommitting(ctx)).toBe(false);

      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_DOWN,
        gestureId: createGestureId('g1'),
        cardId: createCardId('c1'),
        position: { x: 0, y: 0 },
        now: 1000,
      }).context;
      ctx = transitionCard(ctx, {
        event: CardEvent.ARM_TIMEOUT,
        now: 1300,
      }).context;
      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_UP,
        now: 1400,
      }).context;
      expect(isCommitting(ctx)).toBe(true);
    });

    it('isHolding should return true only in HOLDING_POSITION', () => {
      let ctx = createCardContext();
      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_DOWN,
        gestureId: createGestureId('g1'),
        cardId: createCardId('c1'),
        position: { x: 0, y: 0 },
        now: 1000,
      }).context;
      ctx = transitionCard(ctx, {
        event: CardEvent.ARM_TIMEOUT,
        now: 1300,
      }).context;
      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_UP,
        now: 1400,
      }).context;
      expect(isHolding(ctx)).toBe(false);

      ctx = transitionCard(ctx, {
        event: CardEvent.BUY_SUCCESS,
        orderId: createOrderIdTest('o1'),
        now: 1500,
      }).context;
      expect(isHolding(ctx)).toBe(true);
    });

    it('isCardCancelSafe should return true before COMMITTING_BUY', () => {
      let ctx = createCardContext();
      expect(isCardCancelSafe(ctx)).toBe(true);

      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_DOWN,
        gestureId: createGestureId('g1'),
        cardId: createCardId('c1'),
        position: { x: 0, y: 0 },
        now: 1000,
      }).context;
      expect(isCardCancelSafe(ctx)).toBe(true);

      ctx = transitionCard(ctx, {
        event: CardEvent.ARM_TIMEOUT,
        now: 1300,
      }).context;
      expect(isCardCancelSafe(ctx)).toBe(true);

      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_UP,
        now: 1400,
      }).context;
      // Now in COMMITTING_BUY
      expect(isCardCancelSafe(ctx)).toBe(false);
    });

    it('isGestureActive should return true during hold gesture', () => {
      let ctx = createCardContext();
      expect(isGestureActive(ctx)).toBe(false);

      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_DOWN,
        gestureId: createGestureId('g1'),
        cardId: createCardId('c1'),
        position: { x: 0, y: 0 },
        now: 1000,
      }).context;
      expect(isGestureActive(ctx)).toBe(true);

      ctx = transitionCard(ctx, {
        event: CardEvent.ARM_TIMEOUT,
        now: 1300,
      }).context;
      expect(isGestureActive(ctx)).toBe(true);

      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_UP,
        now: 1400,
      }).context;
      expect(isGestureActive(ctx)).toBe(false);
    });

    it('getHoldDuration should calculate elapsed time', () => {
      let ctx = createCardContext();
      expect(getHoldDuration(ctx, 1000)).toBe(0);

      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_DOWN,
        gestureId: createGestureId('g1'),
        cardId: createCardId('c1'),
        position: { x: 0, y: 0 },
        now: 1000,
      }).context;
      expect(getHoldDuration(ctx, 1200)).toBe(200);
      expect(getHoldDuration(ctx, 1500)).toBe(500);
    });

    it('shouldArm should check both duration and movement', () => {
      let ctx = createCardContext();
      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_DOWN,
        gestureId: createGestureId('g1'),
        cardId: createCardId('c1'),
        position: { x: 0, y: 0 },
        now: 1000,
      }).context;

      // Not enough time
      expect(shouldArm(ctx, 1100)).toBe(false);

      // Enough time, no movement
      expect(shouldArm(ctx, 1300)).toBe(true);

      // Move too much
      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_MOVE,
        position: { x: 15, y: 0 },
      }).context;
      expect(shouldArm(ctx, 1300)).toBe(false);
    });
  });

  describe('Invariants', () => {
    it('INVARIANT: Cancel before COMMITTING = no trade', () => {
      let ctx = createCardContext(createCardId('card-1'));

      // Pointer down
      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_DOWN,
        gestureId: createGestureId('gesture-1'),
        cardId: createCardId('card-1'),
        position: { x: 100, y: 100 },
        now: 1000,
      }).context;
      expect(isCardCancelSafe(ctx)).toBe(true);

      // Arm
      ctx = transitionCard(ctx, {
        event: CardEvent.ARM_TIMEOUT,
        now: 1300,
      }).context;
      expect(isCardCancelSafe(ctx)).toBe(true);

      // Cancel while armed
      const result = transitionCard(ctx, {
        event: CardEvent.CANCEL,
        now: 1350,
      });
      expect(result.context.state).toBe(CardState.HOLD_CANCELED);
      expect(isCardCancelSafe(result.context)).toBe(true);
    });

    it('INVARIANT: Quick swipe never arms buy', () => {
      let ctx = createCardContext(createCardId('card-1'));

      // Pointer down
      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_DOWN,
        gestureId: createGestureId('gesture-1'),
        cardId: createCardId('card-1'),
        position: { x: 100, y: 100 },
        now: 1000,
      }).context;

      // Quick swipe (lots of movement before ARM_MS)
      ctx = transitionCard(ctx, {
        event: CardEvent.POINTER_MOVE,
        position: { x: 200, y: 100 }, // 100px movement
        config: DEFAULT_GESTURE_CONFIG,
      }).context;

      // Should be canceled, not armed
      expect(ctx.state).toBe(CardState.HOLD_CANCELED);
      expect(isArmed(ctx)).toBe(false);
    });
  });
});

