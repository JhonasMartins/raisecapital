import { Pool } from 'pg'

// Create a singleton Pool for server-side usage (Next.js App Router)
let _pool: Pool | null = null

export function getDb() {
  if (!_pool) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set')
    }
    _pool = new Pool({ connectionString, max: 5, ssl: { rejectUnauthorized: false } })
  }
  return _pool
}

export async function query<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }> {
  const pool = getDb()
  const res = await pool.query(text, params)
  return { rows: res.rows as T[] }
}