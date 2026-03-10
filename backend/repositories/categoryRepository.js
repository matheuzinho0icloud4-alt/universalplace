const { pool } = require("../database")
const logger = require("../utils/logger")

async function createCategory({ name, slug, show_home, home_order }) {
  logger.debug('INSERT categories: %o', { name, slug, show_home, home_order })
  const res = await pool.query(
    "INSERT INTO categories (name, slug, show_home, home_order) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, slug, show_home || false, home_order || 0]
  )
  logger.debug('Category inserted, ID: %s', res.rows[0]?.id)
  return res.rows[0]
}

async function getAllCategories() {
  const res = await pool.query("SELECT * FROM categories ORDER BY home_order ASC, name ASC")
  return res.rows
}

async function getCategoriesForHome() {
  // Get categories with product count
  const categoriesRes = await pool.query(`
    SELECT c.*, COUNT(p.id) as product_count
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id
    WHERE c.show_home = true
    GROUP BY c.id
    HAVING COUNT(p.id) > 0
    ORDER BY c.home_order ASC, c.name ASC
  `);

  const categories = categoriesRes.rows;

  // For each category, get up to 6 products
  for (const category of categories) {
    const productsRes = await pool.query(
      "SELECT * FROM products WHERE category_id = $1 ORDER BY created_at DESC LIMIT 6",
      [category.id]
    );
    category.products = productsRes.rows;
  }

  return categories;
}

async function getCategoryById(id) {
  const res = await pool.query("SELECT * FROM categories WHERE id = $1", [id])
  return res.rows[0]
}

async function getCategoryBySlug(slug) {
  const res = await pool.query("SELECT * FROM categories WHERE slug = $1", [slug])
  return res.rows[0]
}

async function updateCategory(id, updates) {
  const fields = []
  const values = []
  let idx = 1
  for (const key in updates) {
    fields.push(`${key}=$${idx}`)
    values.push(updates[key])
    idx++
  }
  values.push(id)
  const res = await pool.query(
    `UPDATE categories SET ${fields.join(',')} WHERE id=$${idx} RETURNING *`,
    values
  )
  return res.rows[0]
}

async function deleteCategory(id) {
  const res = await pool.query("DELETE FROM categories WHERE id = $1", [id])
  return res.rowCount
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoriesForHome,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
}