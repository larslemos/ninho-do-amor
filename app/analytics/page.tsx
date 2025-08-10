"use client"

import { useState } from "react"
import { BarChart3, AlertTriangle, FileText, TrendingUp } from 'lucide-react'
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard"
import ReportGenerator from "@/components/analytics/ReportGenerator"
import AlertsSystem from "@/components/analytics/AlertsSystem"

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    {
      id: 'dashboard',
      name: 'Dashboard Analytics',
      description: 'Métricas detalhadas e insights',
      icon: BarChart3,
      color: 'text-blue-600',
      component: AnalyticsDashboard
    },
    {
      id: 'reports',
      name: 'Gerador de Relatórios',
      description: 'Relatórios exportáveis personalizados',
      icon: FileText,
      color: 'text-green-600',
      component: ReportGenerator
    },
    {
      id: 'alerts',
      name: 'Sistema de Alertas',
      description: 'Monitorização e notificações',
      icon: AlertTriangle,
      color: 'text-orange-600',
      component: AlertsSystem
    }
  ]

  const getCurrentComponent = () => {
    const tab = tabs.find(t => t.id === activeTab)
    if (tab) {
      const Component = tab.component
      return <Component weddingId="current-wedding" />
    }
    return null
  }

  // Mock summary stats
  const summaryStats = {
    totalMetrics: 24,
    activeAlerts: 3,
    reportsGenerated: 12,
    dataPoints: 1247
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-rose-600" />
                Analytics & Relatórios
              </h1>
              <p className="text-gray-600 mt-1">Insights avançados para o seu casamento</p>
            </div>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{summaryStats.totalMetrics}</div>
                <div className="text-xs text-gray-500">Métricas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{summaryStats.activeAlerts}</div>
                <div className="text-xs text-gray-500">Alertas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{summaryStats.reportsGenerated}</div>
                <div className="text-xs text-gray-500">Relatórios</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{summaryStats.dataPoints}</div>
                <div className="text-xs text-gray-500">Dados</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center gap-4 p-6 transition-all duration-200 ${
                      isActive
                        ? 'bg-rose-600 text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-white/20' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${isActive ? 'text-white' : tab.color}`} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-lg">{tab.name}</h3>
                      <p className={`text-sm ${isActive ? 'text-rose-100' : 'text-gray-500'}`}>
                        {tab.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {getCurrentComponent()}
        </div>

        {/* Footer Info */}
        <div className="mt-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              📊 Sistema de Analytics Avançado
            </h3>
            <p className="text-gray-700 mb-4">
              Monitorize todos os aspectos do seu casamento com métricas em tempo real, 
              relatórios detalhados e alertas inteligentes.
            </p>
            <div className="flex justify-center gap-4">
              <div className="bg-white rounded-lg px-4 py-2">
                <span className="text-sm font-medium text-gray-600">Última actualização:</span>
                <span className="text-sm font-bold text-gray-900 ml-2">
                  {new Date().toLocaleString('pt-MZ')}
                </span>
              </div>
              <div className="bg-white rounded-lg px-4 py-2">
                <span className="text-sm font-medium text-gray-600">Status:</span>
                <span className="text-sm font-bold text-green-600 ml-2">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
