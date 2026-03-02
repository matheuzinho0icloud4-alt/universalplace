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

export async function createProduct({ name, link_oferta }, imageFile) {
  _assertProductPayload({ name, link_oferta });
  const form = new FormData();
  form.append('name', name);
  form.append('link_oferta', link_oferta || '');
  if (imageFile) form.append('image', imageFile);

  const response = await api.post('/products', form);
  // Response structure: { success: true, data: product }
  return response?.data?.data;
}

export async function updateProductApi(id, { name, link_oferta }, imageFile) {
  _assertProductPayload({ name, link_oferta });
  const form = new FormData();
  form.append('name', name);
  form.append('link_oferta', link_oferta || '');
  if (imageFile) form.append('image', imageFile);

  const response = await api.put(`/products/${id}`, form);
  // Response structure: { success: true, data: product }
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
