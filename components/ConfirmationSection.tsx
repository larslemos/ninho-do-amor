// components/ConfirmationSection.tsx
"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import type { Guest, WeddingData } from "@/types/wedding"
import { CheckCircle, XCircle, Table } from "lucide-react"

interface ConfirmationSectionProps {
  guest: Guest | null
  token: string
  weddingData: WeddingData
  isLoadingGuest?: boolean
}

export default function ConfirmationSection({
  guest,
  token,
  weddingData,
  isLoadingGuest = false,
}: ConfirmationSectionProps) {
  const [confirmation, setConfirmation] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (guest?.status) {
      setConfirmation(guest.status.toLowerCase())
    }
  }, [guest])

  const fetchGuestData = async () => {
    try {
      const response = await fetch(`/api/guests/verify/${token}`)
      const data = await response.json()

      if (response.ok) {
        setConfirmation(data.convidado.status.toLowerCase())
      } else {
        setError(data.error || "Erro ao atualizar dados do convidado")
      }
    } catch (err) {
      console.error("Erro ao buscar dados do convidado:", err)
      setError("Erro ao atualizar dados do convidado")
    }
  }

  const handleConfirm = async (status: "confirmed" | "rejected") => {
    if (!token || loading) return

    // Check if RSVP deadline has passed (allow if deadline is null)
    if (guest?.rsvp_deadline && new Date(guest.rsvp_deadline) < new Date()) {
      setError(
        "O prazo para confirmação de presença expirou. Entre em contato com os noivos em assa.e.eleuterio@pingdigital.online."
      )
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/guests/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, status }),
      })

      const data = await response.json()

      if (response.ok) {
        setConfirmation(status)
        toast({
          title: "Confirmação enviada",
          description: `Você ${status === "confirmed" ? "confirmou sua presença" : "indicou que não pode comparecer"
            } com sucesso!`,
        })
        await fetchGuestData()
      } else {
        throw new Error(data.error || "Erro ao processar a confirmação")
      }
    } catch (err) {
      console.error("Erro ao confirmar presença:", err)
      setError(
        err instanceof Error ? err.message : "Erro ao confirmar presença. Tente novamente."
      )
    } finally {
      setLoading(false)
    }
  }

  const isRsvpExpired = guest?.rsvp_deadline
    ? new Date(guest.rsvp_deadline) < new Date()
    : false

  return (
    <div className="relative w-full max-w-md mx-auto p-4 sm:p-6 mt-4 sm:mt-6 bg-gradient-to-br from-rose-50 to-pink-100 rounded-xl text-center shadow-lg border border-rose-200 place-card font-josefin">
      {/* Subtle floral background */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10 sm:w-24 sm:h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full text-rose-400">
          <circle cx="20" cy="20" r="8" fill="currentColor" />
          <circle cx="35" cy="15" r="6" fill="currentColor" opacity="0.8" />
          <circle cx="25" cy="35" r="5" fill="currentColor" opacity="0.6" />
          <path d="M15 25 Q20 20 25 25 Q30 30 25 35 Q20 30 15 25" fill="currentColor" opacity="0.4" />
        </svg>
      </div>

      <h2 className="text-lg sm:text-xl font-semibold text-rose-700 mb-3 sm:mb-4 font-josefin">
        Confirmação de Presença
      </h2>
      <p className="text-sm sm:text-base text-rose-500 mb-4 leading-relaxed font-quicksand">
        Confirme sua presença para o casamento de{" "}
        <span className="font-semibold">{weddingData.wedding_details.bride}</span> &{" "}
        <span className="font-semibold">{weddingData.wedding_details.groom}</span>
      </p>

      {isLoadingGuest ? (
        <div className="p-4 bg-rose-50 rounded-lg shadow-inner">
          <div className="flex items-center justify-center animate-in slide-in-from-right duration-300">
            <div className="spinner"></div>
            <p className="text-rose-600 text-sm font-quicksand">Verificando convite...</p>
          </div>
        </div>
      ) : guest ? (
        <>
          {error && (
            <div className="p-3 sm:p-4 bg-destructive/10 text-destructive rounded-lg mb-4 text-sm leading-relaxed font-quicksand animate-in slide-in-from-right duration-300">
              <p>{error}</p>
            </div>
          )}

          {/* Place Card */}
          <div className="relative p-4 mb-4 bg-white/90 rounded-lg shadow-md border border-rose-200 place-card">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-15">
              <svg viewBox="0 0 100 100" className="w-full h-full text-rose-400">
                <circle cx="70" cy="70" r="12" fill="currentColor" />
                <circle cx="55" cy="75" r="8" fill="currentColor" opacity="0.8" />
                <circle cx="75" cy="55" r="6" fill="currentColor" opacity="0.6" />
                <path d="M60 60 Q70 50 80 60 Q90 70 80 80 Q70 70 60 60" fill="currentColor" opacity="0.4" />
              </svg>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Table className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 flex-shrink-0" />
              <p className="text-rose-700 font-semibold text-sm sm:text-base font-josefin">
                {guest.mesa ? `Mesa: ${guest.mesa}` : "Mesa a ser atribuída"}
              </p>
            </div>
            <p className="text-rose-500 text-xs sm:text-sm leading-relaxed font-quicksand">
              {guest.mesa
                ? "Sua mesa será confirmada no dia do evento."
                : "Aguarde a atribuição da sua mesa pelos noivos."}
            </p>
          </div>

          {/* RSVP Status */}
          <div
            className={`p-3 sm:p-4 rounded-lg mb-4 shadow-inner border border-rose-200 animate-in slide-in-from-right duration-300 ${confirmation === "confirmed"
                ? "bg-green-100/80 text-green-700"
                : confirmation === "rejected"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-muted/50 text-muted-foreground"
              }`}
          >
            <p className="font-semibold text-sm sm:text-base font-josefin">
              Status:{" "}
              {confirmation === "confirmed"
                ? "Confirmado ✓"
                : confirmation === "rejected"
                  ? "Não Confirmado ✗"
                  : "Pendente"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleConfirm("confirmed")}
              disabled={loading || isRsvpExpired}
              className={`w-full px-4 py-3 sm:py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base min-h-[48px] animate-in slide-in-from-right duration-300 ${confirmation === "confirmed"
                  ? "bg-green-700 text-primary-foreground"
                  : "bg-green-600 hover:bg-green-700 active:bg-green-800 text-primary-foreground disabled:bg-gray-400 disabled:cursor-not-allowed"
                } font-josefin`}
            >
              {loading && confirmation !== "rejected" ? (
                <>
                  <div className="spinner"></div>
                  <span>Confirmando...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span>Confirmar Presença</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleConfirm("rejected")}
              disabled={loading || isRsvpExpired}
              className={`w-full px-4 py-3 sm:py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base min-h-[48px] animate-in slide-in-from-right duration-300 ${confirmation === "rejected"
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-destructive/80 hover:bg-destructive active:bg-destructive/90 text-destructive-foreground disabled:bg-gray-400 disabled:cursor-not-allowed"
                } font-josefin`}
            >
              {loading && confirmation !== "confirmed" ? (
                <>
                  <div className="spinner"></div>
                  <span>Atualizando...</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span>Não Posso Ir</span>
                </>
              )}
            </button>
          </div>

          {isRsvpExpired && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg shadow-inner animate-in slide-in-from-right duration-300">
              <p className="text-yellow-700 text-xs sm:text-sm leading-relaxed font-quicksand">
                <span className="font-semibold">Prazo expirado?</span>
                <br />
                Entre em contato:{" "}
                <a
                  href="mailto:assa.e.eleuterio@pingdigital.online"
                  className="underline hover:text-yellow-800 transition-colors"
                >
                  assa.e.eleuterio@pingdigital.online
                </a>
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg shadow-inner border border-yellow-200 animate-in slide-in-from-right duration-300">
          <p className="text-sm leading-relaxed mb-3 font-quicksand">
            Convite não encontrado para este link.
          </p>
          <p className="text-xs font-quicksand">
            Verifique o link ou entre em contato com os noivos em{" "}
            <a
              href="mailto:assa.e.eleuterio@pingdigital.online"
              className="underline hover:text-yellow-800 transition-colors font-medium"
            >
              assa.e.eleuterio@pingdigital.online
            </a>
          </p>
        </div>
      )}
    </div>
  )
}