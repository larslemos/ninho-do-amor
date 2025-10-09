// app/components/judyhelder/JHWeddingTimeline.tsx
'use client';

import { useEffect, useRef } from 'react';
import { FileText, HandHeart, Pen, Cake, Wine, Church } from 'lucide-react';

interface JHWeddingTimelineProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JHWeddingTimeline({
  isOpen,
  onClose,
}: JHWeddingTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      timelineRef.current &&
      !timelineRef.current.contains(event.target as Node)
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
        ref={timelineRef}
        className="wedding-hero-card relative w-full max-w-md rounded-2xl p-4 shadow-2xl sm:max-w-lg md:max-w-xl"
      >
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-lg text-white hover:text-gray-300"
        >
          ✕
        </button>
        <h3 className="wedding-text-secondary mb-2 font-quintella text-xs font-bold sm:text-base md:text-lg">
          Cronograma de Casasamento
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  13:00
                </td>
                <td className="wedding-text-primary font-fira-sans py-2 text-xs sm:text-base">
                  Chegada dos convidados
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  13:10
                </td>
                <td className="wedding-text-primary font-fira-sans py-2 text-xs sm:text-base">
                  Música ambiente e welcome drink
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  13:30
                </td>
                <td className="wedding-text-primary font-fira-sans flex items-center py-2 text-xs sm:text-base">
                  <Church className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Início da
                  cerimónia civil (jardim)
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  13:35
                </td>
                <td className="wedding-text-primary font-fira-sans py-2 text-xs sm:text-base">
                  Entrada dos padrinhos
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  13:40
                </td>
                <td className="wedding-text-primary font-fira-sans py-2 text-xs sm:text-base">
                  Entrada do noivo
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  13:45
                </td>
                <td className="wedding-text-primary font-fira-sans py-2 text-xs sm:text-base">
                  Entrada da noiva
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  13:50
                </td>
                <td className="wedding-text-primary font-fira-sans py-2 text-xs sm:text-base">
                  Troca de alianças e votos do casal
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  14:00
                </td>
                <td className="wedding-text-primary font-fira-sans flex items-center py-2 text-xs sm:text-base">
                  <Pen className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Assinatura
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  14:10
                </td>
                <td className="wedding-text-primary font-fira-sans py-2 text-xs sm:text-base">
                  Sessão fotográfica outdoor com os convidados
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  15:00
                </td>
                <td className="wedding-text-primary font-fira-sans py-2 text-xs sm:text-base">
                  Entrada dos convidados na sala principal
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  15:20
                </td>
                <td className="wedding-text-primary font-fira-sans py-2 text-xs sm:text-base">
                  Chegada dos noivos na sala principal
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  15:30
                </td>
                <td className="wedding-text-primary font-fira-sans flex items-center py-2 text-xs sm:text-base">
                  <HandHeart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Oração
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  15:40
                </td>
                <td className="wedding-text-primary font-fira-sans py-2 text-xs sm:text-base">
                  Boas-vindas dos padrinhos
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  15:45
                </td>
                <td className="wedding-text-primary font-fira-sans py-2 text-xs sm:text-base">
                  Boas-vindas da família da noiva
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  15:50
                </td>
                <td className="wedding-text-primary font-fira-sans py-2 text-xs sm:text-base">
                  Boas-vindas da família do noivo
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  16:00
                </td>
                <td className="wedding-text-primary font-fira-sans flex items-center py-2 text-xs sm:text-base">
                  <Wine className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Copo de água
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  18:00
                </td>
                <td className="wedding-text-primary font-fira-sans py-2 text-xs sm:text-base">
                  Animação com o convidado especial
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  19:00
                </td>
                <td className="wedding-text-primary font-fira-sans py-2 text-xs sm:text-base">
                  História do casal
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  19:10
                </td>
                <td className="wedding-text-primary font-fira-sans py-2 text-xs sm:text-base">
                  Mensagem dos irmãos/colegas e amigos
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  19:30
                </td>
                <td className="wedding-text-primary font-fira-sans py-2 text-xs sm:text-base">
                  Abertura da sala
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  19:40
                </td>
                <td className="wedding-text-primary font-fira-sans py-2 text-xs sm:text-base">
                  Dança com pais e padrinhos
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  19:50
                </td>
                <td className="wedding-text-primary font-fira-sans py-2 text-xs sm:text-base">
                  Pista aberta
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  21:00
                </td>
                <td className="wedding-text-primary font-fira-sans py-2 text-xs sm:text-base">
                  Entrega do buquê
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  21:30
                </td>
                <td className="wedding-text-primary font-fira-sans flex items-center py-2 text-xs sm:text-base">
                  <Cake className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Corte do bolo,
                  entrega dos brindes e saída dos noivos
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="wedding-text-primary font-fira-sans py-2 pr-2 text-xs sm:text-base">
                  22:20
                </td>
                <td className="wedding-text-primary font-fira-sans py-2 text-xs sm:text-base">
                  Encerramento
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
