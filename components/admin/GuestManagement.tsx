//ninho-do-amor/components/admin/GuestManagement.tsx

"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Plus, Upload, Download, Search, Edit, Trash2, Users, CheckCircle, XCircle, Clock, Mail, MessageSquare, Copy, ExternalLink, AlertTriangle, Info, MessageCircle } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import EmailTemplateSelector from "./EmailTemplateSelector"
import type { EmailTemplateType } from "@/lib/email-templates"
import { TrendingUp, BarChart3, PieChart } from 'lucide-react'
import { env } from "@/env"

interface Guest {
  id: string
  nome: string
  telefone?: string
  phone?: string
  telephone?: string
  email?: string
  status: "pending" | "confirmed" | "rejected"
  mesa?: string
  token: string
  unique_url?: string
  invitation_sent_at?: string
  rsvp_deadline?: string
  created_at: string
}

export default function GuestManagement() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [newGuest, setNewGuest] = useState({ nome: "", telefone: "", email: "" })
  const [sendingInvitation, setSendingInvitation] = useState<string | null>(null)
  const [schemaError, setSchemaError] = useState<string | null>(null)
  const [emailInfo, setEmailInfo] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [selectedGuestForEmail, setSelectedGuestForEmail] = useState<Guest | null>(null)

  useEffect(() => {
    fetchGuests()
    setEmailInfo("Emails são enviados usando o domínio padrão do Resend (onboarding@resend.dev)")
  }, [])

  const fetchGuests = async () => {
    try {
      const response = await fetch("/api/admin/guests")
      if (response.ok) {
        const data = await response.json()
        setGuests(data.guests || [])
        setSchemaError(null)
      } else {
        const errorData = await response.json()
        if (errorData.error?.includes("telefone")) {
          setSchemaError("Base de dados precisa ser atualizada. Execute a migração SQL.")
        }
      }
    } catch (error) {
      console.error("Error fetching guests:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar convidados",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredGuests = guests.filter((guest) => {
    const phoneNumber = guest.telefone || guest.phone || guest.telephone || ""
    return (
      guest.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phoneNumber.includes(searchTerm) ||
      guest.status.includes(searchTerm.toLowerCase()) ||
      (guest.email && guest.email.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

  const stats = {
    total: guests.length,
    confirmed: guests.filter((g) => g.status === "confirmed").length,
    pending: guests.filter((g) => g.status === "pending").length,
    rejected: guests.filter((g) => g.status === "rejected").length,
    invitationsSent: guests.filter((g) => g.invitation_sent_at).length,
  }

  const generateUniqueUrl = (nome: string) => {
    const randomId = Math.random().toString(36).substring(2, 10)
    const nameSlug = nome
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
    return `${randomId}-${nameSlug}`
  }

  const handleAddGuest = async () => {
    if (!newGuest.nome.trim() || !newGuest.telefone.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Nome e telefone são obrigatórios",
      })
      return
    }

    const guestData = {
      nome: newGuest.nome.trim(),
      telefone: newGuest.telefone.trim(),
      email: newGuest.email.trim() || null,
      unique_url: generateUniqueUrl(newGuest.nome),
      rsvp_deadline: "2025-08-25T23:59:59Z",
    }

    try {
      const response = await fetch("/api/admin/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(guestData),
      })

      const data = await response.json()

      if (response.ok) {
        await fetchGuests()
        setNewGuest({ nome: "", telefone: "", email: "" })
        setShowAddModal(false)
        toast({
          variant: "success",
          title: "Sucesso! 🎉",
          description: "Convidado adicionado com sucesso",
        })
      } else {
        if (data.error?.includes("base de dados")) {
          setSchemaError(data.error)
          toast({
            variant: "destructive",
            title: "Erro de Base de Dados",
            description: "Execute a migração SQL para corrigir a estrutura da base de dados",
          })
        } else {
          toast({
            variant: "destructive",
            title: "Erro",
            description: data.error || "Erro ao adicionar convidado",
          })
        }
      }
    } catch (error) {
      console.error("Error adding guest:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao adicionar convidado",
      })
    }
  }

  const handleSendInvitation = async (
    guestId: string,
    method: "email" | "sms",
    templateType: EmailTemplateType = "wedding-invitation",
    customMessage?: string,
  ) => {
    setSendingInvitation(guestId)
    try {
      const response = await fetch("/api/guests/send-invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId, method, templateType, customMessage }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          variant: "success",
          title: "Enviado! 💌",
          description: `${data.template_used === "wedding-invitation" ? "Convite" : "Mensagem"} enviado com sucesso!`,
        })
        await fetchGuests()
        setShowTemplateSelector(false)
        setSelectedGuestForEmail(null)
      } else {
        let errorMessage = data.error || "Erro ao enviar notificação"
        if (data.details) {
          errorMessage += ` (${data.details})`
        }
        toast({
          variant: "destructive",
          title: "Erro ao Enviar",
          description: errorMessage,
        })
      }
    } catch (error) {
      console.error("Error sending invitation:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao enviar notificação",
      })
    } finally {
      setSendingInvitation(null)
    }
  }

  const copyGuestUrl = async (guest: Guest) => {
    const baseUrl = env.NEXT_PUBLIC_BASE_URL || "https://pingdigital.online"
    const guestUrl = `${baseUrl}/assaeluterio/convidados/${guest.unique_url || guest.token}`

    try {
      await navigator.clipboard.writeText(guestUrl)
      toast({
        variant: "success",
        title: "Link Copiado! 📋",
        description: "Link do convite copiado para a área de transferência",
      })
    } catch (error) {
      console.error("Failed to copy:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao copiar link",
      })
    }
  }

  const openGuestPage = (guest: Guest) => {
    const baseUrl = env.NEXT_PUBLIC_BASE_URL || "https://pingdigital.online"
    const guestUrl = `${baseUrl}/assaeluterio/convidados/${guest.unique_url || guest.token}`
    window.open(guestUrl, "_blank")
  }

  const handleSendWhatsApp = (guest: Guest) => {
    const phoneNumber = getPhoneNumber(guest)
    if (!phoneNumber) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Número de telefone não disponível para este convidado",
      })
      return
    }

    // Format phone number: remove spaces, dashes, and ensure + prefix
    const formattedPhone = phoneNumber.replace(/[\s()-]/g, "").replace(/^(\+?)/, "+")

    // Validate phone number (basic check for digits and +)
    if (!/^\+\d{9,15}$/.test(formattedPhone)) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Número de telefone inválido. Verifique o formato (ex: +258841234567)",
      })
      return
    }

    const baseUrl = env.NEXT_PUBLIC_BASE_URL || "https://pingdigital.online"

    // const message = `Olá ${guest.nome}! 😊\nCom muito carinho partilhamos o convite para o casamento de Assa & Eleutério. 👰💍🤵\n\nPor favor, confirmem a vossa presença acessando: ${baseUrl}/?token=${guest.token}\n\nCom carinho,\nOs noivos!`

    const emojis = {
      smile: "\u{1F60A}", // 😊
      bride: "\u{1F470}", // 👰
      ring: "\u{1F48D}", // 💍
      groom: "\u{1F935}", // 🤵
    }

    // Construct message with Unicode emojis
    const message = `Olá ${guest.nome}! ${emojis.smile}\nCom muito carinho partilhamos o convite para o casamento de Assa & Eleutério. ${emojis.bride}${emojis.ring}${emojis.groom}\n\nPor favor, confirmem a vossa presença acessando: ${baseUrl}/?token=${guest.token}\n\nCom carinho,\nOs noivos!`

    // Encode message, ensuring UTF-8 compatibility
    let encodedMessage
    try {
      encodedMessage = encodeURIComponent(message)
      console.log("Encoded message:", encodedMessage)
    } catch (error) {
      console.error("Error encoding message:", error)
      // Fallback: Replace emojis with text
      const fallbackMessage = `Olá ${guest.nome}! :)\nCom muito carinho partilhamos o convite para o casamento de Assa & Eleutério. [Noiva][Anel][Noivo]\n\nPor favor, confirmem a vossa presença acessando: ${baseUrl}/?token=${guest.token}\n\nCom carinho,\nOs noivos!`
      encodedMessage = encodeURIComponent(fallbackMessage)
      console.log("Fallback encoded message:", encodedMessage)
      toast({
        variant: "destructive",
        title: "Aviso",
        description: "Emojis não suportados. Usando texto alternativo.",
      })
    }

    // Construct WhatsApp URL
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`

    // Log final URL for debugging
    console.log("WhatsApp URL:", whatsappUrl)


    // const encodedMessage = encodeURIComponent(message)
    // const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`

    window.open(whatsappUrl, "_blank")
    toast({
      variant: "success",
      title: "WhatsApp Aberto! 📱",
      description: "Mensagem de convite preparada no WhatsApp",
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const lines = content.split("\n")
      const newGuests: any[] = []

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        const [nome, telefone, email] = line.split(",").map((s) => s.trim())
        if (nome && telefone) {
          newGuests.push({
            nome,
            telefone,
            email: email || null,
            unique_url: generateUniqueUrl(nome),
            rsvp_deadline: "2025-08-25T23:59:59Z",
          })
        }
      }

      toast({
        variant: "success",
        title: "Upload Processado! 📊",
        description: `${newGuests.length} convidados identificados no arquivo`,
      })
    }

    reader.readAsText(file)
    event.target.value = ""
  }

  const exportToCSV = () => {
    const csvContent = [
      "Nome,Telefone,Email,Status,Mesa,URL Única,Convite Enviado,Data de Criação",
      ...guests.map((guest) => {
        const phoneNumber = guest.telefone || guest.phone || guest.telephone || ""
        return [
          guest.nome,
          phoneNumber,
          guest.email || "",
          guest.status,
          guest.mesa || "",
          guest.unique_url || "",
          guest.invitation_sent_at ? "Sim" : "Não",
          guest.created_at,
        ].join(",")
      }),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "convidados.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      variant: "success",
      title: "Exportado! 📥",
      description: "Lista de convidados exportada com sucesso",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado"
      case "rejected":
        return "Rejeitado"
      default:
        return "Pendente"
    }
  }

  const getPhoneNumber = (guest: Guest) => {
    return guest.telefone || guest.phone || guest.telephone || ""
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto mb-4"></div>
        <p>Carregando convidados...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Schema Error Alert */}
      {schemaError && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="w-5 h-5" />
            <div>
              <h3 className="font-semibold">Atenção: Base de Dados Precisa ser Atualizada</h3>
              <p className="text-sm mt-1">{schemaError}</p>
              <p className="text-sm mt-2">
                Execute o script SQL <code>fix-guest-schema.sql</code> para adicionar a coluna telefone.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Email Info Alert */}
      {emailInfo && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800">
            <Info className="w-5 h-5" />
            <div>
              <h3 className="font-semibold">Informação sobre Envio de Emails</h3>
              <p className="text-sm mt-1">{emailInfo}</p>
              <p className="text-sm mt-2">
                Para usar um domínio personalizado, configure-o no painel do Resend e atualize o código.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Confirmados</p>
              <p className="text-2xl font-bold text-green-900">{stats.confirmed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Rejeitados</p>
              <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Convites Enviados</p>
              <p className="text-2xl font-bold text-purple-900">{stats.invitationsSent}</p>
            </div>
            <Mail className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Analytics Quick View */}
      <div className="mb-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-rose-600" />
              Analytics Rápido
            </h2>
            <button className="text-rose-600 hover:text-rose-700 font-medium text-sm">
              Ver Relatório Completo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">{Math.round((stats.confirmed / stats.total) * 100)}%</div>
              <div className="text-sm text-blue-700">Taxa de Confirmação</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <PieChart className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">3.2</div>
              <div className="text-sm text-green-700">Dias Médios de Resposta</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900">{Math.round((stats.invitationsSent / stats.total) * 100)}%</div>
              <div className="text-sm text-purple-700">Convites Enviados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar convidados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 font-quicksand"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            disabled={!!schemaError}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors font-josefin"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={!!schemaError}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors font-josefin"
          >
            <Upload className="w-4 h-4" />
            Upload Excel
          </button>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-josefin"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Guests Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-josefin">
                  Convidado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-josefin">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-josefin">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-josefin">
                  Mesa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-josefin">
                  Convite
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-josefin">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGuests.map((guest) => {
                const phoneNumber = getPhoneNumber(guest)
                return (
                  <tr key={guest.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 font-quicksand">{guest.nome}</div>
                        <div className="text-sm text-gray-500 font-quicksand">ID: {guest.unique_url || guest.token}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-quicksand">{phoneNumber}</div>
                      {guest.email && <div className="text-sm text-gray-500 font-quicksand">{guest.email}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(guest.status)}
                        <span className="text-sm text-gray-900 font-quicksand">{getStatusText(guest.status)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-quicksand">{guest.mesa || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {guest.invitation_sent_at ? (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-quicksand">Enviado</span>
                        ) : (
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full font-quicksand">Não enviado</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-1">
                        <button
                          onClick={() => copyGuestUrl(guest)}
                          className="text-blue-600 hover:text-blue-900 p-1 animate-in slide-in-from-right duration-300"
                          title="Copiar link do convite"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openGuestPage(guest)}
                          className="text-green-600 hover:text-green-900 p-1 animate-in slide-in-from-right duration-300"
                          title="Abrir página do convidado"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        {guest.email && (
                          <button
                            onClick={() => {
                              setSelectedGuestForEmail(guest)
                              setShowTemplateSelector(true)
                            }}
                            disabled={sendingInvitation === guest.id}
                            className="text-purple-600 hover:text-purple-900 p-1 disabled:opacity-50 animate-in slide-in-from-right duration-300"
                            title="Enviar email"
                          >
                            {sendingInvitation === guest.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                            ) : (
                              <Mail className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        {phoneNumber && (
                          <button
                            onClick={() => handleSendWhatsApp(guest)}
                            disabled={sendingInvitation === guest.id}
                            className="text-whatsapp-600 hover:text-whatsapp-900 p-1 disabled:opacity-50 animate-in slide-in-from-right duration-300"
                            title="Enviar por WhatsApp"
                            aria-label={`Enviar convite por WhatsApp para ${guest.nome}`}
                          >
                            <img src="/icons/whatsapp_icon.svg" alt="WhatsApp" className="w-6 h-6" />
                          </button>
                        )}
                        {phoneNumber && (
                          <button
                            onClick={() => handleSendInvitation(guest.id, "sms")}
                            disabled={sendingInvitation === guest.id}
                            className="text-orange-600 hover:text-orange-900 p-1 disabled:opacity-50 animate-in slide-in-from-right duration-300"
                            title="Enviar por SMS"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        )}
                        <button className="text-blue-600 hover:text-blue-900 p-1 animate-in slide-in-from-right duration-300" title="Editar">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 animate-in slide-in-from-right duration-300" title="Excluir">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Guest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-josefin">Adicionar Novo Convidado</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-quicksand">Nome Completo</label>
                  <input
                    type="text"
                    value={newGuest.nome}
                    onChange={(e) => setNewGuest({ ...newGuest, nome: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 font-quicksand"
                    placeholder="Ex: João Silva"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-quicksand">Telefone</label>
                  <input
                    type="tel"
                    value={newGuest.telefone}
                    onChange={(e) => setNewGuest({ ...newGuest, telefone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 font-quicksand"
                    placeholder="Ex: +258 84 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-quicksand">Email (opcional)</label>
                  <input
                    type="email"
                    value={newGuest.email}
                    onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 font-quicksand"
                    placeholder="Ex: joao@example.com"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddGuest}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg transition-colors font-josefin"
                >
                  Adicionar
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors font-josefin"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Template Selector Modal */}
      {showTemplateSelector && selectedGuestForEmail && (
        <EmailTemplateSelector
          guestName={selectedGuestForEmail.nome}
          onSend={(templateType, customMessage) =>
            handleSendInvitation(selectedGuestForEmail.id, "email", templateType, customMessage)
          }
          isLoading={sendingInvitation === selectedGuestForEmail.id}
        />
      )}
    </div>
  )
}