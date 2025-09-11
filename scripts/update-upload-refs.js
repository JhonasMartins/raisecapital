/*
  Atualiza referências no banco de /uploads/... para /api/u/{id}
  - Usa um arquivo JSON de mapeamento gerado por migrate-uploads-to-pg.js
  - Atualiza colunas TEXT e JSONB nas tabelas blog e ofertas

  Uso:
    node scripts/update-upload-refs.js uploads-map.json
*/

require('dotenv').config({ path: '.env.local' })
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')

function replaceInText(text, map) {
  if (!text || typeof text !== 'string') return text
  let out = text
  // Substitui todas as ocorrências de cada chave
  for (const [oldPath, newUrl] of Object.entries(map)) {
    if (!oldPath) continue
    out = out.split(oldPath).join(newUrl)
  }
  return out
}

function deepReplace(value, map) {
  if (value == null) return value
  if (typeof value === 'string') return replaceInText(value, map)
  if (Array.isArray(value)) return value.map((v) => deepReplace(v, map))
  if (typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) {
      out[k] = deepReplace(v, map)
    }
    return out
  }
  return value
}

async function updateBlog(client, map) {
  const { rows } = await client.query('SELECT id, capa, corpo_html FROM blog')
  let updates = 0
  for (const row of rows) {
    const newCapa = replaceInText(row.capa, map)
    const newCorpo = replaceInText(row.corpo_html, map)
    if (newCapa !== row.capa || newCorpo !== row.corpo_html) {
      await client.query('UPDATE blog SET capa = $1, corpo_html = $2, updated_at = NOW() WHERE id = $3', [newCapa, newCorpo, row.id])
      updates++
    }
  }
  console.log(`blog: ${updates} registros atualizados`)
}

async function updateOfertas(client, map) {
  const { rows } = await client.query(
    `SELECT id, capa, resumo_pdf, sobre_operacao, sobre_empresa, empreendedores, financeiros, documentos, informacoes_essenciais, investidores FROM ofertas`
  )
  let updates = 0
  for (const row of rows) {
    const newCapa = replaceInText(row.capa, map)
    const newResumo = replaceInText(row.resumo_pdf, map)
    const newSobreOp = replaceInText(row.sobre_operacao, map)
    const newSobreEmp = replaceInText(row.sobre_empresa, map)

    const newEmp = row.empreendedores ? deepReplace(row.empreendedores, map) : row.empreendedores
    const newFin = row.financeiros ? deepReplace(row.financeiros, map) : row.financeiros
    const newDocs = row.documentos ? deepReplace(row.documentos, map) : row.documentos
    const newInfo = row.informacoes_essenciais ? deepReplace(row.informacoes_essenciais, map) : row.informacoes_essenciais
    const newInv = row.investidores ? deepReplace(row.investidores, map) : row.investidores

    const changed =
      newCapa !== row.capa ||
      newResumo !== row.resumo_pdf ||
      newSobreOp !== row.sobre_operacao ||
      newSobreEmp !== row.sobre_empresa ||
      JSON.stringify(newEmp) !== JSON.stringify(row.empreendedores) ||
      JSON.stringify(newFin) !== JSON.stringify(row.financeiros) ||
      JSON.stringify(newDocs) !== JSON.stringify(row.documentos) ||
      JSON.stringify(newInfo) !== JSON.stringify(row.informacoes_essenciais) ||
      JSON.stringify(newInv) !== JSON.stringify(row.investidores)

    if (changed) {
      await client.query(
        `UPDATE ofertas SET capa=$1, resumo_pdf=$2, sobre_operacao=$3, sobre_empresa=$4,
         empreendedores=$5, financeiros=$6, documentos=$7, informacoes_essenciais=$8, investidores=$9,
         updated_at = NOW() WHERE id=$10`,
        [
          newCapa,
          newResumo,
          newSobreOp,
          newSobreEmp,
          newEmp == null ? null : JSON.stringify(newEmp),
          newFin == null ? null : JSON.stringify(newFin),
          newDocs == null ? null : JSON.stringify(newDocs),
          newInfo == null ? null : JSON.stringify(newInfo),
          newInv == null ? null : JSON.stringify(newInv),
          row.id,
        ]
      )
      updates++
    }
  }
  console.log(`ofertas: ${updates} registros atualizados`)
}

async function main() {
  const mappingPath = process.argv[2]
  if (!mappingPath) {
    console.error('Uso: node scripts/update-upload-refs.js <uploads-map.json>')
    process.exit(1)
  }
  const full = path.resolve(process.cwd(), mappingPath)
  if (!fs.existsSync(full)) {
    console.error('Arquivo de mapeamento não encontrado:', full)
    process.exit(1)
  }

  const map = JSON.parse(fs.readFileSync(full, 'utf8'))
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('DATABASE_URL não está definido')
    process.exit(1)
  }

  const useSSL = process.env.DATABASE_SSL === 'true'
  const pool = new Pool({ connectionString, max: 4, ssl: useSSL ? { rejectUnauthorized: false } : undefined })
  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    await updateBlog(client, map)
    await updateOfertas(client, map)
    await client.query('COMMIT')
    console.log('Atualização de referências concluída.')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Falha ao atualizar referências:', err)
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