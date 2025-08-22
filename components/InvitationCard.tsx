'use client';

import type { Guest, WeddingData } from '@/types/wedding';

interface InvitationCardProps {
  guest: Guest | null;
  weddingData: WeddingData;
}

export default function InvitationCard({
  guest,
  weddingData,
}: InvitationCardProps) {
  const { bride, groom, date, day_of_week, time, venue, rsvp_numbers } =
    weddingData.wedding_details;
  const { portuguese } = weddingData.invitation_text;

  return (
    <div className="bg-brown-100 mt-6 w-[400px] rounded-xl p-6 text-center shadow-lg">
      <div className="mb-6">
        <h1 className="text-brown-700 mb-2 text-3xl font-bold">💍</h1>
        <h2 className="text-brown-700 mb-4 text-2xl font-semibold">
          Convite de Casamento
        </h2>
      </div>

      <div className="text-brown-600 space-y-3">
        <p className="text-lg leading-relaxed">{portuguese}</p>

        <div className="border-brown-300 mt-4 border-t pt-4">
          <p className="text-brown-700 mb-2 text-xl font-semibold">
            {bride} & {groom}
          </p>

          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">📅 Data:</span> {day_of_week},{' '}
              {date}
            </p>
            <p>
              <span className="font-semibold">🕐 Horário:</span> {time}
            </p>
            <p>
              <span className="font-semibold">📍 Local:</span> {venue}
            </p>
            <p>
              <span className="font-semibold">📞 RSVP:</span>{' '}
              {rsvp_numbers.join(' ou ')}
            </p>
          </div>
        </div>
      </div>

      {guest ? (
        <div className="bg-brown-200 mt-6 rounded-lg p-4">
          <p className="text-brown-700 mb-2 text-lg font-semibold">
            Olá, {guest.nome}! 👋
          </p>

          {guest.status && (
            <p
              className={`mb-2 text-sm font-medium ${
                guest.status.toLowerCase() === 'confirmed'
                  ? 'text-green-700'
                  : 'text-red-700'
              }`}
            >
              Status:{' '}
              {guest.status === 'confirmed' ? 'Confirmado ✓' : 'Pendente'}
            </p>
          )}

          {guest.mesa && (
            <p className="text-brown-600 mb-1 text-sm">
              <span className="font-semibold">🪑 Mesa:</span> {guest.mesa}
            </p>
          )}

          {guest.validade && (
            <p className="text-brown-500 text-xs">
              Válido até:{' '}
              {new Date(guest.validade * 1000).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
      ) : (
        <div className="mt-6 rounded-lg bg-yellow-100 p-4">
          <p className="text-brown-600">
            Carregando informações do convidado...
          </p>
        </div>
      )}
    </div>
  );
}
