"use client"

import { useState } from "react"
import { Palette, Type, Image, Download, Eye, Save } from 'lucide-react'
import type { WeddingDesign, DesignStyle, BackgroundOption, FontSelection, ColorScheme } from "@/types/mozambique-wedding"

const designStyles: { value: DesignStyle; name: string; description: string; preview: string }[] = [
  {
    value: 'tradicional-mocambicano',
    name: 'Tradicional Moçambicano',
    description: 'Padrões de capulana e elementos culturais',
    preview: 'bg-gradient-to-br from-red-500 via-yellow-500 to-green-500'
  },
  {
    value: 'moderno-minimalista',
    name: 'Moderno Minimalista',
    description: 'Design limpo e contemporâneo',
    preview: 'bg-gradient-to-br from-gray-100 to-white'
  },
  {
    value: 'romantico-classico',
    name: 'Romântico Clássico',
    description: 'Elegante com elementos florais',
    preview: 'bg-gradient-to-br from-pink-200 to-rose-300'
  },
  {
    value: 'cultural-regional',
    name: 'Cultural Regional',
    description: 'Adaptado à província de origem',
    preview: 'bg-gradient-to-br from-orange-400 to-amber-500'
  }
]

const backgroundPatterns = [
  { name: 'Capulana Tradicional', value: 'capulana-pattern', preview: 'bg-red-500' },
  { name: 'Flores Tropicais', value: 'tropical-flowers', preview: 'bg-pink-400' },
  { name: 'Padrão Geométrico', value: 'geometric-pattern', preview: 'bg-blue-500' },
  { name: 'Textura Madeira', value: 'wood-texture', preview: 'bg-amber-600' },
  { name: 'Ondas do Oceano', value: 'ocean-waves', preview: 'bg-cyan-500' }
]

const fontOptions = [
  { name: 'Elegante Script', value: 'elegant-script', preview: 'font-serif italic' },
  { name: 'Moderna Sans', value: 'modern-sans', preview: 'font-sans' },
  { name: 'Clássica Serif', value: 'classic-serif', preview: 'font-serif' },
  { name: 'Tradicional Africana', value: 'african-traditional', preview: 'font-bold' }
]

const colorSchemes = [
  { name: 'Vermelho & Dourado', colors: { primary: '#DC2626', secondary: '#F59E0B', accent: '#FEF3C7', background: '#FFF7ED', text: '#1F2937' } },
  { name: 'Rosa & Coral', colors: { primary: '#EC4899', secondary: '#F97316', accent: '#FED7E2', background: '#FFF5F5', text: '#1F2937' } },
  { name: 'Azul & Prata', colors: { primary: '#2563EB', secondary: '#6B7280', accent: '#E0E7FF', background: '#F8FAFC', text: '#1F2937' } },
  { name: 'Verde & Terra', colors: { primary: '#059669', secondary: '#92400E', accent: '#D1FAE5', background: '#F0FDF4', text: '#1F2937' } },
  { name: 'Roxo & Ouro', colors: { primary: '#7C3AED', secondary: '#D97706', accent: '#EDE9FE', background: '#FAF5FF', text: '#1F2937' } }
]

