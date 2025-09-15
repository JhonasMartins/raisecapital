import { betterAuth } from 'better-auth'
import { Pool } from 'pg'
import { getMailer } from './email'

// Usar o mesmo Pool configurado no db.ts
const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export const auth = betterAuth({
  database: {
    provider: 'pg',
    pool: dbPool,
  },
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: process.env.NODE_ENV === 'production',
    sendResetPassword: async ({ user, url }: { user: any, url: string }) => {
      const mailer = getMailer()
      await mailer.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@raisecapital.com.br',
        to: user.email,
        subject: 'Redefinir senha - Raise Capital',
        html: `
          <div style="max-width:600px;margin:0 auto;padding:20px;font-family:system-ui,-apple-system,sans-serif">
            <h2>Redefinir senha</h2>
            <p>Olá! Você solicitou a redefinição de senha para sua conta na Raise Capital.</p>
            <p>Clique no link abaixo para criar uma nova senha:</p>
            <a href="${url}" style="display:inline-block;background:#04a2fa;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin:10px 0">Redefinir senha</a>
            <p>Este link expira em 1 hora. Se você não solicitou esta redefinição, ignore este e-mail.</p>
          </div>
        `
      })
    },
    sendVerificationEmail: async ({ user, url }: { user: any, url: string }) => {
      const mailer = getMailer()
      await mailer.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@raisecapital.com.br',
        to: user.email,
        subject: 'Verificar e-mail - Raise Capital',
        html: `
          <div style="max-width:600px;margin:0 auto;padding:20px;font-family:system-ui,-apple-system,sans-serif">
            <h2>Verificar seu e-mail</h2>
            <p>Bem-vindo(a) à Raise Capital!</p>
            <p>Clique no link abaixo para verificar seu e-mail e ativar sua conta:</p>
            <a href="${url}" style="display:inline-block;background:#04a2fa;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin:10px 0">Verificar e-mail</a>
            <p>Este link expira em 24 horas.</p>
          </div>
        `
      })
    }
  },

  plugins: [],

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },

  cookies: {
    sessionToken: {
      name: 'better-auth.session-token',
      attributes: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      }
    }
  },

  trustedOrigins: [
    process.env.NODE_ENV === 'production' 
      ? 'https://raisecapital.com.br' 
      : 'http://localhost:3000'
  ],
})

export type Session = typeof auth.$Infer.Session