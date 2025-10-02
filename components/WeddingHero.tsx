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
import Image from 'next/image';

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
        <div className="relative flex h-[400px] items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 sm:h-[600px] md:h-[800px]">
          <Loader2 className="wedding-loading h-12 w-12 animate-spin sm:h-16 sm:w-16" />
        </div>
      </div>
    );
  }

  if (!weddingData) {
    return (
      <div className="flex h-48 items-center justify-center sm:h-64 md:h-96">
        <p className="wedding-text-primary text-lg font-medium sm:text-xl md:text-2xl">
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
  const theme = weddingData.theme || 'branco-dourado';

  return (
    <div data-theme={theme} className="wedding-hero">
      <div className="wedding-hero-card relative mx-auto w-full max-w-xs overflow-hidden rounded-3xl shadow-2xl sm:max-w-md md:max-w-2xl">
        <div className="relative min-h-[500px] px-4 py-6 sm:min-h-[700px] sm:px-6 sm:py-8 md:min-h-[900px] md:px-10 md:py-10">
          <div className="absolute right-2 top-2 h-16 w-16 opacity-20 sm:right-4 sm:top-4 sm:h-20 sm:w-20 md:right-6 md:top-6 md:h-28 md:w-28">
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

          <div className="absolute bottom-2 left-2 h-20 w-20 opacity-15 sm:bottom-4 sm:left-4 sm:h-24 sm:w-24 md:bottom-6 md:left-6 md:h-36 md:w-36">
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

          <div className="relative z-10 mx-auto flex h-full max-w-[80%] flex-col items-center">
            <div className="mb-4 flex flex-shrink-0 items-center justify-center sm:mb-6 md:mb-12">
              <div className="relative">
                <Image
                  src={`/images/${weddingSlug}-wedding.jpg`}
                  alt={`${weddingData.bride} e ${weddingData.groom}`}
                  className="wedding-photo h-40 w-40 rounded-2xl object-cover shadow-2xl sm:h-52 sm:w-52 sm:rounded-3xl md:h-72 md:w-72"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.jpg';
                  }}
                  width={288}
                  height={288}
                />
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 via-transparent to-transparent sm:rounded-3xl"></div>
              </div>
            </div>

            <div className="mb-4 space-y-4 text-center sm:mb-6 sm:space-y-6 md:mb-12 md:space-y-6">
              <div className="">
                <h1 className="wedding-names text-2xl sm:text-3xl md:text-4xl">
                  {weddingData.bride}
                </h1>
                <div className="my-2 flex items-center justify-center sm:my-4 md:my-6">
                  <div className="wedding-accent-line h-0.5 w-12 rounded-full sm:w-16 md:w-20"></div>
                  <Heart className="wedding-heart-icon mx-2 h-6 w-6 sm:mx-4 sm:h-8 sm:w-8 md:mx-6 md:h-10 md:w-10" />
                  <div className="wedding-accent-line h-0.5 w-12 rounded-full sm:w-16 md:w-20"></div>
                </div>
                <h1 className="wedding-names text-2xl sm:text-3xl md:text-4xl">
                  {weddingData.groom}
                </h1>
              </div>

              <div className="mt-4 px-2 sm:mt-6 sm:px-4 md:mt-8">
                <p className="wedding-invitation-text mx-auto max-w-md text-center text-sm leading-relaxed sm:text-base md:text-lg">
                  {weddingData.invitation_text_portuguese}
                </p>
                <div className="wedding-accent-line mx-auto mt-2 h-0.5 w-12 opacity-50 sm:mt-4 sm:w-16 md:mt-8 md:w-24"></div>
              </div>

              <div className="mt-4 px-2 text-center sm:mt-6 sm:px-4 md:mt-8">
                <div className="relative mx-auto max-w-2xl">
                  <div className="mb-2 flex justify-center sm:mb-4 md:mb-4">
                    <i className="ri-double-quotes-l text-wedding-text-secondary text-2xl opacity-60 sm:text-3xl md:text-4xl"></i>
                  </div>
                  <p className="wedding-bible-text mx-auto px-2 text-center text-sm italic leading-relaxed sm:px-4 sm:text-base md:text-lg md:text-xl lg:text-2xl">
                    "{weddingData.bible_verse}"
                  </p>
                  <div className="mt-2 flex justify-center sm:mt-4 md:mt-4">
                    <i className="ri-double-quotes-r text-wedding-text-secondary text-2xl opacity-60 sm:text-3xl md:text-4xl"></i>
                  </div>
                  <div className="wedding-accent-line mx-auto mt-2 h-0.5 w-12 opacity-50 sm:mt-4 sm:w-16 md:mt-8 md:w-24"></div>
                </div>
              </div>
            </div>

            <div className="mb-4 sm:mb-6 md:mb-12">
              <div className="wedding-info-card space-y-4 rounded-3xl p-4 sm:space-y-6 sm:p-6 md:space-y-6 md:p-8">
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
                  <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                    <Calendar className="wedding-icon text-wedding-text-primary h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
                    <div className="wedding-date-badge rounded-2xl px-2 py-1 text-center sm:px-4 sm:py-2 md:px-6 md:py-3">
                      {dateInfo.day}
                    </div>
                    <span className="wedding-text-secondary text-center text-xs font-semibold uppercase tracking-wider sm:text-sm md:text-base">
                      {dateInfo.month}
                    </span>
                  </div>

                  <div className="hidden h-20 w-px bg-white/30 sm:block"></div>

                  <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                    <Clock className="wedding-icon text-wedding-text-primary h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
                    <span className="wedding-text-primary text-center text-xl font-bold sm:text-2xl md:text-3xl">
                      {weddingData.time}
                    </span>
                    <span className="wedding-text-secondary text-center text-xs font-medium sm:text-sm md:text-base">
                      {weddingData.day_of_week}
                    </span>
                  </div>
                </div>

                <div className="mt-4 border-t border-white/30 pt-2 text-center sm:mt-6 sm:pt-4 md:mt-8 md:pt-6">
                  <MapPin className="wedding-icon text-wedding-text-primary mx-auto h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
                  <p className="font-sacremento text-center text-lg font-semibold sm:text-xl md:text-2xl">
                    {weddingData.venue}
                  </p>
                </div>
              </div>
            </div>

            {guest && (
              <div className="mb-4 sm:mb-6 md:mb-8">
                <div className="wedding-guest-card rounded-2xl border border-white/30 p-3 text-center sm:p-4 md:p-6">
                  <p className="wedding-text-primary mb-1 text-lg font-bold sm:mb-2 sm:text-xl md:mb-2 md:text-2xl">
                    Olá, {guest.nome}!
                  </p>
                  {guest.mesa && (
                    <p className="wedding-text-secondary text-base font-medium sm:text-lg md:text-xl">
                      Mesa: {guest.mesa}
                    </p>
                  )}
                </div>
              </div>
            )}

            {isLoadingGuest && (
              <div className="mb-4 sm:mb-6 md:mb-8">
                <div className="wedding-guest-card rounded-2xl p-3 text-center sm:p-4 md:p-6">
                  <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                    <div className="wedding-text-secondary h-4 w-4 animate-spin rounded-full border-b-2 border-current sm:h-5 sm:w-5 md:h-5 md:w-5"></div>
                    <p className="wedding-text-secondary text-sm sm:text-base md:text-lg">
                      Carregando informações...
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-4 flex flex-col justify-center gap-4 sm:mb-6 sm:flex-row sm:gap-6 md:mb-12 md:gap-8">
              <button
                onClick={handleComoChegar}
                className="wedding-button flex h-32 w-24 flex-col items-center justify-center rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 sm:h-40 sm:w-28 sm:rounded-3xl sm:hover:scale-110 md:h-52 md:w-32"
                aria-label="Como chegar"
              >
                <MapPin className="wedding-icon mb-2 h-6 w-6 sm:mb-3 sm:h-8 sm:w-8 md:mb-4 md:h-10 md:w-10" />
                <span className="px-1 text-center text-xs font-bold leading-tight sm:px-2 sm:text-sm md:text-base">
                  COMO
                  <br />
                  CHEGAR
                </span>
              </button>

              <button
                onClick={handleCerimoniaCivil}
                className="wedding-button flex h-32 w-24 flex-col items-center justify-center rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 sm:h-36 sm:w-28 sm:rounded-3xl sm:hover:scale-110 md:h-40 md:w-36"
                aria-label="Cerimônia Civil"
              >
                <FileText className="wedding-icon mb-2 h-6 w-6 sm:mb-3 sm:h-8 sm:w-8 md:mb-4 md:h-10 md:w-10" />
                <span className="px-1 text-center text-xs font-bold leading-tight sm:px-2 sm:text-sm md:text-base">
                  CERIMÔNIA
                  <br />
                  CIVIL
                </span>
              </button>

              <button
                onClick={handleCerimoniaReligiosa}
                className="wedding-button flex h-32 w-24 flex-col items-center justify-center rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 sm:h-36 sm:w-28 sm:rounded-3xl sm:hover:scale-110 md:h-40 md:w-36"
                aria-label="Cerimônia Religiosa"
              >
                <Heart className="wedding-icon mb-2 h-6 w-6 sm:mb-3 sm:h-8 sm:w-8 md:mb-4 md:h-10 md:w-10" />
                <span className="px-1 text-center text-xs font-bold leading-tight sm:px-2 sm:text-sm md:text-base">
                  CERIMÔNIA
                  <br />
                  RELIGIOSA
                </span>
              </button>
            </div>

            <div className="text-center">
              <div className="wedding-rsvp-badge inline-block rounded-full px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4">
                <p className="text-sm font-bold tracking-wide sm:text-base md:text-lg">
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
