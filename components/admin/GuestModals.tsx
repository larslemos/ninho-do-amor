// app/components/admin/GuestModals.tsx

'use client';

import type React from 'react';
import EmailTemplateSelector from './EmailTemplateSelector';
import type { EmailTemplateType } from '@/lib/email-templates';
import { Edit, Trash2 } from 'lucide-react';

interface Guest {
  id: string;
  nome: string;
  telefone?: string;
  phone?: string;
  telephone?: string;
  email?: string;
  status: 'pending' | 'confirmed' | 'rejected';
  mesa?: string;
  token: string;
  unique_url?: string;
  invitation_sent_at?: string;
  rsvp_deadline?: string;
  created_at: string;
}

interface WeddingData {
  bride?: string;
  groom?: string;
}

interface Toast {
  variant?: 'default' | 'destructive' | 'success' | null | undefined;
  title: string;
  description: string;
}

interface GuestModalsProps {
  weddingSlug: string | null;
  weddingData: WeddingData;
  guests: Guest[];
  newGuest: { nome: string; telefone: string; email: string; mesa: string };
  setNewGuest: (guest: { nome: string; telefone: string; email: string; mesa: string }) => void;
  editGuest: Guest | null;
  setEditGuest: (guest: Guest | null) => void;
  guestToDelete: { id: string; nome: string } | null;
  setGuestToDelete: (guest: { id: string; nome: string } | null) => void;
  showAddModal: boolean;
  showEditModal: boolean;
  showDeleteModal: boolean;
  setShowAddModal: (show: boolean) => void;
  setShowEditModal: (show: boolean) => void;
  setShowDeleteModal: (show: boolean) => void;
  handleAddGuest: () => Promise<void>;
  handleEditGuest: () => Promise<void>;
  handleDeleteGuest: (guestId: string, guestName: string) => Promise<void>;
  selectedGuestForEmail: Guest | null;
  setSelectedGuestForEmail: (guest: Guest | null) => void;
  showTemplateSelector: boolean;
  setShowTemplateSelector: (show: boolean) => void;
  sendingInvitation: string | null;
  fetchGuests: () => Promise<void>;
  toast: (options: Toast) => void;
}

