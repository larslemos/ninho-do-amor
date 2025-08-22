// components/WeddingHero.tsx
'use client';

import { MapPin, FileText, Heart, Loader2, Badge } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Guest, WeddingData } from '@/types/wedding';

interface WeddingHeroProps {
  guest: Guest | null;
  weddingData: WeddingData;
  isLoadingGuest?: boolean;
}

export default function WeddingHero({
  guest,
  weddingData,
  isLoadingGuest = false,
}: WeddingHeroProps) {
  const router = useRouter();

  const handleComoChegar = () => {
    window.open(
      'https://www.google.com/maps/place/Polana+Serena+Hotel/@-25.969048,32.597245,17z/data=!4m9!3m8!1s0x1ee690913446e53b:0xae8c39165f520e2e!5m2!4m1!1i2!8m2!3d-25.969048!4d32.597245!16s%2Fg%2F120m1ddk?entry=ttu&g_ep=EgoyMDI1MDczMC4wIKXMDSoASAFQAw%3D%3D',
      '_blank'
    );
  };

  const handleCerimoniaCivil = () => {
    window.open(
      'https://drive.google.com/file/d/1-AInMOXbJ1lUKTZ1RMmTBbgQzDF4ECIB/view',
      '_blank'
    );
  };

  const handleCerimoniaReligiosa = () => {
    window.open(
      'https://drive.google.com/file/d/1U1eJCbfm20DHf-Kd0VwF3DRw9t02jKQU/view',
      '_blank'
    );
  };

  const handleViewGuestInvitation = () => {
    if (guest?.unique_url) {
      router.push(`/assaeluterio/convidados/${guest.unique_url}`);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-none bg-white shadow-none sm:mx-auto sm:max-w-md sm:rounded-2xl sm:rounded-xl sm:shadow-2xl sm:shadow-lg lg:max-w-lg xl:max-w-xl">
      <div className="relative min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 sm:min-h-[600px] lg:min-h-[700px]">
        {/* Enhanced Decorative Elements */}
        <div className="absolute right-4 top-4 h-20 w-20 opacity-15 sm:right-6 sm:top-6 sm:h-28 sm:w-28 lg:h-32 lg:w-32">
          <svg viewBox="0 0 100 100" className="h-full w-full text-rose-400">
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

        <div className="absolute bottom-4 left-4 h-28 w-28 opacity-10 sm:bottom-6 sm:left-6 sm:h-36 sm:w-36 lg:h-40 lg:w-40">
          <svg viewBox="0 0 100 100" className="h-full w-full text-rose-500">
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

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {/* Wedding Photo - Responsive Sizing */}
          <div className="mb-6 w-full max-w-[280px] sm:mb-8 sm:max-w-xs lg:max-w-sm">
            <div className="aspect-square overflow-hidden rounded-xl shadow-2xl ring-4 ring-white/50">
              <Image
                src="/images/assa-eleuterio-wedding.jpg"
                alt="Assa e Eleutério"
                className="h-full w-full object-cover"
                loading="eager"
                width={400}
                height={400}
              />
            </div>
          </div>

          {/* Names and Invitation Text */}
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
            <div className="mb-8">
              <Badge className="mb-4 border-white/30 bg-white/20 text-white">
                <Heart className="mr-2 h-4 w-4" />
                Convite de Casamento
              </Badge>
              <h1 className="font-dancing mb-4 text-xl text-white drop-shadow-lg md:text-4xl">
                Assa &
              </h1>
              <h1 className="font-dancing mb-4 text-xl text-white drop-shadow-lg md:text-4xl">
                Eleutério
              </h1>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-sm font-medium tracking-wide text-rose-600 sm:text-base">
                  É com imensa alegria que convidamos você
                </p>
                <p className="text-sm font-medium tracking-wide text-rose-600 sm:text-base">
                  para a celebração do nosso casamento
                </p>
              </div>
            </div>
          </div>

          {/* Date and Venue - Enhanced Mobile Design */}
          <div className="mb-6 w-full text-center sm:mb-8">
            <div className="mb-3 flex items-center justify-center gap-3 sm:mb-4 sm:gap-4">
              <span className="text-lg font-bold text-rose-700 sm:text-xl lg:text-2xl">
                AGOSTO
              </span>
              <div className="rounded-lg bg-rose-700 px-4 py-2 text-2xl font-bold text-white shadow-lg sm:text-3xl lg:text-4xl">
                30
              </div>
              <span className="text-lg font-bold text-rose-700 sm:text-xl lg:text-2xl">
                13H
              </span>
            </div>
            <div className="rounded-lg bg-white/80 p-3 shadow-md backdrop-blur-sm sm:p-4">
              <p className="text-base font-semibold text-rose-700 sm:text-lg lg:text-xl">
                🏨 Hotel Polana
              </p>
              <p className="mt-1 text-sm text-rose-600 sm:text-base">
                Maputo, Moçambique
              </p>
            </div>
          </div>

          {/* Guest Welcome Section */}
          {guest && (
            <div className="mb-6 w-full max-w-sm rounded-xl border border-rose-100 bg-white/90 p-4 text-center shadow-lg backdrop-blur-sm sm:mb-8">
              <p className="mb-2 text-lg font-semibold text-rose-700 sm:text-xl">
                Olá, <span className="text-rose-800">{guest.nome}</span>! 👋
              </p>
              {guest.mesa && (
                <p className="mb-3 text-sm text-rose-600 sm:text-base">
                  🪑 Mesa: <span className="font-semibold">{guest.mesa}</span>
                </p>
              )}
              <button
                onClick={handleViewGuestInvitation}
                className="min-h-[44px] w-full rounded-lg bg-rose-600 px-4 py-3 text-sm font-medium text-white shadow-md transition-colors hover:bg-rose-700 active:bg-rose-800 sm:text-base"
              >
                📄 Ver Meu Convite Personalizado
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoadingGuest && (
            <div className="mb-6 w-full max-w-sm rounded-xl bg-white/90 p-4 text-center shadow-lg backdrop-blur-sm sm:mb-8">
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin text-rose-600 sm:h-6 sm:w-6" />
                <p className="text-sm text-rose-600 sm:text-base">
                  Carregando informações...
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons - Mobile First Design */}
          <div className="mb-6 grid w-full max-w-sm grid-cols-3 gap-4 sm:mb-8 sm:gap-6 lg:max-w-md">
            <button
              onClick={handleComoChegar}
              className="flex h-20 flex-col items-center justify-center rounded-2xl bg-rose-700 text-white shadow-lg transition-all duration-200 hover:bg-rose-800 active:scale-95 active:bg-rose-900 sm:h-24 lg:h-28"
              aria-label="Como chegar ao Hotel Polana"
            >
              <MapPin className="mb-1 h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
              <span className="text-xs font-bold leading-tight sm:text-sm">
                COMO
                <br />
                CHEGAR
              </span>
            </button>

            <button
              onClick={handleCerimoniaCivil}
              className="flex h-20 flex-col items-center justify-center rounded-2xl bg-rose-700 text-white shadow-lg transition-all duration-200 hover:bg-rose-800 active:scale-95 active:bg-rose-900 sm:h-24 lg:h-28"
              aria-label="Informações sobre a Cerimônia Civil"
            >
              <FileText className="mb-1 h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
              <span className="text-xs font-bold leading-tight sm:text-sm">
                CERIMÔNIA
                <br />
                CIVIL
              </span>
            </button>

            <button
              onClick={handleCerimoniaReligiosa}
              className="flex h-20 flex-col items-center justify-center rounded-2xl bg-rose-700 text-white shadow-lg transition-all duration-200 hover:bg-rose-800 active:scale-95 active:bg-rose-900 sm:h-24 lg:h-28"
              aria-label="Informações sobre a Cerimônia Religiosa"
            >
              <Heart className="mb-1 h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
              <span className="text-xs font-bold leading-tight sm:text-sm">
                CERIMÔNIA
                <br />
                RELIGIOSA
              </span>
            </button>
          </div>

          {/* RSVP Contact Information */}
          <div className="rounded-lg bg-white/80 p-4 text-center shadow-md backdrop-blur-sm">
            <p className="mb-2 text-sm font-bold text-rose-700 sm:text-base">
              📞 CONFIRME SUA PRESENÇA
            </p>
            <div className="space-y-1 text-xs text-rose-600 sm:text-sm">
              {weddingData.wedding_details.rsvp_numbers.map((number, index) => (
                <a
                  key={index}
                  href={`tel:${number}`}
                  className="block font-medium transition-colors hover:text-rose-700"
                >
                  {number}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
