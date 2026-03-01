const storeConfigService = require('../services/storeConfigService')
const config = require('../config')

async function getConfig(req, res, next) {
  try {
    const config = await storeConfigService.get()
    res.json({ success: true, config })
  } catch (err) {
    console.error('❌ [STORE CONFIG] GET error:', err.message)
    res.status(500).json({ success: false, message: 'Failed to load store configuration' })
  }
}

async function updateConfig(req, res, next) {
  try {
    // Build config from form fields and uploaded files
    const body = req.body || {}
    const files = req.files || {}

    const payload = {
      name: body.name || undefined,
      socialMedia: {
        instagram: body.instagram || (body.socialMedia && body.socialMedia.instagram) || '',
        facebook: body.facebook || (body.socialMedia && body.socialMedia.facebook) || '',
        whatsapp: body.whatsapp || (body.socialMedia && body.socialMedia.whatsapp) || ''
      }
    }

    // attach uploaded files' public URLs when present
    const base = config.baseUrl || `${req.protocol}://${req.get('host')}`;
    if (files.logo && files.logo[0]) {
      payload.logo = `${base}/uploads/${encodeURIComponent(files.logo[0].filename)}`
    } else if (body.logo) {
      payload.logo = body.logo
    }

    if (files.banner && files.banner[0]) {
      payload.banner = `${base}/uploads/${encodeURIComponent(files.banner[0].filename)}`
    } else if (body.banner) {
      payload.banner = body.banner
    }

    // merge with any other config fields passed as JSON string
    // if body.config is present and is JSON, try to merge
    if (body.config) {
      try {
        const parsed = typeof body.config === 'string' ? JSON.parse(body.config) : body.config
        Object.assign(payload, parsed)
      } catch (err) {
        // ignore parse error
      }
    }

    const { old, config } = await storeConfigService.upsert(payload)

    // if logo/banner changed, remove previous file(s)
    const { removeUpload } = require('../utils/fileUtils')
    if (old) {
      if (old.logo && payload.logo && old.logo !== payload.logo) {
        removeUpload(old.logo).catch(err => {
          console.error('❌ [STORE CONFIG] Failed to remove old logo:', err.message)
        })
      }
      if (old.banner && payload.banner && old.banner !== payload.banner) {
        removeUpload(old.banner).catch(err => {
          console.error('❌ [STORE CONFIG] Failed to remove old banner:', err.message)
        })
      }
    }

    res.json({ success: true, config })
  } catch (err) {
    console.error('❌ [STORE CONFIG] UPDATE error:', err.message)
    res.status(500).json({ success: false, message: 'Failed to update store configuration' })
  }
}

module.exports = { getConfig, updateConfig }
