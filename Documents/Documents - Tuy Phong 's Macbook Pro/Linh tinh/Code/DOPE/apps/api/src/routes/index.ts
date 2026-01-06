/**
 * Route registration
 * 
 * All routes are prefixed with /v1
 */

import type { FastifyInstance } from 'fastify';
import { healthRoutes } from './health.js';
import { configRoutes } from './config.js';

export async function registerRoutes(fastify: FastifyInstance): Promise<void> {
  // Register all v1 routes under /v1 prefix
  await fastify.register(async (v1) => {
    await v1.register(healthRoutes);
    await v1.register(configRoutes);
    
    // Future routes will be added here:
    // await v1.register(authRoutes);
    // await v1.register(deckRoutes);
    // await v1.register(tradesRoutes);
    // await v1.register(activityRoutes);
  }, { prefix: '/v1' });
}

