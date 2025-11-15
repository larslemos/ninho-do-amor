// app/api/admin/invitations/route.ts

import { type NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { env } from '@/env';

export async function POST(request: NextRequest) {
  try {
    const { guestId, action, weddingSlug } = await request.json();

    if (!guestId || !action || !weddingSlug) {
      return NextResponse.json(
        { error: 'Guest ID, action, and weddingSlug are required' },
        { status: 400 }
      );
    }

    const validActions = [
      'sendWhatsApp',
      'markAsSent',
      'sendReminder',
      'confirm',
      'markWhatsAppDelivered',
    ];
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('*')
      .eq('id', guestId)
      .single();

    if (guestError || !guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    let updateData = {};
    let responseMessage = '';

    switch (action) {
      case 'sendWhatsApp':
        updateData = { invite_sent_count: (guest.invite_sent_count || 0) + 1 };
        responseMessage = 'Convite enviado via WhatsApp';
        break;
      case 'markAsSent':
        updateData = {
          confirm_sent_count: (guest.confirm_sent_count || 0) + 1,
        };
        responseMessage = 'Confirmado manualmente';
        break;
      case 'sendReminder':
        updateData = { reminder_count: (guest.reminder_count || 0) + 1 };
        responseMessage = 'Lembrete enviado';
        break;
      case 'confirm':
        updateData = { status: 'confirmed' };
        responseMessage = 'Presença confirmada';
        break;
      case 'markWhatsAppDelivered':
        updateData = {
          whatsapp_delivered_count: (guest.whatsapp_delivered_count || 0) + 1,
        };
        responseMessage = 'WhatsApp marcado como entregue';
        break;
    }

    const { error: updateError } = await supabase
      .from('guests')
      .update(updateData)
      .eq('id', guestId);

    if (updateError) {
      console.error('Error updating guest:', updateError);
      return NextResponse.json({ error: 'Error updating guest' }, { status: 500 });
    }

    // Generate WhatsApp URLs for sendWhatsApp and sendReminder
    if (action === 'sendWhatsApp' || action === 'sendReminder') {
      const phoneNumber = guest.telefone || guest.phone || guest.telephone || '';
      if (!phoneNumber) {
        return NextResponse.json({ error: 'Phone number not available' }, { status: 400 });
      }

      const formattedPhone = phoneNumber.replace(/[\s()-]/g, '').replace(/^(\+?)/, '+');

      if (!/^\+\d{9,15}$/.test(formattedPhone)) {
        return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 });
      }

      const baseUrl = env.NEXT_PUBLIC_BASE_URL || 'https://pingdigital.online';
      const inviteUrl = `${baseUrl}/${weddingSlug}/convidados/${guest.unique_url}`;

      const emojis = {
        smile: 'smile',
        ring: 'ring',
        bride: 'bride',
        groom: 'groom',
      };

      let message = '';
      if (action === 'sendWhatsApp') {
        message = `Olá ${guest.nome}! ${emojis.smile}\n\nCom muito carinho partilhamos o convite para o casamento de Judy & Helder. ${emojis.bride}${emojis.ring}${emojis.groom}\n\n*Passo 1*: Clique no link abaixo para ver o convite completo ${emojis.ring}\n*Passo 2*: Na secção "Confirmação de Presença", selecione ✅ ou ❌\n\n${inviteUrl}\n\nCom carinho,\nOs noivos!`;
      } else {
        const deadline = guest.rsvp_deadline
          ? new Date(guest.rsvp_deadline).toLocaleDateString('pt-MZ')
          : 'em breve';
        message = `Olá ${guest.nome}! ${emojis.smile}\n\nLembramos com carinho que aguardamos a sua confirmação até *${deadline}*.\n\n${inviteUrl}\n\nCom carinho,\nOs noivos!`;
      }

      const encodedMessage = encodeURIComponent(message);

      const whatsappMobileUrl = `https://wa.me/${formattedPhone.replace(
        /^\+/,
        ''
      )}?text=${encodedMessage}`;

      const whatsappWebUrl = `https://web.whatsapp.com/send/?phone=${formattedPhone}&text=${encodedMessage}&type=phone_number&app_absent=0`;

      return NextResponse.json({
        message: responseMessage,
        whatsappMobileUrl,
        whatsappWebUrl,
        guest: { ...guest, ...updateData },
      });
    }

    return NextResponse.json({
      message: responseMessage,
      guest: { ...guest, ...updateData },
    });
  } catch (error) {
    console.error('Internal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
