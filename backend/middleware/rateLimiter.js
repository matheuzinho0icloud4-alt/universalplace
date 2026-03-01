const rateLimit = require('express-rate-limit')
const config = require('../config')

// on dev we don't want limits to interfere with rapid testing
// In production, use a secure keyGenerator based on `req.ip` so the limiter
// keys requests per originating IP. `req.ip` will reflect the client IP
// correctly when `trust proxy` is properly set to `1` in production.
const globalLimiter = config.nodeEnv === 'development'
  ? (req, res, next) => next()
  : rateLimit({
      windowMs: config.rateLimitWindowMs,
      max: config.rateLimitMax,
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req /*, res */) => {
        // Prefer req.ip which is already normalized by Express.
        // Fallback to connection remote address if missing.
        return req.ip || req.connection?.remoteAddress || ''
      },
    })

// In development, disable auth rate limiter for easier testing
const authLimiter = config.nodeEnv === 'development'
  ? (req, res, next) => next()
  : rateLimit({
      windowMs: 15 * 60 * 1000, // 15 min
      max: 10,
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req) => req.ip || req.connection?.remoteAddress || '',
      message: 'Too many attempts, please try again later',
    })

module.exports = { globalLimiter, authLimiter }
