"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, Users, FileText, Church, PartyPopper, Heart } from 'lucide-react'
import type { WeddingEvent, EventType } from "@/types/mozambique-wedding"

const eventTypes = [
  {
    type: 'copo-agua' as EventType,
    name: 'Copo de Água',
    description: 'Cerimónia tradicional de pedido de mão',
    icon: Heart,
    color: 'bg-pink-500',
    defaultDuration: 3
  },
  {
    type: 'cerimonia-civil' as EventType,
    name: 'Cerimónia Civil',
    description: 'Registo civil oficial',
    icon: FileText,
    color: 'bg-blue-500',
    defaultDuration: 1
  },
  {
    type: 'cerimonia-religiosa' as EventType,
    name: 'Cerimónia Religiosa',
    description: 'Cerimónia na igreja/mesquita',
    icon: Church,
    color: 'bg-purple-500',
    defaultDuration: 2
  },
  {
    type: 'festa-casamento' as EventType,
    name: 'Festa de Casamento',
    description: 'Celebração e recepção',
    icon: PartyPopper,
    color: 'bg-orange-500',
    defaultDuration: 6
  }
]

export default function EventConfiguration() {
  const [events, setEvents] = useState<WeddingEvent[]>([])
  const [activeEvent, setActiveEvent] = useState<EventType | null>(null)

  const initializeEvent = (type: EventType) => {
    const eventConfig = eventTypes.find(e => e.type === type)!
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
        reference: ''
      },
      capacity: type === 'festa-casamento' ? 100 : undefined,
      witnesses: type === 'cerimonia-civil' ? ['', ''] : undefined,
      officiant: ['cerimonia-religiosa'].includes(type) ? '' : undefined,
      enabled: false
    }
    
    setEvents(prev => [...prev.filter(e => e.type !== type), newEvent])
    setActiveEvent(type)
  }

  const updateEvent = (type: EventType, field: string, value: any) => {
    setEvents(prev => prev.map(event => 
      event.type === type 
        ? { ...event, [field]: value }
        : event
    ))
  }

  const updateEventLocation = (type: EventType, field: string, value: string) => {
    setEvents(prev => prev.map(event => 
      event.type === type 
        ? { ...event, location: { ...event.location, [field]: value } }
        : event
    ))
  }

  const toggleEvent = (type: EventType) => {
    const existingEvent = events.find(e => e.type === type)
    if (existingEvent) {
      updateEvent(type, 'enabled', !existingEvent.enabled)
    } else {
      initializeEvent(type)
    }
  }

  const getEvent = (type: EventType) => events.find(e => e.type === type)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuração do Casamento</h1>
        <p className="text-gray-600">Configure os eventos e cerimónias do seu casamento</p>
      </div>

      {/* Event Selection Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {eventTypes.map((eventType) => {
          const Icon = eventType.icon
          const event = getEvent(eventType.type)
          const isEnabled = event?.enabled || false
          
          return (
            <div
              key={eventType.type}
              className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                isEnabled 
                  ? 'border-rose-500 bg-rose-50 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => toggleEvent(eventType.type)}
            >
              <div className="text-center">
                <div className={`w-16 h-16 ${eventType.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{eventType.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{eventType.description}</p>
                
                <div className={`w-6 h-6 rounded-full border-2 mx-auto ${
                  isEnabled 
                    ? 'bg-rose-500 border-rose-500' 
                    : 'border-gray-300'
                }`}>
                  {isEnabled && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
              
              {isEnabled && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Event Configuration Forms */}
      {events.filter(e => e.enabled).map((event) => {
        const eventConfig = eventTypes.find(et => et.type === event.type)!
        const Icon = eventConfig.icon
        
        return (
          <div key={event.type} className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
            <div className={`${eventConfig.color} text-white p-6 rounded-t-xl`}>
              <div className="flex items-center gap-3">
                <Icon className="w-6 h-6" />
                <h2 className="text-xl font-bold">{eventConfig.name}</h2>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Date and Time */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Data e Horário
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data *
                    </label>
                    <input
                      type="date"
                      value={event.date}
                      onChange={(e) => updateEvent(event.type, 'date', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora de Início *
                      </label>
                      <input
                        type="time"
                        value={event.startTime}
                        onChange={(e) => updateEvent(event.type, 'startTime', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora de Fim
                      </label>
                      <input
                        type="time"
                        value={event.endTime || ''}
                        onChange={(e) => updateEvent(event.type, 'endTime', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Local
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {event.type === 'cerimonia-civil' ? 'Conservatória' : 
                       event.type === 'cerimonia-religiosa' ? 'Igreja/Mesquita' : 
                       event.type === 'festa-casamento' ? 'Salão/Local' : 'Local'} *
                    </label>
                    <input
                      type="text"
                      value={event.location.name}
                      onChange={(e) => updateEventLocation(event.type, 'name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      placeholder={
                        event.type === 'cerimonia-civil' ? 'Ex: Conservatória de Maputo' :
                        event.type === 'cerimonia-religiosa' ? 'Ex: Igreja da Polana' :
                        'Ex: Hotel Polana'
                      }
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço/Referência *
                    </label>
                    <input
                      type="text"
                      value={event.location.address}
                      onChange={(e) => updateEventLocation(event.type, 'address', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      placeholder="Ex: Av. Julius Nyerere, 1234, Maputo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Maps URL
                    </label>
                    <input
                      type="url"
                      value={event.location.googleMapsUrl || ''}
                      onChange={(e) => updateEventLocation(event.type, 'googleMapsUrl', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      placeholder="https://maps.google.com/..."
                    />
                  </div>
                </div>
              </div>

              {/* Event-specific fields */}
              {event.type === 'cerimonia-civil' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Testemunhas</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Testemunha 1 *
                      </label>
                      <input
                        type="text"
                        value={event.witnesses?.[0] || ''}
                        onChange={(e) => {
                          const newWitnesses = [...(event.witnesses || ['', ''])]
                          newWitnesses[0] = e.target.value
                          updateEvent(event.type, 'witnesses', newWitnesses)
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                        placeholder="Nome completo da testemunha"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Testemunha 2 *
                      </label>
                      <input
                        type="text"
                        value={event.witnesses?.[1] || ''}
                        onChange={(e) => {
                          const newWitnesses = [...(event.witnesses || ['', ''])]
                          newWitnesses[1] = e.target.value
                          updateEvent(event.type, 'witnesses', newWitnesses)
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                        placeholder="Nome completo da testemunha"
                      />
                    </div>
                  </div>
                </div>
              )}

              {event.type === 'cerimonia-religiosa' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Padre/Pastor/Imam
                    </label>
                    <input
                      type="text"
                      value={event.officiant || ''}
                      onChange={(e) => updateEvent(event.type, 'officiant', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      placeholder="Nome do oficiante"
                    />
                  </div>
                </div>
              )}

              {event.type === 'festa-casamento' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Capacidade (número de pessoas)
                    </label>
                    <input
                      type="number"
                      value={event.capacity || ''}
                      onChange={(e) => updateEvent(event.type, 'capacity', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      placeholder="Ex: 150"
                      min="1"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* Summary and Actions */}
      {events.filter(e => e.enabled).length > 0 && (
        <div className="bg-gradient-to-r from-rose-100 to-pink-100 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Resumo dos Eventos</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {events.filter(e => e.enabled).map((event) => {
              const eventConfig = eventTypes.find(et => et.type === event.type)!
              return (
                <div key={event.type} className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{eventConfig.name}</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>📅 {event.date ? new Date(event.date).toLocaleDateString('pt-BR') : 'Data não definida'}</div>
                    <div>🕐 {event.startTime || 'Hora não definida'}</div>
                    <div>📍 {event.location.name || 'Local não definido'}</div>
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="flex gap-4">
            <button className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Salvar Configuração
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Próximo: Design do Convite
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
