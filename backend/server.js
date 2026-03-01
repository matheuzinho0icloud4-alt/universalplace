
const express = require("express")
const path = require("path")
const helmet = require("helmet")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const morgan = require("morgan")
const config = require("./config")
const { globalLimiter } = require("./middleware/rateLimiter")
const errorHandler = require("./middleware/errorHandler")

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

// trust proxy headers when deployed behind a proxy (e.g. Render)
app.set('trust proxy', true);

app.listen(config.port, () => {
  console.log(`🔥 PostgreSQL API listening on port ${config.port}`);
})
