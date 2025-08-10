"use client"

import { useState } from "react"
import { Calendar, Users, Camera, Wine, Palette, Settings, TrendingUp, Clock, CheckCircle, AlertTriangle, Download, Share2, Eye, Heart } from 'lucide-react'

export default function WeddingDashboard() {
  const [activeSection, setActiveSection] = useState('overview')

  // Mock data - in real app this would come from API
  const stats = {
    totalGuests: 150,
    confirmedGuests: 89,
    pendingGuests: 45,
    rejectedGuests: 16,
    totalPhotos: 234,
    totalCost: 125000,
    daysUntilWedding: 45
  }

  const recentActivity = [
    { id: 1, type: 'rsvp', message: 'Maria Santos confirmou presença', time: '2 horas atrás', icon: CheckCircle, color: 'text-green-600' },
    { id: 2, type: 'photo', message: '12 novas fotos adicionadas', time: '4 horas atrás', icon: Camera, color: 'text-blue-600' },
    { id: 3, type: 'guest', message: 'João Silva adicionado à lista', time: '1 dia atrás', icon: Users, color: 'text-purple-600' },
    { id: 4, type: 'task', message: 'Design do convite finalizado', time: '2 dias atrás', icon: Palette, color: 'text-pink-600' }
  ]

  const upcomingTasks = [
    { id: 1, task: 'Finalizar lista de bebidas', deadline: '2025-01-15', priority: 'high', completed: false },
    { id: 2, task: 'Enviar convites por email', deadline: '2025-01-20', priority: 'medium', completed: false },
    { id: 3, task: 'Confirmar decoração', deadline: '2025-01-25', priority: 'high', completed: true },
    { id: 4, task: 'Organizar mesas', deadline: '2025-02-01', priority: 'low', completed: false }
  ]

  const eventProgress = [
    { event: 'Copo de Água', progress: 100, color: 'bg-green-500' },
    { event: 'Cerimónia Civil', progress: 85, color: 'bg-blue-500' },
    { event: 'Cerimónia Religiosa', progress: 70, color: 'bg-purple-500' },
    { event: 'Festa de Casamento', progress: 45, color: 'bg-orange-500' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Painel de Controlo</h1>
              <p className="text-gray-600 mt-1">Casamento de Assa & Eleutério</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-rose-600">{stats.daysUntilWedding}</div>
                <div className="text-sm text-gray-500">dias restantes</div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total de Convidados</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalGuests}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+12</span>
              <span className="text-gray-500 ml-1">esta semana</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Confirmações</p>
                <p className="text-3xl font-bold text-gray-900">{stats.confirmedGuests}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">{Math.round((stats.confirmedGuests / stats.totalGuests) * 100)}%</span>
              <span className="text-gray-500 ml-1">taxa de confirmação</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Fotos Partilhadas</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPhotos}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+45</span>
              <span className="text-gray-500 ml-1">hoje</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Orçamento Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCost.toLocaleString()} MT</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-orange-600 font-medium">85%</span>
              <span className="text-gray-500 ml-1">do orçamento usado</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress dos Eventos */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Progresso dos Eventos</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {eventProgress.map((event, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{event.event}</span>
                        <span className="text-sm text-gray-500">{event.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${event.color} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${event.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Confirmações RSVP */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Status das Confirmações</h2>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">{stats.confirmedGuests}</div>
                    <div className="text-sm text-gray-500">Confirmados</div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-10 h-10 text-yellow-600" />
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">{stats.pendingGuests}</div>
                    <div className="text-sm text-gray-500">Pendentes</div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <AlertTriangle className="w-10 h-10 text-red-600" />
                    </div>
                    <div className="text-2xl font-bold text-red-600">{stats.rejectedGuests}</div>
                    <div className="text-sm text-gray-500">Recusados</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Galeria de Fotos Recentes */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Fotos Recentes</h2>
                <button className="text-rose-600 hover:text-rose-700 font-medium text-sm">
                  Ver Todas
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={`/placeholder.svg?height=150&width=150&query=wedding photo ${i}`}
                        alt={`Foto ${i}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Actividade Recente */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Actividade Recente</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = activity.icon
                    return (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Tarefas Pendentes */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Tarefas Pendentes</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className={`p-3 rounded-lg border ${task.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          className="mt-1 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                          readOnly
                        />
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${task.completed ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                            {task.task}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">{task.deadline}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              task.priority === 'high' ? 'bg-red-100 text-red-700' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Acções Rápidas */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Acções Rápidas</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <Download className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Exportar Lista de Convidados</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <Share2 className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">Partilhar Convite</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <Eye className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Pré-visualizar Site</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Configurações</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
