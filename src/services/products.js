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

export async function createProduct({ name, image, description, product_link }) {
  _assertProductPayload({ name });
  const payload = { name, image, description, product_link };
  const response = await api.post('/products', payload, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response?.data?.data;
}

export async function updateProductApi(id, { name, image, description, product_link }) {
  _assertProductPayload({ name });
  const payload = { name, image, description, product_link };
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
