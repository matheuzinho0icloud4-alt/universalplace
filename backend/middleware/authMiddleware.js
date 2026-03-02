
const jwt = require("jsonwebtoken")
const config = require("../config")
const userRepo = require("../repositories/userRepository")

async function authMiddleware(req, res, next) {
  const token = req.cookies && req.cookies.token

  if (!token) {
    return res.status(401).json({ error: "Token ausente" })
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret, {
      algorithms: ['HS256']
    })

    // attach full user information from DB to req.user
    const user = await userRepo.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' })
    }

    req.user = { id: user.id, email: user.email, role: user.role || 'user' }
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
