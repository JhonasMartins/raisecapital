import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import type { User as AuthUser } from '@/lib/auth'
import { query } from '@/lib/db'

// Desativado por enquanto; pode reativar e ajustar qualidade conforme necessário
async function compressImage(file: File): Promise<File> {
  return file
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const userMaybe = await getCurrentUser()
    if (!userMaybe) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
    const user = userMaybe as AuthUser

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Arquivo é obrigatório' }, { status: 400 })
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de arquivo não suportado' }, { status: 400 })
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Arquivo muito grande (máx. 10MB)' }, { status: 400 })
    }

    let processedFile = file
    if (file.type.startsWith('image/')) {
      try {
        processedFile = await compressImage(file)
      } catch (err) {
        console.warn('Falha ao comprimir imagem, usando original:', err)
      }
    }

    const bytes = await processedFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const filename = (formData.get('filename') as string | null) || processedFile.name || 'arquivo'
    const sanitizedFilename = filename
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_.-]/g, '_')

    // Tenta salvar no Postgres (tabela arquivos_blob) se existir
    try {
      await query(
        `CREATE TABLE IF NOT EXISTS arquivos_blob (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          filename TEXT NOT NULL,
          mime_type TEXT NOT NULL,
          size INTEGER NOT NULL,
          data BYTEA NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )`
      )

      const insertResult = await query<{ id: number }>(
        `INSERT INTO arquivos_blob (user_id, filename, mime_type, size, data)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [user.id, sanitizedFilename, processedFile.type, processedFile.size, buffer]
      )

      const fileId = insertResult.rows[0]?.id as number | undefined

      return NextResponse.json({
        ok: true,
        storage: 'postgres',
        id: fileId,
        filename: sanitizedFilename,
        mimeType: processedFile.type,
        size: processedFile.size
      })
    } catch (dbErr) {
      console.error('Falha ao salvar no Postgres, tentando armazenamento alternativo:', dbErr)

      // Fallback: tentar usar o sistema de arquivos local (apenas dev) ou Vercel Blob
      try {
        if (process.env.NODE_ENV !== 'production') {
          const fs = await import('fs')
          const path = await import('path')
          const uploadDir = path.join(process.cwd(), 'uploads')
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
          }
          const localPath = path.join(uploadDir, `${Date.now()}-${sanitizedFilename}`)
          fs.writeFileSync(localPath, buffer)

          return NextResponse.json({
            ok: true,
            storage: 'local',
            path: localPath,
            filename: sanitizedFilename,
            mimeType: processedFile.type,
            size: processedFile.size
          })
        }

        // Produção: Vercel Blob (se configurado)
        const { put } = await import('@vercel/blob')
        const blob = await put(`uploads/${Date.now()}-${sanitizedFilename}`, buffer, {
          access: 'public',
          contentType: processedFile.type,
        })

        return NextResponse.json({
          ok: true,
          storage: 'vercel-blob',
          url: blob.url,
          filename: sanitizedFilename,
          mimeType: processedFile.type,
          size: processedFile.size
        })
      } catch (fallbackErr) {
        console.error('Falha no armazenamento alternativo:', fallbackErr)
        return NextResponse.json({ error: 'Falha no upload do arquivo' }, { status: 500 })
      }
    }
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}