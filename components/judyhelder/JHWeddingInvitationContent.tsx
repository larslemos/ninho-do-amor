'use client';

import { useState, useEffect } from 'react';
import { Mail, Copy, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { GuestData, WeddingData } from '@/types/wedding';

interface JHWeddingInvitationContentProps {
  wedding: string;
  guest: GuestData;
  weddingData?: WeddingData;
  envelopeOpen: boolean;
  setEnvelopeOpen: (open: boolean) => void;
  showInvite: boolean;
  handleViewInvitation: () => void;
  copyInvitationLink: () => void;
  copied: boolean;
  warning?: string;
  formatDate: (dateString?: string) => string;
  formatTime: (timeString?: string) => string;
  getDayOfWeek: (dateString?: string) => string;
}

export default function JHWeddingInvitationContent({
  wedding,
  guest,
  weddingData,
  envelopeOpen,
  setEnvelopeOpen,
  showInvite,
  handleViewInvitation,
  copyInvitationLink,
  copied,
  warning,
  formatDate,
  formatTime,
  getDayOfWeek,
}: JHWeddingInvitationContentProps) {
  const router = useRouter();
  const theme = weddingData?.theme || 'branco-dourado';

  useEffect(() => {
    if (envelopeOpen && showInvite) {
      const timer = setTimeout(() => {
        handleViewInvitation();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [envelopeOpen, showInvite, handleViewInvitation]);

  if (!envelopeOpen) {
    return (
      <div
        className={`wedding-hero-card relative mx-auto w-full max-w-md rounded-3xl p-4 text-center shadow-2xl sm:p-6 md:p-8 ${theme}`}
      >
        <div className="relative z-10 flex h-[300px] items-center justify-center sm:h-[400px] md:h-[500px]">
          <button
            onClick={() => setEnvelopeOpen(true)}
            className="wedding-button flex h-16 w-16 flex-col items-center justify-center rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 sm:h-20 sm:w-20 sm:rounded-3xl md:h-24 md:w-24"
            aria-label="Abrir convite"
          >
            <Mail className="wedding-icon h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" />
            <span className="text-xs font-bold sm:text-sm md:text-base">
              Abrir Convite
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (!showInvite) {
    return (
      <div
        className={`wedding-hero-card relative mx-auto w-full max-w-md rounded-3xl p-4 text-center shadow-2xl sm:p-6 md:p-8 ${theme}`}
      >
        <div className="relative z-10 flex h-[300px] items-center justify-center sm:h-[400px] md:h-[500px]">
          <MailOpen className="wedding-icon h-16 w-16 animate-pulse sm:h-20 sm:w-20 md:h-24 md:w-24" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`wedding-hero-card relative mx-auto w-full max-w-md rounded-3xl p-4 text-center shadow-2xl sm:p-6 md:p-8 ${theme}`}
    >
      <div className="relative z-10">
        <h2 className="wedding-names mb-2 text-xl sm:mb-3 sm:text-2xl md:mb-4 md:text-3xl">
          Convite de {guest.nome}
        </h2>
        {warning && (
          <p className="wedding-text-secondary mb-2 text-sm sm:mb-3 sm:text-base md:mb-4 md:text-lg">
            {warning}
          </p>
        )}
        <div className="mb-2 sm:mb-3 md:mb-4">
          <p className="wedding-text-primary mb-1 text-sm sm:mb-2 sm:text-base md:mb-3 md:text-lg">
            Data: {formatDate(weddingData?.date)} (
            {getDayOfWeek(weddingData?.date)})
          </p>
          <p className="wedding-text-primary text-sm sm:text-base md:text-lg">
            Hora: {formatTime(weddingData?.time)}
          </p>
        </div>
        <button
          onClick={handleViewInvitation}
          className="wedding-button mb-2 inline-flex items-center gap-2 rounded-2xl px-4 py-2 sm:mb-3 sm:px-6 sm:py-3 md:mb-4 md:px-8 md:py-4"
          aria-label="Ver convite completo"
        >
          <Heart className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
          <span className="text-xs font-bold sm:text-sm md:text-base">
            Ver Convite Completo
          </span>
        </button>
        <button
          onClick={copyInvitationLink}
          className="wedding-button inline-flex items-center gap-2 rounded-2xl px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4"
          aria-label="Copiar link do convite"
        >
          {copied ? (
            <>
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              <span className="text-xs font-bold sm:text-sm md:text-base">
                Copiado!
              </span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
              <span className="text-xs font-bold sm:text-sm md:text-base">
                Copiar Link
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
