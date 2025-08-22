'use client';

import { useState } from 'react';
import {
  Mail,
  Calendar,
  Heart,
  Clock,
  ThumbsUp,
  Bell,
  AlertTriangle,
} from 'lucide-react';
import type { EmailTemplateType } from '@/lib/email-templates';

interface EmailTemplateSelectorProps {
  onSend: (templateType: EmailTemplateType, customMessage?: string) => void;
  isLoading: boolean;
  guestName: string;
}

const templates = [
  {
    type: 'wedding-invitation' as EmailTemplateType,
    name: 'Convite de Casamento',
    description: 'Convite formal inicial com todos os detalhes',
    icon: Mail,
    color: 'bg-rose-500',
    preview: 'Convite elegante com detalhes completos do casamento',
  },
  {
    type: 'save-the-date' as EmailTemplateType,
    name: 'Save the Date',
    description: 'Aviso antecipado para reservar a data',
    icon: Calendar,
    color: 'bg-purple-500',
    preview: 'Notificação prévia para que o convidado reserve a data',
  },
  {
    type: 'rsvp-reminder' as EmailTemplateType,
    name: 'Lembrete RSVP',
    description: 'Lembrete para confirmar presença',
    icon: Clock,
    color: 'bg-yellow-500',
    preview: 'Lembrete urgente para convidados que ainda não confirmaram',
  },
  {
    type: 'rsvp-confirmation' as EmailTemplateType,
    name: 'Confirmação RSVP',
    description: 'Agradecimento pela confirmação',
    icon: ThumbsUp,
    color: 'bg-green-500',
    preview: 'Email de agradecimento após confirmação de presença',
  },
  {
    type: 'wedding-day-reminder' as EmailTemplateType,
    name: 'Lembrete do Dia',
    description: 'Lembrete no dia do casamento',
    icon: Bell,
    color: 'bg-orange-500',
    preview: 'Lembrete especial enviado no dia do casamento',
  },
  {
    type: 'last-minute-update' as EmailTemplateType,
    name: 'Atualização Urgente',
    description: 'Mudanças de última hora',
    icon: AlertTriangle,
    color: 'bg-red-500',
    preview: 'Para comunicar mudanças importantes de última hora',
  },
  {
    type: 'post-wedding-thank-you' as EmailTemplateType,
    name: 'Agradecimento',
    description: 'Agradecimento após o casamento',
    icon: Heart,
    color: 'bg-pink-500',
    preview: 'Email de agradecimento enviado após o casamento',
  },
];

export default function EmailTemplateSelector({
  onSend,
  isLoading,
  guestName,
}: EmailTemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplateType>('wedding-invitation');
  const [customMessage, setCustomMessage] = useState('');
  const [showCustomMessage, setShowCustomMessage] = useState(false);

  const handleSend = () => {
    onSend(selectedTemplate, customMessage.trim() || undefined);
  };

  const selectedTemplateData = templates.find(
    (t) => t.type === selectedTemplate
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 p-6 text-white">
          <h3 className="mb-2 text-xl font-bold">
            📧 Selecionar Template de Email
          </h3>
          <p className="text-rose-100">
            Escolha o template apropriado para {guestName}
          </p>
        </div>

        <div className="max-h-[calc(90vh-200px)] overflow-y-auto p-6">
          {/* Template Grid */}
          <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => {
              const Icon = template.icon;
              const isSelected = selectedTemplate === template.type;

              return (
                <button
                  key={template.type}
                  onClick={() => setSelectedTemplate(template.type)}
                  className={`rounded-lg border-2 p-4 text-left transition-all hover:shadow-md ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`h-10 w-10 rounded-lg ${template.color} flex flex-shrink-0 items-center justify-center`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="mb-1 font-semibold text-gray-900">
                        {template.name}
                      </h4>
                      <p className="mb-2 text-sm text-gray-600">
                        {template.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {template.preview}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Template Preview */}
          {selectedTemplateData && (
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <div className="mb-3 flex items-center gap-3">
                <selectedTemplateData.icon className="h-5 w-5 text-rose-600" />
                <h4 className="font-semibold text-gray-900">
                  Template Selecionado: {selectedTemplateData.name}
                </h4>
              </div>
              <p className="mb-3 text-sm text-gray-600">
                {selectedTemplateData.preview}
              </p>

              {/* Custom Message Option */}
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showCustomMessage}
                    onChange={(e) => setShowCustomMessage(e.target.checked)}
                    className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Adicionar mensagem personalizada
                  </span>
                </label>

                {showCustomMessage && (
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Digite uma mensagem personalizada (opcional)..."
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                  />
                )}
              </div>
            </div>
          )}

          {/* Template Features */}
          <div className="mb-6 rounded-lg bg-blue-50 p-4">
            <h4 className="mb-2 font-semibold text-blue-900">
              ✨ Recursos dos Templates:
            </h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Design responsivo para todos os dispositivos</li>
              <li>• Personalização automática com dados do convidado</li>
              <li>• Links diretos para confirmação de presença</li>
              <li>• Branding consistente com o tema do casamento</li>
              <li>• Otimizado para diferentes clientes de email</li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <div className="flex gap-3">
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-rose-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-rose-700 disabled:bg-rose-400"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Enviar Email
                </>
              )}
            </button>
            <button
              onClick={() => window.history.back()}
              className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
