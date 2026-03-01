
const express = require("express")
const path = require("path")
const helmet = require("helmet")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const morgan = require("morgan")
const config = require("./config")
const { globalLimiter } = require("./middleware/rateLimiter")
const errorHandler = require("./middleware/errorHandler")
const { initializeDatabase, closeDatabase } = require("./database")

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

// CORS configuration with credentials for cookies. Only the frontend origin(s) are allowed.
// `CORS_ORIGIN` can be a single URL or a comma-separated list for multiple domains.
const origins = (config.corsOrigin || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(
  cors({
    origin: origins.length > 1 ? origins : origins[0] || false,
    credentials: true,
  })
);

// request logging
app.use(morgan("combined"))

// apply general rate limit
app.use(globalLimiter)

app.use(express.json())
app.use(cookieParser())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// routes
app.use("/auth", require("./routes/auth"))
app.use("/products", require("./routes/products"))
app.use("/api/store-config", require("./routes/storeConfig"))

// error handler must go last
app.use(errorHandler)

// Configure `trust proxy` only in production to avoid proxy header spoofing.
// When running on Render (or similar PaaS behind a single trusted proxy),
// trusting the first proxy (value `1`) allows Express to correctly derive
// `req.ip` from `X-Forwarded-For` while minimizing the risk of header forgery.
if (config.nodeEnv === 'production') {
  app.set('trust proxy', 1)
  console.log('[Server] trust proxy enabled (production)')
} else {
  // In development we do NOT enable trust proxy to avoid accepting spoofed IPs
  // (Express default is not to trust proxy headers).
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
    console.error('❌ [Server] Failed to start server:', err.message)
    await closeDatabase()
    process.exit(1)
  }
}

// Start the server
startServer()
