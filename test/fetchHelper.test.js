import FetchHelper from '../src/fetchHelper.js';

// Enable fetch mocking for Jest
require('jest-fetch-mock').enableMocks();

describe('FetchHelper', () => {
  beforeAll(() => {
    jest.useFakeTimers(); // Use fake timers for time-related tests
  });

  afterAll(() => {
    jest.useRealTimers(); // Clean up after tests
  });

  beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
    FetchHelper.cache.clear(); // Ensure cache is reset before each test
  });

  describe('GET request', () => {
    it('should fetch data and store it in cache', async () => {
      const url = 'https://api.example.com/data';
      const mockResponse = { data: 'test data' };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const response = await FetchHelper.get(url);
      expect(response).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledTimes(1);

      // Fetch again to confirm it's using the cache
      const cachedResponse = await FetchHelper.get(url);
      expect(cachedResponse).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledTimes(1); // Should not make another request
    });

    it('should throw an error if response is not ok', async () => {
      const url = 'https://api.example.com/data';
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal Server Error' }),
      });

      await expect(FetchHelper.get(url)).rejects.toThrow('GET request failed: 500');
    });

    it('should evict the oldest entry when cache limit is reached', async () => {
      for (let i = 0; i < 1000; i++) {
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: `data ${i}` }),
        });

        await FetchHelper.get(`https://api.example.com/data/${i}`);
      }

      expect(FetchHelper.cache.size).toBe(1000); // The cache is full

      // Add one more entry to trigger eviction
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'new data' }),
      });

      await FetchHelper.get('https://api.example.com/new');

      expect(FetchHelper.cache.size).toBe(1000); // Size should remain constant
      expect(FetchHelper.cache.has('https://api.example.com/data/0')).toBe(false); // The oldest entry should be removed
    });

    it('should expire cache after TTL', async () => {
      const url = 'https://api.example.com/data';
      const mockResponse = { data: 'new data' };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await FetchHelper.get(url); // Initial fetch

      // Advance time beyond TTL
      jest.advanceTimersByTime(60001); // TTL is 60 seconds

      // Fetch again to confirm expired cache
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'cached data' }),
      });

      const response = await FetchHelper.get(url);
      expect(response).toEqual({ data: 'cached data' }); // Cache should have expired, new data is fetched
      expect(fetch).toHaveBeenCalledTimes(2); // Data was fetched again due to expiration
    });
  });

  describe('POST request', () => {
    it('should make a POST request and store response in cache', async () => {
      const url = 'https://api.example.com/data';
      const body = { key: 'value' };
      const mockResponse = { data: 'posted data' };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const response = await FetchHelper.post(url, body);
      expect(response).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledTimes(1);

      // Fetch again to confirm it's using cache
      const cachedResponse = await FetchHelper.post(url, body);
      expect(cachedResponse).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledTimes(1); // Should not make another request
    });

    it('should throw an error if POST response is not ok', async () => {
      const url = 'https://api.example.com/data';
      const body = { key: 'value' };
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal Server Error' }),
      });

      await expect(FetchHelper.post(url, body)).rejects.toThrow('POST request failed: 500');
    });
  });

  describe('Cache Management', () => {
    it('should clear the cache for a specific URL', async () => {
      const url = 'https://api.example.com/data1';
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'test data' }),
      });

      await FetchHelper.get(url);
      expect(FetchHelper.cache.size).toBe(1);

      FetchHelper.clearCache(url);
      expect(FetchHelper.cache.has(url)).toBe(false);
    });

    it('should clear all cache', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: 'test data' }),
      });

      await FetchHelper.get('https://api.example.com/data1');
      await FetchHelper.get('https://api.example.com/data2');
      expect(FetchHelper.cache.size).toBe(2);

      FetchHelper.clearCache();
      expect(FetchHelper.cache.size).toBe(0);
    });
  });
});
