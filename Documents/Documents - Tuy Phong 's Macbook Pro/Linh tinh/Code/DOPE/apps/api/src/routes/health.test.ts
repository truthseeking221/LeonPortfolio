/**
 * Health endpoint tests
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildServer } from '../server.js';
import type { FastifyInstance } from 'fastify';

describe('GET /v1/health', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = await buildServer();
  });

  afterAll(async () => {
    await server.close();
  });

  it('should return 200 with health status', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/v1/health',
    });

    expect(response.statusCode).toBe(200);
    
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('status', 'ok');
    expect(body).toHaveProperty('env');
    expect(body).toHaveProperty('build');
    expect(body).toHaveProperty('timestamp');
  });

  it('should return valid ISO timestamp', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/v1/health',
    });

    const body = JSON.parse(response.body);
    const timestamp = new Date(body.timestamp);
    expect(timestamp.toISOString()).toBe(body.timestamp);
  });
});

