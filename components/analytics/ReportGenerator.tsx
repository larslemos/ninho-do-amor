'use client';

import { useState } from 'react';
import {
  Download,
  FileText,
  Calendar,
  Users,
  DollarSign,
  Camera,
  Mail,
  Settings,
  CheckCircle,
  Clock,
  Filter,
} from 'lucide-react';

interface ReportGeneratorProps {
  weddingId: string;
}

export default function ReportGenerator({ weddingId }: ReportGeneratorProps) {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [format, setFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [generating, setGenerating] = useState(false);

  const reportTypes = [
    {
      id: 'guest-list',
      name: 'Lista Completa de Convidados',
      description:
        'Lista detalhada com todos os convidados, contactos e status',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      estimatedSize: '2.3 MB',
    },
    {
      id: 'rsvp-summary',
      name: 'Resumo de Confirmações',
      description: 'Análise detalhada das confirmações e estatísticas RSVP',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      estimatedSize: '1.8 MB',
    },
    {
      id: 'financial-summary',
      name: 'Relatório Financeiro',
      description: 'Resumo completo de orçamento, gastos e projeções',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      estimatedSize: '3.1 MB',
    },
    {
      id: 'vendor-contacts',
      name: 'Contactos de Fornecedores',
      description: 'Lista organizada de todos os fornecedores e contactos',
      icon: Settings,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      estimatedSize: '0.8 MB',
    },
    {
      id: 'table-assignments',
      name: 'Organização de Mesas',
      description: 'Layout visual das mesas com lista de convidados',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      estimatedSize: '4.2 MB',
    },
    {
      id: 'timeline-schedule',
      name: 'Cronograma Detalhado',
      description: 'Timeline completa de todos os eventos e actividades',
      icon: Calendar,
      color: 'text-rose-600',
      bgColor: 'bg-rose-100',
      estimatedSize: '1.5 MB',
    },
    {
      id: 'photo-gallery',
      name: 'Galeria de Fotos',
      description: 'Compilação de todas as fotos organizadas por evento',
      icon: Camera,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      estimatedSize: '45.7 MB',
    },
    {
      id: 'engagement-report',
      name: 'Relatório de Engagement',
      description: 'Métricas de website, emails e interacções',
      icon: Mail,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      estimatedSize: '2.9 MB',
    },
    {
      id: 'final-summary',
      name: 'Resumo Final Completo',
      description: 'Relatório executivo com todos os aspectos do casamento',
      icon: FileText,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      estimatedSize: '12.4 MB',
    },
  ];

  const handleReportToggle = (reportId: string) => {
    setSelectedReports((prev) =>
      prev.includes(reportId)
        ? prev.filter((id) => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleSelectAll = () => {
    if (selectedReports.length === reportTypes.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(reportTypes.map((r) => r.id));
    }
  };

  const handleGenerateReports = async () => {
    if (selectedReports.length === 0) return;

    setGenerating(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // In real app, this would call the API to generate reports
      console.log('Generating reports:', {
        reports: selectedReports,
        dateRange,
        format,
        weddingId,
      });

      // Simulate download
      alert(`${selectedReports.length} relatório(s) gerado(s) com sucesso!`);
    } catch (error) {
      console.error('Error generating reports:', error);
      alert('Erro ao gerar relatórios. Tente novamente.');
    } finally {
      setGenerating(false);
    }
  };

  const getTotalSize = () => {
    return selectedReports
      .reduce((total, reportId) => {
        const report = reportTypes.find((r) => r.id === reportId);
        if (report) {
          const size = parseFloat(report.estimatedSize.replace(/[^\d.]/g, ''));
          return total + size;
        }
        return total;
      }, 0)
      .toFixed(1);
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Gerador de Relatórios
        </h1>
        <p className="text-gray-600">
          Seleccione os relatórios que deseja gerar e exportar
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Filter className="h-5 w-5" />
          Filtros e Configurações
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Data de Início
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, start: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Data de Fim
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, end: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Formato
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel (.xlsx)</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Selection */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Seleccionar Relatórios
          </h2>
          <button
            onClick={handleSelectAll}
            className="text-sm font-medium text-rose-600 hover:text-rose-700"
          >
            {selectedReports.length === reportTypes.length
              ? 'Desmarcar Todos'
              : 'Seleccionar Todos'}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            const isSelected = selectedReports.includes(report.id);

            return (
              <div
                key={report.id}
                onClick={() => handleReportToggle(report.id)}
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`h-10 w-10 ${report.bgColor} flex flex-shrink-0 items-center justify-center rounded-lg`}
                  >
                    <Icon className={`h-5 w-5 ${report.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-gray-900">
                        {report.name}
                      </h3>
                      {isSelected && (
                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-rose-600" />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                      {report.description}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                      Tamanho: {report.estimatedSize}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Generation Summary */}
      {selectedReports.length > 0 && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Resumo da Geração
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-rose-600">
                {selectedReports.length}
              </div>
              <div className="text-sm text-gray-600">
                Relatórios Seleccionados
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {getTotalSize()} MB
              </div>
              <div className="text-sm text-gray-600">
                Tamanho Total Estimado
              </div>
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
          className={`flex items-center gap-3 rounded-lg px-8 py-4 text-lg font-medium transition-all ${
            selectedReports.length === 0 || generating
              ? 'cursor-not-allowed bg-gray-300 text-gray-500'
              : 'bg-rose-600 text-white shadow-lg hover:bg-rose-700 hover:shadow-xl'
          }`}
        >
          {generating ? (
            <>
              <Clock className="h-6 w-6 animate-spin" />
              Gerando Relatórios...
            </>
          ) : (
            <>
              <Download className="h-6 w-6" />
              Gerar {selectedReports.length} Relatório
              {selectedReports.length !== 1 ? 's' : ''}
            </>
          )}
        </button>
      </div>

      {/* Recent Reports */}
      <div className="mt-12">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">
          Relatórios Recentes
        </h2>

        <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="p-6">
            <div className="space-y-4">
              {[
                {
                  name: 'Resumo Final Completo',
                  generatedAt: '2025-01-21T14:30:00Z',
                  size: '12.4 MB',
                  format: 'PDF',
                  downloads: 3,
                },
                {
                  name: 'Lista de Convidados',
                  generatedAt: '2025-01-20T09:15:00Z',
                  size: '2.3 MB',
                  format: 'Excel',
                  downloads: 7,
                },
                {
                  name: 'Relatório Financeiro',
                  generatedAt: '2025-01-19T16:45:00Z',
                  size: '3.1 MB',
                  format: 'PDF',
                  downloads: 2,
                },
              ].map((report, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {report.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Gerado em{' '}
                        {new Date(report.generatedAt).toLocaleDateString(
                          'pt-MZ'
                        )}{' '}
                        •{report.size} • {report.format} • {report.downloads}{' '}
                        downloads
                      </p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
