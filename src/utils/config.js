// utility for handling store configuration in localStorage

const DEFAULT_CONFIG = {
  name: 'Ofertas Universal Place',
  logo_url: '',
  banner_url: 'https://images.unsplash.com/photo-1674027392842-29f8354e236c',
  socialMedia: {
    instagram: '',
    facebook: '',
    whatsapp: ''
  }
};

let currentConfig = { ...DEFAULT_CONFIG };

export function getStoreConfig() {
  // returns the in-memory copy; resets to default on full reload
  return currentConfig;
}

export function saveStoreConfig(config) {
  currentConfig = { ...config };
}
