// app/components/judyhelder/JHWeddingReligious.tsx
'use client';

import { useEffect, useRef } from 'react';
import { Heart, Church, Pen, MapPin, Clock9Icon } from 'lucide-react';

interface JHWeddingReligiousProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JHWeddingReligious({
  isOpen,
  onClose,
}: JHWeddingReligiousProps) {
  const religiousRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      religiousRef.current &&
      !religiousRef.current.contains(event.target as Node)
    ) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={religiousRef}
        className="wedding-hero-card relative w-full max-w-md rounded-2xl p-4 shadow-2xl sm:max-w-lg md:max-w-xl"
      >
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-lg text-white hover:text-gray-300"
        >
          ✕
        </button>
        <h3 className="wedding-text-secondary font-fira-sans mb-2 text-sm font-bold sm:text-base md:text-lg">
          Programa do Casamento Religioso
        </h3>
        <div className="overflow-x-auto text-left">
          <p className="wedding-text-primary font-fira-sans mb-2 space-y-6 text-sm sm:text-base">
            <Clock9Icon className="inline h-4 w-4 sm:h-5 sm:w-5" /> 09:00
          </p>
          <p className="wedding-text-primary font-fira-sans mb-2 space-y-6 text-sm sm:text-base">
            <MapPin className="inline h-4 w-4 sm:h-5 sm:w-5" /> Igreja Universal
            do Reino de Deus - Mantendene
          </p>

          <h4 className="wedding-text-secondary font-fira-sans mb-2 mt-4 text-sm font-semibold sm:text-base">
            Ordem da Cerimónia
          </h4>
          <ul className="wedding-text-primary font-fira-sans mb-10 space-y-6 text-sm sm:text-base">
            <li className="flex items-center">
              <Church className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Entrada dos
              padrinhos
            </li>
            <li className="flex items-center">
              <Church className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Entrada do noivo
            </li>
            <li className="flex items-center">
              <Church className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Entrada da noiva
            </li>
            <li className="flex items-center">
              <Heart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Palavra e bênção
              do pastor
            </li>
            <li className="flex items-center">
              <Heart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Troca de votos e
              alianças
            </li>
            <li className="flex items-center">
              <Pen className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Assinatura dos
              documentos
            </li>
            <li className="flex items-center">
              <Heart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Bênção final e
              saída dos noivos
            </li>
          </ul>

          <p className="wedding-text-primary font-fira-sans text-sm italic sm:text-base">
            “Assim já não são dois, mas uma só carne. Portanto, o que Deus uniu,
            ninguém o separe.” — Mateus 19:6
          </p>
        </div>
      </div>
    </div>
  );
}
