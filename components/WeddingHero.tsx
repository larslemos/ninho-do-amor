"use client"

import { MapPin, FileText, Heart } from "lucide-react"
import type { Guest, WeddingData } from "@/types/wedding"

interface WeddingHeroProps {
  guest: Guest | null
  weddingData: WeddingData
  isLoadingGuest?: boolean
}

export default function WeddingHero({ guest, weddingData, isLoadingGuest = false }: WeddingHeroProps) {
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

  return (
    <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Background with floral elements */}
      <div className="relative h-[600px] bg-gradient-to-br from-pink-50 to-rose-50">
        {/* Decorative floral elements */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full text-rose-400">
            <circle cx="20" cy="20" r="8" fill="currentColor" />
            <circle cx="35" cy="15" r="6" fill="currentColor" opacity="0.8" />
            <circle cx="25" cy="35" r="5" fill="currentColor" opacity="0.6" />
            <path d="M15 25 Q20 20 25 25 Q30 30 25 35 Q20 30 15 25" fill="currentColor" opacity="0.4" />
          </svg>
        </div>

        <div className="absolute bottom-0 left-0 w-40 h-40 opacity-15">
          <svg viewBox="0 0 100 100" className="w-full h-full text-rose-500">
            <circle cx="70" cy="70" r="12" fill="currentColor" />
            <circle cx="55" cy="75" r="8" fill="currentColor" opacity="0.8" />
            <circle cx="75" cy="55" r="6" fill="currentColor" opacity="0.6" />
            <path d="M60 60 Q70 50 80 60 Q90 70 80 80 Q70 70 60 60" fill="currentColor" opacity="0.4" />
          </svg>
        </div>

        {/* Main content */}
        <div className="relative z-10 p-6 h-full flex flex-col">
          {/* Couple's photo placeholder */}
          <div className="flex-1 flex items-center justify-center mb-6">
            <div className="relative">
              <img
                src="/images/wedding-invitation-bg.png"
                alt="Assa e Eleutério"
                className="w-full h-auto max-w-sm rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Names */}
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold text-rose-700 mb-2" style={{ fontFamily: "serif" }}>
              Assa &
            </h1>
            <h1 className="text-4xl font-bold text-rose-700 mb-4" style={{ fontFamily: "serif" }}>
              Eleutério
            </h1>
            <p className="text-rose-600 text-sm font-medium uppercase tracking-wide">
              É com imensa alegria que convidamos você
            </p>
            <p className="text-rose-600 text-sm font-medium uppercase tracking-wide">
              para a celebração do nosso casamento
            </p>
          </div>

          {/* Date and venue */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-rose-700 font-semibold text-lg">AGOSTO</span>
              <div className="bg-rose-700 text-white px-3 py-1 rounded font-bold text-2xl">30</div>
              <span className="text-rose-700 font-semibold text-lg">13H</span>
            </div>
            <p className="text-rose-600 font-medium">LOCAL: HOTEL POLANA</p>
          </div>

          {/* Guest info - Only show if guest data is available */}
          {guest && (
            <div className="text-center mb-4 p-3 bg-white/80 rounded-lg">
              <p className="text-rose-700 font-semibold">Olá, {guest.nome}! 👋</p>
              {guest.mesa && <p className="text-rose-600 text-sm">Mesa: {guest.mesa}</p>}
            </div>
          )}

          {/* Loading guest info */}
          {isLoadingGuest && (
            <div className="text-center mb-4 p-3 bg-white/80 rounded-lg">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-600 mr-2"></div>
                <p className="text-rose-600 text-sm">Carregando informações...</p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={handleComoChegar}
              className="flex flex-col items-center justify-center w-20 h-20 bg-rose-700 text-white rounded-full shadow-lg hover:bg-rose-800 transition-colors"
              aria-label="Como chegar"
            >
              <MapPin className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">COMO</span>
              <span className="text-xs font-medium">CHEGAR</span>
            </button>

            <button
              onClick={handleCerimoniaCivil}
              className="flex flex-col items-center justify-center w-20 h-20 bg-rose-700 text-white rounded-full shadow-lg hover:bg-rose-800 transition-colors"
              aria-label="Cerimônia Civil"
            >
              <FileText className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">CERIMÔNIA</span>
              <span className="text-xs font-medium">CIVIL</span>
            </button>

            <button
              onClick={handleCerimoniaReligiosa}
              className="flex flex-col items-center justify-center w-20 h-20 bg-rose-700 text-white rounded-full shadow-lg hover:bg-rose-800 transition-colors"
              aria-label="Cerimônia Religiosa"
            >
              <Heart className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">CERIMÔNIA</span>
              <span className="text-xs font-medium">RELIGIOSA</span>
            </button>
          </div>

          {/* RSVP info */}
          <div className="text-center">
            <p className="text-rose-700 font-bold text-sm">
              RSVP: {weddingData.wedding_details.rsvp_numbers.join(" / ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
