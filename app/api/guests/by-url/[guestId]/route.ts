//api/admin/guests/by-url/[guestId]/route.ts

import { type NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { guestId: string } } // Updated type to resolve params directly
) {
  try {
    const guestId = params.guestId; // Direct access since params is already resolved
    const weddingSlug = request.nextUrl.searchParams.get('weddingSlug');

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

    // Fetch the wedding ID based on the slug
    const { data: wedding, error: weddingError } = await supabase
      .from('weddings')
      .select('id')
      .eq('slug', weddingSlug)
      .single();

    if (weddingError || !wedding) {
      console.error('Wedding not found:', { weddingSlug, error: weddingError });
      return NextResponse.json(
        { error: 'Casamento não encontrado' },
        { status: 404 }
      );
    }

    // const { data: guest, error } = await supabase
    //   .from('guests')
    //   .select('*')
    //   .eq('unique_url', guestId)
    //   .eq('wedding_id', wedding.id)
    //   .single();

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

    // Check if RSVP deadline has passed
    const currentDate = new Date('2025-11-02T22:11:00Z'); // 10:11 PM CAT, November 2, 2025
    if (guest.rsvp_deadline && new Date(guest.rsvp_deadline) < currentDate) {
      return NextResponse.json(
        {
          guest: {
            id: guest.id,
            nome: guest.nome,
            email: guest.email,
            status: guest.status,
            mesa: guest.mesa,
            token: guest.token,
            unique_url: guest.unique_url,
            rsvp_deadline: guest.rsvp_deadline
              ? new Date(guest.rsvp_deadline).toISOString()
              : null,
            invitation_sent_at: guest.invitation_sent_at
              ? new Date(guest.invitation_sent_at).toISOString()
              : null,
            telefone: guest.telefone,
          },
          warning: 'Prazo para confirmação expirado',
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      guest: {
        id: guest.id,
        nome: guest.nome,
        email: guest.email,
        status: guest.status,
        mesa: guest.mesa,
        token: guest.token,
        unique_url: guest.unique_url,
        rsvp_deadline: guest.rsvp_deadline
          ? new Date(guest.rsvp_deadline).toISOString()
          : null,
        invitation_sent_at: guest.invitation_sent_at
          ? new Date(guest.invitation_sent_at).toISOString()
          : null,
        telefone: guest.telefone,
      },
    });
  } catch (error) {
    console.error('Erro interno:', { guestId: params.guestId, error });
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
