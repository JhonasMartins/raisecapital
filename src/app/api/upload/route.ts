import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { query } from '@/lib/db'

export const runtime = 'nodejs'

const DEBUG = process.env.UPLOAD_DEBUG === 'true'
const STRICT_LOSSLESS = process.env.UPLOAD_IMAGE_STRICT_LOSSLESS === 'true'
const JPEG_QUALITY = Number(process.env.UPLOAD_IMAGE_JPEG_QUALITY || 85)
const WEBP_QUALITY = Number(process.env.UPLOAD_IMAGE_WEBP_QUALITY || 85)
const AVIF_QUALITY = Number(process.env.UPLOAD_IMAGE_AVIF_QUALITY || 45)

// Adiciona compressão para imagens (lossless para PNG; opcionalmente visualmente sem perda para JPEG/WebP/AVIF)
async function compressImage(input: Buffer, mime: string): Promise<Buffer> {
  const sharp = (await import('sharp')).default
  const img = sharp(input, { limitInputPixels: false }).rotate()

  try {
    // PNG: sempre lossless
    if (mime === 'image/png') {
      const out = await img.png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer()
      return out.length < input.length ? out : input
    }

    // Se modo estritamente lossless estiver ativo, não reencodar formatos com perdas
    if (STRICT_LOSSLESS) return input

    if (mime === 'image/jpeg' || mime === 'image/jpg') {
      const out = await img.jpeg({ mozjpeg: true, quality: JPEG_QUALITY, progressive: true }).toBuffer()
      return out.length < input.length ? out : input
    }
    if (mime === 'image/webp') {
      // Para WebP podemos usar lossless se desejado (mas tende a aumentar tamanho em fotos);
      // aqui priorizamos tamanho mantendo qualidade visual.
      const out = await img.webp({ quality: WEBP_QUALITY }).toBuffer()
      return out.length < input.length ? out : input
    }
    if (mime === 'image/avif') {
      const out = await img.avif({ quality: AVIF_QUALITY }).toBuffer()
      return out.length < input.length ? out : input
    }
  } catch (e) {
    if (DEBUG) console.warn('compressImage falhou, usando original:', (e as Error).message)
  }
  return input
}

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

    // Lemos os bytes uma única vez para reutilizar
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Compressão condicional para imagens
    const isImage = !!mime && mime.startsWith('image/')
    const outBuffer = isImage ? await compressImage(buffer, mime) : buffer
    if (DEBUG && isImage) console.log(`compress: ${originalName} ${buffer.length} -> ${outBuffer.length} bytes | mime=${mime} | strict=${STRICT_LOSSLESS}`)

    // 1) Preferir armazenar no Postgres (com fallback se falhar)
    if (process.env.DATABASE_URL) {
      try {
        const size = outBuffer.length
        const insert = await query<{ id: string }>(
          `INSERT INTO files (filename, mime, size, data) VALUES ($1, $2, $3, $4) RETURNING id`,
          [filename, mime || null, size, outBuffer]
        )
        const id = insert.rows[0].id
        const url = `/api/u/${id}`
        return NextResponse.json({ url, filename, id })
      } catch (e) {
        if (DEBUG) console.warn('Upload: insert no Postgres falhou, tentando fallback...', (e as Error).message)
      }
    }

    // 2) Fallback Vercel Blob (se configurado e sem DB)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob')
        const blob = await put(`uploads/${filename}`, new Blob([outBuffer], { type: mime || 'application/octet-stream' }), {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN,
        })
        return NextResponse.json({ url: blob.url, filename })
      } catch (e) {
        if (DEBUG) console.warn('Upload: envio ao Vercel Blob falhou, tentando filesystem...', (e as Error).message)
      }
    }

    // 3) Fallback local: salva em public/uploads (útil em dev)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadsDir, { recursive: true })
    const filePath = path.join(uploadsDir, filename)

    await fs.writeFile(filePath, outBuffer)

    const url = `/uploads/${filename}`
    return NextResponse.json({ url, filename })
  } catch (err: unknown) {
    console.error('Upload error (geral):', err)
    const detail = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: 'Falha no upload', ...(DEBUG ? { detail } : {}) }, { status: 500 })
  }
}