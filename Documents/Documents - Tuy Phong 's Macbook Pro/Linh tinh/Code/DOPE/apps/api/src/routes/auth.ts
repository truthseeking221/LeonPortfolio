/**
 * Authentication endpoints
 * 
 * POST /v1/auth/telegram - Authenticate with Telegram initData
 * 
 * For M0: Mock implementation that accepts any initData
 * For production: Verify initData signature per Telegram docs
 */

import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ApiError, ErrorCode } from '../types/errors.js';
import { generateId, nowMs } from './utils.js';

// ============================================================================
// Request/Response Schemas
// ============================================================================

const TelegramAuthRequestSchema = z.object({
  init_data: z.string().min(1, 'init_data is required'),
});

export interface TelegramAuthResponse {
  readonly access_token: string;
  readonly session_id: string;
  readonly user_id: string;
  readonly expires_at: string;
}

// ============================================================================
// Mock session store (in-memory for M0)
// ============================================================================

interface Session {
  sessionId: string;
  userId: string;
  telegramId: number;
  username?: string;
  createdAt: number;
  expiresAt: number;
}

// In-memory session store - will be replaced with Redis in production
const sessions = new Map<string, Session>();

// Session duration: 24 hours
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

// ============================================================================
// Telegram initData parsing (mock for M0)
// ============================================================================

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface ParsedInitData {
  user: TelegramUser;
  auth_date: number;
  hash: string;
}

/**
 * Parse Telegram initData string
 * Format: key1=value1&key2=value2&...
 * 
 * For M0: Accept mock initData or parse real format
 * For production: Must verify HMAC signature
 */
function parseInitData(initDataString: string): ParsedInitData {
  // Handle mock initData for development/testing
  if (initDataString.startsWith('mock:')) {
    const mockUserId = parseInt(initDataString.slice(5)) || 12345;
    return {
      user: {
        id: mockUserId,
        first_name: 'Test',
        username: `test_user_${mockUserId}`,
      },
      auth_date: Math.floor(nowMs() / 1000),
      hash: 'mock_hash',
    };
  }

  // Parse URL-encoded initData
  const params = new URLSearchParams(initDataString);
  const userStr = params.get('user');
  const authDateStr = params.get('auth_date');
  const hash = params.get('hash');

  if (!userStr || !authDateStr || !hash) {
    throw new ApiError(
      ErrorCode.INVALID_INIT_DATA,
      'Missing required fields in initData'
    );
  }

  let user: TelegramUser;
  try {
    user = JSON.parse(userStr);
  } catch {
    throw new ApiError(
      ErrorCode.INVALID_INIT_DATA,
      'Invalid user data in initData'
    );
  }

  const authDate = parseInt(authDateStr, 10);
  if (isNaN(authDate)) {
    throw new ApiError(
      ErrorCode.INVALID_INIT_DATA,
      'Invalid auth_date in initData'
    );
  }

  return { user, auth_date: authDate, hash };
}

/**
 * Verify initData is not too old
 * Telegram initData expires after ~24 hours
 */
function verifyInitDataAge(authDate: number): void {
  const now = Math.floor(nowMs() / 1000);
  const maxAge = 24 * 60 * 60; // 24 hours in seconds
  
  if (now - authDate > maxAge) {
    throw new ApiError(
      ErrorCode.EXPIRED_INIT_DATA,
      'initData has expired, please reopen the app'
    );
  }
}

/**
 * TODO: Implement proper signature verification for production
 * 
 * Steps:
 * 1. Sort all params except 'hash' alphabetically
 * 2. Create data-check-string: key=value\n pairs
 * 3. Create secret_key = HMAC-SHA256(BOT_TOKEN, "WebAppData")
 * 4. Create hash = HMAC-SHA256(secret_key, data-check-string)
 * 5. Compare with provided hash
 */
// function verifyInitDataSignature(initDataString: string, botToken: string): boolean {
//   // Implementation for production
// }

/**
 * Generate a simple JWT-like token (mock for M0)
 * In production, use proper JWT with RS256/ES256
 */
function generateAccessToken(sessionId: string, userId: string): string {
  // For M0: Simple base64 encoded token
  // For production: Use proper JWT library
  const payload = {
    sid: sessionId,
    uid: userId,
    iat: nowMs(),
    exp: nowMs() + SESSION_DURATION_MS,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

// ============================================================================
// Route Registration
// ============================================================================

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  /**
   * POST /v1/auth/telegram
   * Authenticate with Telegram initData
   */
  fastify.post<{
    Body: z.infer<typeof TelegramAuthRequestSchema>;
    Reply: TelegramAuthResponse;
  }>('/auth/telegram', {
    schema: {
      body: {
        type: 'object',
        required: ['init_data'],
        properties: {
          init_data: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            access_token: { type: 'string' },
            session_id: { type: 'string' },
            user_id: { type: 'string' },
            expires_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  }, async (request, _reply) => {
    // Validate request body
    const parsed = TelegramAuthRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      throw new ApiError(
        ErrorCode.VALIDATION_ERROR,
        'Invalid request body',
        { issues: parsed.error.issues }
      );
    }

    const { init_data } = parsed.data;

    // Parse and validate initData
    const initData = parseInitData(init_data);
    
    // Verify initData is not expired
    verifyInitDataAge(initData.auth_date);

    // TODO: Verify signature in production
    // verifyInitDataSignature(init_data, process.env.TELEGRAM_BOT_TOKEN);

    // Generate session
    const sessionId = generateId('sess');
    const userId = `user_${initData.user.id}`;
    const now = nowMs();
    const expiresAt = now + SESSION_DURATION_MS;

    // Store session
    const session: Session = {
      sessionId,
      userId,
      telegramId: initData.user.id,
      username: initData.user.username,
      createdAt: now,
      expiresAt,
    };
    sessions.set(sessionId, session);

    // Generate access token
    const accessToken = generateAccessToken(sessionId, userId);

    // Log authentication
    request.log.info({
      userId,
      telegramId: initData.user.id,
      sessionId,
    }, 'User authenticated');

    return {
      access_token: accessToken,
      session_id: sessionId,
      user_id: userId,
      expires_at: new Date(expiresAt).toISOString(),
    };
  });
}

// ============================================================================
// Session utilities (exported for use by other routes)
// ============================================================================

export function getSession(sessionId: string): Session | undefined {
  const session = sessions.get(sessionId);
  if (!session) return undefined;
  
  // Check if expired
  if (nowMs() > session.expiresAt) {
    sessions.delete(sessionId);
    return undefined;
  }
  
  return session;
}

export function validateAccessToken(token: string): { sessionId: string; userId: string } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64url').toString());
    
    // Check expiration
    if (payload.exp && payload.exp < nowMs()) {
      return null;
    }
    
    // Verify session exists
    const session = getSession(payload.sid);
    if (!session) {
      return null;
    }
    
    return {
      sessionId: payload.sid,
      userId: payload.uid,
    };
  } catch {
    return null;
  }
}

