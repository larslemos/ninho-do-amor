// app/assaeluterio/convidados/[guestId]/page.tsx

"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Calendar, MapPin, Heart, ArrowRight, Copy, CheckCircle } from "lucide-react"
import { env } from "@/env"

interface GuestData {
  id: string
  nome: string
  email?: string
  status: string
  mesa?: string
  unique_url: string
  token: string
  rsvp_deadline?: string
}

export default function GuestInvitationPage() {
  const params = useParams()
  const router = useRouter()
  const guestId = params.guestId as string

  const [guest, setGuest] = useState<GuestData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (guestId) {
      fetchGuestData(guestId)
    } else {
      setError("Link de convite inválido")
      setIsLoading(false)
    }
  }, [guestId])

  const fetchGuestData = async (guestId: string) => {
    try {
      const response = await fetch(`/api/guests/by-url/${guestId}`)
      const data = await response.json()

      if (response.ok) {
        setGuest(data.guest)
        if (data.warning) {
          setWarning(data.warning)
        }
      } else {
        setError(data.error || "Convidado não encontrado")
      }
    } catch (err) {
      console.error("Erro ao buscar dados do convidado:", err)
      setError("Erro ao carregar dados do convidado")
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewInvitation = () => {
    if (guest?.token) {
      router.push(`/?token=${guest.token}`)
    } else {
      setError("Token de convidado não disponível")
    }
  }

  const copyInvitationLink = async () => {
    if (!guest?.token) {
      setError("Link de convite não disponível")
      return
    }
    const baseUrl = env.NEXT_PUBLIC_BASE_URL || "https://pingdigital.online"
    const invitationUrl = `${baseUrl}/?token=${guest.token}`
    try {
      await navigator.clipboard.writeText(invitationUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
      setError("Erro ao copiar o link")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-rose-600">Carregando convite...</p>
        </div>
      </div>
    )
  }

  if (error || !guest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-rose-700 mb-4">Convite Não Encontrado</h2>
          <p className="text-rose-600 mb-6">{error || "Convidado não encontrado"}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full text-rose-400">
              <circle cx="20" cy="20" r="8" fill="currentColor" />
              <circle cx="35" cy="15" r="6" fill="currentColor" opacity="0.8" />
              <circle cx="25" cy="35" r="5" fill="currentColor" opacity="0.6" />
            </svg>
          </div>

          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-rose-200 bg-rose-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs md:text-sm text-rose-500 uppercase tracking-wider mb-1">Assa & Eleutério</div>
                  <div className="text-2xl md:text-3xl font-serif text-rose-700">A&E</div>
                  <div className="text-xs md:text-sm text-rose-500">30.08.2025</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 text-rose-400">
              <Mail className="w-full h-full" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-lg md:text-xl text-rose-600 font-light mb-4">Bem-vindo(a)</h2>
            <h1 className="text-2xl md:text-4xl font-light text-rose-800 tracking-wide mb-6">
              {guest.nome.toUpperCase()}
            </h1>
            <div className="flex items-center justify-center gap-2 text-rose-500 mb-6">
              <Heart className="w-4 h-4" />
              <span className="text-sm">Você está convidado(a) para nosso casamento</span>
              <Heart className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-rose-50 rounded-xl p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-600" />
                <span className="text-rose-700">30 de Agosto, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span className="text-rose-700">Hotel Polana</span>
              </div>
              {guest.mesa && (
                <div className="flex items-center gap-2">
                  <span className="text-rose-600">🪑</span>
                  <span className="text-rose-700">Mesa: {guest.mesa}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-rose-600">📧</span>
                <span className="text-rose-700">
                  Status: {guest.status === "confirmed" ? "Confirmado ✓" : "Pendente"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleViewInvitation}
              className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl text-lg font-medium tracking-wide transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Ver Convite Completo
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={copyInvitationLink}
              className="w-full bg-rose-100 hover:bg-rose-200 text-rose-700 px-8 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Link Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar Link do Convite
                </>
              )}
            </button>
          </div>

          {guest.rsvp_deadline && (
            <div className="mt-6 text-center">
              <p className="text-sm text-rose-500">
                Por favor, confirme sua presença até{" "}
                <span className="font-semibold">{new Date(guest.rsvp_deadline).toLocaleDateString("pt-BR")}</span>
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <p className="text-rose-400 text-sm">© 2025 PingDigital - Plataforma de Gestão de Casamentos</p>
        </div>
      </div>
    </div>
  )
}