
const { Pool } = require("pg")
const config = require("./config")

const pool = new Pool({
  connectionString: config.databaseUrl,
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err)
  process.exit(-1)
})

async function init() {
  // create tables with basic constraints and indexes
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `)
  console.log('✅ [DB] Users table ready')
  
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

  // indexes
  await pool.query("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
  await pool.query("CREATE INDEX IF NOT EXISTS idx_products_user ON products(user_id)")
  console.log('✅ [DB] Indexes created')
}

init().catch(err => {
  console.error('Failed to initialize database', err)
  process.exit(1)
})

module.exports = pool
