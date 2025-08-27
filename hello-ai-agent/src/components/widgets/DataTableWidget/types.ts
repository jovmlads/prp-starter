/**
 * Data Table Widget TypeScript Definitions
 *
 * Comprehensive type definitions for the DataTableWidget component system.
 * Includes all interfaces for data structures, component props, and hook returns.
 */

// ================================
// Core Data Structures
// ================================

/**
 * Individual table row representing a single day's price data
 */
export interface TableDataPoint {
  /** Unique identifier for this data point */
  id: string;
  /** Raw date string (YYYY-MM-DD format) */
  date: string;
  /** Human-readable formatted date */
  formattedDate: string;
  /** Raw price value in USD */
  price: number;
  /** Formatted price string with currency symbol */
  formattedPrice: string;
  /** Price change information from previous day */
  change: {
    /** Absolute change in USD */
    absolute: number;
    /** Percentage change */
    percentage: number;
    /** Formatted absolute change string */
    formattedAbsolute: string;
    /** Formatted percentage change string */
    formattedPercentage: string;
    /** Trend direction */
    trend: 'up' | 'down' | 'neutral';
  };
  /** Unix timestamp for sorting */
  timestamp: number;
  /** Accessibility label for screen readers */
  ariaLabel: string;
}

/**
 * Complete table data structure with metadata
 */
export interface TableData {
  /** Array of table rows */
  rows: TableDataPoint[];
  /** Metadata about the dataset */
  metadata: {
    /** Cryptocurrency symbol (e.g., "bitcoin") */
    symbol: string;
    /** Display name (e.g., "Bitcoin") */
    name: string;
    /** Total number of data points */
    totalRows: number;
    /** Date range of the data */
    dateRange: {
      start: string;
      end: string;
    };
    /** Last updated timestamp */
    lastUpdated: number;
  };
}

// ================================
// Sorting System
// ================================

/**
 * Available columns for sorting
 */
export type SortColumn = 'date' | 'price' | 'change';

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Current sort state
 */
export interface SortState {
  column: SortColumn | null;
  direction: SortDirection;
}

/**
 * Sorting configuration
 */
export interface SortingConfig {
  /** Default sort column */
  defaultColumn: SortColumn;
  /** Default sort direction */
  defaultDirection: SortDirection;
  /** Whether to allow no sorting (null state) */
  allowUnsorted: boolean;
}

// ================================
// Responsive Design
// ================================

/**
 * Responsive breakpoint configuration
 */
export interface ResponsiveConfig {
  /** Mobile breakpoint in pixels */
  mobileBreakpoint: number;
  /** Tablet breakpoint in pixels */
  tabletBreakpoint: number;
  /** Desktop breakpoint in pixels */
  desktopBreakpoint: number;
  /** Maximum rows to show on mobile */
  maxRows: number;
}

/**
 * Current responsive state
 */
export interface ResponsiveState {
  /** Is currently mobile viewport */
  isMobile: boolean;
  /** Is currently tablet viewport */
  isTablet: boolean;
  /** Is currently desktop viewport */
  isDesktop: boolean;
  /** Should use compact layout */
  isCompact: boolean;
  /** Current viewport width */
  viewportWidth: number;
}

// ================================
// Component Props
// ================================

/**
 * Main DataTableWidget component props
 */
export interface DataTableWidgetProps {
  /** Selected cryptocurrency ticker */
  ticker?: string;
  /** Chart data to display (optional if using internal data fetching) */
  data?: any | null;
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
  error?: string | null;
  /** Additional CSS classes */
  className?: string;
  /** Custom responsive configuration */
  responsiveConfig?: Partial<ResponsiveConfig>;
  /** Custom sorting configuration */
  sortingConfig?: Partial<SortingConfig>;
  /** Callback when row is clicked */
  onRowClick?: (row: TableDataPoint) => void;
  /** Callback when sort changes */
  onSortChange?: (
    column: SortColumn,
    direction: SortDirection,
    state: SortState
  ) => void;
  /** Whether to show loading states */
  showLoadingState?: boolean;
  /** Whether to show error states */
  showErrorState?: boolean;
  /** Custom empty state message */
  emptyStateMessage?: string;
  /** Whether to enable accessibility features */
  enableAccessibility?: boolean;
}

/**
 * Table header component props
 */
