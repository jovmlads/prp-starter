/**
 * Data Table Widget - Export Barrel
 *
 * Clean exports for the DataTableWidget component system.
 * Provides all necessary types and components for external usage.
 */

// Main component export
export { DataTableWidget } from './DataTableWidget';

// Component exports
export { DataTableHeader } from './components/DataTableHeader';
export { DataTableRow } from './components/DataTableRow';
export { MobileDataCard } from './components/MobileDataCard';
export { TableLoadingState } from './components/TableLoadingState';

// Hook exports
export { useTableData } from './hooks/useTableData';
export { useSorting } from './hooks/useSorting';
export { useResponsive } from './hooks/useResponsive';

// Type exports
export type {
  // Core data types
  TableDataPoint,
  TableData,
  SortColumn,
  SortDirection,
  SortState,
  ResponsiveState,
  ResponsiveConfig,
  SortingConfig,

  // Component prop types
  DataTableWidgetProps,
  DataTableHeaderProps,
  DataTableRowProps,
  MobileDataCardProps,
  TableLoadingStateProps,

  // Hook return types
  UseTableDataReturn,
  UseSortingReturn,
  UseResponsiveReturn,

  // Configuration types
  TableHelpersConfig,
  AccessibilityConfig,

  // Event types
  TableRowClickEvent,
  SortChangeEvent,

  // Error types
  DataProcessingError,
  ValidationError,
} from './types';

// Utility exports
export {
  // Table helpers
  transformChartDataToTable,
  calculatePriceChange,
  formatCurrency,
  formatDate,
  formatPercentage,
  sortTableData,
  filterTableDataByDateRange,
  calculateTableSummary,
  validateChartData,
  validateTableData,
  getDisplayName,
  debounce,
  generateRowId,
  safeFormatNumber,
} from './utils/tableHelpers';

export {
  // Validation utilities
  validateTableData as validateTableDataWithZod,
  validateChartData as validateChartDataWithZod,
  validateDataTableWidgetProps,
  validateSortState,
  safeParseTableData,
  safeParseChartData,
  safeParseSortState,
  validateTableDataStrict,
  validateChartDataStrict,
  validateSortStateStrict,
} from './utils/validation';

export {
  // Accessibility utilities
  generateTableAriaLabel,
  generateRowAriaLabel,
  generateSortButtonAriaLabel,
  generateCardAriaLabel,
  getTableAriaAttributes,
  getTableHeaderAriaAttributes,
  getTableBodyAriaAttributes,
  getTableRowAriaAttributes,
  getTableHeaderCellAriaAttributes,
  getTableDataCellAriaAttributes,
  getSortButtonAriaAttributes,
  getCardAriaAttributes,
  handleTableKeyDown,
  handleSortKeyDown,
  handleCardKeyDown,
  FocusManager,
  announceToScreenReader,
  announceSortChange,
  announceLoadingState,
  announceError,
  getColumnDisplayName,
  isVisibleToScreenReader,
  generateUniqueId,
  DEFAULT_A11Y_CONFIG,
} from './utils/accessibility';
