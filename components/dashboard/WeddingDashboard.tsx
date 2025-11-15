'use client';

import { useState } from 'react';
import {
  Calendar,
  Users,
  Camera,
  Wine,
  Palette,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Share2,
  Eye,
  Heart,
} from 'lucide-react';

export default function WeddingDashboard() {
  const [activeSection, setActiveSection] = useState('overview');

  // Mock data - in real app this would come from API
  const stats = {
    totalGuests: 150,
    confirmedGuests: 89,
    pendingGuests: 45,
    rejectedGuests: 16,
    totalPhotos: 234,
    totalCost: 125000,
    daysUntilWedding: 45,
  };

  const recentActivity = [
    {
      id: 1,
      type: 'rsvp',
      message: 'Maria Santos confirmou presença',
      time: '2 horas atrás',
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      id: 2,
      type: 'photo',
      message: '12 novas fotos adicionadas',
      time: '4 horas atrás',
      icon: Camera,
      color: 'text-blue-600',
    },
    {
      id: 3,
      type: 'guest',
      message: 'João Silva adicionado à lista',
      time: '1 dia atrás',
      icon: Users,
      color: 'text-purple-600',
    },
    {
      id: 4,
      type: 'task',
      message: 'Design do convite finalizado',
      time: '2 dias atrás',
      icon: Palette,
      color: 'text-pink-600',
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      task: 'Finalizar lista de bebidas',
      deadline: '2025-01-15',
      priority: 'high',
      completed: false,
    },
    {
      id: 2,
      task: 'Enviar convites por email',
      deadline: '2025-01-20',
      priority: 'medium',
      completed: false,
    },
    {
      id: 3,
      task: 'Confirmar decoração',
      deadline: '2025-01-25',
      priority: 'high',
      completed: true,
    },
    {
      id: 4,
      task: 'Organizar mesas',
      deadline: '2025-02-01',
      priority: 'low',
      completed: false,
    },
  ];

  const eventProgress = [
    { event: 'Copo de Água', progress: 100, color: 'bg-green-500' },
    { event: 'Cerimónia Civil', progress: 85, color: 'bg-blue-500' },
    { event: 'Cerimónia Religiosa', progress: 70, color: 'bg-purple-500' },
    { event: 'Festa de Casamento', progress: 45, color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Painel de Controlo</h1>
              <p className="mt-1 text-gray-600">Casamento de Assa & Eleutério</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-rose-600">{stats.daysUntilWedding}</div>
                <div className="text-sm text-gray-500">dias restantes</div>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Convidados</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalGuests}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="font-medium text-green-600">+12</span>
              <span className="ml-1 text-gray-500">esta semana</span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmações</p>
                <p className="text-3xl font-bold text-gray-900">{stats.confirmedGuests}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="font-medium text-green-600">
                {Math.round((stats.confirmedGuests / stats.totalGuests) * 100)}%
              </span>
              <span className="ml-1 text-gray-500">taxa de confirmação</span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fotos Partilhadas</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPhotos}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Camera className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="font-medium text-green-600">+45</span>
              <span className="ml-1 text-gray-500">hoje</span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Orçamento Total</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalCost.toLocaleString()} MT
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="font-medium text-orange-600">85%</span>
              <span className="ml-1 text-gray-500">do orçamento usado</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Progress dos Eventos */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900">Progresso dos Eventos</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {eventProgress.map((event, index) => (
                    <div key={index}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-gray-900">{event.event}</span>
                        <span className="text-sm text-gray-500">{event.progress}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
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
            <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900">Status das Confirmações</h2>
              </div>
              <div className="p-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">{stats.confirmedGuests}</div>
                    <div className="text-sm text-gray-500">Confirmados</div>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
                      <Clock className="h-10 w-10 text-yellow-600" />
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">{stats.pendingGuests}</div>
                    <div className="text-sm text-gray-500">Pendentes</div>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                      <AlertTriangle className="h-10 w-10 text-red-600" />
                    </div>
                    <div className="text-2xl font-bold text-red-600">{stats.rejectedGuests}</div>
                    <div className="text-sm text-gray-500">Recusados</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Galeria de Fotos Recentes */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
              <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900">Fotos Recentes</h2>
                <button className="text-sm font-medium text-rose-600 hover:text-rose-700">
                  Ver Todas
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="aspect-square overflow-hidden rounded-lg bg-gray-200">
                      <img
                        src={`/placeholder.svg?height=150&width=150&query=wedding photo ${i}`}
                        alt={`Foto ${i}`}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
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
            <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900">Actividade Recente</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div
                          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100`}
                        >
                          <Icon className={`h-4 w-4 ${activity.color}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tarefas Pendentes */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900">Tarefas Pendentes</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`rounded-lg border p-3 ${task.completed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          className="mt-1 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                          readOnly
                        />
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${task.completed ? 'text-green-700 line-through' : 'text-gray-900'}`}
                          >
                            {task.task}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs text-gray-500">{task.deadline}</span>
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${
                                task.priority === 'high'
                                  ? 'bg-red-100 text-red-700'
                                  : task.priority === 'medium'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {task.priority === 'high'
                                ? 'Alta'
                                : task.priority === 'medium'
                                  ? 'Média'
                                  : 'Baixa'}
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
            <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900">Acções Rápidas</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-50">
                    <Download className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Exportar Lista de Convidados</span>
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-50">
                    <Share2 className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">Partilhar Convite</span>
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-50">
                    <Eye className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Pré-visualizar Site</span>
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-gray-50">
                    <Settings className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Configurações</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
