import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { guestId: string } }) {
  try {
    const { guestId } = params

    if (!guestId) {
      return NextResponse.json({ error: "Guest ID é obrigatório" }, { status: 400 })
    }

    // First try to find by unique_url
    let { data: guest, error } = await supabase.from("guests").select("*").eq("unique_url", guestId).single()

    // If not found by unique_url, try by token (for backward compatibility)
    if (error && error.code === "PGRST116") {
      const { data: guestByToken, error: tokenError } = await supabase
        .from("guests")
        .select("*")
        .eq("token", guestId)
        .single()

      if (tokenError) {
        return NextResponse.json({ error: "Convidado não encontrado" }, { status: 404 })
      }

      guest = guestByToken
    } else if (error) {
      console.error("Erro ao buscar convidado:", error)
      return NextResponse.json({ error: "Convidado não encontrado" }, { status: 404 })
    }

    // Check if invitation is still valid
    if (guest.rsvp_deadline && new Date(guest.rsvp_deadline) < new Date()) {
      return NextResponse.json(
        {
          guest: {
            id: guest.id,
            nome: guest.nome,
            email: guest.email,
            status: guest.status,
            mesa: guest.mesa,
            token: guest.token, // Make sure to include the token
            unique_url: guest.unique_url,
            rsvp_deadline: guest.rsvp_deadline,
          },
          warning: "Prazo para confirmação expirado",
        },
        { status: 200 },
      )
    }

    return NextResponse.json({
      guest: {
        id: guest.id,
        nome: guest.nome,
        email: guest.email,
        status: guest.status,
        mesa: guest.mesa,
        token: guest.token, // Make sure to include the token
        unique_url: guest.unique_url,
        rsvp_deadline: guest.rsvp_deadline,
      },
    })
  } catch (error) {
    console.error("Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
