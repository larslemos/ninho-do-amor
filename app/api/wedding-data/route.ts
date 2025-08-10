import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data: weddingData, error } = await supabase.from("wedding_data").select("*").single()

    if (error) {
      console.error("Erro ao buscar dados do casamento:", error)
      return NextResponse.json({ error: "Erro ao carregar dados do casamento" }, { status: 500 })
    }

    // Format the response to match the expected structure
    const formattedData = {
      wedding_details: {
        bride: weddingData.bride,
        groom: weddingData.groom,
        date: weddingData.date,
        day_of_week: weddingData.day_of_week,
        time: weddingData.time,
        venue: weddingData.venue,
        rsvp_numbers: weddingData.rsvp_numbers,
      },
      invitation_text: {
        portuguese: weddingData.invitation_text_portuguese,
      },
      ceremony_types: weddingData.ceremony_types || [],
      wedding_program: weddingData.wedding_program || [],
      design_elements: weddingData.design_elements || {},
    }

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
