//

'use client';

import { useEffect, useState } from 'react';
import { Heart, Waves, Sun } from 'lucide-react';
import type { WeddingData } from '@/types/wedding';

interface Felicitation {
  id: string;
  name: string;
  message: string;
  date: string;
}

interface FelicitationListProps {
  weddingData?: WeddingData;
}

export default function JHFelicitationList({
  weddingData,
}: FelicitationListProps) {
  const [felicitations, setFelicitations] = useState<Felicitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      fetchFelicitations(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchFelicitations = async (token: string) => {
    try {
      const response = await fetch(`/api/felicitations?token=${token}`);
      const data = await response.json();
      if (response.ok) {
        setFelicitations(data || []);
      }
    } catch (err) {
      console.error('Erro ao carregar felicitações:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto mt-8 w-full max-w-3xl px-4">
        <div className="wedding-hero-card rounded-3xl p-12 text-center shadow-2xl">
          <div className="flex items-center justify-center">
            <div className="mr-3 h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent"></div>
            <p className="wedding-text-secondary font-blancha text-lg">
              Carregando felicitações...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-3xl px-4">
      <div className="wedding-hero-card relative overflow-hidden rounded-3xl shadow-2xl">
        {/* Decorative Elements */}
        <div className="absolute right-8 top-8 h-24 w-24 opacity-20 md:h-32 md:w-32">
          <Waves className="wedding-decorative-svg h-full w-full" />
        </div>
        <div className="absolute bottom-8 left-8 h-20 w-20 opacity-15">
          <Sun className="wedding-decorative-svg h-full w-full" />
        </div>

        <div className="relative z-10 space-y-8 p-12">
          {/* Header */}
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="wedding-button flex h-20 w-20 items-center justify-center rounded-full shadow-xl">
                <Heart className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="wedding-text-secondary font-blancha text-xl font-light md:text-2xl">
              Felicitações
            </h2>
            <p className="wedding-text-secondary font-blancha text-lg">
              {felicitations.length > 0
                ? `${felicitations.length} mensagem${felicitations.length !== 1 ? 's' : ''} de carinho`
                : 'Seja o primeiro a deixar uma felicitação!'}
            </p>
          </div>

          {/* Felicitations List */}
          <div className="max-h-96 space-y-4 overflow-y-auto">
            {felicitations.length > 0 ? (
              felicitations.map((felicitation) => (
                <div
                  key={felicitation.id}
                  className="wedding-info-card rounded-2xl p-6 text-left shadow-lg transition-all hover:shadow-xl"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="wedding-text-primary font-sacramento text-xl font-semibold">
                      {felicitation.name}
                    </h3>
                    <span className="wedding-text-secondary font-blancha text-sm">
                      {new Date(felicitation.date).toLocaleDateString('pt-PT', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="wedding-text-secondary font-blancha leading-relaxed">
                    {felicitation.message}
                  </p>
                </div>
              ))
            ) : (
              <div className="wedding-info-card rounded-2xl p-12 text-center">
                <Heart className="wedding-heart-icon mx-auto mb-4 h-12 w-12" />
                <p className="wedding-text-secondary font-blancha text-lg">
                  Ainda não há felicitações.
                  <br />
                  Seja o primeiro a parabenizar os noivos!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
