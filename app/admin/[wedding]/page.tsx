// app/admin/[weeding]/page.tsx

'use client';

import PlatformHeader from '@/components/PlatformHeader';

import InviteManagement from '@/components/admin/InviteManagement';
import { useState, useEffect } from 'react';
import { Users, BarChart3, Settings, Gift, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import GuestManagement from '@/components/admin/GuestManagement';

interface Wedding {
  id: string;
  slug: string;
  displayName: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<
    'guests' | 'invitations' | 'analytics' | 'settings' | 'gifts'
  >('guests');
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [selectedWeddingSlug, setSelectedWeddingSlug] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchWeddings = async () => {
      const { data, error } = await supabase
        .from('weddings')
        .select('id, slug, bride_name, groom_name')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching weddings:', error);
      } else {
        const transformedWeddings = (data || []).map((wedding) => ({
          id: wedding.id,
          slug: wedding.slug,
          displayName: `${wedding.bride_name} & ${wedding.groom_name}`,
        }));
        setWeddings(transformedWeddings);
        if (transformedWeddings.length > 0) {
          setSelectedWeddingSlug(transformedWeddings[0].slug);
        }
      }
    };
    fetchWeddings();
  }, []);

  const tabs = [
    { id: 'guests', label: 'Gestão de Convidados', icon: Users },
    { id: 'invitations', label: 'Gestão de Convites', icon: Send },
    { id: 'analytics', label: 'Relatórios', icon: BarChart3 },
    { id: 'gifts', label: 'Lista de Presentes', icon: Gift },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="font-montserrat bg-gray-50">
      <PlatformHeader />

      <div className="mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Painel Administrativo
          </h1>
          <p className="text-gray-600">
            Gerencie todos os aspectos do seu casamento em um só lugar
          </p>
        </div>

        {/* Wedding Selector */}
        <div className="mb-8">
          <label
            htmlFor="wedding-select"
            className="block text-sm font-medium text-gray-700"
          >
            Selecionar Casamento
          </label>
          <select
            id="wedding-select"
            value={selectedWeddingSlug || ''}
            onChange={(e) => setSelectedWeddingSlug(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-rose-500 focus:outline-none focus:ring-rose-500 sm:text-sm"
          >
            <option value="" disabled>
              Selecione um casamento
            </option>
            {weddings.map((wedding) => (
              <option key={wedding.id} value={wedding.slug}>
                {wedding.displayName}
              </option>
            ))}
          </select>
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
          {activeTab === 'guests' && selectedWeddingSlug && (
            <GuestManagement
              weddingSlug={selectedWeddingSlug}
              weddingData={
                weddings.find((w) => w.slug === selectedWeddingSlug) as any
              }
            />
          )}
          {activeTab === 'invitations' && selectedWeddingSlug && (
            <InviteManagement weddingSlug={selectedWeddingSlug} />
          )}
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
