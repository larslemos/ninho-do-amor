// app/components/admin/GuestTable.tsx

'use client';

import type React from 'react';
import {
  Edit,
  Trash2,
  Mail,
  MessageSquare,
  Copy,
  ExternalLink,
} from 'lucide-react';
import Image from 'next/image';

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

interface GuestTableProps {
  guests: Guest[];
  weddingSlug: string | null;
  weddingData: { bride?: string; groom?: string };
  stats: {
    total: number;
    confirmed: number;
    pending: number;
    rejected: number;
    invitationsSent: number;
  };
  getStatusIcon: (status: string) => React.JSX.Element;
  getStatusText: (status: string) => string;
  getPhoneNumber: (guest: Guest) => string;
  handleSendInvitation: (
    guestId: string,
    method: 'email' | 'sms',
    templateType?: string,
    customMessage?: string
  ) => Promise<void>;
  copyGuestUrl: (guest: Guest) => Promise<void>;
  openGuestPage: (guest: Guest) => void;
  handleSendWhatsApp: (guest: Guest) => void;
  sendingInvitation: string | null;
  toggleAddModal: () => void;
  toggleEditModal: () => void;
  toggleDeleteModal: () => void;
  setEditGuest: (guest: Guest | null) => void;
  setGuestToDelete: (guest: { id: string; nome: string } | null) => void;
  setSelectedGuestForEmail: (guest: Guest | null) => void;
  setShowTemplateSelector: (show: boolean) => void;
}

export default function GuestTable({
  guests,
  weddingSlug,
  weddingData,
  stats,
  getStatusIcon,
  getStatusText,
  getPhoneNumber,
  handleSendInvitation,
  copyGuestUrl,
  openGuestPage,
  handleSendWhatsApp,
  sendingInvitation,
  toggleAddModal,
  toggleEditModal,
  toggleDeleteModal,
  setEditGuest,
  setGuestToDelete,
  setSelectedGuestForEmail,
  setShowTemplateSelector,
}: GuestTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-josefin text-xs font-medium uppercase tracking-wider text-gray-500">
                Convidado
              </th>
              <th className="px-6 py-3 text-left font-josefin text-xs font-medium uppercase tracking-wider text-gray-500">
                Contato
              </th>
              <th className="px-6 py-3 text-left font-josefin text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left font-josefin text-xs font-medium uppercase tracking-wider text-gray-500">
                Mesa
              </th>
              <th className="px-6 py-3 text-left font-josefin text-xs font-medium uppercase tracking-wider text-gray-500">
                Convite
              </th>
              <th className="px-6 py-3 text-left font-josefin text-xs font-medium uppercase tracking-wider text-gray-500">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {guests.map((guest) => {
              const phoneNumber = getPhoneNumber(guest);
              return (
                <tr key={guest.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div>
                      <div className="font-quicksand text-sm font-medium text-gray-900">
                        {guest.nome}
                      </div>
                      <div className="font-quicksand text-sm text-gray-500">
                        ID: {guest.unique_url || guest.token}
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="font-quicksand text-sm text-gray-900">
                      {phoneNumber}
                    </div>
                    {guest.email && (
                      <div className="font-quicksand text-sm text-gray-500">
                        {guest.email}
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(guest.status)}
                      <span className="font-quicksand text-sm text-gray-900">
                        {getStatusText(guest.status)}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-quicksand text-sm text-gray-900">
                    {guest.mesa || '-'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      {guest.invitation_sent_at ? (
                        <span className="rounded-full bg-green-100 px-2 py-1 font-quicksand text-xs text-green-800">
                          Enviado
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-2 py-1 font-quicksand text-xs text-gray-800">
                          Não enviado
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <div className="flex gap-1">
                      {phoneNumber && (
                        <button
                          onClick={() => handleSendWhatsApp(guest)}
                          disabled={sendingInvitation === guest.id}
                          className="rounded border border-green-600 p-1.5 text-green-600 duration-300 animate-in slide-in-from-right hover:border-green-900 hover:bg-green-50 hover:text-green-900 disabled:opacity-50"
                          title="Enviar por WhatsApp"
                          aria-label={`Enviar convite por WhatsApp para ${guest.nome}`}
                        >
                          <Image
                            src="/icons/whatsappblue.png"
                            alt="WhatsApp"
                            width={20}
                            height={20}
                            className="h-4 min-h-[16px] w-4 min-w-[16px]"
                          />
                        </button>
                      )}
                      <button
                        onClick={() => copyGuestUrl(guest)}
                        className="rounded border border-blue-600 p-1.5 duration-300 animate-in slide-in-from-right hover:border-blue-900 hover:bg-blue-50"
                        title="Copiar link do convite"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openGuestPage(guest)}
                        className="rounded border border-green-600 p-1.5 duration-300 animate-in slide-in-from-right hover:border-green-900 hover:bg-green-50"
                        title="Abrir página do convidado"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      {guest.email && (
                        <button
                          onClick={() => {
                            setSelectedGuestForEmail(guest);
                            setShowTemplateSelector(true);
                          }}
                          disabled={sendingInvitation === guest.id}
                          className="rounded border border-purple-600 p-1.5 duration-300 animate-in slide-in-from-right hover:border-purple-900 hover:bg-purple-50 disabled:opacity-50"
                          title="Enviar email"
                        >
                          {sendingInvitation === guest.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-purple-600"></div>
                          ) : (
                            <Mail className="h-4 w-4" />
                          )}
                        </button>
                      )}
                      {phoneNumber && (
                        <button
                          onClick={() => handleSendInvitation(guest.id, 'sms')}
                          disabled={sendingInvitation === guest.id}
                          className="rounded border border-orange-600 p-1.5 duration-300 animate-in slide-in-from-right hover:border-orange-900 hover:bg-orange-50 disabled:opacity-50"
                          title="Enviar por SMS"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditGuest({
                            ...guest,
                            telefone: phoneNumber,
                            email: guest.email || '',
                            mesa: guest.mesa || '',
                          });
                          toggleEditModal();
                        }}
                        className="rounded border border-blue-600 p-1.5 duration-300 animate-in slide-in-from-right hover:border-blue-900 hover:bg-blue-50"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setGuestToDelete({ id: guest.id, nome: guest.nome });
                          toggleDeleteModal();
                        }}
                        disabled={sendingInvitation === guest.id}
                        className="rounded border border-red-600 p-1.5 duration-300 animate-in slide-in-from-right hover:border-red-900 hover:bg-red-50 disabled:opacity-50"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
