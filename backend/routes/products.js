
const express = require("express")
const { create, list, update, remove, getFeatured, getRecent, getByCategory } = require("../controllers/productController")
const authMiddleware = require("../middleware/authMiddleware")
const { productRules, checkErrors } = require("../middleware/validators")
const { authLimiter } = require("../middleware/rateLimiter")

const router = express.Router()

// public list
router.get("/", list)
router.get("/featured", getFeatured)
router.get("/recent", getRecent)
router.get("/category/:slug", getByCategory)

// protected endpoints
router.post(
  "/",
  authLimiter,
  authMiddleware,
  productRules,
  checkErrors,
  create
)

router.put(
  "/:id",
  authMiddleware,
  productRules,
  checkErrors,
  update
)

router.delete("/:id", authMiddleware, remove)

module.exports = router
