const { pool } = require('../database')
const logger = require('../utils/logger')

async function getConfig() {
  const res = await pool.query('SELECT id, config FROM store_config WHERE id = 1')
  if (!res.rows[0]) {
    return null
  }
  
  const row = res.rows[0]
  // Ensure config is parsed as an object (postgres may return as object or string)
  const parsedConfig = typeof row.config === 'string' ? JSON.parse(row.config) : row.config
  
  return {
    ...row,
    config: parsedConfig
  }
}

async function upsertConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new Error('Config must be an object')
  }
  
  // Convert config object to JSON string for safe storage in JSONB
  const configJson = JSON.stringify(config)
  logger.info('💾 [REPO] Saving store_config: %s', configJson)
  
  // update if exists else insert with id=1
  await pool.query(
    `INSERT INTO store_config (id, config)
     VALUES (1, $1::jsonb)
     ON CONFLICT (id) DO UPDATE SET config = EXCLUDED.config`,
    [configJson]
  )
  
  const res = await pool.query('SELECT id, config FROM store_config WHERE id = 1')
  if (!res.rows[0]) {
    throw new Error('Failed to retrieve store_config after update')
  }
  
  const row = res.rows[0]
  // Ensure config is parsed as an object
  const parsedConfig = typeof row.config === 'string' ? JSON.parse(row.config) : row.config
  
  return {
    ...row,
    config: parsedConfig
  }
}

module.exports = { getConfig, upsertConfig }
