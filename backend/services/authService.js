const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userRepo = require("../repositories/userRepository")
const config = require("../config")

async function register(email, password) {
  const existing = await userRepo.findByEmail(email)
  if (existing) {
    const err = new Error("Email already in use")
    err.status = 400
    throw err
  }
  const hash = await bcrypt.hash(password, 10)
  const user = await userRepo.createUser(email, hash)
  return user
}

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
  const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: "1d" })
  return { token, user: { id: user.id, email: user.email } }
}

module.exports = { register, login }