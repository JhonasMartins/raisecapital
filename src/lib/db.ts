import { Pool } from 'pg'

// Create a singleton Pool for server-side usage (Next.js App Router)
let _pool: Pool | null = null

// Performance metrics
let queryCount = 0
let totalQueryTime = 0

export function getDb() {
  if (!_pool) {
    const connectionString = process.env.DATABASE_URL
    console.log('DATABASE_URL:', connectionString ? 'SET' : 'NOT SET')
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set')
    }
    const useSSL = process.env.DATABASE_SSL !== 'false'
    _pool = new Pool({
      connectionString,
      max: 8, // Aumentado para melhor throughput
      min: 2, // Manter conexões ativas para reduzir latência
      idleTimeoutMillis: 30000, // 30s timeout para conexões ociosas
      connectionTimeoutMillis: 5000, // 5s timeout para novas conexões
      ssl: useSSL ? { rejectUnauthorized: false } : undefined,
    })
  }
  return _pool
}

export async function query<T = unknown>(text: string, params?: readonly unknown[]): Promise<{ rows: T[] }> {
  const pool = getDb()
  const startTime = Date.now()
  
  try {
    const res = await pool.query(text, params ? [...params] as unknown[] : undefined)
     const duration = Date.now() - startTime
     
     // Atualizar métricas
     queryCount++
     totalQueryTime += duration
     
     // Log queries lentas (> 1000ms)
     if (duration > 1000) {
       console.warn(`Slow query detected (${duration}ms):`, text.substring(0, 100))
     }
     
     return { rows: res.rows as T[] }
  } catch (error) {
    const duration = Date.now() - startTime
    const pgErr = error as any
    console.error(`Database query failed (${duration}ms):`, {
      query: typeof text === 'string' ? text.substring(0, 100) : undefined,
      error: pgErr?.message || 'Unknown error',
      code: pgErr?.code,
      detail: pgErr?.detail,
      schema: pgErr?.schema,
      table: pgErr?.table,
      constraint: pgErr?.constraint,
      position: pgErr?.position,
      severity: pgErr?.severity,
      routine: pgErr?.routine,
      params: params ? '[REDACTED]' : undefined,
    })
    throw error
   }
 }

// Função para obter status do pool de conexões
export function getPoolStatus() {
  if (!_pool) {
    return { status: 'not_initialized' }
  }
  
  return {
    status: 'active',
    totalCount: _pool.totalCount,
    idleCount: _pool.idleCount,
    waitingCount: _pool.waitingCount,
    queryCount,
    averageQueryTime: queryCount > 0 ? Math.round(totalQueryTime / queryCount) : 0,
    totalQueryTime
  }
}

// Função para resetar métricas
export function resetMetrics() {
  queryCount = 0
  totalQueryTime = 0
}