"use client"

import { useState, useEffect } from "react"
import { BarChart3, PieChart, TrendingUp, Users, Calendar, DollarSign, Camera, Mail, MapPin, Clock, Download, Filter, RefreshCw } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar, ScatterChart, Scatter } from 'recharts'

export default function ChartsPage() {
  const [selectedChart, setSelectedChart] = useState('overview')
  const [timeRange, setTimeRange] = useState('30d')
  const [loading, setLoading] = useState(false)

  // Mock data for charts
  const chartData = {
    rsvpTrend: [
      { date: '2025-01-01', confirmed: 45, pending: 78, rejected: 8, total: 131 },
      { date: '2025-01-07', confirmed: 62, pending: 65, rejected: 12, total: 139 },
      { date: '2025-01-14', confirmed: 75, pending: 58, rejected: 14, total: 147 },
      { date: '2025-01-21', confirmed: 89, pending: 45, rejected: 16, total: 150 }
    ],
    
    guestDemographics: [
      { name: 'Família', value: 65, color: '#8B5CF6' },
      { name: 'Amigos', value: 45, color: '#06B6D4' },
      { name: 'Trabalho', value: 25, color: '#10B981' },
      { name: 'Igreja', value: 15, color: '#F59E0B' }
    ],
    
    provinceDistribution: [
      { province: 'Maputo', guests: 78, percentage: 52 },
      { province: 'Gaza', guests: 32, percentage: 21 },
      { province: 'Inhambane', guests: 25, percentage: 17 },
      { province: 'Sofala', guests: 15, percentage: 10 }
    ],
    
    budgetBreakdown: [
      { category: 'Local', amount: 35000, percentage: 28, color: '#3B82F6' },
      { category: 'Catering', amount: 30000, percentage: 24, color: '#10B981' },
      { category: 'Decoração', amount: 25000, percentage: 20, color: '#F59E0B' },
      { category: 'Fotografia', amount: 15000, percentage: 12, color: '#8B5CF6' },
      { category: 'Música', amount: 10000, percentage: 8, color: '#EF4444' },
      { category: 'Outros', amount: 10000, percentage: 8, color: '#6B7280' }
    ],
    
    engagementMetrics: [
      { date: '2025-01-01', visits: 45, uniqueVisitors: 32, pageViews: 156, bounceRate: 35 },
      { date: '2025-01-07', visits: 78, uniqueVisitors: 54, pageViews: 289, bounceRate: 28 },
      { date: '2025-01-14', visits: 123, uniqueVisitors: 89, pageViews: 445, bounceRate: 22 },
      { date: '2025-01-21', visits: 156, uniqueVisitors: 112, pageViews: 623, bounceRate: 18 }
    ],
    
    photoActivity: [
      { event: 'Copo de Água', photos: 45, likes: 234, shares: 12 },
      { event: 'Civil', photos: 23, likes: 156, shares: 8 },
      { event: 'Religiosa', photos: 67, likes: 445, shares: 23 },
      { event: 'Festa', photos: 99, likes: 678, shares: 34 }
    ],
    
    communicationStats: [
      { channel: 'WhatsApp', sent: 150, delivered: 148, read: 142, responded: 89 },
      { channel: 'Email', sent: 150, delivered: 145, read: 98, responded: 67 },
      { channel: 'SMS', sent: 75, delivered: 74, read: 68, responded: 45 }
    ],
    
    timelineProgress: [
      { task: 'Convites Enviados', progress: 100, deadline: '2025-01-15' },
      { task: 'Confirmações RSVP', progress: 70, deadline: '2025-02-15' },
      { task: 'Menu Finalizado', progress: 85, deadline: '2025-02-01' },
      { task: 'Decoração Confirmada', progress: 60, deadline: '2025-02-20' },
      { task: 'Música Contratada', progress: 90, deadline: '2025-01-30' }
    ]
  }

  const chartTypes = [
    {
      id: 'overview',
      name: 'Visão Geral',
      description: 'Métricas principais em dashboard',
      icon: BarChart3,
      color: 'text-blue-600'
    },
    {
      id: 'guests',
      name: 'Análise de Convidados',
      description: 'Demografia e distribuição',
      icon: Users,
      color: 'text-green-600'
    },
    {
      id: 'budget',
      name: 'Análise Financeira',
      description: 'Orçamento e gastos',
      icon: DollarSign,
      color: 'text-orange-600'
    },
    {
      id: 'engagement',
      name: 'Engagement Digital',
      description: 'Website e interacções',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      id: 'communication',
      name: 'Comunicação',
      description: 'Emails, SMS e WhatsApp',
      icon: Mail,
      color: 'text-pink-600'
    },
    {
      id: 'timeline',
      name: 'Timeline do Projeto',
      description: 'Progresso e prazos',
      icon: Calendar,
      color: 'text-indigo-600'
    }
  ]

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-MZ', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <PieChart className="w-8 h-8 text-rose-600" />
                Visualizações Avançadas
              </h1>
              <p className="text-gray-600 mt-1">Gráficos interactivos e análises visuais</p>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              >
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
                <option value="all">Todo o período</option>
              </select>
              
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Exportar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Chart Type Selector */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {chartTypes.map((chart) => {
                const Icon = chart.icon
                const isActive = selectedChart === chart.id
                
                return (
                  <button
                    key={chart.id}
                    onClick={() => setSelectedChart(chart.id)}
                    className={`p-4 rounded-lg transition-all duration-200 text-left ${
                      isActive
                        ? 'bg-rose-600 text-white shadow-lg'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
                      isActive ? 'bg-white/20' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : chart.color}`} />
                    </div>
                    <h3 className="font-semibold text-sm">{chart.name}</h3>
                    <p className={`text-xs mt-1 ${isActive ? 'text-rose-100' : 'text-gray-500'}`}>
                      {chart.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Chart Content */}
        <div className="space-y-8">
          {/* Overview Charts */}
          {selectedChart === 'overview' && (
            <>
              <div className="grid lg:grid-cols-2 gap-8">
                {/* RSVP Trend */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendência de Confirmações</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData.rsvpTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={formatDate} />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => formatDate(value)}
                        formatter={(value, name) => [
                          value, 
                          name === 'confirmed' ? 'Confirmados' : 
                          name === 'pending' ? 'Pendentes' : 'Rejeitados'
                        ]}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="confirmed" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="pending" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="rejected" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Guest Demographics */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Demografia dos Convidados</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={chartData.guestDemographics}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.guestDemographics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Province Distribution */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Província</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.provinceDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="province" />
                      <YAxis />
                      <Tooltip formatter={(value) => [value, 'Convidados']} />
                      <Bar dataKey="guests" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Engagement Metrics */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Engagement</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData.engagementMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={formatDate} />
                      <YAxis />
                      <Tooltip labelFormatter={formatDate} />
                      <Legend />
                      <Line type="monotone" dataKey="visits" stroke="#3B82F6" strokeWidth={2} name="Visitas" />
                      <Line type="monotone" dataKey="uniqueVisitors" stroke="#8B5CF6" strokeWidth={2} name="Visitantes Únicos" />
                      <Line type="monotone" dataKey="pageViews" stroke="#06B6D4" strokeWidth={2} name="Visualizações" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* Guests Analysis */}
          {selectedChart === 'guests' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise Demográfica Detalhada</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={chartData.guestDemographics}>
                    <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                    <Tooltip />
                    <Legend />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição Geográfica</h3>
                <div className="space-y-4">
                  {chartData.provinceDistribution.map((province, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{province.province}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${province.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{province.guests}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Budget Analysis */}
          {selectedChart === 'budget' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição do Orçamento</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsPieChart>
                    <Pie
                      data={chartData.budgetBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      dataKey="amount"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                    >
                      {chartData.budgetBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes por Categoria</h3>
                <div className="space-y-4">
                  {chartData.budgetBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="font-medium">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(item.amount)}</div>
                        <div className="text-sm text-gray-500">{item.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Engagement Analysis */}
          {selectedChart === 'engagement' && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendência de Engagement</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={chartData.engagementMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={formatDate} />
                    <YAxis />
                    <Tooltip labelFormatter={formatDate} />
                    <Legend />
                    <Area type="monotone" dataKey="visits" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Visitas" />
                    <Area type="monotone" dataKey="pageViews" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Visualizações" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividade de Fotos por Evento</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.photoActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="event" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="photos" fill="#8B5CF6" name="Fotos" />
                    <Bar dataKey="likes" fill="#EC4899" name="Likes" />
                    <Bar dataKey="shares" fill="#06B6D4" name="Partilhas" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Communication Analysis */}
          {selectedChart === 'communication' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Eficácia da Comunicação</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData.communicationStats} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="channel" type="category" width={80} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sent" fill="#3B82F6" name="Enviados" />
                  <Bar dataKey="delivered" fill="#10B981" name="Entregues" />
                  <Bar dataKey="read" fill="#F59E0B" name="Lidos" />
                  <Bar dataKey="responded" fill="#8B5CF6" name="Respondidos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Timeline Analysis */}
          {selectedChart === 'timeline' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progresso do Timeline</h3>
              <div className="space-y-6">
                {chartData.timelineProgress.map((task, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-48 flex-shrink-0">
                      <h4 className="font-medium text-gray-900">{task.task}</h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(task.deadline).toLocaleDateString('pt-MZ')}
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Progresso</span>
                        <span className="text-sm font-bold text-gray-900">{task.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${
                            task.progress === 100 ? 'bg-green-500' :
                            task.progress >= 80 ? 'bg-blue-500' :
                            task.progress >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Export Options */}
        <div className="mt-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              📊 Exportar Visualizações
            </h3>
            <p className="text-gray-700 mb-6">
              Exporte os gráficos em alta resolução para apresentações e relatórios
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-semibold transition-colors">
                PNG (Alta Resolução)
              </button>
              <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-semibold transition-colors">
                PDF (Vectorial)
              </button>
              <button className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Relatório Completo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
