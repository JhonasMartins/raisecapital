import { Pool } from 'pg'

// PostgreSQL connection string provided by the user
const connectionString = 'postgresql://raisecapitaldatabase:150523272942150523805628soft99@65.109.3.180:5433/raisecapitaldatabase'

// Create a connection pool
const pool = new Pool({
  connectionString,
  ssl: false, // Adjust based on your PostgreSQL server configuration
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
})

// Export a query function for easy database operations
export const query = async (text: string, params?: any[]) => {
  const start = Date.now()
  const res = await pool.query(text, params)
  const duration = Date.now() - start
  console.log('executed query', { text, duration, rows: res.rowCount })
  return res
}

// Export a function to get a client for transactions
export const getClient = async () => {
  const client = await pool.connect()
  const originalQuery = client.query.bind(client)
  const originalRelease = client.release.bind(client)
  
  // Set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!')
    console.error(`The last executed query on this client was: ${(client as any).lastQuery}`)
  }, 5000)
  
  // Monkey patch the query method to keep track of the last query executed
  const patchedQuery = (...args: Parameters<typeof client.query>) => {
    ;(client as any).lastQuery = args
    return originalQuery(...args)
  }
  
  const patchedRelease = (err?: Error | boolean) => {
    // Clear our timeout
    clearTimeout(timeout)
    // Set the methods back to their old un-monkey-patched version
    client.query = originalQuery
    client.release = originalRelease
    return originalRelease(err)
  }
  
  // Apply patches
  client.query = patchedQuery as any
  client.release = patchedRelease
  
  return client
}

// Export the pool for direct access if needed
export { pool }

// Test the connection on startup
pool.on('connect', (client) => {
  console.log('New client connected to PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})