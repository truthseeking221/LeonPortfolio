/**
 * API Configuration
 * 
 * Environment variables:
 * - PORT: Server port (default: 3001)
 * - HOST: Server host (default: 0.0.0.0)
 * - NODE_ENV: Environment (development, staging, production)
 * - BUILD_SHA: Git commit SHA for build identification
 * - HARD_KILL_TRADING: Emergency kill switch for all trading (true/false)
 * - CORS_ORIGINS: Comma-separated list of allowed origins
 */

export interface AppConfig {
  readonly port: number;
  readonly host: string;
  readonly env: 'development' | 'staging' | 'production';
  readonly buildSha: string;
  readonly corsOrigins: string[];
  readonly maintenance: MaintenanceConfig;
  readonly risk: RiskConfig;
  readonly deck: DeckConfig;
  readonly slippage: SlippageConfig;
}

export interface MaintenanceConfig {
  readonly tradingDisabled: boolean;
  readonly buyDisabled: boolean;
  readonly sellDisabled: boolean;
}

export interface RiskConfig {
  readonly minLiquidity: number;
  readonly minAgeMinutes: number;
}

export interface DeckConfig {
  readonly seenTtlHours: number;
  readonly noRepeatLastN: number;
}

export interface SlippageConfig {
  readonly sellDefaultBps: number;
  readonly sellMaxUserBps: number;
}

function parseEnv(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

function parseEnvInt(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

function parseEnvBool(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

function parseEnvList(key: string, defaultValue: string[]): string[] {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value.split(',').map(s => s.trim()).filter(Boolean);
}

function parseEnvEnum<T extends string>(
  key: string,
  allowed: readonly T[],
  defaultValue: T
): T {
  const value = process.env[key] as T | undefined;
  if (value === undefined) return defaultValue;
  return allowed.includes(value) ? value : defaultValue;
}

export function loadConfig(): AppConfig {
  return {
    port: parseEnvInt('PORT', 3001),
    host: parseEnv('HOST', '0.0.0.0'),
    env: parseEnvEnum('NODE_ENV', ['development', 'staging', 'production'] as const, 'development'),
    buildSha: parseEnv('BUILD_SHA', 'dev'),
    corsOrigins: parseEnvList('CORS_ORIGINS', ['http://localhost:5173', 'http://localhost:3000']),
    
    maintenance: {
      // HARD_KILL_TRADING is the emergency kill switch
      tradingDisabled: parseEnvBool('HARD_KILL_TRADING', false),
      buyDisabled: parseEnvBool('DISABLE_BUY', false),
      sellDisabled: parseEnvBool('DISABLE_SELL', false),
    },
    
    risk: {
      minLiquidity: parseEnvInt('RISK_MIN_LIQUIDITY', 1000),
      minAgeMinutes: parseEnvInt('RISK_MIN_AGE_MINUTES', 5),
    },
    
    deck: {
      seenTtlHours: parseEnvInt('DECK_SEEN_TTL_HOURS', 24),
      noRepeatLastN: parseEnvInt('DECK_NO_REPEAT_LAST_N', 50),
    },
    
    slippage: {
      sellDefaultBps: parseEnvInt('SLIPPAGE_SELL_DEFAULT_BPS', 500),
      sellMaxUserBps: parseEnvInt('SLIPPAGE_SELL_MAX_USER_BPS', 5000),
    },
  };
}

// Singleton config instance
let _config: AppConfig | null = null;

export function getConfig(): AppConfig {
  if (_config === null) {
    _config = loadConfig();
  }
  return _config;
}

/**
 * Check if trading is globally disabled (kill switch)
 * This MUST be checked before any commit endpoint
 */
export function isTradingDisabled(): boolean {
  const config = getConfig();
  return config.maintenance.tradingDisabled;
}

/**
 * Check if buying is disabled
 */
export function isBuyDisabled(): boolean {
  const config = getConfig();
  return config.maintenance.tradingDisabled || config.maintenance.buyDisabled;
}

/**
 * Check if selling is disabled
 */
export function isSellDisabled(): boolean {
  const config = getConfig();
  return config.maintenance.tradingDisabled || config.maintenance.sellDisabled;
}

