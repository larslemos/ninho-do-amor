// app/components/admin/SeatingManagement.tsx

'use client';

import { useState, useEffect } from 'react';
import { Heart, Waves, Sun, Users, Trash2, XCircle, Plus } from 'lucide-react';
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
  status?: string;
}

export default function SeatingManagement() {
  const [tables, setTables] = useState<Table[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [showAssignGuestModal, setShowAssignGuestModal] = useState(false);
  const [showGenerateTablesModal, setShowGenerateTablesModal] = useState(false);
  const [newTable, setNewTable] = useState({ name: '', capacity: '' });
  const [generateTablesConfig, setGenerateTablesConfig] = useState({
    count: '10',
    capacity: '8',
  });
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedGuestId, setSelectedGuestId] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchTables(), fetchGuests()]);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Erro ao carregar dados. Tente novamente.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await fetch('/api/admin/tables', {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        if (!data.tables || !Array.isArray(data.tables)) {
          throw new Error('Invalid tables data');
        }
        setTables(data.tables);
        return data.tables;
      } else {
        const data = await response.json();
        throw new Error(data.error || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: `Erro ao carregar mesas: ${error.message}`,
      });
      setTables([]);
      return [];
    }
  };

  const fetchGuests = async () => {
    try {
      const response = await fetch('/api/admin/guests', {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        if (!data.guests || !Array.isArray(data.guests)) {
          throw new Error('Invalid guests data');
        }
        // Clean up invalid mesa references
        const validTableIds = new Set(tables.map((t) => t.id));
        const cleanedGuests = data.guests.map((guest) => ({
          ...guest,
          mesa: validTableIds.has(guest.mesa) ? guest.mesa : null,
        }));
        setGuests(cleanedGuests);
        return cleanedGuests;
      } else {
        const data = await response.json();
        throw new Error(data.error || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching guests:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: `Erro ao carregar convidados: ${error.message}`,
      });
      setGuests([]);
      return [];
    }
  };

  const handleGenerateTables = async () => {
    const count = parseInt(generateTablesConfig.count);
    const capacity = parseInt(generateTablesConfig.capacity);
    if (!count || !capacity || count <= 0 || capacity <= 0) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Insira um número válido de mesas e capacidade (maior que 0).',
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/tables/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count, capacity }),
      });

      if (response.ok) {
        const data = await response.json();
        setTables(data.tables || []);
        setShowGenerateTablesModal(false);
        setGenerateTablesConfig({ count: '10', capacity: '8' });
        toast({
          variant: 'success',
          title: 'Sucesso! 🎉',
          description: data.message || 'Mesas geradas com sucesso',
        });
      } else {
        const data = await response.json();
        throw new Error(data.error || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error generating tables:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: `Erro ao gerar mesas: ${error.message}`,
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

    const optimisticTable = {
      id: `temp-${Date.now()}`,
      name: newTable.name.trim(),
      capacity: parseInt(newTable.capacity),
    };

    setTables((prev) => [...prev, optimisticTable]);

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
        setTables((prev) => prev.filter((t) => t.id !== optimisticTable.id));
        const data = await response.json();
        throw new Error(data.error || `HTTP ${response.status}`);
      }
    } catch (error) {
      setTables((prev) => prev.filter((t) => t.id !== optimisticTable.id));
      console.error('Error adding table:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: `Erro ao adicionar mesa: ${error.message}`,
      });
    }
  };

  const handleDeleteTable = async (tableId: string, tableName: string) => {
    const originalTables = [...tables];
    setTables((prev) => prev.filter((t) => t.id !== tableId));

    try {
      const response = await fetch('/api/admin/tables', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId }),
      });

      if (response.ok) {
        await fetchGuests(); // Update guests to remove invalid mesa references
        toast({
          variant: 'success',
          title: 'Sucesso! 🗑️',
          description: `Mesa ${tableName} excluída com sucesso`,
        });
      } else {
        setTables(originalTables);
        const data = await response.json();
        throw new Error(data.error || `HTTP ${response.status}`);
      }
    } catch (error) {
      setTables(originalTables);
      console.error('Error deleting table:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: `Erro ao excluir mesa: ${error.message}`,
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

    const guest = guests.find((g) => g.id === selectedGuestId);
    if (!guest) return;

    const optimisticGuests = guests.map((g) =>
      g.id === selectedGuestId ? { ...g, mesa: selectedTable.id } : g
    );
    setGuests(optimisticGuests);

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
          description: `Convidado ${guest.nome} atribuído à ${selectedTable.name}`,
        });
      } else {
        setGuests(guests);
        const data = await response.json();
        throw new Error(data.error || `HTTP ${response.status}`);
      }
    } catch (error) {
      setGuests(guests);
      console.error('Error assigning guest:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: `Erro ao atribuir convidado: ${error.message}`,
      });
    }
  };

  const handleUnassignGuest = async (guestId: string, guestName: string) => {
    const originalGuests = [...guests];
    setGuests((prev) =>
      prev.map((g) => (g.id === guestId ? { ...g, mesa: null } : g))
    );

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
        setGuests(originalGuests);
        const data = await response.json();
        throw new Error(data.error || `HTTP ${response.status}`);
      }
    } catch (error) {
      setGuests(originalGuests);
      console.error('Error unassigning guest:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: `Erro ao remover convidado: ${error.message}`,
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
      <div className="place-card font-poppins relative mx-auto mt-6 max-w-7xl p-6 text-center">
        <div className="place-card-enhanced rounded-lg bg-white/90 p-6 shadow-inner backdrop-blur-sm">
          <div className="flex items-center justify-center">
            <div className="beach-spinner mr-2 h-6 w-6 text-sky-600"></div>
            <p className="font-quicksand text-sm text-sky-600 sm:text-base">
              Carregando mesas...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="place-card font-poppins relative mx-auto mt-6 max-w-7xl p-6">
      {/* Decorative Beach Elements */}
      <div className="absolute right-0 top-0 h-24 w-24 opacity-10">
        <Waves className="h-full w-full text-sky-400" aria-hidden="true" />
      </div>
      <div className="absolute bottom-4 left-4 h-20 w-20 opacity-10">
        <Sun className="h-full w-full text-orange-400" aria-hidden="true" />
      </div>

      <div className="relative z-10">
        <h2 className="mb-6 flex items-center justify-center gap-2 text-lg font-semibold text-sky-700 sm:text-xl">
          <Heart className="h-6 w-6 text-sky-500" />
          Gestão de Mesas e Lugares
        </h2>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="place-card-enhanced rounded-lg border border-sky-200 bg-white/90 p-4 shadow-inner">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-quicksand text-sm font-medium text-sky-600">
                  Total de Mesas
                </p>
                <p className="font-poppins text-2xl font-bold text-sky-900">
                  {tables.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-sky-600" aria-hidden="true" />
            </div>
          </div>
          <div className="place-card-enhanced rounded-lg border border-sky-200 bg-white/90 p-4 shadow-inner">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-quicksand text-sm font-medium text-sky-600">
                  Lugares Ocupados
                </p>
                <p className="font-poppins text-2xl font-bold text-sky-900">
                  {guests.reduce(
                    (sum, g) => sum + (g.mesa ? 1 + (g.companions || 0) : 0),
                    0
                  )}
                </p>
              </div>
              <Users className="h-8 w-8 text-sky-600" aria-hidden="true" />
            </div>
          </div>
          <div className="place-card-enhanced rounded-lg border border-sky-200 bg-white/90 p-4 shadow-inner">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-quicksand text-sm font-medium text-sky-600">
                  Lugares Disponíveis
                </p>
                <p className="font-poppins text-2xl font-bold text-sky-900">
                  {tables.reduce(
                    (sum, table) => sum + getAvailableSeats(table),
                    0
                  )}
                </p>
              </div>
              <Users className="h-8 w-8 text-sky-600" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex justify-end gap-2">
          <button
            onClick={() => setShowGenerateTablesModal(true)}
            className="rsvp-button rsvp-confirm flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 font-poppins text-sm text-white transition-colors animate-in slide-in-from-right hover:bg-sky-700 active:bg-sky-800 sm:text-base"
            aria-label="Gerar mesas automaticamente"
          >
            <Users className="h-4 w-4" />
            Gerar Mesas
          </button>
          <button
            onClick={() => setShowAddTableModal(true)}
            className="rsvp-button rsvp-confirm flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 font-poppins text-sm text-white transition-colors animate-in slide-in-from-right hover:bg-sky-700 active:bg-sky-800 sm:text-base"
            aria-label="Adicionar nova mesa"
          >
            <Plus className="h-4 w-4" />
            Adicionar Mesa
          </button>
        </div>

        {/* Tables List or Empty State */}
        {tables.length === 0 ? (
          <div className="place-card-enhanced rounded-lg border border-sky-200 bg-white/90 p-8 text-center shadow-inner">
            <Heart className="mx-auto mb-4 h-12 w-12 text-sky-500" aria-hidden="true" />
            <p className="font-quicksand text-sm text-sky-600 sm:text-base">
              Nenhuma mesa encontrada. Crie ou gere mesas para começar a atribuir convidados.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <button
                onClick={() => setShowGenerateTablesModal(true)}
                className="rsvp-button rsvp-confirm rounded-lg bg-sky-600 px-4 py-2 font-poppins text-sm text-white hover:bg-sky-700 sm:text-base"
              >
                Gerar Mesas
              </button>
              <button
                onClick={() => setShowAddTableModal(true)}
                className="rsvp-button rsvp-confirm rounded-lg bg-sky-600 px-4 py-2 font-poppins text-sm text-white hover:bg-sky-700 sm:text-base"
              >
                Adicionar Mesa
              </button>
            </div>
          </div>
        ) : (
          <div className="place-card-enhanced overflow-hidden rounded-lg border border-sky-200 bg-white/90 shadow-inner">
            <div className="overflow-x-auto" aria-live="polite">
              <table className="w-full">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-poppins text-xs font-medium uppercase tracking-wider text-sky-700">
                      Mesa
                    </th>
                    <th className="px-6 py-3 text-left font-poppins text-xs font-medium uppercase tracking-wider text-sky-700">
                      Capacidade
                    </th>
                    <th className="px-6 py-3 text-left font-poppins text-xs font-medium uppercase tracking-wider text-sky-700">
                      Ocupados
                    </th>
                    <th className="px-6 py-3 text-left font-poppins text-xs font-medium uppercase tracking-wider text-sky-700">
                      Disponíveis
                    </th>
                    <th className="px-6 py-3 text-left font-poppins text-xs font-medium uppercase tracking-wider text-sky-700">
                      Convidados
                    </th>
                    <th className="px-6 py-3 text-left font-poppins text-xs font-medium uppercase tracking-wider text-sky-700">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-200 bg-white/90">
                  {tables.map((table) => {
                    const assignedGuests = getAssignedGuests(table.id);
                    return (
                      <tr key={table.id} className="hover:bg-sky-50">
                        <td className="whitespace-nowrap px-6 py-4 font-dancing text-sm text-sky-900">
                          {table.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-quicksand text-sm text-sky-900">
                          {table.capacity}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-quicksand text-sm text-sky-900">
                          {assignedGuests.reduce(
                            (sum, guest) => sum + 1 + (guest.companions || 0),
                            0
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-quicksand text-sm text-sky-900">
                          {getAvailableSeats(table)}
                        </td>
                        <td className="px-6 py-4 font-quicksand text-sm text-sky-900">
                          {assignedGuests.length > 0 ? (
                            <ul className="list-disc pl-5">
                              {assignedGuests.map((guest) => (
                                <li
                                  key={guest.id}
                                  className="flex items-center gap-2"
                                >
                                  <span className="font-dancing">
                                    {guest.nome}{' '}
                                    {guest.companions ? `(+${guest.companions})` : ''}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleUnassignGuest(guest.id, guest.nome)
                                    }
                                    className="text-red-600 hover:text-red-900"
                                    title={`Remover ${guest.nome} da mesa`}
                                    aria-label={`Remover ${guest.nome} da mesa`}
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
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedTable(table);
                                setShowAssignGuestModal(true);
                              }}
                              disabled={getAvailableSeats(table) === 0}
                              className="p-1 text-sky-600 duration-300 animate-in slide-in-from-right hover:text-sky-900 disabled:opacity-50"
                              title="Atribuir convidado"
                              aria-label="Atribuir convidado à mesa"
                            >
                              <Users className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteTable(table.id, table.name)
                              }
                              className="p-1 text-red-600 duration-300 animate-in slide-in-from-right hover:text-red-900"
                              title={`Excluir ${table.name}`}
                              aria-label={`Excluir ${table.name}`}
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
        )}

        {/* Generate Tables Modal */}
        {showGenerateTablesModal && (
          <div className="fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 duration-300 animate-in">
            <div className="place-card-enhanced w-full max-w-md rounded-lg bg-white/90 shadow-xl">
              <div className="p-6">
                <h3 className="mb-4 font-poppins text-lg font-semibold text-sky-900">
                  Gerar Mesas
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block font-quicksand text-sm font-medium text-sky-700">
                      Número de Mesas
                    </label>
                    <input
                      type="number"
                      value={generateTablesConfig.count}
                      onChange={(e) =>
                        setGenerateTablesConfig({
                          ...generateTablesConfig,
                          count: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-sky-200 bg-white/80 px-3 py-2 font-quicksand text-sm text-sky-600 placeholder-sky-400 focus:border-sky-500 focus:outline-none sm:text-base"
                      placeholder="Ex: 10"
                      min="1"
                      aria-describedby="count-error"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-quicksand text-sm font-medium text-sky-700">
                      Capacidade por Mesa
                    </label>
                    <input
                      type="number"
                      value={generateTablesConfig.capacity}
                      onChange={(e) =>
                        setGenerateTablesConfig({
                          ...generateTablesConfig,
                          capacity: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-sky-200 bg-white/80 px-3 py-2 font-quicksand text-sm text-sky-600 placeholder-sky-400 focus:border-sky-500 focus:outline-none sm:text-base"
                      placeholder="Ex: 8"
                      min="1"
                      aria-describedby="capacity-error"
                    />
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleGenerateTables}
                    className="rsvp-button rsvp-confirm flex-1 rounded-lg bg-sky-600 px-4 py-2 font-poppins text-sm text-white transition-colors hover:bg-sky-700 active:bg-sky-800 sm:text-base"
                    aria-label="Gerar mesas"
                  >
                    Gerar
                  </button>
                  <button
                    onClick={() => setShowGenerateTablesModal(false)}
                    className="rsvp-button flex-1 rounded-lg bg-gray-300 px-4 py-2 font-poppins text-sm text-gray-700 transition-colors hover:bg-gray-400 sm:text-base"
                    aria-label="Cancelar geração de mesas"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Table Modal */}
        {showAddTableModal && (
          <div className="fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 duration-300 animate-in">
            <div className="place-card-enhanced w-full max-w-md rounded-lg bg-white/90 shadow-xl">
              <div className="p-6">
                <h3 className="mb-4 font-poppins text-lg font-semibold text-sky-900">
                  Adicionar Nova Mesa
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block font-quicksand text-sm font-medium text-sky-700">
                      Nome da Mesa
                    </label>
                    <input
                      type="text"
                      value={newTable.name}
                      onChange={(e) =>
                        setNewTable({ ...newTable, name: e.target.value })
                      }
                      className="w-full rounded-lg border border-sky-200 bg-white/80 px-3 py-2 font-quicksand text-sm text-sky-600 placeholder-sky-400 focus:border-sky-500 focus:outline-none sm:text-base"
                      placeholder="Ex: Mesa 1"
                      aria-describedby="name-error"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-quicksand text-sm font-medium text-sky-700">
                      Capacidade
                    </label>
                    <input
                      type="number"
                      value={newTable.capacity}
                      onChange={(e) =>
                        setNewTable({ ...newTable, capacity: e.target.value })
                      }
                      className="w-full rounded-lg border border-sky-200 bg-white/80 px-3 py-2 font-quicksand text-sm text-sky-600 placeholder-sky-400 focus:border-sky-500 focus:outline-none sm:text-base"
                      placeholder="Ex: 8"
                      min="1"
                      aria-describedby="capacity-error"
                    />
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleAddTable}
                    className="rsvp-button rsvp-confirm flex-1 rounded-lg bg-sky-600 px-4 py-2 font-poppins text-sm text-white transition-colors hover:bg-sky-700 active:bg-sky-800 sm:text-base"
                    aria-label="Adicionar nova mesa"
                  >
                    Adicionar
                  </button>
                  <button
                    onClick={() => setShowAddTableModal(false)}
                    className="rsvp-button flex-1 rounded-lg bg-gray-300 px-4 py-2 font-poppins text-sm text-gray-700 transition-colors hover:bg-gray-400 sm:text-base"
                    aria-label="Cancelar adição de mesa"
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
            <div className="place-card-enhanced w-full max-w-md rounded-lg bg-white/90 shadow-xl">
              <div className="p-6">
                <h3 className="mb-4 font-poppins text-lg font-semibold text-sky-900">
                  Atribuir Convidado à {selectedTable.name}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block font-quicksand text-sm font-medium text-sky-700">
                      Convidado
                    </label>
                    <select
                      value={selectedGuestId}
                      onChange={(e) => setSelectedGuestId(e.target.value)}
                      className="w-full rounded-lg border border-sky-200 bg-white/80 px-3 py-2 font-quicksand text-sm text-sky-600 focus:border-sky-500 focus:outline-none sm:text-base"
                      aria-describedby="guest-error"
                    >
                      <option value="">Selecione um convidado</option>
                      {guests
                        .filter(
                          (guest) =>
                            !guest.mesa &&
                            guest.status === 'confirmed' &&
                            getAvailableSeats(selectedTable) >=
                            1 + (guest.companions || 0)
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
                    className="rsvp-button rsvp-confirm flex-1 rounded-lg bg-sky-600 px-4 py-2 font-poppins text-sm text-white transition-colors hover:bg-sky-700 active:bg-sky-800 disabled:bg-gray-400 sm:text-base"
                    aria-label="Atribuir convidado à mesa"
                  >
                    Atribuir
                  </button>
                  <button
                    onClick={() => {
                      setShowAssignGuestModal(false);
                      setSelectedGuestId('');
                      setSelectedTable(null);
                    }}
                    className="rsvp-button flex-1 rounded-lg bg-gray-300 px-4 py-2 font-poppins text-sm text-gray-700 transition-colors hover:bg-gray-400 sm:text-base"
                    aria-label="Cancelar atribuição de convidado"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}