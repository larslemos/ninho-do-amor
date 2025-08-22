// components/ConfirmationSection.tsx
// components/ConfirmationSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Guest, WeddingData } from '@/types/wedding';
import { CheckCircle, XCircle, Table, Heart, Waves, Sun } from 'lucide-react';

interface ConfirmationSectionProps {
  guest: Guest | null;
  token: string;
  weddingData: WeddingData;
  isLoadingGuest?: boolean;
}

export default function ConfirmationSection({
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

    // Check if RSVP deadline has passed (allow if deadline is null)
    if (guest?.rsvp_deadline && new Date(guest.rsvp_deadline) < new Date()) {
      setError(
        'O prazo para confirmação de presença expirou. Entre em contato com os noivos em assa.e.eleuterio@pingdigital.online.'
      );
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
          title: 'Confirmação enviada',
          description: `Você ${
            status === 'confirmed'
              ? 'confirmou sua presença'
              : 'indicou que não pode comparecer'
          } com sucesso!`,
        });
        await fetchGuestData();
      } else {
        throw new Error(data.error || 'Erro ao processar a confirmação');
      }
    } catch (err) {
      console.error('Erro ao confirmar presença:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao confirmar presença. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const isRsvpExpired = guest?.rsvp_deadline
    ? new Date(guest.rsvp_deadline) < new Date()
    : false;

  return (
    <div className="confirmation-section place-card font-poppins relative mx-auto mt-4 w-full max-w-md rounded-xl p-6 text-center shadow-lg sm:mt-6">
      {/* Decorative Beach Elements */}
      <div className="absolute right-0 top-0 h-20 w-20 opacity-10 sm:h-24 sm:w-24">
        <Waves className="h-full w-full text-sky-400" />
      </div>

      <div className="absolute bottom-4 left-4 h-16 w-16 opacity-10">
        <Sun className="h-full w-full text-orange-400" />
      </div>

      <div className="relative z-10">
        <h2 className="section-title mb-4 flex items-center justify-center gap-2">
          <Heart className="h-6 w-6 text-sky-500" />
          Confirmação de Presença
        </h2>

        <p className="mb-6 font-quicksand text-sm leading-relaxed text-slate-600 sm:text-base">
          Confirme sua presença para celebrar o amor de{' '}
          <span className="font-dancing text-lg font-semibold text-sky-700">
            {weddingData.wedding_details.bride}
          </span>{' '}
          &{' '}
          <span className="font-dancing text-lg font-semibold text-sky-700">
            {weddingData.wedding_details.groom}
          </span>
        </p>

        {isLoadingGuest ? (
          <div className="place-card-enhanced rounded-lg p-6 shadow-inner">
            <div className="flex items-center justify-center duration-300 animate-in slide-in-from-right">
              <div className="beach-spinner"></div>
              <p className="font-poppins text-sm text-sky-600">
                Verificando convite...
              </p>
            </div>
          </div>
        ) : guest ? (
          <>
            {error && (
              <div className="font-poppins mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-700 duration-300 animate-in slide-in-from-right">
                <p>{error}</p>
              </div>
            )}

            {/* Enhanced Place Card */}
            <div className="place-card-enhanced relative mb-6 overflow-hidden p-5">
              <div className="absolute right-0 top-0 h-12 w-12 opacity-15">
                <Table className="h-full w-full text-sky-500" />
              </div>
              <div className="relative z-10">
                <div className="mb-3 flex items-center justify-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 text-white shadow-lg">
                    <Table className="h-5 w-5" />
                  </div>
                  <p className="font-poppins text-lg font-semibold text-slate-700">
                    {guest.mesa ? `Mesa ${guest.mesa}` : 'Mesa a ser atribuída'}
                  </p>
                </div>
                <p className="font-quicksand text-sm leading-relaxed text-slate-500">
                  {guest.mesa
                    ? 'Sua mesa está reservada para o grande dia!'
                    : 'Aguarde a atribuição da sua mesa pelos noivos.'}
                </p>
              </div>
            </div>

            {/* Enhanced RSVP Status */}
            <div
              className={`status-badge mb-6 ${
                confirmation === 'confirmed'
                  ? 'status-confirmed'
                  : confirmation === 'rejected'
                    ? 'status-rejected'
                    : 'status-pending'
              } ${animateStatus ? 'status-change-animation' : ''}`}
            >
              <div className="flex items-center justify-center gap-2">
                {confirmation === 'confirmed' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : confirmation === 'rejected' ? (
                  <XCircle className="h-5 w-5" />
                ) : (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                <span className="font-medium">
                  Status:{' '}
                  {confirmation === 'confirmed'
                    ? 'Presença Confirmada ✨'
                    : confirmation === 'rejected'
                      ? 'Não Confirmado 💙'
                      : 'Aguardando Confirmação'}
                </span>
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => handleConfirm('confirmed')}
                disabled={loading || isRsvpExpired}
                className={`rsvp-button w-full ${
                  confirmation === 'confirmed'
                    ? 'rsvp-confirmed'
                    : loading && confirmation !== 'rejected'
                      ? 'rsvp-loading'
                      : 'rsvp-confirm'
                } transition-all duration-300 ease-out`}
                aria-label="Confirmar presença no casamento"
              >
                <div className="flex items-center justify-center gap-3">
                  {loading && confirmation !== 'rejected' ? (
                    <>
                      <div className="beach-spinner"></div>
                      <span>Confirmando sua presença...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="icon h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">
                        {confirmation === 'confirmed'
                          ? '✨ Presença Confirmada'
                          : 'Sim, estarei presente!'}
                      </span>
                    </>
                  )}
                </div>
              </button>

              <button
                onClick={() => handleConfirm('rejected')}
                disabled={loading || isRsvpExpired}
                className={`rsvp-button w-full ${
                  confirmation === 'rejected'
                    ? 'rsvp-rejected'
                    : loading && confirmation !== 'confirmed'
                      ? 'rsvp-loading'
                      : 'rsvp-decline'
                } transition-all duration-300 ease-out`}
                aria-label="Informar que não pode comparecer"
              >
                <div className="flex items-center justify-center gap-3">
                  {loading && confirmation !== 'confirmed' ? (
                    <>
                      <div className="beach-spinner"></div>
                      <span>Atualizando resposta...</span>
                    </>
                  ) : (
                    <>
                      <Heart className="icon h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">
                        {confirmation === 'rejected'
                          ? '💙 Resposta registrada'
                          : 'Não posso comparecer'}
                      </span>
                    </>
                  )}
                </div>
              </button>
            </div>

            {isRsvpExpired && (
              <div className="mt-6 rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-inner duration-300 animate-in slide-in-from-right">
                <p className="font-poppins text-sm leading-relaxed text-amber-800">
                  <span className="font-semibold">
                    📅 Prazo para RSVP expirado
                  </span>
                  <br />
                  Entre em contato diretamente:{' '}
                  <a
                    href="mailto:assa.e.eleuterio@pingdigital.online"
                    className="font-medium underline transition-colors hover:text-amber-900"
                  >
                    assa.e.eleuterio@pingdigital.online
                  </a>
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-lg border border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 p-6 text-orange-700 shadow-inner duration-300 animate-in slide-in-from-right">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-white">
                <Heart className="h-6 w-6" />
              </div>
            </div>
            <p className="font-poppins mb-3 text-base font-medium leading-relaxed">
              Convite não encontrado para este link.
            </p>
            <p className="font-quicksand text-sm">
              Verifique o link ou entre em contato com os noivos:{' '}
              <a
                href="mailto:assa.e.eleuterio@pingdigital.online"
                className="font-medium underline transition-colors hover:text-orange-800"
              >
                assa.e.eleuterio@pingdigital.online
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
