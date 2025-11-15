'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Users, MapPin, Gift, Calendar, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PlatformHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // -------------------------------------------------
  // 1. Extract wedding slug from URL
  // -------------------------------------------------
  // Examples:
  //   /admin/judyhelder/seating   → "judyhelder"
  //   /admin/assaeluterio         → "assaeluterio"
  //   /admin                      → null
  const weddingSlug = pathname
    .split('/')
    .find((segment, i, arr) => arr[i - 1] === 'admin' && segment);

  // -------------------------------------------------
  // 2. Build admin routes with slug
  // -------------------------------------------------
  const buildHref = (base: string) => (weddingSlug ? `/admin/${weddingSlug}${base}` : base);

  const features = [
    {
      icon: Users,
      title: 'Gestão de Convidados',
      description: 'RSVP e upload de listas',
      href: buildHref('/guests'), // → /admin/:wedding/guests
    },
    {
      icon: MapPin,
      title: 'Mesas e Lugares',
      description: 'Layout 3D interativo',
      href: buildHref('/seating'), // → /admin/:wedding/seating
    },
    {
      icon: Gift,
      title: 'Lista de Presentes',
      description: 'Lojas e transferências',
      href: buildHref('/gifts'),
    },
    {
      icon: Calendar,
      title: 'Cronograma',
      description: 'Timeline do evento',
      href: buildHref('/schedule'),
    },
    {
      icon: BarChart3,
      title: 'Relatórios',
      description: 'Analytics em tempo real',
      href: buildHref('/reports'),
    },
  ];

  // -------------------------------------------------
  // 3. Optional: Show wedding name in header
  // -------------------------------------------------
  const weddingDisplayName = weddingSlug
    ? weddingSlug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    : null;

  return (
    <header className="sticky top-0 z-40 border-b border-rose-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo + Wedding Name */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-600 to-pink-600">
              <span className="text-sm font-bold text-white">P</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-rose-800">PingDigital</h1>
              <p className="text-xs text-rose-500">
                Wedding Management Platform
                {weddingDisplayName && (
                  <span className="ml-2 font-medium">– {weddingDisplayName}</span>
                )}
              </p>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-2 text-rose-600 transition-colors hover:bg-rose-50 md:hidden"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {features.map((feature, index) => (
              <Link
                key={index}
                href={feature.href}
                className="group flex cursor-pointer items-center gap-2 text-rose-600 transition-colors hover:text-rose-800"
              >
                <feature.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{feature.title}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mt-4 border-t border-rose-100 pb-4 md:hidden">
            <nav className="mt-4 space-y-3">
              {features.map((feature, index) => (
                <Link
                  key={index}
                  href={feature.href}
                  className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-rose-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <feature.icon className="h-5 w-5 text-rose-600" />
                  <div>
                    <h3 className="text-sm font-medium text-rose-800">{feature.title}</h3>
                    <p className="text-xs text-rose-500">{feature.description}</p>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
