export interface ChartDataPoint {
  timestamp: number;
  value: number;
  formattedDate: string;
  formattedValue: string;
}

export interface ChartApiResponse {
  prices: [number, number][];
  market_caps?: [number, number][];
  total_volumes?: [number, number][];
}

export interface ChartData {
  data: ChartDataPoint[];
  metadata: {
    title: string;
    subtitle: string;
    currency: string;
    lastUpdated: string;
  };
}

export interface CoinInfo {
  id: string;
  symbol: string;
  name: string;
}

export interface AreaChartWidgetProps {
  className?: string;
  refreshInterval?: number;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  defaultTicker?: string;
  onTickerChange?: (ticker: string) => void;
}

export interface UseChartDataOptions {
  refreshInterval: number;
  retryAttempts: number;
  retryDelay: number;
  ticker?: string;
}

export interface ChartDataState {
  data: ChartData | null;
  isLoading: boolean;
  error: string | null;
  lastFetch: Date | null;
}
