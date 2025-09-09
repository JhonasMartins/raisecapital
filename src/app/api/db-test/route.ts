import { NextRequest } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const { rows } = await query<{ now: string }>('SELECT NOW() as now')
    return Response.json({ ok: true, now: rows[0]?.now })
  } catch (e: any) {
    console.error('DB connection error', e)
    return Response.json({ ok: false, error: e?.message || 'Connection failed' }, { status: 500 })
  }
}