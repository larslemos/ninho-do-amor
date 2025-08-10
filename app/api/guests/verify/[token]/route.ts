import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    const { token } = params

    if (!token) {
      return NextResponse.json({ error: "Token é obrigatório" }, { status: 400 })
    }

    const { data: guest, error } = await supabase.from("guests").select("*").eq("token", token).single()

    if (error) {
      console.error("Erro ao buscar convidado:", error)
      return NextResponse.json({ error: "Convidado não encontrado" }, { status: 404 })
    }

    // Check if invitation is still valid
    if (guest.validade && new Date(guest.validade) < new Date()) {
      return NextResponse.json({ error: "Convite expirado" }, { status: 410 })
    }

    return NextResponse.json({
      convidado: {
        nome: guest.nome,
        status: guest.status,
        mesa: guest.mesa,
        validade: guest.validade ? new Date(guest.validade).getTime() / 1000 : null,
      },
    })
  } catch (error) {
    console.error("Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
