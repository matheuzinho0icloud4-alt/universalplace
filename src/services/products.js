import api from './api';

export async function fetchProducts() {
  const res = await api.get('/products');
  const data = res?.data;
  if (!Array.isArray(data)) {
    console.warn('fetchProducts expected array but got', data);
    return [];
  }
  return data;
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
  return res.data;
}

export async function updateProductApi(id, { name, link_oferta }, imageFile) {
  _assertProductPayload({ name, link_oferta });
  const form = new FormData();
  form.append('name', name);
  form.append('link_oferta', link_oferta || '');
  if (imageFile) form.append('image', imageFile);

  const res = await api.put(`/products/${id}`, form);
  return res.data;
}

export async function deleteProductApi(id) {
  if (id === undefined || id === null) {
    throw new TypeError('deleteProductApi requires an id');
  }
  const res = await api.delete(`/products/${id}`);
  return res.data;
}
