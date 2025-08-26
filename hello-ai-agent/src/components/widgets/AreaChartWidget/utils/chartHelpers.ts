import { format } from 'date-fns';
import {
  ChartApiResponse,
  ChartData,
  ChartDataPoint,
  CoinInfo,
} from '../types';

export function transformApiData(
  apiResponse: ChartApiResponse,
  coinInfo?: CoinInfo
): ChartData {
  const transformedData: ChartDataPoint[] = apiResponse.prices.map(
    ([timestamp, value]) => ({
      timestamp,
      value: Math.round(value * 100) / 100, // Round to 2 decimal places
      formattedDate: format(new Date(timestamp), 'MMM dd'),
      formattedValue: formatCurrency(value),
    })
  );

  const coinName = coinInfo?.name || 'Bitcoin';
  const coinSymbol = coinInfo?.symbol || 'BTC';

  return {
    data: transformedData,
    metadata: {
      title: `${coinName} Price (USD)`,
      subtitle: `${coinSymbol} • Last 7 days`,
      currency: 'USD',
      lastUpdated: new Date().toISOString(),
    },
  };
}

export function formatCurrency(value: number): string {
  if (value < 1) {
    // For small values (like some altcoins), show more decimal places
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(value);
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
}

export function calculatePriceChange(data: ChartDataPoint[]): {
  absolute: number;
  percentage: number;
  trend: 'up' | 'down' | 'neutral';
} {
  if (data.length < 2) {
    return { absolute: 0, percentage: 0, trend: 'neutral' };
  }

  const first = data[0].value;
  const last = data[data.length - 1].value;
  const absolute = last - first;
  const percentage = (absolute / first) * 100;

  return {
    absolute: Math.round(absolute * 100) / 100,
    percentage: Math.round(percentage * 100) / 100,
    trend: absolute > 0 ? 'up' : absolute < 0 ? 'down' : 'neutral',
  };
}

export function getChartColors() {
  return {
    gradient: {
      from: 'hsl(var(--chart-1))',
      to: 'hsl(var(--chart-1) / 0.1)',
    },
    stroke: 'hsl(var(--chart-1))',
    grid: 'hsl(var(--border))',
    text: 'hsl(var(--muted-foreground))',
  };
}

// Helper function to find coin info by search term
export function searchCoins(coins: CoinInfo[], searchTerm: string): CoinInfo[] {
  if (!searchTerm) return coins;

  const term = searchTerm.toLowerCase();
  return coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(term) ||
      coin.symbol.toLowerCase().includes(term) ||
      coin.id.toLowerCase().includes(term)
  );
}
