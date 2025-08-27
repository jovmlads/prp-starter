/**
 * Sorting Hook for Data Table Widget
 *
 * Manages table sorting state and logic with stable sort implementation.
 * Provides sorting functionality for date, price, and change columns.
 */

import { useState, useCallback, useMemo } from 'react';
import type {
  SortColumn,
  SortDirection,
  SortState,
  SortingConfig,
  TableDataPoint,
  UseSortingReturn,
} from '../types';
import { sortTableData } from '../utils/tableHelpers';

// ================================
// Default Configuration
// ================================

const DEFAULT_SORTING_CONFIG: SortingConfig = {
  defaultColumn: 'date',
  defaultDirection: 'desc',
  allowUnsorted: false,
};

// ================================
// Hook Implementation
// ================================

/**
 * Custom hook for table sorting management
 * CRITICAL: Implements stable sort to prevent UI jumps
 */
export function useSorting(
  config: Partial<SortingConfig> = {}
): UseSortingReturn {
  const finalConfig = useMemo(
    () => ({ ...DEFAULT_SORTING_CONFIG, ...config }),
    [config]
  );

  // Initialize sort state with default values
  const [sortState, setSortState] = useState<SortState>({
    column: finalConfig.defaultColumn,
    direction: finalConfig.defaultDirection,
  });

  /**
   * Handle sort column change
   * CRITICAL: Toggles direction if same column, otherwise uses default direction
   */
  const handleSort = useCallback(
    (column: SortColumn) => {
      setSortState((prevState) => {
        // If clicking the same column, toggle direction
        if (prevState.column === column) {
          const newDirection: SortDirection =
            prevState.direction === 'asc' ? 'desc' : 'asc';

          // If allowUnsorted is true and we're going from desc to asc,
          // next click should clear sort
          if (
            finalConfig.allowUnsorted &&
            prevState.direction === 'desc' &&
            newDirection === 'asc'
          ) {
            return { column: null, direction: finalConfig.defaultDirection };
          }

          return { column, direction: newDirection };
        }

        // If clicking a different column, use default direction
        return { column, direction: finalConfig.defaultDirection };
      });
    },
    [finalConfig]
  );

  /**
   * Sort table data based on current sort state
   * CRITICAL: Uses stable sort implementation from tableHelpers
   */
  const sortData = useCallback(
    (data: TableDataPoint[]): TableDataPoint[] => {
      if (!sortState.column || data.length === 0) {
        return data;
      }

      return sortTableData(data, sortState.column, sortState.direction);
    },
    [sortState]
  );

  /**
   * Reset sorting to default state
   */
  const resetSort = useCallback(() => {
    setSortState({
      column: finalConfig.defaultColumn,
      direction: finalConfig.defaultDirection,
    });
  }, [finalConfig]);

  /**
   * Set sort state directly (for external control)
   */
  const setSortStateDirectly = useCallback((state: SortState) => {
    setSortState(state);
  }, []);

  return {
    sortState,
    handleSort,
    sortData,
    resetSort,
    setSortState: setSortStateDirectly,
  };
}

// ================================
// Utility Hooks
// ================================

/**
 * Hook for advanced sorting with multiple columns
 */
export function useMultiColumnSorting(config: Partial<SortingConfig> = {}) {
  const [sortColumns, setSortColumns] = useState<
    Array<{
      column: SortColumn;
      direction: SortDirection;
      priority: number;
    }>
  >([]);

  const finalConfig = useMemo(
    () => ({ ...DEFAULT_SORTING_CONFIG, ...config }),
    [config]
  );

  const addSortColumn = useCallback(
    (
      column: SortColumn,
      direction: SortDirection = finalConfig.defaultDirection
    ) => {
      setSortColumns((prev) => {
        const existingIndex = prev.findIndex((item) => item.column === column);

        if (existingIndex !== -1) {
          // Update existing column
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            direction,
          };
          return updated;
        }

        // Add new column
        return [...prev, { column, direction, priority: prev.length }];
      });
    },
    [finalConfig.defaultDirection]
  );

  const removeSortColumn = useCallback((column: SortColumn) => {
    setSortColumns((prev) => prev.filter((item) => item.column !== column));
  }, []);

  const clearSorting = useCallback(() => {
    setSortColumns([]);
  }, []);

  const sortData = useCallback(
    (data: TableDataPoint[]): TableDataPoint[] => {
      if (sortColumns.length === 0 || data.length === 0) {
        return data;
      }

      return [...data].sort((a, b) => {
        for (const { column, direction } of sortColumns) {
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
          }

          if (comparison !== 0) {
            return direction === 'desc' ? -comparison : comparison;
          }
        }

        // Stable sort: use ID as final tiebreaker
        return a.id.localeCompare(b.id);
      });
    },
    [sortColumns]
  );

  return {
    sortColumns,
    addSortColumn,
    removeSortColumn,
    clearSorting,
    sortData,
  };
}

