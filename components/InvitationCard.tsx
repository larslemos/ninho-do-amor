"use client"

import type { Guest, WeddingData } from "@/types/wedding"

interface InvitationCardProps {
  guest: Guest | null
  weddingData: WeddingData
}

export default function InvitationCard({ guest, weddingData }: InvitationCardProps) {
  const { bride, groom, date, day_of_week, time, venue, rsvp_numbers } = weddingData.wedding_details
  const { portuguese } = weddingData.invitation_text

  return (
    <div className="w-[400px] p-6 mt-6 bg-brown-100 rounded-xl text-center shadow-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-brown-700 mb-2">💍</h1>
        <h2 className="text-2xl font-semibold text-brown-700 mb-4">Convite de Casamento</h2>
      </div>

      <div className="space-y-3 text-brown-600">
        <p className="text-lg leading-relaxed">{portuguese}</p>

        <div className="border-t border-brown-300 pt-4 mt-4">
          <p className="text-xl font-semibold text-brown-700 mb-2">
            {bride} & {groom}
          </p>

          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">📅 Data:</span> {day_of_week}, {date}
            </p>
            <p>
              <span className="font-semibold">🕐 Horário:</span> {time}
            </p>
            <p>
              <span className="font-semibold">📍 Local:</span> {venue}
            </p>
            <p>
              <span className="font-semibold">📞 RSVP:</span> {rsvp_numbers.join(" ou ")}
            </p>
          </div>
        </div>
      </div>

      {guest ? (
        <div className="mt-6 p-4 bg-brown-200 rounded-lg">
          <p className="text-lg font-semibold text-brown-700 mb-2">Olá, {guest.nome}! 👋</p>

          {guest.status && (
            <p
              className={`text-sm font-medium mb-2 ${
                guest.status.toLowerCase() === "confirmed" ? "text-green-700" : "text-red-700"
              }`}
            >
              Status: {guest.status === "confirmed" ? "Confirmado ✓" : "Pendente"}
            </p>
          )}

          {guest.mesa && (
            <p className="text-sm text-brown-600 mb-1">
              <span className="font-semibold">🪑 Mesa:</span> {guest.mesa}
            </p>
          )}

          {guest.validade && (
            <p className="text-xs text-brown-500">
              Válido até: {new Date(guest.validade * 1000).toLocaleDateString("pt-BR")}
            </p>
          )}
        </div>
      ) : (
        <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
          <p className="text-brown-600">Carregando informações do convidado...</p>
        </div>
      )}
    </div>
  )
}
