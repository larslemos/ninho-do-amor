'use client';

import { useEffect, useState } from 'react';

interface Felicitation {
  id: string;
  name: string;
  message: string;
  date: string;
}

export default function FelicitationList() {
  const [felicitations, setFelicitations] = useState<Felicitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      fetchFelicitations(token);
    } else {
      setError('Token não encontrado');
      setLoading(false);
    }
  }, []);

  const fetchFelicitations = async (token: string) => {
    try {
      const response = await fetch(`/api/felicitations?token=${token}`);
      const data = await response.json();

      if (response.ok) {
        setFelicitations(data || []);
      } else {
        throw new Error(data.error || 'Erro ao carregar felicitações');
      }
    } catch (err) {
      console.error('Erro ao carregar felicitações:', err);
      setError('Erro ao carregar felicitações');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-6 w-[400px] rounded-xl bg-rose-100 p-6 text-center shadow-lg">
        <div className="flex items-center justify-center">
          <div className="mr-2 h-6 w-6 animate-spin rounded-full border-b-2 border-rose-600"></div>
          <p className="text-rose-500">Carregando felicitações...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 w-[400px] rounded-xl bg-rose-100 p-6 text-center shadow-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-6 w-[400px] rounded-xl border border-rose-200 bg-rose-100 p-6 text-center shadow-lg">
      <div className="mb-4">
        <h2 className="mb-2 text-xl font-semibold text-rose-700">
          💕 Felicitações
        </h2>
        <p className="text-sm text-rose-500">
          {felicitations.length > 0
            ? `${felicitations.length} mensagem${felicitations.length !== 1 ? 's' : ''} de carinho`
            : 'Seja o primeiro a deixar uma felicitação!'}
        </p>
      </div>

      <div className="max-h-96 space-y-4 overflow-y-auto">
        {felicitations.length > 0 ? (
          felicitations.map((felicitation) => (
            <div
              key={felicitation.id}
              className="rounded-lg border border-rose-200 bg-white p-4 text-left shadow-sm"
            >
              <div className="mb-2 flex items-start justify-between">
                <h3 className="text-sm font-semibold text-rose-700">
                  {felicitation.name}
                </h3>
                <span className="text-xs text-rose-400">
                  {new Date(felicitation.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-rose-600">
                {felicitation.message}
              </p>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <div className="mb-2 text-4xl">💌</div>
            <p className="text-sm text-rose-500">
              Ainda não há felicitações.
              <br />
              Seja o primeiro a parabenizar os noivos!
            </p>
          </div>
        )}
      </div>

      {felicitations.length > 5 && (
        <div className="mt-4 text-xs text-rose-400">
          Role para ver mais felicitações
        </div>
      )}
    </div>
  );
}
