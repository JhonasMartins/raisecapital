import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

const DEBUG = process.env.UPLOAD_DEBUG === 'true'

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
      try {
        const { put } = await import('@vercel/blob')
        const blob = await put(`uploads/${filename}`, file, {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN,
        })
        return NextResponse.json({ url: blob.url, filename })
      } catch (e) {
        console.error('Upload error (Blob):', e)
        if (DEBUG) {
          return NextResponse.json({ error: 'Falha no upload (Blob)', detail: e instanceof Error ? e.message : String(e) }, { status: 500 })
        }
        throw e
      }
    }

    // MinIO/S3 (se configurado)
    if (
      process.env.S3_ENDPOINT &&
      process.env.S3_BUCKET &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY
    ) {
      try {
        const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3')
        const s3 = new S3Client({
          region: process.env.S3_REGION || 'us-east-1',
          endpoint: process.env.S3_ENDPOINT,
          forcePathStyle: String(process.env.S3_FORCE_PATH_STYLE || 'true') !== 'false',
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID!,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
          },
        })

        const bytes = await file.arrayBuffer()
        const body = Buffer.from(bytes)

        const key = `uploads/${filename}`

        await s3.send(
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET!,
            Key: key,
            Body: body,
            ContentType: mime || 'application/octet-stream',
          })
        )

        const publicBase = (process.env.S3_PUBLIC_BASE_URL || process.env.S3_ENDPOINT).replace(/\/+$/, '')
        const url = `${publicBase}/${process.env.S3_BUCKET}/${key}`
        return NextResponse.json({ url, filename })
      } catch (e) {
        console.error('Upload error (S3/MinIO):', e)
        if (DEBUG) {
          return NextResponse.json({ error: 'Falha no upload (S3/MinIO)', detail: e instanceof Error ? e.message : String(e) }, { status: 500 })
        }
        throw e
      }
    }

    // Fallback local: salva em public/uploads (útil em dev)
    try {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      await fs.mkdir(uploadsDir, { recursive: true })
      const filePath = path.join(uploadsDir, filename)

      await fs.writeFile(filePath, buffer)

      const url = `/uploads/${filename}`
      return NextResponse.json({ url, filename })
    } catch (e) {
      console.error('Upload error (filesystem):', e)
      if (DEBUG) {
        return NextResponse.json({ error: 'Falha no upload (filesystem)', detail: e instanceof Error ? e.message : String(e) }, { status: 500 })
      }
      throw e
    }
  } catch (err: unknown) {
    console.error('Upload error (geral):', err)
    const detail = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: 'Falha no upload', ...(DEBUG ? { detail } : {}) }, { status: 500 })
  }
}