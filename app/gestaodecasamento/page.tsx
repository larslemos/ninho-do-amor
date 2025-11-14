'use client';

import { useState } from 'react';
import { Wine, Camera, BarChart3, Users, Calendar, Settings, Bell, Download } from 'lucide-react';
import BeverageManagement from '@/components/catering/BeverageManagement';
import PhotoGallerySystem from '@/components/gallery/PhotoGallerySystem';
import WeddingDashboard from '@/components/dashboard/WeddingDashboard';

export default function WeddingManagementPage() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const sections = [
    {
      id: 'dashboard',
      name: 'Painel de Controlo',
      description: 'Visão geral completa do casamento',
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      component: WeddingDashboard,
    },
    {
      id: 'beverages',
      name: 'Gestão de Bebidas',
      description: 'Planeamento e cálculo de bebidas',
      icon: Wine,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      component: BeverageManagement,
    },
    {
      id: 'photos',
      name: 'Sistema de Fotos',
      description: 'Galeria colaborativa por QR Code',
      icon: Camera,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      component: PhotoGallerySystem,
    },
  ];

  const getCurrentComponent = () => {
    const section = sections.find((s) => s.id === activeSection);
    if (section) {
      const Component = section.component;
      return <Component weddingId="current-wedding" />;
    }
    return null;
  };

  const stats = {
    totalGuests: 150,
    confirmedGuests: 89,
    totalPhotos: 234,
    totalBudget: 125000,
    daysUntilWedding: 45,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Casamento</h1>
              <p className="mt-1 text-gray-600">Assa & Eleutério - 30 de Agosto, 2025</p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.confirmedGuests}</div>
                <div className="text-xs text-gray-500">Confirmados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.totalPhotos}</div>
                <div className="text-xs text-gray-500">Fotos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-rose-600">{stats.daysUntilWedding}</div>
                <div className="text-xs text-gray-500">Dias</div>
              </div>

              <div className="flex gap-2">
                <button className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800">
                  <Bell className="h-5 w-5" />
                </button>
                <button className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800">
                  <Download className="h-5 w-5" />
                </button>
                <button className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800">
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
            <div className="grid grid-cols-3 gap-2">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-3 rounded-lg p-4 transition-all duration-200 ${
                      isActive
                        ? 'bg-rose-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        isActive ? 'bg-white/20' : section.bgColor
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? 'text-white' : section.color}`} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">{section.name}</h3>
                      <p className={`text-sm ${isActive ? 'text-rose-100' : 'text-gray-500'}`}>
                        {section.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section Content */}
        <div className="transition-all duration-300">{getCurrentComponent()}</div>

        {/* Quick Actions Footer */}
        <div className="mt-12 rounded-xl bg-gradient-to-r from-rose-100 to-pink-100 p-6">
          <h3 className="mb-4 text-lg font-bold text-gray-900">Acções Rápidas</h3>
          <div className="grid gap-4 md:grid-cols-4">
            <button className="flex items-center gap-3 rounded-lg bg-white p-4 transition-shadow hover:shadow-md">
              <Users className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Adicionar Convidados</div>
                <div className="text-sm text-gray-500">Importar lista</div>
              </div>
            </button>

            <button className="flex items-center gap-3 rounded-lg bg-white p-4 transition-shadow hover:shadow-md">
              <Calendar className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Agendar Evento</div>
                <div className="text-sm text-gray-500">Nova data</div>
              </div>
            </button>

            <button className="flex items-center gap-3 rounded-lg bg-white p-4 transition-shadow hover:shadow-md">
              <Download className="h-5 w-5 text-purple-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Exportar Dados</div>
                <div className="text-sm text-gray-500">Relatório completo</div>
              </div>
            </button>

            <button className="flex items-center gap-3 rounded-lg bg-white p-4 transition-shadow hover:shadow-md">
              <Settings className="h-5 w-5 text-orange-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Configurações</div>
                <div className="text-sm text-gray-500">Personalizar</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
