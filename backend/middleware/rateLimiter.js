const rateLimit = require('express-rate-limit')
const config = require('../config')

// on dev we don't want limits to interfere with rapid testing
const globalLimiter = config.nodeEnv === 'development' ? (req, res, next) => next() : rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
})

// In development, disable auth rate limiter for easier testing
const authLimiter = config.nodeEnv === 'development' 
  ? (req, res, next) => next() 
  : rateLimit({
      windowMs: 15 * 60 * 1000, // 15 min
      max: 10,
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Too many attempts, please try again later',
    })

module.exports = { globalLimiter, authLimiter }
