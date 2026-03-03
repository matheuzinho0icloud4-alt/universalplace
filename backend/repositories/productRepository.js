const { pool } = require("../database")
const logger = require("../utils/logger")

async function createProduct({ name, image, description, product_link, user_id }) {
  logger.debug('INSERT products: %o', { name, user_id, image: !!image, product_link })
  const res = await pool.query(
    "INSERT INTO products (name, image, description, product_link, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, image, description, product_link, user_id]
  )
  logger.debug('Product inserted, ID: %s', res.rows[0]?.id)
  return res.rows[0]
}

async function getAllProducts() {
  const res = await pool.query("SELECT * FROM products")
  return res.rows
}

async function getProductsByUser(userId) {
  const res = await pool.query("SELECT * FROM products WHERE user_id = $1", [userId])
  return res.rows
}

async function updateProduct(id, userId, updates) {
  const fields = []
  const values = []
  let idx = 1
  for (const key in updates) {
    fields.push(`${key}=$${idx}`)
    values.push(updates[key])
    idx++
  }
  values.push(id, userId)
  const res = await pool.query(
    `UPDATE products SET ${fields.join(',')} WHERE id=$${idx++} AND user_id=$${idx} RETURNING *`,
    values
  )
  return res.rows[0]
}

async function getProductById(id, userId) {
  const res = await pool.query(
    "SELECT * FROM products WHERE id=$1 AND user_id=$2",
    [id, userId]
  )
  return res.rows[0]
}

async function deleteProduct(id, userId) {
  const res = await pool.query(
    "DELETE FROM products WHERE id=$1 AND user_id=$2",
    [id, userId]
  )
  return res.rowCount
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductsByUser,
  getProductById,
  updateProduct,
  deleteProduct,
}
