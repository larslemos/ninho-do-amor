"use client"

import { useEffect, useState } from "react"

interface Felicitation {
  id: string
  name: string
  message: string
  date: string
}

export default function FelicitationList() {
  const [felicitations, setFelicitations] = useState<Felicitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token")
    if (token) {
      fetchFelicitations(token)
    } else {
      setError("Token não encontrado")
      setLoading(false)
    }
  }, [])

  const fetchFelicitations = async (token: string) => {
    try {
      const response = await fetch(`/api/felicitations?token=${token}`)
      const data = await response.json()

      if (response.ok) {
        setFelicitations(data || [])
      } else {
        throw new Error(data.error || "Erro ao carregar felicitações")
      }
    } catch (err) {
      console.error("Erro ao carregar felicitações:", err)
      setError("Erro ao carregar felicitações")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="w-[400px] mt-6 p-6 bg-rose-100 rounded-xl text-center shadow-lg">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-600 mr-2"></div>
          <p className="text-rose-500">Carregando felicitações...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-[400px] mt-6 p-6 bg-rose-100 rounded-xl text-center shadow-lg">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="w-[400px] mt-6 p-6 bg-rose-100 rounded-xl text-center shadow-lg border border-rose-200">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-rose-700 mb-2">💕 Felicitações</h2>
        <p className="text-rose-500 text-sm">
          {felicitations.length > 0
            ? `${felicitations.length} mensagem${felicitations.length !== 1 ? "s" : ""} de carinho`
            : "Seja o primeiro a deixar uma felicitação!"}
        </p>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {felicitations.length > 0 ? (
          felicitations.map((felicitation) => (
            <div key={felicitation.id} className="p-4 bg-white rounded-lg shadow-sm border border-rose-200 text-left">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-rose-700 font-semibold text-sm">{felicitation.name}</h3>
                <span className="text-rose-400 text-xs">
                  {new Date(felicitation.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="text-rose-600 text-sm leading-relaxed">{felicitation.message}</p>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <div className="text-4xl mb-2">💌</div>
            <p className="text-rose-500 text-sm">
              Ainda não há felicitações.
              <br />
              Seja o primeiro a parabenizar os noivos!
            </p>
          </div>
        )}
      </div>

      {felicitations.length > 5 && <div className="mt-4 text-xs text-rose-400">Role para ver mais felicitações</div>}
    </div>
  )
}
