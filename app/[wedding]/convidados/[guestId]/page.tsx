// app/[wedding]/convidados/[guestId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import WeddingInvitationContent from '@/components/WeddingInvitationContent';
import { getWeddingBySlug } from '@/lib/api-handler';
import { applyWeddingTheme, type WeddingTheme } from '@/lib/theme-config';
import { WeddingData, GuestData } from '@/types/wedding';
import { env } from '@/env';
import { ArrowRight, Heart } from 'lucide-react';
import JHCountdownSection from '@/components/judyhelder/JHCountdownSection';
import JHWeddingHero from '@/components/judyhelder/JHWeddingHero';
import JHFelicitationForm from '@/components/judyhelder/JHFelicitationForm';
import JHFelicitationList from '@/components/judyhelder/JHFelicitationList';
import JHGiftSection from '@/components/judyhelder/JHGiftSection';
import GuestManualPage from '@/app/judyhelder/GuestManual';

export default function GuestInvitationPage() {
  const { wedding, guestId } = useParams() as {
    wedding: string;
    guestId: string;
  };
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [guest, setGuest] = useState<GuestData | null>(null);
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  // Check if we should show the full invitation (with token in URL)
  const showFullInvitation = !!token;

  useEffect(() => {
    if (guestId && wedding) {
      fetchGuestData(guestId, wedding);
      fetchWeddingData(wedding);
    } else {
      setError('Link de convite inválido');
      setIsLoading(false);
    }
  }, [guestId, wedding]);

  useEffect(() => {
    if (!isLoading && guest && weddingData) {
      applyWeddingTheme(
        (weddingData.theme as WeddingTheme) || 'branco-dourado'
      );

      // Only show envelope animation if not showing full invitation
      if (!showFullInvitation) {
        const timer = setTimeout(() => {
          setEnvelopeOpen(true);
          setTimeout(() => setShowInvite(true), 1000);
        }, 2000);
        return () => clearTimeout(timer);
      } else {
        // Show full invitation immediately if token is present
        setEnvelopeOpen(true);
        setShowInvite(true);
      }
    }
  }, [isLoading, guest, weddingData, showFullInvitation]);

  const fetchWeddingData = async (weddingSlug: string) => {
    try {
      const data = await getWeddingBySlug(weddingSlug);
      console.info('Fetched wedding data:', data);
      setWeddingData(data);
    } catch (err) {
      console.error('Erro ao buscar dados do casamento:', err);
      setError('Erro ao carregar dados do casamento');
    }
  };

  const fetchGuestData = async (guestId: string, weddingSlug: string) => {
    try {
      const baseUrl = env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const url = new URL(`${baseUrl}/api/guests/by-url/${guestId}`);
      url.searchParams.append('weddingSlug', weddingSlug);
      const response = await fetch(url.toString(), {
        cache: 'no-store',
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Erro na API' }));
        throw new Error(errorData.error || 'Convidado não encontrado');
      }
      const data = await response.json();
      setGuest(data.guest);
      if (data.warning) setWarning(data.warning);
    } catch (err) {
      console.error('Erro ao buscar dados do convidado:', err);
      setError((err as Error).message || 'Erro ao carregar dados do convidado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewInvitation = () => {
    if (guest?.token) {
      // Navigate to the same page but with token parameter
      router.push(`/${wedding}/convidados/${guestId}?token=${guest.token}`);
    } else {
      setError('Token de convidado não disponível');
    }
  };

  const copyInvitationLink = async () => {
    if (!guest?.token) {
      setError('Link de convite não disponível');
      return;
    }
    const baseUrl = env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const invitationUrl = `${baseUrl}/${wedding}/convidados/${guestId}?token=${guest.token}`;
    try {
      await navigator.clipboard.writeText(invitationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setError('Erro ao copiar o link');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (timeString?: string) => {
    return timeString || '15:00:00';
  };

  const getDayOfWeek = (dateString?: string) => {
    if (!dateString) return 'Sábado';
    return new Date(dateString).toLocaleDateString('pt-PT', {
      weekday: 'long',
    });
  };

  if (isLoading) {
    return (
      <div
        className="wedding-hero min-h-screen"
        data-theme={(weddingData?.theme as WeddingTheme) || 'branco-dourado'}
      >
        <div className="relative flex min-h-screen items-center justify-center">
          <div className="fixed inset-0 opacity-20">
            <Image
              src={`/images/${wedding}-wedding.jpg`}
              alt="Loading..."
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.jpg';
              }}
            />
          </div>
          <div className="wedding-hero-card relative z-10 mx-4 max-w-md rounded-3xl p-12 text-center shadow-2xl">
            <div className="wedding-text-primary mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-current"></div>
            <p className="wedding-text-primary font-blancha text-lg font-medium">
              Carregando seu convite personalizado...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !guest || !weddingData) {
    return (
      <div
        className="wedding-hero min-h-screen"
        data-theme={(weddingData?.theme as WeddingTheme) || 'branco-dourado'}
      >
        <div className="relative flex min-h-screen items-center justify-center p-8">
          <div className="fixed inset-0 opacity-20">
            <Image
              src={`/images/${wedding}-wedding.jpg`}
              alt="Error..."
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.jpg';
              }}
            />
          </div>
          <div className="wedding-hero-card relative z-10 w-full max-w-lg rounded-3xl p-12 text-center shadow-2xl">
            <div className="mb-8 flex justify-center">
              <div className="wedding-button flex h-20 w-20 items-center justify-center rounded-full shadow-2xl">
                <Heart className="h-10 w-10" />
              </div>
            </div>
            <h2 className="wedding-names mb-6 font-blancha text-3xl">
              Convite Não Encontrado
            </h2>
            <p className="wedding-text-secondary mb-8 font-blancha text-lg leading-relaxed">
              {error || 'Este link de convite não é válido ou expirado'}
            </p>
            <Link
              href={`/${wedding}`}
              className="wedding-button inline-flex items-center gap-3 rounded-2xl px-8 py-4 text-white transition-all duration-300 hover:scale-105"
            >
              <ArrowRight className="h-5 w-5" />
              <span className="font-blancha font-semibold">
                Voltar ao Início
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const theme = (weddingData.theme as WeddingTheme) || 'branco-dourado';

  return (
    <div className="wedding-hero min-h-screen" data-theme={theme}>
      <div className="fixed inset-0 z-0">
        <Image
          src={`/images/${wedding}-background.jpg`}
          alt={`${wedding}-background`}
          fill
          className="object-cover opacity-25"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.jpg';
          }}
        />
      </div>

      <div className="relative z-20 flex min-h-screen flex-col items-center justify-start py-8">
        {/* Show WeddingInvitationContent if no token (initial view) */}
        {!showFullInvitation && (
          <WeddingInvitationContent
            wedding={wedding}
            guest={guest}
            weddingData={weddingData}
            envelopeOpen={envelopeOpen}
            setEnvelopeOpen={setEnvelopeOpen}
            showInvite={showInvite}
            handleViewInvitation={handleViewInvitation}
            copyInvitationLink={copyInvitationLink}
            copied={copied}
            warning={warning}
            formatDate={formatDate}
            formatTime={formatTime}
            getDayOfWeek={getDayOfWeek}
          />
        )}

        {/* Show full invitation components if token is present */}
        {showFullInvitation && (
          <>
            <JHWeddingHero
              weddingSlug={wedding}
              guest={guest}
              isLoadingGuest={false}
              weddingData={weddingData}
            />

            <JHCountdownSection weddingData={weddingData} />

            <JHFelicitationForm weddingData={weddingData} />

            <JHFelicitationList weddingData={weddingData} />

            <JHGiftSection weddingData={weddingData} />

            <GuestManualPage />
          </>
        )}
      </div>
    </div>
  );
}
