// app/assaeluterio/convidados/[guestId]/page.tsx
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

interface GuestData {
  id: string;
  nome: string;
  email?: string;
  status: string;
  mesa?: string;
  unique_url: string;
  token: string;
  rsvp_deadline?: string;
}

export default function GuestInvitationPage() {
  const params = useParams();
  const router = useRouter();
  const guestId = params.guestId as string;

  const [guest, setGuest] = useState<GuestData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    if (guestId) {
      fetchGuestData(guestId);
    } else {
      setError('Link de convite inválido');
      setIsLoading(false);
    }
  }, [guestId]);

  useEffect(() => {
    if (!isLoading && guest) {
      // Trigger envelope opening animation after component loads
      const timer = setTimeout(() => {
        setEnvelopeOpen(true);
        setTimeout(() => setShowInvite(true), 800);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, guest]);

  const fetchGuestData = async (guestId: string) => {
    try {
      const response = await fetch(`/api/guests/by-url/${guestId}`);
      const data = await response.json();

      if (response.ok) {
        setGuest(data.guest);
        if (data.warning) {
          setWarning(data.warning);
        }
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
      router.push(`/?token=${guest.token}`);
    } else {
      setError('Token de convidado não disponível');
    }
  };

  const copyInvitationLink = async () => {
    if (!guest?.token) {
      setError('Link de convite não disponível');
      return;
    }
    const baseUrl = env.NEXT_PUBLIC_BASE_URL || 'https://pingdigital.online';
    const invitationUrl = `${baseUrl}/?token=${guest.token}`;
    try {
      await navigator.clipboard.writeText(invitationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setError('Erro ao copiar o link');
    }
  };

  if (isLoading) {
    return (
      <div
        className="relative flex min-h-screen items-center justify-center"
        style={{
          background:
            'linear-gradient(135deg, rgba(240, 249, 255, 0.95), rgba(224, 242, 254, 0.9), rgba(186, 230, 253, 0.85))',
        }}
      >
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/assa-eleuterio-wedding.jpg"
            alt="Assa e Eleutério"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="confirmation-section relative z-10 rounded-2xl p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-sky-500"></div>
          <p className="font-poppins text-sky-600">
            Carregando seu convite personalizado...
          </p>
        </div>
      </div>
    );
  }

  if (error || !guest) {
    return (
      <div
        className="relative flex min-h-screen items-center justify-center p-4"
        style={{
          background:
            'linear-gradient(135deg, rgba(240, 249, 255, 0.95), rgba(224, 242, 254, 0.9), rgba(186, 230, 253, 0.85))',
        }}
      >
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/assa-eleuterio-wedding.jpg"
            alt="Assa e Eleutério"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="confirmation-section relative z-10 w-full max-w-md p-8 text-center shadow-xl">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-lg">
              <Heart className="h-8 w-8" />
            </div>
          </div>
          <h2 className="section-title mb-4 text-xl">Convite Não Encontrado</h2>
          <p className="mb-6 font-quicksand text-slate-600">
            {error || 'Este link de convite não é válido ou expirou'}
          </p>
          <Link
            href="/"
            className="rsvp-button rsvp-confirm inline-flex items-center gap-2 px-6 py-3 text-white transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            Voltar ao Início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen p-4"
      style={{
        background:
          'linear-gradient(135deg, rgba(240, 249, 255, 0.95), rgba(224, 242, 254, 0.9), rgba(186, 230, 253, 0.85))',
      }}
    >
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/assa-eleuterio-wedding.jpg"
          alt="Assa e Eleutério"
          fill
          className="object-cover opacity-25"
          priority
        />
      </div>

      <div className="relative z-20 flex min-h-screen items-center justify-center">
        <div className="mx-auto w-full max-w-2xl">
          {/* Envelope Container */}
          <div className="perspective-1000 relative">
            {/* Envelope Back */}
            <div
              className={`envelope-back absolute inset-0 transition-all duration-1000 ${
                envelopeOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
              }`}
              style={{
                background:
                  'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
                borderRadius: '20px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
            >
              <div className="flex min-h-[600px] items-center justify-center p-8">
                <div className="text-center">
                  {/* Envelope Design */}
                  <div className="mb-8 flex justify-center">
                    <div className="relative">
                      <div
                        className="envelope-shape relative h-48 w-72 overflow-hidden"
                        style={{
                          background:
                            'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)',
                          borderRadius: '8px',
                          boxShadow:
                            '0 10px 30px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                        }}
                      >
                        {/* Envelope Flap */}
                        <div
                          className="absolute inset-x-0 top-0 h-24"
                          style={{
                            background:
                              'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #22d3ee 100%)',
                            clipPath: 'polygon(0 0, 50% 60%, 100% 0)',
                          }}
                        />

                        {/* Envelope Content Preview */}
                        <div className="absolute inset-0 flex items-center justify-center pt-8">
                          <div className="text-center">
                            <div className="mb-2 flex justify-center">
                              <Heart className="h-8 w-8 fill-current text-rose-400" />
                            </div>
                            <div className="font-dancing mb-1 text-2xl text-sky-700">
                              Assa & Eleutério
                            </div>
                            <div className="font-poppins text-sm text-slate-500">
                              30 de Agosto, 2025
                            </div>
                          </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute bottom-4 left-4 h-6 w-6 opacity-30">
                          <Waves className="h-full w-full text-sky-400" />
                        </div>
                        <div className="absolute bottom-4 right-4 h-6 w-6 opacity-30">
                          <Sun className="h-full w-full text-orange-400" />
                        </div>
                      </div>

                      {/* Wax Seal */}
                      <div
                        className="absolute -bottom-6 left-1/2 flex h-12 w-12 -translate-x-1/2 transform items-center justify-center rounded-full"
                        style={{
                          background:
                            'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
                          boxShadow: '0 4px 15px rgba(185, 28, 28, 0.3)',
                        }}
                      >
                        <Heart className="h-6 w-6 fill-current text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="animate-pulse">
                    <MailOpen className="mx-auto mb-4 h-12 w-12 text-sky-500" />
                    <p className="font-poppins mb-2 text-lg text-sky-700">
                      Seu convite está chegando...
                    </p>
                    <p className="font-quicksand text-sm text-sky-600">
                      Clique para abrir
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Invitation Content */}
            <div
              className={`transform transition-all duration-1000 ${
                showInvite
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
            >
              <div className="confirmation-section relative overflow-hidden p-8 md:p-12">
                {/* Decorative Beach Elements */}
                <div className="absolute right-6 top-6 h-20 w-20 opacity-15 md:h-24 md:w-24">
                  <Waves className="h-full w-full text-sky-400" />
                </div>

                <div className="absolute bottom-6 left-6 h-16 w-16 opacity-10">
                  <Sun className="h-full w-full text-orange-400" />
                </div>

                {/* Header Section */}
                <div className="relative z-10 mb-8 text-center">
                  <div className="mb-6 flex justify-center">
                    <div className="relative">
                      <div
                        className="border-3 flex h-28 w-28 items-center justify-center rounded-full shadow-2xl ring-4 ring-sky-100/50 md:h-36 md:w-36"
                        style={{
                          background:
                            'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                          borderColor: 'white',
                        }}
                      >
                        <div className="text-center">
                          <div className="font-poppins mb-1 text-xs font-medium uppercase tracking-wider text-sky-700 md:text-sm">
                            Assa & Eleutério
                          </div>
                          <div className="font-dancing text-3xl text-sky-800 md:text-4xl">
                            A&E
                          </div>
                          <div className="font-poppins text-xs font-medium text-sky-600 md:text-sm">
                            30.08.2025
                          </div>
                        </div>
                      </div>

                      {/* Floating Hearts */}
                      <div
                        className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full shadow-lg"
                        style={{
                          background:
                            'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
                        }}
                      >
                        <Heart className="h-4 w-4 fill-current text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 flex justify-center">
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-full shadow-lg"
                      style={{
                        background:
                          'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                      }}
                    >
                      <Mail className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>

                {/* Welcome Section */}
                <div className="relative z-10 mb-8 text-center">
                  <h2 className="mb-4 font-quicksand text-lg font-light text-sky-700 md:text-xl">
                    Bem-vindo(a) ao nosso casamento
                  </h2>
                  <h1 className="section-title mb-6 text-3xl md:text-5xl">
                    {guest.nome.split(' ').map((word, index) => (
                      <span key={index} className="block">
                        {word.toUpperCase()}
                      </span>
                    ))}
                  </h1>
                  <div className="mb-6 flex items-center justify-center gap-3 text-sky-600">
                    <Heart className="h-5 w-5 fill-current" />
                    <span className="font-poppins text-sm md:text-base">
                      Você está convidado(a) para celebrar nosso amor
                    </span>
                    <Heart className="h-5 w-5 fill-current" />
                  </div>
                </div>

                {/* Event Details */}
                <div className="place-card-enhanced mb-8 p-6">
                  <div className="grid gap-4 text-sm md:grid-cols-2 md:gap-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md"
                        style={{
                          background:
                            'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                        }}
                      >
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-poppins font-semibold text-slate-700">
                          30 de Agosto, 2025
                        </div>
                        <div className="font-quicksand text-xs text-slate-500">
                          Sábado às 13:00
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md"
                        style={{
                          background:
                            'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        }}
                      >
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-poppins font-semibold text-slate-700">
                          Hotel Polana
                        </div>
                        <div className="font-quicksand text-xs text-slate-500">
                          Maputo, Moçambique
                        </div>
                      </div>
                    </div>

                    {guest.mesa && (
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md"
                          style={{
                            background:
                              'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                          }}
                        >
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-poppins font-semibold text-slate-700">
                            Mesa {guest.mesa}
                          </div>
                          <div className="font-quicksand text-xs text-slate-500">
                            Seu lugar reservado
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md`}
                        style={{
                          background:
                            guest.status === 'confirmed'
                              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                              : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        }}
                      >
                        {guest.status === 'confirmed' ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Clock className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-poppins font-semibold text-slate-700">
                          {guest.status === 'confirmed'
                            ? 'Confirmado ✨'
                            : 'Aguardando Confirmação'}
                        </div>
                        <div className="font-quicksand text-xs text-slate-500">
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
                  <div
                    className="mb-6 rounded-lg border border-amber-200 p-4 shadow-inner"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(254, 243, 199, 0.8), rgba(253, 230, 138, 0.8))',
                    }}
                  >
                    <p className="font-poppins text-sm text-amber-800">
                      ⚠️ {warning}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={handleViewInvitation}
                    className="rsvp-button rsvp-confirm w-full transform transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Heart className="icon h-5 w-5 fill-current" />
                      <span className="font-medium">Ver Convite Completo</span>
                      <ArrowRight className="icon h-5 w-5" />
                    </div>
                  </button>

                  <button
                    onClick={copyInvitationLink}
                    className={`rsvp-button w-full transition-all duration-300 ${
                      copied ? 'rsvp-confirmed' : ''
                    }`}
                    style={
                      !copied
                        ? {
                            background:
                              'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                            color: '#475569',
                            borderColor: '#cbd5e1',
                          }
                        : {}
                    }
                  >
                    <div className="flex items-center justify-center gap-3">
                      {copied ? (
                        <>
                          <CheckCircle className="icon h-5 w-5" />
                          <span className="font-medium">Link Copiado! ✨</span>
                        </>
                      ) : (
                        <>
                          <Copy className="icon h-5 w-5" />
                          <span className="font-medium">
                            Compartilhar Convite
                          </span>
                        </>
                      )}
                    </div>
                  </button>
                </div>

                {/* RSVP Deadline */}
                {guest.rsvp_deadline && (
                  <div className="mt-6 text-center">
                    <div className="place-card-enhanced inline-flex items-center gap-2 px-4 py-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <p className="font-poppins text-sm text-slate-600">
                        Por favor, confirme até{' '}
                        <span className="font-semibold text-amber-700">
                          {new Date(guest.rsvp_deadline).toLocaleDateString(
                            'pt-BR',
                            {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            }
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className={`mt-6 text-center transition-all delay-500 duration-1000 ${
              showInvite ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <p className="font-quicksand text-sm text-sky-600/80">
              Com amor, Assa & Eleutério 💙
            </p>
            <p className="font-poppins mt-2 text-xs text-slate-400">
              © 2025 PingDigital - Plataforma de Gestão de Casamentos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
