/**
 * Error handling plugin for Fastify
 * 
 * Transforms all errors into the standard API error format:
 * {
 *   "error": {
 *     "code": "ERROR_CODE",
 *     "message": "Human readable message",
 *     "details": { ... }
 *   }
 * }
 */

import type { FastifyInstance, FastifyError } from 'fastify';
import { ZodError } from 'zod';
import { ApiError, ErrorCode, internalError, validationError } from '../types/errors.js';

export async function errorPlugin(fastify: FastifyInstance): Promise<void> {
  // Global error handler
  fastify.setErrorHandler((error: FastifyError | ApiError | ZodError | Error, request, reply) => {
    // Log the error
    request.log.error({
      err: error,
      url: request.url,
      method: request.method,
    }, 'Request error');

    // Handle ApiError (our custom errors)
    if (error instanceof ApiError) {
      return reply.status(error.statusCode).send(error.toResponse());
    }

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const apiError = validationError('Request validation failed', {
        issues: error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
      return reply.status(apiError.statusCode).send(apiError.toResponse());
    }

    // Handle Fastify validation errors
    if ('validation' in error && error.validation) {
      const apiError = validationError('Request validation failed', {
        issues: error.validation,
      });
      return reply.status(apiError.statusCode).send(apiError.toResponse());
    }

    // Handle not found errors from Fastify
    if ('statusCode' in error && error.statusCode === 404) {
      return reply.status(404).send({
        error: {
          code: ErrorCode.NOT_FOUND,
          message: error.message || 'Resource not found',
        },
      });
    }

    // Handle all other errors as internal errors
    const apiError = internalError();
    return reply.status(apiError.statusCode).send(apiError.toResponse());
  });

  // Not found handler for undefined routes
  fastify.setNotFoundHandler((request, reply) => {
    request.log.warn({
      url: request.url,
      method: request.method,
    }, 'Route not found');

    return reply.status(404).send({
      error: {
        code: ErrorCode.NOT_FOUND,
        message: `Route ${request.method} ${request.url} not found`,
      },
    });
  });
}

