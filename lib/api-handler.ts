// lib/api-handler.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from './supabase';
import { WeddingData } from '@/types/wedding';

type ApiHandler = (req: NextRequest, params?: any) => Promise<NextResponse>;

// Simple logging for API routes
export function withApiLogging(handler: ApiHandler) {
  return async (req: NextRequest, params?: any) => {
    const startTime = Date.now();

    console.log(`API Request: ${req.method} ${req.url}`);

    try {
      const response = await handler(req, params);

      const duration = Date.now() - startTime;
      console.log(
        `API Response: ${req.method} ${req.url} - ${response.status} (${duration}ms)`
      );

      return response;
    } catch (error) {
      console.error(`API Error: ${req.method} ${req.url}`, error);

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

export async function getWeddingBySlug(
  slug: string
): Promise<WeddingData | null> {
  const { data: wedding, error: weddingError } = await supabase
    .from('weddings')
    .select('id')
    .eq('slug', slug)
    .single();

  if (weddingError || !wedding) {
    console.error('Wedding not found:', { slug, error: weddingError });
    return null;
  }

  const { data: weddingData, error: dataError } = await supabase
    .from('wedding_data')
    .select('*')
    .eq('wedding_id', wedding.id)
    .single();

  if (dataError || !weddingData) {
    console.error('Wedding data not found:', {
      weddingId: wedding.id,
      error: dataError,
    });
    return null;
  }

  return weddingData as WeddingData; // Type assertion based on schema
}
