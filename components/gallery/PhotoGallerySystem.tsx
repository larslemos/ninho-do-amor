'use client';

import { useState, useRef } from 'react';
import { QrCode, Upload, Download, Eye, Heart, Share2, Filter, Grid, List } from 'lucide-react';
import type { PhotoGallery, Photo, EventType } from '@/types/mozambique-wedding';

const eventTypes = [
  {
    type: 'copo-agua' as EventType,
    name: 'Copo de Água',
    color: 'bg-pink-500',
  },
  {
    type: 'cerimonia-civil' as EventType,
    name: 'Cerimónia Civil',
    color: 'bg-blue-500',
  },
  {
    type: 'cerimonia-religiosa' as EventType,
    name: 'Cerimónia Religiosa',
    color: 'bg-purple-500',
  },
  {
    type: 'festa-casamento' as EventType,
    name: 'Festa de Casamento',
    color: 'bg-orange-500',
  },
];

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
          likes: 15,
        },
        {
          id: 'photo-2',
          url: '/placeholder.svg?height=300&width=400',
          uploadedBy: 'Maria Santos',
          uploadedAt: '2025-01-08T11:15:00Z',
          approved: true,
          tags: ['noivos', 'dança'],
          likes: 23,
        },
      ],
      qrCode: 'QR-FESTA-123',
      moderationEnabled: true,
      weddingId: 'current-wedding',
    },
  ]);

  const [activeEvent, setActiveEvent] = useState<EventType>('festa-casamento');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterTag, setFilterTag] = useState<string>('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getActiveGallery = () => {
    return galleries.find((g) => g.eventType === activeEvent) || galleries[0];
  };

  const getFilteredPhotos = () => {
    const gallery = getActiveGallery();
    if (!gallery) return [];

    let photos = gallery.photos.filter((photo) => photo.approved);

    if (filterTag) {
      photos = photos.filter((photo) =>
        photo.tags.some((tag) => tag.toLowerCase().includes(filterTag.toLowerCase()))
      );
    }

    return photos.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const gallery = getActiveGallery();
    if (!gallery) return;

    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto: Photo = {
          id: `photo-${Date.now()}-${index}`,
          url: e.target?.result as string,
          uploadedBy: 'Convidado Anónimo',
          uploadedAt: new Date().toISOString(),
          approved: !gallery.moderationEnabled,
          tags: [],
          likes: 0,
        };

        setGalleries((prev) =>
          prev.map((g) => (g.id === gallery.id ? { ...g, photos: [...g.photos, newPhoto] } : g))
        );
      };
      reader.readAsDataURL(file);
    });

    setShowUploadModal(false);
  };

  const toggleLike = (photoId: string) => {
    const gallery = getActiveGallery();
    if (!gallery) return;

    setGalleries((prev) =>
      prev.map((g) =>
        g.id === gallery.id
          ? {
              ...g,
              photos: g.photos.map((photo) =>
                photo.id === photoId ? { ...photo, likes: photo.likes + 1 } : photo
              ),
            }
          : g
      )
    );
  };

  const downloadAllPhotos = () => {
    const photos = getFilteredPhotos();
    // In a real implementation, this would create a ZIP file
    console.log('Downloading', photos.length, 'photos');
    alert(`Iniciando download de ${photos.length} fotos...`);
  };

  const generateQRCode = (eventType: EventType) => {
    const baseUrl = window.location.origin;
    const uploadUrl = `${baseUrl}/upload-photos?event=${eventType}`;
    return uploadUrl;
  };

  const sharePhoto = (photo: Photo) => {
    if (navigator.share) {
      navigator.share({
        title: 'Foto do Casamento',
        text: 'Veja esta foto do casamento!',
        url: photo.url,
      });
    } else {
      navigator.clipboard.writeText(photo.url);
      alert('Link da foto copiado!');
    }
  };

  const getAllTags = () => {
    const gallery = getActiveGallery();
    if (!gallery) return [];

    const allTags = gallery.photos.flatMap((photo) => photo.tags);
    return [...new Set(allTags)];
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Galeria de Fotos</h1>
          <p className="text-gray-600">Sistema colaborativo de fotos por QR Code</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowQRModal(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <QrCode className="h-5 w-5" />
            QR Codes
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
          >
            <Upload className="h-5 w-5" />
            Upload
          </button>
          <button
            onClick={downloadAllPhotos}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-purple-700"
          >
            <Download className="h-5 w-5" />
            Download Todas
          </button>
        </div>
      </div>

      {/* Event Tabs */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {eventTypes.map((event) => {
              const gallery = galleries.find((g) => g.eventType === event.type);
              const photoCount = gallery?.photos.filter((p) => p.approved).length || 0;

              return (
                <button
                  key={event.type}
                  onClick={() => setActiveEvent(event.type)}
                  className={`flex-1 border-b-2 px-6 py-4 text-center font-medium transition-colors ${
                    activeEvent === event.type
                      ? 'border-rose-600 bg-rose-50 text-rose-600'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <div className="mb-1 flex items-center justify-center gap-2">
                    <div className={`h-3 w-3 ${event.color} rounded-full`}></div>
                    <span>{event.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {photoCount} foto{photoCount !== 1 ? 's' : ''}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Filters and View Controls */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">Todas as tags</option>
                  {getAllTags().map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-500">
                {getFilteredPhotos().length} foto
                {getFilteredPhotos().length !== 1 ? 's' : ''} encontrada
                {getFilteredPhotos().length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-lg p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-rose-100 text-rose-600'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-lg p-2 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-rose-100 text-rose-600'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Photos Display */}
        <div className="p-6">
          {getFilteredPhotos().length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Nenhuma foto encontrada</h3>
              <p className="mb-6 text-gray-600">
                {filterTag ? 'Tente remover os filtros ou' : ''} Seja o primeiro a partilhar fotos
                deste evento!
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="rounded-lg bg-rose-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-rose-700"
              >
                Fazer Upload de Fotos
              </button>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {getFilteredPhotos().map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={photo.url || '/placeholder.svg'}
                          alt="Foto do casamento"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      {/* Overlay */}
                      <div className="absolute inset-0 flex items-end bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-30">
                        <div className="w-full bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <div className="flex items-center justify-between text-sm text-white">
                            <span className="truncate">{photo.uploadedBy}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleLike(photo.id)}
                                className="flex items-center gap-1 transition-colors hover:text-red-400"
                              >
                                <Heart className="h-4 w-4" />
                                <span>{photo.likes}</span>
                              </button>
                              <button
                                onClick={() => sharePhoto(photo)}
                                className="transition-colors hover:text-blue-400"
                              >
                                <Share2 className="h-4 w-4" />
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
                    <div
                      key={photo.id}
                      className="flex items-center gap-4 rounded-lg bg-gray-50 p-4"
                    >
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={photo.url || '/placeholder.svg'}
                          alt="Foto do casamento"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium text-gray-900">{photo.uploadedBy}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(photo.uploadedAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{photo.likes} likes</span>
                          </div>
                          {photo.tags.length > 0 && (
                            <div className="flex gap-1">
                              {photo.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-rose-100 px-2 py-1 text-xs text-rose-600"
                                >
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
                          className="p-2 text-gray-500 transition-colors hover:text-red-500"
                        >
                          <Heart className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => sharePhoto(photo)}
                          className="p-2 text-gray-500 transition-colors hover:text-blue-500"
                        >
                          <Share2 className="h-4 w-4" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
            <div className="border-b border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900">Upload de Fotos</h3>
            </div>
            <div className="p-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-rose-500 hover:bg-rose-50"
              >
                <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h4 className="mb-2 text-lg font-semibold text-gray-900">Selecionar Fotos</h4>
                <p className="mb-4 text-gray-600">Clique aqui ou arraste fotos para fazer upload</p>
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
            <div className="flex gap-3 border-t border-gray-200 p-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 rounded-lg bg-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="border-b border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900">QR Codes para Upload</h3>
              <p className="text-gray-600">
                Códigos QR para cada evento - imprima e coloque nas mesas
              </p>
            </div>
            <div className="p-6">
              <div className="grid gap-8 md:grid-cols-2">
                {eventTypes.map((event) => (
                  <div key={event.type} className="text-center">
                    <div className={`h-4 w-4 ${event.color} mx-auto mb-2 rounded-full`}></div>
                    <h4 className="mb-4 font-bold text-gray-900">{event.name}</h4>

                    {/* QR Code Placeholder */}
                    <div className="mx-auto mb-4 flex h-48 w-48 items-center justify-center rounded-lg border-2 border-gray-300 bg-gray-100">
                      <div className="text-center">
                        <QrCode className="mx-auto mb-2 h-16 w-16 text-gray-400" />
                        <p className="text-sm text-gray-500">QR Code</p>
                        <p className="text-xs text-gray-400">{event.type}</p>
                      </div>
                    </div>

                    <div className="mb-4 text-sm text-gray-600">
                      <p className="mb-1 font-medium">Link de Upload:</p>
                      <p className="break-all rounded bg-gray-100 p-2 text-xs">
                        {generateQRCode(event.type)}
                      </p>
                    </div>

                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
                      Imprimir QR Code
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 border-t border-gray-200 p-6">
              <button
                onClick={() => setShowQRModal(false)}
                className="flex-1 rounded-lg bg-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-400"
              >
                Fechar
              </button>
              <button className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700">
                Imprimir Todos os QR Codes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
