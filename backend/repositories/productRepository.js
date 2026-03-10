const { pool } = require("../database")
const logger = require("../utils/logger")

async function createProduct({ name, image, description, product_link, user_id, category_id, is_featured }) {
  logger.debug('INSERT products: %o', { name, user_id, image: !!image, product_link, category_id, is_featured })
  const res = await pool.query(
    "INSERT INTO products (name, image, description, product_link, user_id, category_id, is_featured) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [name, image, description, product_link, user_id, category_id, is_featured]
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

async function getFeaturedProducts(limit = 6) {
  const res = await pool.query(
    "SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_featured = true ORDER BY p.created_at DESC LIMIT $1",
    [limit]
  )
  return res.rows
}

async function getRecentProducts(limit = 8) {
  const res = await pool.query(
    "SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC LIMIT $1",
    [limit]
  )
  return res.rows
}

async function getProductsByCategory(categorySlug, page = 1, limit = 12) {
  const offset = (page - 1) * limit
  const res = await pool.query(
    "SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p JOIN categories c ON p.category_id = c.id WHERE c.slug = $1 ORDER BY p.created_at DESC LIMIT $2 OFFSET $3",
    [categorySlug, limit, offset]
  )
  return res.rows
}

async function getProductsByCategoryWithCount(categorySlug, page = 1, limit = 12) {
  const offset = (page - 1) * limit
  const [productsRes, countRes] = await Promise.all([
    pool.query(
      "SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p JOIN categories c ON p.category_id = c.id WHERE c.slug = $1 ORDER BY p.created_at DESC LIMIT $2 OFFSET $3",
      [categorySlug, limit, offset]
    ),
    pool.query(
      "SELECT COUNT(*) as total FROM products p JOIN categories c ON p.category_id = c.id WHERE c.slug = $1",
      [categorySlug]
    )
  ])
  return {
    products: productsRes.rows,
    total: parseInt(countRes.rows[0].total),
    page,
    limit,
    totalPages: Math.ceil(parseInt(countRes.rows[0].total) / limit)
  }
}

async function getProductsForCategoryCarousel(categoryId, limit = 6) {
  const res = await pool.query(
    "SELECT * FROM products WHERE category_id = $1 ORDER BY created_at DESC LIMIT $2",
    [categoryId, limit]
  )
  return res.rows
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductsByUser,
  getProductById,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getRecentProducts,
  getProductsByCategory,
  getProductsByCategoryWithCount,
  getProductsForCategoryCarousel,
}
