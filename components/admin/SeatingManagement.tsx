// app/components/admin/SeatingManagement.tsx

'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Users, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Table {
  id: string;
  name: string;
  capacity: number;
}

interface Guest {
  id: string;
  nome: string;
  mesa?: string;
  companions?: number;
}

export default function SeatingManagement() {
  const [tables, setTables] = useState<Table[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [showAssignGuestModal, setShowAssignGuestModal] = useState(false);
  const [newTable, setNewTable] = useState({ name: '', capacity: '' });
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedGuestId, setSelectedGuestId] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchTables();
    fetchGuests();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await fetch('/api/admin/tables');
      if (response.ok) {
        const data = await response.json();
        setTables(data.tables || []);
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Erro ao carregar mesas',
        });
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao carregar mesas',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGuests = async () => {
    try {
      const response = await fetch('/api/admin/guests');
      if (response.ok) {
        const data = await response.json();
        setGuests(data.guests || []);
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Erro ao carregar convidados',
        });
      }
    } catch (error) {
      console.error('Error fetching guests:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao carregar convidados',
      });
    }
  };

  const handleGenerateTables = async () => {
    try {
      const response = await fetch('/api/admin/tables/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setTables(data.tables || []);
        toast({
          variant: 'success',
          title: 'Sucesso! 🎉',
          description: data.message || 'Mesas geradas com sucesso',
        });
      } else {
        const data = await response.json();
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: data.error || 'Erro ao gerar mesas',
        });
      }
    } catch (error) {
      console.error('Error generating tables:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao gerar mesas',
      });
    }
  };

  const handleAddTable = async () => {
    if (
      !newTable.name.trim() ||
      !newTable.capacity ||
      parseInt(newTable.capacity) <= 0
    ) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Nome e capacidade (maior que 0) são obrigatórios',
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTable.name.trim(),
          capacity: parseInt(newTable.capacity),
        }),
      });

      if (response.ok) {
        await fetchTables();
        setNewTable({ name: '', capacity: '' });
        setShowAddTableModal(false);
        toast({
          variant: 'success',
          title: 'Sucesso! 🎉',
          description: 'Mesa adicionada com sucesso',
        });
      } else {
        const data = await response.json();
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: data.error || 'Erro ao adicionar mesa',
        });
      }
    } catch (error) {
      console.error('Error adding table:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao adicionar mesa',
      });
    }
  };

  const handleDeleteTable = async (tableId: string, tableName: string) => {
    try {
      const response = await fetch('/api/admin/tables', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId }),
      });

      if (response.ok) {
        await fetchTables();
        await fetchGuests();
        toast({
          variant: 'success',
          title: 'Sucesso! 🗑️',
          description: `Mesa ${tableName} excluída com sucesso`,
        });
      } else {
        const data = await response.json();
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: data.error || 'Erro ao excluir mesa',
        });
      }
    } catch (error) {
      console.error('Error deleting table:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao excluir mesa',
      });
    }
  };

  const handleAssignGuest = async () => {
    if (!selectedTable || !selectedGuestId) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Selecione uma mesa e um convidado',
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/guests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId: selectedGuestId,
          mesa: selectedTable.id,
        }),
      });

      if (response.ok) {
        await fetchGuests();
        setShowAssignGuestModal(false);
        setSelectedGuestId('');
        setSelectedTable(null);
        toast({
          variant: 'success',
          title: 'Sucesso! 🎉',
          description: 'Convidado atribuído à mesa com sucesso',
        });
      } else {
        const data = await response.json();
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: data.error || 'Erro ao atribuir convidado',
        });
      }
    } catch (error) {
      console.error('Error assigning guest:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao atribuir convidado',
      });
    }
  };

  const handleUnassignGuest = async (guestId: string, guestName: string) => {
    try {
      const response = await fetch('/api/admin/guests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestId, mesa: null }),
      });

      if (response.ok) {
        await fetchGuests();
        toast({
          variant: 'success',
          title: 'Sucesso! 🎉',
          description: `Convidado ${guestName} removido da mesa`,
        });
      } else {
        const data = await response.json();
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: data.error || 'Erro ao remover convidado da mesa',
        });
      }
    } catch (error) {
      console.error('Error unassigning guest:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao remover convidado da mesa',
      });
    }
  };

  const getAssignedGuests = (tableId: string) => {
    return guests.filter((guest) => guest.mesa === tableId);
  };

  const getAvailableSeats = (table: Table) => {
    const assigned = getAssignedGuests(table.id).reduce(
      (sum, guest) => sum + 1 + (guest.companions || 0),
      0
    );
    return table.capacity - assigned;
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-rose-600"></div>
        <p>Carregando mesas...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-josefin text-sm font-medium text-blue-600">
                Total de Mesas
              </p>
              <p className="font-quicksand text-2xl font-bold text-blue-900">
                {tables.length}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-josefin text-sm font-medium text-green-600">
                Lugares Ocupados
              </p>
              <p className="font-quicksand text-2xl font-bold text-green-900">
                {guests.reduce(
                  (sum, g) => sum + (g.mesa ? 1 + (g.companions || 0) : 0),
                  0
                )}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-josefin text-sm font-medium text-yellow-600">
                Lugares Disponíveis
              </p>
              <p className="font-quicksand text-2xl font-bold text-yellow-900">
                {tables.reduce(
                  (sum, table) => sum + getAvailableSeats(table),
                  0
                )}
              </p>
            </div>
            <Users className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="mb-6 flex justify-end gap-2">
        <button
          onClick={handleGenerateTables}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-josefin text-white transition-colors animate-in slide-in-from-right hover:bg-blue-700"
        >
          <Users className="h-4 w-4" />
          Gerar Mesas
        </button>
        <button
          onClick={() => setShowAddTableModal(true)}
          className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 font-josefin text-white transition-colors animate-in slide-in-from-right hover:bg-rose-700"
        >
          <Plus className="h-4 w-4" />
          Adicionar Mesa
        </button>
      </div>

      {/* Tables List */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-josefin text-xs font-medium uppercase tracking-wider text-gray-500">
                  Mesa
                </th>
                <th className="px-6 py-3 text-left font-josefin text-xs font-medium uppercase tracking-wider text-gray-500">
                  Capacidade
                </th>
                <th className="px-6 py-3 text-left font-josefin text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ocupados
                </th>
                <th className="px-6 py-3 text-left font-josefin text-xs font-medium uppercase tracking-wider text-gray-500">
                  Disponíveis
                </th>
                <th className="px-6 py-3 text-left font-josefin text-xs font-medium uppercase tracking-wider text-gray-500">
                  Convidados
                </th>
                <th className="px-6 py-3 text-left font-josefin text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {tables.map((table) => {
                const assignedGuests = getAssignedGuests(table.id);
                return (
                  <tr key={table.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 font-quicksand text-sm text-gray-900">
                      {table.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-quicksand text-sm text-gray-900">
                      {table.capacity}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-quicksand text-sm text-gray-900">
                      {assignedGuests.reduce(
                        (sum, guest) => sum + 1 + (guest.companions || 0),
                        0
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-quicksand text-sm text-gray-900">
                      {getAvailableSeats(table)}
                    </td>
                    <td className="px-6 py-4 font-quicksand text-sm text-gray-900">
                      {assignedGuests.length > 0 ? (
                        <ul className="list-disc pl-5">
                          {assignedGuests.map((guest) => (
                            <li
                              key={guest.id}
                              className="flex items-center gap-2"
                            >
                              {guest.nome}{' '}
                              {guest.companions ? `(+${guest.companions})` : ''}
                              <button
                                onClick={() =>
                                  handleUnassignGuest(guest.id, guest.nome)
                                }
                                className="text-red-600 hover:text-red-900"
                                title="Remover da mesa"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        'Nenhum convidado atribuído'
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setSelectedTable(table);
                            setShowAssignGuestModal(true);
                          }}
                          disabled={getAvailableSeats(table) === 0}
                          className="p-1 text-blue-600 duration-300 animate-in slide-in-from-right hover:text-blue-900 disabled:opacity-50"
                          title="Atribuir convidado"
                        >
                          <Users className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteTable(table.id, table.name)
                          }
                          className="p-1 text-red-600 duration-300 animate-in slide-in-from-right hover:text-red-900"
                          title="Excluir mesa"
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

      {/* Add Table Modal */}
      {showAddTableModal && (
        <div className="fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 duration-300 animate-in">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="p-6">
              <h3 className="mb-4 font-josefin text-lg font-semibold text-gray-900">
                Adicionar Nova Mesa
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block font-quicksand text-sm font-medium text-gray-700">
                    Nome da Mesa
                  </label>
                  <input
                    type="text"
                    value={newTable.name}
                    onChange={(e) =>
                      setNewTable({ ...newTable, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 font-quicksand focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                    placeholder="Ex: Mesa 1"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-quicksand text-sm font-medium text-gray-700">
                    Capacidade
                  </label>
                  <input
                    type="number"
                    value={newTable.capacity}
                    onChange={(e) =>
                      setNewTable({ ...newTable, capacity: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 font-quicksand focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                    placeholder="Ex: 8"
                    min="1"
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleAddTable}
                  className="flex-1 rounded-lg bg-rose-600 px-4 py-2 font-josefin text-white transition-colors animate-in slide-in-from-right hover:bg-rose-700"
                >
                  Adicionar
                </button>
                <button
                  onClick={() => setShowAddTableModal(false)}
                  className="flex-1 rounded-lg bg-gray-300 px-4 py-2 font-josefin text-gray-700 transition-colors animate-in slide-in-from-right hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Guest Modal */}
      {showAssignGuestModal && selectedTable && (
        <div className="fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 duration-300 animate-in">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="p-6">
              <h3 className="mb-4 font-josefin text-lg font-semibold text-gray-900">
                Atribuir Convidado à {selectedTable.name}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block font-quicksand text-sm font-medium text-gray-700">
                    Convidado
                  </label>
                  <select
                    value={selectedGuestId}
                    onChange={(e) => setSelectedGuestId(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 font-quicksand focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">Selecione um convidado</option>
                    {guests
                      .filter(
                        (guest) => !guest.mesa && guest.status === 'confirmed'
                      )
                      .map((guest) => (
                        <option key={guest.id} value={guest.id}>
                          {guest.nome}{' '}
                          {guest.companions ? `(+${guest.companions})` : ''}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleAssignGuest}
                  disabled={!selectedGuestId}
                  className="flex-1 rounded-lg bg-rose-600 px-4 py-2 font-josefin text-white transition-colors animate-in slide-in-from-right hover:bg-rose-700 disabled:bg-gray-400"
                >
                  Atribuir
                </button>
                <button
                  onClick={() => {
                    setShowAssignGuestModal(false);
                    setSelectedGuestId('');
                    setSelectedTable(null);
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
    </div>
  );
}