export default function InvitationDesigner() {
  const [design, setDesign] = useState<WeddingDesign>({
    id: 'design-1',
    style: 'tradicional-mocambicano',
    background: { type: 'pattern', value: 'capulana-pattern' },
    fonts: { primary: 'elegant-script', secondary: 'modern-sans', accent: 'classic-serif' },
    colors: colorSchemes[0].colors,
    customText: `Com grande alegria, [Nome dos Pais da Noiva] e [Nome dos Pais do Noivo]
têm a honra de convidar V.Exa. para o casamento de

[NOME DA NOIVA]
&
[NOME DO NOIVO]

Cerimónia Religiosa: [Data] às [Hora]
Local: [Google Maps URL]

Festa: [Data] às [Hora]
Local: [Google Maps URL]

"O amor é paciente, o amor é bondoso" - 1 Coríntios 13:4

Confirme a sua presença até [Data Limite]
WhatsApp: [Número] | Link: [URL RSVP]`,
    weddingId: 'current-wedding'
  })

  const [activeTab, setActiveTab] = useState<'style' | 'background' | 'fonts' | 'colors' | 'text'>('style')

  const updateDesign = (field: keyof WeddingDesign, value: any) => {
    setDesign(prev => ({ ...prev, [field]: value }))
  }

  const updateColors = (colors: ColorScheme) => {
    setDesign(prev => ({ ...prev, colors }))
  }

  const updateFonts = (fontType: keyof FontSelection, fontValue: string) => {
    setDesign(prev => ({
      ...prev,
      fonts: { ...prev.fonts, [fontType]: fontValue }
    }))
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Designer de Convites</h1>
        <p className="text-gray-600">Crie convites personalizados com elementos moçambicanos</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Design Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-900">Personalização</h2>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {[
                  { key: 'style', label: 'Estilo', icon: Palette },
                  { key: 'background', label: 'Fundo', icon: Image },
                  { key: 'fonts', label: 'Fontes', icon: Type },
                  { key: 'colors', label: 'Cores', icon: Palette },
                  { key: 'text', label: 'Texto', icon: Type }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === key 
                        ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Style Selection */}
          {activeTab === 'style' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">Escolher Estilo</h3>
              </div>
              <div className="p-4 space-y-4">
                {designStyles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => updateDesign('style', style.value)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      design.style === style.value 
                        ? 'border-rose-500 bg-rose-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-16 ${style.preview} rounded-lg mb-3`}></div>
                    <h4 className="font-semibold text-gray-900 mb-1">{style.name}</h4>
                    <p className="text-sm text-gray-600">{style.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Background Selection */}
          {activeTab === 'background' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">Fundo do Convite</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tipo de Fundo
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['pattern', 'solid', 'gradient', 'image'].map((type) => (
                      <button
                        key={type}
                        onClick={() => updateDesign('background', { ...design.background, type })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          design.background.type === type 
                            ? 'bg-rose-100 text-rose-700' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {type === 'pattern' ? 'Padrão' : 
                         type === 'solid' ? 'Cor Sólida' :
                         type === 'gradient' ? 'Gradiente' : 'Imagem'}
                      </button>
                    ))}
                  </div>
                </div>

                {design.background.type === 'pattern' && (
                  <div className="space-y-3">
                    {backgroundPatterns.map((pattern) => (
                      <button
                        key={pattern.value}
                        onClick={() => updateDesign('background', { type: 'pattern', value: pattern.value })}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                          design.background.value === pattern.value 
                            ? 'border-rose-500 bg-rose-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-8 h-8 ${pattern.preview} rounded`}></div>
                        <span className="text-sm font-medium">{pattern.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Font Selection */}
          {activeTab === 'fonts' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">Fontes Tipográficas</h3>
              </div>
              <div className="p-4 space-y-6">
                {[
                  { key: 'primary', label: 'Fonte Principal (Nomes)' },
                  { key: 'secondary', label: 'Fonte Secundária (Detalhes)' },
                  { key: 'accent', label: 'Fonte de Destaque (Citações)' }
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {label}
                    </label>
                    <div className="space-y-2">
                      {fontOptions.map((font) => (
                        <button
                          key={font.value}
                          onClick={() => updateFonts(key as keyof FontSelection, font.value)}
                          className={`w-full p-3 rounded-lg border text-left transition-colors ${
                            design.fonts[key as keyof FontSelection] === font.value 
                              ? 'border-rose-500 bg-rose-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`text-lg ${font.preview} mb-1`}>
                            Assa & Eleutério
                          </div>
                          <div className="text-sm text-gray-600">{font.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {activeTab === 'colors' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">Esquema de Cores</h3>
              </div>
              <div className="p-4 space-y-4">
                {colorSchemes.map((scheme) => (
                  <button
                    key={scheme.name}
                    onClick={() => updateColors(scheme.colors)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      JSON.stringify(design.colors) === JSON.stringify(scheme.colors)
                        ? 'border-rose-500 bg-rose-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex gap-1">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: scheme.colors.primary }}
                        ></div>
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: scheme.colors.secondary }}
                        ></div>
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: scheme.colors.accent }}
                        ></div>
                      </div>
                      <span className="font-medium text-gray-900">{scheme.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Text Editor */}
          {activeTab === 'text' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">Texto do Convite</h3>
              </div>
              <div className="p-4">
                <textarea
                  value={design.customText}
                  onChange={(e) => updateDesign('customText', e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
                  placeholder="Digite o texto do convite..."
                />
                <div className="mt-3 text-xs text-gray-500">
                  <p className="mb-2"><strong>Variáveis disponíveis:</strong></p>
                  <div className="grid grid-cols-2 gap-1">
                    <span>[Nome da Noiva]</span>
                    <span>[Nome do Noivo]</span>
                    <span>[Data]</span>
                    <span>[Hora]</span>
                    <span>[Local]</span>
                    <span>[Número WhatsApp]</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 sticky top-6">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Pré-visualização</h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                  Visualizar
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors">
                  <Save className="w-4 h-4" />
                  Salvar
                </button>
              </div>
            </div>
            
            <div className="p-8">
              {/* Invitation Preview */}
              <div 
                className="max-w-md mx-auto aspect-[3/4] rounded-2xl shadow-2xl overflow-hidden"
                style={{ 
                  backgroundColor: design.colors.background,
                  color: design.colors.text
                }}
              >
                <div className="h-full p-8 flex flex-col justify-center text-center relative">
                  {/* Decorative elements based on style */}
                  {design.style === 'tradicional-mocambicano' && (
                    <div className="absolute inset-0 opacity-10">
                      <div className="w-full h-full bg-gradient-to-br from-red-500 via-yellow-500 to-green-500"></div>
                    </div>
                  )}
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="mb-6">
                      <div 
                        className="text-4xl mb-2"
                        style={{ color: design.colors.primary }}
                      >
                        💍
                      </div>
                      <h1 
                        className="text-lg font-bold mb-2"
                        style={{ color: design.colors.primary }}
                      >
                        Convite de Casamento
                      </h1>
                    </div>

                    {/* Names */}
                    <div className="mb-6">
                      <div 
                        className="text-2xl font-bold mb-2"
                        style={{ color: design.colors.primary }}
                      >
                        Assa
                      </div>
                      <div 
                        className="text-xl mb-2"
                        style={{ color: design.colors.secondary }}
                      >
                        &
                      </div>
                      <div 
                        className="text-2xl font-bold"
                        style={{ color: design.colors.primary }}
                      >
                        Eleutério
                      </div>
                    </div>

                    {/* Details */}
                    <div className="text-sm space-y-2 mb-6">
                      <div>
                        <strong>📅 Data:</strong> 30 de Agosto, 2025
                      </div>
                      <div>
                        <strong>🕐 Horário:</strong> 13:00
                      </div>
                      <div>
                        <strong>📍 Local:</strong> Hotel Polana
                      </div>
                    </div>

                    {/* Quote */}
                    <div 
                      className="text-sm italic mb-6 px-4"
                      style={{ color: design.colors.secondary }}
                    >
                      "O amor é paciente, o amor é bondoso"
                    </div>

                    {/* RSVP */}
                    <div className="text-xs">
                      <div className="mb-2">
                        <strong>Confirme até 25/08/2025</strong>
                      </div>
                      <div>
                        📞 824790050 | 879659501
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
