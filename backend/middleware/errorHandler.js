const logger = require('../utils/logger')

function errorHandler(err, req, res, next) {
  const status = err.status && Number.isInteger(err.status) ? err.status : 500
  const message = err.exposeMessage || err.message || 'Internal server error'
  const errorCode = err.errorCode || (status === 500 ? 'INTERNAL_ERROR' : 'CLIENT_ERROR')

  // Structured logging
  logger.error('Error: %s %o', message, {
    status,
    errorCode,
    path: req.originalUrl,
    method: req.method,
    stack: err.stack,
    meta: err.meta || null,
  })

  const payload = {
    success: false,
    message,
    errorCode,
  }

  // Include stack in development for easier debugging
  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack
  }

  res.status(status).json(payload)
}

module.exports = errorHandler
