// FetchHelper: A utility for making HTTP requests with built-in caching for improved speed and efficiency.
// Why it's fast:
// 1. **Caching**: Responses are cached in memory (using a Map), reducing the need for redundant network requests.
// 2. **Cache Expiry**: Cached data is only valid for a specific TTL (time-to-live), ensuring up-to-date responses.
// 3. **Cache Size Limit**: Automatically evicts the oldest cached entries when the cache reaches its size limit.
// 4. **JSON Serialization**: Ensures consistent and unique cache keys, even with unordered options or body parameters.

const cache = new Map(); // In-memory cache for storing fetched data
const MAX_CACHE_SIZE = 1000; // Maximum number of entries in the cache
const CACHE_TTL = 60000; // Cache time-to-live (in milliseconds)

const FetchHelper = {
  cache,
  MAX_CACHE_SIZE,
  CACHE_TTL,

  // Perform a GET request with caching
  async get(url, options = {}) {
    // Generate a unique cache key based on the URL and options
    const cacheKey = `${url}${JSON.stringify(Object.keys(options).sort())}${JSON.stringify(options)}`;

    // Check if the cache contains valid data for the key
    if (cache.has(cacheKey) && this.isCacheValid(cacheKey, CACHE_TTL)) {
      console.log('Returning valid cached data');
      return cache.get(cacheKey).data; // Return cached data if it's still valid
    }

    try {
      console.log(`Fetching data from URL: ${url}`);
      const response = await fetch(url, { ...options, method: 'GET' });

      if (!response.ok) {
        throw new Error(`GET request failed: ${response.status}`);
      }

      const data = await response.json();

      // Maintain the cache size by evicting the oldest entry if necessary
      if (cache.size >= MAX_CACHE_SIZE) {
        console.log('Cache size limit reached. Evicting the oldest entry.');
        cache.delete(cache.keys().next().value); // Evict the oldest cache entry
      }

      // Store the fetched data in the cache
      cache.set(cacheKey, { data, timestamp: Date.now() });
      console.log(`Fetched data successfully from: ${url}`, data);

      return data;
    } catch (error) {
      console.error(`FetchHelper GET Error: ${error.message}`);
      throw error;
    }
  },

  // Perform a POST request with caching
  async post(url, body, options = {}) {
    // Generate a unique cache key based on the URL, body, and options
    const cacheKey = `${url}${JSON.stringify(Object.keys(body).sort())}${JSON.stringify(body)}${JSON.stringify(Object.keys(options).sort())}${JSON.stringify(options)}`;

    // Check if the cache contains valid data for the key
    if (cache.has(cacheKey) && this.isCacheValid(cacheKey, CACHE_TTL)) {
      console.log('Returning valid cached data');
      return cache.get(cacheKey).data; // Return cached data if it's still valid
    }

    try {
      console.log(`Posting data to URL: ${url}`);
      const response = await fetch(url, {
        ...options,
        method: 'POST',
        body: JSON.stringify(body), // Serialize the body to JSON
      });

      if (!response.ok) {
        throw new Error(`POST request failed: ${response.status}`);
      }

      const data = await response.json();

      // Maintain the cache size by evicting the oldest entry if necessary
      if (cache.size >= MAX_CACHE_SIZE) {
        console.log('Cache size limit reached. Evicting the oldest entry.');
        cache.delete(cache.keys().next().value); // Evict the oldest cache entry
      }

      // Store the fetched data in the cache
      cache.set(cacheKey, { data, timestamp: Date.now() });
      console.log(`Posted data successfully to: ${url}`, data);

      return data;
    } catch (error) {
      console.error(`FetchHelper POST Error: ${error.message}`);
      throw error;
    }
  },

  // Clear the cache for a specific URL or the entire cache
  clearCache(url = '') {
    if (url) {
      const cacheKey = `${url}`;
      cache.delete(cacheKey); // Remove a specific cache entry
      console.log(`Cleared cache for URL: ${url}`);
    } else {
      cache.clear(); // Clear all cache entries
      console.log('Cleared all cache');
    }
  },

  // Check if a cache entry is still valid based on the TTL
  isCacheValid(cacheKey, ttl = CACHE_TTL) {
    const cachedEntry = cache.get(cacheKey);
    if (!cachedEntry) return false; // No cache entry exists
    const isValid = Date.now() - cachedEntry.timestamp < ttl; // Check if entry is within TTL
    if (!isValid) {
      console.log(`Cache entry for ${cacheKey} has expired.`);
    }
    return isValid;
  },
};

export default FetchHelper;
