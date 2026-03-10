import api from './api';

export async function fetchProducts() {
  try {
    const response = await api.get('/products');
    const products = response?.data?.data || [];

    if (!Array.isArray(products)) {
      console.warn('fetchProducts: expected array, got', typeof products);
      return [];
    }
    return products;
  } catch (err) {
    // failure simply returns empty array
    return [];
  }
}

function _assertProductPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new TypeError('Product payload must be an object');
  }
}

export async function createProduct({ name, image, description, product_link, category_id, is_featured }) {
  _assertProductPayload({ name });
  const payload = { name, image, description, product_link, category_id, is_featured };
  const response = await api.post('/products', payload, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response?.data?.data;
}

export async function updateProductApi(id, { name, image, description, product_link, category_id, is_featured }) {
  _assertProductPayload({ name });
  const payload = { name, image, description, product_link, category_id, is_featured };
  const response = await api.put(`/products/${id}`, payload, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response?.data?.data;
}

export async function deleteProductApi(id) {
  if (id === undefined || id === null) {
    throw new TypeError('deleteProductApi requires an id');
  }
  const response = await api.delete(`/products/${id}`);
  // Response structure: { success: true, data: null }
  return response?.data?.data;
}

export async function fetchFeaturedProducts(limit = 6) {
  try {
    const response = await api.get(`/products/featured?limit=${limit}`);
    const products = response?.data?.data || [];
    return Array.isArray(products) ? products : [];
  } catch (err) {
    return [];
  }
}

export async function fetchRecentProducts(limit = 8) {
  try {
    const response = await api.get(`/products/recent?limit=${limit}`);
    const products = response?.data?.data || [];
    return Array.isArray(products) ? products : [];
  } catch (err) {
    return [];
  }
}

export async function fetchProductsByCategory(slug, page = 1, limit = 12) {
  try {
    const response = await api.get(`/products/category/${slug}?page=${page}&limit=${limit}`);
    return response?.data?.data || { products: [], total: 0, page: 1, limit: 12, totalPages: 0 };
  } catch (err) {
    return { products: [], total: 0, page: 1, limit: 12, totalPages: 0 };
  }
}
