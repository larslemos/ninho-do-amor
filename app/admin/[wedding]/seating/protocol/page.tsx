// app/admin/[wedding]/seating/protocol/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Table, Phone, Clock, Printer } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface Guest {
  id: string;
  nome: string;
  telefone?: string;
  mesa?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'checked_in';
  checked_in_at?: string;
}

export default function ProtocolPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const guestId = searchParams.get('guest');
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!guestId) {
      router.back();
      return;
    }
    fetchGuest();
  }, [guestId]);

  const fetchGuest = async () => {
    try {
      const { data, error } = await supabase.from('guests').select('*').eq('id', guestId).single();

      if (error) throw error;
      setGuest(data);
    } catch (err) {
      toast({ title: 'Erro', description: 'Convidado não encontrado', variant: 'destructive' });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  if (loading || !guest) return <div className="p-6 text-center">Carregando...</div>;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <h1 className="text-3xl font-bold">Protocolo do Convidado</h1>
        <div className="flex gap-2">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Voltar
          </Button>
        </div>
      </div>

      <Card className="p-8 print:border-0 print:p-6 print:shadow-none">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <User className="h-10 w-10 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{guest.nome}</h2>
            <Badge
              className={guest.status === 'checked_in' ? 'bg-emerald-500' : 'bg-blue-500'}
              text-white
            >
              {guest.status === 'checked_in' ? 'Check-in Realizado' : 'Confirmado'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-2">
          <div className="flex items-center gap-3">
            <Table className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Mesa</p>
              <p className="font-semibold">{guest.mesa ? `Mesa ${guest.mesa}` : 'Não alocada'}</p>
            </div>
          </div>
          {guest.telefone && (
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-semibold">{guest.telefone}</p>
              </div>
            </div>
          )}
          {guest.checked_in_at && (
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Check-in</p>
                <p className="font-semibold">{new Date(guest.checked_in_at).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:p-6,
          .print\\:p-6 * {
            visibility: visible;
          }
          .print\\:p-6 {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
