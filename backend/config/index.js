const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const missing = [];
if (!process.env.JWT_SECRET) missing.push('JWT_SECRET');
if (!process.env.DATABASE_URL) missing.push('DATABASE_URL');
if (missing.length) {
  console.error('Missing required environment variables:', missing.join(', '));
  process.exit(1);
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3003,
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
  // Allowed origin(s) for CORS; in development you can set a localhost value.
  corsOrigin: process.env.CORS_ORIGIN || '',
  // optional base URL used by helpers; if not provided we derive from requests
  baseUrl: process.env.BASE_URL || null,
  rateLimitWindowMs: 15 * 60 * 1000,
  rateLimitMax: 100,
};