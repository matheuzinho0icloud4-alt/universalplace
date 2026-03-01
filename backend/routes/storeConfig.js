const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const crypto = require('crypto')
const { getConfig, updateConfig } = require('../controllers/storeConfigController')
const authMiddleware = require('../middleware/authMiddleware')

// configure multer storage to backend/uploads
const uploadsDir = path.join(__dirname, '..', 'uploads')

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadsDir)
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname)
		const name = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`
		cb(null, name)
	}
})

function fileFilter (req, file, cb) {
	// accept images only
	if (!file.mimetype.startsWith('image/')) {
		return cb(new Error('Only image files are allowed'), false)
	}
	cb(null, true)
}

const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
	fileFilter,
})

// public GET
router.get('/', getConfig)

// protected PUT (admin) - accept up to two files: logo and banner
router.put('/', authMiddleware, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), updateConfig)

module.exports = router
