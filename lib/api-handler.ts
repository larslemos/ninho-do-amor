// lib/api-handler.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiLogger } from '@/lib/logger';
import { loggingMiddleware } from '@/middleware/logger';

type ApiHandler = (req: NextRequest, params?: any) => Promise<NextResponse>;

export function withLogging(handler: ApiHandler) {
  return async (req: NextRequest, params?: any) => {
    const completeRequest = loggingMiddleware(req);

    try {
      const response = await handler(req, params);
      completeRequest(response);
      return response;
    } catch (error) {
      apiLogger.error(
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          url: req.url,
          method: req.method,
        },
        'API Handler error'
      );

      completeRequest(
        NextResponse.json({ error: 'Internal server error' }, { status: 500 })
      );

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
