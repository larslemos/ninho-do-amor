"use client"

import { useState, useRef } from "react"
import { QrCode, Upload, Download, Eye, Heart, Share2, Filter, Grid, List } from 'lucide-react'
import type { PhotoGallery, Photo, EventType } from "@/types/mozambique-wedding"

const eventTypes = [
  { type: 'copo-agua' as EventType, name: 'Copo de Água', color: 'bg-pink-500' },
  { type: 'cerimonia-civil' as EventType, name: 'Cerimónia Civil', color: 'bg-blue-500' },
  { type: 'cerimonia-religiosa' as EventType, name: 'Cerimónia Religiosa', color: 'bg-purple-500' },
  { type: 'festa-casamento' as EventType, name: 'Festa de Casamento', color: 'bg-orange-500' }
]

export default function PhotoGallerySystem() {
  const [galleries, setGalleries] = useState<PhotoGallery[]>([
    {
      id: 'gallery-1',
      eventType: 'festa-casamento',
      photos: [
        {
          id: 'photo-1',
          url: '/placeholder.svg?height=300&width=400',
          uploadedBy: 'João Silva',
          uploadedAt: '2025-01-08T10:30:00Z',
          approved: true,
          tags: ['festa', 'dança'],
          likes: 15
        },
        {
          id: 'photo-2',
          url: '/placeholder.svg?height=300&width=400',
          uploadedBy: 'Maria Santos',
          uploadedAt: '2025-01-08T11:15:00Z',
          approved: true,
          tags: ['noivos', 'dança'],
          likes: 23
        }
      ],
      qrCode: 'QR-FESTA-123',
      moderationEnabled: true,
      weddingId: 'current-wedding'
    }
  ])
  
  const [activeEvent, setActiveEvent] = useState<EventType>('festa-casamento')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterTag, setFilterTag] = useState<string>('')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getActiveGallery = () => {
    return galleries.find(g => g.eventType === activeEvent) || galleries[0]
  }

  const getFilteredPhotos = () => {
    const gallery = getActiveGallery()
    if (!gallery) return []
    
    let photos = gallery.photos.filter(photo => photo.approved)
    
    if (filterTag) {
      photos = photos.filter(photo => 
        photo.tags.some(tag => tag.toLowerCase().includes(filterTag.toLowerCase()))
      )
    }
    
    return photos.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return
    
    const gallery = getActiveGallery()
    if (!gallery) return

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newPhoto: Photo = {
          id: `photo-${Date.now()}-${index}`,
          url: e.target?.result as string,
          uploadedBy: 'Convidado Anónimo',
          uploadedAt: new Date().toISOString(),
          approved: !gallery.moderationEnabled,
          tags: [],
          likes: 0
        }
        
        setGalleries(prev => prev.map(g => 
          g.id === gallery.id 
            ? { ...g, photos: [...g.photos, newPhoto] }
            : g
        ))
      }
      reader.readAsDataURL(file)
    })
    
    setShowUploadModal(false)
  }

  const toggleLike = (photoId: string) => {
    const gallery = getActiveGallery()
    if (!gallery) return

    setGalleries(prev => prev.map(g => 
      g.id === gallery.id 
        ? {
            ...g,
            photos: g.photos.map(photo => 
              photo.id === photoId 
                ? { ...photo, likes: photo.likes + 1 }
                : photo
            )
          }
        : g
    ))
  }

  const downloadAllPhotos = () => {
    const photos = getFilteredPhotos()
    // In a real implementation, this would create a ZIP file
    console.log('Downloading', photos.length, 'photos')
    alert(`Iniciando download de ${photos.length} fotos...`)
  }

  const generateQRCode = (eventType: EventType) => {
    const baseUrl = window.location.origin
    const uploadUrl = `${baseUrl}/upload-photos?event=${eventType}`
    return uploadUrl
  }

  const sharePhoto = (photo: Photo) => {
    if (navigator.share) {
      navigator.share({
        title: 'Foto do Casamento',
        text: 'Veja esta foto do casamento!',
        url: photo.url
      })
    } else {
      navigator.clipboard.writeText(photo.url)
      alert('Link da foto copiado!')
    }
  }

  const getAllTags = () => {
    const gallery = getActiveGallery()
    if (!gallery) return []
    
    const allTags = gallery.photos.flatMap(photo => photo.tags)
    return [...new Set(allTags)]
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Galeria de Fotos</h1>
          <p className="text-gray-600">Sistema colaborativo de fotos por QR Code</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowQRModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <QrCode className="w-5 h-5" />
            QR Codes
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Upload className="w-5 h-5" />
            Upload
          </button>
          <button
            onClick={downloadAllPhotos}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Todas
          </button>
        </div>
      </div>

      {/* Event Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {eventTypes.map((event) => {
              const gallery = galleries.find(g => g.eventType === event.type)
              const photoCount = gallery?.photos.filter(p => p.approved).length || 0
              
              return (
                <button
                  key={event.type}
                  onClick={() => setActiveEvent(event.type)}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors border-b-2 ${
                    activeEvent === event.type
                      ? 'text-rose-600 border-rose-600 bg-rose-50'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className={`w-3 h-3 ${event.color} rounded-full`}></div>
                    <span>{event.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {photoCount} foto{photoCount !== 1 ? 's' : ''}
                  </div>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Filters and View Controls */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="">Todas as tags</option>
                  {getAllTags().map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-500">
                {getFilteredPhotos().length} foto{getFilteredPhotos().length !== 1 ? 's' : ''} encontrada{getFilteredPhotos().length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-rose-100 text-rose-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-rose-100 text-rose-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Photos Display */}
        <div className="p-6">
          {getFilteredPhotos().length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma foto encontrada</h3>
              <p className="text-gray-600 mb-6">
                {filterTag ? 'Tente remover os filtros ou' : ''} Seja o primeiro a partilhar fotos deste evento!
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Fazer Upload de Fotos
              </button>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {getFilteredPhotos().map((photo) => (
                    <div key={photo.id} className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={photo.url || "/placeholder.svg"}
                          alt="Foto do casamento"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
                        <div className="w-full p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex items-center justify-between text-white text-sm">
                            <span className="truncate">{photo.uploadedBy}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleLike(photo.id)}
                                className="flex items-center gap-1 hover:text-red-400 transition-colors"
                              >
                                <Heart className="w-4 h-4" />
                                <span>{photo.likes}</span>
                              </button>
                              <button
                                onClick={() => sharePhoto(photo)}
                                className="hover:text-blue-400 transition-colors"
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {getFilteredPhotos().map((photo) => (
                    <div key={photo.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={photo.url || "/placeholder.svg"}
                          alt="Foto do casamento"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{photo.uploadedBy}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(photo.uploadedAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{photo.likes} likes</span>
                          </div>
                          {photo.tags.length > 0 && (
                            <div className="flex gap-1">
                              {photo.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-rose-100 text-rose-600 rounded-full text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleLike(photo.id)}
                          className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => sharePhoto(photo)}
                          className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Upload de Fotos</h3>
            </div>
            <div className="p-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-rose-500 hover:bg-rose-50 transition-colors"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Selecionar Fotos</h4>
                <p className="text-gray-600 mb-4">Clique aqui ou arraste fotos para fazer upload</p>
                <p className="text-sm text-gray-500">Formatos suportados: JPG, PNG, HEIC</p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">QR Codes para Upload</h3>
              <p className="text-gray-600">Códigos QR para cada evento - imprima e coloque nas mesas</p>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {eventTypes.map((event) => (
                  <div key={event.type} className="text-center">
                    <div className={`w-4 h-4 ${event.color} rounded-full mx-auto mb-2`}></div>
                    <h4 className="font-bold text-gray-900 mb-4">{event.name}</h4>
                    
                    {/* QR Code Placeholder */}
                    <div className="w-48 h-48 bg-gray-100 border-2 border-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <div className="text-center">
                        <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">QR Code</p>
                        <p className="text-xs text-gray-400">{event.type}</p>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-4">
                      <p className="font-medium mb-1">Link de Upload:</p>
                      <p className="text-xs bg-gray-100 p-2 rounded break-all">
                        {generateQRCode(event.type)}
                      </p>
                    </div>
                    
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                      Imprimir QR Code
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowQRModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Fechar
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Imprimir Todos os QR Codes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
