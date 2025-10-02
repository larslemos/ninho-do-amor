interface EmailTemplate {
  subject: string;
  html: string;
}

interface TemplateData {
  guestName: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  weddingTime: string;
  venue: string;
  invitationUrl: string;
  mesa?: string;
  rsvpDeadline?: string;
  customMessage?: string;
}

export class EmailTemplateService {
  private static getBaseStyles(): string {
    return `
      <style>
        body {
          font-family: 'Georgia', serif;
          line-height: 1.6;
          color: #8B5A3C;
          background: linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%);
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #E11D48 0%, #EC4899 100%);
          color: white;
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 2.5em;
          font-weight: 300;
          letter-spacing: 2px;
        }
        .header p {
          margin: 10px 0 0 0;
          font-size: 1.1em;
          opacity: 0.9;
        }
        .content {
          padding: 40px 30px;
          text-align: center;
        }
        .greeting {
          font-size: 1.4em;
          color: #BE185D;
          margin-bottom: 20px;
        }
        .message {
          font-size: 1.1em;
          line-height: 1.8;
          margin-bottom: 30px;
          color: #8B5A3C;
        }
        .details {
          background: #FDF2F8;
          border-radius: 15px;
          padding: 25px;
          margin: 30px 0;
          border-left: 4px solid #E11D48;
        }
        .details h3 {
          color: #BE185D;
          margin-top: 0;
          font-size: 1.3em;
        }
        .detail-item {
          display: flex;
          align-items: center;
          margin: 15px 0;
          font-size: 1.1em;
        }
        .detail-icon {
          margin-right: 10px;
          font-size: 1.2em;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #E11D48 0%, #EC4899 100%);
          color: white;
          text-decoration: none;
          padding: 18px 40px;
          border-radius: 50px;
          font-size: 1.2em;
          font-weight: 600;
          margin: 20px 0;
          box-shadow: 0 10px 30px rgba(225, 29, 72, 0.3);
        }
        .footer {
          background: #F9FAFB;
          padding: 30px;
          text-align: center;
          color: #6B7280;
          font-size: 0.9em;
        }
        .hearts {
          font-size: 1.5em;
          margin: 20px 0;
        }
        .urgent {
          background: #FEF3C7;
          border: 2px solid #F59E0B;
          border-radius: 10px;
          padding: 15px;
          margin: 20px 0;
        }
        .thank-you {
          background: #D1FAE5;
          border: 2px solid #10B981;
          border-radius: 10px;
          padding: 15px;
          margin: 20px 0;
        }
      </style>
    `;
  }

  private static getHeader(data: TemplateData): string {
    return `
      <div class="header">
        <h1>${data.brideName} & ${data.groomName}</h1>
        <p>Estão se casando!</p>
      </div>
    `;
  }

  private static getFooter(data: TemplateData): string {
    return `
      <div class="footer">
        <p>Com todo o nosso amor,</p>
        <p><strong>${data.brideName} & ${data.groomName}</strong></p>
        <p style="margin-top: 20px; font-size: 0.8em;">
          © 2025 PingDigital - Plataforma de Gestão de Casamentos
        </p>
      </div>
    `;
  }

  private static getWeddingDetails(
    data: TemplateData,
    showMesa = true
  ): string {
    return `
      <div class="details">
        <h3>📅 Detalhes do Casamento</h3>
        <div class="detail-item">
          <span class="detail-icon">📅</span>
          <span><strong>Data:</strong> ${data.weddingDate}</span>
        </div>
        <div class="detail-item">
          <span class="detail-icon">🕐</span>
          <span><strong>Horário:</strong> ${data.weddingTime}</span>
        </div>
        <div class="detail-item">
          <span class="detail-icon">📍</span>
          <span><strong>Local:</strong> ${data.venue}</span>
        </div>
        ${
          data.mesa && showMesa
            ? `
        <div class="detail-item">
          <span class="detail-icon">🪑</span>
          <span><strong>Mesa:</strong> ${data.mesa}</span>
        </div>
        `
            : ''
        }
      </div>
    `;
  }

