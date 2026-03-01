const storeConfigRepo = require('../repositories/storeConfigRepository')

async function get() {
  const row = await storeConfigRepo.getConfig()
  return row ? row.config : null
}

async function upsert(config) {
  // fetch existing config so caller can decide what to delete
  const existingRow = await storeConfigRepo.getConfig()
  const oldConfig = existingRow ? existingRow.config : null

  const row = await storeConfigRepo.upsertConfig(config)
  return { old: oldConfig, config: row.config }
}

module.exports = { get, upsert }
