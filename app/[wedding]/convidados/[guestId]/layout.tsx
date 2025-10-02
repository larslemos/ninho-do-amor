// app/[wedding]/convidados/[guestId]/layout.tsx

import { AudioProvider } from '@/hooks/use-audio';
import AudioControl from '@/components/AudioControl';
import { getWeddingBySlug } from '@/lib/api-handler';

export default async function WeddingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { wedding: string; guestId: string };
}) {
  const weddingData = await getWeddingBySlug(params.wedding); // Ensure this returns WeddingData

  if (
    !weddingData ||
    !weddingData.design_elements ||
    !weddingData.design_elements.branding
  ) {
    console.error('Wedding data not found or invalid:', {
      wedding: params.wedding,
      weddingData,
    });
    return (
      <div className="font-blancha">
        Erro: Dados do casamento não encontrados
      </div>
    ); // Improved fallback with Blancha font
  }

  return (
    <AudioProvider>
      <AudioControl />
      {/* Layout UI */}
      <main
        className={`font-blancha ${weddingData.design_elements.branding}-theme`}
      >
        {children}
      </main>
    </AudioProvider>
  );
}