export interface DataTableHeaderProps {
  /** Current sort state */
  sortState: SortState;
  /** Callback when sort changes */
  onSort: (column: SortColumn) => void;
  /** Responsive state */
  responsive: ResponsiveState;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Table row component props
 */
export interface DataTableRowProps {
  /** Row data */
  data: TableDataPoint;
  /** Row index */
  index: number;
  /** Callback when row is clicked */
  onClick?: (data: TableDataPoint) => void;
  /** Responsive state */
  responsive: ResponsiveState;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show trend indicators */
  showTrend?: boolean;
}

/**
 * Mobile card component props
 */
export interface MobileDataCardProps {
  /** Card data */
  data: TableDataPoint;
  /** Card index */
  index: number;
  /** Callback when card is clicked */
  onClick?: (data: TableDataPoint) => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show trend indicators */
  showTrend?: boolean;
  /** Whether to use compact layout */
  compact?: boolean;
}

/**
 * Loading state component props
 */
export interface TableLoadingStateProps {
  /** Number of skeleton rows to show */
  rows?: number;
  /** Responsive state */
  responsive: ResponsiveState;
  /** Additional CSS classes */
  className?: string;
}

// ================================
// Hook Return Types
// ================================

/**
 * Return type for useTableData hook
 */
export interface UseTableDataReturn {
  /** Processed table data */
  tableData: TableData | null;
  /** Loading state */
  isLoading: boolean;
  /** Error message */
  error: string | null;
  /** Whether currently processing data */
  isProcessing: boolean;
  /** Processing error */
  processingError: string | null;
  /** Refresh data function */
  refresh: () => void;
  /** Clear error function */
  clearError: () => void;
}

/**
 * Return type for useSorting hook
 */
export interface UseSortingReturn {
  /** Current sort state */
  sortState: SortState;
  /** Handle sort change */
  handleSort: (column: SortColumn) => void;
  /** Sort table data */
  sortData: (data: TableDataPoint[]) => TableDataPoint[];
  /** Reset sorting */
  resetSort: () => void;
  /** Set sort state */
  setSortState: (state: SortState) => void;
}

/**
 * Return type for useResponsive hook
 */
export interface UseResponsiveReturn {
  /** Current responsive state */
  responsive: ResponsiveState;
  /** Loading state (for SSR compatibility) */
  isLoading: boolean;
}

// ================================
// Utility Types
// ================================

/**
 * Configuration for table helpers
 */
export interface TableHelpersConfig {
  /** Currency formatting options */
  currency: {
    locale: string;
    currency: string;
    minimumFractionDigits: number;
    maximumFractionDigits: number;
  };
  /** Date formatting options */
  date: {
    format: string;
    locale: string;
  };
  /** Change calculation options */
  change: {
    precision: number;
    showSign: boolean;
  };
}

/**
 * Validation result type
 */
export interface ValidationResult {
  /** Whether validation passed */
  isValid: boolean;
  /** Validation error message */
  error?: string;
  /** Sanitized data */
  data?: any;
}

/**
 * Accessibility configuration
 */
export interface AccessibilityConfig {
  /** Enable screen reader support */
  enableScreenReader: boolean;
  /** Enable keyboard navigation */
  enableKeyboardNav: boolean;
  /** Enable focus indicators */
  enableFocusIndicators: boolean;
  /** Custom ARIA labels */
  ariaLabels: {
    table: string;
    sortButton: string;
    row: string;
    price: string;
    change: string;
  };
}

// ================================
// Event Types
// ================================

/**
 * Table row click event data
 */
export interface TableRowClickEvent {
  /** Clicked row data */
  row: TableDataPoint;
  /** Row index */
  index: number;
  /** Original event */
  event: React.MouseEvent | React.KeyboardEvent;
}

/**
 * Sort change event data
 */
export interface SortChangeEvent {
  /** Sort column */
  column: SortColumn;
  /** Sort direction */
  direction: SortDirection;
  /** Complete sort state */
  state: SortState;
  /** Previous sort state */
  previousState: SortState;
}

// ================================
// Error Types
// ================================

/**
 * Data processing error
 */
export interface DataProcessingError {
  /** Error code */
  code: string;
  /** Error message */
  message: string;
  /** Original error */
  cause?: Error;
  /** Context data */
  context?: Record<string, any>;
}

/**
 * Validation error
 */
export interface ValidationError {
  /** Field that failed validation */
  field: string;
  /** Validation rule that failed */
  rule: string;
  /** Error message */
  message: string;
  /** Invalid value */
  value?: any;
}
