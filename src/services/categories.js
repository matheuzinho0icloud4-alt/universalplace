import api from './api';

export async function fetchCategoriesForHome() {
  try {
    const response = await api.get('/categories/home');
    const categories = response?.data?.data || [];
    return Array.isArray(categories) ? categories : [];
  } catch (err) {
    return [];
  }
}

export async function fetchCategoriesForHome() {
  try {
    const response = await api.get('/categories/home');
    const categories = response?.data?.data || [];
    return Array.isArray(categories) ? categories : [];
  } catch (err) {
    return [];
  }
}

export async function createCategory({ name, slug, show_home, home_order }) {
  const payload = { name, slug, show_home, home_order };
  const response = await api.post('/categories', payload, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response?.data?.data;
}

export async function updateCategory(id, { name, slug, show_home, home_order }) {
  const payload = { name, slug, show_home, home_order };
  const response = await api.put(`/categories/${id}`, payload, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response?.data?.data;
}

export async function deleteCategory(id) {
  const response = await api.delete(`/categories/${id}`);
  return response?.data?.data;
}