// components/WeddingHero.tsx
"use client"

import { MapPin, FileText, Heart, Loader2, Badge } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Guest, WeddingData } from "@/types/wedding"

interface WeddingHeroProps {
  guest: Guest | null
  weddingData: WeddingData
  isLoadingGuest?: boolean
}

export default function WeddingHero({ guest, weddingData, isLoadingGuest = false }: WeddingHeroProps) {
  const router = useRouter()

  const handleComoChegar = () => {
    window.open(
      "https://www.google.com/maps/place/Polana+Serena+Hotel/@-25.969048,32.597245,17z/data=!4m9!3m8!1s0x1ee690913446e53b:0xae8c39165f520e2e!5m2!4m1!1i2!8m2!3d-25.969048!4d32.597245!16s%2Fg%2F120m1ddk?entry=ttu&g_ep=EgoyMDI1MDczMC4wIKXMDSoASAFQAw%3D%3D",
      "_blank",
    )
  }

  const handleCerimoniaCivil = () => {
    window.open("https://drive.google.com/file/d/1-AInMOXbJ1lUKTZ1RMmTBbgQzDF4ECIB/view", "_blank")
  }

  const handleCerimoniaReligiosa = () => {
    window.open("https://drive.google.com/file/d/1U1eJCbfm20DHf-Kd0VwF3DRw9t02jKQU/view", "_blank")
  }

  const handleViewGuestInvitation = () => {
    if (guest?.unique_url) {
      router.push(`/assaeluterio/convidados/${guest.unique_url}`)
    }
  }

  return (
    <div className="w-full bg-white rounded-none sm:rounded-xl shadow-none sm:shadow-lg overflow-hidden sm:max-w-md sm:mx-auto lg:max-w-lg xl:max-w-xl sm:rounded-2xl sm:shadow-2xl">
      <div className="relative min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 sm:min-h-[600px] lg:min-h-[700px]">
        {/* Enhanced Decorative Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 opacity-15 sm:top-6 sm:right-6 sm:w-28 sm:h-28 lg:w-32 lg:h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full text-rose-400">
            <circle cx="20" cy="20" r="8" fill="currentColor" />
            <circle cx="35" cy="15" r="6" fill="currentColor" opacity="0.8" />
            <circle cx="25" cy="35" r="5" fill="currentColor" opacity="0.6" />
            <path d="M15 25 Q20 20 25 25 Q30 30 25 35 Q20 30 15 25" fill="currentColor" opacity="0.4" />
          </svg>
        </div>

        <div className="absolute bottom-4 left-4 w-28 h-28 opacity-10 sm:bottom-6 sm:left-6 sm:w-36 sm:h-36 lg:w-40 lg:h-40">
          <svg viewBox="0 0 100 100" className="w-full h-full text-rose-500">
            <circle cx="70" cy="70" r="12" fill="currentColor" />
            <circle cx="55" cy="75" r="8" fill="currentColor" opacity="0.8" />
            <circle cx="75" cy="55" r="6" fill="currentColor" opacity="0.6" />
            <path d="M60 60 Q70 50 80 60 Q90 70 80 80 Q70 70 60 60" fill="currentColor" opacity="0.4" />
          </svg>
        </div>

        {/* Main Content */}
        <div className="relative z-10 px-4 py-6 flex flex-col items-center sm:px-6 sm:py-8 lg:px-8">
          {/* Wedding Photo - Responsive Sizing */}
          <div className="w-full max-w-[280px] mb-6 sm:max-w-xs sm:mb-8 lg:max-w-sm">
            <div className="rounded-xl shadow-2xl overflow-hidden aspect-square ring-4 ring-white/50">
              <img
                src="/images/assa-eleuterio-wedding.jpg"
                alt="Assa e Eleutério"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>

          {/* Names and Invitation Text */}
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <div className="mb-8">
              <Badge className="bg-white/20 text-white border-white/30 mb-4">
                <Heart className="h-4 w-4 mr-2" />
                Convite de Casamento
              </Badge>
              <h1 className="text-xl md:text-4xl font-dancing text-white mb-4 drop-shadow-lg">
                Assa &
              </h1>
              <h1 className="text-xl md:text-4xl font-dancing text-white mb-4 drop-shadow-lg">
                Eleutério
              </h1>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-rose-600 text-sm font-medium tracking-wide sm:text-base ">
                  É com imensa alegria que convidamos você
                </p>
                <p className="text-rose-600 text-sm font-medium tracking-wide sm:text-base ">
                  para a celebração do nosso casamento
                </p>
              </div>
            </div>
          </div>

          {/* Date and Venue - Enhanced Mobile Design */}
          <div className="text-center mb-6 w-full sm:mb-8">
            <div className="flex items-center justify-center gap-3 mb-3 sm:gap-4 sm:mb-4">
              <span className="text-rose-700 font-bold text-lg sm:text-xl lg:text-2xl">AGOSTO</span>
              <div className="bg-rose-700 text-white px-4 py-2 rounded-lg font-bold text-2xl sm:text-3xl lg:text-4xl shadow-lg">
                30
              </div>
              <span className="text-rose-700 font-bold text-lg sm:text-xl lg:text-2xl">13H</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-md">
              <p className="text-rose-700 font-semibold text-base sm:text-lg lg:text-xl">
                🏨 Hotel Polana
              </p>
              <p className="text-rose-600 text-sm sm:text-base mt-1">
                Maputo, Moçambique
              </p>
            </div>
          </div>

          {/* Guest Welcome Section */}
          {guest && (
            <div className="text-center mb-6 p-4 bg-white/90 backdrop-blur-sm rounded-xl w-full max-w-sm shadow-lg border border-rose-100 sm:mb-8">
              <p className="text-rose-700 font-semibold text-lg mb-2 sm:text-xl">
                Olá, <span className="text-rose-800">{guest.nome}</span>! 👋
              </p>
              {guest.mesa && (
                <p className="text-rose-600 text-sm mb-3 sm:text-base">
                  🪑 Mesa: <span className="font-semibold">{guest.mesa}</span>
                </p>
              )}
              <button
                onClick={handleViewGuestInvitation}
                className="w-full bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white px-4 py-3 rounded-lg font-medium transition-colors shadow-md text-sm sm:text-base min-h-[44px]"
              >
                📄 Ver Meu Convite Personalizado
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoadingGuest && (
            <div className="text-center mb-6 p-4 bg-white/90 backdrop-blur-sm rounded-xl w-full max-w-sm shadow-lg sm:mb-8">
              <div className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-rose-600 mr-2 sm:h-6 sm:w-6" />
                <p className="text-rose-600 text-sm sm:text-base">Carregando informações...</p>
              </div>
            </div>
          )}

          {/* Action Buttons - Mobile First Design */}
          <div className="grid grid-cols-3 gap-4 mb-6 w-full max-w-sm sm:gap-6 sm:mb-8 lg:max-w-md">
            <button
              onClick={handleComoChegar}
              className="flex flex-col items-center justify-center h-20 bg-rose-700 text-white rounded-2xl shadow-lg hover:bg-rose-800 active:bg-rose-900 transition-all duration-200 active:scale-95 sm:h-24 lg:h-28"
              aria-label="Como chegar ao Hotel Polana"
            >
              <MapPin className="w-6 h-6 mb-1 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
              <span className="text-xs font-bold leading-tight sm:text-sm">
                COMO
                <br />
                CHEGAR
              </span>
            </button>

            <button
              onClick={handleCerimoniaCivil}
              className="flex flex-col items-center justify-center h-20 bg-rose-700 text-white rounded-2xl shadow-lg hover:bg-rose-800 active:bg-rose-900 transition-all duration-200 active:scale-95 sm:h-24 lg:h-28"
              aria-label="Informações sobre a Cerimônia Civil"
            >
              <FileText className="w-6 h-6 mb-1 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
              <span className="text-xs font-bold leading-tight sm:text-sm">
                CERIMÔNIA
                <br />
                CIVIL
              </span>
            </button>

            <button
              onClick={handleCerimoniaReligiosa}
              className="flex flex-col items-center justify-center h-20 bg-rose-700 text-white rounded-2xl shadow-lg hover:bg-rose-800 active:bg-rose-900 transition-all duration-200 active:scale-95 sm:h-24 lg:h-28"
              aria-label="Informações sobre a Cerimônia Religiosa"
            >
              <Heart className="w-6 h-6 mb-1 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
              <span className="text-xs font-bold leading-tight sm:text-sm">
                CERIMÔNIA
                <br />
                RELIGIOSA
              </span>
            </button>
          </div>

          {/* RSVP Contact Information */}
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
            <p className="text-rose-700 font-bold text-sm mb-2 sm:text-base">
              📞 CONFIRME SUA PRESENÇA
            </p>
            <div className="text-rose-600 text-xs sm:text-sm space-y-1">
              {weddingData.wedding_details.rsvp_numbers.map((number, index) => (
                <a
                  key={index}
                  href={`tel:${number}`}
                  className="block hover:text-rose-700 font-medium transition-colors"
                >
                  {number}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
