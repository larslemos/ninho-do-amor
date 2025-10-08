// app/[wedding]/convidados/[guestId]/metadata.tsx
import { getWeddingBySlug } from '@/lib/api-handler';
import { WeddingData } from '@/types/wedding';

export async function generateMetadata({
  params,
}: {
  params: { wedding: string; guestId: string };
}) {
  const weddingSlug = params.wedding;
  let weddingData: WeddingData | null = null;

  try {
    const data = await getWeddingBySlug(weddingSlug);
    weddingData = data || { slug: weddingSlug };
  } catch (err) {
    console.error('Error fetching wedding data for metadata:', err);
    weddingData = { slug: weddingSlug };
  }

  const bride = weddingData.bride || 'Noiva';
  const groom = weddingData.groom || 'Noivo';

  return {
    title: `${bride} & ${groom} - Convite de Casamento`,
    description: `Convite de casamento de ${bride} e ${groom}. Junte-se a nós para celebrar este momento especial!`,
    openGraph: {
      title: `${bride} & ${groom} - Convite de Casamento`,
      description: `Convite de casamento de ${bride} e ${groom}. Junte-se a nós para celebrar este momento especial!`,
      images: [
        {
          url: `/images/${weddingSlug}-wedding.jpg`,
          alt: `${bride} & ${groom} Wedding`,
        },
      ],
      siteName: 'Ninho Do Amor',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${bride} & ${groom} - Convite de Casamento`,
      description: `Convite de casamento de ${bride} e ${groom}. Junte-se a nós para celebrar este momento especial!`,
      images: [`/images/${weddingSlug}-wedding.jpg`],
    },
  };
}
