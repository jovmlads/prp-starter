import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fetchBitcoinPriceData,
  generateMockData,
  ChartDataApiError,
} from './chartDataApi';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('chartDataApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('fetchBitcoinPriceData', () => {
    it('should fetch data successfully', async () => {
      const mockData = {
        prices: [
          [1703721600000, 42000.5],
          [1703808000000, 42500.75],
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await fetchBitcoinPriceData();

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart'
        ),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
          headers: expect.objectContaining({
            Accept: 'application/json',
          }),
        })
      );
    });

    it('should handle HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(fetchBitcoinPriceData()).rejects.toThrow(ChartDataApiError);
    });

    it('should handle network timeouts', async () => {
      // Mock a request that never resolves to simulate timeout
      const neverResolves = new Promise<Response>(() => {
        // This promise never resolves or rejects
      });

      mockFetch.mockImplementationOnce(() => neverResolves);

      // Create a promise that should timeout
      const promise = fetchBitcoinPriceData();

      // Fast-forward time to trigger timeout
      vi.advanceTimersByTime(12000); // Advance past the 10s timeout

      await expect(promise).rejects.toThrow('Request timeout');
    });

    it('should validate API response format', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: 'data' }),
      });

      await expect(fetchBitcoinPriceData()).rejects.toThrow(
        'Invalid API response format'
      );
    });
  });

  describe('generateMockData', () => {
    it('should generate valid mock data', () => {
      const mockData = generateMockData();

      expect(mockData).toHaveProperty('prices');
      expect(Array.isArray(mockData.prices)).toBe(true);
      expect(mockData.prices).toHaveLength(7);

      mockData.prices.forEach(([timestamp, price]) => {
        expect(typeof timestamp).toBe('number');
        expect(typeof price).toBe('number');
        expect(timestamp).toBeGreaterThan(0);
        expect(price).toBeGreaterThan(0);
      });
    });
  });
});
