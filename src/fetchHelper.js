const cache = new Map();
const MAX_CACHE_SIZE = 1000;
const CACHE_TTL = 60000;

const FetchHelper = {
  cache,
  MAX_CACHE_SIZE,
  CACHE_TTL,

  async get(url, options = {}) {
    const cacheKey = `${url}${JSON.stringify(Object.keys(options).sort())}${JSON.stringify(options)}`;

    if (cache.has(cacheKey) && this.isCacheValid(cacheKey, CACHE_TTL)) {
      console.log('Returning valid cached data');
      return cache.get(cacheKey).data;
    }

    try {
      console.log(`Fetching data from URL: ${url}`);
      const response = await fetch(url, { ...options, method: 'GET' });

      if (!response.ok) {
        throw new Error(`GET request failed: ${response.status}`);
      }

      const data = await response.json();

      if (cache.size >= MAX_CACHE_SIZE) {
        console.log('Cache size limit reached. Evicting the oldest entry.');
        cache.delete(cache.keys().next().value);
      }

      cache.set(cacheKey, { data, timestamp: Date.now() });
      console.log(`Fetched data successfully from: ${url}`, data);

      return data;
    } catch (error) {
      console.error(`FetchHelper GET Error: ${error.message}`);
      throw error;
    }
  },

  async post(url, body, options = {}) {
    const cacheKey = `${url}${JSON.stringify(Object.keys(body).sort())}${JSON.stringify(body)}${JSON.stringify(Object.keys(options).sort())}${JSON.stringify(options)}`;

    if (cache.has(cacheKey) && this.isCacheValid(cacheKey, CACHE_TTL)) {
      console.log('Returning valid cached data');
      return cache.get(cacheKey).data;
    }

    try {
      console.log(`Posting data to URL: ${url}`);
      const response = await fetch(url, {
        ...options,
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`POST request failed: ${response.status}`);
      }

      const data = await response.json();

      if (cache.size >= MAX_CACHE_SIZE) {
        console.log('Cache size limit reached. Evicting the oldest entry.');
        cache.delete(cache.keys().next().value);
      }

      cache.set(cacheKey, { data, timestamp: Date.now() });
      console.log(`Posted data successfully to: ${url}`, data);

      return data;
    } catch (error) {
      console.error(`FetchHelper POST Error: ${error.message}`);
      throw error;
    }
  },

  clearCache(url = '') {
    if (url) {
      const cacheKey = `${url}`;
      cache.delete(cacheKey);
      console.log(`Cleared cache for URL: ${url}`);
    } else {
      cache.clear();
      console.log('Cleared all cache');
    }
  },

  isCacheValid(cacheKey, ttl = CACHE_TTL) {
    const cachedEntry = cache.get(cacheKey);
    if (!cachedEntry) return false;
    const isValid = Date.now() - cachedEntry.timestamp < ttl;
    if (!isValid) {
      console.log(`Cache entry for ${cacheKey} has expired.`);
    }
    return isValid;
  },
};

export default FetchHelper;
