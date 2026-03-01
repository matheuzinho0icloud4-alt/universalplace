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

module.exports = { listAll, listByUser, create, update, remove }