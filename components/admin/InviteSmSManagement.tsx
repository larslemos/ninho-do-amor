// // app/components/admin/InviteManagementSmS.tsx

// import type React from 'react';
// import { useState, useEffect } from 'react';
// import {
//     MessageCircle,
//     CheckCircle,
//     XCircle,
//     Send,
//     CheckSquare,
//     Users,
//     Mail,
//     Bell,
//     Smartphone,
//     ArrowUp,
//     ArrowDown,
// } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import { env } from '@/env';

// interface Guest {
//     id: string;
//     nome: string;
//     telefone?: string;
//     phone?: string;
//     telephone?: string;
//     status: 'pending' | 'confirmed' | 'rejected';
//     mesa?: string;
//     unique_url: string;
//     invite_sent_count: number;
//     confirm_sent_count: number;
//     reminder_count: number;
//     whatsapp_delivered_count: number;
//     sms_sent_count: number;
//     sms_delivered_count: number;
//     invitation_sent_at?: string;
//     rsvp_deadline?: string;
// }

// interface InviteManagementSmSProps {
//     weddingSlug: string; // Add prop for weddingSlug
// }

// export default function InviteManagementSmS({
//     weddingSlug,
// }: InviteManagementSmSProps) {
//     const [guests, setGuests] = useState<Guest[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [sendingAction, setSendingAction] = useState<string | null>(null);
//     const [sortColumn, setSortColumn] = useState<
//         keyof Guest | 'whatsapp_click' | 'confirmado'
//     >('id');
//     const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
//     const { toast } = useToast();

//     useEffect(() => {
//         if (weddingSlug) {
//             fetchGuests();
//         }
//     }, [weddingSlug]);

