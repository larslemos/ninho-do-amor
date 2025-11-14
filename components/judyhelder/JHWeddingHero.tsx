// components/judyhelder/JHWeddingHero.tsx
'use client';

import { MapPin, FileText, Heart, Loader2, Calendar, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Guest, WeddingData } from '@/types/wedding';
import { getWeddingBySlug } from '@/lib/api-handler';
import Image from 'next/image';
import JHWeddingTimeline from './JHWeddingTimeline';
import JHWeddingReligious from './JHWeddingReligious';

interface JHWeddingHeroProps {
  weddingSlug: string;
  guest: Guest | null;
  isLoadingGuest?: boolean;
  weddingData?: WeddingData;
}

export default function JHWeddingHero({
  weddingSlug,
  guest,
  isLoadingGuest = false,
  weddingData: initialWeddingData,
}: JHWeddingHeroProps) {
  const [weddingData, setWeddingData] = useState<WeddingData | null>(initialWeddingData || null);
  const [isLoadingWedding, setIsLoadingWedding] = useState(true);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isReligiousOpen, setIsReligiousOpen] = useState(false);

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
    setIsTimelineOpen(true);
    if (civilCeremony) {
      console.log('Cerimônia Civil link not implemented');
    }
  };

  const handleCerimoniaReligiosa = () => {
    const religiousCeremony = weddingData?.ceremony_types?.find(
      (c) => c.type.toLowerCase() === 'religious'
    );
    setIsReligiousOpen(true);
    if (religiousCeremony) {
      console.log('Cerimônia Religiosa link not implemented');
    }
  };

  if (isLoadingWedding && !initialWeddingData) {
    return (
      <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-lg">
        <div className="relative flex h-[300px] items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 sm:h-[500px] md:h-[700px]">
          <Loader2 className="wedding-loading h-10 w-10 animate-spin sm:h-12 sm:w-12 md:h-16 md:w-16" />
        </div>
      </div>
    );
  }

  if (!weddingData) {
    return (
      <div className="flex h-32 items-center justify-center sm:h-48 md:h-64">
        <p className="wedding-text-primary text-base font-medium sm:text-lg md:text-xl">
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
    <div data-theme={theme} className="wedding-hero py-2 sm:py-4 md:py-6">
      <div className="wedding-hero-card relative mx-auto w-full max-w-xs overflow-hidden rounded-3xl shadow-lg sm:max-w-md md:max-w-2xl">
        <div className="relative min-h-[400px] px-2 py-2 sm:min-h-[600px] sm:px-4 sm:py-4 md:min-h-[800px] md:px-6 md:py-6">
          <div className="absolute right-2 top-2 h-12 w-12 opacity-20 sm:right-4 sm:top-4 sm:h-16 sm:w-16 md:right-6 md:top-6 md:h-20 md:w-20">
            <svg viewBox="0 0 100 100" className="wedding-decorative-svg h-full w-full">
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

          <div className="absolute bottom-2 left-2 h-16 w-16 opacity-15 sm:bottom-4 sm:left-4 sm:h-20 sm:w-20 md:bottom-6 md:left-6 md:h-24 md:w-24">
            <svg viewBox="0 0 100 100" className="wedding-decorative-svg h-full w-full">
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

          <div className="relative z-10 mx-auto flex h-full max-w-[85%] flex-col items-center">
            <div className="mb-2 flex flex-shrink-0 items-center justify-center sm:mb-4 md:mb-6">
              <div className="relative">
                <Image
                  src={`/images/${weddingSlug}-wedding.jpg`}
                  alt={`${weddingData.bride} e ${weddingData.groom}`}
                  className="wedding-photo h-32 w-32 rounded-2xl object-cover shadow-lg sm:h-40 sm:w-40 sm:rounded-3xl md:h-56 md:w-56"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.jpg';
                  }}
                  width={224}
                  height={224}
                />
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 via-transparent to-transparent sm:rounded-3xl"></div>
              </div>
            </div>

            <div className="mb-2 space-y-2 text-center sm:mb-4 sm:space-y-3 md:mb-6 md:space-y-4">
              <div className="">
                <h1 className="wedding-names text-3xl sm:text-4xl md:text-5xl">
                  {weddingData.bride}
                </h1>
                <div className="my-1 flex items-center justify-center sm:my-2 md:my-3">
                  <div className="wedding-accent-line h-0.5 w-10 rounded-full sm:w-12 md:w-16"></div>
                  <Heart className="wedding-heart-icon mx-1 h-4 w-4 sm:mx-2 sm:h-6 sm:w-6 md:mx-4 md:h-8 md:w-8" />
                  <div className="wedding-accent-line h-0.5 w-10 rounded-full sm:w-12 md:w-16"></div>
                </div>
                <h1 className="wedding-names text-3xl sm:text-4xl md:text-5xl">
                  {weddingData.groom}
                </h1>
              </div>
              <div className="wedding-accent-line mx-auto mt-6 h-0.5 w-12 opacity-50 sm:mt-2 sm:w-12 md:mt-4 md:w-20"></div>

              <div className="mt-2 px-1 sm:mt-3 sm:px-2 md:mt-4">
                <p className="wedding-invitation-text mx-auto max-w-md text-center text-xs leading-relaxed sm:text-sm md:text-base">
                  {weddingData.invitation_text_portuguese}
                </p>
                <div className="wedding-accent-line mx-auto mt-6 h-0.5 w-12 opacity-50 sm:mt-2 sm:w-12 md:mt-4 md:w-20"></div>
              </div>

              <div className="mt-2 px-1 text-center sm:mt-3 sm:px-2 md:mt-4">
                <div className="relative mx-auto max-w-2xl">
                  <div className="mb-1 flex justify-center sm:mb-2 md:mb-2">
                    <i className="ri-double-quotes-l text-wedding-text-secondary text-xl opacity-60 sm:text-2xl md:text-3xl"></i>
                  </div>
                  <p className="wedding-bible-text mx-auto px-1 text-center text-xs italic leading-relaxed sm:px-2 sm:text-sm md:text-base md:text-lg lg:text-xl">
                    "{weddingData.bible_verse}"
                  </p>
                  <div className="mt-1 flex justify-center sm:mt-2 md:mt-2">
                    <i className="ri-double-quotes-r text-wedding-text-secondary text-xl opacity-60 sm:text-2xl md:text-3xl"></i>
                  </div>
                  <div className="wedding-accent-line mx-auto mt-6 h-0.5 w-12 opacity-50 sm:mt-2 sm:w-12 md:mt-4 md:w-20"></div>
                </div>
              </div>
            </div>

            <div className="mb-2 sm:mb-4 md:mb-6">
              <div className="wedding-info-card space-y-2 rounded-3xl p-2 sm:space-y-3 sm:p-4 md:space-y-4 md:p-6">
                <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
                  <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                    <Calendar className="wedding-icon text-wedding-text-primary h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                    <div className="wedding-date-badge rounded-2xl px-1 py-1 text-center sm:px-2 sm:py-1 md:px-4 md:py-2">
                      {dateInfo.day}
                    </div>
                    <span className="wedding-text-secondary text-center text-xs font-semibold uppercase tracking-wider sm:text-sm md:text-base">
                      {dateInfo.month}
                    </span>
                  </div>

                  <div className="hidden h-12 w-px bg-white/30 sm:block sm:h-16 md:h-20"></div>

                  <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                    <Clock className="wedding-icon text-wedding-text-primary h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                    <span className="wedding-text-primary text-center text-lg font-bold sm:text-xl md:text-2xl">
                      {weddingData.time}
                    </span>
                    <span className="wedding-text-secondary text-center text-xs font-medium sm:text-sm md:text-base">
                      {weddingData.day_of_week}
                    </span>
                  </div>
                </div>

                <div className="mt-2 border-t border-white/30 pt-1 text-center sm:mt-3 sm:pt-2 md:mt-4 md:pt-4">
                  <MapPin className="wedding-icon text-wedding-text-primary mx-auto h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  <p className="wedding-venue-text text-center text-base font-semibold sm:text-lg md:text-xl">
                    {weddingData.venue}
                  </p>
                </div>
              </div>
            </div>

            {guest && (
              <div className="mb-2 sm:mb-4 md:mb-6">
                <div className="wedding-guest-card rounded-2xl border border-white/30 p-2 text-center sm:p-3 md:p-4">
                  <p className="wedding-text-primary mb-1 text-base font-bold sm:mb-1 sm:text-lg md:mb-2 md:text-xl">
                    Olá, {guest.nome}!
                  </p>
                  {guest.mesa && (
                    <p className="wedding-text-secondary text-sm font-medium sm:text-base md:text-lg">
                      Mesa: {guest.mesa}
                    </p>
                  )}
                </div>
              </div>
            )}

            {isLoadingGuest && (
              <div className="mb-2 sm:mb-4 md:mb-6">
                <div className="wedding-guest-card rounded-2xl p-2 text-center sm:p-3 md:p-4">
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                    <div className="wedding-text-secondary h-3 w-3 animate-spin rounded-full border-b-2 border-current sm:h-4 sm:w-4 md:h-5 md:w-5"></div>
                    <p className="wedding-text-secondary text-sm sm:text-base md:text-lg">
                      Carregando informações...
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-2 flex flex-col justify-center gap-2 sm:mb-4 sm:flex-row sm:gap-3 md:mb-6 md:gap-4">
              <button
                onClick={handleComoChegar}
                className="wedding-button flex h-24 w-20 flex-col items-center justify-center rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 sm:h-28 sm:w-24 sm:rounded-3xl sm:hover:scale-110 md:h-32 md:w-28"
                aria-label="Como chegar"
              >
                <MapPin className="wedding-icon mb-1 h-4 w-4 sm:mb-2 sm:h-6 sm:w-6 md:mb-3 md:h-8 md:w-8" />
                <span className="px-1 text-center text-xs font-bold leading-tight sm:px-2 sm:text-sm md:text-base">
                  Como
                  <br />
                  Chegar
                </span>
              </button>

              <button
                onClick={handleCerimoniaCivil}
                className="wedding-button flex h-24 w-20 flex-col items-center justify-center rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 sm:h-28 sm:w-24 sm:rounded-3xl sm:hover:scale-110 md:h-32 md:w-28"
                aria-label="Cerimônia Civil"
              >
                <FileText className="wedding-icon mb-1 h-4 w-4 sm:mb-2 sm:h-6 sm:w-6 md:mb-3 md:h-8 md:w-8" />
                <span className="px-1 text-center text-xs font-bold leading-tight sm:px-2 sm:text-sm md:text-base">
                  Cerimônia
                  <br />
                  Civil
                </span>
              </button>

              {isTimelineOpen && (
                <JHWeddingTimeline
                  isOpen={isTimelineOpen}
                  onClose={() => setIsTimelineOpen(false)}
                />
              )}

              <button
                onClick={handleCerimoniaReligiosa}
                className="wedding-button flex h-24 w-20 flex-col items-center justify-center rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 sm:h-28 sm:w-24 sm:rounded-3xl sm:hover:scale-110 md:h-32 md:w-28"
                aria-label="Cerimônia Religiosa"
              >
                <Heart className="wedding-icon mb-1 h-4 w-4 sm:mb-2 sm:h-6 sm:w-6 md:mb-3 md:h-8 md:w-8" />
                <span className="px-1 text-center text-xs font-bold leading-tight sm:px-2 sm:text-sm md:text-base">
                  Cerimônia
                  <br />
                  Religiosa
                </span>
              </button>

              {isReligiousOpen && (
                <JHWeddingReligious
                  isOpen={isReligiousOpen}
                  onClose={() => setIsReligiousOpen(false)}
                />
              )}
            </div>

            <div className="text-center">
              <div className="wedding-rsvp-badge inline-block rounded-full px-3 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3">
                <p className="text-sm font-bold tracking-wide sm:text-base md:text-lg">
                  RSVP: {weddingData.rsvp_numbers?.join(' / ') || 'Não disponível'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