  // 1. Initial Wedding Invitation
  static getWeddingInvitation(data: TemplateData): EmailTemplate {
    return {
      subject: `💕 Convite de Casamento - ${data.brideName} & ${data.groomName}`,
      html: `
        <!DOCTYPE html>
        <html lang="pt">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Convite de Casamento</title>
          ${this.getBaseStyles()}
        </head>
        <body>
          <div class="container">
            ${this.getHeader(data)}
            
            <div class="content">
              <div class="greeting">
                Olá, ${data.guestName}! 💕
              </div>
              
              <div class="message">
              Com gratidão a Deus, Judy e Helder convidam para o dia especial da celebração do seu casamento civil
              </div>
              
              ${this.getWeddingDetails(data)}
              
              <div class="hearts">💕 ✨ 💕</div>
              
              <p style="font-size: 1.1em; color: #BE185D; margin: 20px 0;">
                Para ver seu convite personalizado e confirmar sua presença:
              </p>
              
              <a href="${data.invitationUrl}" class="cta-button">
                Ver Meu Convite 💌
              </a>
              
              <p style="font-size: 0.95em; color: #8B5A3C; margin-top: 30px;">
                Sua presença é o presente mais precioso que podemos receber. 
                Mal podemos esperar para celebrar este momento especial com você!
              </p>
              
              <div class="hearts">🌹 💍 🌹</div>
            </div>
            
            ${this.getFooter(data)}
          </div>
        </body>
        </html>
      `,
    };
  }

  // 2. RSVP Reminder
  static getRSVPReminder(data: TemplateData): EmailTemplate {
    return {
      subject: `⏰ Lembrete: Confirme sua presença - ${data.brideName} & ${data.groomName}`,
      html: `
        <!DOCTYPE html>
        <html lang="pt">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Lembrete RSVP</title>
          ${this.getBaseStyles()}
        </head>
        <body>
          <div class="container">
            ${this.getHeader(data)}
            
            <div class="content">
              <div class="greeting">
                Olá, ${data.guestName}! 👋
              </div>
              
              <div class="urgent">
                <h3 style="color: #F59E0B; margin-top: 0;">⏰ Lembrete Importante</h3>
                <p style="color: #92400E; margin-bottom: 0;">
                  Ainda não recebemos a confirmação da sua presença para o nosso casamento.
                  ${data.rsvpDeadline ? `Por favor, confirme até <strong>${data.rsvpDeadline}</strong>.` : ''}
                </p>
              </div>
              
              <div class="message">
                Sabemos que a vida pode ser corrida, mas sua resposta é muito importante para nós! 
                Precisamos confirmar o número de convidados para finalizar os preparativos.
              </div>
              
              ${this.getWeddingDetails(data)}
              
              <a href="${data.invitationUrl}" class="cta-button">
                Confirmar Presença Agora 📝
              </a>
              
              <p style="font-size: 0.9em; color: #8B5A3C; margin-top: 30px;">
                Se você já confirmou, pode ignorar este email. Caso contrário, 
                por favor nos ajude confirmando sua presença o quanto antes.
              </p>
              
              <div class="hearts">💕 🙏 💕</div>
            </div>
            
            ${this.getFooter(data)}
          </div>
        </body>
        </html>
      `,
    };
  }

