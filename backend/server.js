
const express = require("express")
const path = require("path")
const helmet = require("helmet")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const morgan = require("morgan")
const config = require("./config")
const { globalLimiter } = require("./middleware/rateLimiter")
const errorHandler = require("./middleware/errorHandler")
const logger = require('./utils/logger')
const { initializeDatabase, closeDatabase, ensureAdminUser } = require("./database")

const app = express()

// basic security headers
// We disable the parts of Helmet that introduce cross-origin policies
// because the frontend is served from a different origin
// and we need to allow images from /uploads to be fetched without
// triggering COEP/CORP violations.  CSP is already turned off in dev.
const helmetOptions = {
  // disable embedder/resource policies which set COEP/CORP headers
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false,
};

if (config.nodeEnv === 'development') {
  // also turn off CSP in dev to avoid the vite overlay and other devtools
  helmetOptions.contentSecurityPolicy = false;
}
app.use(helmet(helmetOptions));

// CORS configuration with credentials for cookies.
// CORS_ORIGIN is required (validated in config/index.js).
// Can be a single URL or comma-separated list for multiple domains.
const allowedOrigins = config.corsOrigin.split(',').map(s => s.trim()).filter(Boolean);
if (allowedOrigins.length === 0) {
  console.error('❌ [Server] CORS_ORIGIN is configured but resulted in empty origins list');
  process.exit(1);
}

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g. mobile apps, curl)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))

console.log('[Server] CORS configured for origins:', allowedOrigins.join(', '));

// request logging
app.use(morgan("combined"))

// apply general rate limit
app.use(globalLimiter)

app.use(express.json())
app.use(cookieParser())
// No local uploads served. Images are expected to be external URLs.

// routes
app.use("/auth", require("./routes/auth"))
app.use("/products", require("./routes/products"))
app.use("/categories", require("./routes/categories"))
app.use("/api/store-config", require("./routes/storeConfig"))

// error handler must go last
app.use(errorHandler)

// Enable trust proxy only in production.
// Render and similar PaaS platforms sit behind a single trusted proxy.
// Set to `1` to trust only the first proxy in the chain.
if (config.nodeEnv === 'production') {
  app.set('trust proxy', 1)
  console.log('[Server] trust proxy enabled (production)')
} else {
  console.log('[Server] trust proxy disabled (development)')
}

/**
 * Initialize database and start server
 * This ensures the database connection is ready before accepting requests
 */
async function startServer() {
  try {
    console.log(`[Server] Initializing database...`)
    await initializeDatabase()
    
    console.log(`[Server] Setting up admin user...`)
    await ensureAdminUser()
    
    const server = app.listen(config.port, () => {
      console.log(`🔥 PostgreSQL API listening on port ${config.port}`)
      console.log(`📍 Environment: ${config.nodeEnv}`)
    })

    /**
     * Graceful shutdown on signals
     */
    process.on('SIGTERM', async () => {
      console.log('[Server] SIGTERM received, starting graceful shutdown...')
      server.close(async () => {
        console.log('[Server] HTTP server closed')
        await closeDatabase()
        process.exit(0)
      })
    })

    process.on('SIGINT', async () => {
      console.log('[Server] SIGINT received, starting graceful shutdown...')
      server.close(async () => {
        console.log('[Server] HTTP server closed')
        await closeDatabase()
        process.exit(0)
      })
    })

  } catch (err) {
    logger.error('❌ [Server] Failed to start server: %s', err.stack || err)
    await closeDatabase()
    process.exit(1)
  }
}

// Start the server
// Global process handlers to ensure errors are logged
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection: %o', reason)
})

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception: %o', err)
  process.exit(1)
})

startServer()
