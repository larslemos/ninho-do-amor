// app/components/InvitationDesigner.tsx
'use client';

import { useState } from 'react';
import { Palette, Type, Image, Download, Eye, Save } from 'lucide-react';
import type {
  WeddingDesign,
  DesignStyle,
  BackgroundOption,
  FontSelection,
  ColorScheme,
} from '@/types/mozambique-wedding';

const designStyles: {
  value: DesignStyle;
  name: string;
  description: string;
  preview: string;
}[] = [
    {
      value: 'tradicional-mocambicano',
      name: 'Tradicional Moçambicano',
      description: 'Padrões de capulana e elementos culturais',
      preview: 'bg-gradient-to-br from-red-500 via-yellow-500 to-green-500',
    },
    {
      value: 'moderno-minimalista',
      name: 'Moderno Minimalista',
      description: 'Design limpo e contemporâneo',
      preview: 'bg-gradient-to-br from-gray-100 to-white',
    },
    {
      value: 'romantico-classico',
      name: 'Romântico Clássico',
      description: 'Elegante com elementos florais',
      preview: 'bg-gradient-to-br from-pink-200 to-rose-300',
    },
    {
      value: 'cultural-regional',
      name: 'Cultural Regional',
      description: 'Adaptado à província de origem',
      preview: 'bg-gradient-to-br from-orange-400 to-amber-500',
    },
  ];

const backgroundPatterns = [
  {
    name: 'Capulana Tradicional',
    value: 'capulana-pattern',
    preview: 'bg-red-500',
  },
  {
    name: 'Flores Tropicais',
    value: 'tropical-flowers',
    preview: 'bg-pink-400',
  },
  {
    name: 'Padrão Geométrico',
    value: 'geometric-pattern',
    preview: 'bg-blue-500',
  },
  { name: 'Textura Madeira', value: 'wood-texture', preview: 'bg-amber-600' },
  { name: 'Ondas do Oceano', value: 'ocean-waves', preview: 'bg-cyan-500' },
];

const fontOptions = [
  {
    name: 'Elegante Script',
    value: 'elegant-script',
    preview: 'font-serif italic',
  },
  { name: 'Moderna Sans', value: 'modern-sans', preview: 'font-sans' },
  { name: 'Clássica Serif', value: 'classic-serif', preview: 'font-serif' },
  {
    name: 'Tradicional Africana',
    value: 'african-traditional',
    preview: 'font-bold',
  },
];

const colorSchemes = [
  {
    name: 'Vermelho & Dourado',
    colors: {
      primary: '#DC2626',
      secondary: '#F59E0B',
      accent: '#FEF3C7',
      background: '#FFF7ED',
      text: '#1F2937',
    },
  },
  {
    name: 'Rosa & Coral',
    colors: {
      primary: '#EC4899',
      secondary: '#F97316',
      accent: '#FED7E2',
      background: '#FFF5F5',
      text: '#1F2937',
    },
  },
  {
    name: 'Azul & Prata',
    colors: {
      primary: '#2563EB',
      secondary: '#6B7280',
      accent: '#E0E7FF',
      background: '#F8FAFC',
      text: '#1F2937',
    },
  },
  {
    name: 'Verde & Terra',
    colors: {
      primary: '#059669',
      secondary: '#92400E',
      accent: '#D1FAE5',
      background: '#F0FDF4',
      text: '#1F2937',
    },
  },
  {
    name: 'Roxo & Ouro',
    colors: {
      primary: '#7C3AED',
      secondary: '#D97706',
      accent: '#EDE9FE',
      background: '#FAF5FF',
      text: '#1F2937',
    },
  },
];

