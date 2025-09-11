import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { query } from '@/lib/db'

export const runtime = 'nodejs'

const DEBUG = process.env.UPLOAD_DEBUG === 'true'
const FORCE_LOCAL = process.env.UPLOAD_FORCE_LOCAL === 'true'
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
    const fileAny = form.get('file') as any

    // Aceitar Blob/File sem depender de instanceof (que pode variar por runtime)
    if (!fileAny || typeof fileAny.arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    // Validação simples de tipo: permitir imagens e PDFs
    const mime: string | undefined = fileAny.type
    const allowed = !mime || mime.startsWith('image/') || mime === 'application/pdf'
    if (!allowed) {
      return NextResponse.json({ error: 'Apenas imagens ou PDF são permitidos' }, { status: 400 })
    }

    // Normalização de nome/ extensão
    const originalName = (fileAny.name as string | undefined) || 'upload'
    const extFromName = path.extname(originalName) || ''
    const baseFromName = path
      .basename(originalName, extFromName)
      .replace(/[^a-z0-9-_]/gi, '_')
      .slice(0, 50)

    const safeBase = baseFromName || 'file'
    const ext = extFromName || (mime && mime.includes('/') ? `.${mime.split('/')[1]}` : '.bin')
    const filename = `${Date.now()}_${safeBase}${ext}`

    // Lemos os bytes uma única vez para reutilizar
    const bytes = await fileAny.arrayBuffer()
    const buffer = Buffer.from(bytes)

    if (buffer.length === 0) {
      return NextResponse.json({ error: 'Arquivo vazio' }, { status: 400 })
    }

    // Compressão desativada a pedido: usar o buffer original sempre
    const isImage = !!mime && mime.startsWith('image/')
    const outBuffer = buffer
    if (DEBUG && isImage) console.log(`compress: SKIPPED (disabled) ${originalName} ${buffer.length} bytes | mime=${mime}`)
    if (DEBUG) console.log(`Upload: received ${filename} ${outBuffer.length} bytes mime=${mime}`)

    // 0) Force local write if flag enabled (debug/contingency)
    if (FORCE_LOCAL) {
      try {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
        await fs.mkdir(uploadsDir, { recursive: true })
        const filePath = path.join(uploadsDir, filename)
        if (DEBUG) console.log('Upload: FORCE_LOCAL active, writing', { filePath })
        await fs.writeFile(filePath, outBuffer)
        const url = `/uploads/${filename}`
        if (DEBUG) console.log('Upload: FORCE_LOCAL success ->', url)
        return NextResponse.json({ url, filename })
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        if (DEBUG) console.error('Upload: FORCE_LOCAL failed', msg)
      }
    }

    // 1) Preferir armazenar no Postgres (com fallback se falhar)
    if (process.env.DATABASE_URL) {
      try {
        const size = outBuffer.length
        if (DEBUG) console.log('Upload: trying Postgres insert', { filename, mime, size })
        const insert = await query<{ id: string }>(
          `INSERT INTO files (filename, mime, size, data) VALUES ($1, $2, $3, $4) RETURNING id`,
          [filename, mime || null, size, outBuffer]
        )
        const id = insert.rows[0].id
        const url = `/api/u/${id}`
        if (DEBUG) console.log('Upload: Postgres insert success ->', url)
        return NextResponse.json({ url, filename, id })
      } catch (e: any) {
        const msg = e?.message || ''
        const code = e?.code
        if (DEBUG) console.warn('Upload: insert no Postgres falhou', { code, msg })
        // Se a tabela não existir, tentar criar e repetir uma vez
        if (code === '42P01' || /relation "?files"? does not exist/i.test(msg)) {
          try {
            if (DEBUG) console.log('Upload: creating files table and retrying insert')
            await query(`
              CREATE TABLE IF NOT EXISTS files (
                id BIGSERIAL PRIMARY KEY,
                filename TEXT NOT NULL,
                mime TEXT,
                size BIGINT NOT NULL,
                data BYTEA NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
              );
              CREATE INDEX IF NOT EXISTS files_created_at_idx ON files (created_at);
            `)
            const retry = await query<{ id: string }>(
              `INSERT INTO files (filename, mime, size, data) VALUES ($1, $2, $3, $4) RETURNING id`,
              [filename, mime || null, outBuffer.length, outBuffer]
            )
            const id = retry.rows[0].id
            const url = `/api/u/${id}`
            if (DEBUG) console.log('Upload: Postgres insert success after creating table ->', url)
            return NextResponse.json({ url, filename, id })
          } catch (e2: any) {
            if (DEBUG) console.warn('Upload: retry after creating table failed', e2?.message)
          }
        }
        if (DEBUG) console.warn('Upload: tentando fallbacks...')
      }
    }

    // 2) Fallback Vercel Blob (se configurado e sem DB)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        if (DEBUG) console.log('Upload: trying Vercel Blob')
        const { put } = await import('@vercel/blob')
        const blob = await put(`uploads/${filename}`, new Blob([outBuffer], { type: mime || 'application/octet-stream' }), {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN,
        })
        if (DEBUG) console.log('Upload: Vercel Blob success ->', blob.url)
        return NextResponse.json({ url: blob.url, filename })
      } catch (e) {
        if (DEBUG) console.warn('Upload: envio ao Vercel Blob falhou, tentando filesystem...', (e as Error).message)
      }
    }

    // 3) Fallback local: salva em public/uploads (útil em dev)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadsDir, { recursive: true })
    const filePath = path.join(uploadsDir, filename)

    if (DEBUG) console.log('Upload: writing local file', { filePath })
    await fs.writeFile(filePath, outBuffer)
    if (DEBUG) console.log('Upload: local write success')

    const url = `/uploads/${filename}`
    if (DEBUG) console.log('Upload: returning url', url)
    return NextResponse.json({ url, filename })
  } catch (err: unknown) {
    console.error('Upload error (geral):', err)
    const detail = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: 'Falha no upload', ...(DEBUG ? { detail, debug: { hasDb: !!process.env.DATABASE_URL, hasBlob: !!process.env.BLOB_READ_WRITE_TOKEN, forceLocal: FORCE_LOCAL } } : {}) }, { status: 500 })
  }
}