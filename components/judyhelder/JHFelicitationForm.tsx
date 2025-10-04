// app

'use client';

import { useState } from 'react';
import { Heart, Waves, Sun } from 'lucide-react';
import type { WeddingData } from '@/types/wedding';

interface FelicitationFormProps {
  weddingData?: WeddingData;
  onFelicitationAdded?: (felicitation: {
    id: string;
    name: string;
    message: string;
    date: string;
  }) => void;
}

export default function JHFelicitationForm({
  weddingData,
  onFelicitationAdded,
}: FelicitationFormProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = new URLSearchParams(window.location.search).get('token');

    if (!token || !name.trim() || !message.trim()) {
      return;
    }

    setIsSubmitting(true);

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

      if (response.ok) {
        const data = await response.json();
        setName('');
        setMessage('');
        if (onFelicitationAdded) {
          onFelicitationAdded(data);
        }
      }
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Deixe sua Felicitação
            </h2>
            <p className="wedding-text-secondary font-blancha text-lg">
              Compartilhe seus votos de felicidade para os noivos!
            </p>
          </div>

          {/* Form */}
          <div className="wedding-info-card space-y-6 rounded-3xl p-8">
            <div className="space-y-2 text-left">
              <label
                htmlFor="name"
                className="wedding-text-primary block font-blancha text-base font-medium"
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
                className="block w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-base shadow-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                disabled={isSubmitting}
              />
              <div className="wedding-text-secondary text-right text-sm">
                {name.length}/100 caracteres
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label
                htmlFor="message"
                className="wedding-text-primary block font-blancha text-base font-medium"
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
                className="block w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-base shadow-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                disabled={isSubmitting}
              />
              <div className="wedding-text-secondary text-right text-sm">
                {message.length}/500 caracteres
              </div>
            </div>

            <button
              onClick={(e) => handleSubmit(e as any)}
              disabled={isSubmitting || !name.trim() || !message.trim()}
              className="wedding-button w-full rounded-2xl px-8 py-4 text-white shadow-xl transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="flex items-center justify-center gap-3">
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span className="font-blancha text-lg font-bold">
                      Enviando...
                    </span>
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5" />
                    <span className="font-blancha text-lg font-bold">
                      Enviar Felicitação
                    </span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
