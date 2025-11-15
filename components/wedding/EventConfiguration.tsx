'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, FileText, Church, PartyPopper, Heart } from 'lucide-react';
import type { WeddingEvent, EventType } from '@/types/mozambique-wedding';

const eventTypes = [
  {
    type: 'copo-agua' as EventType,
    name: 'Copo de Água',
    description: 'Cerimónia tradicional de pedido de mão',
    icon: Heart,
    color: 'bg-pink-500',
    defaultDuration: 3,
  },
  {
    type: 'cerimonia-civil' as EventType,
    name: 'Cerimónia Civil',
    description: 'Registo civil oficial',
    icon: FileText,
    color: 'bg-blue-500',
    defaultDuration: 1,
  },
  {
    type: 'cerimonia-religiosa' as EventType,
    name: 'Cerimónia Religiosa',
    description: 'Cerimónia na igreja/mesquita',
    icon: Church,
    color: 'bg-purple-500',
    defaultDuration: 2,
  },
  {
    type: 'festa-casamento' as EventType,
    name: 'Festa de Casamento',
    description: 'Celebração e recepção',
    icon: PartyPopper,
    color: 'bg-orange-500',
    defaultDuration: 6,
  },
];

export default function EventConfiguration() {
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [activeEvent, setActiveEvent] = useState<EventType | null>(null);

  const initializeEvent = (type: EventType) => {
    const eventConfig = eventTypes.find((e) => e.type === type)!;
    const newEvent: WeddingEvent = {
      id: `${type}-${Date.now()}`,
      type,
      date: '',
      startTime: '',
      endTime: '',
      location: {
        name: '',
        address: '',
        googleMapsUrl: '',
        reference: '',
      },
      capacity: type === 'festa-casamento' ? 100 : undefined,
      witnesses: type === 'cerimonia-civil' ? ['', ''] : undefined,
      officiant: ['cerimonia-religiosa'].includes(type) ? '' : undefined,
      enabled: false,
    };

    setEvents((prev) => [...prev.filter((e) => e.type !== type), newEvent]);
    setActiveEvent(type);
  };

  const updateEvent = (type: EventType, field: string, value: any) => {
    setEvents((prev) =>
      prev.map((event) => (event.type === type ? { ...event, [field]: value } : event))
    );
  };

  const updateEventLocation = (type: EventType, field: string, value: string) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.type === type ? { ...event, location: { ...event.location, [field]: value } } : event
      )
    );
  };

  const toggleEvent = (type: EventType) => {
    const existingEvent = events.find((e) => e.type === type);
    if (existingEvent) {
      updateEvent(type, 'enabled', !existingEvent.enabled);
    } else {
      initializeEvent(type);
    }
  };

  const getEvent = (type: EventType) => events.find((e) => e.type === type);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Configuração do Casamento</h1>
        <p className="text-gray-600">Configure os eventos e cerimónias do seu casamento</p>
      </div>

      {/* Event Selection Grid */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {eventTypes.map((eventType) => {
          const Icon = eventType.icon;
          const event = getEvent(eventType.type);
          const isEnabled = event?.enabled || false;

          return (
            <div
              key={eventType.type}
              className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all ${
                isEnabled
                  ? 'border-rose-500 bg-rose-50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleEvent(eventType.type)}
            >
              <div className="text-center">
                <div
                  className={`h-16 w-16 ${eventType.color} mx-auto mb-4 flex items-center justify-center rounded-full`}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-2 font-bold text-gray-900">{eventType.name}</h3>
                <p className="mb-4 text-sm text-gray-600">{eventType.description}</p>

                <div
                  className={`mx-auto h-6 w-6 rounded-full border-2 ${
                    isEnabled ? 'border-rose-500 bg-rose-500' : 'border-gray-300'
                  }`}
                >
                  {isEnabled && (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    </div>
                  )}
                </div>
              </div>

              {isEnabled && (
                <div className="absolute right-2 top-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Event Configuration Forms */}
      {events
        .filter((e) => e.enabled)
        .map((event) => {
          const eventConfig = eventTypes.find((et) => et.type === event.type)!;
          const Icon = eventConfig.icon;

          return (
            <div
              key={event.type}
              className="mb-6 rounded-xl border border-gray-200 bg-white shadow-lg"
            >
              <div className={`${eventConfig.color} rounded-t-xl p-6 text-white`}>
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6" />
                  <h2 className="text-xl font-bold">{eventConfig.name}</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Date and Time */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                      <Calendar className="h-5 w-5" />
                      Data e Horário
                    </h3>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Data *</label>
                      <input
                        type="date"
                        value={event.date}
                        onChange={(e) => updateEvent(event.type, 'date', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Hora de Início *
                        </label>
                        <input
                          type="time"
                          value={event.startTime}
                          onChange={(e) => updateEvent(event.type, 'startTime', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Hora de Fim
                        </label>
                        <input
                          type="time"
                          value={event.endTime || ''}
                          onChange={(e) => updateEvent(event.type, 'endTime', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                      <MapPin className="h-5 w-5" />
                      Local
                    </h3>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        {event.type === 'cerimonia-civil'
                          ? 'Conservatória'
                          : event.type === 'cerimonia-religiosa'
                            ? 'Igreja/Mesquita'
                            : event.type === 'festa-casamento'
                              ? 'Salão/Local'
                              : 'Local'}{' '}
                        *
                      </label>
                      <input
                        type="text"
                        value={event.location.name}
                        onChange={(e) => updateEventLocation(event.type, 'name', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                        placeholder={
                          event.type === 'cerimonia-civil'
                            ? 'Ex: Conservatória de Maputo'
                            : event.type === 'cerimonia-religiosa'
                              ? 'Ex: Igreja da Polana'
                              : 'Ex: Hotel Polana'
                        }
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Endereço/Referência *
                      </label>
                      <input
                        type="text"
                        value={event.location.address}
                        onChange={(e) => updateEventLocation(event.type, 'address', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                        placeholder="Ex: Av. Julius Nyerere, 1234, Maputo"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Google Maps URL
                      </label>
                      <input
                        type="url"
                        value={event.location.googleMapsUrl || ''}
                        onChange={(e) =>
                          updateEventLocation(event.type, 'googleMapsUrl', e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                        placeholder="https://maps.google.com/..."
                      />
                    </div>
                  </div>
                </div>

                {/* Event-specific fields */}
                {event.type === 'cerimonia-civil' && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="mb-4 font-semibold text-gray-900">Testemunhas</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Testemunha 1 *
                        </label>
                        <input
                          type="text"
                          value={event.witnesses?.[0] || ''}
                          onChange={(e) => {
                            const newWitnesses = [...(event.witnesses || ['', ''])];
                            newWitnesses[0] = e.target.value;
                            updateEvent(event.type, 'witnesses', newWitnesses);
                          }}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                          placeholder="Nome completo da testemunha"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Testemunha 2 *
                        </label>
                        <input
                          type="text"
                          value={event.witnesses?.[1] || ''}
                          onChange={(e) => {
                            const newWitnesses = [...(event.witnesses || ['', ''])];
                            newWitnesses[1] = e.target.value;
                            updateEvent(event.type, 'witnesses', newWitnesses);
                          }}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                          placeholder="Nome completo da testemunha"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {event.type === 'cerimonia-religiosa' && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Padre/Pastor/Imam
                      </label>
                      <input
                        type="text"
                        value={event.officiant || ''}
                        onChange={(e) => updateEvent(event.type, 'officiant', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                        placeholder="Nome do oficiante"
                      />
                    </div>
                  </div>
                )}

                {event.type === 'festa-casamento' && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <div>
                      <label className="mb-2 block flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Users className="h-4 w-4" />
                        Capacidade (número de pessoas)
                      </label>
                      <input
                        type="number"
                        value={event.capacity || ''}
                        onChange={(e) =>
                          updateEvent(event.type, 'capacity', parseInt(e.target.value) || 0)
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                        placeholder="Ex: 150"
                        min="1"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

      {/* Summary and Actions */}
      {events.filter((e) => e.enabled).length > 0 && (
        <div className="rounded-xl bg-gradient-to-r from-rose-100 to-pink-100 p-6">
          <h3 className="mb-4 text-lg font-bold text-gray-900">📋 Resumo dos Eventos</h3>
          <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {events
              .filter((e) => e.enabled)
              .map((event) => {
                const eventConfig = eventTypes.find((et) => et.type === event.type)!;
                return (
                  <div key={event.type} className="rounded-lg bg-white p-4">
                    <h4 className="mb-2 font-semibold text-gray-900">{eventConfig.name}</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>
                        📅{' '}
                        {event.date
                          ? new Date(event.date).toLocaleDateString('pt-BR')
                          : 'Data não definida'}
                      </div>
                      <div>🕐 {event.startTime || 'Hora não definida'}</div>
                      <div>📍 {event.location.name || 'Local não definido'}</div>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="flex gap-4">
            <button className="rounded-lg bg-rose-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-rose-700">
              Salvar Configuração
            </button>
            <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700">
              Próximo: Design do Convite
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
