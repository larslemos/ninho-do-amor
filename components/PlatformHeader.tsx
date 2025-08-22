'use client';

import { useState } from 'react';
import {
  Menu,
  X,
  Users,
  MapPin,
  Gift,
  Calendar,
  BarChart3,
} from 'lucide-react';

export default function PlatformHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: Users,
      title: 'Gestão de Convidados',
      description: 'RSVP e upload de listas',
    },
    {
      icon: MapPin,
      title: 'Mesas e Lugares',
      description: 'Layout 3D interativo',
    },
    {
      icon: Gift,
      title: 'Lista de Presentes',
      description: 'Lojas e transferências',
    },
    { icon: Calendar, title: 'Cronograma', description: 'Timeline do evento' },
    {
      icon: BarChart3,
      title: 'Relatórios',
      description: 'Analytics em tempo real',
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-rose-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-600 to-pink-600">
              <span className="text-sm font-bold text-white">P</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-rose-800">PingDigital</h1>
              <p className="text-xs text-rose-500">
                Wedding Management Platform
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-2 text-rose-600 transition-colors hover:bg-rose-50 md:hidden"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <nav className="hidden items-center gap-6 md:flex">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group flex cursor-pointer items-center gap-2 text-rose-600 transition-colors hover:text-rose-800"
              >
                <feature.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{feature.title}</span>
              </div>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mt-4 border-t border-rose-100 pb-4 md:hidden">
            <nav className="mt-4 space-y-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-rose-50"
                >
                  <feature.icon className="h-5 w-5 text-rose-600" />
                  <div>
                    <h3 className="text-sm font-medium text-rose-800">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-rose-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
