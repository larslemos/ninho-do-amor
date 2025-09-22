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

export async function GET(request: NextRequest) {
  try {
    const weddingSlug = request.nextUrl.searchParams.get('weddingSlug');
    if (!weddingSlug) {
      return NextResponse.json(
        { error: 'Wedding slug is required' },
        { status: 400 }
      );
    }

    const { data: wedding, error: weddingError } = await supabase
      .from('weddings')
      .select('id')
      .eq('slug', weddingSlug)
      .single();

    if (weddingError || !wedding) {
      return NextResponse.json({ error: 'Wedding not found' }, { status: 404 });
    }

    const { data: guests, error } = await supabase
      .from('guests')
      .select('*')
      .eq('wedding_id', wedding.id)
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

export async function POST(request: NextRequest) {
  try {
    const { nome, telefone, email, rsvp_deadline, mesa, weddingSlug } =
      await request.json();

    if (!nome || !telefone || !weddingSlug) {
      return NextResponse.json(
        { error: 'Nome, telefone e wedding slug são obrigatórios' },
        { status: 400 }
      );
    }

    const { data: wedding, error: weddingError } = await supabase
      .from('weddings')
      .select('id')
      .eq('slug', weddingSlug)
      .single();

    if (weddingError || !wedding) {
      return NextResponse.json({ error: 'Wedding not found' }, { status: 404 });
    }

    const token = `guest-token-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const unique_url = generateUniqueUrl(nome);

    const guestData = {
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: email?.trim() || null,
      token,
      unique_url,
      status: 'pending',
      rsvp_deadline: rsvp_deadline || '2025-08-25T23:59:59Z',
      mesa: mesa || null,
      wedding_id: wedding.id,
    };

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

export async function PUT(request: NextRequest) {
  try {
    const {
      guestId,
      nome,
      telefone,
      email,
      mesa,
      status,
      invitation_sent_at,
      rsvp_deadline,
      weddingSlug,
    } = await request.json();

    if (!guestId || !nome || !telefone || !weddingSlug) {
      return NextResponse.json(
        { error: 'Guest ID, nome, telefone e wedding slug são obrigatórios' },
        { status: 400 }
      );
    }

    if (status && !['pending', 'confirmed', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 });
    }

    const { data: wedding, error: weddingError } = await supabase
      .from('weddings')
      .select('id')
      .eq('slug', weddingSlug)
      .single();

    if (weddingError || !wedding) {
      return NextResponse.json({ error: 'Wedding not found' }, { status: 404 });
    }

    const updateData = {
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: email?.trim() || null,
      mesa: mesa?.trim() || null,
      status: status || 'pending',
      invitation_sent_at: invitation_sent_at || null,
      rsvp_deadline: rsvp_deadline || null,
    };

    const { data: guest, error } = await supabase
      .from('guests')
      .update(updateData)
      .eq('id', guestId)
      .eq('wedding_id', wedding.id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar convidado:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar convidado: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Convidado atualizado com sucesso!',
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

export async function PATCH(request: NextRequest) {
  try {
    const { guestId, mesa, weddingSlug } = await request.json();

    if (!guestId || !weddingSlug) {
      return NextResponse.json(
        { error: 'Guest ID e wedding slug são obrigatórios' },
        { status: 400 }
      );
    }

    const { data: wedding, error: weddingError } = await supabase
      .from('weddings')
      .select('id')
      .eq('slug', weddingSlug)
      .single();

    if (weddingError || !wedding) {
      return NextResponse.json({ error: 'Wedding not found' }, { status: 404 });
    }

    const updateData = { mesa: mesa || null };

    const { data: guest, error } = await supabase
      .from('guests')
      .update(updateData)
      .eq('id', guestId)
      .eq('wedding_id', wedding.id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar convidado:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar convidado: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Convidado atualizado com sucesso!',
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

export async function DELETE(request: NextRequest) {
  try {
    const { guestId, weddingSlug } = await request.json();

    if (!guestId || !weddingSlug) {
      return NextResponse.json(
        { error: 'Guest ID e wedding slug são obrigatórios' },
        { status: 400 }
      );
    }

    const { data: wedding, error: weddingError } = await supabase
      .from('weddings')
      .select('id')
      .eq('slug', weddingSlug)
      .single();

    if (weddingError || !wedding) {
      return NextResponse.json({ error: 'Wedding not found' }, { status: 404 });
    }

    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', guestId)
      .eq('wedding_id', wedding.id);

    if (error) {
      console.error('Erro ao excluir convidado:', error);
      return NextResponse.json(
        { error: 'Erro ao excluir convidado: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Convidado excluído com sucesso!' });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
