import nodemailer from 'nodemailer'

let _transporter: nodemailer.Transporter | null = null

export function getMailer() {
  if (_transporter) return _transporter

  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!user || !pass) {
    throw new Error('SMTP_USER/SMTP_PASS are not set')
  }

  _transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user, pass },
  })

  return _transporter
}

export async function sendWelcomeEmail(to: string, name?: string) {
  const transporter = getMailer()
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@example.com'
  const displayName = name?.trim() || ''

  const subject = 'Bem-vindo(a) à Raise Capital'
  const text = `Olá${displayName ? `, ${displayName}` : ''}!
\nObrigado por se inscrever na nossa newsletter. Em breve você receberá novidades sobre ofertas e conteúdos exclusivos.\n\nAbraços,\nEquipe Raise Capital`
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;color:#0f172a">
      <h2 style="margin:0 0 12px 0;font-weight:600;color:#0b132b">Bem-vindo(a) à Raise Capital</h2>
      <p>Olá${displayName ? `, <strong>${escapeHtml(displayName)}</strong>` : ''}!</p>
      <p>Obrigado por se inscrever na nossa newsletter. Em breve você receberá novidades sobre ofertas, atualizações e conteúdos exclusivos.</p>
      <p style="margin-top:16px">Abraços,<br/>Equipe Raise Capital</p>
    </div>
  `

  await transporter.sendMail({ from, to, subject, text, html })
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}