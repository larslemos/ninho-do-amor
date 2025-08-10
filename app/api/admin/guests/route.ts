import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// GET - Fetch all guests for admin
export async function GET() {
  try {
    const { data: guests, error } = await supabase.from("guests").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar convidados:", error)
      return NextResponse.json({ error: "Erro ao carregar convidados" }, { status: 500 })
    }

    return NextResponse.json({ guests })
  } catch (error) {
    console.error("Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// POST - Create new guest
export async function POST(request: NextRequest) {
  try {
    const { nome, telefone, email, unique_url, rsvp_deadline } = await request.json()

    if (!nome || !telefone) {
      return NextResponse.json({ error: "Nome e telefone são obrigatórios" }, { status: 400 })
    }

    // Generate token
    const token = `guest-token-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`

    // Prepare guest data
    const guestData = {
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: email?.trim() || null,
      token,
      unique_url: unique_url || token,
      status: "pending",
      rsvp_deadline: rsvp_deadline || null,
    }

    console.log("Creating guest with data:", guestData)

    const { data: guest, error } = await supabase.from("guests").insert(guestData).select().single()

    if (error) {
      console.error("Erro ao criar convidado:", error)

      // Check if it's a column not found error
      if (error.message.includes("telefone")) {
        return NextResponse.json(
          {
            error: "Erro de configuração da base de dados. Por favor, execute a migração da base de dados.",
          },
          { status: 500 },
        )
      }

      return NextResponse.json({ error: "Erro ao criar convidado: " + error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Convidado criado com sucesso!",
      guest,
    })
  } catch (error) {
    console.error("Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
