//api/admin/guests/route.ts

import { type NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const generateUniqueUrl = (nome: string) => {
  const randomId = Math.random().toString(36).substring(2, 10);
  const nameSlug = nome
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  return `${randomId}-${nameSlug}`;
};

// GET - Fetch all guests for admin
export async function GET() {
  try {
    const { data: guests, error } = await supabase
      .from('guests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar convidados:', error);
      return NextResponse.json(
        { error: 'Erro ao carregar convidados' },
        { status: 500 }
      );
    }

    return NextResponse.json({ guests });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Create new guest
export async function POST(request: NextRequest) {
  try {
    const { nome, telefone, email, rsvp_deadline } = await request.json();

    if (!nome || !telefone) {
      return NextResponse.json(
        { error: 'Nome e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    // Generate token and unique_url
    const token = `guest-token-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const unique_url = generateUniqueUrl(nome);

    // Prepare guest data
    const guestData = {
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: email?.trim() || null,
      token,
      unique_url,
      status: 'pending',
      rsvp_deadline: rsvp_deadline || '2025-08-25T23:59:59Z',
    };

    console.log('Creating guest with data:', guestData);

    const { data: guest, error } = await supabase
      .from('guests')
      .insert(guestData)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar convidado:', error);
      if (error.message.includes('telefone')) {
        return NextResponse.json(
          {
            error:
              'Erro de configuração da base de dados. Por favor, execute a migração da base de dados.',
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { error: 'Erro ao criar convidado: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Convidado criado com sucesso!',
      guest,
    });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a guest
export async function DELETE(request: NextRequest) {
  try {
    const { guestId } = await request.json();

    if (!guestId) {
      return NextResponse.json(
        { error: 'Guest ID é obrigatório' },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('guests').delete().eq('id', guestId);

    if (error) {
      console.error('Erro ao excluir convidado:', error);
      return NextResponse.json(
        { error: 'Erro ao excluir convidado: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Convidado excluído com sucesso!',
    });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
