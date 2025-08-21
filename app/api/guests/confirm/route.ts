// app/api/guests/confirm/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { token, status } = await request.json();

    if (!token || !status) {
      return NextResponse.json(
        { error: "Token e status são obrigatórios" },
        { status: 400 }
      );
    }

    if (!["confirmed", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    // First verify the guest exists
    const { data: existingGuest, error: fetchError } = await supabase
      .from("guests")
      .select("id, nome")
      .eq("token", token)
      .single();

    if (fetchError || !existingGuest) {
      return NextResponse.json(
        { error: "Convidado não encontrado" },
        { status: 404 }
      );
    }

    // Update the guest status
    const { data, error } = await supabase
      .from("guests")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("token", token)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar status:", error);
      return NextResponse.json(
        { error: "Erro ao confirmar presença" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message:
        status === "confirmed"
          ? "Presença confirmada com sucesso!"
          : "Resposta registrada com sucesso!",
      status: data.status,
    });
  } catch (error) {
    console.error("Erro interno:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
