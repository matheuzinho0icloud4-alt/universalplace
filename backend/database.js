
// ============================================================================
// DATABASE MODULE - PostgreSQL Connection Pool & Schema Management
// ============================================================================

const { Pool } = require("pg")
const config = require("./config")
const logger = require('./utils/logger')

// ============================================================================
// POOL CONFIGURATION
// ============================================================================

/**
 * Configure Pool with SSL support for production environments (Render, etc.)
 * - Development: connects without SSL
 * - Production: uses SSL with rejectUnauthorized=false for Render compatibility
 */
const poolConfig = {
  connectionString: config.databaseUrl,
  ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // maximum pool size
  idleTimeoutMillis: 30000, // close idle clients after 30s
  connectionTimeoutMillis: 10000, // connection attempt timeout
}

const pool = new Pool(poolConfig)

// ============================================================================
// POOL EVENT HANDLERS
// ============================================================================

/**
 * Handle errors on idle clients
 */
pool.on('error', (err) => {
  logger.error('❌ [DB] Unexpected error on idle PostgreSQL client: %o', err)
  process.exit(1)
})

/**
 * Handle successful connections
 */
pool.on('connect', () => {
  logger.info('✅ [DB] Connected to PostgreSQL')
})


// ============================================================================
// DATABASE INITIALIZATION & SCHEMA MANAGEMENT
// ============================================================================

/**
 * Initialize database schema and verify connectivity
 * This function should be called before starting the server
 */
async function initializeDatabase() {
  let client = null
  
  try {
    // Test connection
    logger.info('[DB] Testing PostgreSQL connection...')
    client = await pool.connect()
    const result = await client.query('SELECT NOW()')
    logger.info('✅ [DB] PostgreSQL connection successful')
    client.release()
  } catch (err) {
    logger.error('❌ [DB] Failed to connect to PostgreSQL: %o', err)
    if (client) client.release()
    throw new Error(`Database connection failed: ${err.message}`)
  }

  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user'
      )
    `)
    logger.info('✅ [DB] Users table ready')

    // Migration: Add role column if missing (for existing databases)
    const userColumnsCheck = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name='users' AND column_name='role'
    `)
    if (userColumnsCheck.rows.length === 0) {
      logger.warn('⚠️ [DB] role column missing from users table! Adding...')
      await pool.query('ALTER TABLE users ADD COLUMN role TEXT DEFAULT \'user\'')
      logger.info('✅ [DB] role column added to users table')
    }

    // Create products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        image TEXT,
        link_oferta TEXT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
      )
    `)
    logger.info('✅ [DB] Products table ready')

    // Create store_config table (single-row JSON config, id = 1)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS store_config (
        id SERIAL PRIMARY KEY,
        config JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      )
    `)
    logger.info('✅ [DB] Store config table ready')

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
      logger.info('✅ [DB] Inserted default store_config (id=1)')
    }

    // Verify products columns and run migrations if needed
    const columnsCheck = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name='products' 
      ORDER BY column_name
    `)
    const columns = columnsCheck.rows.map(r => r.column_name)
    logger.info('📋 [DB] Products columns: %s', columns.join(', '))

    // Migration: Add link_oferta column if missing
    if (!columns.includes('link_oferta')) {
      logger.warn('⚠️ [DB] link_oferta column missing! Running migration...')
      await pool.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS link_oferta TEXT')
      logger.info('✅ [DB] link_oferta column added')
    }

    // Create indexes for better query performance
    await pool.query("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
    await pool.query("CREATE INDEX IF NOT EXISTS idx_products_user ON products(user_id)")
    logger.info('✅ [DB] Indexes created')

    logger.info('✅ [DB] Database initialization completed successfully')
  } catch (err) {
    logger.error('❌ [DB] Database initialization failed: %o', err)
    throw new Error(`Database initialization failed: ${err.message}`)
  }
}

// ============================================================================
// DATABASE SHUTDOWN
// ============================================================================

/**
 * Graceful shutdown: close all connections
 */
async function closeDatabase() {
  try {
    await pool.end()
    logger.info('✅ [DB] Connection pool closed')
  } catch (err) {
    logger.error('❌ [DB] Error closing connection pool: %o', err)
  }
}

// ============================================================================
// ADMIN USER MANAGEMENT
// ============================================================================

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
      logger.info('✅ [DB] Admin user already exists')
      return
    }

    // Create admin user if it doesn't exist
    await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
      [adminEmail, adminPasswordHash, 'admin']
    )
    logger.info('✅ [DB] Admin user created successfully')
  } catch (err) {
    logger.error('❌ [DB] Failed to ensure admin user: %o', err)
    throw new Error(`Admin user setup failed: ${err.message}`)
  }
}

// ============================================================================
// MODULE EXPORTS
// ============================================================================

module.exports = {
  pool,
  initializeDatabase,
  closeDatabase,
  ensureAdminUser,
}
