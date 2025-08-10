"use client"

import { useState } from "react"
import { Download, FileText, Calendar, Users, DollarSign, Camera, Mail, Settings, CheckCircle, Clock, Filter } from 'lucide-react'

interface ReportGeneratorProps {
  weddingId: string
}

export default function ReportGenerator({ weddingId }: ReportGeneratorProps) {
  const [selectedReports, setSelectedReports] = useState<string[]>([])
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [format, setFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf')
  const [generating, setGenerating] = useState(false)

  const reportTypes = [
    {
      id: 'guest-list',
      name: 'Lista Completa de Convidados',
      description: 'Lista detalhada com todos os convidados, contactos e status',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      estimatedSize: '2.3 MB'
    },
    {
      id: 'rsvp-summary',
      name: 'Resumo de Confirmações',
      description: 'Análise detalhada das confirmações e estatísticas RSVP',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      estimatedSize: '1.8 MB'
    },
    {
      id: 'financial-summary',
      name: 'Relatório Financeiro',
      description: 'Resumo completo de orçamento, gastos e projeções',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      estimatedSize: '3.1 MB'
    },
    {
      id: 'vendor-contacts',
      name: 'Contactos de Fornecedores',
      description: 'Lista organizada de todos os fornecedores e contactos',
      icon: Settings,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      estimatedSize: '0.8 MB'
    },
    {
      id: 'table-assignments',
      name: 'Organização de Mesas',
      description: 'Layout visual das mesas com lista de convidados',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      estimatedSize: '4.2 MB'
    },
    {
      id: 'timeline-schedule',
      name: 'Cronograma Detalhado',
      description: 'Timeline completa de todos os eventos e actividades',
      icon: Calendar,
      color: 'text-rose-600',
      bgColor: 'bg-rose-100',
      estimatedSize: '1.5 MB'
    },
    {
      id: 'photo-gallery',
      name: 'Galeria de Fotos',
      description: 'Compilação de todas as fotos organizadas por evento',
      icon: Camera,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      estimatedSize: '45.7 MB'
    },
    {
      id: 'engagement-report',
      name: 'Relatório de Engagement',
      description: 'Métricas de website, emails e interacções',
      icon: Mail,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      estimatedSize: '2.9 MB'
    },
    {
      id: 'final-summary',
      name: 'Resumo Final Completo',
      description: 'Relatório executivo com todos os aspectos do casamento',
      icon: FileText,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      estimatedSize: '12.4 MB'
    }
  ]

  const handleReportToggle = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    )
  }

  const handleSelectAll = () => {
    if (selectedReports.length === reportTypes.length) {
      setSelectedReports([])
    } else {
      setSelectedReports(reportTypes.map(r => r.id))
    }
  }

  const handleGenerateReports = async () => {
    if (selectedReports.length === 0) return

    setGenerating(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // In real app, this would call the API to generate reports
      console.log('Generating reports:', {
        reports: selectedReports,
        dateRange,
        format,
        weddingId
      })
      
      // Simulate download
      alert(`${selectedReports.length} relatório(s) gerado(s) com sucesso!`)
      
    } catch (error) {
      console.error('Error generating reports:', error)
      alert('Erro ao gerar relatórios. Tente novamente.')
    } finally {
      setGenerating(false)
    }
  }

  const getTotalSize = () => {
    return selectedReports.reduce((total, reportId) => {
      const report = reportTypes.find(r => r.id === reportId)
      if (report) {
        const size = parseFloat(report.estimatedSize.replace(/[^\d.]/g, ''))
        return total + size
      }
      return total
    }, 0).toFixed(1)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerador de Relatórios</h1>
        <p className="text-gray-600">Seleccione os relatórios que deseja gerar e exportar</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtros e Configurações
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data de Início</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data de Fim</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Formato</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel (.xlsx)</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Selection */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Seleccionar Relatórios</h2>
          <button
            onClick={handleSelectAll}
            className="text-rose-600 hover:text-rose-700 font-medium text-sm"
          >
            {selectedReports.length === reportTypes.length ? 'Desmarcar Todos' : 'Seleccionar Todos'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon
            const isSelected = selectedReports.includes(report.id)
            
            return (
              <div
                key={report.id}
                onClick={() => handleReportToggle(report.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-rose-500 bg-rose-50' 
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 ${report.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${report.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 text-sm">{report.name}</h3>
                      {isSelected && <CheckCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{report.description}</p>
                    <p className="text-xs text-gray-500 mt-2">Tamanho: {report.estimatedSize}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Generation Summary */}
      {selectedReports.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo da Geração</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-rose-600">{selectedReports.length}</div>
              <div className="text-sm text-gray-600">Relatórios Seleccionados</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{getTotalSize()} MB</div>
              <div className="text-sm text-gray-600">Tamanho Total Estimado</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">~3-5 min</div>
              <div className="text-sm text-gray-600">Tempo Estimado</div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          onClick={handleGenerateReports}
          disabled={selectedReports.length === 0 || generating}
          className={`flex items-center gap-3 px-8 py-4 rounded-lg font-medium text-lg transition-all ${
            selectedReports.length === 0 || generating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {generating ? (
            <>
              <Clock className="w-6 h-6 animate-spin" />
              Gerando Relatórios...
            </>
          ) : (
            <>
              <Download className="w-6 h-6" />
              Gerar {selectedReports.length} Relatório{selectedReports.length !== 1 ? 's' : ''}
            </>
          )}
        </button>
      </div>

      {/* Recent Reports */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Relatórios Recentes</h2>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6">
            <div className="space-y-4">
              {[
                {
                  name: 'Resumo Final Completo',
                  generatedAt: '2025-01-21T14:30:00Z',
                  size: '12.4 MB',
                  format: 'PDF',
                  downloads: 3
                },
                {
                  name: 'Lista de Convidados',
                  generatedAt: '2025-01-20T09:15:00Z',
                  size: '2.3 MB',
                  format: 'Excel',
                  downloads: 7
                },
                {
                  name: 'Relatório Financeiro',
                  generatedAt: '2025-01-19T16:45:00Z',
                  size: '3.1 MB',
                  format: 'PDF',
                  downloads: 2
                }
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{report.name}</h3>
                      <p className="text-sm text-gray-600">
                        Gerado em {new Date(report.generatedAt).toLocaleDateString('pt-MZ')} • 
                        {report.size} • {report.format} • {report.downloads} downloads
                      </p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-rose-600 hover:text-rose-700 font-medium text-sm">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
