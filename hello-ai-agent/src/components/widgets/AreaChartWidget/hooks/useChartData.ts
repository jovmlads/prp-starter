import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChartDataState, UseChartDataOptions, CoinInfo } from '../types';
import {
  fetchCoinPriceDataWithFallback,
  getPopularCoins,
} from '../services/chartDataApi';
import { transformApiData } from '../utils/chartHelpers';

const DEFAULT_OPTIONS: UseChartDataOptions = {
  refreshInterval: 300000, // 5 minutes
  retryAttempts: 2, // Reduced since we have better fallbacks
  retryDelay: 3000, // Increased delay to help with rate limiting
  ticker: 'bitcoin',
};

export function useChartData(options: Partial<UseChartDataOptions> = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options };

  const [state, setState] = useState<ChartDataState>({
    data: null,
    isLoading: true,
    error: null,
    lastFetch: null,
  });

  // Get coin info from popular coins list
  const getCoinInfo = useCallback((tickerId: string): CoinInfo | undefined => {
    const popularCoins = getPopularCoins();
    return popularCoins.find((coin) => coin.id === tickerId);
  }, []);

  const fetchData = useCallback(
    async (attempt = 1): Promise<void> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const ticker = config.ticker || 'bitcoin';
        const coinInfo = getCoinInfo(ticker);

        // Use the new fallback function that handles errors gracefully
        const result = await fetchCoinPriceDataWithFallback(ticker);
        const transformedData = transformApiData(result.data, coinInfo);

        setState({
          data: transformedData,
          isLoading: false,
          error: result.error || null,
          lastFetch: new Date(),
        });
      } catch (error) {
        console.warn(`Chart data fetch attempt ${attempt} failed:`, error);

        if (attempt < config.retryAttempts) {
          // Retry with exponential backoff for critical failures
          const delay = config.retryDelay * Math.pow(2, attempt - 1);
          setTimeout(() => fetchData(attempt + 1), delay);
          return;
        }

        // Final fallback - this should rarely happen with the new system
        try {
          const ticker = config.ticker || 'bitcoin';
          const coinInfo = getCoinInfo(ticker);
          const mockResult = await fetchCoinPriceDataWithFallback(ticker);
          const fallbackData = transformApiData(mockResult.data, coinInfo);

          setState({
            data: fallbackData,
            isLoading: false,
            error: 'Using demo data (service temporarily unavailable)',
            lastFetch: new Date(),
          });
        } catch (fallbackError) {
          console.error('All fallback attempts failed:', fallbackError);
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: 'Unable to load chart data. Please try again later.',
          }));
        }
      }
    },
    [config.retryAttempts, config.retryDelay, config.ticker, getCoinInfo]
  );

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, config.refreshInterval);

    return () => clearInterval(interval);
  }, [fetchData, config.refreshInterval]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const memoizedState = useMemo(() => state, [state]);

  return {
    ...memoizedState,
    refetch,
  };
}
