/**
 * Health endpoint
 * 
 * GET /v1/health - No auth required
 * 
 * Response 200:
 * {
 *   "status": "ok",
 *   "env": "staging",
 *   "build": "abc123",
 *   "timestamp": "2026-01-06T12:00:00Z"
 * }
 */

import type { FastifyInstance } from 'fastify';
import { getConfig } from '../config/index.js';

export interface HealthResponse {
  readonly status: 'ok' | 'degraded';
  readonly env: string;
  readonly build: string;
  readonly timestamp: string;
}

export async function healthRoutes(fastify: FastifyInstance): Promise<void> {
  const config = getConfig();

  fastify.get<{
    Reply: HealthResponse;
  }>('/health', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['ok', 'degraded'] },
            env: { type: 'string' },
            build: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  }, async (_request, _reply) => {
    // TODO: Add actual health checks (DB, Redis, etc.) in future
    // For M0, just return ok
    
    return {
      status: 'ok',
      env: config.env,
      build: config.buildSha,
      timestamp: new Date().toISOString(),
    };
  });
}
