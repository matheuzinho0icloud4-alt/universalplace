const authService = require("../services/authService")
const config = require("../config")

async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const result = await authService.login(email, password)

    // send JWT as httpOnly cookie
    // in development, we allow lax sameSite to accommodate frontend running on a different origin
    // in production, use sameSite: "strict" with secure: true (HTTPS only)
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production', // true in production (HTTPS)
      // For cross-site cookie delivery, SameSite must be 'none'.
      // In development you may need to run frontend over HTTPS to allow this.
      sameSite: 'none',
      path: "/",
      maxAge: 15 * 60 * 1000, // 15 minutes
    })

    // return user without token
    res.json({ user: result.user })
  } catch (err) {
    next(err)
  }
}

async function logout(req, res, next) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'none',
      path: "/"
    })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

async function getCurrentUser(req, res, next) {
  try {
    // req.user is set by authMiddleware from decoded JWT
    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" })
    }
    res.json({ user: { id: req.user.id, email: req.user.email, role: req.user.role || 'user' } })
  } catch (err) {
    next(err)
  }
}

module.exports = { login, logout, getCurrentUser }