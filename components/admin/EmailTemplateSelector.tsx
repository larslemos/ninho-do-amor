"use client"

import { useState } from "react"
import { Mail, Calendar, Heart, Clock, ThumbsUp, Bell, AlertTriangle } from "lucide-react"
import type { EmailTemplateType } from "@/lib/email-templates"

interface EmailTemplateSelectorProps {
  onSend: (templateType: EmailTemplateType, customMessage?: string) => void
  isLoading: boolean
  guestName: string
}

const templates = [
  {
    type: "wedding-invitation" as EmailTemplateType,
    name: "Convite de Casamento",
    description: "Convite formal inicial com todos os detalhes",
    icon: Mail,
    color: "bg-rose-500",
    preview: "Convite elegante com detalhes completos do casamento",
  },
  {
    type: "save-the-date" as EmailTemplateType,
    name: "Save the Date",
    description: "Aviso antecipado para reservar a data",
    icon: Calendar,
    color: "bg-purple-500",
    preview: "Notificação prévia para que o convidado reserve a data",
  },
  {
    type: "rsvp-reminder" as EmailTemplateType,
    name: "Lembrete RSVP",
    description: "Lembrete para confirmar presença",
    icon: Clock,
    color: "bg-yellow-500",
    preview: "Lembrete urgente para convidados que ainda não confirmaram",
  },
  {
    type: "rsvp-confirmation" as EmailTemplateType,
    name: "Confirmação RSVP",
    description: "Agradecimento pela confirmação",
    icon: ThumbsUp,
    color: "bg-green-500",
    preview: "Email de agradecimento após confirmação de presença",
  },
  {
    type: "wedding-day-reminder" as EmailTemplateType,
    name: "Lembrete do Dia",
    description: "Lembrete no dia do casamento",
    icon: Bell,
    color: "bg-orange-500",
    preview: "Lembrete especial enviado no dia do casamento",
  },
  {
    type: "last-minute-update" as EmailTemplateType,
    name: "Atualização Urgente",
    description: "Mudanças de última hora",
    icon: AlertTriangle,
    color: "bg-red-500",
    preview: "Para comunicar mudanças importantes de última hora",
  },
  {
    type: "post-wedding-thank-you" as EmailTemplateType,
    name: "Agradecimento",
    description: "Agradecimento após o casamento",
    icon: Heart,
    color: "bg-pink-500",
    preview: "Email de agradecimento enviado após o casamento",
  },
]

export default function EmailTemplateSelector({ onSend, isLoading, guestName }: EmailTemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateType>("wedding-invitation")
  const [customMessage, setCustomMessage] = useState("")
  const [showCustomMessage, setShowCustomMessage] = useState(false)

  const handleSend = () => {
    onSend(selectedTemplate, customMessage.trim() || undefined)
  }

  const selectedTemplateData = templates.find((t) => t.type === selectedTemplate)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white p-6">
          <h3 className="text-xl font-bold mb-2">📧 Selecionar Template de Email</h3>
          <p className="text-rose-100">Escolha o template apropriado para {guestName}</p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Template Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {templates.map((template) => {
              const Icon = template.icon
              const isSelected = selectedTemplate === template.type

              return (
                <button
                  key={template.type}
                  onClick={() => setSelectedTemplate(template.type)}
                  className={`p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                    isSelected ? "border-rose-500 bg-rose-50 shadow-md" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${template.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                      <p className="text-xs text-gray-500">{template.preview}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Selected Template Preview */}
          {selectedTemplateData && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <selectedTemplateData.icon className="w-5 h-5 text-rose-600" />
                <h4 className="font-semibold text-gray-900">Template Selecionado: {selectedTemplateData.name}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">{selectedTemplateData.preview}</p>

              {/* Custom Message Option */}
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showCustomMessage}
                    onChange={(e) => setShowCustomMessage(e.target.checked)}
                    className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Adicionar mensagem personalizada</span>
                </label>

                {showCustomMessage && (
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Digite uma mensagem personalizada (opcional)..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
                  />
                )}
              </div>
            </div>
          )}

          {/* Template Features */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">✨ Recursos dos Templates:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Design responsivo para todos os dispositivos</li>
              <li>• Personalização automática com dados do convidado</li>
              <li>• Links diretos para confirmação de presença</li>
              <li>• Branding consistente com o tema do casamento</li>
              <li>• Otimizado para diferentes clientes de email</li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Enviar Email
                </>
              )}
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
