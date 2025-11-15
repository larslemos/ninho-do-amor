// app/admin/[wedding]/seating/protocol/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Table, Clock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CheckedInGuest {
  id: string;
  nome: string;
  mesa?: string;
  checked_in_at: string;
  telefone?: string;
}

const CARD_COLORS = [
  // 0: Newest → Rose Gold
  {
    gradient: 'from-rose-200 to-pink-200',
    ring: 'ring-rose-400',
    bg: 'bg-rose-50',
    text: 'text-rose-900',
    icon: 'text-rose-700',
    badge: 'bg-rose-600 text-white',
  },
  // 1: Champagne
  {
    gradient: 'from-amber-100 to-yellow-100',
    ring: 'ring-amber-300',
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    icon: 'text-amber-700',
    badge: 'bg-amber-600 text-white',
  },
  // 2: Sage Green
  {
    gradient: 'from-emerald-100 to-teal-100',
    ring: 'ring-emerald-300',
    bg: 'bg-emerald-50',
    text: 'text-emerald-900',
    icon: 'text-emerald-700',
    badge: 'bg-emerald-600 text-white',
  },
];

export default function CheckInProtocol() {
  const { wedding: weddingSlug } = useParams();
  const router = useRouter();
  const [recentGuests, setRecentGuests] = useState<CheckedInGuest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const { data: wedding } = await supabase
          .from('weddings')
          .select('id')
          .eq('slug', weddingSlug)
          .single();

        if (!wedding) throw new Error('Wedding not found');

        const { data } = await supabase
          .from('guests')
          .select('id, nome, mesa, checked_in_at, telefone')
          .eq('wedding_id', wedding.id)
          .eq('status', 'checked_in')
          .order('checked_in_at', { ascending: false })
          .limit(10);

        if (data) setRecentGuests(data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, [weddingSlug]);

  useEffect(() => {
    const channel = supabase
      .channel(`checkin-${weddingSlug}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'guests',
          filter: `status=eq.checked_in`,
        },
        (payload) => {
          const updated = payload.new as any;
          const newGuest: CheckedInGuest = {
            id: updated.id,
            nome: updated.nome,
            mesa: updated.mesa,
            checked_in_at: updated.checked_in_at,
            telefone: updated.telefone,
          };

          setRecentGuests((prev) => {
            const filtered = prev.filter((g) => g.id !== newGuest.id);
            return [newGuest, ...filtered].slice(0, 3);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [weddingSlug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600"></div>
      </div>
    );
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style jsx global>{`
        .font-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .font-body {
          font-family: 'Inter', sans-serif;
        }
        .font-badge {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-size: 0.75rem;
        }
      `}</style>

      <div className="font-body min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 p-4 sm:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => _router.back()}
                className="rounded-full bg-white/80 shadow-md backdrop-blur hover:shadow-lg"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-heading text-4xl text-rose-900 sm:text-5xl">
                  Chegadas Recentes
                </h1>
                <p className="mt-1 text-lg text-rose-700">
                  {weddingSlug.replace(/^\w/, (c) => c.toUpperCase())}
                </p>
              </div>
            </div>
            <Badge className="font-badge bg-rose-100 px-5 py-2 text-lg text-rose-800">
              Últimos 3
            </Badge>
          </div>

          {/* FIFO Cards with Unique Colors */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {recentGuests.length === 0 ? (
              <Card className="col-span-full border-0 bg-white/70 p-20 text-center shadow-xl backdrop-blur">
                <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-rose-50">
                  <Clock className="h-14 w-14 text-rose-500" />
                </div>
                <p className="text-2xl font-medium text-rose-700">
                  Aguardando os primeiros convidados...
                </p>
              </Card>
            ) : (
              recentGuests.map((guest, index) => {
                const color = CARD_COLORS[index];
                return (
                  <Card
                    key={guest.id}
                    className={`relative overflow-hidden rounded-3xl border-0 bg-white/95 shadow-2xl backdrop-blur-xl transition-all duration-700 ease-out ${index === 0 ? `ring-4 ${color.ring} scale-105 ring-opacity-60` : ''} `}
                    style={{ animation: `fadeInUp 0.7s ease-out ${index * 0.2}s both` }}
                  >
                    {/* Gradient Top Bar */}
                    <div
                      className={`absolute left-0 right-0 top-0 h-3 bg-gradient-to-r ${color.gradient}`}
                    ></div>

                    <div className="p-8 text-center sm:p-10">
                      {/* Avatar */}
                      <div
                        className={`mx-auto mb-6 h-28 w-28 rounded-full ${color.bg} flex items-center justify-center shadow-inner ring-4 ring-white/50`}
                      >
                        <User className={`h-14 w-14 ${color.icon}`} />
                      </div>

                      {/* Name */}
                      <h2
                        className={`font-heading text-3xl sm:text-4xl ${color.text} mb-4 leading-tight`}
                      >
                        {guest.nome}
                      </h2>

                      {/* Table */}
                      {guest.mesa && (
                        <div
                          className={`flex items-center justify-center gap-2 ${color.icon} mb-3`}
                        >
                          <Table className="h-6 w-6" />
                          <span className="text-lg font-medium">Mesa {guest.mesa}</span>
                        </div>
                      )}

                      {/* Time */}
                      <div className={`flex items-center justify-center gap-2 ${color.icon}`}>
                        <CheckCircle2 className="h-6 w-6" />
                        <span className="text-lg font-medium">
                          {format(new Date(guest.checked_in_at), 'HH:mm', { locale: ptBR })}
                        </span>
                      </div>

                      {/* NEW Badge */}
                      {index === 0 && (
                        <div className="absolute right-6 top-6 animate-pulse">
                          <Badge className={`${color.badge} font-badge px-3 py-1 text-sm`}>
                            NOVO
                          </Badge>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })
            )}
          </div>

          {/* Placeholders */}
          {recentGuests.length > 0 &&
            Array.from({ length: 3 - recentGuests.length }).map((_, i) => {
              const placeholderColor = CARD_COLORS[recentGuests.length + i] || CARD_COLORS[2];
              return (
                <Card
                  key={`placeholder-${i}`}
                  className={`border-2 border-dashed bg-white/30 backdrop-blur ${placeholderColor.ring.replace('ring-', 'border-')} rounded-3xl`}
                >
                  <div className="p-10 text-center">
                    <div
                      className={`mx-auto mb-4 h-24 w-24 rounded-full ${placeholderColor.bg} border-2 border-dashed ${placeholderColor.ring.replace('ring-', 'border-')}`}
                    ></div>
                    <p
                      className={`${placeholderColor.icon.replace('text-', 'text-')} text-lg italic`}
                    >
                      Aguardando...
                    </p>
                  </div>
                </Card>
              );
            })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}
