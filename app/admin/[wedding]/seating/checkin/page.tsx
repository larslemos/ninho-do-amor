// app/admin/[wedding]/seating/checkin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  ArrowLeft,
  Users,
  Table as TableIcon,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

interface Guest {
  id: string;
  nome: string;
  telefone?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'checked_in';
  mesa?: string;
  checked_in_at?: string;
}

export default function CheckInPage() {
  const { wedding: weddingSlug } = useParams();
  const router = useRouter();
  const [tables, setTables] = useState<Array<{ number: string; guests: Guest[] }>>([]);
  const [allGuests, setAllGuests] = useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuests();
  }, [weddingSlug]);

  const fetchGuests = async () => {
    try {
      const { data: wedding, error: wErr } = await supabase
        .from('weddings')
        .select('id')
        .eq('slug', weddingSlug)
        .single();

      if (wErr || !wedding) throw new Error('Wedding not found');

      const { data, error } = await supabase
        .from('guests')
        .select('id, nome, telefone, status, mesa, checked_in_at')
        .eq('wedding_id', wedding.id)
        .order('nome');

      if (error) throw error;

      setAllGuests(data);
      groupByTable(data);
    } catch (err) {
      toast({ title: 'Erro', description: 'Falha ao carregar convidados', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const groupByTable = (guests: Guest[]) => {
    const filtered = guests.filter((g) => g.nome.toLowerCase().includes(searchTerm.toLowerCase()));

    const map = new Map<string, Guest[]>();
    filtered.forEach((g) => {
      const table = g.mesa?.trim() || 'Sem Mesa';
      if (!map.has(table)) map.set(table, []);
      map.get(table)!.push(g);
    });

    const sorted = Array.from(map.entries())
      .map(([number, guests]) => ({ number, guests }))
      .sort((a, b) => {
        if (a.number === 'Sem Mesa') return 1;
        if (b.number === 'Sem Mesa') return -1;
        const na = parseInt(a.number, 10);
        const nb = parseInt(b.number, 10);
        return isNaN(na) || isNaN(nb) ? a.number.localeCompare(b.number) : na - nb;
      });

    setTables(sorted);
  };

  useEffect(() => {
    groupByTable(allGuests);
  }, [searchTerm, allGuests]);

  // Updated: Allow check-in from ANY status
  const handleCheckIn = async (guestId: string) => {
    try {
      const { error } = await supabase
        .from('guests')
        .update({
          status: 'checked_in',
          checked_in_at: new Date().toISOString(),
        })
        .eq('id', guestId);

      if (error) throw error;

      toast({
        title: 'Check-in realizado!',
        description: 'Convidado registrado com sucesso.',
      });
      fetchGuests();
    } catch (err: any) {
      toast({
        title: 'Erro',
        description: err.message || 'Falha no check-in',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: Guest['status']) => {
    switch (status) {
      case 'checked_in':
        return (
          <Badge className="gap-1 bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-3 w-3" /> Chegou
          </Badge>
        );
      case 'confirmed':
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" /> Confirmado
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="gap-1 bg-red-100 text-red-700">
            <XCircle className="h-3 w-3" /> Recusou
          </Badge>
        );
      default:
        return <Badge variant="outline">Pendente</Badge>;
    }
  };

  // Show "Check-in" button if NOT already checked in
  const canCheckIn = (status: Guest['status']) => status !== 'checked_in';

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600"></div>
        <span className="ml-3 text-lg">Carregando convidados...</span>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="rounded-lg p-2 transition-all hover:bg-white hover:shadow-sm"
              >
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Check-in de Convidados
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  {weddingSlug.replace(/^\w/, (c) => c.toUpperCase())}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.back()}>
              Voltar ao Plano
            </Button>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Buscar por nome do convidado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 rounded-xl border-slate-300 pl-12 text-base focus:border-rose-500 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card className="bg-white/80 p-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-600">Total</p>
                  <p className="text-xl font-bold text-slate-900">{allGuests.length}</p>
                </div>
              </div>
            </Card>
            <Card className="bg-white/80 p-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-600">Chegaram</p>
                  <p className="text-xl font-bold text-slate-900">
                    {allGuests.filter((g) => g.status === 'checked_in').length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="bg-white/80 p-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-100 p-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-600">Confirmados</p>
                  <p className="text-xl font-bold text-slate-900">
                    {allGuests.filter((g) => g.status === 'confirmed').length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="bg-white/80 p-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-rose-100 p-2">
                  <TableIcon className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-600">Mesas</p>
                  <p className="text-xl font-bold text-slate-900">{tables.length}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tables Grid — 2 per row */}
          {tables.length === 0 ? (
            <Card className="bg-white/60 p-12 text-center backdrop-blur">
              <TableIcon className="mx-auto mb-4 h-12 w-12 text-slate-400" />
              <p className="text-lg text-slate-600">Nenhum convidado encontrado.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {tables.map((table) => (
                <Card
                  key={table.number}
                  className="overflow-hidden border-slate-200 bg-white/90 shadow-sm backdrop-blur transition-all duration-300 hover:shadow-lg"
                >
                  <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-lg font-bold">
                        <TableIcon className="h-5 w-5" />
                        {table.number === 'Sem Mesa' ? 'Sem Mesa' : `Mesa ${table.number}`}
                      </h3>
                      <Badge className="border-0 bg-white/20 text-white">
                        {table.guests.length}
                      </Badge>
                    </div>
                  </div>

                  <div className="max-h-96 space-y-3 overflow-y-auto p-4">
                    {table.guests.map((guest) => (
                      <div
                        key={guest.id}
                        className="flex flex-col justify-between gap-3 rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100 sm:flex-row sm:items-center"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="break-words font-medium text-slate-900">{guest.nome}</p>
                          {guest.telefone && (
                            <p className="mt-0.5 text-xs text-slate-500">{guest.telefone}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(guest.status)}
                          {/* Show Check-in button for ANY status except checked_in */}
                          {canCheckIn(guest.status) && (
                            <Button
                              size="sm"
                              onClick={() => handleCheckIn(guest.id)}
                              className="h-8 bg-emerald-600 px-3 text-xs font-medium hover:bg-emerald-700"
                            >
                              Check-in
                            </Button>
                          )}
                          {guest.status === 'checked_in' && (
                            <Link href={`/admin/${weddingSlug}/seating/protocol?guest=${guest.id}`}>
                              <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
                                Ver
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
