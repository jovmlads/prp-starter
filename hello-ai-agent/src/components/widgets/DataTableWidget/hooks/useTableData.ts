/**
 * Table Data Hook for Data Table Widget
 *
 * Processes and manages table data from chart data source.
 * Integrates with existing AreaChartWidget data infrastructure.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { UseTableDataReturn, TableData, ResponsiveConfig } from '../types';
import {
  transformChartDataToTable,
  validateChartData,
} from '../utils/tableHelpers';
import { useChartData } from '../../AreaChartWidget/hooks/useChartData';
import type { ChartData } from '../../AreaChartWidget/types';

// ================================
// Default Configuration
// ================================

const DEFAULT_RESPONSIVE_CONFIG: ResponsiveConfig = {
  mobileBreakpoint: 768,
  tabletBreakpoint: 1024,
  desktopBreakpoint: 1280,
  maxRows: 7,
};

// ================================
// Hook Implementation
// ================================

/**
 * Custom hook for table data management
 * CRITICAL: Integrates with existing chart data infrastructure
 */
export function useTableData(
  ticker: string = 'bitcoin',
  externalData?: ChartData | null,
  config: Partial<ResponsiveConfig> = {}
): UseTableDataReturn {
  const finalConfig = useMemo(
    () => ({ ...DEFAULT_RESPONSIVE_CONFIG, ...config }),
    [config]
  );

  // Internal data processing state
  const [processingState, setProcessingState] = useState({
    isProcessing: false,
    processingError: null as string | null,
  });

  // Use existing chart data hook if no external data provided
  const chartDataHook = useChartData({
    ticker,
    refreshInterval: 300000, // 5 minutes
  });

  // Determine data source (external data takes precedence)
  const sourceData =
    externalData !== undefined ? externalData : chartDataHook.data;
  const sourceIsLoading =
    externalData !== undefined ? false : chartDataHook.isLoading;
  const sourceError = externalData !== undefined ? null : chartDataHook.error;

  /**
   * Process chart data into table format
   * CRITICAL: Handles data transformation with error recovery
   */
  const processChartData = useCallback(
    async (chartData: ChartData | null): Promise<TableData | null> => {
      if (!chartData) {
        return null;
      }

      setProcessingState({ isProcessing: true, processingError: null });

      try {
        // Validate chart data structure
        const validation = validateChartData(chartData);
        if (!validation.isValid) {
          throw new Error(`Invalid chart data: ${validation.error}`);
        }

        // Transform chart data to table format
        const tableData = transformChartDataToTable(chartData, ticker);

        // Limit rows for responsive display
        const limitedRows = tableData.rows.slice(0, finalConfig.maxRows);

        const result: TableData = {
          ...tableData,
          rows: limitedRows,
          metadata: {
            ...tableData.metadata,
            totalRows: limitedRows.length,
          },
        };

        setProcessingState({ isProcessing: false, processingError: null });
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown processing error';
        console.error('Table data processing failed:', error);
        setProcessingState({
          isProcessing: false,
          processingError: errorMessage,
        });
        return null;
      }
    },
    [ticker, finalConfig.maxRows]
  );

  /**
   * Memoized table data processing
   * CRITICAL: Prevents unnecessary re-processing on every render
   */
  const tableData = useMemo(() => {
    if (!sourceData) {
      return null;
    }

    // For performance, we'll process synchronously for memoization
    // The async processing is mainly for error handling
    try {
      const validation = validateChartData(sourceData);
      if (!validation.isValid) {
        console.warn('Invalid chart data structure:', validation.error);
        return null;
      }

      const transformed = transformChartDataToTable(sourceData, ticker);
      const limitedRows = transformed.rows.slice(0, finalConfig.maxRows);

      return {
        ...transformed,
        rows: limitedRows,
        metadata: {
          ...transformed.metadata,
          totalRows: limitedRows.length,
        },
      };
    } catch (error) {
      console.error('Table data transformation failed:', error);
      return null;
    }
  }, [sourceData, ticker, finalConfig.maxRows]);

  /**
   * Refresh data function
   */
  const refresh = useCallback(() => {
    if (externalData === undefined) {
      // Use chart data hook's refetch
      chartDataHook.refetch();
    } else {
      // Force re-processing of current data
      if (sourceData) {
        processChartData(sourceData);
      }
    }
  }, [externalData, chartDataHook, sourceData, processChartData]);

  /**
   * Clear error function
   */
  const clearError = useCallback(() => {
    setProcessingState((prev) => ({ ...prev, processingError: null }));
    // Note: Chart data hook doesn't have clearError method
    // Errors will be cleared on next successful fetch
  }, []);

  // Combine loading states
  const isLoading = sourceIsLoading || processingState.isProcessing;

  // Combine error states
  const error = processingState.processingError || sourceError;

  return {
    tableData,
    isLoading,
    error,
    isProcessing: processingState.isProcessing,
    processingError: processingState.processingError,
    refresh,
    clearError,
  };
}

// ================================
// Utility Hooks
// ================================

/**
 * Hook for table data with caching
 */
