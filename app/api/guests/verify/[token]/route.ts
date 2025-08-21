import { type NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        { error: "Token é obrigatório" },
        { status: 400 }
      );
    }

    const { data: guest, error } = await supabase
      .from("guests")
      .select("*")
      .eq("token", token)
      .single();

    if (error) {
      console.error("Erro ao buscar convidado:", error);
      return NextResponse.json(
        { error: "Convidado não encontrado" },
        { status: 404 }
      );
    }

    // Check if invitation is still valid
    if (guest.rsvp_deadline && new Date(guest.rsvp_deadline) < new Date()) {
      return NextResponse.json(
        {
          error: "Convite expirado",
          convidado: {
            id: guest.id,
            nome: guest.nome,
            email: guest.email,
            status: guest.status,
            mesa: guest.mesa,
            unique_url: guest.unique_url,
            token: guest.token,
            rsvp_deadline: guest.rsvp_deadline
              ? new Date(guest.rsvp_deadline).toISOString()
              : null,
          },
        },
        { status: 410 }
      );
    }

    return NextResponse.json({
      convidado: {
        id: guest.id,
        nome: guest.nome,
        email: guest.email,
        status: guest.status,
        mesa: guest.mesa,
        unique_url: guest.unique_url,
        token: guest.token,
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
