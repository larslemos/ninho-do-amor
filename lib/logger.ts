// lib/logger.ts

import pino from 'pino';

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';
const isDevelopment = process.env.NODE_ENV === 'development';
const isBrowser = typeof window !== 'undefined';

// Base logger configuration
const baseConfig: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
    bindings: (bindings) => {
      return {
        pid: bindings.pid,
        hostname: bindings.hostname,
        service: bindings.service,
        version: bindings.version,
        environment: bindings.environment,
        ...(isVercel && {
          vercel_region: process.env.VERCEL_REGION,
          vercel_deployment_id: process.env.VERCEL_DEPLOYMENT_ID,
        }),
      };
    },
  },
  // Add custom fields for production tracking
  base: {
    pid: isBrowser ? undefined : process.pid,
    hostname: isBrowser ? 'browser' : process.env.VERCEL_URL || 'localhost',
    service: 'ninho-do-amor',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    ...(isVercel && {
      vercel_region: process.env.VERCEL_REGION,
      vercel_deployment_id: process.env.VERCEL_DEPLOYMENT_ID,
    }),
  },
};

// Create logger with environment-specific transport
let logger: pino.Logger;

if (isBrowser) {
  // Browser environment: simple console logging
  logger = pino({
    ...baseConfig,
    browser: {
      asObject: true,
      write: (o) => {
        const level =
          o.level === 30 ? 'info' : o.level === 40 ? 'warn' : o.level === 50 ? 'error' : 'debug';

        const args = [o.msg, o];
        if (level === 'error') {
          console.error(...args);
        } else if (level === 'warn') {
          console.warn(...args);
        } else if (level === 'info') {
          console.info(...args);
        } else {
          console.debug(...args);
        }
      },
    },
  });
} else if (isDevelopment) {
  // Node.js development: Pretty printing
  logger = pino({
    ...baseConfig,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname,service,version,environment',
        singleLine: false,
        levelFirst: true,
        messageFormat: '[{service}] {msg}',
      },
    },
  });
} else {
  // Production environments (Vercel and others)
  logger = pino(baseConfig);
}

// Enhanced logging methods
export const createLogger = (module?: string, context?: Record<string, any>) => {
  const childContext = { ...context };
  if (module) {
    childContext.module = module;
  }
  return logger.child(childContext);
};

// Pre-configured loggers for different modules
export const apiLogger = createLogger('api');
export const authLogger = createLogger('auth');
export const dbLogger = createLogger('database');
export const emailLogger = createLogger('email');
export const analyticsLogger = createLogger('analytics');
export const weddingLogger = createLogger('wedding');
export const guestLogger = createLogger('guest');
export const paymentLogger = createLogger('payment');
export const notificationLogger = createLogger('notification');

// Structured logging helpers
export interface RequestLogContext {
  method: string;
  url: string;
  headers?: Record<string, string>;
  ip?: string;
  userAgent?: string;
}

export const logRequest = (req: Request | RequestLogContext, startTime: number = Date.now()) => {
  // For browser environment, use a simple logger
  if (isBrowser) {
    const simpleLogger = createLogger('request');
    return {
      info: (msg: string, extra?: object) => simpleLogger.info({ ...extra }, msg),
      error: (msg: string, error?: Error | object) => simpleLogger.error({ error }, msg),
      warn: (msg: string, extra?: object) => simpleLogger.warn({ ...extra }, msg),
      debug: (msg: string, extra?: object) => simpleLogger.debug({ ...extra }, msg),
      complete: (statusCode: number, extra?: object) => {
        const duration = Date.now() - startTime;
        simpleLogger.info({ statusCode, duration, ...extra }, `Request completed in ${duration}ms`);
      },
    };
  }

  const request =
    req instanceof Request
      ? {
          method: req.method,
          url: req.url,
          headers: Object.fromEntries(req.headers.entries()),
          ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
          userAgent: req.headers.get('user-agent'),
        }
      : req;

  const childLogger = logger.child({
    type: 'request',
    ...request,
    timestamp: new Date(startTime).toISOString(),
  });

  return {
    info: (msg: string, extra?: object) => childLogger.info({ ...extra }, msg),
    error: (msg: string, error?: Error | object) =>
      childLogger.error(
        {
          error: error instanceof Error ? pino.stdSerializers.err(error) : error,
        },
        msg
      ),
    warn: (msg: string, extra?: object) => childLogger.warn({ ...extra }, msg),
    debug: (msg: string, extra?: object) => childLogger.debug({ ...extra }, msg),
    complete: (statusCode: number, extra?: object) => {
      const duration = Date.now() - startTime;
      childLogger.info(
        {
          statusCode,
          duration,
          durationMs: duration,
          ...extra,
        },
        `Request completed: ${request.method} ${request.url} - ${statusCode} (${duration}ms)`
      );
    },
  };
};

// Server-only logging utilities (these won't work in browser)
export const logDatabase = (operation: string, table?: string, extra?: Record<string, any>) => {
  if (isBrowser) return createLogger('database');
  return dbLogger.child({
    operation,
    table,
    ...extra,
  });
};

export const logAuth = (userId?: string, action?: string, extra?: Record<string, any>) => {
  if (isBrowser) return createLogger('auth');
  return authLogger.child({
    userId,
    action,
    ...extra,
  });
};

export const logEmail = (to: string, template?: string, extra?: Record<string, any>) => {
  if (isBrowser) return createLogger('email');
  return emailLogger.child({
    to,
    template,
    ...extra,
  });
};

// Error logging utility
export const logError = (error: Error, context?: Record<string, any>) => {
  const errorLogger = context ? logger.child(context) : logger;
  errorLogger.error(
    {
      error: pino.stdSerializers.err(error),
      stack: error.stack,
    },
    error.message
  );
};

// Export the main logger
export default logger;
