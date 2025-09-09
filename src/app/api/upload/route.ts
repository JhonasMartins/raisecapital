import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    // Opcional: validação simples de tipo
    const mime = (file as any).type as string | undefined
    if (mime && !mime.startsWith('image/')) {
      return NextResponse.json({ error: 'Apenas imagens são permitidas' }, { status: 400 })
    }

    const bytes = await (file as File).arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadsDir, { recursive: true })

    const originalName = (file as File).name || 'upload'
    const ext = path.extname(originalName) || '.bin'
    const base = path
      .basename(originalName, ext)
      .replace(/[^a-z0-9-_]/gi, '_')
      .slice(0, 50)

    const filename = `${Date.now()}_${base}${ext}`
    const filePath = path.join(uploadsDir, filename)

    await fs.writeFile(filePath, buffer)

    const url = `/uploads/${filename}`
    return NextResponse.json({ url, filename })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Falha no upload' }, { status: 500 })
  }
}