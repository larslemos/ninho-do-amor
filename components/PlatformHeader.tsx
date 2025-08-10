"use client"

import { useState } from "react"
import { Menu, X, Users, MapPin, Gift, Calendar, BarChart3 } from "lucide-react"

export default function PlatformHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const features = [
    { icon: Users, title: "Gestão de Convidados", description: "RSVP e upload de listas" },
    { icon: MapPin, title: "Mesas e Lugares", description: "Layout 3D interativo" },
    { icon: Gift, title: "Lista de Presentes", description: "Lojas e transferências" },
    { icon: Calendar, title: "Cronograma", description: "Timeline do evento" },
    { icon: BarChart3, title: "Relatórios", description: "Analytics em tempo real" },
  ]

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-rose-100 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <div>
              <h1 className="font-bold text-rose-800 text-lg">PingDigital</h1>
              <p className="text-rose-500 text-xs">Wedding Management Platform</p>
            </div>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors md:hidden"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <nav className="hidden md:flex items-center gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-rose-600 hover:text-rose-800 transition-colors cursor-pointer group"
              >
                <feature.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{feature.title}</span>
              </div>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-rose-100">
            <nav className="space-y-3 mt-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 hover:bg-rose-50 rounded-lg transition-colors">
                  <feature.icon className="w-5 h-5 text-rose-600" />
                  <div>
                    <h3 className="font-medium text-rose-800 text-sm">{feature.title}</h3>
                    <p className="text-rose-500 text-xs">{feature.description}</p>
                  </div>
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