export default function InvitationDesigner() {
  const [design, setDesign] = useState<WeddingDesign>({
    id: 'design-1',
    style: 'tradicional-mocambicano',
    background: { type: 'pattern', value: 'capulana-pattern' },
    fonts: {
      primary: 'elegant-script',
      secondary: 'modern-sans',
      accent: 'classic-serif',
    },
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

&quot;O amor é paciente, o amor é bondoso&quot; - 1 Coríntios 13:4

Confirme a sua presença até [Data Limite]
WhatsApp: [Número] | Link: [URL RSVP]`,
    weddingId: 'current-wedding',
  });

  const [activeTab, setActiveTab] = useState<
    'style' | 'background' | 'fonts' | 'colors' | 'text'
  >('style');

  const updateDesign = (field: keyof WeddingDesign, value: any) => {
    setDesign((prev) => ({ ...prev, [field]: value }));
  };

  const updateColors = (colors: ColorScheme) => {
    setDesign((prev) => ({ ...prev, colors }));
  };

  const updateFonts = (fontType: keyof FontSelection, fontValue: string) => {
    setDesign((prev) => ({
      ...prev,
      fonts: { ...prev.fonts, [fontType]: fontValue },
    }));
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Designer de Convites
        </h1>
        <p className="text-gray-600">
          Crie convites personalizados com elementos moçambicanos
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Design Controls */}
        <div className="space-y-6 lg:col-span-1">
          {/* Tab Navigation */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="border-b border-gray-200 p-4">
              <h2 className="font-bold text-gray-900">Personalização</h2>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {[
                  { key: 'style', label: 'Estilo', icon: Palette },
                  { key: 'background', label: 'Fundo', icon: Image },
                  { key: 'fonts', label: 'Fontes', icon: Type },
                  { key: 'colors', label: 'Cores', icon: Palette },
                  { key: 'text', label: 'Texto', icon: Type },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as any)}
                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${activeTab === key
                        ? 'border border-rose-200 bg-rose-100 text-rose-700'
                        : 'hover:bg-gray-50'
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Style Selection */}
          {activeTab === 'style' && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
              <div className="border-b border-gray-200 p-4">
                <h3 className="font-bold text-gray-900">Escolher Estilo</h3>
              </div>
              <div className="space-y-4 p-4">
                {designStyles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => updateDesign('style', style.value)}
                    className={`w-full rounded-lg border-2 p-4 text-left transition-all ${design.style === style.value
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div
                      className={`h-16 w-full ${style.preview} mb-3 rounded-lg`}
                    ></div>
                    <h4 className="mb-1 font-semibold text-gray-900">
                      {style.name}
                    </h4>
                    <p className="text-sm text-gray-600">{style.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Background Selection */}
          {activeTab === 'background' && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
              <div className="border-b border-gray-200 p-4">
                <h3 className="font-bold text-gray-900">Fundo do Convite</h3>
              </div>
              <div className="space-y-4 p-4">
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700">
                    Tipo de Fundo
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['pattern', 'solid', 'gradient', 'image'].map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          updateDesign('background', {
                            ...design.background,
                            type,
                          })
                        }
                        className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${design.background.type === type
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                      >
                        {type === 'pattern'
                          ? 'Padrão'
                          : type === 'solid'
                            ? 'Cor Sólida'
                            : type === 'gradient'
                              ? 'Gradiente'
                              : 'Imagem'}
                      </button>
                    ))}
                  </div>
                </div>

                {design.background.type === 'pattern' && (
                  <div className="space-y-3">
                    {backgroundPatterns.map((pattern) => (
                      <button
                        key={pattern.value}
                        onClick={() =>
                          updateDesign('background', {
                            type: 'pattern',
                            value: pattern.value,
                          })
                        }
                        className={`flex w-full items-center gap-3 rounded-lg border p-3 transition-colors ${design.background.value === pattern.value
                            ? 'border-rose-500 bg-rose-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <div
                          className={`h-8 w-8 ${pattern.preview} rounded`}
                        ></div>
                        <span className="text-sm font-medium">
                          {pattern.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Font Selection */}
          {activeTab === 'fonts' && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
              <div className="border-b border-gray-200 p-4">
                <h3 className="font-bold text-gray-900">Fontes Tipográficas</h3>
              </div>
              <div className="space-y-6 p-4">
                {[
                  { key: 'primary', label: 'Fonte Principal (Nomes)' },
                  { key: 'secondary', label: 'Fonte Secundária (Detalhes)' },
                  { key: 'accent', label: 'Fonte de Destaque (Citações)' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="mb-3 block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    <div className="space-y-2">
                      {fontOptions.map((font) => (
                        <button
                          key={font.value}
                          onClick={() =>
                            updateFonts(key as keyof FontSelection, font.value)
                          }
                          className={`w-full rounded-lg border p-3 text-left transition-colors ${design.fonts[key as keyof FontSelection] ===
                              font.value
                              ? 'border-rose-500 bg-rose-50'
                              : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <div className={`text-lg ${font.preview} mb-1`}>
                            Assa & Eleutério
                          </div>
                          <div className="text-sm text-gray-600">
                            {font.name}
                          </div>
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
            <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
              <div className="border-b border-gray-200 p-4">
                <h3 className="font-bold text-gray-900">Esquema de Cores</h3>
              </div>
              <div className="space-y-4 p-4">
                {colorSchemes.map((scheme) => (
                  <button
                    key={scheme.name}
                    onClick={() => updateColors(scheme.colors)}
                    className={`w-full rounded-lg border-2 p-4 text-left transition-all ${JSON.stringify(design.colors) ===
                        JSON.stringify(scheme.colors)
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex gap-1">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: scheme.colors.primary }}
                        ></div>
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: scheme.colors.secondary }}
                        ></div>
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: scheme.colors.accent }}
                        ></div>
                      </div>
                      <span className="font-medium text-gray-900">
                        {scheme.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Text Editor */}
          {activeTab === 'text' && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
              <div className="border-b border-gray-200 p-4">
                <h3 className="font-bold text-gray-900">Texto do Convite</h3>
              </div>
              <div className="p-4">
                <textarea
                  value={design.customText}
                  onChange={(e) => updateDesign('customText', e.target.value)}
                  rows={12}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                  placeholder="Digite o texto do convite..."
                />
                <div className="mt-3 text-xs text-gray-500">
                  <p className="mb-2">
                    <strong>Variáveis disponíveis:</strong>
                  </p>
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
          <div className="sticky top-6 rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h3 className="font-bold text-gray-900">Pré-visualização</h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                  <Eye className="h-4 w-4" />
                  Visualizar
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700">
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-white transition-colors hover:bg-rose-700">
                  <Save className="h-4 w-4" />
                  Salvar
                </button>
              </div>
            </div>

            <div className="p-8">
              {/* Invitation Preview */}
              <div
                className="mx-auto aspect-[3/4] max-w-md overflow-hidden rounded-2xl shadow-2xl"
                style={{
                  backgroundColor: design.colors.background,
                  color: design.colors.text,
                }}
              >
                <div className="relative flex h-full flex-col justify-center p-8 text-center">
                  {/* Decorative elements based on style */}
                  {design.style === 'tradicional-mocambicano' && (
                    <div className="absolute inset-0 opacity-10">
                      <div className="h-full w-full bg-gradient-to-br from-red-500 via-yellow-500 to-green-500"></div>
                    </div>
                  )}

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="mb-6">
                      <div
                        className="mb-2 text-4xl"
                        style={{ color: design.colors.primary }}
                      >
                        💍
                      </div>
                      <h1
                        className="mb-2 text-lg font-bold"
                        style={{ color: design.colors.primary }}
                      >
                        Convite de Casamento
                      </h1>
                    </div>

                    {/* Names */}
                    <div className="mb-6">
                      <div
                        className="mb-2 text-2xl font-bold"
                        style={{ color: design.colors.primary }}
                      >
                        Assa
                      </div>
                      <div
                        className="mb-2 text-xl"
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
                    <div className="mb-6 space-y-2 text-sm">
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
                      className="mb-6 px-4 text-sm italic"
                      style={{ color: design.colors.secondary }}
                    >
                      "O amor é paciente, o amor é bondoso"
                    </div>

                    {/* RSVP */}
                    <div className="text-xs">
                      <div className="mb-2">
                        <strong>Confirme até 25/08/2025</strong>
                      </div>
                      <div>📞 824790050 | 879659501</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
