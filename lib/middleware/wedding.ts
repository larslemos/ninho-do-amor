// lib/middleware/wedding.ts

import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const weddingSlug = request.nextUrl.pathname.split('/')[1];
  if (weddingSlug && ['assaeluterio', 'judyhelder'].includes(weddingSlug)) {
    const response = NextResponse.next();
    response.headers.set('x-wedding-slug', weddingSlug);
    return response;
  }
  return NextResponse.redirect(new URL('/not-found', request.url));
}

export const config = {
  matcher: ['/(:wedding)/:path*'],
};
