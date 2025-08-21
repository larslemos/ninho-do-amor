import { type NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ guestId: string }> }
) {
  try {
    const { guestId } = await params;

    if (!guestId) {
      return NextResponse.json(
        { error: "Guest ID é obrigatório" },
        { status: 400 }
      );
    }

    const { data: guest, error } = await supabase
      .from("guests")
      .select("*")
      .eq("unique_url", guestId)
      .single();

    if (error) {
      console.error("Erro ao buscar convidado:", error);
      return NextResponse.json(
        { error: "Convidado não encontrado" },
        { status: 404 }
      );
    }

    // Check if RSVP deadline has passed
    if (guest.rsvp_deadline && new Date(guest.rsvp_deadline) < new Date()) {
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
          },
          warning: "Prazo para confirmação expirado",
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
      },
    });
  } catch (error) {
    console.error("Erro interno:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
