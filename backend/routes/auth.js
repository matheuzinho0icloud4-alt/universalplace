
const express = require("express")
const { login, logout, getCurrentUser } = require("../controllers/authController")
const { loginRules, checkErrors } = require("../middleware/validators")
const { authLimiter } = require("../middleware/rateLimiter")
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()

// login route (single admin user only)
router.post("/login", authLimiter, loginRules, checkErrors, login)

// get current user (protected)
router.get("/me", authMiddleware, getCurrentUser)

// logout (allow clearing cookie even if token expired)
router.post("/logout", logout)

module.exports = router