//     const fetchGuests = async () => {
//         try {
//             const response = await fetch(
//                 `/api/admin/guests?weddingSlug=${weddingSlug}`
//             );
//             if (response.ok) {
//                 const data = await response.json();
//                 setGuests(data.guests || []);
//             } else {
//                 const errorData = await response.json();
//                 toast({
//                     variant: 'destructive',
//                     title: 'Erro',
//                     description: errorData.error || 'Erro ao carregar convidados',
//                 });
//             }
//         } catch (error) {
//             console.error('Error fetching guests:', error);
//             toast({
//                 variant: 'destructive',
//                 title: 'Erro',
//                 description: 'Erro ao carregar convidados',
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const filteredGuests = guests.filter((guest) =>
//         guest.nome.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const sortedGuests = [...filteredGuests].sort((a, b) => {
//         let aValue: any;
//         let bValue: any;

//         switch (sortColumn) {
//             case 'id':
//                 aValue = a.id.toLowerCase();
//                 bValue = b.id.toLowerCase();
//                 break;
//             case 'mesa':
//                 aValue = a.mesa || '';
//                 bValue = b.mesa || '';
//                 break;
//             case 'nome':
//                 aValue = a.nome.toLowerCase();
//                 bValue = b.nome.toLowerCase();
//                 break;
//             case 'whatsapp_click':
//                 aValue = a.invite_sent_count > 0 ? 1 : 0;
//                 bValue = b.invite_sent_count > 0 ? 1 : 0;
//                 break;
//             case 'invite_sent_count':
//             case 'whatsapp_delivered_count':
//             case 'sms_sent_count':
//             case 'sms_delivered_count':
//             case 'confirm_sent_count':
//             case 'reminder_count':
//                 aValue = a[sortColumn];
//                 bValue = b[sortColumn];
//                 break;
//             case 'confirmado':
//                 aValue = a.status === 'confirmed' ? 1 : 0;
//                 bValue = b.status === 'confirmed' ? 1 : 0;
//                 break;
//             default:
//                 aValue = a.id.toLowerCase();
//                 bValue = b.id.toLowerCase();
//         }

//         if (aValue === '' || aValue === null)
//             return sortDirection === 'asc' ? 1 : -1;
//         if (bValue === '' || bValue === null)
//             return sortDirection === 'asc' ? -1 : 1;

//         if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
//         if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
//         return 0;
//     });

//     const handleSort = (
//         column: keyof Guest | 'whatsapp_click' | 'confirmado'
//     ) => {
//         if (sortColumn === column) {
//             setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//         } else {
//             setSortColumn(column);
//             setSortDirection('asc');
//         }
//     };

//     const stats = {
//         total: guests.length,
//         whatsappSent: guests.filter((g) => g.invite_sent_count > 0).length,
//         manualConfirmations: guests.filter((g) => g.confirm_sent_count > 0).length,
//         remindersSent: guests.filter((g) => g.reminder_count > 0).length,
//         confirmed: guests.filter((g) => g.status === 'confirmed').length,
//     };

//     const handleInvitationAction = async (guestId: string, action: string) => {
//         setSendingAction(guestId);
//         try {
//             const response = await fetch('/api/admin/invitations', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ guestId, action, weddingSlug }),
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 if (data.whatsappUrl) {
//                     window.open(data.whatsappUrl, '_blank');
//                 }
//                 toast({
//                     variant: 'success',
//                     title: 'Sucesso! 🎉',
//                     description: data.message,
//                 });
//                 await fetchGuests();
//             } else {
//                 toast({
//                     variant: 'destructive',
//                     title: 'Erro',
//                     description: data.error || 'Erro ao processar ação',
//                 });
//             }
//         } catch (error) {
//             console.error('Error processing action:', error);
//             toast({
//                 variant: 'destructive',
//                 title: 'Erro',
//                 description: 'Erro ao processar ação',
//             });
//         } finally {
//             setSendingAction(null);
//         }
//     };

//     const getPhoneNumber = (guest: Guest) => {
//         return guest.telefone || guest.phone || guest.telephone || '';
//     };

//     const getWhatsAppStatus = (guest: Guest) => {
//         return guest.invite_sent_count > 0 ? '✅' : '❌';
//     };

//     const getConfirmSentStatus = (guest: Guest) => {
//         return guest.confirm_sent_count > 0
//             ? `✅ x${guest.confirm_sent_count}`
//             : '❌';
//     };

//     const getConfirmedStatus = (guest: Guest) => {
//         return guest.status === 'confirmed' ? '✅' : '❌';
//     };

//     const getWhatsAppDeliveredStatus = (guest: Guest) => {
//         return guest.whatsapp_delivered_count > 0
//             ? `✅ x${guest.whatsapp_delivered_count}`
//             : '❌';
//     };

//     const getSmsSentStatus = (guest: Guest) => {
//         return guest.sms_sent_count > 0 ? `✅ x${guest.sms_sent_count}` : '❌';
//     };

//     const getSmsDeliveredStatus = (guest: Guest) => {
//         return guest.sms_delivered_count > 0
//             ? `✅ x${guest.sms_delivered_count}`
//             : '❌';
//     };

//     const renderSortIcon = (
//         column: keyof Guest | 'whatsapp_click' | 'confirmado'
//     ) => {
//         if (sortColumn !== column) return null;
//         return sortDirection === 'asc' ? (
//             <ArrowUp className="ml-1 inline h-4 w-4" />
//         ) : (
//             <ArrowDown className="ml-1 inline h-4 w-4" />
//         );
//     };

//     if (loading) {
//         return (
//             <div className="font-montserrat p-6 text-center">
//                 <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-rose-600"></div>
//                 <p>Carregando convidados...</p>
//             </div>
//         );
//     }

//     if (!weddingSlug) {
//         return (
//             <div className="font-montserrat p-6 text-center">
//                 <p className="text-gray-600">
//                     Selecione um casamento para gerenciar os convites.
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <div className="font-montserrat p-6">
//             {/* Stats Cards */}
//             <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
//                 <div className="place-card rounded-lg border border-blue-200 bg-blue-50 p-4">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="font-montserrat text-sm font-medium text-blue-600">
//                                 Total Convidados
//                             </p>
//                             <p className="font-montserrat text-2xl font-bold text-blue-900">
//                                 {stats.total}
//                             </p>
//                         </div>
//                         <Users className="h-8 w-8 text-blue-600" />
//                     </div>
//                 </div>

//                 <div className="place-card rounded-lg border border-green-200 bg-green-50 p-4">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="font-montserrat text-sm font-medium text-green-600">
//                                 Convites WhatsApp
//                             </p>
//                             <p className="font-montserrat text-2xl font-bold text-green-900">
//                                 {stats.whatsappSent}
//                             </p>
//                         </div>
//                         <MessageCircle className="h-8 w-8 text-green-600" />
//                     </div>
//                 </div>

//                 <div className="place-card rounded-lg border border-purple-200 bg-purple-50 p-4">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="font-montserrat text-sm font-medium text-purple-600">
//                                 Confirmações Manuais
//                             </p>
//                             <p className="font-montserrat text-2xl font-bold text-purple-900">
//                                 {stats.manualConfirmations}
//                             </p>
//                         </div>
//                         <CheckSquare className="h-8 w-8 text-purple-600" />
//                     </div>
//                 </div>

//                 <div className="place-card rounded-lg border border-orange-200 bg-orange-50 p-4">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="font-montserrat text-sm font-medium text-orange-600">
//                                 Lembretes Enviados
//                             </p>
//                             <p className="font-montserrat text-2xl font-bold text-orange-900">
//                                 {stats.remindersSent}
//                             </p>
//                         </div>
//                         <Bell className="h-8 w-8 text-orange-600" />
//                     </div>
//                 </div>

//                 <div className="place-card rounded-lg border border-teal-200 bg-teal-50 p-4">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="font-montserrat text-sm font-medium text-teal-600">
//                                 Confirmados
//                             </p>
//                             <p className="font-montserrat text-2xl font-bold text-teal-900">
//                                 {stats.confirmed}
//                             </p>
//                         </div>
//                         <CheckCircle className="h-8 w-8 text-teal-600" />
//                     </div>
//                 </div>
//             </div>

//             {/* Search Bar */}
//             <div className="mb-6">
//                 <div className="relative">
//                     <input
//                         type="text"
//                         placeholder="Buscar convidados..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="font-montserrat w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
//                     />
//                 </div>
//             </div>

//             {/* Invitations Table */}
//             <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
//                 <div className="overflow-x-auto">
//                     <table className="w-full">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th
//                                     className="font-montserrat cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-rose-600"
//                                     onClick={() => handleSort('id')}
//                                 >
//                                     ID Convidado {renderSortIcon('id')}
//                                 </th>
//                                 <th
//                                     className="font-montserrat cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-rose-600"
//                                     onClick={() => handleSort('mesa')}
//                                 >
//                                     Mesa {renderSortIcon('mesa')}
//                                 </th>
//                                 <th
//                                     className="font-montserrat cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-rose-600"
//                                     onClick={() => handleSort('nome')}
//                                 >
//                                     Nome {renderSortIcon('nome')}
//                                 </th>
//                                 <th
//                                     className="font-montserrat cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-rose-600"
//                                     onClick={() => handleSort('whatsapp_click')}
//                                 >
//                                     WhatsApp Click {renderSortIcon('whatsapp_click')}
//                                 </th>
//                                 <th
//                                     className="font-montserrat cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-rose-600"
//                                     onClick={() => handleSort('invite_sent_count')}
//                                 >
//                                     Convite Enviado {renderSortIcon('invite_sent_count')}
//                                 </th>
//                                 <th
//                                     className="font-montserrat cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-rose-600"
//                                     onClick={() => handleSort('whatsapp_delivered_count')}
//                                 >
//                                     WhatsApp Delivered{' '}
//                                     {renderSortIcon('whatsapp_delivered_count')}
//                                 </th>
//                                 <th
//                                     className="font-montserrat cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-rose-600"
//                                     onClick={() => handleSort('sms_sent_count')}
//                                 >
//                                     SMS Sent {renderSortIcon('sms_sent_count')}
//                                 </th>
//                                 <th
//                                     className="font-montserrat cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-rose-600"
//                                     onClick={() => handleSort('sms_delivered_count')}
//                                 >
//                                     SMS Delivered {renderSortIcon('sms_delivered_count')}
//                                 </th>
//                                 <th
//                                     className="font-montserrat cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-rose-600"
//                                     onClick={() => handleSort('confirm_sent_count')}
//                                 >
//                                     Confirmado Enviado {renderSortIcon('confirm_sent_count')}
//                                 </th>
//                                 <th
//                                     className="font-montserrat cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-rose-600"
//                                     onClick={() => handleSort('confirmado')}
//                                 >
//                                     Confirmado {renderSortIcon('confirmado')}
//                                 </th>
//                                 <th
//                                     className="font-montserrat cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-rose-600"
//                                     onClick={() => handleSort('reminder_count')}
//                                 >
//                                     Lembretes {renderSortIcon('reminder_count')}
//                                 </th>
//                                 <th className="font-montserrat px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
//                                     Ações
//                                 </th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200 bg-white">
//                             {sortedGuests.map((guest) => (
//                                 <tr key={guest.id} className="hover:bg-gray-50">
//                                     <td className="font-montserrat whitespace-nowrap px-6 py-4 text-sm text-gray-900">
//                                         {guest.id.slice(0, 8)}…
//                                     </td>
//                                     <td className="font-montserrat whitespace-nowrap px-6 py-4 text-sm text-gray-900">
//                                         {guest.mesa || '-'}
//                                     </td>
//                                     <td className="font-montserrat whitespace-nowrap px-6 py-4 text-sm text-gray-900">
//                                         {guest.nome}
//                                     </td>
//                                     <td className="font-montserrat whitespace-nowrap px-6 py-4 text-sm text-gray-900">
//                                         {getWhatsAppStatus(guest)}
//                                     </td>
//                                     <td className="font-montserrat whitespace-nowrap px-6 py-4 text-sm text-gray-900">
//                                         {guest.invite_sent_count}
//                                     </td>
//                                     <td className="font-montserrat whitespace-nowrap px-6 py-4 text-sm text-gray-900">
//                                         {getWhatsAppDeliveredStatus(guest)}
//                                     </td>
//                                     <td className="font-montserrat whitespace-nowrap px-6 py-4 text-sm text-gray-900">
//                                         {getSmsSentStatus(guest)}
//                                     </td>
//                                     <td className="font-montserrat whitespace-nowrap px-6 py-4 text-sm text-gray-900">
//                                         {getSmsDeliveredStatus(guest)}
//                                     </td>
//                                     <td className="font-montserrat whitespace-nowrap px-6 py-4 text-sm text-gray-900">
//                                         {getConfirmSentStatus(guest)}
//                                     </td>
//                                     <td className="font-montserrat whitespace-nowrap px-6 py-4 text-sm text-gray-900">
//                                         {getConfirmedStatus(guest)}
//                                     </td>
//                                     <td className="font-montserrat whitespace-nowrap px-6 py-4 text-sm text-gray-900">
//                                         {guest.reminder_count}
//                                     </td>
//                                     <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
//                                         <div className="flex gap-1">
//                                             <button
//                                                 onClick={() =>
//                                                     handleInvitationAction(guest.id, 'sendWhatsApp')
//                                                 }
//                                                 disabled={
//                                                     sendingAction === guest.id || !getPhoneNumber(guest)
//                                                 }
//                                                 className="p-1 text-whatsapp-600 duration-300 animate-in slide-in-from-right hover:text-whatsapp-900 disabled:opacity-50"
//                                                 title="Enviar Convite por WhatsApp"
//                                             >
//                                                 <MessageCircle className="h-4 w-4" />
//                                             </button>
//                                             <button
//                                                 onClick={() =>
//                                                     handleInvitationAction(
//                                                         guest.id,
//                                                         'markWhatsAppDelivered'
//                                                     )
//                                                 }
//                                                 disabled={sendingAction === guest.id}
//                                                 className="p-1 text-blue-600 duration-300 animate-in slide-in-from-right hover:text-blue-900 disabled:opacity-50"
//                                                 title="Marcar WhatsApp Entregue"
//                                             >
//                                                 <Smartphone className="h-4 w-4" />
//                                             </button>
//                                             <button
//                                                 onClick={() =>
//                                                     handleInvitationAction(guest.id, 'markSmsSent')
//                                                 }
//                                                 disabled={sendingAction === guest.id}
//                                                 className="p-1 text-orange-600 duration-300 animate-in slide-in-from-right hover:text-orange-900 disabled:opacity-50"
//                                                 title="Marcar SMS Enviado"
//                                             >
//                                                 <Send className="h-4 w-4" />
//                                             </button>
//                                             <button
//                                                 onClick={() =>
//                                                     handleInvitationAction(guest.id, 'markSmsDelivered')
//                                                 }
//                                                 disabled={sendingAction === guest.id}
//                                                 className="p-1 text-green-600 duration-300 animate-in slide-in-from-right hover:text-green-900 disabled:opacity-50"
//                                                 title="Marcar SMS Entregue"
//                                             >
//                                                 <CheckCircle className="h-4 w-4" />
//                                             </button>
//                                             <button
//                                                 onClick={() =>
//                                                     handleInvitationAction(guest.id, 'markAsSent')
//                                                 }
//                                                 disabled={sendingAction === guest.id}
//                                                 className="p-1 text-blue-600 duration-300 animate-in slide-in-from-right hover:text-blue-900 disabled:opacity-50"
//                                                 title="Marcar como Enviado"
//                                             >
//                                                 <CheckSquare className="h-4 w-4" />
//                                             </button>
//                                             <button
//                                                 onClick={() =>
//                                                     handleInvitationAction(guest.id, 'sendReminder')
//                                                 }
//                                                 disabled={
//                                                     sendingAction === guest.id || !getPhoneNumber(guest)
//                                                 }
//                                                 className="p-1 text-orange-600 duration-300 animate-in slide-in-from-right hover:text-orange-900 disabled:opacity-50"
//                                                 title="Enviar Lembrete"
//                                             >
//                                                 <Send className="h-4 w-4" />
//                                             </button>
//                                             <button
//                                                 onClick={() =>
//                                                     handleInvitationAction(guest.id, 'confirm')
//                                                 }
//                                                 disabled={
//                                                     sendingAction === guest.id ||
//                                                     guest.status === 'confirmed'
//                                                 }
//                                                 className="p-1 text-green-600 duration-300 animate-in slide-in-from-right hover:text-green-900 disabled:opacity-50"
//                                                 title="Confirmar Presença"
//                                             >
//                                                 <CheckCircle className="h-4 w-4" />
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// }
