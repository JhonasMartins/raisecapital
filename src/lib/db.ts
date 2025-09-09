import { Pool } from 'pg'

// Create a singleton Pool for server-side usage (Next.js App Router)
let _pool: Pool | null = null

export function getDb() {
  if (!_pool) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set')
    }
    const useSSL = process.env.DATABASE_SSL !== 'false'
    _pool = new Pool({
      connectionString,
      max: 5,
      ssl: useSSL ? { rejectUnauthorized: false } : undefined,
    })
  }
  return _pool
}

export async function query<T = unknown>(text: string, params?: unknown[]): Promise<{ rows: T[] }> {
  const pool = getDb()
  const res = await pool.query(text, params as any)
  return { rows: res.rows as T[] }
}