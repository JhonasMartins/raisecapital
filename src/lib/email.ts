import nodemailer from 'nodemailer'

let _transporter: nodemailer.Transporter | null = null

export function getMailer() {
  if (_transporter) return _transporter

  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!user || !pass) {
    // Fallback seguro para desenvolvimento: não envia e-mail real, mas não falha
    _transporter = nodemailer.createTransport({ jsonTransport: true })
    return _transporter
  }

  _transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user, pass },
  })

  return _transporter
}

function buildWelcomeEmail(name?: string, opts?: { baseUrl?: string; linkBaseUrl?: string }) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@example.com'
  const displayName = name?.trim() || ''
  const defaultBase = 'https://raisecapital.com.br'
  const envBase = (process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || defaultBase).replace(/\/$/, '')
  const assetBase = (opts?.baseUrl || envBase).replace(/\/$/, '')
  const linkBase = (opts?.linkBaseUrl || envBase).replace(/\/$/, '')
  const homepageUrl = `${linkBase}/`

  const brandPrimary = '#04a2fa'
  const brandPrimaryDark = '#176d9f'

  const subject = 'Bem-vindo(a) à Raise Capital — boas-vindas e próximos passos'
  const text = `Olá${displayName ? `, ${displayName}` : ''}!

Obrigado por se inscrever na nossa newsletter. A partir de agora você receberá:
- Oportunidades de investimento selecionadas
- Conteúdos e análises do nosso time
- Atualizações e novidades da plataforma

Comece visitando a Raise Capital: ${homepageUrl}

Abraços,
Equipe Raise Capital`

  const html = `
  <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0;color:transparent">Bem-vindo(a) à Raise Capital — obrigado por se inscrever! Confira oportunidades e conteúdos selecionados.</div>
  <div style="margin:0;background:#f3f4f6;padding:24px 0">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
            <!-- Header: faixa cinza claro com apenas a logo -->
            <tr>
              <td align="left" style="background:#f1f5f9;padding:16px 20px">
                <img src="${assetBase}/logo_tmp.png" alt="Raise Capital" height="28" style="display:block;height:28px;width:auto;border:0;outline:none;text-decoration:none" />
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:28px 24px 8px 24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f172a;line-height:1.6">
                <h1 style="margin:0 0 10px 0;font-size:22px;line-height:1.25;color:#0b132b">Bem-vindo(a) à Raise Capital</h1>
                <p style="margin:0 0 12px 0;font-size:15px">Olá${displayName ? `, <strong>${escapeHtml(displayName)}</strong>` : ''}! Obrigado por se inscrever na nossa newsletter.</p>
                <p style="margin:0 0 12px 0;font-size:15px">Você passará a receber por e-mail:</p>
                <ul style="margin:0 0 16px 18px;padding:0;font-size:15px">
                  <li style="margin:6px 0">Oportunidades de investimento selecionadas</li>
                  <li style="margin:6px 0">Conteúdos e análises do nosso time</li>
                  <li style="margin:6px 0">Atualizações e novidades da plataforma</li>
                </ul>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0 6px 0">
                  <tr>
                    <td>
                      <a href="${homepageUrl}" target="_blank" rel="noopener" style="display:inline-block;background:${brandPrimary};color:#ffffff;text-decoration:none;border-radius:10px;padding:12px 18px;font-weight:600;box-shadow:0 6px 18px ${brandPrimary}59">Conhecer a plataforma</a>
                    </td>
                  </tr>
                </table>
                <div style="margin-top:22px;padding:12px 14px;border:1px solid #e5e7eb;border-radius:10px;background:#f8fafc">
                  <p style="margin:0;font-size:13px;color:#334155">Dica: adicione <strong>${escapeHtml(from)}</strong> aos seus contatos para garantir que nossos e-mails cheguem à sua caixa de entrada.</p>
                </div>
                <p style="margin:18px 0 6px 0;font-size:15px">Abraços,<br/>Equipe Raise Capital</p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding:16px 24px;background:#fbfdff;border-top:1px solid #eef2f7;color:#64748b;font-size:12px">
                <p style="margin:0 0 6px 0">Você recebeu este e-mail porque se inscreveu na newsletter da Raise Capital.</p>
                <p style="margin:0">Se não foi você, basta ignorar este e-mail.</p>
              </td>
            </tr>
          </table>
          <div style="text-align:center;margin:10px 0 0 0;color:#94a3b8;font-size:11px">© ${new Date().getFullYear()} Raise Capital</div>
        </td>
      </tr>
    </table>
  </div>`

  return { from, subject, text, html }
}

