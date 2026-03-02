import api from './api'

export async function fetchStoreConfig() {
  try {
    const { data: response } = await api.get('/api/store-config');
    // Response structure: { success: true, data: config }
    const cfg = response?.data;
    if (!cfg || typeof cfg !== 'object') {
      console.warn('fetchStoreConfig: config is not an object, using defaults', cfg);
      // Return empty config object - will use defaults
      return { name: '', logo: '', banner: '', socialMedia: {} };
    }
    return cfg;
  } catch (err) {
    console.warn('fetchStoreConfig: failed to fetch store config', err.message);
    // Return empty config object instead of throwing - let Layout use defaults
    return { name: '', logo: '', banner: '', socialMedia: {} };
  }
}

export async function updateStoreConfig(config) {
  if (!config) {
    throw new TypeError('updateStoreConfig expects a payload');
  }

  try {
    let res;
    if (config instanceof FormData) {
      // Let axios set the correct multipart boundary header
      res = await api.put('/api/store-config', config);
    } else {
      if (typeof config !== 'object') {
        throw new TypeError('updateStoreConfig expects an object or FormData');
      }
      res = await api.put('/api/store-config', config);
    }

    const { data: response } = res;
    // Response structure: { success: true, data: config }
    const cfg = response?.data;
    if (!cfg || typeof cfg !== 'object') {
      console.warn('updateStoreConfig: config is not an object', cfg);
      throw new Error('Invalid config received from server');
    }
    return cfg;
  } catch (err) {
    console.error('updateStoreConfig: failed to update store config', err.message);
    throw err; // Re-throw so caller can handle the error
  }
}
