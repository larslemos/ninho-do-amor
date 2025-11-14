// app/layout.tsx

import type React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: 'Ninho Do Amor - Convite de Casamento',
  description:
    'Convite de casamento personalizado para celebrar o amor - Plataforma Ninho Do Amor por Ping Digital Events',
  generator: 'Craftmanship by Ping Digital Events',
  metadataBase: new URL('https://pingdigital.online'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>
        {children}
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
