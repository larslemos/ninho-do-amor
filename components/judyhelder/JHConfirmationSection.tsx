// components/judyhelder/JHConfirmationSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Guest, WeddingData } from '@/types/wedding';
import {
  CheckCircle,
  XCircle,
  Heart,
  Waves,
  Sun,
  AlertCircle,
  Hourglass,
  OctagonX,
} from 'lucide-react';

interface ConfirmationSectionProps {
  guest: Guest | null;
  token: string;
  weddingData?: WeddingData;
  isLoadingGuest?: boolean;
}

export default function JHConfirmationSection({
  guest,
  token,
  weddingData,
  isLoadingGuest = false,
}: ConfirmationSectionProps) {
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animateStatus, setAnimateStatus] = useState(false);
  const { toast } = useToast();

  const theme = weddingData?.theme || 'branco-dourado';

  useEffect(() => {
    if (guest?.status) {
      setConfirmation(guest.status.toLowerCase());
    }
  }, [guest]);

  const fetchGuestData = async () => {
    try {
      const response = await fetch(`/api/guests/verify/${token}`);
      const data = await response.json();

      if (response.ok) {
        setConfirmation(data.convidado.status.toLowerCase());
        setAnimateStatus(true);
        setTimeout(() => setAnimateStatus(false), 600);
      } else {
        setError(data.error || 'Erro ao atualizar dados do convidado');
      }
    } catch (err) {
      console.error('Erro ao buscar dados do convidado:', err);
      setError('Erro ao atualizar dados do convidado');
    }
  };

  const handleConfirm = async (status: 'confirmed' | 'rejected') => {
    if (!token || loading) return;

    // Check if RSVP deadline has passed
    if (guest?.rsvp_deadline && new Date(guest.rsvp_deadline) < new Date()) {
      setError('O prazo para confirmação de presença expirou. Entre em contato com os noivos.');
      toast({
        title: 'Prazo Expirado',
        description: 'Entre em contato diretamente com os noivos.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/guests/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, status }),
      });

      const data = await response.json();

      if (response.ok) {
        setConfirmation(status);
        toast({
          title: 'Confirmação Enviada',
          description: `Você ${
            status === 'confirmed' ? 'confirmou sua presença' : 'indicou que não pode comparecer'
          } com sucesso!`,
        });
        await fetchGuestData();
      } else {
        throw new Error(data.error || 'Erro ao processar a confirmação');
      }
    } catch (err) {
      console.error('Erro ao confirmar presença:', err);
      setError(err instanceof Error ? err.message : 'Erro ao confirmar presença. Tente novamente.');
      toast({
        title: 'Erro',
        description: 'Não foi possível confirmar. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const isRsvpExpired = guest?.rsvp_deadline ? new Date(guest.rsvp_deadline) < new Date() : false;

  return (
    <div className="mx-auto mt-8 w-full max-w-3xl px-4" data-theme={theme}>
      <div className="wedding-hero-card relative overflow-hidden rounded-3xl shadow-2xl">
        {/* Decorative Elements */}

        <div className="absolute bottom-8 left-8 h-20 w-20 opacity-15">
          <Sun className="wedding-decorative-svg h-full w-full" />
        </div>

        <div className="relative z-10 space-y-8 p-8 md:p-12">
          {/* Header */}
          <div className="space-y-6 text-center">
            <div className="flex justify-center"></div>

            <h2 className="wedding-names font-sacramento text-3xl md:text-5xl">
              Confirmação de Presença
            </h2>

            <p className="wedding-text-secondary font-blancha text-base leading-relaxed md:text-lg">
              Por favor, confirme sua presença até{' '}
            </p>

            <div className="wedding-accent-line mx-auto h-0.5 w-24 opacity-30"></div>
          </div>

          {/* Loading State */}
          {isLoadingGuest ? (
            <div className="wedding-info-card rounded-2xl p-8 text-center shadow-lg">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600"></div>
                <p className="wedding-text-secondary font-blancha text-base">
                  Verificando convite...
                </p>
              </div>
            </div>
          ) : guest ? (
            <>
              {/* Error Message */}
              {error && (
                <div className="wedding-info-card rounded-2xl border-2 border-red-200 bg-red-50/90 p-6 shadow-lg animate-in slide-in-from-top">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-6 w-6 flex-shrink-0 text-red-600" />
                    <p className="font-blancha text-sm leading-relaxed text-red-700 md:text-base">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* RSVP Status Badge */}
              <div
                className={`wedding-info-card rounded-2xl p-6 shadow-lg transition-all duration-500 ${
                  animateStatus ? 'scale-105' : ''
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full shadow-md ${
                      confirmation === 'confirmed'
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                        : confirmation === 'rejected'
                          ? 'bg-gradient-to-br from-amber-500 to-yellow-600'
                          : 'bg-gradient-to-br from-gray-400 to-gray-500'
                    }`}
                  >
                    {confirmation === 'confirmed' ? (
                      <CheckCircle className="h-6 w-6 text-white" />
                    ) : confirmation === 'rejected' ? (
                      <XCircle className="h-6 w-6 text-white" />
                    ) : (
                      <Hourglass className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="wedding-text-secondary font-blancha text-sm">Status Atual</p>
                    <p className="wedding-text-primary font-blancha text-lg font-bold md:text-xl">
                      {confirmation === 'confirmed'
                        ? 'Presença Confirmada ✨'
                        : confirmation === 'rejected'
                          ? 'Não Confirmado 💛'
                          : 'Aguardando Confirmação'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {/* Confirm Button */}
                <button
                  onClick={() => handleConfirm('confirmed')}
                  disabled={loading || isRsvpExpired}
                  className={`wedding-button w-full rounded-2xl px-6 py-4 text-white shadow-xl transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 ${
                    confirmation === 'confirmed' ? 'ring-4 ring-green-300' : ''
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    {loading && confirmation !== 'rejected' ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span className="font-blancha text-base font-bold md:text-lg">
                          Confirmando...
                        </span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 flex-shrink-0 md:h-6 md:w-6" />
                        <span className="font-blancha text-base font-bold md:text-lg">
                          {confirmation === 'confirmed'
                            ? '✨ Presença Confirmada'
                            : 'Sim, estarei presente!'}
                        </span>
                      </>
                    )}
                  </div>
                </button>

                {/* Decline Button */}
                <button
                  onClick={() => handleConfirm('rejected')}
                  disabled={loading || isRsvpExpired}
                  className={`w-full rounded-2xl border-2 px-6 py-4 shadow-lg transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 ${
                    confirmation === 'rejected'
                      ? 'wedding-button border-transparent text-white ring-4 ring-amber-300'
                      : 'wedding-guest-card border-gray-300 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    {loading && confirmation !== 'confirmed' ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                        <span className="font-blancha text-base font-bold md:text-lg">
                          Atualizando...
                        </span>
                      </>
                    ) : (
                      <>
                        <OctagonX className="h-5 w-5 flex-shrink-0 md:h-6 md:w-6" />
                        <span
                          className={`font-blancha text-base font-bold md:text-lg ${
                            confirmation === 'rejected' ? 'text-white' : 'wedding-text-primary'
                          }`}
                        >
                          {confirmation === 'rejected'
                            ? '💛 Resposta Registrada'
                            : 'Não posso comparecer'}
                        </span>
                      </>
                    )}
                  </div>
                </button>
              </div>

              {/* RSVP Expired Warning */}
              {isRsvpExpired && (
                <div className="wedding-info-card rounded-2xl border-2 border-amber-200 bg-amber-50/90 p-6 shadow-lg animate-in slide-in-from-bottom">
                  <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                    <AlertCircle className="h-8 w-8 flex-shrink-0 text-amber-600" />
                    <div>
                      <p className="wedding-text-primary mb-2 font-blancha text-base font-bold md:text-lg">
                        📅 Prazo para RSVP Expirado
                      </p>
                      <p className="wedding-text-secondary font-blancha text-sm md:text-base">
                        Entre em contato diretamente com os noivos:{' '}
                        <a
                          href={`mailto:${weddingData?.bride?.toLowerCase()}.${weddingData?.groom?.toLowerCase()}@pingdigital.online`}
                          className="wedding-text-primary font-semibold underline transition-colors hover:text-amber-700"
                        >
                          {weddingData?.bride?.toLowerCase()}.{weddingData?.groom?.toLowerCase()}
                          @pingdigital.online
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* No Guest Found */
            <div className="wedding-info-card rounded-2xl border-2 border-amber-200 bg-amber-50/90 p-8 text-center shadow-lg animate-in zoom-in">
              <div className="mb-6 flex justify-center">
                <div className="wedding-button flex h-16 w-16 items-center justify-center rounded-full shadow-xl">
                  <Heart className="h-8 w-8 text-white" />
                </div>
              </div>
              <p className="wedding-text-primary mb-4 font-blancha text-lg font-bold md:text-xl">
                Convite não encontrado
              </p>
              <p className="wedding-text-secondary mb-6 font-blancha text-sm leading-relaxed md:text-base">
                Não conseguimos encontrar seu convite. Por favor, verifique o link ou entre em
                contato com os noivos.
              </p>
              <a
                href={`mailto:${weddingData?.bride?.toLowerCase()}.${weddingData?.groom?.toLowerCase()}@pingdigital.online`}
                className="wedding-button inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-white shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Heart className="h-5 w-5" />
                <span className="font-blancha font-bold">Contatar Noivos</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
