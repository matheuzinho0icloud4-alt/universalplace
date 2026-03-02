
const jwt = require("jsonwebtoken")
const config = require("../config")
const userRepo = require("../repositories/userRepository")

async function authMiddleware(req, res, next) {
  const token = req.cookies && req.cookies.token

  if (!token) {
    const err = new Error('Token ausente')
    err.status = 401
    err.errorCode = 'NO_TOKEN'
    return next(err)
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret, {
      algorithms: ['HS256']
    })

    // attach full user information from DB to req.user
    const user = await userRepo.findById(decoded.id)
    if (!user) {
      const err = new Error('Usuário não encontrado')
      err.status = 401
      err.errorCode = 'USER_NOT_FOUND'
      return next(err)
    }

    req.user = { id: user.id, email: user.email, role: user.role || 'user' }
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      err.status = 401
      err.errorCode = 'TOKEN_EXPIRED'
    } else if (err.name === 'JsonWebTokenError') {
      err.status = 401
      err.errorCode = 'INVALID_TOKEN'
    } else {
      err.status = 401
      err.errorCode = 'NOT_AUTHENTICATED'
    }
    next(err)
  }
}

module.exports = authMiddleware
