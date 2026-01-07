/**
 * Route registration
 * 
 * All routes are prefixed with /v1
 */

import type { FastifyInstance } from 'fastify';
import { healthRoutes } from './health.js';
import { configRoutes } from './config.js';
import { authRoutes } from './auth.js';
import { activityRoutes } from './activity.js';
import { positionsRoutes } from './positions.js';
import { tradesRoutes } from './trades.js';
import { walletRoutes } from './wallet.js';
import { deckRoutes } from './deck.js';

export async function registerRoutes(fastify: FastifyInstance): Promise<void> {
  // Register all v1 routes under /v1 prefix
  await fastify.register(async (v1) => {
    // Public routes (no auth)
    await v1.register(healthRoutes);
    await v1.register(configRoutes);
    await v1.register(authRoutes);
    
    // Protected routes (require auth)
    await v1.register(activityRoutes);
    await v1.register(positionsRoutes);
    await v1.register(tradesRoutes);
    await v1.register(walletRoutes);
    await v1.register(deckRoutes);
  }, { prefix: '/v1' });
}