  // 3. RSVP Confirmation Thank You
  static getRSVPConfirmation(data: TemplateData): EmailTemplate {
    return {
      subject: `✅ Presença Confirmada - ${data.brideName} & ${data.groomName}`,
      html: `
        <!DOCTYPE html>
        <html lang="pt">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmação Recebida</title>
          ${this.getBaseStyles()}
        </head>
        <body>
          <div class="container">
            ${this.getHeader(data)}
            
            <div class="content">
              <div class="greeting">
                Obrigado, ${data.guestName}! 🎉
              </div>
              
              <div class="thank-you">
                <h3 style="color: #10B981; margin-top: 0;">✅ Presença Confirmada!</h3>
                <p style="color: #047857; margin-bottom: 0;">
                  Recebemos sua confirmação e estamos muito felizes em saber que você estará conosco 
                  neste dia tão especial!
                </p>
              </div>
              
              <div class="message">
                Sua presença tornará nosso dia ainda mais especial. Estamos ansiosos para celebrar 
                este momento único com pessoas queridas como você!
              </div>
              
              ${this.getWeddingDetails(data)}
              
              <div style="background: #EBF8FF; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <h4 style="color: #1E40AF; margin-top: 0;">📋 Próximos Passos:</h4>
                <ul style="color: #1E3A8A; text-align: left; padding-left: 20px;">
                  <li>Guarde esta data na sua agenda</li>
                  <li>Prepare-se para uma celebração inesquecível</li>
                  <li>Traga muito amor e alegria</li>
                  ${data.mesa ? `<li>Você estará na <strong>${data.mesa}</strong></li>` : ''}
                </ul>
              </div>
              
              <a href="${data.invitationUrl}" class="cta-button">
                Ver Detalhes Completos 📋
              </a>
              
              <div class="hearts">🎊 💕 🎊</div>
            </div>
            
            ${this.getFooter(data)}
          </div>
        </body>
        </html>
      `,
    };
  }

  // 4. Wedding Day Reminder
  static getWeddingDayReminder(data: TemplateData): EmailTemplate {
    return {
      subject: `🎉 É hoje! Casamento ${data.brideName} & ${data.groomName}`,
      html: `
        <!DOCTYPE html>
        <html lang="pt">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>É Hoje!</title>
          ${this.getBaseStyles()}
        </head>
        <body>
          <div class="container">
            <div class="header" style="background: linear-gradient(135deg, #F59E0B 0%, #EAB308 100%);">
              <h1>${data.brideName} & ${data.groomName}</h1>
              <p>🎉 É HOJE! 🎉</p>
            </div>
            
            <div class="content">
              <div class="greeting">
                Bom dia, ${data.guestName}! ☀️
              </div>
              
              <div style="background: #FEF3C7; border: 3px solid #F59E0B; border-radius: 15px; padding: 25px; margin: 20px 0;">
                <h2 style="color: #92400E; margin-top: 0; font-size: 2em;">🎊 O GRANDE DIA CHEGOU! 🎊</h2>
                <p style="color: #92400E; font-size: 1.2em; margin-bottom: 0;">
                  Hoje é o dia do nosso casamento e estamos muito emocionados para celebrar com você!
                </p>
              </div>
              
              <div class="message">
                Depois de tanto planejamento e expectativa, finalmente chegou o dia mais importante das nossas vidas. 
                Sua presença tornará este momento ainda mais especial!
              </div>
              
              ${this.getWeddingDetails(data)}
              
              <div style="background: #DBEAFE; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <h4 style="color: #1E40AF; margin-top: 0;">📍 Informações Importantes:</h4>
                <ul style="color: #1E3A8A; text-align: left; padding-left: 20px;">
                  <li><strong>Chegue com 15 minutos de antecedência</strong></li>
                  <li>Traga um documento de identificação</li>
                  <li>Vista-se adequadamente para a ocasião</li>
                  <li>Prepare-se para muita alegria e emoção!</li>
                  ${data.mesa ? `<li>Você estará na <strong>${data.mesa}</strong></li>` : ''}
                </ul>
              </div>
              
              <div class="hearts">🎉 💒 👰 🤵 💍 🎉</div>
              
              <p style="font-size: 1.1em; color: #BE185D; margin: 30px 0;">
                Nos vemos em algumas horas para a celebração mais importante das nossas vidas!
              </p>
            </div>
            
            ${this.getFooter(data)}
          </div>
        </body>
        </html>
      `,
    };
  }

