import api from './api'

export async function fetchStoreConfig() {
  try {
    const response = await api.get('/api/store-config');
    const cfg = response?.data?.data;
    if (!cfg || typeof cfg !== 'object') {
      return { name: '', logo_url: '', banner_url: '', socialMedia: {} };
    }
    return cfg;
  } catch (err) {
      return { name: '', logo_url: '', banner_url: '', socialMedia: {} };
  }
}

export async function updateStoreConfig(config) {
  if (!config) {
    throw new TypeError('updateStoreConfig expects a payload');
  }
  if (typeof config !== 'object') {
    throw new TypeError('updateStoreConfig expects an object');
  }
  const response = await api.put('/api/store-config', config, {
    headers: { 'Content-Type': 'application/json' }
  });

  // Response structure: { success: true, data: config }
  const cfg = response?.data?.data;
  if (!cfg || typeof cfg !== 'object') {
    throw new Error('Invalid config received');
  }
  return cfg;
}
