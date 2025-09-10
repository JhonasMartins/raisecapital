import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as { email?: string; name?: string; source?: string }
    const email = (body.email || '').trim().toLowerCase()
    const name = (body.name || '').trim() || null
    const source = (body.source || '').trim() || null

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'E-mail inválido' }, { status: 400 })
    }

    await query(
      `INSERT INTO newsletter_subscriptions (email, name, source)
       VALUES ($1, $2, $3)
       ON CONFLICT ((lower(email))) DO UPDATE SET email = newsletter_subscriptions.email`,
      [email, name, source]
    )

    // send welcome email (best-effort; failures should not impedir a resposta de sucesso)
    try { await sendWelcomeEmail(email, name ?? undefined) } catch (e) { console.error('sendWelcomeEmail failed:', (e as any)?.message) }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('newsletter POST error:', e?.message)
    return NextResponse.json({ ok: false, error: 'Erro interno' }, { status: 500 })
  }
}