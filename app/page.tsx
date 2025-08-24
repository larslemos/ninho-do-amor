// app/page.tsx

'use client';

import WeddingHero from '@/components/WeddingHero';
import ConfirmationSection from '@/components/ConfirmationSection';
import FelicitationForm from '@/components/FelicitationForm';
import FelicitationList from '@/components/FelicitationList';
import GiftSection from '@/components/GiftSection';
import CountdownSection from '@/components/CountdownSection';
import FooterNavComponent from '@/components/FooterNavComponent';
import { useEffect, useState } from 'react';
import type { Guest, WeddingData } from '@/types/wedding';
import { track } from '@vercel/analytics';

export default function Home() {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingGuest, setIsLoadingGuest] = useState(false);

  track('Pagina Aberta');

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get('token');
    setToken(urlToken);

    // Always load wedding data
    fetchWeddingData();

    // Only try to fetch guest data if token is provided
    if (urlToken) {
      setIsLoadingGuest(true);
      fetchGuestData(urlToken);
    }
  }, []);

  const fetchGuestData = async (token: string) => {
    try {
      const response = await fetch(`/api/guests/verify/${token}`);
      const data = await response.json();

      if (response.ok) {
        setGuest(data.convidado || null);
      } else {
        console.warn('Guest not found for token:', data.error);
      }
    } catch (err) {
      console.error('Erro ao buscar dados do convidado:', err);
    } finally {
      setIsLoadingGuest(false);
    }
  };

  const fetchWeddingData = async () => {
    try {
      const response = await fetch('/api/wedding-data');
      const data = await response.json();

      if (response.ok) {
        setWeddingData(data);
      } else {
        setError(data.error || 'Erro ao carregar dados do casamento');
      }
    } catch (err) {
      console.error('Erro ao buscar dados do casamento:', err);
      setError('Erro ao carregar dados do casamento');
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 font-serif">
        <div className="w-[400px] rounded-xl border border-rose-200 bg-white p-6 text-center shadow-lg">
          <div className="mb-4 text-4xl">⚠️</div>
          <h2 className="mb-4 text-xl font-semibold text-rose-700">
            Erro ao Carregar
          </h2>
          <p className="text-rose-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-white transition-colors hover:bg-rose-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!weddingData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 font-serif">
        <div className="w-[400px] rounded-xl bg-white p-6 text-center shadow-lg">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-rose-600"></div>
          <h2 className="mb-4 text-xl font-semibold text-rose-700">
            Preparando o convite...
          </h2>
          <p className="text-rose-500">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 font-serif">
      <div className="flex flex-col items-center justify-center px-6 py-9">
        {/* Main Wedding Hero */}
        <WeddingHero
          guest={guest}
          weddingData={weddingData}
          isLoadingGuest={isLoadingGuest}
        />

        {/* Countdown Section */}
        <CountdownSection weddingData={weddingData} />

        {/* Confirmation Section - Only show if we have a token */}
        {token && (
          <ConfirmationSection
            guest={guest}
            token={token}
            weddingData={weddingData}
            isLoadingGuest={isLoadingGuest}
          />
        )}
        {/* Gift Section */}
        <GiftSection weddingData={weddingData} />

        {/* Felicitation Form - Only show if we have a token */}
        {token && <FelicitationForm />}

        {/* Felicitation List - Only show if we have a token */}
        {token && <FelicitationList />}

        {/* Guest Access Info - Show if no token */}
        {!token && (
          <div className="mt-6 w-[400px] rounded-xl border border-rose-200 bg-rose-100 p-6 text-center shadow-lg">
            <div className="mb-3 text-3xl">💌</div>
            <h3 className="mb-2 text-lg font-semibold text-rose-700">
              Acesso Personalizado
            </h3>
            <p className="mb-4 text-sm text-rose-600">
              Convidados com link personalizado podem confirmar presença e
              deixar felicitações.
            </p>
            <div className="space-y-1 text-xs text-rose-500">
              <p>• ✅ Confirmação de presença</p>
              <p>• 💌 Mensagens de felicitação</p>
              <p>• 🪑 Informações da mesa</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <FooterNavComponent />
      </div>
    </div>
  );
}
