const { pool } = require('../database')

async function getConfig() {
  const res = await pool.query('SELECT id, config FROM store_config WHERE id = 1')
  return res.rows[0]
}

async function upsertConfig(config) {
  // update if exists else insert with id=1
  await pool.query(
    `INSERT INTO store_config (id, config)
     VALUES (1, $1)
     ON CONFLICT (id) DO UPDATE SET config = EXCLUDED.config`,
    [config]
  )
  const res = await pool.query('SELECT id, config FROM store_config WHERE id = 1')
  return res.rows[0]
}

module.exports = { getConfig, upsertConfig }
