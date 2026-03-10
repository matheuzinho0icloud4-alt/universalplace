const categoryRepo = require("../repositories/categoryRepository")

async function listAll() {
  return categoryRepo.getAllCategories()
}

async function listForHome() {
  return categoryRepo.getCategoriesForHome()
}

async function create(data) {
  // Generate slug from name if not provided
  if (!data.slug) {
    data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }
  return categoryRepo.createCategory(data)
}

async function update(id, updates) {
  if (updates.name && !updates.slug) {
    updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }
  return categoryRepo.updateCategory(id, updates)
}

async function remove(id) {
  return categoryRepo.deleteCategory(id)
}

async function getById(id) {
  return categoryRepo.getCategoryById(id)
}

async function getBySlug(slug) {
  return categoryRepo.getCategoryBySlug(slug)
}

module.exports = { listAll, listForHome, create, update, remove, getById, getBySlug }