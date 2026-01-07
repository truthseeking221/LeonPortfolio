/**
 * Route utilities
 */

/**
 * Generate a random ID with prefix
 * Format: prefix_randomhex (e.g., "sess_a1b2c3d4e5f6")
 */
export function generateId(prefix: string): string {
  const random = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  return `${prefix}_${random}`;
}

/**
 * Get current timestamp in milliseconds
 */
export function nowMs(): number {
  return Date.now();
}

/**
 * Get current timestamp as ISO string
 */
export function nowIso(): string {
  return new Date().toISOString();
}

