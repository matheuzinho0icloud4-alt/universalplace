
const jwt = require("jsonwebtoken")
const config = require("../config")

function authMiddleware(req, res, next) {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ error: "Token ausente" })
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret, {
      algorithms: ['HS256']
    })
    req.user = decoded
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expirado" })
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Token inválido" })
    }
    return res.status(401).json({ error: "Não autenticado" })
  }
}

module.exports = authMiddleware
