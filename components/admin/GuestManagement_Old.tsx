// app/components/admin/GuestManagement.tsx

'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Upload,
  Download,
  Search,
  Edit,
  Trash2,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  MessageSquare,
  Copy,
  ExternalLink,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EmailTemplateSelector from './EmailTemplateSelector';
import type { EmailTemplateType } from '@/lib/email-templates';
import { TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { env } from '@/env';
import { WeddingData } from '@/types/wedding';

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
  weddingSlug: string | null; // Update to allow null
  weddingData: WeddingData; // Add weddingData for dynamic names
}

export default function GuestManagement_Old({
  weddingSlug,
  weddingData,
}: GuestManagementProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState<{
    id: string;
    nome: string;
  } | null>(null);
  const [editGuest, setEditGuest] = useState<Guest | null>(null);
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedGuestForEmail, setSelectedGuestForEmail] =
    useState<Guest | null>(null);

  useEffect(() => {
    if (weddingSlug) {
      fetchGuests();
    } else {
      setGuests([]); // Reset guests if no weddingSlug
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
      weddingSlug, // Pass weddingSlug to the API
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
      weddingSlug, // Pass weddingSlug to the API
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
    if (!weddingSlug) return; // Exit if no weddingSlug

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
    templateType: EmailTemplateType = 'wedding-invitation',
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
    const inviteUrl = `${baseUrl}/judyhelder/convidados/${guest.unique_url}`;

    // Simple, clean message that WhatsApp will handle well
    const message = `Olá ${guest.nome}! 😊

Com muito carinho partilhamos o convite para o casamento de Judy & Helder. 👰🏽‍♀️💍🤵🏾‍♂️

Por favor, confirmem a vossa presença seguindo estes passos:

*Passo 1:* Clique no link abaixo para ver o convite completo 💍

*Passo 2:* Na secção "Confirmação de Presença", selecione um dos botões para confirmar ✅ ou recusar ❌

*Link do convite:*
${inviteUrl}

Com carinho,
Os noivos!`;

    // Use wa.me for better compatibility
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedPhone.replace('+', '')}?text=${encodedMessage}`;

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
            weddingSlug, // Pass weddingSlug for upload
          });
        }
      }

      // Batch insert or handle individually
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

  const formatDateForInput = (isoDate?: string) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toISOString().slice(0, 16);
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
      {/* Schema Error Alert */}
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

      {/* Email Info Alert */}
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

      {/* Stats Cards */}
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

      {/* Analytics Quick View */}
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

      {/* Actions Bar */}
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

      {/* Guests Table */}
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
              {filteredGuests.map((guest) => {
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
                            className="p-1 text-green-600 duration-300 animate-in slide-in-from-right hover:text-green-900 disabled:opacity-50"
                            title="Enviar por WhatsApp"
                            aria-label={`Enviar convite por WhatsApp para ${guest.nome}`}
                          >
                            <img
                              src="/icons/whatsappblue.png"
                              alt="WhatsApp"
                              className="h-6 w-6"
                            />
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
                              setSelectedGuestForEmail(guest);
                              setShowTemplateSelector(true);
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
                            onClick={() =>
                              handleSendInvitation(guest.id, 'sms')
                            }
                            disabled={sendingInvitation === guest.id}
                            className="p-1 text-orange-600 duration-300 animate-in slide-in-from-right hover:text-orange-900 disabled:opacity-50"
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
                            setShowEditModal(true);
                          }}
                          className="p-1 text-blue-600 duration-300 animate-in slide-in-from-right hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setGuestToDelete({
                              id: guest.id,
                              nome: guest.nome,
                            });
                            setShowDeleteModal(true);
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

      {/* Add Guest Modal */}
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
                    onChange={(e) =>
                      setNewGuest({ ...newGuest, nome: e.target.value })
                    }
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
                    onChange={(e) =>
                      setNewGuest({ ...newGuest, telefone: e.target.value })
                    }
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
                    onChange={(e) =>
                      setNewGuest({ ...newGuest, email: e.target.value })
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
                    value={newGuest.mesa}
                    onChange={(e) =>
                      setNewGuest({ ...newGuest, mesa: e.target.value })
                    }
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
                    setShowAddModal(false);
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

      {/* Edit Guest Modal */}
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
                      setEditGuest({ ...editGuest, nome: e.target.value })
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
                      setEditGuest({ ...editGuest, telefone: e.target.value })
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
                      setEditGuest({ ...editGuest, email: e.target.value })
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
                      setEditGuest({ ...editGuest, mesa: e.target.value })
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
                        status: e.target.value as
                          | 'pending'
                          | 'confirmed'
                          | 'rejected',
                      })
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
                      })
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
                      })
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
                    setShowEditModal(false);
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && guestToDelete && (
        <div className="fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 duration-300 animate-in">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="p-6">
              <h3 className="mb-4 font-josefin text-lg font-semibold text-gray-900">
                Confirmar Exclusão
              </h3>
              <p className="font-quicksand text-sm text-gray-700">
                Tem certeza que deseja excluir{' '}
                <strong>{guestToDelete.nome}</strong>? Esta ação não pode ser
                desfeita.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() =>
                    handleDeleteGuest(guestToDelete.id, guestToDelete.nome)
                  }
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-josefin text-white transition-colors animate-in slide-in-from-right hover:bg-red-700"
                >
                  Excluir
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setGuestToDelete(null);
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

      {/* Email Template Selector Modal */}
      {showTemplateSelector && selectedGuestForEmail && (
        <EmailTemplateSelector
          guestName={selectedGuestForEmail.nome}
          onSend={(templateType, customMessage) =>
            handleSendInvitation(
              selectedGuestForEmail.id,
              'email',
              templateType,
              customMessage
            )
          }
          isLoading={sendingInvitation === selectedGuestForEmail.id}
        />
      )}
    </div>
  );
}
