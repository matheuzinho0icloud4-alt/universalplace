
const { Pool } = require("pg")
const config = require("./config")

/**
 * Configure Pool with SSL support for production environments (Render, etc.)
 * - Development: connects without SSL
 * - Production: uses SSL with rejectUnauthorized=false for Render compatibility
 */
const poolConfig = {
  connectionString: config.databaseUrl,
  // SSL configuration for production (Render requires SSL/TLS)
  ssl:
    config.nodeEnv === 'production'
      ? { rejectUnauthorized: false }
      : false,
  // Connection pool settings for production stability
  max: 20, // maximum pool size
  idleTimeoutMillis: 30000, // close idle clients after 30s
  connectionTimeoutMillis: 10000, // connection attempt timeout
}

const pool = new Pool(poolConfig)

/**
 * Handle errors on idle clients
 */
pool.on('error', (err) => {
  console.error('❌ [DB] Unexpected error on idle PostgreSQL client:', err.message)
  process.exit(1)
})

/**
 * Handle connection errors during initial setup
 */
pool.on('connect', () => {
  console.log('✅ [DB] Connected to PostgreSQL')
})

/**
 * Initialize database schema and verify connectivity
 * This function should be called before starting the server
 */
async function initializeDatabase() {
  let client = null
  
  try {
    // Test connection
    console.log('[DB] Testing PostgreSQL connection...')
    client = await pool.connect()
    const result = await client.query('SELECT NOW()')
    console.log('✅ [DB] PostgreSQL connection successful')
    client.release()
  } catch (err) {
    console.error('❌ [DB] Failed to connect to PostgreSQL:', err.message)
    if (client) client.release()
    throw new Error(`Database connection failed: ${err.message}`)
  }

  try {
    // Create tables with constraints and indexes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user'
      )
    `)
    console.log('✅ [DB] Users table ready')

    // Add role column if missing (migration for existing databases)
    const userColumnsCheck = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name='users' AND column_name='role'
    `)
    if (userColumnsCheck.rows.length === 0) {
      console.warn('⚠️ [DB] role column missing from users table! Adding...')
      await pool.query('ALTER TABLE users ADD COLUMN role TEXT DEFAULT \'user\'')
      console.log('✅ [DB] role column added to users table')
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        image TEXT,
        link_oferta TEXT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
      )
    `)
    console.log('✅ [DB] Products table ready')

    // store_config table: single-row JSON config (id = 1)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS store_config (
        id SERIAL PRIMARY KEY,
        config JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      )
    `)
    console.log('✅ [DB] Store config table ready')

    // Ensure a single row exists (id = 1) with default config
    const res = await pool.query("SELECT COUNT(*)::int AS cnt FROM store_config")
    if (res.rows[0].cnt === 0) {
      const defaultConfig = {
        name: 'Ofertas Universal Place',
        logo: '',
        banner: 'https://images.unsplash.com/photo-1674027392842-29f8354e236c',
        socialMedia: { instagram: '', facebook: '', whatsapp: '' }
      }
      await pool.query('INSERT INTO store_config (id, config) VALUES (1, $1)', [defaultConfig])
      console.log('✅ [DB] Inserted default store_config (id=1)')
    }

    // Verify columns exist
    const columnsCheck = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name='products' 
      ORDER BY column_name
    `)
    const columns = columnsCheck.rows.map(r => r.column_name)
    console.log('📋 [DB] Products columns:', columns.join(', '))

    // Verify link_oferta exists
    if (!columns.includes('link_oferta')) {
      console.warn('⚠️ [DB] link_oferta column missing! Running migration...')
      await pool.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS link_oferta TEXT')
      console.log('✅ [DB] link_oferta column added')
    }

    // Create indexes for better query performance
    await pool.query("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
    await pool.query("CREATE INDEX IF NOT EXISTS idx_products_user ON products(user_id)")
    console.log('✅ [DB] Indexes created')

    console.log('✅ [DB] Database initialization completed successfully')
  } catch (err) {
    console.error('❌ [DB] Database initialization failed:', err.message)
    throw new Error(`Database initialization failed: ${err.message}`)
  }
}

/**
 * Graceful shutdown: close all connections
 */
async function closeDatabase() {
  try {
    await pool.end()
    console.log('✅ [DB] Connection pool closed')
  } catch (err) {
    console.error('❌ [DB] Error closing connection pool:', err.message)
  }
}

/**
 * Ensure that the single admin user exists in the database.
 * Creates it if it doesn't exist; does nothing if it already does.
 * This should be called after initializeDatabase() during startup.
 */
async function ensureAdminUser() {
  const adminEmail = 'matheuzinho0@icloud.com'
  const adminPasswordHash = '$2b$12$tsD8m2APLjnOQPeFcrz1d.IX8laSbo5U94aWHP2YdEIoHMOmWwmA.'

  try {
    // Check if admin user already exists
    const existingAdmin = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [adminEmail]
    )

    if (existingAdmin.rows.length > 0) {
      console.log('✅ [DB] Admin user already exists')
      return
    }

    // Create admin user if it doesn't exist
    await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
      [adminEmail, adminPasswordHash, 'admin']
    )
    console.log('✅ [DB] Admin user created successfully')
  } catch (err) {
    console.error('❌ [DB] Failed to ensure admin user:', err.message)
    throw new Error(`Admin user setup failed: ${err.message}`)
  }
}

module.exports = {
  pool,
  initializeDatabase,
  closeDatabase,
  ensureAdminUser,
}
