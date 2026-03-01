const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const nodeEnv = process.env.NODE_ENV || 'development';
const missing = [];

if (!process.env.JWT_SECRET) missing.push('JWT_SECRET');
if (!process.env.DATABASE_URL) missing.push('DATABASE_URL');
if (!process.env.CORS_ORIGIN) missing.push('CORS_ORIGIN');

if (missing.length) {
  console.error('❌ Missing required environment variables:', missing.join(', '));
  process.exit(1);
}

module.exports = {
  nodeEnv,
  port: process.env.PORT || 3003,
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
  corsOrigin: process.env.CORS_ORIGIN,
  baseUrl: process.env.BASE_URL || null,
  rateLimitWindowMs: 15 * 60 * 1000,
  rateLimitMax: 100,
};