const productRepo = require("../repositories/productRepository")

async function listAll() {
  return productRepo.getAllProducts()
}

async function listByUser(userId) {
  return productRepo.getProductsByUser(userId)
}

async function create(data, userId) {
  return productRepo.createProduct({ ...data, user_id: userId })
}

async function update(id, userId, updates) {
  // return both old and updated record to allow controller to cleanup files
  const old = await productRepo.getProductById(id, userId)
  const updated = await productRepo.updateProduct(id, userId, updates)
  return { old, updated }
}

async function remove(id, userId) {
  const old = await productRepo.getProductById(id, userId)
  const count = await productRepo.deleteProduct(id, userId)
  return { old, count }
}

async function getFeatured(limit = 6) {
  return productRepo.getFeaturedProducts(limit)
}

async function getRecent(limit = 8) {
  return productRepo.getRecentProducts(limit)
}

async function getByCategory(categorySlug, page = 1, limit = 12) {
  return productRepo.getProductsByCategoryWithCount(categorySlug, page, limit)
}

async function getForCategoryCarousel(categoryId, limit = 6) {
  return productRepo.getProductsForCategoryCarousel(categoryId, limit)
}

module.exports = { listAll, listByUser, create, update, remove, getFeatured, getRecent, getByCategory, getForCategoryCarousel }