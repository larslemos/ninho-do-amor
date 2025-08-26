// hooks/useLogger.ts
'use client';

import { useEffect, useRef } from 'react';
import { createLogger } from '@/lib/logger';

export function useLogger(component: string, context?: Record<string, any>) {
  const loggerRef = useRef(createLogger(component, context));

  useEffect(() => {
    loggerRef.current.info('Component mounted');

    return () => {
      loggerRef.current.info('Component unmounted');
    };
  }, []);

  return loggerRef.current;
}
