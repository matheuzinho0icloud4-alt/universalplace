const authService = require("../services/authService")
const config = require("../config")

async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const result = await authService.login(email, password)

    // send JWT as httpOnly cookie (exact required settings)
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
      path: "/",
    })

    // return standard success response
    res.json({ success: true, data: result.user, message: 'Login successful' })
  } catch (err) {
    next(err)
  }
}

async function logout(req, res, next) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
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
      const err = new Error('Not authenticated')
      err.status = 401
      err.errorCode = 'NOT_AUTHENTICATED'
      return next(err)
    }

    res.json({ success: true, data: { id: req.user.id, email: req.user.email, role: req.user.role || 'user' } })
  } catch (err) {
    next(err)
  }
}

module.exports = { login, logout, getCurrentUser }