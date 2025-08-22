// app/admin/page.tsx

'use client';

import PlatformHeader from '@/components/PlatformHeader';
import GuestManagement from '@/components/admin/GuestManagement';
import { useState } from 'react';
import { Users, BarChart3, Settings, Gift } from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<
    'guests' | 'analytics' | 'settings' | 'gifts'
  >('guests');

  const tabs = [
    { id: 'guests', label: 'Gestão de Convidados', icon: Users },
    { id: 'analytics', label: 'Relatórios', icon: BarChart3 },
    { id: 'gifts', label: 'Lista de Presentes', icon: Gift },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PlatformHeader />

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Painel Administrativo
          </h1>
          <p className="text-gray-600">
            Gerencie todos os aspectos do seu casamento em um só lugar
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white shadow-sm">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 border-b-2 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-rose-600 bg-rose-50 text-rose-600'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <tab.icon className="mr-2 inline h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          {activeTab === 'guests' && <GuestManagement />}
          {activeTab === 'analytics' && (
            <div className="p-8 text-center">
              <BarChart3 className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Relatórios e Analytics
              </h3>
              <p className="text-gray-600">Funcionalidade em desenvolvimento</p>
            </div>
          )}
          {activeTab === 'gifts' && (
            <div className="p-8 text-center">
              <Gift className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Gestão de Lista de Presentes
              </h3>
              <p className="text-gray-600">Funcionalidade em desenvolvimento</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="p-8 text-center">
              <Settings className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Configurações do Evento
              </h3>
              <p className="text-gray-600">Funcionalidade em desenvolvimento</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
