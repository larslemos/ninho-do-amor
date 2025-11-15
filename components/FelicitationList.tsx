// app/components/FelicitationList.tsx

'use client';

import { useEffect, useState } from 'react';
import { Heart, Waves, Sun } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animateNewFelicitation, setAnimateNewFelicitation] = useState<string | null>(null);
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha seu nome e mensagem.',
        variant: 'destructive',
      });
      return;
    }

    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) {
      setError('Token não encontrado');
      return;
    }

    setIsSubmitting(true);
    const newFelicitation: Felicitation = {
      id: `temp-${Date.now()}`,
      name: name.trim(),
      message: message.trim(),
      date: new Date().toISOString(),
    };

    // Optimistic update
    setFelicitations([newFelicitation, ...felicitations]);
    setAnimateNewFelicitation(newFelicitation.id);
    setTimeout(() => setAnimateNewFelicitation(null), 600);

    try {
      const response = await fetch('/api/felicitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          name: name.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFelicitations((prev) => prev.map((f) => (f.id === newFelicitation.id ? data : f)));
        setName('');
        setMessage('');
        toast({
          title: 'Mensagem enviada',
          description: 'Obrigado por sua felicitação aos noivos!',
        });
      } else {
        throw new Error(data.error || 'Erro ao enviar felicitação');
      }
    } catch (err) {
      console.error('Erro ao enviar felicitação:', err);
      setFelicitations((prev) => prev.filter((f) => f.id !== newFelicitation.id));
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar sua felicitação. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="place-card font-poppins relative mx-auto mt-6 w-full max-w-md rounded-xl p-6 text-center shadow-lg duration-300 animate-in slide-in-from-right">
        <div className="place-card-enhanced rounded-lg bg-white/90 p-6 shadow-inner backdrop-blur-sm">
          <div className="flex items-center justify-center">
            <div className="beach-spinner mr-2 h-6 w-6 sm:h-7 sm:w-7"></div>
            <p className="font-quicksand text-sm text-sky-600 sm:text-base">
              Carregando felicitações...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="place-card font-poppins relative mx-auto mt-6 w-full max-w-md rounded-xl p-6 text-center shadow-lg duration-300 animate-in slide-in-from-right">
        <div className="place-card-enhanced rounded-lg border border-red-200 bg-red-50 p-6 shadow-inner">
          <p className="font-quicksand text-sm text-red-700 sm:text-base">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="place-card font-poppins relative mx-auto mt-6 w-full max-w-md rounded-xl p-6 text-center shadow-lg duration-300 animate-in slide-in-from-right sm:mt-8">
      {/* Decorative Beach Elements */}
      <div className="absolute right-0 top-0 h-20 w-20 opacity-10 sm:h-24 sm:w-24">
        <Waves className="h-full w-full text-sky-400" aria-hidden="true" />
      </div>
      <div className="absolute bottom-4 left-4 h-16 w-16 opacity-10 sm:h-20 sm:w-20">
        <Sun className="h-full w-full text-orange-400" aria-hidden="true" />
      </div>

      <div className="relative z-10">
        <div className="mb-4">
          <h2 className="mb-2 flex items-center justify-center gap-2 text-lg font-semibold text-sky-700 sm:text-xl">
            <Heart className="h-6 w-6 text-sky-500" />
            Felicitações
          </h2>
          <p className="font-quicksand text-sm text-sky-600 sm:text-base">
            {felicitations.length > 0
              ? `${felicitations.length} mensagem${felicitations.length !== 1 ? 's' : ''} de carinho`
              : 'Seja o primeiro a deixar uma felicitação!'}
          </p>
        </div>

        {/* Felicitation List */}
        <div className="max-h-96 space-y-4 overflow-y-auto" aria-live="polite">
          {felicitations.length > 0 ? (
            felicitations.map((felicitation) => (
              <div
                key={felicitation.id}
                className={`place-card-enhanced rounded-lg border border-sky-200 bg-white/90 p-4 text-left shadow-inner duration-300 ${
                  animateNewFelicitation === felicitation.id
                    ? 'status-change-animation animate-in slide-in-from-right'
                    : ''
                }`}
              >
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-dancing text-sm font-semibold text-sky-700 sm:text-base">
                    {felicitation.name}
                  </h3>
                  <span className="font-quicksand text-xs text-sky-600 sm:text-sm">
                    {new Date(felicitation.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <p className="font-quicksand text-sm leading-relaxed text-sky-600 sm:text-base">
                  {felicitation.message}
                </p>
              </div>
            ))
          ) : (
            <div className="place-card-enhanced p-8 text-center">
              <Heart className="mx-auto mb-2 h-10 w-10 text-sky-500" aria-hidden="true" />
              <p className="font-quicksand text-sm text-sky-600 sm:text-base">
                Ainda não há felicitações.
                <br />
                Seja o primeiro a parabenizar os noivos!
              </p>
            </div>
          )}
        </div>

        {felicitations.length > 5 && (
          <div className="mt-4 text-xs text-sky-600 sm:text-sm">
            <p className="font-quicksand">Role para ver mais felicitações</p>
          </div>
        )}
      </div>
    </div>
  );
}
