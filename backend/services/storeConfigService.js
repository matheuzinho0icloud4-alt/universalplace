const storeConfigRepo = require('../repositories/storeConfigRepository')
const logger = require('../utils/logger')

async function get() {
  const row = await storeConfigRepo.getConfig()
  if (!row) {
    logger.warn('⚠️ [SERVICE] store_config not found, returning empty config')
    return {
      name: '',
      logo_url: '',
      banner_url: '',
      socialMedia: {}
    }
  }
  
  // Ensure socialMedia is always present and is an object
  const config = row.config || {}
  if (!config.socialMedia || typeof config.socialMedia !== 'object') {
    config.socialMedia = {}
  }
  
  logger.info('📖 [SERVICE] Retrieved store config: %o', config)
  return config
}

async function upsert(config) {
  if (!config || typeof config !== 'object') {
    throw new TypeError('Config must be an object')
  }
  
  // Ensure socialMedia is always present and is an object
  if (!config.socialMedia || typeof config.socialMedia !== 'object') {
    config.socialMedia = {}
  }
  
  logger.info('🔄 [SERVICE] Upserting store config with socialMedia: %o', config.socialMedia)
  
  // fetch existing config so caller can decide what to delete
  const existingRow = await storeConfigRepo.getConfig()
  const oldConfig = existingRow ? existingRow.config : null

  const row = await storeConfigRepo.upsertConfig(config)
  return { old: oldConfig, config: row.config }
}

module.exports = { get, upsert }