export function getWelcomeEmailHtml(name?: string, opts?: { baseUrl?: string; linkBaseUrl?: string }) {
  return buildWelcomeEmail(name, opts).html
}

export async function sendWelcomeEmail(to: string, name?: string) {
  const transporter = getMailer()
  const { from, subject, text, html } = buildWelcomeEmail(name)
  await transporter.sendMail({ from, to, subject, text, html })
}

function buildInvestorWelcomeEmail(name?: string, opts?: { baseUrl?: string; linkBaseUrl?: string }) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@example.com'
  const displayName = name?.trim() || ''
  const defaultBase = 'https://raisecapital.com.br'
  const envBase = (process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || defaultBase).replace(/\/$/, '')
  const assetBase = (opts?.baseUrl || envBase).replace(/\/$/, '')
  const linkBase = (opts?.linkBaseUrl || envBase).replace(/\/$/, '')
  const dashboardUrl = `${linkBase}/`

  const brandPrimary = '#04a2fa'
  const brandPrimaryDark = '#176d9f'

  const subject = 'Bem-vindo(a) à Raise Capital — Sua conta de investidor foi criada!'
  const text = `Olá${displayName ? `, ${displayName}` : ''}!

Parabéns! Sua conta de investidor na Raise Capital foi criada com sucesso.

Agora você pode:
- Explorar oportunidades de investimento exclusivas
- Acompanhar seu portfólio
- Receber análises detalhadas de projetos
- Conectar-se com empreendedores inovadores

Acesse seu dashboard: ${dashboardUrl}

Abraços,
Equipe Raise Capital`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <div style="background: linear-gradient(135deg, ${brandPrimary} 0%, ${brandPrimaryDark} 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Raise Capital</h1>
      <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Plataforma de Investimentos</p>
    </div>
    
    <div style="padding: 40px 30px;">
      <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Bem-vindo(a)${displayName ? `, ${escapeHtml(displayName)}` : ''}!</h2>
      
      <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">Parabéns! Sua conta de investidor na Raise Capital foi criada com sucesso.</p>
      
      <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Agora você pode:</h3>
        <ul style="color: #475569; margin: 0; padding-left: 20px; line-height: 1.8;">
          <li>Explorar oportunidades de investimento exclusivas</li>
          <li>Acompanhar seu portfólio em tempo real</li>
          <li>Receber análises detalhadas de projetos</li>
          <li>Conectar-se com empreendedores inovadores</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${escapeHtml(dashboardUrl)}" style="display: inline-block; background-color: ${brandPrimary}; color: white; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 16px;">Acessar Dashboard</a>
      </div>
      
      <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">Se você tiver dúvidas, nossa equipe está sempre disponível para ajudar.</p>
    </div>
    
    <div style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="color: #64748b; font-size: 14px; margin: 0;">Abraços,<br><strong>Equipe Raise Capital</strong></p>
    </div>
  </div>
</body>
</html>`

  return { subject, text, html }
}

export async function sendInvestorWelcomeEmail(to: string, name?: string) {
  const mailer = getMailer()
  const { subject, text, html } = buildInvestorWelcomeEmail(name)
  await mailer.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to, subject, text, html })
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}