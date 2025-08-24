// app/components/FelicitationForm.tsx.
'use client';

import type React from 'react';
import { useState } from 'react';
import { Heart, Waves, Sun } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FelicitationFormProps {
  onFelicitationAdded?: (felicitation: {
    id: string;
    name: string;
    message: string;
    date: string;
  }) => void;
}

export default function FelicitationForm({
  onFelicitationAdded,
}: FelicitationFormProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animateButton, setAnimateButton] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = new URLSearchParams(window.location.search).get('token');

    if (!token) {
      toast({
        title: 'Erro',
        description: 'Token não encontrado. Verifique o link.',
        variant: 'destructive',
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha seu nome.',
        variant: 'destructive',
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha sua mensagem.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    setAnimateButton(true);

    const newFelicitation = {
      id: `temp-${Date.now()}`,
      name: name.trim(),
      message: message.trim(),
      date: new Date().toISOString(),
    };

    // Optimistic update: Emit to parent
    if (onFelicitationAdded) {
      onFelicitationAdded(newFelicitation);
    }

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
        setName('');
        setMessage('');
        toast({
          title: 'Mensagem Enviada',
          description: 'Obrigado por sua felicitação aos noivos! 🎉',
        });
        // Update with server data
        if (onFelicitationAdded) {
          onFelicitationAdded(data);
        }
      } else {
        throw new Error(data.error || 'Erro ao enviar felicitação');
      }
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      toast({
        title: 'Erro',
        description:
          'Não foi possível enviar sua felicitação. Tente novamente.',
        variant: 'destructive',
      });
      // Revert optimistic update
      if (onFelicitationAdded) {
        onFelicitationAdded({ ...newFelicitation, id: 'remove' });
      }
    } finally {
      setIsSubmitting(false);
      setAnimateButton(false);
    }
  };

  return (
    <div className="place-card font-poppins relative mx-auto mt-6 w-full max-w-md rounded-xl p-6 text-center shadow-lg duration-300 animate-in slide-in-from-right sm:mt-8">
      {/* Decorative Beach Elements */}
      <div className="absolute right-0 top-0 h-20 w-20 opacity-10 sm:h-24 sm:w-24">
        <Waves className="h-full w-full text-sky-400" aria-hidden="true" />
      </div>
      <div className="absolute bottom-4 left-4 h-16 w-16 opacity-10 sm:h-20 sm:w-20">
        <Sun className="h-full w-full text-orange-400" aria-hidden="true" />
      </div>

      <div className="place-card-enhanced relative z-10 rounded-lg bg-white/90 p-6 shadow-inner backdrop-blur-sm">
        <div className="mb-4">
          <h2 className="mb-2 flex items-center justify-center gap-2 text-lg font-semibold text-sky-700 sm:text-xl">
            <Heart className="h-6 w-6 text-sky-500" />
            Deixe sua Felicitação
          </h2>
          <p className="font-quicksand text-sm text-sky-600 sm:text-base">
            Compartilhe seus votos de felicidade para os noivos!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label
              htmlFor="name"
              className="mb-1 block font-quicksand text-sm font-medium text-sky-700 sm:text-base"
            >
              Seu Nome e Apelido *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              placeholder="Ex.: António João"
              className="block w-full rounded-lg border border-sky-200 bg-white/80 px-3 py-2 text-sm text-sky-600 placeholder-sky-400 focus:border-sky-500 focus:outline-none sm:text-base"
              aria-required="true"
              aria-describedby="name-counter"
              disabled={isSubmitting}
            />
            <div
              id="name-counter"
              className="mt-1 text-right font-quicksand text-xs text-sky-600 sm:text-sm"
            >
              {name.length}/100 caracteres
            </div>
          </div>

          <div className="text-left">
            <label
              htmlFor="message"
              className="mb-1 block font-quicksand text-sm font-medium text-sky-700 sm:text-base"
            >
              Mensagem de Felicitação *
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Escreva sua mensagem de felicitação para os noivos..."
              className="block w-full resize-none rounded-lg border border-sky-200 bg-white/80 px-3 py-2 text-sm text-sky-600 placeholder-sky-400 focus:border-sky-500 focus:outline-none sm:text-base"
              aria-required="true"
              aria-describedby="message-counter"
              disabled={isSubmitting}
            />
            <div
              id="message-counter"
              className="mt-1 text-right font-quicksand text-xs text-sky-600 sm:text-sm"
            >
              {message.length}/500 caracteres
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !message.trim()}
            className={`rsvp-button rsvp-confirm w-full rounded-lg bg-sky-600 px-4 py-3 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-sky-700 active:bg-sky-800 sm:text-base ${
              isSubmitting
                ? 'rsvp-loading opacity-50'
                : animateButton
                  ? 'status-change-animation'
                  : ''
            }`}
            aria-label="Enviar felicitação aos noivos"
          >
            <div className="flex items-center justify-center gap-3">
              {isSubmitting ? (
                <>
                  <div className="beach-spinner h-5 w-5"></div>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Heart className="h-5 w-5" />
                  <span>Enviar Felicitação</span>
                </>
              )}
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
