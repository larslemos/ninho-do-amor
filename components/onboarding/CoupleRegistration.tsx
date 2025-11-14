'use client';

import { useState } from 'react';
import { Heart, MapPin, Globe, Church, User, Phone, Mail, Home } from 'lucide-react';
import type {
  Couple,
  MozambiqueProvince,
  Language,
  ReligiousTradition,
} from '@/types/mozambique-wedding';

const provinces: MozambiqueProvince[] = [
  'Maputo',
  'Gaza',
  'Inhambane',
  'Sofala',
  'Manica',
  'Tete',
  'Zambézia',
  'Nampula',
  'Cabo Delgado',
  'Niassa',
];

const languages: Language[] = [
  'Português',
  'Changana',
  'Sena',
  'Ndau',
  'Makhuwa',
  'Lomwe',
  'Tsonga',
  'Nyanja',
];

const religiousTraditions: ReligiousTradition[] = [
  'Católica',
  'Protestante',
  'Islâmica',
  'Tradicional',
  'Outras',
];

export default function CoupleRegistration() {
  const [step, setStep] = useState(1);
  const [coupleData, setCoupleData] = useState<Partial<Couple>>({
    groom: {
      fullName: '',
      traditionalName: '',
      contact: { phone: '', whatsapp: '', email: '', address: '' },
      province: 'Maputo',
      preferredLanguages: ['Português'],
      religiousTradition: 'Católica',
    },
    bride: {
      fullName: '',
      maidenName: '',
      traditionalName: '',
      contact: { phone: '', whatsapp: '', email: '', address: '' },
      province: 'Maputo',
      preferredLanguages: ['Português'],
      religiousTradition: 'Católica',
    },
  });

  const updateGroomData = (field: string, value: any) => {
    setCoupleData((prev) => ({
      ...prev,
      groom: { ...prev.groom!, [field]: value },
    }));
  };

  const updateBrideData = (field: string, value: any) => {
    setCoupleData((prev) => ({
      ...prev,
      bride: { ...prev.bride!, [field]: value },
    }));
  };

  const updateContactData = (person: 'groom' | 'bride', field: string, value: string) => {
    setCoupleData((prev) => ({
      ...prev,
      [person]: {
        ...prev[person]!,
        contact: { ...prev[person]!.contact, [field]: value },
      },
    }));
  };

  const handleLanguageToggle = (person: 'groom' | 'bride', language: Language) => {
    setCoupleData((prev) => {
      const currentLanguages = prev[person]!.preferredLanguages;
      const newLanguages = currentLanguages.includes(language)
        ? currentLanguages.filter((l) => l !== language)
        : [...currentLanguages, language];

      return {
        ...prev,
        [person]: { ...prev[person]!, preferredLanguages: newLanguages },
      };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Heart className="h-8 w-8 text-rose-600" />
            <h1 className="text-3xl font-bold text-gray-900">Sistema de Casamentos</h1>
            <Heart className="h-8 w-8 text-rose-600" />
          </div>
          <p className="text-gray-600">Plataforma completa para casamentos em Moçambique</p>

          {/* Progress Bar */}
          <div className="mx-auto mt-6 max-w-md">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-500">Passo {step} de 3</span>
              <span className="text-sm text-gray-500">{Math.round((step / 3) * 100)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-rose-600 transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Step 1: Groom Information */}
        {step === 1 && (
          <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-8 text-center">
              <User className="mx-auto mb-4 h-12 w-12 text-blue-600" />
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Informações do Noivo</h2>
              <p className="text-gray-600">Vamos começar com os dados do noivo</p>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={coupleData.groom?.fullName || ''}
                    onChange={(e) => updateGroomData('fullName', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                    placeholder="Ex: João António Silva"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Nome Tradicional
                  </label>
                  <input
                    type="text"
                    value={coupleData.groom?.traditionalName || ''}
                    onChange={(e) => updateGroomData('traditionalName', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                    placeholder="Ex: Mufana wa Nkosana"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="rounded-lg bg-gray-50 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Phone className="h-5 w-5" />
                  Dados de Contacto
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Telemóvel *
                    </label>
                    <input
                      type="tel"
                      value={coupleData.groom?.contact.phone || ''}
                      onChange={(e) => updateContactData('groom', 'phone', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                      placeholder="+258 84 123 4567"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">WhatsApp</label>
                    <input
                      type="tel"
                      value={coupleData.groom?.contact.whatsapp || ''}
                      onChange={(e) => updateContactData('groom', 'whatsapp', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                      placeholder="+258 84 123 4567"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={coupleData.groom?.contact.email || ''}
                      onChange={(e) => updateContactData('groom', 'email', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                      placeholder="joao@example.com"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Endereço Residencial
                    </label>
                    <input
                      type="text"
                      value={coupleData.groom?.contact.address || ''}
                      onChange={(e) => updateContactData('groom', 'address', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                      placeholder="Bairro, Rua, Número"
                    />
                  </div>
                </div>
              </div>

              {/* Province and Cultural Info */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin className="h-4 w-4" />
                    Província de Origem *
                  </label>
                  <select
                    value={coupleData.groom?.province || 'Maputo'}
                    onChange={(e) => updateGroomData('province', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                  >
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Church className="h-4 w-4" />
                    Tradição Religiosa
                  </label>
                  <select
                    value={coupleData.groom?.religiousTradition || 'Católica'}
                    onChange={(e) => updateGroomData('religiousTradition', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                  >
                    {religiousTraditions.map((tradition) => (
                      <option key={tradition} value={tradition}>
                        {tradition}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Languages */}
              <div>
                <label className="mb-3 block flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Globe className="h-4 w-4" />
                  Línguas Preferidas (seleccione uma ou mais)
                </label>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {languages.map((language) => (
                    <label key={language} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={coupleData.groom?.preferredLanguages.includes(language) || false}
                        onChange={() => handleLanguageToggle('groom', language)}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-sm text-gray-700">{language}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="rounded-lg bg-rose-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-rose-700"
              >
                Próximo: Dados da Noiva
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Bride Information */}
        {step === 2 && (
          <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-8 text-center">
              <Heart className="mx-auto mb-4 h-12 w-12 text-pink-600" />
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Informações da Noiva</h2>
              <p className="text-gray-600">Agora vamos registar os dados da noiva</p>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={coupleData.bride?.fullName || ''}
                    onChange={(e) => updateBrideData('fullName', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                    placeholder="Ex: Maria José Santos"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Nome de Solteira *
                  </label>
                  <input
                    type="text"
                    value={coupleData.bride?.maidenName || ''}
                    onChange={(e) => updateBrideData('maidenName', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                    placeholder="Ex: Maria José Machel"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Nome Tradicional
                </label>
                <input
                  type="text"
                  value={coupleData.bride?.traditionalName || ''}
                  onChange={(e) => updateBrideData('traditionalName', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                  placeholder="Ex: Nsati ya Nkosana"
                />
              </div>

              {/* Contact Information */}
              <div className="rounded-lg bg-gray-50 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Phone className="h-5 w-5" />
                  Dados de Contacto
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Telemóvel *
                    </label>
                    <input
                      type="tel"
                      value={coupleData.bride?.contact.phone || ''}
                      onChange={(e) => updateContactData('bride', 'phone', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                      placeholder="+258 84 123 4567"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">WhatsApp</label>
                    <input
                      type="tel"
                      value={coupleData.bride?.contact.whatsapp || ''}
                      onChange={(e) => updateContactData('bride', 'whatsapp', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                      placeholder="+258 84 123 4567"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={coupleData.bride?.contact.email || ''}
                      onChange={(e) => updateContactData('bride', 'email', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                      placeholder="maria@example.com"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Endereço Residencial
                    </label>
                    <input
                      type="text"
                      value={coupleData.bride?.contact.address || ''}
                      onChange={(e) => updateContactData('bride', 'address', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                      placeholder="Bairro, Rua, Número"
                    />
                  </div>
                </div>
              </div>

              {/* Province and Cultural Info */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin className="h-4 w-4" />
                    Província de Origem *
                  </label>
                  <select
                    value={coupleData.bride?.province || 'Maputo'}
                    onChange={(e) => updateBrideData('province', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                  >
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Church className="h-4 w-4" />
                    Tradição Religiosa
                  </label>
                  <select
                    value={coupleData.bride?.religiousTradition || 'Católica'}
                    onChange={(e) => updateBrideData('religiousTradition', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                  >
                    {religiousTraditions.map((tradition) => (
                      <option key={tradition} value={tradition}>
                        {tradition}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Languages */}
              <div>
                <label className="mb-3 block flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Globe className="h-4 w-4" />
                  Línguas Preferidas (seleccione uma ou mais)
                </label>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {languages.map((language) => (
                    <label key={language} className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={coupleData.bride?.preferredLanguages.includes(language) || false}
                        onChange={() => handleLanguageToggle('bride', language)}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-sm text-gray-700">{language}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="rounded-lg bg-gray-300 px-8 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-400"
              >
                Voltar
              </button>
              <button
                onClick={() => setStep(3)}
                className="rounded-lg bg-rose-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-rose-700"
              >
                Próximo: Configurar Casamento
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Wedding Configuration Preview */}
        {step === 3 && (
          <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-8 text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <Heart className="h-8 w-8 text-rose-600" />
                <Heart className="h-6 w-6 text-pink-500" />
                <Heart className="h-4 w-4 text-red-400" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Resumo do Registo</h2>
              <p className="text-gray-600">Confirme os dados antes de prosseguir</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Groom Summary */}
              <div className="rounded-lg bg-blue-50 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-blue-900">
                  <User className="h-5 w-5" />
                  Dados do Noivo
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Nome:</span>
                    <span className="ml-2 text-gray-900">{coupleData.groom?.fullName}</span>
                  </div>
                  {coupleData.groom?.traditionalName && (
                    <div>
                      <span className="font-medium text-gray-700">Nome Tradicional:</span>
                      <span className="ml-2 text-gray-900">{coupleData.groom.traditionalName}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-700">Telemóvel:</span>
                    <span className="ml-2 text-gray-900">{coupleData.groom?.contact.phone}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-900">{coupleData.groom?.contact.email}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Província:</span>
                    <span className="ml-2 text-gray-900">{coupleData.groom?.province}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Religião:</span>
                    <span className="ml-2 text-gray-900">
                      {coupleData.groom?.religiousTradition}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Línguas:</span>
                    <span className="ml-2 text-gray-900">
                      {coupleData.groom?.preferredLanguages.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bride Summary */}
              <div className="rounded-lg bg-pink-50 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-pink-900">
                  <Heart className="h-5 w-5" />
                  Dados da Noiva
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Nome:</span>
                    <span className="ml-2 text-gray-900">{coupleData.bride?.fullName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Nome de Solteira:</span>
                    <span className="ml-2 text-gray-900">{coupleData.bride?.maidenName}</span>
                  </div>
                  {coupleData.bride?.traditionalName && (
                    <div>
                      <span className="font-medium text-gray-700">Nome Tradicional:</span>
                      <span className="ml-2 text-gray-900">{coupleData.bride.traditionalName}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-700">Telemóvel:</span>
                    <span className="ml-2 text-gray-900">{coupleData.bride?.contact.phone}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-900">{coupleData.bride?.contact.email}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Província:</span>
                    <span className="ml-2 text-gray-900">{coupleData.bride?.province}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Religião:</span>
                    <span className="ml-2 text-gray-900">
                      {coupleData.bride?.religiousTradition}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Línguas:</span>
                    <span className="ml-2 text-gray-900">
                      {coupleData.bride?.preferredLanguages.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps Preview */}
            <div className="mt-8 rounded-lg bg-gradient-to-r from-rose-100 to-pink-100 p-6">
              <h3 className="mb-4 text-lg font-bold text-gray-900">🎉 Próximos Passos</h3>
              <div className="grid gap-4 text-sm md:grid-cols-3">
                <div className="rounded-lg bg-white p-4">
                  <h4 className="mb-2 font-semibold text-gray-900">1. Configurar Eventos</h4>
                  <p className="text-gray-600">
                    Definir datas e locais para Copo d'Água, Civil, Religiosa e Festa
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4">
                  <h4 className="mb-2 font-semibold text-gray-900">2. Design do Convite</h4>
                  <p className="text-gray-600">Personalizar convites com temas moçambicanos</p>
                </div>
                <div className="rounded-lg bg-white p-4">
                  <h4 className="mb-2 font-semibold text-gray-900">3. Gestão de Convidados</h4>
                  <p className="text-gray-600">Adicionar convidados e organizar mesas</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="rounded-lg bg-gray-300 px-8 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-400"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  // Here you would save the data and redirect to the main dashboard
                  console.log('Saving couple data:', coupleData);
                  alert('Registo concluído! Redirecionando para o painel principal...');
                }}
                className="rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 px-8 py-3 font-semibold text-white transition-colors hover:from-rose-700 hover:to-pink-700"
              >
                Concluir Registo 🎉
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
