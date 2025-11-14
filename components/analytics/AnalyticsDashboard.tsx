'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Camera,
  Mail,
  AlertTriangle,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Heart,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Utensils,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AnalyticsDashboardProps {
  weddingId: string;
}

export default function AnalyticsDashboard({ weddingId }: AnalyticsDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState<any>(null);

  // Mock data - in real app this would come from API
  const mockAnalytics = {
    overview: {
      totalGuests: 150,
      confirmedGuests: 89,
      pendingGuests: 45,
      rejectedGuests: 16,
      responseRate: 70,
      websiteVisits: 1247,
      totalPhotos: 234,
      totalBudget: 125000,
      spentAmount: 89500,
    },
    trends: {
      rsvpTrend: [
        { date: '2025-01-01', confirmed: 45, pending: 78, rejected: 8 },
        { date: '2025-01-07', confirmed: 62, pending: 65, rejected: 12 },
        { date: '2025-01-14', confirmed: 75, pending: 58, rejected: 14 },
        { date: '2025-01-21', confirmed: 89, pending: 45, rejected: 16 },
      ],
      engagementTrend: [
        { date: '2025-01-01', visits: 45, uniqueVisitors: 32, pageViews: 156 },
        { date: '2025-01-07', visits: 78, uniqueVisitors: 54, pageViews: 289 },
        { date: '2025-01-14', visits: 123, uniqueVisitors: 89, pageViews: 445 },
        {
          date: '2025-01-21',
          visits: 156,
          uniqueVisitors: 112,
          pageViews: 623,
        },
      ],
      budgetTrend: [
        { month: 'Nov', planned: 25000, actual: 22000 },
        { month: 'Dez', planned: 50000, actual: 48500 },
        { month: 'Jan', planned: 75000, actual: 71200 },
        { month: 'Fev', planned: 100000, actual: 89500 },
      ],
    },
    demographics: {
      byRelationship: [
        { name: 'Família', value: 65, color: '#8B5CF6' },
        { name: 'Amigos', value: 45, color: '#06B6D4' },
        { name: 'Trabalho', value: 25, color: '#10B981' },
        { name: 'Igreja', value: 15, color: '#F59E0B' },
      ],
      byProvince: [
        { name: 'Maputo', value: 78 },
        { name: 'Gaza', value: 32 },
        { name: 'Inhambane', value: 25 },
        { name: 'Sofala', value: 15 },
      ],
      bySide: [
        { name: 'Noiva', value: 72, color: '#EC4899' },
        { name: 'Noivo', value: 68, color: '#3B82F6' },
        { name: 'Ambos', value: 10, color: '#8B5CF6' },
      ],
    },
    engagement: {
      deviceTypes: [
        { name: 'Telemóvel', value: 78, color: '#10B981' },
        { name: 'Desktop', value: 15, color: '#3B82F6' },
        { name: 'Tablet', value: 7, color: '#F59E0B' },
      ],
      trafficSources: [
        { name: 'WhatsApp', value: 45 },
        { name: 'Directo', value: 32 },
        { name: 'Facebook', value: 18 },
        { name: 'Email', value: 5 },
      ],
    },
    alerts: [
      {
        id: '1',
        type: 'deadline-approaching',
        severity: 'high',
        title: 'Prazo RSVP Aproximando',
        message: '45 convidados ainda não responderam. Prazo em 7 dias.',
        createdAt: '2025-01-21T10:00:00Z',
      },
      {
        id: '2',
        type: 'budget-overrun',
        severity: 'medium',
        title: 'Orçamento Decoração',
        message: 'Categoria decoração excedeu 15% do orçamento previsto.',
        createdAt: '2025-01-20T15:30:00Z',
      },
      {
        id: '3',
        type: 'low-engagement',
        severity: 'low',
        title: 'Baixo Engagement',
        message: 'Taxa de abertura de emails abaixo da média (45%).',
        createdAt: '2025-01-19T09:15:00Z',
      },
    ],
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4" />;
    if (change < 0) return <TrendingDown className="h-4 w-4" />;
    return null;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-rose-600" />
          <p className="text-gray-600">Carregando analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics & Relatórios</h1>
              <p className="mt-1 text-gray-600">Insights detalhados do seu casamento</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
              >
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
                <option value="all">Todo o período</option>
              </select>
              <button className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-white transition-colors hover:bg-rose-700">
                <Download className="h-4 w-4" />
                Exportar Relatório
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Alerts */}
        {analytics.alerts.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Alertas Importantes</h2>
            <div className="grid gap-4">
              {analytics.alerts.map((alert: any) => (
                <div
                  key={alert.id}
                  className={`rounded-lg border p-4 ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{alert.title}</h3>
                      <p className="mt-1 text-sm">{alert.message}</p>
                      <p className="mt-2 text-xs opacity-75">
                        {new Date(alert.createdAt).toLocaleDateString('pt-MZ')} às{' '}
                        {new Date(alert.createdAt).toLocaleTimeString('pt-MZ', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Visão Geral', icon: Eye },
                { id: 'guests', name: 'Convidados', icon: Users },
                { id: 'engagement', name: 'Engagement', icon: Heart },
                { id: 'financial', name: 'Financeiro', icon: DollarSign },
                { id: 'photos', name: 'Fotos', icon: Camera },
                {
                  id: 'communication',
                  name: 'Comunicação',
                  icon: MessageSquare,
                },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 border-b-2 px-1 py-2 text-sm font-medium ${
                      activeTab === tab.id
                        ? 'border-rose-500 text-rose-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Convidados</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analytics.overview.totalGuests}
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                      {getChangeIcon(12)}
                      <span className={`text-sm font-medium ${getChangeColor(12)}`}>
                        +12 esta semana
                      </span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa de Resposta</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analytics.overview.responseRate}%
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                      {getChangeIcon(5)}
                      <span className={`text-sm font-medium ${getChangeColor(5)}`}>
                        +5% este mês
                      </span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Visitas ao Site</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analytics.overview.websiteVisits}
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                      {getChangeIcon(234)}
                      <span className={`text-sm font-medium ${getChangeColor(234)}`}>
                        +234 esta semana
                      </span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                    <Eye className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Orçamento Usado</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {Math.round(
                        (analytics.overview.spentAmount / analytics.overview.totalBudget) * 100
                      )}
                      %
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                      <span className="text-sm text-gray-600">
                        {formatCurrency(analytics.overview.spentAmount)} de{' '}
                        {formatCurrency(analytics.overview.totalBudget)}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                    <DollarSign className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* RSVP Trend */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Tendência de Confirmações
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.trends.rsvpTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString('pt-MZ', {
                          month: 'short',
                          day: 'numeric',
                        })
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleDateString('pt-MZ')}
                      formatter={(value, name) => [
                        value,
                        name === 'confirmed'
                          ? 'Confirmados'
                          : name === 'pending'
                            ? 'Pendentes'
                            : 'Rejeitados',
                      ]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="confirmed"
                      stackId="1"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="pending"
                      stackId="1"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="rejected"
                      stackId="1"
                      stroke="#EF4444"
                      fill="#EF4444"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Engagement Trend */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Engagement do Site</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.trends.engagementTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString('pt-MZ', {
                          month: 'short',
                          day: 'numeric',
                        })
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleDateString('pt-MZ')}
                      formatter={(value, name) => [
                        value,
                        name === 'visits'
                          ? 'Visitas'
                          : name === 'uniqueVisitors'
                            ? 'Visitantes Únicos'
                            : 'Visualizações',
                      ]}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="visits" stroke="#3B82F6" strokeWidth={2} />
                    <Line
                      type="monotone"
                      dataKey="uniqueVisitors"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                    />
                    <Line type="monotone" dataKey="pageViews" stroke="#06B6D4" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Demographics */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* By Relationship */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Por Relacionamento</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analytics.demographics.byRelationship}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analytics.demographics.byRelationship.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* By Province */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Por Província</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analytics.demographics.byProvince} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* By Side */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Por Lado</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={analytics.demographics.bySide}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                    >
                      {analytics.demographics.bySide.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Guests Tab */}
        {activeTab === 'guests' && (
          <div className="space-y-8">
            {/* Guest Stats */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics.overview.totalGuests}
                    </p>
                    <p className="text-sm text-gray-600">Total</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics.overview.confirmedGuests}
                    </p>
                    <p className="text-sm text-gray-600">Confirmados</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics.overview.pendingGuests}
                    </p>
                    <p className="text-sm text-gray-600">Pendentes</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics.overview.rejectedGuests}
                    </p>
                    <p className="text-sm text-gray-600">Rejeitados</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">98</p>
                    <p className="text-sm text-gray-600">Com Email</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Guest Analytics */}
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Análise Demográfica</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Convidados de Maputo</span>
                    </div>
                    <span className="font-semibold">78 (52%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Com WhatsApp</span>
                    </div>
                    <span className="font-semibold">142 (95%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Restrições Alimentares</span>
                    </div>
                    <span className="font-semibold">12 (8%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Média de Acompanhantes</span>
                    </div>
                    <span className="font-semibold">1.8</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Performance RSVP</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Taxa de Resposta</span>
                    <span className="font-semibold text-green-600">70%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-green-500" style={{ width: '70%' }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tempo Médio de Resposta</span>
                    <span className="font-semibold">3.2 dias</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Lembretes Enviados</span>
                    <span className="font-semibold">67</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Eficácia dos Lembretes</span>
                    <span className="font-semibold text-blue-600">85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs would be implemented similarly */}
        {activeTab === 'engagement' && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-lg">
            <Heart className="mx-auto mb-4 h-16 w-16 text-rose-600" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Analytics de Engagement</h3>
            <p className="text-gray-600">Métricas detalhadas de engagement em desenvolvimento...</p>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="space-y-8">
            {/* Budget Overview */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Orçamento Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(analytics.overview.totalBudget)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gasto Atual</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(analytics.overview.spentAmount)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Restante</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(
                        analytics.overview.totalBudget - analytics.overview.spentAmount
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Trend */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Evolução do Orçamento</h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={analytics.trends.budgetTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value / 1000}k MT`} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="planned"
                    stackId="1"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                    name="Planeado"
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stackId="2"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.6}
                    name="Real"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-lg">
            <Camera className="mx-auto mb-4 h-16 w-16 text-purple-600" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Analytics de Fotos</h3>
            <p className="text-gray-600">
              Métricas de galeria e engagement de fotos em desenvolvimento...
            </p>
          </div>
        )}

        {activeTab === 'communication' && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-lg">
            <MessageSquare className="mx-auto mb-4 h-16 w-16 text-blue-600" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Analytics de Comunicação</h3>
            <p className="text-gray-600">
              Métricas de emails, SMS e WhatsApp em desenvolvimento...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
