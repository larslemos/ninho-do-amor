"use client"

import { useState, useEffect } from "react"
import type { Guest, WeddingData } from "@/types/wedding"

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

  useEffect(() => {
    if (guest?.status) setConfirmation(guest.status.toLowerCase())
  }, [guest])

  const handleConfirm = async (status: string) => {
    if (!token || loading) return

    setLoading(true)
    try {
      const response = await fetch("/api/guests/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, status }),
      })

      const data = await response.json()

      if (response.ok) {
        setConfirmation(status)
      } else {
        throw new Error(data.error || "Erro na confirmação")
      }
    } catch (err) {
      console.error("Erro ao confirmar presença:", err)
      alert("Erro ao confirmar presença. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-[400px] p-6 mt-6 bg-rose-100 rounded-xl text-center shadow-lg border border-rose-200">
      <h2 className="text-xl font-semibold text-rose-700 mb-4">Confirmação</h2>
      <p className="text-rose-500 mb-2">
        Confirme sua presença para o casamento de {weddingData.wedding_details.bride} &{" "}
        {weddingData.wedding_details.groom}
      </p>

      {isLoadingGuest ? (
        <div className="p-3 bg-rose-50 rounded-lg">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-600 mr-2"></div>
            <p className="text-rose-600">Verificando convite...</p>
          </div>
        </div>
      ) : guest ? (
        <>
          {confirmation ? (
            <div
              className={`p-3 rounded-lg mb-4 ${
                confirmation === "confirmed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              <p className="font-semibold">
                Status: {confirmation === "confirmed" ? "Confirmado ✓" : "Não Confirmado ✗"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => handleConfirm("confirmed")}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Confirmando...
                  </div>
                ) : (
                  "Confirmar Presença ✓"
                )}
              </button>

              <button
                onClick={() => handleConfirm("rejected")}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processando...
                  </div>
                ) : (
                  "Não Posso Ir ✗"
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="p-3 bg-yellow-100 text-yellow-700 rounded-lg">
          <p>Convite não encontrado para este link.</p>
        </div>
      )}
    </div>
  )
}
