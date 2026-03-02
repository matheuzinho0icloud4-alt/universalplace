import api from './api';

export async function fetchProducts() {
  const res = await api.get('/products');
  const payload = res?.data;
  if (!payload || typeof payload !== 'object') {
    console.warn('fetchProducts: invalid response', payload);
    return [];
  }
  const products = payload.data || payload.products;
  if (!Array.isArray(products)) {
    console.warn('fetchProducts: data is not array', products);
    return [];
  }
  return products;
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

  const res = await api.post('/products', form);
  return res.data?.data || res.data;
}

export async function updateProductApi(id, { name, link_oferta }, imageFile) {
  _assertProductPayload({ name, link_oferta });
  const form = new FormData();
  form.append('name', name);
  form.append('link_oferta', link_oferta || '');
  if (imageFile) form.append('image', imageFile);

  const res = await api.put(`/products/${id}`, form);
  return res.data?.data || res.data;
}

export async function deleteProductApi(id) {
  if (id === undefined || id === null) {
    throw new TypeError('deleteProductApi requires an id');
  }
  const res = await api.delete(`/products/${id}`);
  return res.data?.data || res.data;
}
