const { Client } = require("pg")
const config = require("./config")

async function setupDatabase() {
  // Connect to default postgres database
  // first connection uses the URL specified in DATABASE_URL or
  // falls back to a generic local postgres instance. Adjust as needed.
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres',
  })

  try {
    await client.connect()
    console.log("Connected to PostgreSQL")

    // Create database if not exists
    try {
      await client.query(`CREATE DATABASE horizons_db`)
      console.log("✓ Database horizons_db created")
    } catch (err) {
      if (err.code === "42P04") {
        console.log("✓ Database horizons_db already exists")
      } else {
        throw err
      }
    }

    await client.end()

    // Now connect to the actual database and create tables
    const mainClient = new Client({
      connectionString: config.databaseUrl,
    })

    await mainClient.connect()
    console.log("Connected to horizons_db")

    // Create tables
    await mainClient.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `)
    console.log("✓ users table created")

    await mainClient.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        price NUMERIC NOT NULL,
        image TEXT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
      )
    `)
    console.log("✓ products table created")

    // Create indexes
    await mainClient.query("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
    await mainClient.query("CREATE INDEX IF NOT EXISTS idx_products_user ON products(user_id)")
    console.log("✓ Indexes created")

    await mainClient.end()
    console.log("\n✅ Database setup complete!")
  } catch (err) {
    console.error("Database setup failed:", err.message)
    process.exit(1)
  }
}

setupDatabase()
