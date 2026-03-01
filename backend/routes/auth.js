
const express = require("express")
const { register, login, logout, getCurrentUser } = require("../controllers/authController")
const { registerRules, loginRules, checkErrors } = require("../middleware/validators")
const { authLimiter } = require("../middleware/rateLimiter")
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()

// registration with validation and rate limiting
router.post("/register", authLimiter, registerRules, checkErrors, register)

// login route
router.post("/login", authLimiter, loginRules, checkErrors, login)

// get current user (protected)
router.get("/me", authMiddleware, getCurrentUser)

// logout
router.post("/logout", authMiddleware, logout)

module.exports = router
