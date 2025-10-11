// app/[wedding]/convidados/[guestId]/page.tsx

// app/components/judyhelder/JHGiftSection.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Gift, Waves, Sun } from 'lucide-react';
import type { WeddingData } from '@/types/wedding';

interface GiftSectionProps {
  weddingData: WeddingData;
}

export default function JHGiftSection({ weddingData }: GiftSectionProps) {
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const giftModalRef = useRef<HTMLDivElement>(null);
  const bankModalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (
    event: MouseEvent,
    modalSetter: (value: boolean) => void,
    ref: React.RefObject<HTMLDivElement | null>
  ) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      modalSetter(false);
    }
  };

  useEffect(() => {
    if (isGiftModalOpen) {
      document.addEventListener('mousedown', (e) =>
        handleClickOutside(e, setIsGiftModalOpen, giftModalRef)
      );
    }
    return () => {
      document.removeEventListener('mousedown', (e) =>
        handleClickOutside(e, setIsGiftModalOpen, giftModalRef)
      );
    };
  }, [isGiftModalOpen]);

  useEffect(() => {
    if (isBankModalOpen) {
      document.addEventListener('mousedown', (e) =>
        handleClickOutside(e, setIsBankModalOpen, bankModalRef)
      );
    }
    return () => {
      document.removeEventListener('mousedown', (e) =>
        handleClickOutside(e, setIsBankModalOpen, bankModalRef)
      );
    };
  }, [isBankModalOpen]);

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
                onClick={() => setIsGiftModalOpen(true)}
                className="wedding-button w-full rounded-2xl px-8 py-4 text-white shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="font-quicksand">Ver Lista de Presentes</span>
                </div>
              </button>

              <button
                onClick={() => setIsBankModalOpen(true)}
                className="wedding-button w-full rounded-2xl px-8 py-4 text-white shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="font-sangleu">Detalhes Bancários</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gift Voucher Modal */}
      {isGiftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            ref={giftModalRef}
            className="wedding-hero-card relative w-full max-w-md rounded-2xl p-6 text-center shadow-2xl"
          >
            <button
              onClick={() => setIsGiftModalOpen(false)}
              className="absolute right-4 top-4 text-white hover:text-gray-300"
            >
              ✕
            </button>
            <div className="mb-4 flex justify-center">
              <Image
                src="/logos/builders_warehouse_logo.png"
                alt="Builders Warehouse Logo"
                width={100}
                height={30}
                className="object-contain"
              />
            </div>
            <div className="space-y-4">
              <h3 className="wedding-text-secondary font-blancha text-xl font-bold">
                Voucher de Presente
              </h3>
              <p className="wedding-text-primary font-blancha text-lg">
                Voucher presente no Builders Super marés
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bank Details Modal */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            ref={bankModalRef}
            className="wedding-hero-card relative w-full max-w-md rounded-2xl p-6 text-center shadow-2xl"
          >
            <button
              onClick={() => setIsBankModalOpen(false)}
              className="absolute right-4 top-4 text-white hover:text-gray-300"
            >
              ✕
            </button>

            <div className="space-y-4">
              <h3 className="wedding-text-secondary font-blancha text-xl font-bold">
                Detalhes Bancários
              </h3>
              <Image
                src="/logos/BCIlogo.png"
                alt="BCI Logo"
                width={30}
                height={30}
                className="object-contain"
              />
              <p className="wedding-text-primary font-blancha text-lg">
                8498354410001 - Judy Maria de Andrade (BCI)
              </p>
              <Image
                src="/logos/MBim_logo.png"
                alt="MBim Logo"
                width={30}
                height={30}
                className="object-contain"
              />
              <p className="wedding-text-primary font-blancha text-lg">
                248184880 - Judy Maria de Andrade (MBim)
              </p>
              <Image
                src="/logos/SB_logo.jpeg"
                alt="Standard Bank Logo"
                width={30}
                height={30}
                className="object-contain"
              />
              <p className="wedding-text-primary font-blancha text-lg">
                1099424991007 - Judy Maria de Andrade (Standard Bank)
              </p>
              c
              <Image
                src="/logos/M-pesa-logo .png"
                alt="Standard Bank Logo"
                width={30}
                height={30}
                className="object-contain"
              />
              <p className="wedding-text-primary font-blancha text-lg">
                844253977 - Judy Maria de Andrade (MPesa)
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
