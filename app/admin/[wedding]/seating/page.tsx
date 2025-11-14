// app/admin/[wedding]/seating/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Users, Table, Search, ArrowLeft, Download, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface Guest {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'checked_in';
  mesa?: string;
  checked_in_at?: string;
}

export default function SeatingManagement({ params }: { params: Promise<{ wedding: string }> }) {
  const { wedding: weddingSlug } = React.use(params); // Await params
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const res = await fetch(`/api/admin/guests?weddingSlug=${weddingSlug}`);
        if (!res.ok) throw new Error('Failed to load guests');
        const data = await res.json();
        setGuests(data.guests ?? []);
      } catch (err) {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível carregar os convidados',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchGuests();
  }, [weddingSlug, toast]);

  const allocatedGuests = guests.filter((g) => !!g.mesa?.trim());

  const tablesMap = allocatedGuests.reduce<Record<string, Guest[]>>((acc, guest) => {
    const table = guest.mesa!.trim();
    if (!acc[table]) acc[table] = [];
    acc[table].push(guest);
    return acc;
  }, {});

  const tables = Object.entries(tablesMap)
    .map(([number, guests]) => ({ number, guests, total: guests.length }))
    .sort((a, b) => {
      const na = parseInt(a.number, 10);
      const nb = parseInt(b.number, 10);
      return isNaN(na) || isNaN(nb) ? a.number.localeCompare(b.number) : na - nb;
    });

  const filteredTables = tables.filter((t) =>
    t.guests.some((g) => g.nome.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportSeatingCSV = () => {
    const header = 'Mesa,Nome,Telefone,Status,Check-in\n';
    const rows = allocatedGuests
      .map((g) => {
        const phone = g.telefone || '';
        const checkin =
          g.status === 'checked_in' ? new Date(g.checked_in_at!).toLocaleString() : '';
        return `${g.mesa},${g.nome},${phone},${g.status},${checkin}`;
      })
      .join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mesas-${weddingSlug}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exportado', description: 'Planilha baixada' });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-rose-600"></div>
        <span className="ml-3">Carregando mesas…</span>
      </div>
    );
  }

  return (
    <div className="font-montserrat p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Plano de Mesas – {weddingSlug.replace(/^\w/, (c) => c.toUpperCase())}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/${weddingSlug}/seating/checkin`}>
            <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Check-in
            </button>
          </Link>
          <button
            onClick={exportSeatingCSV}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Convidados</p>
              <p className="text-2xl font-bold text-blue-900">{guests.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Alocados</p>
              <p className="text-2xl font-bold text-green-900">{allocatedGuests.length}</p>
            </div>
            <Table className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Mesas</p>
              <p className="text-2xl font-bold text-purple-900">{tables.length}</p>
            </div>
            <Table className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-rose-600">Média por Mesa</p>
              <p className="text-2xl font-bold text-rose-900">
                {tables.length ? (allocatedGuests.length / tables.length).toFixed(1) : 0}
              </p>
            </div>
            <Users className="h-8 w-8 text-rose-600" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome do convidado…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Tables */}
      {filteredTables.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center text-gray-500">
          <Table className="mx-auto mb-3 h-12 w-12 text-gray-400" />
          <p>Nenhum convidado alocado ainda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTables.map((table) => (
            <div
              key={table.number}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="bg-gradient-to-r from-rose-600 to-rose-500 p-4 text-white">
                <h3 className="flex items-center justify-between text-lg font-bold">
                  <span className="flex items-center gap-2">
                    <Table className="h-5 w-5" />
                    Mesa {table.number}
                  </span>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-sm">
                    {table.total}
                  </span>
                </h3>
              </div>
              <ul className="divide-y divide-gray-100">
                {table.guests.map((guest) => (
                  <li
                    key={guest.id}
                    className="flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50"
                  >
                    <span className="truncate font-medium text-gray-800">{guest.nome}</span>
                    <div className="flex items-center gap-2">
                      {guest.status === 'checked_in' && (
                        <span className="flex items-center gap-1 text-xs text-emerald-600">
                          <CheckCircle2 className="h-3 w-3" /> Check-in
                        </span>
                      )}
                      {guest.status === 'confirmed' && (
                        <span className="text-xs text-green-600">Confirmado</span>
                      )}
                      {guest.status === 'rejected' && (
                        <span className="text-xs text-red-600">Recusado</span>
                      )}
                      {guest.status === 'pending' && (
                        <span className="text-xs text-yellow-600">Pendente</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