  // 5. Thank You After Wedding
  static getPostWeddingThankYou(data: TemplateData): EmailTemplate {
    return {
      subject: `💕 Obrigado por tornar nosso dia especial - ${data.brideName} & ${data.groomName}`,
      html: `
        <!DOCTYPE html>
        <html lang="pt">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Obrigado!</title>
          ${this.getBaseStyles()}
        </head>
        <body>
          <div class="container">
            <div class="header" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%);">
              <h1>${data.brideName} & ${data.groomName}</h1>
              <p>Agora casados! 💍</p>
            </div>
            
            <div class="content">
              <div class="greeting">
                Querido(a) ${data.guestName}, 💕
              </div>
              
              <div class="thank-you">
                <h3 style="color: #10B981; margin-top: 0;">🙏 MUITO OBRIGADO!</h3>
                <p style="color: #047857; margin-bottom: 0;">
                  Sua presença em nosso casamento tornou este dia ainda mais especial e inesquecível!
                </p>
              </div>
              
              <div class="message">
                Ainda estamos nas nuvens depois de um dia tão perfeito! Ver você lá, compartilhando 
                nossa alegria, dançando conosco e celebrando nosso amor foi simplesmente maravilhoso.
              </div>
              
              <div style="background: #F0FDF4; border-radius: 15px; padding: 25px; margin: 30px 0; border-left: 4px solid #10B981;">
                <h4 style="color: #166534; margin-top: 0;">✨ Momentos Inesquecíveis</h4>
                <p style="color: #166534;">
                  Cada sorriso, cada abraço, cada palavra carinhosa que recebemos de você ficará 
                  para sempre em nossos corações. Obrigado por fazer parte da nossa história de amor!
                </p>
              </div>
              
              <div class="message">
                ${data.customMessage || 'Agora, como marido e mulher, levamos conosco as bênçãos e o carinho de pessoas especiais como você. Que nossa amizade continue crescendo ao longo dos anos!'}
              </div>
              
              <div style="background: #EBF8FF; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <h4 style="color: #1E40AF; margin-top: 0;">📸 Em breve:</h4>
                <p style="color: #1E3A8A; margin-bottom: 0;">
                  Assim que recebermos as fotos profissionais, compartilharemos os melhores momentos 
                  do nosso dia especial com vocês!
                </p>
              </div>
              
              <div class="hearts">💕 🙏 ✨ 💍 ✨ 🙏 💕</div>
              
              <p style="font-size: 1.1em; color: #BE185D; margin: 30px 0; font-style: italic;">
                "O amor não se vê com os olhos, mas com o coração, e vocês encheram nosso coração de alegria!"
              </p>
            </div>
            
            <div class="footer" style="background: #F0FDF4;">
              <p>Com todo o nosso amor e gratidão,</p>
              <p><strong>Sr. e Sra. ${data.groomName} ❤️</strong></p>
              <p style="margin-top: 20px; font-size: 0.8em;">
                © 2025 PingDigital - Plataforma de Gestão de Casamentos
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }

  // 6. Save the Date
  static getSaveTheDate(data: TemplateData): EmailTemplate {
    return {
      subject: `📅 Save the Date - ${data.brideName} & ${data.groomName}`,
      html: `
        <!DOCTYPE html>
        <html lang="pt">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Save the Date</title>
          ${this.getBaseStyles()}
        </head>
        <body>
          <div class="container">
            <div class="header" style="background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);">
              <h1>${data.brideName} & ${data.groomName}</h1>
              <p>Save the Date! 📅</p>
            </div>
            
            <div class="content">
              <div class="greeting">
                Olá, ${data.guestName}! 💜
              </div>
              
              <div style="background: #F3E8FF; border: 3px solid #8B5CF6; border-radius: 15px; padding: 25px; margin: 20px 0;">
                <h2 style="color: #6B21A8; margin-top: 0; font-size: 2em;">📅 SAVE THE DATE!</h2>
                <p style="color: #6B21A8; font-size: 1.3em; margin-bottom: 0;">
                  <strong>${data.weddingDate}</strong>
                </p>
              </div>
              
              <div class="message">
                Estamos muito animados para anunciar que decidimos nos casar! 
                Você é uma pessoa muito especial em nossas vidas e queremos que faça parte deste momento único.
              </div>
              
              <div style="background: #FDF2F8; border-radius: 15px; padding: 25px; margin: 30px 0;">
                <h3 style="color: #BE185D; margin-top: 0;">💍 Detalhes Preliminares</h3>
                <div class="detail-item">
                  <span class="detail-icon">📅</span>
                  <span><strong>Data:</strong> ${data.weddingDate}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">🕐</span>
                  <span><strong>Horário:</strong> ${data.weddingTime}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">📍</span>
                  <span><strong>Local:</strong> ${data.venue}</span>
                </div>
              </div>
              
              <div class="message">
                Por favor, reserve esta data na sua agenda! O convite formal com todos os detalhes 
                será enviado em breve. Mal podemos esperar para celebrar com você!
              </div>
              
              <div class="hearts">💜 📅 💍 📅 💜</div>
              
              <p style="font-size: 1.1em; color: #BE185D; margin: 30px 0; text-align: center; font-weight: bold;">
                Sua presença será o presente mais precioso!
              </p>
            </div>
            
            ${this.getFooter(data)}
          </div>
        </body>
        </html>
      `,
    };
  }

  // 7. Last Minute Changes
  static getLastMinuteUpdate(data: TemplateData): EmailTemplate {
    return {
      subject: `⚠️ Atualização Importante - ${data.brideName} & ${data.groomName}`,
      html: `
        <!DOCTYPE html>
        <html lang="pt">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Atualização Importante</title>
          ${this.getBaseStyles()}
        </head>
        <body>
          <div class="container">
            <div class="header" style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);">
              <h1>${data.brideName} & ${data.groomName}</h1>
              <p>Atualização Importante ⚠️</p>
            </div>
            
            <div class="content">
              <div class="greeting">
                Olá, ${data.guestName}! 📢
              </div>
              
              <div style="background: #FEF3C7; border: 3px solid #F59E0B; border-radius: 15px; padding: 25px; margin: 20px 0;">
                <h3 style="color: #92400E; margin-top: 0;">⚠️ ATUALIZAÇÃO IMPORTANTE</h3>
                <p style="color: #92400E; margin-bottom: 0;">
                  Tivemos que fazer algumas alterações de última hora em nosso casamento. 
                  Por favor, leia as informações atualizadas abaixo.
                </p>
              </div>
              
              <div class="message">
                ${data.customMessage || 'Devido a circunstâncias imprevistas, precisamos fazer alguns ajustes nos detalhes do nosso casamento. Pedimos desculpas por qualquer inconveniente e agradecemos sua compreensão.'}
              </div>
              
              ${this.getWeddingDetails(data)}
              
              <div style="background: #DBEAFE; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <h4 style="color: #1E40AF; margin-top: 0;">📋 O que mudou:</h4>
                <p style="color: #1E3A8A;">
                  Por favor, verifique todos os detalhes acima cuidadosamente. 
                  Se você tiver alguma dúvida, não hesite em entrar em contato conosco.
                </p>
              </div>
              
              <a href="${data.invitationUrl}" class="cta-button">
                Ver Detalhes Atualizados 📋
              </a>
              
              <div class="message">
                Apesar das mudanças, nossa animação para celebrar com você permanece a mesma! 
                Obrigado pela sua flexibilidade e compreensão.
              </div>
              
              <div class="hearts">💕 🙏 💕</div>
            </div>
            
            ${this.getFooter(data)}
          </div>
        </body>
        </html>
      `,
    };
  }
}

export type EmailTemplateType =
  | 'wedding-invitation'
  | 'rsvp-reminder'
  | 'rsvp-confirmation'
  | 'wedding-day-reminder'
  | 'post-wedding-thank-you'
  | 'save-the-date'
  | 'last-minute-update';

export function getEmailTemplate(
  type: EmailTemplateType,
  data: TemplateData
): EmailTemplate {
  switch (type) {
    case 'wedding-invitation':
      return EmailTemplateService.getWeddingInvitation(data);
    case 'rsvp-reminder':
      return EmailTemplateService.getRSVPReminder(data);
    case 'rsvp-confirmation':
      return EmailTemplateService.getRSVPConfirmation(data);
    case 'wedding-day-reminder':
      return EmailTemplateService.getWeddingDayReminder(data);
    case 'post-wedding-thank-you':
      return EmailTemplateService.getPostWeddingThankYou(data);
    case 'save-the-date':
      return EmailTemplateService.getSaveTheDate(data);
    case 'last-minute-update':
      return EmailTemplateService.getLastMinuteUpdate(data);
    default:
      return EmailTemplateService.getWeddingInvitation(data);
  }
}
