/**
 * Config endpoint tests
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildServer } from '../server.js';
import type { FastifyInstance } from 'fastify';

describe('GET /v1/config', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = await buildServer();
  });

  afterAll(async () => {
    await server.close();
  });

  it('should return 200 with config', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/v1/config',
    });

    expect(response.statusCode).toBe(200);
    
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('version', 1);
    expect(body).toHaveProperty('maintenance');
    expect(body).toHaveProperty('risk');
    expect(body).toHaveProperty('deck');
    expect(body).toHaveProperty('slippage');
  });

  it('should return maintenance flags', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/v1/config',
    });

    const body = JSON.parse(response.body);
    expect(body.maintenance).toHaveProperty('trading_disabled');
    expect(body.maintenance).toHaveProperty('buy_disabled');
    expect(body.maintenance).toHaveProperty('sell_disabled');
    expect(typeof body.maintenance.trading_disabled).toBe('boolean');
  });

  it('should return risk settings', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/v1/config',
    });

    const body = JSON.parse(response.body);
    expect(body.risk).toHaveProperty('min_liquidity');
    expect(body.risk).toHaveProperty('min_age_minutes');
    expect(typeof body.risk.min_liquidity).toBe('number');
  });

  it('should return deck settings', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/v1/config',
    });

    const body = JSON.parse(response.body);
    expect(body.deck).toHaveProperty('seen_ttl_hours');
    expect(body.deck).toHaveProperty('no_repeat_last_n');
  });

  it('should return slippage settings', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/v1/config',
    });

    const body = JSON.parse(response.body);
    expect(body.slippage).toHaveProperty('sell_default_bps');
    expect(body.slippage).toHaveProperty('sell_max_user_bps');
    expect(body.slippage.sell_default_bps).toBe(500);
  });
});

