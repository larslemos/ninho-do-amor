// components/WeddingInvitationContent.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mail,
  Calendar,
  MapPin,
  Heart,
  ArrowRight,
  Copy,
  CheckCircle,
  Waves,
  Sun,
  User,
  Clock,
  MailOpen,
} from 'lucide-react';

interface WeddingInvitationContentProps {
  wedding: string;
  guest: any;
  weddingData: any;
  envelopeOpen: boolean;
  setEnvelopeOpen: (open: boolean) => void;
  showInvite: boolean;
  handleViewInvitation: () => void;
  copyInvitationLink: () => Promise<void>;
  copied: boolean;
  warning: string | null;
  formatDate: (dateString?: string) => string;
  formatTime: (timeString?: string) => string;
  getDayOfWeek: (dateString?: string) => string;
}

export default function WeddingInvitationContent({
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
}: WeddingInvitationContentProps) {
  useEffect(() => {
    if (!envelopeOpen && showInvite) {
      const timer = setTimeout(() => setEnvelopeOpen(true), 100);
      return () => clearTimeout(timer);
    }
  }, [envelopeOpen, showInvite, setEnvelopeOpen]);

  const theme = (weddingData?.theme as string) || 'branco-dourado';

  return (
    <div className="mx-auto mt-12 w-full max-w-3xl px-4">
      <div className="perspective-1000 relative">
        {/* Envelope Animation */}
        <div
          className={`envelope-back absolute inset-0 transition-all duration-1000 ${
            envelopeOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          <div className="wedding-hero-card rounded-3xl shadow-2xl">
            <div className="flex min-h-[600px] items-center justify-center p-12">
              <div className="space-y-8 text-center">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="envelope-shape wedding-hero-card relative h-56 w-80 overflow-hidden rounded-2xl shadow-xl">
                      <div className="wedding-button envelope-flap absolute inset-x-0 top-0 h-28 opacity-80" />
                      <div className="absolute inset-0 flex items-center justify-center pt-12">
                        <div className="space-y-3 text-center">
                          <div className="flex justify-center">
                            <Heart className="wedding-heart-icon h-10 w-10" />
                          </div>
                          <div className="wedding-names wedding-text-primary font-sacramento text-xl">
                            {weddingData?.bride} & {weddingData?.groom}
                          </div>
                          <div className="wedding-text-secondary font-blancha text-sm">
                            {formatDate(weddingData?.date)}
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-6 left-6 h-8 w-8 opacity-40">
                        <Waves className="wedding-decorative-svg h-full w-full" />
                      </div>
                      <div className="absolute bottom-6 right-6 h-8 w-8 opacity-40">
                        <Sun className="wedding-decorative-svg h-full w-full" />
                      </div>
                    </div>
                    <button
                      onClick={() => setEnvelopeOpen(true)}
                      className="wedding-button absolute -bottom-8 left-1/2 flex h-16 w-16 -translate-x-1/2 transform items-center justify-center rounded-full shadow-2xl"
                    >
                      <Heart className="h-8 w-8 text-white" />
                    </button>
                  </div>
                </div>
                <div className="animate-pulse space-y-4">
                  <MailOpen className="wedding-text-primary mx-auto h-16 w-16" />
                  <h3 className="wedding-names wedding-text-primary font-blancha text-2xl">
                    Seu convite está chegando...
                  </h3>
                  <p className="wedding-text-secondary font-blancha text-lg">Clique para abrir</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Invitation Content */}
        <div
          className={`transform transition-all duration-1000 ${showInvite ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
        >
          <div className="wedding-hero-card relative overflow-hidden rounded-3xl shadow-2xl">
            {/* Decorative Elements */}
            <div className="absolute right-8 top-8 h-24 w-24 opacity-20 md:h-32 md:w-32">
              <Waves className="wedding-decorative-svg h-full w-full" />
            </div>
            <div className="absolute bottom-8 left-8 h-20 w-20 opacity-15">
              <Sun className="wedding-decorative-svg h-full w-full" />
            </div>

            <div className="relative z-10 space-y-12 p-12">
              {/* Header Section */}
              <div className="space-y-8 text-center">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="wedding-info-card flex h-32 w-32 items-center justify-center rounded-full border-4 border-white shadow-2xl md:h-40 md:w-40">
                      <div className="space-y-2 text-center">
                        <div className="wedding-names font-quintella text-4xl md:text-5xl">
                          {`${weddingData?.bride.split('')[0]} & ${weddingData?.groom.split('')[0]}`.toUpperCase()}
                        </div>
                        <div className="wedding-text-secondary font-blancha text-xs font-medium md:text-sm">
                          {formatDate(weddingData?.date)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Welcome Section */}
              <div className="space-y-6 text-center">
                <h2 className="wedding-text-secondary font-blancha text-xl font-light md:text-2xl">
                  Bem-vindo(a) ao nosso casamento
                </h2>
                <h1 className="wedding-names space-y-2 font-quintella text-4xl leading-tight md:text-6xl">
                  {guest.nome.split(' ').map((word, index) => (
                    <div key={index}>{word.toUpperCase()}</div>
                  ))}
                </h1>
                <div className="wedding-text-secondary flex items-center justify-center gap-4 font-blancha">
                  <Heart className="wedding-heart-icon h-6 w-6" />
                  <span className="font-sacramento text-lg md:text-2xl">
                    Você está convidado(a) para celebrar nosso amor
                  </span>
                  <Heart className="wedding-heart-icon h-6 w-6" />
                </div>
              </div>

              {/* Event Details */}
              <div className="wedding-info-card space-y-6 rounded-3xl p-8 font-blancha">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex items-center gap-4">
                    <div className="wedding-button flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="wedding-text-primary text-lg font-bold">
                        {formatDate(weddingData?.date)}
                      </div>
                      <div className="wedding-text-secondary text-sm">
                        {getDayOfWeek(weddingData?.date)} às {formatTime(weddingData?.time)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="wedding-button flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="wedding-text-primary text-lg font-bold">
                        {weddingData?.venue || 'Local do Casamento'}
                      </div>
                      <div className="wedding-text-secondary text-sm">Maputo, Moçambique</div>
                    </div>
                  </div>

                  {guest.mesa && (
                    <div className="flex items-center gap-4">
                      <div className="wedding-button flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg">
                        <User className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="wedding-text-primary text-lg font-bold">
                          Mesa {guest.mesa}
                        </div>
                        <div className="wedding-text-secondary text-sm">Seu lugar reservado</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg ${
                        guest.status === 'confirmed' ? 'wedding-button' : 'bg-amber-500'
                      }`}
                    >
                      {guest.status === 'confirmed' ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <Clock className="h-6 w-6" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="wedding-text-primary text-lg font-bold">
                        {guest.status === 'confirmed' ? 'Confirmado ✨' : 'Aguardando Confirmação'}
                      </div>
                      <div className="wedding-text-secondary text-sm">
                        {guest.status === 'confirmed'
                          ? 'Obrigado por confirmar!'
                          : 'Por favor, confirme sua presença'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning Message */}
              {warning && (
                <div className="wedding-guest-card rounded-2xl border-amber-300 bg-amber-50/80 p-6 font-blancha">
                  <p className="text-lg text-amber-800">⚠️ {warning}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-6">
                <button
                  onClick={handleViewInvitation}
                  className="w-full rounded-2xl bg-amber-500 px-6 py-4 shadow-xl transition-all duration-300 hover:scale-105 sm:px-8 sm:py-6"
                >
                  <div className="flex items-center justify-center gap-4">
                    <Heart className="h-6 w-6 sm:h-8 sm:w-8" />
                    <span className="font-blancha text-2xl font-bold text-white sm:text-xl">
                      Ver Convite Completo
                    </span>
                    <ArrowRight className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                </button>

                <button
                  onClick={copyInvitationLink}
                  className={`w-full rounded-2xl px-6 py-4 shadow-xl transition-all duration-300 ${
                    copied
                      ? 'wedding-button text-white'
                      : 'wedding-guest-card wedding-text-secondary border border-gray-300 hover:bg-gray-50'
                  } sm:px-8 sm:py-6`}
                >
                  <div className="flex items-center justify-center gap-4">
                    {copied ? (
                      <>
                        <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8" />
                        <span className="font-blancha text-lg font-bold sm:text-xl">
                          Link Copiado! ✨
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-6 w-6 sm:h-8 sm:w-8" />
                        <span className="font-blancha text-2xl font-medium sm:text-xl">
                          Compartilhar Convite
                        </span>
                      </>
                    )}
                  </div>
                </button>
              </div>

              {/* RSVP Deadline */}
              {guest.rsvp_deadline && (
                <div className="text-center">
                  <div className="wedding-guest-card inline-flex items-center gap-3 rounded-full px-6 py-3">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <p className="wedding-text-secondary font-blancha text-base">
                      Por favor, confirme até{' '}
                      <span className="wedding-text-primary font-bold">
                        {formatDate(guest.rsvp_deadline)}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className={`mt-8 text-center transition-all delay-700 duration-1000 ${showInvite ? 'opacity-100' : 'opacity-0'} space-y-3`}
      >
        <p className="wedding-text-secondary font-blancha text-lg">
          Com Amor {weddingData?.bride} & {weddingData?.groom} 💎
        </p>
        <p className="wedding-text-secondary font-blancha text-sm opacity-75">
          © 2025 PingDigital - Plataforma de Gestão de Casamentos
        </p>
      </div>
    </div>
  );
}
