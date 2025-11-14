import { type NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';
import { env } from '@/env';
import { getEmailTemplate, type EmailTemplateType } from '@/lib/email-templates';

// const resend = new Resend(process.env.RESEND_API_KEY);
const resend = new Resend('re_2PmdSzyn_ADsepjenqoiJo4bxkQ8CJsxs');

export async function POST(request: NextRequest) {
  try {
    const {
      guestId,
      method,
      templateType = 'wedding-invitation',
      customMessage,
    } = await request.json();

    // Validate input
    if (!guestId || !method) {
      return NextResponse.json({ error: 'Guest ID e método são obrigatórios' }, { status: 400 });
    }

    if (method !== 'email' && method !== 'sms') {
      return NextResponse.json({ error: "Método deve ser 'email' ou 'sms'" }, { status: 400 });
    }

    if (!['wedding-invitation', 'reminder', 'thank-you'].includes(templateType)) {
      return NextResponse.json({ error: 'Tipo de template inválido' }, { status: 400 });
    }

    // Get guest data
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('*')
      .eq('id', guestId)
      .single();

    if (guestError || !guest) {
      console.error('Erro ao buscar convidado:', guestError);
      return NextResponse.json({ error: 'Convidado não encontrado' }, { status: 404 });
    }

    // Ensure unique_url is set
    if (!guest.unique_url) {
      const unique_url = `guest-${Math.random().toString(36).substring(2, 10)}-${guest.nome
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')}`;
      const { error: updateError } = await supabase
        .from('guests')
        .update({ unique_url })
        .eq('id', guestId);

      if (updateError) {
        console.error('Erro ao atualizar unique_url:', updateError);
        return NextResponse.json(
          { error: 'Erro ao gerar URL única para o convidado' },
          { status: 500 }
        );
      }
      guest.unique_url = unique_url;
    }

    // Generate URLs
    const baseUrl = env.NEXT_PUBLIC_BASE_URL || 'https://pingdigital.online';
    const mainInvitationUrl = `${baseUrl}/?token=${guest.token}`;
    const guestPageUrl = `${baseUrl}/assaeluterio/convidados/${guest.unique_url}`;

    // Initialize notification data
    const notificationData = {
      guest_id: guest.id,
      notification_type: method,
      recipient: '',
      subject: '',
      message: '',
      status: 'pending' as const,
      sent_at: new Date().toISOString(),
    };

    if (method === 'email') {
      if (!guest.email) {
        return NextResponse.json({ error: 'Email do convidado não encontrado' }, { status: 400 });
      }

      // Prepare template data
      const templateData = {
        guestName: guest.nome,
        brideName: 'Assa',
        groomName: 'Eleutério',
        weddingDate: 'Sábado, 30 de Agosto de 2025',
        weddingTime: '13:00 (1 PM)',
        venue: 'Hotel Polana',
        invitationUrl: mainInvitationUrl,
        guestPageUrl,
        mesa: guest.mesa || 'A ser atribuída',
        rsvpDeadline: guest.rsvp_deadline
          ? new Date(guest.rsvp_deadline).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })
          : 'Por favor, confirme o mais rápido possível',
        customMessage: customMessage || '',
      };

      // Get email template
      const emailTemplate = getEmailTemplate(templateType as EmailTemplateType, templateData);

      notificationData.recipient = guest.email;
      notificationData.subject = emailTemplate.subject;
      notificationData.message = emailTemplate.html;

      // Send email
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: 'Assa & Eleutério <onboarding@resend.dev>',
        to: [guest.email],
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        reply_to: 'assa.e.eleuterio@pingdigital.online',
      });

      if (emailError) {
        console.error('Erro ao enviar email via Resend:', emailError);
        notificationData.status = 'failed';

        await supabase.from('guest_notifications').insert({
          ...notificationData,
          error_message: JSON.stringify(emailError),
        });

        if (emailError.message?.includes('Not authorized')) {
          return NextResponse.json(
            {
              error:
                'Erro de autorização do email. Verifique a chave API do Resend ou o domínio configurado.',
              details: emailError.message,
            },
            { status: 401 }
          );
        }

        return NextResponse.json(
          { error: 'Erro ao enviar email', details: emailError.message },
          { status: 500 }
        );
      }

      console.log('Email enviado com sucesso:', emailData);
      notificationData.status = 'sent';
    } else if (method === 'sms') {
      const phoneNumber = guest.telefone || guest.phone || guest.telephone;
      if (!phoneNumber) {
        return NextResponse.json(
          { error: 'Telefone do convidado não encontrado' },
          { status: 400 }
        );
      }

      // SMS message template
      notificationData.recipient = phoneNumber;
      notificationData.message = `
💕 Olá ${guest.nome}!

Você está convidado(a) para o casamento de Assa & Eleutério!

📅 30/08/2025 às 13:00
📍 Hotel Polana
${guest.mesa ? `Mesa: ${guest.mesa}` : ''}

Acesse seu convite:
${mainInvitationUrl}

${guest.rsvp_deadline ? `Confirme até ${new Date(guest.rsvp_deadline).toLocaleDateString('pt-BR')}` : 'Confirme o mais rápido possível'}! 🎉

Com amor,
Assa & Eleutério 💍
      `.trim();

      // TODO: Implement SMS sending with a service like Twilio
      console.log('SMS seria enviado para:', phoneNumber);
      console.log('Mensagem:', notificationData.message);
      notificationData.status = 'sent'; // Placeholder: update when SMS is implemented
    }

    // Save notification record
    const { data: notification, error: notificationError } = await supabase
      .from('guest_notifications')
      .insert(notificationData)
      .select()
      .single();

    if (notificationError) {
      console.error('Erro ao salvar notificação:', notificationError);
      return NextResponse.json(
        {
          error: 'Erro ao salvar registro de notificação',
          details: notificationError.message,
        },
        { status: 500 }
      );
    }

    // Update guest invitation_sent_at
    const { error: updateError } = await supabase
      .from('guests')
      .update({ invitation_sent_at: new Date().toISOString() })
      .eq('id', guestId);

    if (updateError) {
      console.error('Erro ao atualizar invitation_sent_at:', updateError);
      return NextResponse.json(
        {
          error: 'Erro ao atualizar status do convite',
          details: updateError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `${templateType === 'wedding-invitation' ? 'Convite' : 'Mensagem'} enviado via ${method === 'email' ? 'email' : 'SMS'} com sucesso!`,
      notification_id: notification.id,
      invitation_url: mainInvitationUrl,
      guest_page_url: guestPageUrl,
      template_used: templateType,
    });
  } catch (error) {
    console.error('Erro interno ao processar notificação:', error);
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
