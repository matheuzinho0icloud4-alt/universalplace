const express = require("express")
const { create, list, listForHome, update, remove } = require("../controllers/categoryController")
const authMiddleware = require("../middleware/authMiddleware")
const { authLimiter } = require("../middleware/rateLimiter")

const router = express.Router()

// Public routes
router.get("/", list)
router.get("/home", listForHome)

// Protected routes
router.post("/", authLimiter, authMiddleware, create)
router.put("/:id", authMiddleware, update)
router.delete("/:id", authMiddleware, remove)

module.exports = router