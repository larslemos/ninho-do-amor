import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { Resend } from "resend"
import { getEmailTemplate, type EmailTemplateType } from "@/lib/email-templates"

const resend = new Resend("re_2PmdSzyn_ADsepjenqoiJo4bxkQ8CJsxs")

export async function POST(request: NextRequest) {
  try {
    const { guestId, method, templateType = "wedding-invitation", customMessage } = await request.json()

    if (!guestId || !method) {
      return NextResponse.json({ error: "Guest ID e método são obrigatórios" }, { status: 400 })
    }

    // Get guest data
    const { data: guest, error: guestError } = await supabase.from("guests").select("*").eq("id", guestId).single()

    if (guestError || !guest) {
      return NextResponse.json({ error: "Convidado não encontrado" }, { status: 404 })
    }

    // Generate invitation URL using the correct domain
    const baseUrl = "https://v0-ninho-do-amor.vercel.app"
    const invitationUrl = `${baseUrl}/assaeluterio/convidados/${guest.unique_url || guest.token}`

    const notificationData = {
      guest_id: guest.id,
      notification_type: method,
      recipient: "",
      subject: "",
      message: "",
      status: "pending" as const,
    }

    if (method === "email") {
      if (!guest.email) {
        return NextResponse.json({ error: "Email do convidado não encontrado" }, { status: 400 })
      }

      // Prepare template data
      const templateData = {
        guestName: guest.nome,
        brideName: "Assa",
        groomName: "Eleutério",
        weddingDate: "Sábado, 30 de Agosto de 2025",
        weddingTime: "13:00 (1 PM)",
        venue: "Hotel Polana",
        invitationUrl,
        mesa: guest.mesa,
        rsvpDeadline: guest.rsvp_deadline ? new Date(guest.rsvp_deadline).toLocaleDateString("pt-BR") : undefined,
        customMessage,
      }

      // Get the appropriate email template
      const emailTemplate = getEmailTemplate(templateType as EmailTemplateType, templateData)

      notificationData.recipient = guest.email
      notificationData.subject = emailTemplate.subject
      notificationData.message = emailTemplate.html

      try {
        // Send email using Resend with the default onboarding domain
        const { data: emailData, error: emailError } = await resend.emails.send({
          from: "Assa & Eleutério <onboarding@resend.dev>",
          to: [guest.email],
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          reply_to: "noreply@example.com",
        })

        if (emailError) {
          console.error("Resend error:", emailError)
          notificationData.status = "failed"

          await supabase.from("guest_notifications").insert({
            ...notificationData,
            error_message: JSON.stringify(emailError),
          })

          if (emailError.message?.includes("Not authorized")) {
            return NextResponse.json(
              {
                error: "Erro de autorização do email. Usando domínio padrão do Resend.",
                details: emailError.message,
              },
              { status: 500 },
            )
          }

          return NextResponse.json({ error: "Erro ao enviar email: " + emailError.message }, { status: 500 })
        }

        console.log("Email sent successfully:", emailData)
        notificationData.status = "sent"
      } catch (error) {
        console.error("Error sending email:", error)
        notificationData.status = "failed"

        await supabase.from("guest_notifications").insert({
          ...notificationData,
          error_message: error instanceof Error ? error.message : "Unknown error",
        })

        return NextResponse.json(
          { error: "Erro ao enviar email: " + (error instanceof Error ? error.message : "Erro desconhecido") },
          { status: 500 },
        )
      }
    } else if (method === "sms") {
      const phoneNumber = guest.telefone || guest.phone || guest.telephone

      if (!phoneNumber) {
        return NextResponse.json({ error: "Telefone do convidado não encontrado" }, { status: 400 })
      }

      notificationData.recipient = phoneNumber
      notificationData.message = `
💕 Olá ${guest.nome}!

Você está convidado(a) para o casamento de Assa & Eleutério! 

📅 30/08/2025 às 13:00
📍 Hotel Polana

Veja seu convite personalizado:
${invitationUrl}

Confirme sua presença! 🎉

Com amor,
Assa & Eleutério 💍
      `.trim()

      console.log("SMS would be sent to:", phoneNumber)
      console.log("Message:", notificationData.message)
      notificationData.status = "sent"
    }

    // Save notification record
    const { data: notification, error: notificationError } = await supabase
      .from("guest_notifications")
      .insert({
        ...notificationData,
        sent_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (notificationError) {
      console.error("Erro ao salvar notificação:", notificationError)
      return NextResponse.json({ error: "Erro ao salvar notificação" }, { status: 500 })
    }

    // Update guest invitation_sent_at
    await supabase.from("guests").update({ invitation_sent_at: new Date().toISOString() }).eq("id", guestId)

    return NextResponse.json({
      message: `${templateType === "wedding-invitation" ? "Convite" : "Email"} enviado via ${method === "email" ? "email" : "SMS"} com sucesso!`,
      notification_id: notification.id,
      invitation_url: invitationUrl,
      template_used: templateType,
    })
  } catch (error) {
    console.error("Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
