import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const db = getDb()
  const { rows } = await db.query(
    `SELECT c.id, c.name, c.message, c.created_at
     FROM blog_comments c
     JOIN blog b ON b.id = c.blog_id
     WHERE b.slug = $1
     ORDER BY c.created_at DESC`,
    [params.slug]
  )
  return NextResponse.json({ items: rows })
}

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  try {
    const db = getDb()
    const { rows } = await db.query(`SELECT id FROM blog WHERE slug = $1 LIMIT 1`, [params.slug])
    if (!rows[0]) return NextResponse.json({ error: 'Artigo não encontrado' }, { status: 404 })
    const blogId = rows[0].id as number
    const body = await req.json()
    const { name, message } = body as { name: string; message: string }
    if (!name || !message) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })

    await db.query(
      `INSERT INTO blog_comments (blog_id, name, message) VALUES ($1, $2, $3)`,
      [blogId, name, message]
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}