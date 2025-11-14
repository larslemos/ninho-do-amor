'use client';

import React from 'react';
import { Table as TableIcon } from 'lucide-react';
import clsx from 'clsx';

interface TableCardProps {
  /** Table number or name (e.g. "1", "VIP", "Bride & Groom") */
  number: string;
  /** Guests sitting at this table */
  guests: {
    id: string;
    nome: string;
    status: 'pending' | 'confirmed' | 'rejected';
  }[];
  /** Optional custom label instead of “Bride & Groom” */
  customLabel?: string;
}

/**
 * Table card that looks exactly like the design you posted.
 */
export default function TableCard({ number, guests, customLabel }: TableCardProps) {
  const label = customLabel ?? (number === 'Bride & Groom' ? 'Bride & Groom' : '');

  return (
    <div
      className={clsx(
        'relative flex flex-col items-center justify-start',
        'w-64 rounded-3xl border-2 border-dashed border-gray-300',
        'bg-white p-6 shadow-lg transition-shadow hover:shadow-xl'
      )}
    >
      {/* ---------- Table title ---------- */}
      <div className="mb-4 flex w-full items-center justify-center">
        <TableIcon className="mr-2 h-6 w-6 text-gray-800" />
        <h2 className="font-sacramento text-5xl font-bold text-gray-900">Table</h2>
      </div>

      {/* ---------- Optional label (Bride & Groom, VIP, …) ---------- */}
      {label && (
        <h3 className="font-playfair mb-6 text-center text-2xl font-bold text-gray-800">{label}</h3>
      )}

      {/* ---------- Guest list ---------- */}
      <ul className="w-full space-y-2 text-center">
        {guests.map((guest) => (
          <li
            key={guest.id}
            className={clsx(
              'font-quicksand text-lg leading-tight text-gray-800',
              guest.status === 'confirmed' && 'text-green-700',
              guest.status === 'rejected' && 'text-red-700',
              guest.status === 'pending' && 'text-yellow-700'
            )}
          >
            {guest.nome}
          </li>
        ))}
      </ul>

      {/* ---------- Empty-state placeholder ---------- */}
      {guests.length === 0 && (
        <p className="mt-4 text-sm italic text-gray-400">Nenhum convidado alocado ainda</p>
      )}
    </div>
  );
}
