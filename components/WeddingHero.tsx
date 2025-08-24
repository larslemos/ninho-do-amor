// components/WeddingHero.tsx
'use client';

import { MapPin, FileText, Heart, Loader2, Badge } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Waves, Sun } from 'lucide-react';
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
    <div className="place-card font-poppins relative mx-auto w-full max-w-md rounded-xl shadow-lg sm:mt-6 sm:rounded-2xl sm:shadow-2xl lg:max-w-lg xl:max-w-xl">
      <div className="relative min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 sm:min-h-[600px] lg:min-h-[700px]">
        {/* Decorative Beach Elements */}
        <div className="absolute right-0 top-0 h-20 w-20 opacity-10 sm:h-24 sm:w-24 lg:h-28 lg:w-28">
          <Waves className="h-full w-full text-sky-400" />
        </div>

        <div className="absolute bottom-4 left-4 h-16 w-16 opacity-10 sm:h-20 sm:w-20 lg:h-24 lg:w-24">
          <Sun className="h-full w-full text-orange-400" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {/* Wedding Photo */}
          <div className="place-card-enhanced mb-6 w-full max-w-[280px] rounded-xl shadow-inner sm:mb-8 sm:max-w-xs lg:max-w-sm">
            <div className="aspect-square overflow-hidden rounded-xl shadow-2xl ring-4 ring-white/50">
              <Image
                src="/images/assa-eleuterio-wedding.jpg"
                alt="Assa e Eleutério"
                className="h-full w-full object-cover duration-300 animate-in slide-in-from-right"
                loading="eager"
                width={400}
                height={400}
              />
            </div>
          </div>

          {/* Names and Invitation Text */}
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
            <div className="mb-8">
              <Badge className="mb-4 border-sky-200/30 bg-white/20 text-sky-700">
                <Heart className="mr-2 h-4 w-4 text-sky-500" />
                Convite de Casamento
              </Badge>
              <h1 className="font-dancing mb-4 text-xl font-semibold text-sky-700 drop-shadow-lg sm:text-2xl md:text-4xl">
                Assa & Eleutério
              </h1>
              <div className="space-y-1 sm:space-y-2">
                <p className="font-quicksand text-sm leading-relaxed text-sky-600 sm:text-base">
                  É com imensa alegria que convidamos você
                </p>
                <p className="font-quicksand text-sm leading-relaxed text-sky-600 sm:text-base">
                  para a celebração do nosso casamento
                </p>
              </div>
            </div>
          </div>

          {/* Guest Welcome Section */}
          {guest && (
            <div className="place-card-enhanced mb-6 w-full max-w-sm rounded-xl border border-sky-200 bg-white/90 p-4 text-center shadow-inner backdrop-blur-sm duration-300 animate-in slide-in-from-right sm:mb-8">
              <p className="font-poppins mb-2 text-lg font-semibold text-sky-700 sm:text-xl">
                Olá, <span className="text-sky-800">{guest.nome}</span>! 👋
              </p>
              {guest.mesa && (
                <p className="mb-3 font-quicksand text-sm text-sky-600 sm:text-base">
                  🪑 Mesa: <span className="font-semibold">{guest.mesa}</span>
                </p>
              )}
              <button
                onClick={handleViewGuestInvitation}
                className="rsvp-button rsvp-confirm min-h-[44px] w-full rounded-lg bg-sky-600 px-4 py-3 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-sky-700 active:bg-sky-800 sm:text-base"
                aria-label="Ver convite personalizado"
              >
                <div className="flex items-center justify-center gap-3">
                  <FileText className="h-5 w-5" />
                  <span className="font-medium">
                    Ver Meu Convite Personalizado
                  </span>
                </div>
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoadingGuest && (
            <div className="place-card-enhanced mb-6 w-full max-w-sm rounded-xl bg-white/90 p-4 text-center shadow-inner backdrop-blur-sm duration-300 animate-in slide-in-from-right sm:mb-8">
              <div className="flex items-center justify-center">
                <div className="beach-spinner mr-2 h-5 w-5 sm:h-6 sm:w-6"></div>
                <p className="font-quicksand text-sm text-sky-600 sm:text-base">
                  Carregando informações...
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mb-6 grid w-full max-w-sm grid-cols-3 gap-4 sm:mb-8 sm:gap-6 lg:max-w-md">
            <button
              onClick={handleComoChegar}
              className="rsvp-button rsvp-confirm flex h-20 flex-col items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg transition-all duration-300 hover:bg-sky-700 active:scale-95 active:bg-sky-800 sm:h-24 lg:h-28"
              aria-label="Como chegar ao Hotel Polana"
            >
              <MapPin className="mb-1 h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
              <span className="font-poppins text-xs font-bold leading-tight sm:text-sm">
                COMO
                <br />
                CHEGAR
              </span>
            </button>

            <button
              onClick={handleCerimoniaCivil}
              className="rsvp-button rsvp-confirm flex h-20 flex-col items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg transition-all duration-300 hover:bg-sky-700 active:scale-95 active:bg-sky-800 sm:h-24 lg:h-28"
              aria-label="Informações sobre a Cerimônia Civil"
            >
              <FileText className="mb-1 h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
              <span className="font-poppins text-xs font-bold leading-tight sm:text-sm">
                CERIMÔNIA
                <br />
                CIVIL
              </span>
            </button>

            <button
              onClick={handleCerimoniaReligiosa}
              className="rsvp-button rsvp-confirm flex h-20 flex-col items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg transition-all duration-300 hover:bg-sky-700 active:scale-95 active:bg-sky-800 sm:h-24 lg:h-28"
              aria-label="Informações sobre a Cerimônia Religiosa"
            >
              <Heart className="mb-1 h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
              <span className="font-poppins text-xs font-bold leading-tight sm:text-sm">
                CERIMÔNIA
                <br />
                RELIGIOSA
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
