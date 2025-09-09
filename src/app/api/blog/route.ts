import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { slugify } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const limitParam = searchParams.get('limit')
    const parsed = Number.parseInt(limitParam || '10', 10)
    const limit = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), 50) : 10

    const db = getDb()
    const { rows } = await db.query(
      `SELECT titulo, slug, resumo, capa, data_publicacao FROM blog
       ORDER BY data_publicacao DESC, created_at DESC
       LIMIT $1`,
      [limit]
    )

    const items = rows.map((r: any) => ({
      title: r.titulo as string,
      slug: r.slug as string,
      excerpt: r.resumo as string,
      cover: (r.capa ?? '/file.svg') as string,
      date:
        typeof r.data_publicacao === 'string'
          ? r.data_publicacao
          : r.data_publicacao?.toISOString?.().slice(0, 10) ?? '',
    }))

    return NextResponse.json({ items })
  } catch (e: any) {
    console.error('GET /api/blog error', e)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, excerpt, date, author, cover, categories, body: paragraphs, bodyHtml } = body as {
      title: string
      excerpt: string
      date: string
      author: string
      cover: string
      categories: string[]
      body: string[]
      bodyHtml?: string
    }

    if (!title || !excerpt || !date || !author || !cover) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })
    }

    const db = getDb()
    const slug = slugify(title)

    // Inserir no esquema já existente da tabela blog
    const result = await db.query(
      `INSERT INTO blog (titulo, slug, resumo, data_publicacao, autor, capa, categorias, corpo, corpo_html)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (slug) DO UPDATE SET
         titulo = EXCLUDED.titulo,
         resumo = EXCLUDED.resumo,
         data_publicacao = EXCLUDED.data_publicacao,
         autor = EXCLUDED.autor,
         capa = EXCLUDED.capa,
         categorias = EXCLUDED.categorias,
         corpo = EXCLUDED.corpo,
         corpo_html = EXCLUDED.corpo_html,
         updated_at = NOW()
       RETURNING id;`,
      [
        title,
        slug,
        excerpt,
        date,
        author,
        cover,
        categories ?? [],
        paragraphs ?? [],
        bodyHtml ?? null,
      ]
    )

    return NextResponse.json({ ok: true, id: result.rows?.[0]?.id, slug })
  } catch (e: any) {
    console.error('POST /api/blog error', e)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}