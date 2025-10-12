'use client';

import type React from 'react';
import { Edit, Trash2, Mail, MessageSquare, Copy, ExternalLink } from 'lucide-react';
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
    stats: { total: number; confirmed: number; pending: number; rejected: number; invitationsSent: number };
    getStatusIcon: (status: string) => JSX.Element;
    getStatusText: (status: string) => string;
    getPhoneNumber: (guest: Guest) => string;
    handleSendInvitation: (guestId: string, method: 'email' | 'sms', templateType?: string, customMessage?: string) => Promise<void>;
    copyGuestUrl: (guest: Guest) => Promise<void>;
    openGuestPage: (guest: Guest) => void;
    handleSendWhatsApp: (guest: Guest) => void;
    sendingInvitation: string | null;
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
}: GuestTableProps) {
    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left font-josefin text-xs font-medium uppercase tracking-wider text-gray-500">Convidado</th>
                            <th className="px-6 py-3 text-left font-josefin text-xs font-medium uppercase tracking-wider text-gray-500">Contato</th>
                            <th className="px-6 py-3 text-left font-josefin text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                            <th className="px-6 py-3 text-left font-josefin text-xs font-medium uppercase tracking-wider text-gray-500">Mesa</th>
                            <th className="px-6 py-3 text-left font-josefin text-xs font-medium uppercase tracking-wider text-gray-500">Convite</th>
                            <th className="px-6 py-3 text-left font-josefin text-xs font-medium uppercase tracking-wider text-gray-500">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {guests.map((guest) => {
                            const phoneNumber = getPhoneNumber(guest);
                            return (
                                <tr key={guest.id} className="hover:bg-gray-50">
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div>
                                            <div className="font-quicksand text-sm font-medium text-gray-900">{guest.nome}</div>
                                            <div className="font-quicksand text-sm text-gray-500">ID: {guest.unique_url || guest.token}</div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="font-quicksand text-sm text-gray-900">{phoneNumber}</div>
                                        {guest.email && <div className="font-quicksand text-sm text-gray-500">{guest.email}</div>}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(guest.status)}
                                            <span className="font-quicksand text-sm text-gray-900">{getStatusText(guest.status)}</span>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 font-quicksand text-sm text-gray-900">{guest.mesa || '-'}</td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {guest.invitation_sent_at ? (
                                                <span className="rounded-full bg-green-100 px-2 py-1 font-quicksand text-xs text-green-800">Enviado</span>
                                            ) : (
                                                <span className="rounded-full bg-gray-100 px-2 py-1 font-quicksand text-xs text-gray-800">Não enviado</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                        <div className="flex gap-1">
                                            {phoneNumber && (
                                                <button
                                                    onClick={() => handleSendWhatsApp(guest)}
                                                    disabled={sendingInvitation === guest.id}
                                                    className="p-1 text-green-600 duration-300 animate-in slide-in-from-right hover:text-green-900 disabled:opacity-50"
                                                    title="Enviar por WhatsApp"
                                                    aria-label={`Enviar convite por WhatsApp para ${guest.nome}`}
                                                >
                                                    <Image src="/icons/whatsappblue.png" alt="WhatsApp" width={24} height={24} className="h-6 w-6" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => copyGuestUrl(guest)}
                                                className="p-1 text-blue-600 duration-300 animate-in slide-in-from-right hover:text-blue-900"
                                                title="Copiar link do convite"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => openGuestPage(guest)}
                                                className="p-1 text-green-600 duration-300 animate-in slide-in-from-right hover:text-green-900"
                                                title="Abrir página do convidado"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </button>
                                            {guest.email && (
                                                <button
                                                    onClick={() => {
                                                        // Placeholder for email modal toggle
                                                    }}
                                                    disabled={sendingInvitation === guest.id}
                                                    className="p-1 text-purple-600 duration-300 animate-in slide-in-from-right hover:text-purple-900 disabled:opacity-50"
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
                                                    className="p-1 text-orange-600 duration-300 animate-in slide-in-from-right hover:text-orange-900 disabled:opacity-50"
                                                    title="Enviar por SMS"
                                                >
                                                    <MessageSquare className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    // Placeholder for edit modal toggle
                                                }}
                                                className="p-1 text-blue-600 duration-300 animate-in slide-in-from-right hover:text-blue-900"
                                                title="Editar"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // Placeholder for delete modal toggle
                                                }}
                                                disabled={sendingInvitation === guest.id}
                                                className="p-1 text-red-600 duration-300 animate-in slide-in-from-right hover:text-red-900 disabled:opacity-50"
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