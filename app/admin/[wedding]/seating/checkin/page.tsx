// app/admin/[wedding]/seating/checkin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Clock, XCircle, Search } from 'lucide-react';
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
      toast({ title: 'Erro', description: 'Falha ao carregar', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const groupByTable = (guests: Guest[]) => {
    const filtered = guests.filter((g) => g.nome.toLowerCase().includes(searchTerm.toLowerCase()));

    const map = new Map<string, Guest[]>();
    filtered.forEach((g) => {
      const table = g.mesa || 'Sem Mesa';
      if (!map.has(table)) map.set(table, []);
      map.get(table)!.push(g);
    });

    const sorted = Array.from(map.entries())
      .map(([number, guests]) => ({ number, guests }))
      .sort((a, b) => a.number.localeCompare(b.number));

    setTables(sorted);
  };

  useEffect(() => {
    groupByTable(allGuests);
  }, [searchTerm, allGuests]);

  const handleCheckIn = async (guestId: string) => {
    try {
      const { error } = await supabase
        .from('guests')
        .update({ status: 'checked_in', checked_in_at: new Date().toISOString() })
        .eq('id', guestId);

      if (error) throw error;
      toast({ title: 'Check-in', description: 'Registrado!' });
      fetchGuests();
    } catch (err) {
      toast({ title: 'Erro', description: 'Falha no check-in', variant: 'destructive' });
    }
  };

  if (loading) return <div className="p-6 text-center">Carregando...</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Check-in de Convidados</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Buscar convidado..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tables.map((table) => (
          <Card key={table.number} className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold">
                {table.number === 'Sem Mesa' ? 'Sem Mesa' : `Mesa ${table.number}`}
              </h3>
              <Badge>{table.guests.length}</Badge>
            </div>
            <div className="space-y-2">
              {table.guests.map((guest) => (
                <div
                  key={guest.id}
                  className="bg-muted/50 flex items-center justify-between rounded p-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{guest.nome}</p>
                    {guest.telefone && (
                      <p className="text-xs text-muted-foreground">{guest.telefone}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {guest.status === 'checked_in' ? (
                      <Badge className="gap-1 bg-emerald-500 text-white">
                        <CheckCircle2 className="h-3 w-3" /> Check-in
                      </Badge>
                    ) : guest.status === 'confirmed' ? (
                      <>
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" /> Confirmado
                        </Badge>
                        <Button size="sm" onClick={() => handleCheckIn(guest.id)}>
                          Check-in
                        </Button>
                      </>
                    ) : guest.status === 'rejected' ? (
                      <Badge variant="destructive" className="gap-1">
                        <XCircle className="h-3 w-3" /> Recusado
                      </Badge>
                    ) : (
                      <Badge variant="outline">Pendente</Badge>
                    )}
                    {guest.status === 'checked_in' && (
                      <Link href={`/admin/${weddingSlug}/seating/protocol?guest=${guest.id}`}>
                        <Button size="sm" variant="ghost">
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
    </div>
  );
}