export default function GuestModals({
  weddingSlug,
  weddingData,
  guests,
  newGuest,
  setNewGuest,
  editGuest,
  setEditGuest,
  guestToDelete,
  setGuestToDelete,
  showAddModal,
  showEditModal,
  showDeleteModal,
  setShowAddModal,
  setShowEditModal,
  setShowDeleteModal,
  handleAddGuest,
  handleEditGuest,
  handleDeleteGuest,
  selectedGuestForEmail,
  setSelectedGuestForEmail,
  showTemplateSelector,
  setShowTemplateSelector,
  sendingInvitation,
  fetchGuests,
  toast,
}: GuestModalsProps) {
  const toggleAddModal = (show: boolean) => setShowAddModal(show);
  const toggleEditModal = (show: boolean) => setShowEditModal(show);
  const toggleDeleteModal = (show: boolean) => setShowDeleteModal(show);

  const formatDateForInput = (isoDate?: string) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toISOString().slice(0, 16);
  };

  return (
    <>
      {showAddModal && (
        <div className="fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 duration-300 animate-in">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="p-6">
              <h3 className="mb-4 font-josefin text-lg font-semibold text-gray-900">
                Adicionar Novo Convidado
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block font-quicksand text-sm font-medium text-gray-700">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={newGuest.nome}
                    onChange={(e) => setNewGuest({ ...newGuest, nome: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 font-quicksand focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-quicksand text-sm font-medium text-gray-700">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={newGuest.telefone}
                    onChange={(e) => setNewGuest({ ...newGuest, telefone: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 font-quicksand focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                    placeholder="Ex: +258 84 123 4567"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-quicksand text-sm font-medium text-gray-700">
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    value={newGuest.email}
                    onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 font-quicksand focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                    placeholder="Ex: joao@example.com"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-quicksand text-sm font-medium text-gray-700">
                    Mesa (opcional)
                  </label>
                  <input
                    type="text"
                    value={newGuest.mesa}
                    onChange={(e) => setNewGuest({ ...newGuest, mesa: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 font-quicksand focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                    placeholder="Ex: Mesa 5"
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleAddGuest}
                  className="flex-1 rounded-lg bg-rose-600 px-4 py-2 font-josefin text-white transition-colors animate-in slide-in-from-right hover:bg-rose-700"
                >
                  Adicionar
                </button>
                <button
                  onClick={() => {
                    setNewGuest({
                      nome: '',
                      telefone: '',
                      email: '',
                      mesa: '',
                    });
                    toggleAddModal(false);
                  }}
                  className="flex-1 rounded-lg bg-gray-300 px-4 py-2 font-josefin text-gray-700 transition-colors animate-in slide-in-from-right hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editGuest && (
        <div className="fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 duration-300 animate-in">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="p-6">
              <h3 className="mb-4 font-josefin text-lg font-semibold text-gray-900">
                Editar Convidado
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block font-quicksand text-sm font-medium text-gray-700">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={editGuest.nome}
                    onChange={(e) =>
                      setEditGuest({
                        ...editGuest,
                        nome: e.target.value,
                      } as Guest)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 font-quicksand focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                    placeholder="Ex: João Silva"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block font-quicksand text-sm font-medium text-gray-700">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={editGuest.telefone || ''}
                    onChange={(e) =>
                      setEditGuest({
                        ...editGuest,
                        telefone: e.target.value,
                      } as Guest)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 font-quicksand focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                    placeholder="Ex: +258 84 123 4567"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block font-quicksand text-sm font-medium text-gray-700">
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    value={editGuest.email || ''}
                    onChange={(e) =>
                      setEditGuest({
                        ...editGuest,
                        email: e.target.value,
                      } as Guest)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 font-quicksand focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                    placeholder="Ex: joao@example.com"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-quicksand text-sm font-medium text-gray-700">
                    Mesa (opcional)
                  </label>
                  <input
                    type="text"
                    value={editGuest.mesa || ''}
                    onChange={(e) =>
                      setEditGuest({
                        ...editGuest,
                        mesa: e.target.value,
                      } as Guest)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 font-quicksand focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                    placeholder="Ex: Mesa 5"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-quicksand text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={editGuest.status}
                    onChange={(e) =>
                      setEditGuest({
                        ...editGuest,
                        status: e.target.value as 'pending' | 'confirmed' | 'rejected',
                      } as Guest)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 font-quicksand focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="pending">Pendente</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="rejected">Rejeitado</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-quicksand text-sm font-medium text-gray-700">
                    Convite Enviado (opcional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formatDateForInput(editGuest.invitation_sent_at)}
                    onChange={(e) =>
                      setEditGuest({
                        ...editGuest,
                        invitation_sent_at: e.target.value
                          ? new Date(e.target.value).toISOString()
                          : null,
                      } as Guest)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 font-quicksand focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-quicksand text-sm font-medium text-gray-700">
                    Prazo RSVP (opcional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formatDateForInput(editGuest.rsvp_deadline)}
                    onChange={(e) =>
                      setEditGuest({
                        ...editGuest,
                        rsvp_deadline: e.target.value
                          ? new Date(e.target.value).toISOString()
                          : null,
                      } as Guest)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 font-quicksand focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleEditGuest}
                  className="flex-1 rounded-lg bg-rose-600 px-4 py-2 font-josefin text-white transition-colors animate-in slide-in-from-right hover:bg-rose-700"
                >
                  Salvar
                </button>
                <button
                  onClick={() => {
                    setEditGuest(null);
                    toggleEditModal(false);
                  }}
                  className="flex-1 rounded-lg bg-gray-300 px-4 py-2 font-josefin text-gray-700 transition-colors animate-in slide-in-from-right hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && guestToDelete && (
        <div className="fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 duration-300 animate-in">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="p-6">
              <h3 className="mb-4 font-josefin text-lg font-semibold text-gray-900">
                Confirmar Exclusão
              </h3>
              <p className="font-quicksand text-sm text-gray-700">
                Tem certeza que deseja excluir <strong>{guestToDelete.nome}</strong>? Esta ação não
                pode ser desfeita.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleDeleteGuest(guestToDelete.id, guestToDelete.nome)}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-josefin text-white transition-colors animate-in slide-in-from-right hover:bg-red-700"
                >
                  Excluir
                </button>
                <button
                  onClick={() => {
                    setGuestToDelete(null);
                    toggleDeleteModal(false);
                  }}
                  className="flex-1 rounded-lg bg-gray-300 px-4 py-2 font-josefin text-gray-700 transition-colors animate-in slide-in-from-right hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTemplateSelector && selectedGuestForEmail && (
        <EmailTemplateSelector
          guestName={selectedGuestForEmail.nome}
          onSend={(templateType: EmailTemplateType, customMessage?: string) =>
            handleSendInvitation(selectedGuestForEmail.id, 'email', templateType, customMessage)
          }
          isLoading={sendingInvitation === selectedGuestForEmail.id}
        />
      )}
    </>
  );
}
