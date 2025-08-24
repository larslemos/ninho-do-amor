// app/components/GiftSection.tsx
'use client';

import { useState } from 'react';
import { Gift, Waves, Sun } from 'lucide-react';
import type { WeddingData } from '@/types/wedding';
import GiftListModal from './GiftListModal';

interface GiftSectionProps {
  weddingData: WeddingData;
}

export default function GiftSection({ weddingData }: GiftSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animateButton, setAnimateButton] = useState(false);

  const handleButtonClick = () => {
    setAnimateButton(true);
    setIsModalOpen(true);
    setTimeout(() => setAnimateButton(false), 600);
  };

  return (
    <>
      <div className="place-card font-poppins relative mx-auto mt-6 w-full max-w-md rounded-xl p-6 text-center shadow-lg duration-300 animate-in slide-in-from-right sm:mt-8">
        {/* Decorative Beach Elements */}
        <div className="absolute right-0 top-0 h-20 w-20 opacity-10 sm:h-24 sm:w-24">
          <Waves className="h-full w-full text-sky-400" />
        </div>
        <div className="absolute bottom-4 left-4 h-16 w-16 opacity-10 sm:h-20 sm:w-20">
          <Sun className="h-full w-full text-orange-400" />
        </div>

        <div className="place-card-enhanced relative z-10 rounded-lg bg-white/90 p-6 shadow-inner backdrop-blur-sm">
          <div className="mb-4">
            <div className="mx-auto mb-3 h-12 w-12 text-sky-500 sm:h-14 sm:w-14">
              <Gift className="h-full w-full" aria-hidden="true" />
            </div>
            <h2 className="mb-4 flex items-center justify-center gap-2 text-lg font-semibold text-sky-700 sm:text-xl">
              <Gift className="h-6 w-6 text-sky-500" />
              Lista de Presentes
            </h2>
          </div>

          <p className="mb-6 font-quicksand text-sm leading-relaxed text-sky-600 sm:text-base">
            Queridos amigos e familiares, caso queiram presentear{' '}
            <span className="font-dancing text-lg font-semibold text-sky-700">
              {weddingData.wedding_details.bride}
            </span>{' '}
            &{' '}
            <span className="font-dancing text-lg font-semibold text-sky-700">
              {weddingData.wedding_details.groom}
            </span>
            , temos uma lista de sugestões e transferência bancária disponível.
          </p>

          <button
            onClick={handleButtonClick}
            className={`rsvp-button rsvp-confirm inline-flex items-center gap-2 rounded-lg bg-sky-600 px-6 py-3 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-sky-700 active:bg-sky-800 sm:text-base ${
              animateButton ? 'status-change-animation' : ''
            }`}
            aria-label="Ver lista de presentes"
          >
            <Gift className="h-5 w-5" />
            <span>Ver Lista de Presentes</span>
          </button>

          <div className="mt-3 text-xs text-sky-600 sm:text-sm">
            <p className="font-quicksand">
              Lista de presentes • Transferência bancária
            </p>
          </div>
        </div>
      </div>

      <GiftListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        weddingData={weddingData}
      />
    </>
  );
}
