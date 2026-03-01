
const express = require("express")
const multer = require("multer")
const { create, list, update, remove } = require("../controllers/productController")
const authMiddleware = require("../middleware/authMiddleware")
const { productRules, checkErrors } = require("../middleware/validators")
const { authLimiter } = require("../middleware/rateLimiter")

const router = express.Router()

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    // sanitize original name: remove problematic characters and spaces
    const safeName = file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      // collapse multiple underscores
      .replace(/_+/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
})

const upload = multer({ storage })

// public list
router.get("/", list)

// protected endpoints
router.post(
  "/",
  authLimiter,
  authMiddleware,
  upload.single("image"),
  productRules,
  checkErrors,
  create
)

router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  productRules,
  checkErrors,
  update
)

router.delete("/:id", authMiddleware, remove)

module.exports = router
