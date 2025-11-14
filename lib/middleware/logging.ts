// lib/middleware/logging.ts

import { NextRequest, NextResponse } from 'next/server';
import { logRequest } from '@/lib/logger';

export function withLogging(handler: (req: NextRequest) => Promise<NextResponse | Response>) {
  return async (req: NextRequest): Promise<NextResponse | Response> => {
    const startTime = Date.now();
    const requestLogger = logRequest(req, startTime);

    // Extract wedding slug from the URL
    const weddingSlug = req.nextUrl.pathname.split('/')[1];

    // Log incoming request with wedding context
    requestLogger.info('Incoming request', {
      userAgent: req.headers.get('user-agent'),
      ip: req.ip || req.headers.get('x-forwarded-for'),
      referrer: req.headers.get('referer'),
      weddingSlug,
    });

    try {
      const response = await handler(req);

      // Log successful response
      requestLogger.complete(response.status, {
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length'),
      });

      return response;
    } catch (error) {
      // Log error response
      requestLogger.error('Request failed', error);

      // Return error response
      const errorResponse = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });

      requestLogger.complete(500, { error: true });

      return errorResponse;
    }
  };
}

// Helper for API routes
export function createAPILogger(route: string) {
  return {
    info: (message: string, data?: object) => {
      logRequest(new Request(`/api/${route}`)).info(message, data);
    },
    error: (message: string, error?: Error | object) => {
      logRequest(new Request(`/api/${route}`)).error(message, error);
    },
    warn: (message: string, data?: object) => {
      logRequest(new Request(`/api/${route}`)).warn(message, data);
    },
  };
}
