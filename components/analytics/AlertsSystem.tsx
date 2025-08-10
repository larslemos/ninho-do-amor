"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Clock, DollarSign, Users, TrendingDown, Bell, X, Check, Settings, Filter, Calendar, Mail } from 'lucide-react'

interface Alert {
  id: string
  type: 'deadline-approaching' | 'budget-overrun' | 'low-rsvp-rate' | 'low-engagement' | 'technical-issue' | 'capacity-exceeded'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  metric: string
  threshold: number
  currentValue: number
  createdAt: string
  acknowledged: boolean
  actionRequired: boolean
  suggestedActions?: string[]
}

interface AlertsSystemProps {
  weddingId: string
}

export default function AlertsSystem({ weddingId }: AlertsSystemProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all')
  const [showSettings, setShowSettings] = useState(false)

  // Mock alerts data
  const mockAlerts: Alert[] = [
    {
      id: '1',
      type: 'deadline-approaching',
      severity: 'high',
      title: 'Prazo RSVP Aproximando',
      message: '45 convidados ainda não responderam ao convite. O prazo limite é em 7 dias.',
      metric: 'rsvp_deadline',
      threshold: 7,
      currentValue: 7,
      createdAt: '2025-01-21T10:00:00Z',
      acknowledged: false,
      actionRequired: true,
      suggestedActions: [
        'Enviar lembrete por WhatsApp',
        'Fazer chamadas telefónicas',
        'Estender prazo por mais 3 dias'
      ]
    },
    {
      id: '2',
      type: 'budget-overrun',
      severity: 'medium',
      title: 'Orçamento Decoração Excedido',
      message: 'A categoria decoração excedeu 15% do orçamento previsto (25.000 MT vs 21.500 MT planeados).',
      metric: 'budget_decoration',
      threshold: 21500,
      currentValue: 25000,
      createdAt: '2025-01-20T15:30:00Z',
      acknowledged: false,
      actionRequired: true,
      suggestedActions: [
        'Renegociar preços com fornecedor',
        'Reduzir alguns itens decorativos',
        'Realocar orçamento de outras categorias'
      ]
    },
    {
      id: '3',
      type: 'low-engagement',
      severity: 'low',
      title: 'Baixa Taxa de Abertura de Emails',
      message: 'A taxa de abertura de emails está em 45%, abaixo da média recomendada de 60%.',
      metric: 'email_open_rate',
      threshold: 60,
      currentValue: 45,
      createdAt: '2025-01-19T09:15:00Z',
      acknowledged: true,
      actionRequired: false,
      suggestedActions: [
        'Melhorar assunto dos emails',
        'Enviar em horários diferentes',
        'Usar mais WhatsApp para comunicação'
      ]
    },
    {
      id: '4',
      type: 'capacity-exceeded',
      severity: 'critical',
      title: 'Capacidade do Local Excedida',
      message: 'O número de confirmações (89) excede a capacidade máxima do salão (85 pessoas).',
      metric: 'venue_capacity',
      threshold: 85,
      currentValue: 89,
      createdAt: '2025-01-18T14:20:00Z',
      acknowledged: false,
      actionRequired: true,
      suggestedActions: [
        'Contactar o local para confirmar capacidade real',
        'Considerar local alternativo',
        'Reorganizar layout das mesas'
      ]
    },
    {
      id: '5',
      type: 'low-rsvp-rate',
      severity: 'medium',
      title: 'Taxa de Resposta Baixa',
      message: 'Apenas 70% dos convidados responderam ao convite. Meta: 85%.',
      metric: 'rsvp_response_rate',
      threshold: 85,
      currentValue: 70,
      createdAt: '2025-01-17T11:45:00Z',
      acknowledged: true,
      actionRequired: false,
      suggestedActions: [
        'Enviar lembretes personalizados',
        'Contactar convidados por telefone',
        'Usar redes sociais para lembrar'
      ]
    }
  ]

  useEffect(() => {
    setAlerts(mockAlerts)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-300 text-red-800'
      case 'high': return 'bg-orange-100 border-orange-300 text-orange-800'
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      case 'low': return 'bg-blue-100 border-blue-300 text-blue-800'
      default: return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case 'deadline-approaching': return Clock
      case 'budget-overrun': return DollarSign
      case 'low-rsvp-rate': return Users
      case 'low-engagement': return TrendingDown
      case 'capacity-exceeded': return AlertTriangle
      default: return AlertTriangle
    }
  }

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ))
  }

  const handleDismiss = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const filteredAlerts = alerts.filter(alert => {
    switch (filter) {
      case 'unread': return !alert.acknowledged
      case 'critical': return alert.severity === 'critical' || alert.severity === 'high'
      default: return true
    }
  })

  const unreadCount = alerts.filter(alert => !alert.acknowledged).length
  const criticalCount = alerts.filter(alert => alert.severity === 'critical' || alert.severity === 'high').length

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Bell className="w-8 h-8 text-rose-600" />
            Sistema de Alertas
          </h1>
          <p className="text-gray-600 mt-1">Monitorização em tempo real do seu casamento</p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <Settings className="w-5 h-5" />
          Configurações
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
              <p className="text-sm text-gray-600">Total de Alertas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              <p className="text-sm text-gray-600">Não Lidos</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{criticalCount}</p>
              <p className="text-sm text-gray-600">Críticos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <div className="flex gap-2">
            {[
              { id: 'all', name: 'Todos', count: alerts.length },
              { id: 'unread', name: 'Não Lidos', count: unreadCount },
              { id: 'critical', name: 'Críticos', count: criticalCount }
            ].map((filterOption) => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterOption.id
                    ? 'bg-rose-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterOption.name} ({filterOption.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum alerta encontrado</h3>
            <p className="text-gray-600">Não há alertas para os filtros seleccionados.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const Icon = getSeverityIcon(alert.type)
            return (
              <div
                key={alert.id}
                className={`bg-white rounded-xl shadow-lg border-l-4 ${
                  alert.severity === 'critical' ? 'border-l-red-500' :
                  alert.severity === 'high' ? 'border-l-orange-500' :
                  alert.severity === 'medium' ? 'border-l-yellow-500' :
                  'border-l-blue-500'
                } p-6 ${!alert.acknowledged ? 'ring-2 ring-rose-200' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    alert.severity === 'critical' ? 'bg-red-100' :
                    alert.severity === 'high' ? 'bg-orange-100' :
                    alert.severity === 'medium' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      alert.severity === 'critical' ? 'text-red-600' :
                      alert.severity === 'high' ? 'text-orange-600' :
                      alert.severity === 'medium' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                            {alert.severity === 'critical' ? 'Crítico' :
                             alert.severity === 'high' ? 'Alto' :
                             alert.severity === 'medium' ? 'Médio' : 'Baixo'}
                          </span>
                          {!alert.acknowledged && (
                            <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-2">{alert.message}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(alert.createdAt).toLocaleDateString('pt-MZ')} às {' '}
                          {new Date(alert.createdAt).toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      <div className="flex gap-2 ml-4">
                        {!alert.acknowledged && (
                          <button
                            onClick={() => handleAcknowledge(alert.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Marcar como lido"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDismiss(alert.id)}
                          className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Dispensar alerta"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Metric Details */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Valor Atual:</span>
                        <span className="font-medium">{alert.currentValue}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Limite:</span>
                        <span className="font-medium">{alert.threshold}</span>
                      </div>
                    </div>

                    {/* Suggested Actions */}
                    {alert.suggestedActions && alert.suggestedActions.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Acções Sugeridas:</h4>
                        <ul className="space-y-1">
                          {alert.suggestedActions.map((action, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full flex-shrink-0"></div>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Configurações de Alertas</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Tipos de Alertas</h4>
                  <div className="space-y-3">
                    {[
                      { id: 'deadline', name: 'Prazos Aproximando', enabled: true },
                      { id: 'budget', name: 'Orçamento Excedido', enabled: true },
                      { id: 'rsvp', name: 'Taxa RSVP Baixa', enabled: true },
                      { id: 'engagement', name: 'Baixo Engagement', enabled: false },
                      { id: 'capacity', name: 'Capacidade Excedida', enabled: true }
                    ].map((alertType) => (
                      <div key={alertType.id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{alertType.name}</span>
                        <input
                          type="checkbox"
                          checked={alertType.enabled}
                          className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                          readOnly
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Notificações</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Email</span>
                      <input
                        type="checkbox"
                        checked={true}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                        readOnly
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">WhatsApp</span>
                      <input
                        type="checkbox"
                        checked={false}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                        readOnly
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">SMS</span>
                      <input
                        type="checkbox"
                        checked={false}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
