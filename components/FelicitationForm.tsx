'use client';

import type React from 'react';
import { useState } from 'react';

export default function FelicitationForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = new URLSearchParams(window.location.search).get('token');

    if (!token) {
      setStatus('Token não encontrado');
      return;
    }

    if (!name.trim() || !message.trim()) {
      setStatus('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    setStatus(null);

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
        setStatus(data.message || 'Mensagem enviada com sucesso! 🎉');
        setName('');
        setMessage('');
      } else {
        throw new Error(data.error || 'Erro no servidor');
      }
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setStatus('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 w-[400px] rounded-xl border border-rose-200 bg-rose-100 p-6 text-center shadow-lg">
      <div className="mb-4">
        <h2 className="mb-2 text-xl font-semibold text-rose-700">
          💌 Deixe sua Felicitação
        </h2>
        <p className="text-sm text-rose-500">
          Compartilhe seus votos de felicidade para os noivos!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-left">
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-rose-600"
          >
            Seu Nome e Apelido *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            className="w-full rounded-lg border border-rose-300 p-3 transition-colors focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
            placeholder="Ex.: António João"
            disabled={loading}
          />
        </div>

        <div className="text-left">
          <label
            htmlFor="message"
            className="mb-1 block text-sm font-medium text-rose-600"
          >
            Mensagem de Felicitação *
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            maxLength={500}
            className="w-full resize-none rounded-lg border border-rose-300 p-3 transition-colors focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
            placeholder="Escreva sua mensagem de felicitação para os noivos..."
            disabled={loading}
          />
          <div className="mt-1 text-right text-xs text-rose-400">
            {message.length}/500 caracteres
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !name.trim() || !message.trim()}
          className="w-full rounded-lg bg-yellow-600 px-4 py-3 font-semibold text-white shadow-md transition-colors hover:bg-yellow-700 hover:shadow-lg disabled:bg-yellow-400"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
              Enviando...
            </div>
          ) : (
            'Enviar Felicitação 💝'
          )}
        </button>
      </form>

      {status && (
        <div
          className={`mt-4 rounded-lg p-3 text-sm ${
            status.includes('sucesso')
              ? 'border border-green-200 bg-green-100 text-green-700'
              : 'border border-red-200 bg-red-100 text-red-700'
          }`}
        >
          {status}
        </div>
      )}
    </div>
  );
}
