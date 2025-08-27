/**
 * Data Table Widget Utility Functions
 *
 * Core data transformation and formatting utilities for the DataTableWidget.
 * Handles conversion from chart data to table format, calculations, and formatting.
 */

import { format } from 'date-fns';
import type {
  TableData,
  TableDataPoint,
  TableHelpersConfig,
  ValidationResult,
} from '../types';

// ================================
// Configuration
// ================================

/**
 * Default configuration for table helpers
 */
const DEFAULT_CONFIG: TableHelpersConfig = {
  currency: {
    locale: 'en-US',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  },
  date: {
    format: 'MMM dd, yyyy',
    locale: 'en-US',
  },
  change: {
    precision: 2,
    showSign: true,
  },
};

// ================================
// Core Data Transformation
// ================================

/**
 * Transform chart data to table format
 * CRITICAL: Handles timestamp conversion and price change calculations
 */
export function transformChartDataToTable(
  chartData: any,
  ticker: string,
  config: Partial<TableHelpersConfig> = {}
): TableData {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  if (!chartData || !chartData.data || !Array.isArray(chartData.data)) {
    throw new Error('Invalid chart data structure');
  }

  // Sort data by timestamp (oldest first for change calculations)
  const sortedData = [...chartData.data].sort(
    (a, b) => a.timestamp - b.timestamp
  );

  // Process each data point with change calculations
  const rows: TableDataPoint[] = sortedData.map((point, index) => {
    const previousPoint = index > 0 ? sortedData[index - 1] : null;
    const change = calculatePriceChange(
      point.value,
      previousPoint?.value,
      finalConfig
    );

    const dateObj = new Date(point.timestamp);
    const dateString = format(dateObj, 'yyyy-MM-dd');
    const formattedDate = format(dateObj, finalConfig.date.format);

    return {
      id: `${ticker}-${point.timestamp}`,
      date: dateString,
      formattedDate,
      price: point.value,
      formattedPrice: formatCurrency(point.value, finalConfig.currency),
      change,
      timestamp: point.timestamp,
      ariaLabel: `${formattedDate}: ${formatCurrency(point.value, finalConfig.currency)}, ${change.formattedPercentage} change`,
    };
  });

  // Generate metadata
  const metadata = {
    symbol: ticker,
    name: getDisplayName(ticker),
    totalRows: rows.length,
    dateRange: {
      start: rows[0]?.date || '',
      end: rows[rows.length - 1]?.date || '',
    },
    lastUpdated: Date.now(),
  };

  return {
    rows,
    metadata,
  };
}

/**
 * Calculate price change between two data points
 * CRITICAL: Handles null/undefined previous values and edge cases
 */
export function calculatePriceChange(
  currentPrice: number,
  previousPrice?: number | null,
  config: Partial<TableHelpersConfig> = {}
): TableDataPoint['change'] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  if (!previousPrice || previousPrice === 0) {
    return {
      absolute: 0,
      percentage: 0,
      formattedAbsolute: formatCurrency(0, finalConfig.currency),
      formattedPercentage: '0.00%',
      trend: 'neutral' as const,
    };
  }

  const absolute = currentPrice - previousPrice;
  const percentage = (absolute / previousPrice) * 100;

  const trend: 'up' | 'down' | 'neutral' =
    absolute > 0 ? 'up' : absolute < 0 ? 'down' : 'neutral';

  return {
    absolute,
    percentage,
    formattedAbsolute: formatCurrency(absolute, finalConfig.currency, true),
    formattedPercentage: `${percentage >= 0 && finalConfig.change.showSign ? '+' : ''}${percentage.toFixed(finalConfig.change.precision)}%`,
    trend,
  };
}

// ================================
// Formatting Functions
// ================================

/**
 * Format currency values with proper locale and precision
 */
export function formatCurrency(
  value: number,
  config: TableHelpersConfig['currency'] = DEFAULT_CONFIG.currency,
  showSign: boolean = false
): string {
  if (value === 0) {
    return '$0.00';
  }

  // Determine decimal places based on value magnitude
  let maximumFractionDigits = config.maximumFractionDigits;
  if (value >= 1) {
    maximumFractionDigits = Math.min(2, config.maximumFractionDigits);
  } else if (value >= 0.01) {
    maximumFractionDigits = Math.min(4, config.maximumFractionDigits);
  }

  const formatter = new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: config.minimumFractionDigits,
    maximumFractionDigits,
  });

  const formatted = formatter.format(Math.abs(value));

  if (showSign && value !== 0) {
    return value > 0 ? `+${formatted}` : `-${formatted}`;
  }

  return value < 0 ? `-${formatted}` : formatted;
}

/**
 * Format date strings consistently
 */
