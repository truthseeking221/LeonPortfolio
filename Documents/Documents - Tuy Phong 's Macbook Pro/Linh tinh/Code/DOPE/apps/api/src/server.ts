/**
 * DOPE API Server
 * 
 * Main entry point for the backend API.
 * 
 * Features:
 * - REST API (Fastify)
 * - WebSocket support (future)
 * - CORS configuration
 * - Error handling
 * - Kill switch enforcement
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { getConfig } from './config/index.js';
import { errorPlugin } from './plugins/errors.js';
import { registerRoutes } from './routes/index.js';

async function buildServer() {
  const config = getConfig();

  // Configure logger based on environment
  // In development, try to use pino-pretty for readable logs
  // In production, use default JSON logging
  const loggerConfig = config.env === 'production' 
    ? { level: 'info' }
    : { level: 'debug' };

  const fastify = Fastify({
    logger: loggerConfig,
  });

  // Register CORS
  await fastify.register(cors, {
    origin: config.corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Register sensible defaults (adds reply.notFound(), etc.)
  await fastify.register(sensible);

  // Register error handling
  await fastify.register(errorPlugin);

  // Register routes
  await fastify.register(registerRoutes);

  // Root redirect to health
  fastify.get('/', async (_request, reply) => {
    return reply.redirect('/v1/health');
  });

  return fastify;
}

async function start() {
  const config = getConfig();
  
  try {
    const server = await buildServer();
    
    await server.listen({
      port: config.port,
      host: config.host,
    });

    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🚀 DOPE API Server                                         ║
║                                                              ║
║   Environment: ${config.env.padEnd(43)}║
║   Build:       ${config.buildSha.padEnd(43)}║
║   Server:      http://${config.host}:${config.port}                          ║
║                                                              ║
║   Endpoints:                                                 ║
║   • GET  /v1/health  - Health check                          ║
║   • GET  /v1/config  - App configuration                     ║
║                                                              ║
║   Kill Switch: ${config.maintenance.tradingDisabled ? '🔴 ACTIVE' : '🟢 OFF   '}                                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Start the server
start();

export { buildServer };

