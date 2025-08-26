import { ChartApiResponse, CoinInfo } from '../types';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

// Rate limiting and caching
const REQUEST_CACHE = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_DELAY = 1000; // 1 second between requests
let lastRequestTime = 0;

export class ChartDataApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public cause?: Error,
    public isRateLimit: boolean = false,
    public isCors: boolean = false
  ) {
    super(message);
    this.name = 'ChartDataApiError';
  }
}

// Rate limiting helper
async function enforceRateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    const delay = RATE_LIMIT_DELAY - timeSinceLastRequest;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  lastRequestTime = Date.now();
}

// Check cache
function getCachedData(key: string): any | null {
  const cached = REQUEST_CACHE.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

// Set cache
function setCachedData(key: string, data: any): void {
  REQUEST_CACHE.set(key, { data, timestamp: Date.now() });
}

// Enhanced error detection
function analyzeError(error: any, response?: Response): ChartDataApiError {
  const errorMessage = error?.message || String(error);

  // CORS error detection
  if (
    errorMessage.includes('CORS') ||
    errorMessage.includes('Access-Control-Allow-Origin') ||
    (error instanceof TypeError && errorMessage.includes('fetch'))
  ) {
    return new ChartDataApiError(
      'API temporarily unavailable due to CORS restrictions',
      0,
      error,
      false,
      true
    );
  }

  // Rate limit detection
  if (response?.status === 429 || errorMessage.includes('Too Many Requests')) {
    return new ChartDataApiError(
      'API rate limit exceeded, using cached data',
      429,
      error,
      true,
      false
    );
  }

  // Network errors
  if (error instanceof TypeError && errorMessage.includes('Failed to fetch')) {
    return new ChartDataApiError(
      'Network connection failed',
      0,
      error,
      false,
      true
    );
  }

  // Timeout
  if (error?.name === 'AbortError') {
    return new ChartDataApiError('Request timeout', 0, error);
  }

  return new ChartDataApiError(
    'Network error occurred',
    response?.status || 0,
    error instanceof Error ? error : new Error(String(error))
  );
}

// Fetch chart data for any ticker with enhanced error handling
export async function fetchCoinPriceData(
  coinId = 'bitcoin',
  days = 7
): Promise<ChartApiResponse> {
  const cacheKey = `chart-${coinId}-${days}`;

  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // Enforce rate limiting
  await enforceRateLimit();

  const url = `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // Reduced timeout

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      mode: 'cors', // Explicitly set CORS mode
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        // Remove any custom headers that might trigger CORS preflight
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw analyzeError(new Error(`HTTP ${response.status}`), response);
    }

    const data = await response.json();

    if (!data.prices || !Array.isArray(data.prices)) {
      throw new ChartDataApiError('Invalid API response format');
    }

    // Cache successful response
    setCachedData(cacheKey, data);

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    // If it's already our custom error, re-throw it
    if (error instanceof ChartDataApiError) {
      throw error;
    }

    // Analyze and throw appropriate error
    throw analyzeError(error);
  }
}

// Enhanced fetch with automatic fallback
export async function fetchCoinPriceDataWithFallback(
  coinId = 'bitcoin',
  days = 7
): Promise<{ data: ChartApiResponse; fromCache: boolean; error?: string }> {
  try {
    const data = await fetchCoinPriceData(coinId, days);
    return { data, fromCache: false };
  } catch (error) {
    console.warn(`API fetch failed for ${coinId}:`, error);

    // Check if we have any cached data (even expired)
    const anyCachedData = REQUEST_CACHE.get(`chart-${coinId}-${days}`);
    if (anyCachedData) {
      const errorMsg =
        error instanceof ChartDataApiError && error.isRateLimit
          ? 'Rate limit exceeded, showing recent data'
          : error instanceof ChartDataApiError && error.isCors
            ? 'API temporarily unavailable, showing simulated data'
            : 'Network error, showing cached data';

      return {
        data: anyCachedData.data,
        fromCache: true,
        error: errorMsg,
      };
    }

    // Generate mock data as final fallback
    const coinInfo = getPopularCoins().find((coin) => coin.id === coinId);
    const mockData = generateMockData(coinInfo?.name || coinId);

    const errorMsg =
      error instanceof ChartDataApiError && error.isRateLimit
        ? 'Rate limit exceeded, showing demo data'
        : error instanceof ChartDataApiError && error.isCors
          ? 'API temporarily unavailable, showing demo data'
          : 'Network error, showing demo data';

    return {
      data: mockData,
      fromCache: false,
      error: errorMsg,
    };
  }
}

// Legacy function for backward compatibility
export async function fetchBitcoinPriceData(
  days = 7
): Promise<ChartApiResponse> {
  return fetchCoinPriceData('bitcoin', days);
}

// Fetch list of available cryptocurrencies with caching
export async function fetchCoinsList(): Promise<CoinInfo[]> {
  const cacheKey = 'coins-list';

  // Check cache first (longer cache for coins list)
  const cached = REQUEST_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 60 * 60 * 1000) {
    // 1 hour cache
    return cached.data;
  }

  try {
    await enforceRateLimit();

    const url = `${COINGECKO_BASE_URL}/coins/list`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      signal: controller.signal,
      mode: 'cors',
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid coins list response format');
    }

    // Process and cache the data
    const processedData = data.slice(0, 100).map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol?.toUpperCase() || '',
      name: coin.name || '',
    }));

    setCachedData(cacheKey, processedData);

    return processedData;
  } catch (error) {
    console.warn('Failed to fetch coins list, using popular coins:', error);
    // Return popular coins as fallback
    return getPopularCoins();
  }
}

// Get popular coins list (fallback data)
export function getPopularCoins(): CoinInfo[] {
  return [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB' },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
    { id: 'solana', symbol: 'SOL', name: 'Solana' },
    { id: 'ripple', symbol: 'XRP', name: 'XRP' },
    { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
    { id: 'polkadot', symbol: 'DOT', name: 'Polkadot' },
    { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche' },
    { id: 'chainlink', symbol: 'LINK', name: 'Chainlink' },
    { id: 'litecoin', symbol: 'LTC', name: 'Litecoin' },
    { id: 'uniswap', symbol: 'UNI', name: 'Uniswap' },
    { id: 'polygon', symbol: 'MATIC', name: 'Polygon' },
    { id: 'stellar', symbol: 'XLM', name: 'Stellar' },
    { id: 'internet-computer', symbol: 'ICP', name: 'Internet Computer' },
  ];
}

export function generateMockData(coinName = 'Bitcoin'): ChartApiResponse {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  // Different base prices for different coins
  const basePrices: { [key: string]: number } = {
    Bitcoin: 42000,
    Ethereum: 2500,
    BNB: 300,
    Cardano: 0.45,
    Solana: 85,
    XRP: 0.55,
    Dogecoin: 0.08,
    Polkadot: 6.5,
    Avalanche: 25,
    Chainlink: 14,
    Litecoin: 85,
    Uniswap: 7,
    Polygon: 0.65,
    Stellar: 0.12,
    'Internet Computer': 8.5,
  };

  const basePrice = basePrices[coinName] || 1;
  const prices: [number, number][] = [];

  for (let i = 6; i >= 0; i--) {
    const timestamp = now - i * oneDay;
    const variance = (Math.random() - 0.5) * basePrice * 0.1; // ±10% variance
    const price = basePrice + variance + Math.sin(i) * basePrice * 0.05;
    prices.push([timestamp, Math.round(price * 100) / 100]);
  }

  return { prices };
}
