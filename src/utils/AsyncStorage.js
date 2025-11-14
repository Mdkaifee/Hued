// Simple in-memory AsyncStorage substitute for environments without the native module
const storage = new Map();

const AsyncStorage = {
  async setItem(key, value) {
    storage.set(String(key), String(value));
  },

  async getItem(key) {
    return storage.has(String(key)) ? storage.get(String(key)) : null;
  },

  async removeItem(key) {
    storage.delete(String(key));
  },

  async clear() {
    storage.clear();
  },
};

export default AsyncStorage;
