require('dotenv').config({ path: '.env.local' })
require('dotenv').config()
const { Pool } = require('pg')

async function ensureNewsletter() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('DATABASE_URL is not set. Please set it in your environment (.env/.env.local).')
    process.exit(1)
  }
  // Match the app runtime default (SSL enabled unless explicitly set to 'false')
  const useSSL = process.env.DATABASE_SSL !== 'false'
  const pool = new Pool({
    connectionString,
    max: 5,
    ssl: useSSL ? { rejectUnauthorized: false } : undefined,
  })

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
        id BIGSERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        name TEXT,
        source TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS newsletter_email_unique_idx
      ON newsletter_subscriptions ((lower(email)));
    `)
    await client.query('COMMIT')

    const check = await client.query(
      `SELECT to_regclass('public.newsletter_subscriptions') AS table_reg;`
    )
    const tableReg = check.rows?.[0]?.table_reg
    console.log('Newsletter table ensure result:', tableReg)
    if (!tableReg) {
      process.exitCode = 1
      console.error('Table newsletter_subscriptions not found after ensure.')
    } else {
      console.log('OK: newsletter_subscriptions is present in the database.')
    }
  } catch (err) {
    try { await client.query('ROLLBACK') } catch {}
    console.error('Failed to ensure newsletter table:', err?.message)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

ensureNewsletter().catch((e) => { console.error('Unexpected error:', e); process.exit(1) })