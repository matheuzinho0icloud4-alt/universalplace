import api from './api'

export async function fetchStoreConfig() {
  try {
    const response = await api.get('/api/store-config');
    const cfg = response?.data?.data;
    if (!cfg || typeof cfg !== 'object') {
      return { name: '', logo: '', banner: '', socialMedia: {} };
    }
    return cfg;
  } catch (err) {
    return { name: '', logo: '', banner: '', socialMedia: {} };
  }
}

export async function updateStoreConfig(config) {
  if (!config) {
    throw new TypeError('updateStoreConfig expects a payload');
  }

  let response;
  if (config instanceof FormData) {
    response = await api.put('/api/store-config', config);
  } else {
    if (typeof config !== 'object') {
      throw new TypeError('updateStoreConfig expects an object or FormData');
    }
    response = await api.put('/api/store-config', config);
  }

  // Response structure: { success: true, data: config }
  const cfg = response?.data?.data;
  if (!cfg || typeof cfg !== 'object') {
    throw new Error('Invalid config received');
  }
  return cfg;
}
