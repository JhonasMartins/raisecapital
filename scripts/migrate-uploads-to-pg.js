/*
  Migra arquivos existentes em public/uploads para o Postgres (tabela files)
  - Lê todos os arquivos do diretório public/uploads
  - Insere em files (filename, mime, size, data)
  - Imprime um mapa JSON { caminho_original: "/api/u/{id}" }

  Uso:
    node scripts/migrate-uploads-to-pg.js > uploads-map.json
*/

require('dotenv').config({ path: '.env.local' })
require('dotenv').config()
const fs = require('fs')
const fsp = require('fs/promises')
const path = require('path')
const mime = require('mime-types')
const { Pool } = require('pg')

async function main() {
  const root = process.cwd()
  const uploadsDir = path.join(root, 'public', 'uploads')

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('DATABASE_URL não está definido')
    process.exit(1)
  }
  const useSSL = process.env.DATABASE_SSL === 'true'
  const pool = new Pool({
    connectionString,
    max: 3,
    ssl: useSSL ? { rejectUnauthorized: false } : undefined,
  })
  const client = await pool.connect()

  try {
    // Garantir tabela
    await client.query(`
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

    const exists = fs.existsSync(uploadsDir)
    if (!exists) {
      console.log('{}')
      return
    }

    const entries = await fsp.readdir(uploadsDir)
    const map = {}

    for (const name of entries) {
      const filePath = path.join(uploadsDir, name)
      const stat = await fsp.stat(filePath)
      if (!stat.isFile()) continue

      const data = await fsp.readFile(filePath)
      const guessed = mime.lookup(name) || 'application/octet-stream'

      const res = await client.query(
        'INSERT INTO files (filename, mime, size, data) VALUES ($1, $2, $3, $4) RETURNING id',
        [name, guessed, data.length, data]
      )
      const id = res.rows[0].id
      map[`/uploads/${name}`] = `/api/u/${id}`
      console.log(`Migrado: ${name} -> /api/u/${id}`)
    }

    console.log(JSON.stringify(map, null, 2))
  } catch (err) {
    console.error('Falha na migração:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((e) => {
  console.error('Erro inesperado:', e)
  process.exit(1)
})