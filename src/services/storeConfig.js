import api from './api'

export async function fetchStoreConfig() {
  const res = await api.get('/api/store-config');
  const cfg = res?.data?.config;
  if (!cfg || typeof cfg !== 'object') {
    throw new Error('fetchStoreConfig: invalid config received from server');
  }
  return cfg;
}

export async function updateStoreConfig(config) {
  if (!config) {
    throw new TypeError('updateStoreConfig expects a payload');
  }

  let res
  if (config instanceof FormData) {
    // Let axios set the correct multipart boundary header
    res = await api.put('/api/store-config', config)
  } else {
    if (typeof config !== 'object') {
      throw new TypeError('updateStoreConfig expects an object or FormData');
    }
    res = await api.put('/api/store-config', config)
  }

  const cfg = res?.data?.config;
  if (!cfg || typeof cfg !== 'object') {
    throw new Error('updateStoreConfig: invalid config received from server');
  }
  return cfg;
}
