const pool = require("../database")

async function createProduct({ name, image, user_id, link_oferta }) {
  console.log('💾 [REPO] INSERT products:', { name, user_id, image: !!image, link_oferta })
  const res = await pool.query(
    "INSERT INTO products (name, image, user_id, link_oferta) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, image, user_id, link_oferta]
  )
  console.log('✅ [REPO] Product inserted, ID:', res.rows[0]?.id)
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
