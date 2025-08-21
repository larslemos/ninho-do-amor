// app/admin/page.tsx

"use client"

import PlatformHeader from "@/components/PlatformHeader"
import GuestManagement from "@/components/admin/GuestManagement"
import { useState } from "react"
import { Users, BarChart3, Settings, Gift } from "lucide-react"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"guests" | "analytics" | "settings" | "gifts">("guests")

  const tabs = [
    { id: "guests", label: "Gestão de Convidados", icon: Users },
    { id: "analytics", label: "Relatórios", icon: BarChart3 },
    { id: "gifts", label: "Lista de Presentes", icon: Gift },
    { id: "settings", label: "Configurações", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <PlatformHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
          <p className="text-gray-600">Gerencie todos os aspectos do seu casamento em um só lugar</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors border-b-2 ${activeTab === tab.id
                    ? "text-rose-600 border-rose-600 bg-rose-50"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <tab.icon className="w-5 h-5 inline mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {activeTab === "guests" && <GuestManagement />}
          {activeTab === "analytics" && (
            <div className="p-8 text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Relatórios e Analytics</h3>
              <p className="text-gray-600">Funcionalidade em desenvolvimento</p>
            </div>
          )}
          {activeTab === "gifts" && (
            <div className="p-8 text-center">
              <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestão de Lista de Presentes</h3>
              <p className="text-gray-600">Funcionalidade em desenvolvimento</p>
            </div>
          )}
          {activeTab === "settings" && (
            <div className="p-8 text-center">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Configurações do Evento</h3>
              <p className="text-gray-600">Funcionalidade em desenvolvimento</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
