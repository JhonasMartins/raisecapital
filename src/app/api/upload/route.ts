import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    // Validação simples de tipo: permitir imagens e PDFs
    const mime = file.type
    const allowed = !mime || mime.startsWith('image/') || mime === 'application/pdf'
    if (!allowed) {
      return NextResponse.json({ error: 'Apenas imagens ou PDF são permitidos' }, { status: 400 })
    }

    // Normalização de nome/ extensão
    const originalName = file.name || 'upload'
    const extFromName = path.extname(originalName) || ''
    const baseFromName = path
      .basename(originalName, extFromName)
      .replace(/[^a-z0-9-_]/gi, '_')
      .slice(0, 50)

    const safeBase = baseFromName || 'file'
    const ext = extFromName || (mime && mime.includes('/') ? `.${mime.split('/')[1]}` : '.bin')
    const filename = `${Date.now()}_${safeBase}${ext}`

    // Em produção (Vercel), use Vercel Blob; em dev/local, persiste no filesystem.
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob')
      const blob = await put(`uploads/${filename}`, file, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      })
      return NextResponse.json({ url: blob.url, filename })
    }

    // Fallback local: salva em public/uploads (útil em dev)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadsDir, { recursive: true })
    const filePath = path.join(uploadsDir, filename)

    await fs.writeFile(filePath, buffer)

    const url = `/uploads/${filename}`
    return NextResponse.json({ url, filename })
  } catch (err: unknown) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Falha no upload' }, { status: 500 })
  }
}