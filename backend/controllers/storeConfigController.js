const storeConfigService = require('../services/storeConfigService')
const appConfig = require('../config')
const { z } = require('zod')
const logger = require('../utils/logger')

const StoreConfigSchema = z.object({
  name: z.string().min(1).optional(),
  logo_url: z.string().url().optional(),
  banner_url: z.string().url().optional(),
  socialMedia: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    youtube: z.string().optional(),
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

    // Extract socialMedia object from body (frontend sends it as an object)
    // Fallback: if socialMedia is nested differently, extract individually
    let socialMedia = body.socialMedia || {}
    if (typeof socialMedia !== 'object') {
      socialMedia = {}
    }
    
    // Ensure each social field is a string (not null)
    socialMedia = {
      instagram: socialMedia.instagram || '',
      facebook: socialMedia.facebook || '',
      youtube: socialMedia.youtube || ''
    }

    const input = {
      name: body.name || undefined,
      logo_url: body.logo_url || body.logo || undefined,
      banner_url: body.banner_url || body.banner || undefined,
      socialMedia: socialMedia
    }

    logger.info('📝 [CTRL] Received update with socialMedia: %o', input.socialMedia)

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

    // no local file cleanup required (images are external URLs)

    logger.info('✅ [CTRL] Store config updated successfully with socialMedia: %o', config.socialMedia)
    return res.json({ success: true, data: config, message: 'Store config updated successfully' })
  } catch (err) {
    return next(err)
  }
}

module.exports = { getConfig, updateConfig }
