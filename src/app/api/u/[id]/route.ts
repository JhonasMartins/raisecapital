import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(_req: Request, context: { params: { id: string } }) {
  try {
    const id = context.params?.id

    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const { rows } = await query<{ mime: string | null; data: Buffer }>(
      'SELECT mime, data FROM files WHERE id = $1',
      [id]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 })
    }

    const file = rows[0]
    const mime = file.mime || 'application/octet-stream'

    return new NextResponse(file.data as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': mime,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (err) {
    console.error('GET /api/u/[id] error:', err)
    return NextResponse.json({ error: 'Falha ao obter arquivo' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, context: { params: { id: string } }) {
  try {
    const id = context.params?.id
    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const { rows } = await query<{ id: string }>('DELETE FROM files WHERE id = $1 RETURNING id', [id])
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, id })
  } catch (err) {
    console.error('DELETE /api/u/[id] error:', err)
    return NextResponse.json({ error: 'Falha ao deletar arquivo' }, { status: 500 })
  }
}