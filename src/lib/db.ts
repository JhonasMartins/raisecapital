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
    // Default SSL to false unless explicitly enabled
    const useSSL = process.env.DATABASE_SSL === 'true'
    _pool = new Pool({
      connectionString,
      max: 8, // Aumentado para melhor throughput
      min: 2, // Manter conexões ativas para reduzir latência
      idleTimeoutMillis: 30000, // 30s timeout para conexões ociosas
      connectionTimeoutMillis: 5000, // 5s timeout para novas conexões
      keepAlive: true,
      ssl: useSSL ? { rejectUnauthorized: false } : undefined,
    })
  }
  return _pool
}

export async function resetPool() {
  if (_pool) {
    try {
      await _pool.end()
    } catch (e) {
      console.warn('Error while ending DB pool (ignored):', (e as Error).message)
    } finally {
      _pool = null
    }
  }
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
    const message = error instanceof Error ? error.message : String(error)
    console.error(`Database query failed (${duration}ms):`, {
      query: text.substring(0, 100),
      error: message,
      params: params ? '[REDACTED]' : undefined
    })

    // Retry uma vez em erros de conexão interrompida
    if (/terminated unexpectedly|ECONNRESET|Connection reset/i.test(message)) {
      console.warn('DB connection error detected. Resetting pool and retrying query once...')
      await resetPool()
      const retryPool = getDb()
      const res = await retryPool.query(text, params ? [...params] as unknown[] : undefined)
      return { rows: res.rows as T[] }
    }

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