export function useCachedTableData(
  ticker: string = 'bitcoin',
  externalData?: ChartData | null,
  config: Partial<ResponsiveConfig> = {}
) {
  const [cache, setCache] = useState<
    Map<string, { data: TableData; timestamp: number }>
  >(new Map());

  const cacheKey = `${ticker}-${JSON.stringify(config)}`;
  const cacheTimeout = 300000; // 5 minutes

  const tableDataHook = useTableData(ticker, externalData, config);

  // Check cache validity
  const cachedData = useMemo(() => {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheTimeout) {
      return cached.data;
    }
    return null;
  }, [cache, cacheKey, cacheTimeout]);

  // Update cache when new data arrives
  useEffect(() => {
    if (tableDataHook.tableData && !tableDataHook.isLoading) {
      setCache((prev) =>
        new Map(prev).set(cacheKey, {
          data: tableDataHook.tableData!,
          timestamp: Date.now(),
        })
      );
    }
  }, [tableDataHook.tableData, tableDataHook.isLoading, cacheKey]);

  // Return cached data if available and hook is loading
  return {
    ...tableDataHook,
    tableData:
      tableDataHook.isLoading && cachedData
        ? cachedData
        : tableDataHook.tableData,
  };
}

/**
 * Hook for multiple tickers data
 */
export function useMultiTickerTableData(
  tickers: string[],
  config: Partial<ResponsiveConfig> = {}
) {
  const [tickerData, setTickerData] = useState<Map<string, TableData | null>>(
    new Map()
  );
  const [loadingStates, setLoadingStates] = useState<Map<string, boolean>>(
    new Map()
  );
  const [errorStates, setErrorStates] = useState<Map<string, string | null>>(
    new Map()
  );

  // Create individual hooks for each ticker
  const hooks = tickers.map((ticker) => ({
    ticker,
    hook: useTableData(ticker, undefined, config),
  }));

  // Update states when hooks change
  useEffect(() => {
    const newTickerData = new Map<string, TableData | null>();
    const newLoadingStates = new Map<string, boolean>();
    const newErrorStates = new Map<string, string | null>();

    hooks.forEach(({ ticker, hook }) => {
      newTickerData.set(ticker, hook.tableData);
      newLoadingStates.set(ticker, hook.isLoading);
      newErrorStates.set(ticker, hook.error);
    });

    setTickerData(newTickerData);
    setLoadingStates(newLoadingStates);
    setErrorStates(newErrorStates);
  }, [hooks]);

  const refreshAll = useCallback(() => {
    hooks.forEach(({ hook }) => hook.refresh());
  }, [hooks]);

  const clearAllErrors = useCallback(() => {
    hooks.forEach(({ hook }) => hook.clearError());
  }, [hooks]);

  return {
    tickerData,
    loadingStates,
    errorStates,
    refreshAll,
    clearAllErrors,
    isAnyLoading: Array.from(loadingStates.values()).some(Boolean),
    hasAnyError: Array.from(errorStates.values()).some(Boolean),
  };
}

/**
 * Hook for table data with real-time updates
 */
export function useRealTimeTableData(
  ticker: string = 'bitcoin',
  updateInterval: number = 60000, // 1 minute
  config: Partial<ResponsiveConfig> = {}
) {
  const tableDataHook = useTableData(ticker, undefined, config);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  // Set up real-time refresh
  useEffect(() => {
    const interval = setInterval(() => {
      tableDataHook.refresh();
      setLastUpdate(Date.now());
    }, updateInterval);

    return () => clearInterval(interval);
  }, [tableDataHook.refresh, updateInterval]);

  return {
    ...tableDataHook,
    lastUpdate,
    updateInterval,
  };
}

// ================================
// Data Processing Utilities
// ================================

/**
 * Process multiple chart data sources
 */
export function processMultipleChartData(
  chartDataList: Array<{ ticker: string; data: ChartData | null }>,
  config: Partial<ResponsiveConfig> = {}
): Array<{
  ticker: string;
  tableData: TableData | null;
  error: string | null;
}> {
  const finalConfig = { ...DEFAULT_RESPONSIVE_CONFIG, ...config };

  return chartDataList.map(({ ticker, data }) => {
    try {
      if (!data) {
        return { ticker, tableData: null, error: 'No data available' };
      }

      const validation = validateChartData(data);
      if (!validation.isValid) {
        return {
          ticker,
          tableData: null,
          error: validation.error || 'Invalid data',
        };
      }

      const transformed = transformChartDataToTable(data, ticker);
      const limitedRows = transformed.rows.slice(0, finalConfig.maxRows);

      const tableData: TableData = {
        ...transformed,
        rows: limitedRows,
        metadata: {
          ...transformed.metadata,
          totalRows: limitedRows.length,
        },
      };

      return { ticker, tableData, error: null };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Processing failed';
      return { ticker, tableData: null, error: errorMessage };
    }
  });
}

/**
 * Validate table data configuration
 */
export function validateTableDataConfig(
  config: Partial<ResponsiveConfig>
): boolean {
  if (
    config.maxRows !== undefined &&
    (config.maxRows < 1 || config.maxRows > 50)
  ) {
    return false;
  }

  if (config.mobileBreakpoint !== undefined && config.mobileBreakpoint < 0) {
    return false;
  }

  if (config.tabletBreakpoint !== undefined && config.tabletBreakpoint < 0) {
    return false;
  }

  if (config.desktopBreakpoint !== undefined && config.desktopBreakpoint < 0) {
    return false;
  }

  return true;
}
