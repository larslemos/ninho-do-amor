// components/WeddingHero.tsx
'use client';

import {
  MapPin,
  FileText,
  Heart,
  Loader2,
  Calendar,
  Clock,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Guest, WeddingData } from '@/types/wedding';
import { getWeddingBySlug } from '@/lib/api-handler';

interface WeddingHeroProps {
  weddingSlug: string;
  guest: Guest | null;
  isLoadingGuest?: boolean;
  weddingData?: WeddingData;
}

export default function WeddingHero({
  weddingSlug,
  guest,
  isLoadingGuest = false,
  weddingData: initialWeddingData,
}: WeddingHeroProps) {
  const [weddingData, setWeddingData] = useState<WeddingData | null>(
    initialWeddingData || null
  );
  const [isLoadingWedding, setIsLoadingWedding] = useState(true);

  useEffect(() => {
    const fetchWeddingData = async () => {
      if (!initialWeddingData) {
        try {
          const data = await getWeddingBySlug(weddingSlug);
          setWeddingData(data);
        } catch (err) {
          console.error('Erro ao buscar dados do casamento:', err);
        } finally {
          setIsLoadingWedding(false);
        }
      } else {
        setIsLoadingWedding(false);
      }
    };
    fetchWeddingData();
  }, [weddingSlug, initialWeddingData]);

  const handleComoChegar = () => {
    if (weddingData?.venue) {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(weddingData.venue)}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  const handleCerimoniaCivil = () => {
    const civilCeremony = weddingData?.ceremony_types?.find(
      (c) => c.type.toLowerCase() === 'civil'
    );
    if (civilCeremony) {
      console.log('Cerimônia Civil link not implemented');
    }
  };

  const handleCerimoniaReligiosa = () => {
    const religiousCeremony = weddingData?.ceremony_types?.find(
      (c) => c.type.toLowerCase() === 'religious'
    );
    if (religiousCeremony) {
      console.log('Cerimônia Religiosa link not implemented');
    }
  };

  if (isLoadingWedding && !initialWeddingData) {
    return (
      <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="relative flex h-[800px] items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <Loader2 className="wedding-loading h-16 w-16 animate-spin" />
        </div>
      </div>
    );
  }

  if (!weddingData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="wedding-text-primary text-xl font-medium">
          Erro ao carregar dados do casamento
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('pt-PT', { month: 'long' }),
      year: date.getFullYear(),
    };
  };

  const dateInfo = formatDate(weddingData.date);
  const theme = weddingData.theme || 'custom';

  return (
    <div data-theme={theme} className="wedding-hero py-8">
      <div className="wedding-hero-card relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl shadow-2xl">
        <div className="relative min-h-[900px] px-4 py-8">
          {/* Decorative elements with better positioning */}
          <div className="absolute right-8 top-8 h-28 w-28 opacity-20">
            <svg
              viewBox="0 0 100 100"
              className="wedding-decorative-svg h-full w-full"
            >
              <circle cx="20" cy="20" r="8" fill="currentColor" />
              <circle cx="35" cy="15" r="6" fill="currentColor" opacity="0.8" />
              <circle cx="25" cy="35" r="5" fill="currentColor" opacity="0.6" />
              <path
                d="M15 25 Q20 20 25 25 Q30 30 25 35 Q20 30 15 25"
                fill="currentColor"
                opacity="0.4"
              />
            </svg>
          </div>

          <div className="absolute bottom-8 left-8 h-36 w-36 opacity-15">
            <svg
              viewBox="0 0 100 100"
              className="wedding-decorative-svg h-full w-full"
            >
              <circle cx="70" cy="70" r="12" fill="currentColor" />
              <circle cx="55" cy="75" r="8" fill="currentColor" opacity="0.8" />
              <circle cx="75" cy="55" r="6" fill="currentColor" opacity="0.6" />
              <path
                d="M60 60 Q70 50 80 60 Q90 70 80 80 Q70 70 60 60"
                fill="currentColor"
                opacity="0.4"
              />
            </svg>
          </div>

          <div className="relative z-10 mx-auto flex h-full max-w-lg flex-col">
            {/* Couple Photo - Better spacing and sizing */}
            <div className="mb-12 flex flex-shrink-0 items-center justify-center">
              <div className="relative">
                <img
                  src={`/images/${weddingSlug}-wedding.jpg`}
                  alt={`${weddingData.bride} e ${weddingData.groom}`}
                  className="wedding-photo h-72 w-72 rounded-3xl object-cover shadow-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.jpg';
                  }}
                />
                {/* Photo overlay gradient for better text readability */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
            </div>

            {/* Names Section - Improved typography */}
            <div className="mb-12 space-y-6 text-center">
              <div className="space-y-4">
                <h1 className="wedding-names text-6xl font-bold leading-tight">
                  {weddingData.bride}
                </h1>
                <div className="my-6 flex items-center justify-center">
                  <div className="wedding-accent-line h-0.5 w-16 rounded-full"></div>
                  <Heart className="wedding-heart-icon mx-6 h-8 w-8" />
                  <div className="wedding-accent-line h-0.5 w-16 rounded-full"></div>
                </div>
                <h1 className="wedding-names text-6xl font-bold leading-tight">
                  {weddingData.groom}
                </h1>
              </div>

              {/* Invitation text with better spacing */}
              <div className="mt-8 px-4">
                <p className="wedding-invitation-text mx-auto max-w-md text-base leading-relaxed">
                  {weddingData.invitation_text_portuguese}
                </p>
              </div>
            </div>

            {/* Date & Time Information - Better layout */}
            <div className="mb-12">
              <div className="wedding-info-card space-y-6 rounded-3xl p-8">
                <div className="flex items-center justify-center gap-12">
                  <div className="flex flex-col items-center space-y-3">
                    <Calendar className="wedding-text-primary h-6 w-6" />
                    <div className="wedding-date-badge rounded-2xl px-6 py-3 text-4xl font-bold">
                      {dateInfo.day}
                    </div>
                    <span className="wedding-text-secondary text-sm font-semibold uppercase tracking-wider">
                      {dateInfo.month}
                    </span>
                  </div>

                  <div className="h-20 w-px bg-white/30"></div>

                  <div className="flex flex-col items-center space-y-3">
                    <Clock className="wedding-text-primary h-6 w-6" />
                    <span className="wedding-text-primary text-3xl font-bold">
                      {weddingData.time}
                    </span>
                    <span className="wedding-text-secondary text-sm font-medium">
                      {weddingData.day_of_week}
                    </span>
                  </div>
                </div>

                <div className="mt-8 border-t border-white/30 pt-6">
                  <p className="wedding-venue-text text-center text-xl font-semibold">
                    {weddingData.venue}
                  </p>
                </div>
              </div>
            </div>

            {/* Guest Information - Better styling */}
            {guest && (
              <div className="mb-8">
                <div className="wedding-guest-card rounded-2xl border border-white/30 p-6 text-center">
                  <p className="wedding-text-primary mb-2 text-xl font-bold">
                    Olá, {guest.nome}!
                  </p>
                  {guest.mesa && (
                    <p className="wedding-text-secondary text-base font-medium">
                      Mesa: {guest.mesa}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Loading Guest State */}
            {isLoadingGuest && (
              <div className="mb-8">
                <div className="wedding-guest-card rounded-2xl p-6 text-center">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="wedding-text-secondary h-5 w-5 animate-spin rounded-full border-b-2 border-current"></div>
                    <p className="wedding-text-secondary text-base">
                      Carregando informações...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons - Better spacing and sizing */}
            <div className="mb-12 flex justify-center gap-8">
              <button
                onClick={handleComoChegar}
                className="wedding-button flex h-28 w-28 flex-col items-center justify-center rounded-3xl shadow-xl transition-all duration-300 hover:scale-105"
                aria-label="Como chegar"
              >
                <MapPin className="wedding-icon mb-3 h-8 w-8" />
                <span className="px-2 text-center text-xs font-bold leading-tight">
                  COMO
                  <br />
                  CHEGAR
                </span>
              </button>

              <button
                onClick={handleCerimoniaCivil}
                className="wedding-button flex h-28 w-28 flex-col items-center justify-center rounded-3xl shadow-xl transition-all duration-300 hover:scale-105"
                aria-label="Cerimônia Civil"
              >
                <FileText className="wedding-icon mb-3 h-8 w-8" />
                <span className="px-2 text-center text-xs font-bold leading-tight">
                  CERIMÔNIA
                  <br />
                  CIVIL
                </span>
              </button>

              <button
                onClick={handleCerimoniaReligiosa}
                className="wedding-button flex h-28 w-28 flex-col items-center justify-center rounded-3xl shadow-xl transition-all duration-300 hover:scale-105"
                aria-label="Cerimônia Religiosa"
              >
                <Heart className="wedding-icon mb-3 h-8 w-8" />
                <span className="px-2 text-center text-xs font-bold leading-tight">
                  CERIMÔNIA
                  <br />
                  RELIGIOSA
                </span>
              </button>
            </div>

            {/* RSVP Information - Better styling */}
            <div className="text-center">
              <div className="wedding-rsvp-badge inline-block rounded-full px-8 py-4">
                <p className="text-base font-bold tracking-wide">
                  RSVP:{' '}
                  {weddingData.rsvp_numbers?.join(' / ') || 'Não disponível'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