export function formatDate(
  date: Date | string | number,
  formatString: string = DEFAULT_CONFIG.date.format
): string {
  const dateObj =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  return format(dateObj, formatString);
}

/**
 * Format percentage values
 */
export function formatPercentage(
  value: number,
  precision: number = DEFAULT_CONFIG.change.precision,
  showSign: boolean = DEFAULT_CONFIG.change.showSign
): string {
  const sign = value >= 0 && showSign ? '+' : '';
  return `${sign}${value.toFixed(precision)}%`;
}

// ================================
// Data Processing Utilities
// ================================

/**
 * Sort table data by specified column and direction
 * CRITICAL: Implements stable sort to prevent UI jumps
 */
export function sortTableData(
  data: TableDataPoint[],
  column: 'date' | 'price' | 'change',
  direction: 'asc' | 'desc'
): TableDataPoint[] {
  const sortedData = [...data].sort((a, b) => {
    let comparison = 0;

    switch (column) {
      case 'date':
        comparison = a.timestamp - b.timestamp;
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'change':
        comparison = a.change.percentage - b.change.percentage;
        break;
      default:
        return 0;
    }

    // Apply direction
    const result = direction === 'desc' ? -comparison : comparison;

    // Stable sort: use ID as tiebreaker
    return result !== 0 ? result : a.id.localeCompare(b.id);
  });

  return sortedData;
}

/**
 * Filter table data by date range
 */
export function filterTableDataByDateRange(
  data: TableDataPoint[],
  startDate: string,
  endDate: string
): TableDataPoint[] {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  return data.filter(
    (point) => point.timestamp >= start && point.timestamp <= end
  );
}

/**
 * Calculate summary statistics for table data
 */
export function calculateTableSummary(data: TableDataPoint[]) {
  if (!data || data.length === 0) {
    return {
      totalRows: 0,
      priceRange: { min: 0, max: 0 },
      changeRange: { min: 0, max: 0 },
      averagePrice: 0,
      averageChange: 0,
    };
  }

  const prices = data.map((point) => point.price);
  const changes = data.map((point) => point.change.percentage);

  return {
    totalRows: data.length,
    priceRange: {
      min: Math.min(...prices),
      max: Math.max(...prices),
    },
    changeRange: {
      min: Math.min(...changes),
      max: Math.max(...changes),
    },
    averagePrice: prices.reduce((sum, price) => sum + price, 0) / prices.length,
    averageChange:
      changes.reduce((sum, change) => sum + change, 0) / changes.length,
  };
}

// ================================
// Validation Utilities
// ================================

/**
 * Validate chart data structure
 */
export function validateChartData(data: any): ValidationResult {
  if (!data) {
    return {
      isValid: false,
      error: 'Chart data is null or undefined',
    };
  }

  if (!data.data || !Array.isArray(data.data)) {
    return {
      isValid: false,
      error: 'Chart data must have a data array property',
    };
  }

  if (data.data.length === 0) {
    return {
      isValid: false,
      error: 'Chart data array is empty',
    };
  }

  // Check data point structure
  for (const point of data.data) {
    if (
      typeof point.timestamp !== 'number' ||
      typeof point.value !== 'number'
    ) {
      return {
        isValid: false,
        error:
          'Chart data points must have numeric timestamp and value properties',
      };
    }
  }

  return {
    isValid: true,
    data,
  };
}

/**
 * Validate table data structure
 */
export function validateTableData(data: any): ValidationResult {
  if (!data) {
    return {
      isValid: false,
      error: 'Table data is null or undefined',
    };
  }

  if (!data.rows || !Array.isArray(data.rows)) {
    return {
      isValid: false,
      error: 'Table data must have a rows array property',
    };
  }

  if (!data.metadata || typeof data.metadata !== 'object') {
    return {
      isValid: false,
      error: 'Table data must have a metadata object property',
    };
  }

  return {
    isValid: true,
    data,
  };
}

// ================================
// Helper Functions
// ================================

/**
 * Get display name for cryptocurrency ticker
 */
export function getDisplayName(ticker: string): string {
  const displayNames: Record<string, string> = {
    bitcoin: 'Bitcoin',
    ethereum: 'Ethereum',
    cardano: 'Cardano',
    polkadot: 'Polkadot',
    chainlink: 'Chainlink',
    litecoin: 'Litecoin',
    'bitcoin-cash': 'Bitcoin Cash',
  };

  return (
    displayNames[ticker] || ticker.charAt(0).toUpperCase() + ticker.slice(1)
  );
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate unique ID for table rows
 */
export function generateRowId(ticker: string, timestamp: number): string {
  return `${ticker}-${timestamp}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Safe number formatting that handles edge cases
 */
export function safeFormatNumber(
  value: number | string | null | undefined,
  fallback: string = '—'
): string {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return fallback;
  }

  return numValue.toString();
}
