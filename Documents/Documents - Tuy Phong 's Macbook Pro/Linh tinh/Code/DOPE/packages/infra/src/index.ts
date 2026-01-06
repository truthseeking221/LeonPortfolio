/**
 * @dope/infra - Infrastructure adapters
 * 
 * This package contains IO adapters:
 * - Database clients
 * - HTTP clients
 * - Telemetry/logging
 * - External service wrappers
 * 
 * Rules:
 * - All IO happens here, not in domain
 * - Implements interfaces, domain defines them
 * - Backend agent owns this package
 */

// ============================================================================
// Telemetry (logging + metrics)
// ============================================================================

export interface Logger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
}

/**
 * Simple console logger for M0
 * TODO: Replace with proper logging (pino, winston) in production
 */
export function createConsoleLogger(prefix: string): Logger {
  const format = (level: string, message: string, context?: Record<string, unknown>) => {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `${timestamp} [${level}] [${prefix}] ${message}${contextStr}`;
  };

  return {
    debug: (message, context) => console.debug(format('DEBUG', message, context)),
    info: (message, context) => console.info(format('INFO', message, context)),
    warn: (message, context) => console.warn(format('WARN', message, context)),
    error: (message, context) => console.error(format('ERROR', message, context)),
  };
}

// ============================================================================
// ID Generation
// ============================================================================

/**
 * Generate a random ID with optional prefix
 * Format: prefix_randomhex (e.g., "gest_a1b2c3d4e5f6")
 */
export function generateId(prefix: string): string {
  const random = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  return `${prefix}_${random}`;
}

// ============================================================================
// Time utilities
// ============================================================================

export function nowMs(): number {
  return Date.now();
}

export function nowIso(): string {
  return new Date().toISOString();
}

// ============================================================================
// Future exports (placeholders for M1+)
// ============================================================================

// Database
// export { createDbClient } from './db/client.js';
// export { runMigrations } from './db/migrations.js';

// Redis/Cache
// export { createRedisClient } from './cache/redis.js';
// export { IdempotencyStore } from './cache/idempotency.js';

// HTTP clients
// export { createTonClient } from './http/ton.js';
// export { createPriceClient } from './http/prices.js';

