const express = require('express')
const router = express.Router()
const path = require('path')
const { getConfig, updateConfig } = require('../controllers/storeConfigController')
const authMiddleware = require('../middleware/authMiddleware')

// public GET
router.get('/', getConfig)

// protected PUT (admin) - accepts JSON with `logo_url` and `banner_url`
router.put('/', authMiddleware, updateConfig)

module.exports = router
