import type React from 'react';
import type { Metadata } from 'next';
import { Inter, Josefin_Sans, Quicksand } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ninho Do Amor - Wedding Invitation',
  description: 'Wedding invitation platform for Assa & Eleutério',
  generator: 'Craftmanship by Ping Digital Events',
  metadataBase: new URL('https://pingdigital.online'),
};

const josefin = Josefin_Sans({
  subsets: ['latin'],
  variable: '--font-josefin',
});
const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className={`${josefin.variable} ${quicksand.variable}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
