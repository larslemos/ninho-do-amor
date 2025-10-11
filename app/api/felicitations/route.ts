// app/api/felicitations/route.ts

import { type NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const weddingSlug = searchParams.get('weddingSlug');

    if (!token && !weddingSlug) {
      return NextResponse.json(
        { error: 'Token ou weddingSlug é obrigatório' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('felicitations')
      .select('id, name, message, created_at')
      .order('created_at', { ascending: false });

    if (token) {
      // Verify guest exists
      const { data: guest, error: guestError } = await supabase
        .from('guests')
        .select('id, wedding_id')
        .eq('token', token)
        .single();

      if (guestError || !guest) {
        return NextResponse.json(
          { error: 'Convidado não encontrado' },
          { status: 404 }
        );
      }

      // Filter by guest's wedding_id
      query = query.eq('wedding_id', guest.wedding_id);
    } else if (weddingSlug) {
      // Fetch wedding_id from weddings table
      const { data: wedding, error: weddingError } = await supabase
        .from('weddings')
        .select('id')
        .eq('slug', weddingSlug)
        .single();

      if (weddingError || !wedding) {
        return NextResponse.json(
          { error: 'Casamento não encontrado' },
          { status: 404 }
        );
      }

      // Filter by wedding_id
      query = query.eq('wedding_id', wedding.id);
    }

    const { data: felicitations, error } = await query;

    if (error) {
      console.error('Erro ao buscar felicitações:', error);
      return NextResponse.json(
        { error: 'Erro ao carregar felicitações' },
        { status: 500 }
      );
    }

    const formattedFelicitations = felicitations.map((f) => ({
      id: f.id,
      name: f.name,
      message: f.message,
      date: f.created_at,
    }));

    return NextResponse.json(formattedFelicitations);
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token, name, message } = await request.json();

    if (!token || !name || !message) {
      return NextResponse.json(
        { error: 'Token, nome e mensagem são obrigatórios' },
        { status: 400 }
      );
    }

    // Verify guest exists and get wedding_id
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('id, wedding_id')
      .eq('token', token)
      .single();

    if (guestError || !guest || !guest.wedding_id) {
      return NextResponse.json(
        { error: 'Convidado não encontrado ou sem casamento associado' },
        { status: 404 }
      );
    }

    // Create felicitation with wedding_id
    const { data, error } = await supabase
      .from('felicitations')
      .insert({
        guest_token: token,
        name: name.trim(),
        message: message.trim(),
        wedding_id: guest.wedding_id,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar felicitação:', error);
      return NextResponse.json(
        { error: 'Erro ao enviar felicitação' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Felicitação enviada com sucesso! 🎉',
      id: data.id,
    });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
