const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userRepo = require("../repositories/userRepository")
const config = require("../config")

async function login(email, password) {
  const user = await userRepo.findByEmail(email)
  if (!user) {
    const err = new Error("Invalid credentials")
    err.status = 401
    throw err
  }
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    const err = new Error("Invalid credentials")
    err.status = 401
    throw err
  }
  const payload = { id: user.id, role: user.role || 'user' }
  const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "15m", algorithm: 'HS256' })
  return { token, user: { id: user.id, email: user.email, role: user.role || 'user' } }
}

module.exports = { login }