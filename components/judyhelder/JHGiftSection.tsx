//

'use client';

import { useState } from 'react';
import { Gift, Waves, Sun } from 'lucide-react';
import type { WeddingData } from '@/types/wedding';

interface GiftSectionProps {
  weddingData: WeddingData;
}

export default function JHGiftSection({ weddingData }: GiftSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="mx-auto mt-8 w-full max-w-3xl px-4">
        <div className="wedding-hero-card relative overflow-hidden rounded-3xl shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute right-8 top-8 h-24 w-24 opacity-20 md:h-32 md:w-32">
            <Waves className="wedding-decorative-svg h-full w-full" />
          </div>
          <div className="absolute bottom-8 left-8 h-20 w-20 opacity-15">
            <Sun className="wedding-decorative-svg h-full w-full" />
          </div>

          <div className="relative z-10 space-y-8 p-12">
            {/* Header */}
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="wedding-button flex h-20 w-20 items-center justify-center rounded-full shadow-xl">
                  <Gift className="h-10 w-10 text-white" />
                </div>
              </div>
              <h2 className="wedding-text-secondary font-blancha text-xl font-light md:text-2xl">
                Lista de Presentes
              </h2>
            </div>

            {/* Content */}
            <div className="wedding-info-card space-y-6 rounded-3xl p-8">
              <p className="wedding-text-secondary text-center font-blancha text-lg leading-relaxed">
                Queridos amigos e familiares, caso queiram presentear{' '}
                <span className="wedding-names font-sacramento text-2xl">
                  {weddingData.bride}
                </span>{' '}
                &{' '}
                <span className="wedding-names font-sacramento text-2xl">
                  {weddingData.groom}
                </span>
                , temos uma lista de sugestões e transferência bancária
                disponível.
              </p>

              <button
                onClick={() => setIsModalOpen(true)}
                className="wedding-button w-full rounded-2xl px-8 py-4 text-white shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-center gap-3">
                  <Gift className="h-5 w-5" />
                  <span className="font-blancha text-lg font-bold">
                    Ver Lista de Presentes
                  </span>
                </div>
              </button>

              <p className="wedding-text-secondary text-center text-sm">
                Lista de presentes • Transferência bancária
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal would be implemented separately */}
    </>
  );
}
