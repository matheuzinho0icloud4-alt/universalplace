
const express = require("express")
const { create, list, update, remove } = require("../controllers/productController")
const authMiddleware = require("../middleware/authMiddleware")
const { productRules, checkErrors } = require("../middleware/validators")
const { authLimiter } = require("../middleware/rateLimiter")

const router = express.Router()

// No local uploads: API accepts JSON with `image` (URL), `description` and `product_link`.

// public list
router.get("/", list)

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
