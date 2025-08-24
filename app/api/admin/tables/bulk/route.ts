import { type NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    // Fetch guests with non-null mesa values
    const { data: guests, error: guestError } = await supabase
      .from('guests')
      .select('mesa, companions')
      .not('mesa', 'is', null);

    if (guestError) {
      console.error('Error fetching guests:', guestError);
      return NextResponse.json(
        { error: 'Erro ao carregar convidados: ' + guestError.message },
        { status: 500 }
      );
    }

    // Group guests by mesa and calculate total capacity (guests + companions)
    const tableMap = new Map<string, number>();
    for (const guest of guests) {
      if (guest.mesa) {
        const currentCount = tableMap.get(guest.mesa) || 0;
        const companions = guest.companions || 0;
        tableMap.set(guest.mesa, currentCount + 1 + companions);
      }
    }

    // Convert to array of table objects
    const tablesToInsert = Array.from(tableMap.entries()).map(
      ([name, capacity]) => ({
        name,
        capacity,
      })
    );

    if (tablesToInsert.length === 0) {
      return NextResponse.json(
        { message: 'Nenhuma mesa encontrada para criar' },
        { status: 200 }
      );
    }

    // Insert or update tables
    const { error: insertError } = await supabase
      .from('tables')
      .upsert(tablesToInsert, { onConflict: 'name' });

    if (insertError) {
      console.error('Error inserting tables:', insertError);
      return NextResponse.json(
        { error: 'Erro ao criar mesas: ' + insertError.message },
        { status: 500 }
      );
    }

    // Fetch updated tables
    const { data: tables, error: fetchError } = await supabase
      .from('tables')
      .select('*')
      .order('name', { ascending: true });

    if (fetchError) {
      console.error('Error fetching tables:', fetchError);
      return NextResponse.json(
        { error: 'Erro ao carregar mesas: ' + fetchError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Mesas criadas com sucesso!',
      tables,
    });
  } catch (error) {
    console.error('Internal error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
