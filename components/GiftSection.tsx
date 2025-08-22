// app/components/GiftSection.tsx
'use client';

import { useState } from 'react';
import type { WeddingData } from '@/types/wedding';
import GiftListModal from './GiftListModal';

interface GiftSectionProps {
  weddingData: WeddingData;
}

export default function GiftSection({ weddingData }: GiftSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="mt-6 w-[400px] rounded-xl border border-rose-200 bg-rose-100 p-6 text-center shadow-lg">
        <div className="mb-4">
          <div className="mx-auto mb-3 h-12 w-12 text-rose-600">
            <svg
              aria-hidden="true"
              className="h-full w-full"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <path d="M32 448c0 17.7 14.3 32 32 32h160V320H32v128zm256 32h160c17.7 0 32-14.3 32-32V320H288v160zm192-320h-42.1c6.2-12.1 10.1-25.5 10.1-40 0-48.5-39.5-88-88-88-41.6 0-68.5 21.3-103 68.3-34.5-47-61.4-68.3-103-68.3-48.5 0-88 39.5-88 88 0 14.5 3.8 27.9 10.1 40H32c-17.7 0-32 14.3-32 32v80c0 8.8 7.2 16 16 16h480c8.8 0 16-7.2 16-16v-80c0-17.7-14.3-32-32-32zm-326.1 0c-22.1 0-40-17.9-40-40s17.9-40 40-40c19.9 0 34.6 3.3 86.1 80h-86.1zm206.1 0h-86.1c51.4-76.5 65.7-80 86.1-80 22.1 0 40 17.9 40 40s-17.9 40-40 40z"></path>
            </svg>
          </div>
          <h2 className="mb-4 text-xl font-semibold text-rose-700">
            🎁 Lista de Presentes
          </h2>
        </div>

        <p className="mb-6 leading-relaxed text-rose-500">
          Queridos amigos e familiares, caso queiram presentear{' '}
          {weddingData.wedding_details.bride} &{' '}
          {weddingData.wedding_details.groom}, temos uma lista de sugestões e
          transferência bancária disponível.
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex transform items-center gap-2 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:from-rose-700 hover:to-pink-700 hover:shadow-lg"
        >
          <span>🎁</span>
          Ver Lista de Presentes
        </button>

        <p className="mt-3 text-xs text-rose-400">
          Lista de presentes • Transferência bancária
        </p>
      </div>

      <GiftListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        weddingData={weddingData}
      />
    </>
  );
}