/**
 * Hook for sorting with persistence (localStorage)
 */
export function usePersistentSorting(
  storageKey: string,
  config: Partial<SortingConfig> = {}
): UseSortingReturn {
  const finalConfig = useMemo(
    () => ({ ...DEFAULT_SORTING_CONFIG, ...config }),
    [config]
  );

  // Initialize from localStorage or default
  const [sortState, setSortState] = useState<SortState>(() => {
    if (typeof window === 'undefined') {
      return {
        column: finalConfig.defaultColumn,
        direction: finalConfig.defaultDirection,
      };
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as SortState;
        // Validate the stored data
        if (
          parsed.column &&
          ['date', 'price', 'change'].includes(parsed.column) &&
          ['asc', 'desc'].includes(parsed.direction)
        ) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to parse stored sort state:', error);
    }

    return {
      column: finalConfig.defaultColumn,
      direction: finalConfig.defaultDirection,
    };
  });

  // Save to localStorage when sort state changes
  const updateSortState = useCallback(
    (newState: SortState) => {
      setSortState(newState);

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(storageKey, JSON.stringify(newState));
        } catch (error) {
          console.warn('Failed to save sort state to localStorage:', error);
        }
      }
    },
    [storageKey]
  );

  const handleSort = useCallback(
    (column: SortColumn) => {
      const newState: SortState = (() => {
        // If clicking the same column, toggle direction
        if (sortState.column === column) {
          const newDirection: SortDirection =
            sortState.direction === 'asc' ? 'desc' : 'asc';

          if (
            finalConfig.allowUnsorted &&
            sortState.direction === 'desc' &&
            newDirection === 'asc'
          ) {
            return { column: null, direction: finalConfig.defaultDirection };
          }

          return { column, direction: newDirection };
        }

        // If clicking a different column, use default direction
        return { column, direction: finalConfig.defaultDirection };
      })();

      updateSortState(newState);
    },
    [sortState, finalConfig, updateSortState]
  );

  const sortData = useCallback(
    (data: TableDataPoint[]): TableDataPoint[] => {
      if (!sortState.column || data.length === 0) {
        return data;
      }

      return sortTableData(data, sortState.column, sortState.direction);
    },
    [sortState]
  );

  const resetSort = useCallback(() => {
    const defaultState = {
      column: finalConfig.defaultColumn,
      direction: finalConfig.defaultDirection,
    };
    updateSortState(defaultState);
  }, [finalConfig, updateSortState]);

  return {
    sortState,
    handleSort,
    sortData,
    resetSort,
    setSortState: updateSortState,
  };
}

// ================================
// Sorting Utilities
// ================================

/**
 * Get sort indicator for UI display
 */
export function getSortIndicator(
  column: SortColumn,
  currentColumn: SortColumn | null,
  direction: SortDirection
): '↑' | '↓' | '↕' | null {
  if (column !== currentColumn) {
    return '↕'; // Both arrows for unsorted columns
  }

  return direction === 'asc' ? '↑' : '↓';
}

/**
 * Get sort classes for styling
 */
export function getSortClasses(
  column: SortColumn,
  currentColumn: SortColumn | null,
  direction: SortDirection
): string {
  const baseClasses = 'sort-button';

  if (column === currentColumn) {
    return `${baseClasses} sort-active sort-${direction}`;
  }

  return `${baseClasses} sort-inactive`;
}

/**
 * Validate sort configuration
 */
export function validateSortConfig(config: Partial<SortingConfig>): boolean {
  if (
    config.defaultColumn &&
    !['date', 'price', 'change'].includes(config.defaultColumn)
  ) {
    return false;
  }

  if (
    config.defaultDirection &&
    !['asc', 'desc'].includes(config.defaultDirection)
  ) {
    return false;
  }

  return true;
}

/**
 * Get next sort direction
 */
export function getNextSortDirection(
  currentDirection: SortDirection,
  allowUnsorted: boolean = false
): SortDirection | null {
  if (currentDirection === 'asc') {
    return 'desc';
  }

  if (currentDirection === 'desc' && allowUnsorted) {
    return null;
  }

  return 'asc';
}

/**
 * Compare values for sorting
 */
export function compareValues(
  a: TableDataPoint,
  b: TableDataPoint,
  column: SortColumn
): number {
  switch (column) {
    case 'date':
      return a.timestamp - b.timestamp;
    case 'price':
      return a.price - b.price;
    case 'change':
      return a.change.percentage - b.change.percentage;
    default:
      return 0;
  }
}
