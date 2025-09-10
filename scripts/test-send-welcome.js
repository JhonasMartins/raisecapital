require('dotenv').config({ path: '.env.local' })
require('dotenv').config()
const nodemailer = require('nodemailer')

async function main() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM || user
  const to = process.env.TEST_TO || user

  if (!user || !pass) {
    console.error('Missing SMTP_USER/SMTP_PASS in env')
    process.exit(1)
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })

  const info = await transporter.sendMail({
    from,
    to,
    subject: 'Teste de boas-vindas — Raise Capital',
    text: 'Este é um teste de envio via SMTP configurado.',
    html: '<p>Este é um teste de envio via <strong>SMTP</strong> configurado.</p>'
  })

  console.log('Mensagem enviada:', info.messageId)
}

main().catch((e) => { console.error('Erro ao enviar email de teste:', e?.message); process.exit(1) })