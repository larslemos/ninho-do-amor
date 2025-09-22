// app/[wedding]/convidados/[guestId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { env } from '@/env';
import { getWeddingBySlug } from '@/lib/api-handler';
import { applyWeddingTheme, type WeddingTheme } from '@/lib/theme-config';
import WeddingHero from '@/components/WeddingHero';
import { WeddingData } from '@/types/wedding';

interface GuestData {
  id: string;
  nome: string;
  email?: string;
  status: string;
  mesa?: string;
  unique_url: string;
  token: string;
  rsvp_deadline?: string;
  wedding_id: string;
}

export default function GuestInvitationPage() {
  const { wedding, guestId } = useParams() as {
    wedding: string;
    guestId: string;
  };
  const router = useRouter();

  const [guest, setGuest] = useState<GuestData | null>(null);
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

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
      // Apply theme based on wedding data, default to 'branco-dourado'
      applyWeddingTheme(
        (weddingData.theme as WeddingTheme) || 'branco-dourado'
      );

      const timer = setTimeout(() => {
        setEnvelopeOpen(true);
        setTimeout(() => setShowInvite(true), 800);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, guest, weddingData]);

  const fetchWeddingData = async (weddingSlug: string) => {
    try {
      const data = await getWeddingBySlug(weddingSlug);
      setWeddingData(data);
    } catch (err) {
      console.error('Erro ao buscar dados do casamento:', err);
    }
  };

  const fetchGuestData = async (guestId: string, weddingSlug: string) => {
    try {
      const response = await fetch(
        `/api/guests/by-url/${guestId}?weddingSlug=${weddingSlug}`
      );
      const data = await response.json();

      if (response.ok) {
        setGuest(data.guest);
        if (data.warning) setWarning(data.warning);
      } else {
        setError(data.error || 'Convidado não encontrado');
      }
    } catch (err) {
      console.error('Erro ao buscar dados do convidado:', err);
      setError('Erro ao carregar dados do convidado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewInvitation = () => {
    if (guest?.token) {
      router.push(`/${wedding}/?token=${guest.token}`);
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
    const invitationUrl = `${baseUrl}/${wedding}/?token=${guest.token}`;
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
    if (!dateString) return new Date().toLocaleDateString('pt-BR');
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (timeString?: string) => {
    return timeString || '15:00';
  };

  const getDayOfWeek = (dateString?: string) => {
    if (!dateString) return 'Segunda-feira';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
    });
  };

  if (isLoading) {
    return (
      <div
        className="wedding-hero min-h-screen"
        data-theme={weddingData?.theme || 'branco-dourado'}
      >
        <div className="relative flex min-h-screen items-center justify-center">
          <div className="fixed inset-0 opacity-20">
            <Image
              src={`/images/${wedding}-wedding.jpg`}
              alt="Loading..."
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="wedding-hero-card relative z-10 mx-4 max-w-md rounded-3xl p-12 text-center shadow-2xl">
            <div className="wedding-text-primary mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-current"></div>
            <p className="wedding-text-primary text-lg font-medium">
              Carregando seu convite personalizado...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !guest) {
    return (
      <div
        className="wedding-hero min-h-screen"
        data-theme={weddingData?.theme || 'branco-dourado'}
      >
        <div className="relative flex min-h-screen items-center justify-center p-8">
          <div className="fixed inset-0 opacity-20">
            <Image
              src={`/images/${wedding}-wedding.jpg`}
              alt="Error..."
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="wedding-hero-card relative z-10 w-full max-w-lg rounded-3xl p-12 text-center shadow-2xl">
            <div className="mb-8 flex justify-center">
              <div className="wedding-button flex h-20 w-20 items-center justify-center rounded-full shadow-2xl">
                <Heart className="h-10 w-10" />
              </div>
            </div>
            <h2 className="wedding-names mb-6 text-3xl">
              Convite Não Encontrado
            </h2>
            <p className="wedding-text-secondary mb-8 text-lg leading-relaxed">
              {error || 'Este link de convite não é válido ou expirou'}
            </p>
            <Link
              href={`/${wedding}`}
              className="wedding-button inline-flex items-center gap-3 rounded-2xl px-8 py-4 text-white transition-all duration-300 hover:scale-105"
            >
              <ArrowRight className="h-5 w-5" />
              <span className="font-semibold">Voltar ao Início</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const theme = (weddingData?.theme as WeddingTheme) || 'branco-dourado';

  return (
    <div className="wedding-hero min-h-screen" data-theme={theme}>
      <div className="fixed inset-0 z-0">
        <Image
          src={`/images/${wedding}-background.jpg`}
          alt={`${wedding}-background`}
          fill
          className="object-cover opacity-25"
          priority
        />
      </div>

      <div className="relative z-20 flex min-h-screen flex-col items-center justify-start py-8">
        <WeddingHero
          weddingSlug={wedding}
          guest={guest}
          isLoadingGuest={false}
          weddingData={weddingData}
        />

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
                              <div className="wedding-names wedding-text-primary text-2xl">
                                {weddingData?.bride} & {weddingData?.groom}
                              </div>
                              <div className="wedding-text-secondary text-sm font-medium">
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
                        <div className="wedding-button absolute -bottom-8 left-1/2 flex h-16 w-16 -translate-x-1/2 transform items-center justify-center rounded-full shadow-2xl">
                          <Heart className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="animate-pulse space-y-4">
                      <MailOpen className="wedding-text-primary mx-auto h-16 w-16" />
                      <h3 className="wedding-names wedding-text-primary text-2xl">
                        Seu convite está chegando...
                      </h3>
                      <p className="wedding-text-secondary text-lg">
                        Clique para abrir
                      </p>
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
                            <div className="wedding-text-secondary text-xs font-bold uppercase tracking-wider md:text-sm">
                              {weddingData?.bride} & {weddingData?.groom}
                            </div>
                            <div className="wedding-names text-4xl md:text-5xl">
                              {`${weddingData?.bride[0]} & ${weddingData?.groom[0]}`.toUpperCase()}
                            </div>
                            <div className="wedding-text-secondary text-xs font-medium md:text-sm">
                              {formatDate(weddingData?.date)}
                            </div>
                          </div>
                        </div>
                        <div className="wedding-button absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full shadow-lg">
                          <Heart className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="wedding-button flex h-20 w-20 items-center justify-center rounded-full shadow-xl">
                        <Mail className="h-10 w-10 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Welcome Section */}
                  <div className="space-y-6 text-center">
                    <h2 className="wedding-text-secondary text-xl font-light md:text-2xl">
                      Bem-vindo(a) ao nosso casamento
                    </h2>
                    <h1 className="wedding-names space-y-2 text-4xl leading-tight md:text-6xl">
                      {guest.nome.split(' ').map((word, index) => (
                        <div key={index}>{word.toUpperCase()}</div>
                      ))}
                    </h1>
                    <div className="wedding-text-secondary flex items-center justify-center gap-4">
                      <Heart className="wedding-heart-icon h-6 w-6" />
                      <span className="text-lg md:text-xl">
                        Você está convidado(a) para celebrar nosso amor
                      </span>
                      <Heart className="wedding-heart-icon h-6 w-6" />
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="wedding-info-card space-y-6 rounded-3xl p-8">
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
                            {getDayOfWeek(weddingData?.date)} às{' '}
                            {formatTime(weddingData?.time)}
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
                          <div className="wedding-text-secondary text-sm">
                            Maputo, Moçambique
                          </div>
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
                            <div className="wedding-text-secondary text-sm">
                              Seu lugar reservado
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg ${
                            guest.status === 'confirmed'
                              ? 'wedding-button'
                              : 'bg-amber-500'
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
                            {guest.status === 'confirmed'
                              ? 'Confirmado ✨'
                              : 'Aguardando Confirmação'}
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
                    <div className="wedding-guest-card rounded-2xl border-amber-300 bg-amber-50/80 p-6">
                      <p className="text-lg text-amber-800">⚠️ {warning}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-6">
                    <button
                      onClick={handleViewInvitation}
                      className="wedding-button w-full rounded-2xl px-8 py-6 text-white shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex items-center justify-center gap-4">
                        <Heart className="h-6 w-6" />
                        <span className="text-lg font-bold">
                          Ver Convite Completo
                        </span>
                        <ArrowRight className="h-6 w-6" />
                      </div>
                    </button>

                    <button
                      onClick={copyInvitationLink}
                      className={`w-full rounded-2xl px-8 py-6 shadow-xl transition-all duration-300 ${
                        copied
                          ? 'wedding-button text-white'
                          : 'wedding-guest-card wedding-text-secondary border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-4">
                        {copied ? (
                          <>
                            <CheckCircle className="h-6 w-6" />
                            <span className="text-lg font-bold">
                              Link Copiado! ✨
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-6 w-6" />
                            <span className="text-lg font-medium">
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
                        <p className="wedding-text-secondary text-base">
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
            <p className="wedding-text-secondary text-lg">
              Com Amor {weddingData?.bride} & {weddingData?.groom} 💎
            </p>
            <p className="wedding-text-secondary text-sm opacity-75">
              © 2025 PingDigital - Plataforma de Gestão de Casamentos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
