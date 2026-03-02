import api from './api';

export async function fetchProducts() {
  try {
    const { data: response } = await api.get('/products');
    // Response structure: { success: true, data: [...] }
    const products = response?.data;
    if (!Array.isArray(products)) {
      console.debug('fetchProducts: response.data is not array, returning []', products);
      return [];
    }
    return products;
  } catch (err) {
    console.error('fetchProducts: error fetching products', err.message);
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

  const { data: response } = await api.post('/products', form);
  // Response structure: { success: true, data: product }
  return response?.data;
}

export async function updateProductApi(id, { name, link_oferta }, imageFile) {
  _assertProductPayload({ name, link_oferta });
  const form = new FormData();
  form.append('name', name);
  form.append('link_oferta', link_oferta || '');
  if (imageFile) form.append('image', imageFile);

  const { data: response } = await api.put(`/products/${id}`, form);
  // Response structure: { success: true, data: product }
  return response?.data;
}

export async function deleteProductApi(id) {
  if (id === undefined || id === null) {
    throw new TypeError('deleteProductApi requires an id');
  }
  const { data: response } = await api.delete(`/products/${id}`);
  // Response structure: { success: true, data: null }
  return response?.data;
}
