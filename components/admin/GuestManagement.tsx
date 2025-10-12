// app/admin/[wedding]/GuestManagement.tsx

'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
    Plus,
    Upload,
    Download,
    Search,
    Users,
    CheckCircle,
    XCircle,
    Clock,
    Mail,
    AlertTriangle,
    Info,
    BarChart3,
    PieChart,
    TrendingUp,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { env } from '@/env';
import { WeddingData } from '@/types/wedding';
import GuestTable from './GuestTable';
import GuestModals from './GuestModals';
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

interface GuestManagementProps {
    weddingSlug: string | null;
    weddingData: WeddingData;
}

export default function GuestManagement({
    weddingSlug,
    weddingData,
}: GuestManagementProps) {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [newGuest, setNewGuest] = useState({
        nome: '',
        telefone: '',
        email: '',
        mesa: '',
    });
    const [sendingInvitation, setSendingInvitation] = useState<string | null>(
        null
    );
    const [schemaError, setSchemaError] = useState<string | null>(null);
    const [emailInfo, setEmailInfo] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editGuest, setEditGuest] = useState<Guest | null>(null);
    const [guestToDelete, setGuestToDelete] = useState<{
        id: string;
        nome: string;
    } | null>(null);
    const [selectedGuestForEmail, setSelectedGuestForEmail] =
        useState<Guest | null>(null);
    const [showTemplateSelector, setShowTemplateSelector] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (weddingSlug) {
            fetchGuests();
        } else {
            setGuests([]);
            setLoading(false);
        }
        setEmailInfo(
            'Emails são enviados usando o domínio padrão do Resend (onboarding@resend.dev)'
        );
    }, [weddingSlug]);

    const fetchGuests = async () => {
        if (!weddingSlug) return;
        try {
            const response = await fetch(
                `/api/admin/guests?weddingSlug=${weddingSlug}`
            );
            if (response.ok) {
                const data = await response.json();
                setGuests(data.guests || []);
                setSchemaError(null);
            } else {
                const errorData = await response.json();
                if (errorData.error?.includes('telefone')) {
                    setSchemaError(
                        'Base de dados precisa ser atualizada. Execute a migração SQL.'
                    );
                }
            }
        } catch (error) {
            console.error('Error fetching guests:', error);
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Erro ao carregar convidados',
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredGuests = guests.filter((guest) => {
        const phoneNumber = guest.telefone || guest.phone || guest.telephone || '';
        return (
            guest.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            phoneNumber.includes(searchTerm) ||
            guest.status.includes(searchTerm.toLowerCase()) ||
            (guest.email &&
                guest.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    const stats = {
        total: guests.length,
        confirmed: guests.filter((g) => g.status === 'confirmed').length,
        pending: guests.filter((g) => g.status === 'pending').length,
        rejected: guests.filter((g) => g.status === 'rejected').length,
        invitationsSent: guests.filter((g) => g.invitation_sent_at).length,
    };

    const generateUniqueUrl = (nome: string) => {
        const randomId = Math.random().toString(36).substring(2, 10);
        const nameSlug = nome
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        return `${randomId}-${nameSlug}`;
    };

    const handleAddGuest = async () => {
        if (!newGuest.nome.trim() || !newGuest.telefone.trim() || !weddingSlug) {
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Nome, telefone e wedding slug são obrigatórios',
            });
            return;
        }

        const guestData = {
            nome: newGuest.nome.trim(),
            telefone: newGuest.telefone.trim(),
            email: newGuest.email.trim() || null,
            mesa: newGuest.mesa.trim() || null,
            unique_url: generateUniqueUrl(newGuest.nome),
            rsvp_deadline: '2025-11-05T23:59:59Z',
            weddingSlug,
        };

        try {
            const response = await fetch('/api/admin/guests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(guestData),
            });

            const data = await response.json();

            if (response.ok) {
                await fetchGuests();
                setNewGuest({ nome: '', telefone: '', email: '', mesa: '' });
                setShowAddModal(false);
                toast({
                    variant: 'success',
                    title: 'Sucesso! 🎉',
                    description: 'Convidado adicionado com sucesso',
                });
            } else {
                if (data.error?.includes('base de dados')) {
                    setSchemaError(data.error);
                    toast({
                        variant: 'destructive',
                        title: 'Erro de Base de Dados',
                        description:
                            'Execute a migração SQL para corrigir a estrutura da base de dados',
                    });
                } else {
                    toast({
                        variant: 'destructive',
                        title: 'Erro',
                        description: data.error || 'Erro ao adicionar convidado',
                    });
                }
            }
        } catch (error) {
            console.error('Error adding guest:', error);
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Erro ao adicionar convidado',
            });
        }
    };

    const handleEditGuest = async () => {
        if (!editGuest || !editGuest.nome.trim() || !editGuest.telefone?.trim()) {
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Nome e telefone são obrigatórios',
            });
            return;
        }

        const guestData = {
            guestId: editGuest.id,
            nome: editGuest.nome.trim(),
            telefone: editGuest.telefone.trim(),
            email: editGuest.email?.trim() || null,
            mesa: editGuest.mesa?.trim() || null,
            status: editGuest.status,
            invitation_sent_at: editGuest.invitation_sent_at || null,
            rsvp_deadline: editGuest.rsvp_deadline || null,
            weddingSlug,
        };

        try {
            const response = await fetch('/api/admin/guests', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(guestData),
            });

            const data = await response.json();

            if (response.ok) {
                await fetchGuests();
                setEditGuest(null);
                setShowEditModal(false);
                toast({
                    variant: 'success',
                    title: 'Sucesso! ✏️',
                    description: 'Convidado atualizado com sucesso',
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Erro',
                    description: data.error || 'Erro ao atualizar convidado',
                });
            }
        } catch (error) {
            console.error('Error updating guest:', error);
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Erro ao atualizar convidado',
            });
        }
    };

    const handleDeleteGuest = async (guestId: string, guestName: string) => {
        if (!weddingSlug) return;

        try {
            const response = await fetch('/api/admin/guests', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guestId, weddingSlug }),
            });

            if (response.ok) {
                await fetchGuests();
                toast({
                    variant: 'success',
                    title: 'Sucesso! 🗑️',
                    description: `Convidado ${guestName} excluído com sucesso`,
                });
            } else {
                const data = await response.json();
                toast({
                    variant: 'destructive',
                    title: 'Erro',
                    description: data.error || 'Erro ao excluir convidado',
                });
            }
        } catch (error) {
            console.error('Error deleting guest:', error);
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Erro ao excluir convidado',
            });
        } finally {
            setShowDeleteModal(false);
            setGuestToDelete(null);
        }
    };

    const handleSendInvitation = async (
        guestId: string,
        method: 'email' | 'sms',
        templateType: string = 'wedding-invitation',
        customMessage?: string
    ) => {
        setSendingInvitation(guestId);
        try {
            const response = await fetch('/api/guests/send-invitation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guestId, method, templateType, customMessage }),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    variant: 'success',
                    title: 'Enviado! 💌',
                    description: `${data.template_used === 'wedding-invitation' ? 'Convite' : 'Mensagem'} enviado com sucesso!`,
                });
                await fetchGuests();
                setShowTemplateSelector(false);
                setSelectedGuestForEmail(null);
            } else {
                let errorMessage = data.error || 'Erro ao enviar notificação';
                if (data.details) {
                    errorMessage += ` (${data.details})`;
                }
                toast({
                    variant: 'destructive',
                    title: 'Erro ao Enviar',
                    description: errorMessage,
                });
            }
        } catch (error) {
            console.error('Error sending invitation:', error);
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Erro ao enviar notificação',
            });
        } finally {
            setSendingInvitation(null);
        }
    };

    const copyGuestUrl = async (guest: Guest) => {
        const baseUrl = env.NEXT_PUBLIC_BASE_URL || 'https://pingdigital.online';
        const guestUrl = `${baseUrl}/${weddingSlug}/convidados/${guest.unique_url || guest.token}`;

        try {
            await navigator.clipboard.writeText(guestUrl);
            toast({
                variant: 'success',
                title: 'Link Copiado! 📋',
                description: 'Link do convite copiado para a área de transferência',
            });
        } catch (error) {
            console.error('Failed to copy:', error);
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Erro ao copiar link',
            });
        }
    };

    const openGuestPage = (guest: Guest) => {
        const baseUrl = env.NEXT_PUBLIC_BASE_URL || 'https://pingdigital.online';
        const guestUrl = `${baseUrl}/${weddingSlug}/convidados/${guest.unique_url || guest.token}`;
        window.open(guestUrl, '_blank');
    };

    const handleSendWhatsApp = (guest: Guest) => {
        const phoneNumber = getPhoneNumber(guest);
        if (!phoneNumber) {
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Número de telefone não disponível para este convidado',
            });
            return;
        }

        // Format phone number
        const formattedPhone = phoneNumber
            .replace(/[\s()-]/g, '')
            .replace(/^(\+?)/, '+');

        if (!/^\+\d{9,15}$/.test(formattedPhone)) {
            toast({
                variant: 'destructive',
                title: 'Erro',
                description:
                    'Número de telefone inválido. Verifique o formato (ex: +258841234567)',
            });
            return;
        }

        const baseUrl = env.NEXT_PUBLIC_BASE_URL || 'https://pingdigital.online';
        // Fix: Use weddingSlug instead of hardcoded 'judyhelder' and remove double slash
        const inviteUrl = `${baseUrl}/${weddingSlug}/convidados/${guest.unique_url}`;

        // Simple message with working emojis
        const message = `Olá ${guest.nome}! 🎉

Com muito carinho partilhamos o convite para o casamento de Judy & Helder. 💑💍

Por favor, confirmem a vossa presença seguindo estes passos:

*Passo 1:* Clique no link abaixo para ver o convite completo 👇

*Passo 2:* Na secção "Confirmação de Presença", selecione um dos botões para confirmar ✅ ou recusar ❌

*Link do convite:*
${inviteUrl}

Com carinho,
Os noivos! 💕`;

        // Use wa.me for better compatibility
        const phoneWithoutPlus = formattedPhone.replace('+', '');
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneWithoutPlus}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');

        toast({
            variant: 'success',
            title: 'WhatsApp Aberto! 📱',
            description: 'Mensagem de convite preparada no WhatsApp',
        });
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            const lines = content.split('\n');
            const newGuests: any[] = [];

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const [nome, telefone, email, mesa] = line
                    .split(',')
                    .map((s) => s.trim());
                if (nome && telefone) {
                    newGuests.push({
                        nome,
                        telefone,
                        email: email || null,
                        mesa: mesa || null,
                        unique_url: generateUniqueUrl(nome),
                        rsvp_deadline: '2025-08-25T23:59:59Z',
                        weddingSlug,
                    });
                }
            }

            newGuests.forEach(async (guest) => {
                try {
                    const response = await fetch('/api/admin/guests', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(guest),
                    });
                    if (response.ok) await fetchGuests();
                } catch (error) {
                    console.error('Error uploading guest:', error);
                }
            });

            toast({
                variant: 'success',
                title: 'Upload Processado! 📊',
                description: `${newGuests.length} convidados identificados no arquivo`,
            });
        };

        reader.readAsText(file);
        event.target.value = '';
    };

    const exportToCSV = () => {
        const csvContent = [
            'Nome,Telefone,Email,Status,Mesa,URL Única,Convite Enviado,Data de Criação',
            ...guests.map((guest) => {
                const phoneNumber =
                    guest.telefone || guest.phone || guest.telephone || '';
                return [
                    guest.nome,
                    phoneNumber,
                    guest.email || '',
                    guest.status,
                    guest.mesa || '',
                    guest.unique_url || '',
                    guest.invitation_sent_at ? 'Sim' : 'Não',
                    guest.created_at,
                ].join(',');
            }),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'convidados.csv';
        a.click();
        window.URL.revokeObjectURL(url);

        toast({
            variant: 'success',
            title: 'Exportado! 📥',
            description: 'Lista de convidados exportada com sucesso',
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'rejected':
                return <XCircle className="h-4 w-4 text-red-600" />;
            default:
                return <Clock className="h-4 w-4 text-yellow-600" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'Confirmado';
            case 'rejected':
                return 'Rejeitado';
            default:
                return 'Pendente';
        }
    };

    const getPhoneNumber = (guest: Guest) => {
        return guest.telefone || guest.phone || guest.telephone || '';
    };

    if (loading) {
        return (
            <div className="p-6 text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-rose-600"></div>
                <p>Carregando convidados...</p>
            </div>
        );
    }

    if (!weddingSlug) {
        return (
            <div className="p-6 text-center">
                <p className="text-gray-600">
                    Selecione um casamento para gerenciar os convidados.
                </p>
            </div>
        );
    }

    return (
        <div className="p-6">
            {schemaError && (
                <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <div className="flex items-center gap-2 text-yellow-800">
                        <AlertTriangle className="h-5 w-5" />
                        <div>
                            <h3 className="font-semibold">
                                Atenção: Base de Dados Precisa ser Atualizada
                            </h3>
                            <p className="mt-1 text-sm">{schemaError}</p>
                            <p className="mt-2 text-sm">
                                Execute o script SQL <code>fix-guest-schema.sql</code> para
                                adicionar a coluna telefone.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {emailInfo && (
                <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-center gap-2 text-blue-800">
                        <Info className="h-5 w-5" />
                        <div>
                            <h3 className="font-semibold">
                                Informação sobre Envio de Emails
                            </h3>
                            <p className="mt-1 text-sm">{emailInfo}</p>
                            <p className="mt-2 text-sm">
                                Para usar um domínio personalizado, configure-o no painel do
                                Resend e atualize o código.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600">Total</p>
                            <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                        </div>
                        <Users className="h-8 w-8 text-blue-600" />
                    </div>
                </div>
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-600">Confirmados</p>
                            <p className="text-2xl font-bold text-green-900">
                                {stats.confirmed}
                            </p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                </div>
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-yellow-600">Pendentes</p>
                            <p className="text-2xl font-bold text-yellow-900">
                                {stats.pending}
                            </p>
                        </div>
                        <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-red-600">Rejeitados</p>
                            <p className="text-2xl font-bold text-red-900">
                                {stats.rejected}
                            </p>
                        </div>
                        <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                </div>
                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-600">
                                Convites Enviados
                            </p>
                            <p className="text-2xl font-bold text-purple-900">
                                {stats.invitationsSent}
                            </p>
                        </div>
                        <Mail className="h-8 w-8 text-purple-600" />
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                            <BarChart3 className="h-5 w-5 text-rose-600" />
                            Analytics Rápido
                        </h2>
                        <button className="text-sm font-medium text-rose-600 hover:text-rose-700">
                            Ver Relatório Completo
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-lg bg-blue-50 p-4 text-center">
                            <TrendingUp className="mx-auto mb-2 h-8 w-8 text-blue-600" />
                            <div className="text-2xl font-bold text-blue-900">
                                {stats.total > 0
                                    ? Math.round((stats.confirmed / stats.total) * 100)
                                    : 0}
                                %
                            </div>
                            <div className="text-sm text-blue-700">Taxa de Confirmação</div>
                        </div>
                        <div className="rounded-lg bg-green-50 p-4 text-center">
                            <PieChart className="mx-auto mb-2 h-8 w-8 text-green-600" />
                            <div className="text-2xl font-bold text-green-900">3.2</div>
                            <div className="text-sm text-green-700">
                                Dias Médios de Resposta
                            </div>
                        </div>
                        <div className="rounded-lg bg-purple-50 p-4 text-center">
                            <BarChart3 className="mx-auto mb-2 h-8 w-8 text-purple-600" />
                            <div className="text-2xl font-bold text-purple-900">
                                {stats.total > 0
                                    ? Math.round((stats.invitationsSent / stats.total) * 100)
                                    : 0}
                                %
                            </div>
                            <div className="text-sm text-purple-700">Convites Enviados</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar convidados..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 font-quicksand focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowAddModal(true)}
                        disabled={!!schemaError}
                        className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 font-josefin text-white transition-colors hover:bg-rose-700 disabled:bg-gray-400"
                    >
                        <Plus className="h-4 w-4" />
                        Adicionar
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={!!schemaError}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-josefin text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        <Upload className="h-4 w-4" />
                        Upload Excel
                    </button>
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-josefin text-white transition-colors hover:bg-green-700"
                    >
                        <Download className="h-4 w-4" />
                        Exportar
                    </button>
                </div>
            </div>

            <GuestTable
                guests={filteredGuests}
                weddingSlug={weddingSlug}
                weddingData={weddingData}
                stats={stats}
                getStatusIcon={getStatusIcon}
                getStatusText={getStatusText}
                getPhoneNumber={getPhoneNumber}
                handleSendInvitation={handleSendInvitation}
                copyGuestUrl={copyGuestUrl}
                openGuestPage={openGuestPage}
                handleSendWhatsApp={handleSendWhatsApp}
                sendingInvitation={sendingInvitation}
                toggleAddModal={() => setShowAddModal(true)}
                toggleEditModal={() => setShowEditModal(true)}
                toggleDeleteModal={() => setShowDeleteModal(true)}
                setEditGuest={setEditGuest}
                setGuestToDelete={setGuestToDelete}
                setSelectedGuestForEmail={setSelectedGuestForEmail}
                setShowTemplateSelector={setShowTemplateSelector}
            />

            <GuestModals
                weddingSlug={weddingSlug}
                weddingData={weddingData}
                guests={guests}
                newGuest={newGuest}
                setNewGuest={setNewGuest}
                editGuest={editGuest}
                setEditGuest={setEditGuest}
                guestToDelete={guestToDelete}
                setGuestToDelete={setGuestToDelete}
                showAddModal={showAddModal}
                showEditModal={showEditModal}
                showDeleteModal={showDeleteModal}
                setShowAddModal={setShowAddModal}
                setShowEditModal={setShowEditModal}
                setShowDeleteModal={setShowDeleteModal}
                handleAddGuest={handleAddGuest}
                handleEditGuest={handleEditGuest}
                handleDeleteGuest={handleDeleteGuest}
                selectedGuestForEmail={selectedGuestForEmail}
                setSelectedGuestForEmail={setSelectedGuestForEmail}
                showTemplateSelector={showTemplateSelector}
                setShowTemplateSelector={setShowTemplateSelector}
                sendingInvitation={sendingInvitation}
                fetchGuests={fetchGuests}
                toast={toast}
            />
        </div>
    );
}
