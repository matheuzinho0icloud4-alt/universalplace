const storeConfigService = require('../services/storeConfigService')
const appConfig = require('../config')
const { z } = require('zod')
const logger = require('../utils/logger')

const StoreConfigSchema = z.object({
  name: z.string().min(1).optional(),
  logo: z.string().url().optional(),
  banner: z.string().url().optional(),
  socialMedia: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    whatsapp: z.string().optional(),
  }).optional(),
})

async function getConfig(req, res, next) {
  try {
    const cfg = await storeConfigService.get()
    return res.json({ success: true, data: cfg })
  } catch (err) {
    return next(err)
  }
}

async function updateConfig(req, res, next) {
  try {
    // Build input object from allowed fields only
    const body = req.body || {}
    const files = req.files || {}

    const base = appConfig.baseUrl || `${req.protocol}://${req.get('host')}`

    const input = {
      name: body.name || undefined,
      logo: body.logo || undefined,
      banner: body.banner || undefined,
      socialMedia: {
        instagram: body.instagram || undefined,
        facebook: body.facebook || undefined,
        whatsapp: body.whatsapp || undefined,
      }
    }

    // handle uploaded files
    if (files.logo && files.logo[0]) {
      input.logo = `${base}/uploads/${encodeURIComponent(files.logo[0].filename)}`
    }
    if (files.banner && files.banner[0]) {
      input.banner = `${base}/uploads/${encodeURIComponent(files.banner[0].filename)}`
    }

    // Validate with Zod to prevent unexpected fields
    const parsed = StoreConfigSchema.safeParse(input)
    if (!parsed.success) {
      const err = new Error('Invalid store configuration payload')
      err.status = 400
      err.errorCode = 'INVALID_PAYLOAD'
      err.meta = parsed.error.format()
      return next(err)
    }

    const { old, config } = await storeConfigService.upsert(parsed.data)

    // cleanup old uploads if needed
    const { removeUpload } = require('../utils/fileUtils')
    if (old) {
      if (old.logo && parsed.data.logo && old.logo !== parsed.data.logo) {
        removeUpload(old.logo).catch(e => logger.warn('Failed to remove old logo: %o', e))
      }
      if (old.banner && parsed.data.banner && old.banner !== parsed.data.banner) {
        removeUpload(old.banner).catch(e => logger.warn('Failed to remove old banner: %o', e))
      }
    }

    return res.json({ success: true, data: config, message: 'Store config updated successfully' })
  } catch (err) {
    return next(err)
  }
}

module.exports = { getConfig, updateConfig }
