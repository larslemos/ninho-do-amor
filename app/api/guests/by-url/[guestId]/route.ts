//api/guests/by-url/[guestId]/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ guestId: string }> }
) {
  const params = await context.params; // Await params to resolve
  const { guestId } = params;
  const weddingSlug = request.nextUrl.searchParams.get('weddingSlug') || ''; // Get from query

  try {
    if (!guestId) {
      return NextResponse.json(
        { error: 'Guest ID é obrigatório' },
        { status: 400 }
      );
    }

    if (!weddingSlug) {
      return NextResponse.json(
        { error: 'Wedding slug é obrigatório' },
        { status: 400 }
      );
    }

    console.log('Wedding Slug from query:', weddingSlug); // Debug log

    const { data: wedding, error: weddingError } = await supabase
      .from('weddings')
      .select('id')
      .eq('slug', weddingSlug.toLowerCase()) // Case-insensitive match
      .single();

    if (weddingError || !wedding) {
      console.error('Wedding not found:', { weddingSlug, error: weddingError });
      return NextResponse.json(
        { error: 'Casamento não encontrado' },
        { status: 404 }
      );
    }

    const { data: guest, error } = await supabase
      .from('guests')
      .select(
        `
        id,
        nome,
        email,
        status,
        mesa,
        token,
        unique_url,
        rsvp_deadline,
        invitation_sent_at,
        telefone
      `
      )
      .eq('unique_url', guestId)
      .eq('wedding_id', wedding.id)
      .single();

    if (error) {
      console.error('Erro ao buscar convidado:', {
        guestId,
        weddingId: wedding.id,
        error,
      });
      return NextResponse.json(
        { error: 'Convidado não encontrado' },
        { status: 404 }
      );
    }

    const currentDate = new Date('2025-10-04T14:08:00Z'); // Current date and time
    if (guest.rsvp_deadline && new Date(guest.rsvp_deadline) < currentDate) {
      return NextResponse.json(
        {
          guest,
          warning: 'Prazo para confirmação expirado',
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ guest });
  } catch (error) {
    console.error('Erro interno:', { guestId, error });
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
