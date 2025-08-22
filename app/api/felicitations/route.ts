import { type NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch felicitations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token é obrigatório' },
        { status: 400 }
      );
    }

    // Verify guest exists
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('id')
      .eq('token', token)
      .single();

    if (guestError || !guest) {
      return NextResponse.json(
        { error: 'Convidado não encontrado' },
        { status: 404 }
      );
    }

    // Fetch all felicitations (public for all guests)
    const { data: felicitations, error } = await supabase
      .from('felicitations')
      .select('id, name, message, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar felicitações:', error);
      return NextResponse.json(
        { error: 'Erro ao carregar felicitações' },
        { status: 500 }
      );
    }

    // Format the response
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

// POST - Create felicitation
export async function POST(request: NextRequest) {
  try {
    const { token, name, message } = await request.json();

    if (!token || !name || !message) {
      return NextResponse.json(
        { error: 'Token, nome e mensagem são obrigatórios' },
        { status: 400 }
      );
    }

    // Verify guest exists
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('id, nome')
      .eq('token', token)
      .single();

    if (guestError || !guest) {
      return NextResponse.json(
        { error: 'Convidado não encontrado' },
        { status: 404 }
      );
    }

    // Create felicitation
    const { data, error } = await supabase
      .from('felicitations')
      .insert({
        guest_token: token,
        name: name.trim(),
        message: message.trim(),
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
