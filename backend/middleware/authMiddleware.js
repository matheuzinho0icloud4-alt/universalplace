
const jwt = require("jsonwebtoken")
const config = require("../config")

function authMiddleware(req, res, next) {
  const token = req.cookies.token
  
  if (!token) {
    return res.status(401).json({ error: "Token ausente" })
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    req.user = decoded
    next()
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido'
    return res.status(401).json({ error: message })
  }
}

module.exports = authMiddleware
