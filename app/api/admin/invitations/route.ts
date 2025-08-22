// app/api/admin/invitations/route.ts

import { type NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { env } from '@/env';

export async function POST(request: NextRequest) {
  try {
    const { guestId, action } = await request.json();

    if (!guestId || !action) {
      return NextResponse.json(
        { error: 'Guest ID and action are required' },
        { status: 400 }
      );
    }

    // Validate action
    const validActions = [
      'sendWhatsApp',
      'markAsSent',
      'sendReminder',
      'confirm',
    ];
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Fetch guest to ensure it exists
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('*')
      .eq('id', guestId)
      .single();

    if (guestError || !guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    // Handle actions
    let updateData = {};
    let responseMessage = '';

    switch (action) {
      case 'sendWhatsApp':
        updateData = { invite_sent_count: (guest.invite_sent_count || 0) + 1 };
        responseMessage = 'WhatsApp invite count incremented';
        break;
      case 'markAsSent':
        updateData = {
          confirm_sent_count: (guest.confirm_sent_count || 0) + 1,
        };
        responseMessage = 'Confirm sent count incremented';
        break;
      case 'sendReminder':
        updateData = { reminder_count: (guest.reminder_count || 0) + 1 };
        responseMessage = 'Reminder count incremented';
        break;
      case 'confirm':
        updateData = { status: 'confirmed' };
        responseMessage = 'Guest marked as confirmed';
        break;
    }

    // Update guest in Supabase
    const { error: updateError } = await supabase
      .from('guests')
      .update(updateData)
      .eq('id', guestId);

    if (updateError) {
      console.error('Error updating guest:', updateError);
      return NextResponse.json(
        { error: 'Error updating guest' },
        { status: 500 }
      );
    }

    // For WhatsApp actions, prepare and return WhatsApp URL
    if (action === 'sendWhatsApp' || action === 'sendReminder') {
      const phoneNumber =
        guest.telefone || guest.phone || guest.telephone || '';
      if (!phoneNumber) {
        return NextResponse.json(
          { error: 'Phone number not available' },
          { status: 400 }
        );
      }

      const formattedPhone = phoneNumber
        .replace(/[\s()-]/g, '')
        .replace(/^(\+?)/, '+');

      if (!/^\+\d{9,15}$/.test(formattedPhone)) {
        return NextResponse.json(
          { error: 'Invalid phone number format' },
          { status: 400 }
        );
      }

      const baseUrl = env.NEXT_PUBLIC_BASE_URL || 'https://pingdigital.online';
      const emojis = {
        smile: '\u{1F60A}', // 😊
        ring: '\u{1F48D}', // 💍
        bride: '\u{1F470}\u{1F3FD}\u{200D}\u{2640}\u{FE0F}', // 👰🏽‍♀️
        groom: '\u{1F935}\u{1F3FE}\u{200D}\u{2642}\u{FE0F}', // 🤵🏾‍♂️
      };

      let message = '';
      if (action === 'sendWhatsApp') {
        message = `Olá ${guest.nome} ! ${emojis.smile}\nCom muito carinho partilhamos o convite para o casamento de Assa & Eleutério. ${emojis.bride}${emojis.ring}${emojis.groom}\n\nPor favor, confirmem a vossa presença acessando: ${baseUrl}/assaeluterio/convidados/${guest.unique_url}\n\nCom carinho,\nOs noivos!`;
      } else if (action === 'sendReminder') {
        message = `Olá ${guest.nome} ! ${emojis.smile}\nLembramos com carinho que aguardamos a vossa confirmação para o casamento de Assa & Eleutério. ${emojis.bride}${emojis.ring}${emojis.groom}\n\nPor favor, confirmem até ${new Date(guest.rsvp_deadline).toLocaleDateString('pt-BR')}: ${baseUrl}/assaeluterio/convidados/${guest.unique_url}\n\nCom carinho,\nOs noivos!`;
      }

      let encodedMessage;
      try {
        encodedMessage = encodeURIComponent(message);
      } catch (error) {
        console.error('Error encoding message:', error);
        const fallbackMessage =
          action === 'sendWhatsApp'
            ? `Olá ${guest.nome}! :)\nCom muito carinho partilhamos o convite para o casamento de Assa & Eleutério. [Noiva][Anel][Noivo]\n\nPor favor, confirmem a vossa presença acessando: ${baseUrl}/assaeluterio/convidados/${guest.unique_url}\n\nCom carinho,\nOs noivos!`
            : `Olá ${guest.nome}! :)\nLembramos com carinho que aguardamos a vossa confirmação para o casamento de Assa & Eleutério. [Noiva][Anel][Noivo]\n\nPor favor, confirmem até ${new Date(guest.rsvp_deadline).toLocaleDateString('pt-BR')}: ${baseUrl}/assaeluterio/convidados/${guest.unique_url}\n\nCom carinho,\nOs noivos!`;
        encodedMessage = encodeURIComponent(fallbackMessage);
      }

      const whatsappUrl = `https://web.whatsapp.com/send/?phone=${formattedPhone}&text=${encodedMessage}&type=phone_number&app_absent=0`;

      return NextResponse.json({
        message: responseMessage,
        whatsappUrl,
        guest: { ...guest, ...updateData },
      });
    }

    return NextResponse.json({
      message: responseMessage,
      guest: { ...guest, ...updateData },
    });
  } catch (error) {
    console.error('Internal error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
