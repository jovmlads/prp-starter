# Data Table Widget API Contracts

**Version**: 1.0.0  
**Date**: August 27, 2025  
**Related PRD**: `PRPs/data-table-widget-prd.md`

## Overview

This document defines the API contracts and interfaces for the Data Table Widget feature. The widget will leverage existing cryptocurrency data infrastructure while introducing new data processing and presentation contracts for tabular display.

## Core Principles

1. **Data Reuse**: Leverage existing `useChartData` hook and CoinGecko API integration
2. **Type Safety**: Comprehensive TypeScript interfaces for all data structures
3. **Performance**: Efficient data transformations and memoization strategies
4. **Accessibility**: Screen reader compatible data structures
5. **Responsive**: Adaptive data presentation for different screen sizes

---

## Data Source Contracts

### Existing API Integration (No Changes Required)

The Data Table Widget will reuse the existing CoinGecko API integration without modifications:

```typescript
// EXISTING: No changes to these contracts
interface ChartApiResponse {
  prices: [number, number][]; // [timestamp, price]
  market_caps?: [number, number][];
  total_volumes?: [number, number][];
}

interface ChartData {
  data: ChartDataPoint[];
  metadata: {
    title: string;
    subtitle: string;
    currency: string;
    lastUpdated: string;
  };
}

interface ChartDataPoint {
  timestamp: number;
  value: number;
  formattedDate: string;
  formattedValue: string;
}
```

---

## New Data Table Contracts

### 1. Table Data Structure

#### Primary Table Data Interface

```typescript
/**
 * Processed data point optimized for table display
 * Includes calculated fields and formatted strings for UI
 */
interface TableDataPoint {
  /** ISO date string for sorting: "2024-08-20" */
  date: string;

  /** Human-readable date: "Aug 20, 2024" */
  formattedDate: string;

  /** Raw price value for calculations */
  price: number;

  /** Formatted price with currency: "$42,150.00" */
  formattedPrice: string;

  /** Price change calculations */
  change: {
    /** Absolute change in USD: 500.00 */
    absolute: number;

    /** Percentage change: 1.2 */
    percentage: number;

    /** Trend direction for UI indicators */
    trend: "up" | "down" | "neutral";
  };

  /** Combined change display: "+$500 (+1.2%)" */
  formattedChange: string;

  /** Accessibility label for screen readers */
  ariaLabel: string;

  /** Unique identifier for React keys */
  id: string;
}
```

#### Table Data Collection

```typescript
/**
 * Complete table data structure with metadata
 */
interface TableData {
  /** Array of table rows */
  rows: TableDataPoint[];

  /** Data metadata */
  metadata: {
    /** Cryptocurrency symbol: "BTC", "ETH" */
    symbol: string;

    /** Full cryptocurrency name: "Bitcoin", "Ethereum" */
    name: string;

    /** Data currency: "USD" */
    currency: string;

    /** Total number of data points */
    totalRows: number;

    /** Date range of data */
    dateRange: {
      start: string; // "2024-08-14"
      end: string; // "2024-08-20"
    };

    /** Last update timestamp */
    lastUpdated: string; // ISO string

    /** Data source information */
    source: {
      provider: string; // "CoinGecko"
      isLive: boolean; // true if real data, false if mock
      error?: string; // Error message if applicable
    };
  };

  /** Summary statistics */
  summary: {
    /** Highest price in dataset */
    highestPrice: number;

    /** Lowest price in dataset */
    lowestPrice: number;

    /** Average price */
    averagePrice: number;

    /** Total price change over period */
    totalChange: {
      absolute: number;
      percentage: number;
      trend: "up" | "down" | "neutral";
    };

    /** Volatility indicator (standard deviation) */
    volatility: number;
  };
}
```

### 2. Component Props Contracts

#### Primary Widget Props

```typescript
/**
 * Main DataTableWidget component props
 */
interface DataTableWidgetProps {
  /** Selected cryptocurrency ticker */
  ticker?: string;

  /** Chart data from useChartData hook (optional for independent operation) */
  data?: ChartData | null;

  /** Loading state synchronized with chart */
  isLoading?: boolean;

  /** Error message synchronized with chart */
  error?: string | null;

  /** Additional CSS classes */
  className?: string;

  /** Responsive behavior configuration */
  responsive?: ResponsiveConfig;

  /** Sorting configuration */
  sorting?: SortingConfig;

  /** Accessibility configuration */
  accessibility?: AccessibilityConfig;

  /** Event handlers */
  onRowClick?: (row: TableDataPoint) => void;
  onSortChange?: (column: SortColumn, direction: SortDirection) => void;
  onError?: (error: Error) => void;

  /** Performance options */
  performance?: PerformanceConfig;
}
```

#### Configuration Interfaces

```typescript
/**
 * Responsive behavior configuration
 */
interface ResponsiveConfig {
  /** Mobile breakpoint in pixels */
  mobileBreakpoint: number; // Default: 768

  /** Tablet breakpoint in pixels */
  tabletBreakpoint: number; // Default: 1024

  /** Show mobile card view below mobile breakpoint */
  showMobileCards: boolean; // Default: true

  /** Enable compact mode on tablet */
  compactMode: boolean; // Default: true

  /** Maximum number of rows to display */
  maxRows: number; // Default: 7

  /** Hide columns on smaller screens */
  hideColumnsOnMobile: string[]; // e.g., ['trend']
}

/**
 * Sorting configuration
 */
interface SortingConfig {
  /** Enable sorting functionality */
  enabled: boolean; // Default: true

  /** Default sort column */
  defaultColumn: SortColumn; // Default: 'date'

  /** Default sort direction */
  defaultDirection: SortDirection; // Default: 'desc'

  /** Persist sort state across ticker changes */
  persistAcrossTickerChanges: boolean; // Default: false

  /** Available sort columns */
  availableColumns: SortColumn[];
}

/**
 * Accessibility configuration
 */
interface AccessibilityConfig {
  /** Enable keyboard navigation */
  keyboardNavigation: boolean; // Default: true

  /** Enable screen reader support */
  screenReaderSupport: boolean; // Default: true

  /** Custom ARIA labels */
  ariaLabels?: {
    table: string;
    sortButton: string;
    loadingState: string;
    errorState: string;
  };

  /** Enable high contrast mode support */
  highContrast: boolean; // Default: true
}

/**
 * Performance configuration
 */
interface PerformanceConfig {
  /** Enable memoization of processed data */
  memoizeData: boolean; // Default: true

  /** Enable virtual scrolling (future) */
  virtualScrolling: boolean; // Default: false

  /** Debounce time for sort operations in ms */
  sortDebounceMs: number; // Default: 150

  /** Enable performance monitoring */
  enablePerfMonitoring: boolean; // Default: false
}
```

### 3. Sorting Contracts

```typescript
/**
 * Available sort columns
 */
type SortColumn = "date" | "price" | "change";

/**
 * Sort direction
 */
type SortDirection = "asc" | "desc";

/**
 * Sort state
 */
interface SortState {
  column: SortColumn;
  direction: SortDirection;
  isActive: boolean;
}

/**
 * Sort function signature
 */
type SortFunction = (a: TableDataPoint, b: TableDataPoint) => number;

/**
 * Sort configuration mapping
 */
interface SortConfigMap {
  date: {
    label: string;
    accessor: (row: TableDataPoint) => string | number;
    sortFn: SortFunction;
    ariaLabel: string;
  };
  price: {
    label: string;
    accessor: (row: TableDataPoint) => number;
    sortFn: SortFunction;
    ariaLabel: string;
  };
  change: {
    label: string;
    accessor: (row: TableDataPoint) => number;
    sortFn: SortFunction;
    ariaLabel: string;
  };
}
```

### 4. Hook Contracts

#### Table Data Processing Hook

```typescript
/**
 * Hook for processing chart data into table format
 */
interface UseTableDataOptions {
  /** Source chart data */
  chartData: ChartData | null;

  /** Current ticker symbol */
  ticker: string;

  /** Sorting configuration */
  sortConfig: SortState;

  /** Enable data memoization */
  enableMemoization?: boolean;
}

interface UseTableDataReturn {
  /** Processed table data */
  tableData: TableData | null;

  /** Processing state */
  isProcessing: boolean;

  /** Processing error */
  processingError: string | null;

  /** Force reprocessing function */
  reprocess: () => void;

  /** Performance metrics */
  performanceMetrics: {
    processingTimeMs: number;
    dataPointsProcessed: number;
    lastProcessedAt: Date;
  };
}

/**
 * Table data processing hook
 */
function useTableData(options: UseTableDataOptions): UseTableDataReturn;
```

#### Sorting Logic Hook

```typescript
/**
 * Hook for managing table sorting state and logic
 */
interface UseSortingOptions {
  /** Initial sort configuration */
  initialSort: SortState;

  /** Available sort columns */
  availableColumns: SortColumn[];

  /** Persist state across component unmounts */
  persistState?: boolean;

  /** Storage key for persistence */
  storageKey?: string;
}

interface UseSortingReturn {
  /** Current sort state */
  sortState: SortState;

  /** Sort data function */
  sortData: (data: TableDataPoint[]) => TableDataPoint[];

  /** Handle sort column change */
  handleSort: (column: SortColumn) => void;

  /** Reset to default sort */
  resetSort: () => void;

  /** Get sort indicator for column */
  getSortIndicator: (column: SortColumn) => "↑" | "↓" | "↕" | null;
}

/**
 * Sorting logic hook
 */
function useSorting(options: UseSortingOptions): UseSortingReturn;
```

### 5. Responsive Design Contracts

#### Responsive State Management

```typescript
/**
 * Responsive state interface
 */
interface ResponsiveState {
  /** Current screen width */
  screenWidth: number;

  /** Current breakpoint */
  currentBreakpoint: "mobile" | "tablet" | "desktop";

  /** Should use mobile layout */
  isMobile: boolean;

  /** Should use compact layout */
  isCompact: boolean;

  /** Visible columns for current breakpoint */
  visibleColumns: SortColumn[];
}

/**
 * Responsive hook
 */
interface UseResponsiveOptions {
  config: ResponsiveConfig;
}

interface UseResponsiveReturn {
  responsive: ResponsiveState;
  isLoading: boolean;
}

function useResponsive(options: UseResponsiveOptions): UseResponsiveReturn;
```

#### Mobile Card Interface

```typescript
/**
 * Mobile card component props
 */
interface MobileDataCardProps {
  /** Data point to display */
  data: TableDataPoint;

  /** Card index for accessibility */
  index: number;

  /** Click handler */
  onClick?: (data: TableDataPoint) => void;

  /** Additional CSS classes */
  className?: string;

  /** Show trend indicator */
  showTrend?: boolean;

  /** Compact display mode */
  compact?: boolean;
}
```

### 6. Error Handling Contracts

#### Error Types

```typescript
/**
 * Table-specific error types
 */
type TableErrorType =
  | "DATA_PROCESSING_ERROR"
  | "SORT_ERROR"
  | "RENDER_ERROR"
  | "ACCESSIBILITY_ERROR"
  | "PERFORMANCE_ERROR";

/**
 * Table error interface
 */
interface TableError extends Error {
  type: TableErrorType;
  code: string;
  details?: Record<string, unknown>;
  timestamp: Date;
  recoverable: boolean;
}

/**
 * Error boundary props
 */
interface TableErrorBoundaryProps {
  /** Fallback component */
  fallback?: React.ComponentType<{ error: TableError; retry: () => void }>;

  /** Error handler */
  onError?: (error: TableError) => void;

  /** Enable error reporting */
  enableReporting?: boolean;

  /** Children */
  children: React.ReactNode;
}
```

### 7. Performance Monitoring Contracts

#### Performance Metrics

```typescript
/**
 * Performance metrics interface
 */
interface PerformanceMetrics {
  /** Component lifecycle metrics */
  lifecycle: {
    mountTime: number;
    renderTime: number;
    updateTime: number;
  };

  /** Data processing metrics */
  dataProcessing: {
    transformationTime: number;
    sortingTime: number;
    memoizationHitRate: number;
  };

  /** User interaction metrics */
  interactions: {
    sortOperations: number;
    averageSortTime: number;
    tickerChanges: number;
  };

  /** Memory usage */
  memory: {
    heapUsed: number;
    componentSize: number;
  };
}

/**
 * Performance monitoring hook
 */
interface UsePerformanceMonitoringReturn {
  metrics: PerformanceMetrics;
  startMeasurement: (label: string) => void;
  endMeasurement: (label: string) => number;
  reportMetrics: () => void;
}

function usePerformanceMonitoring(): UsePerformanceMonitoringReturn;
```

---

## Event Contracts

### 1. Component Events

```typescript
/**
 * Table event types
 */
interface TableEvents {
  /** Row click event */
  onRowClick: {
    data: TableDataPoint;
    index: number;
    event: React.MouseEvent;
  };

  /** Sort change event */
  onSortChange: {
    column: SortColumn;
    direction: SortDirection;
    previousState: SortState;
  };

  /** Responsive breakpoint change */
  onBreakpointChange: {
    previous: "mobile" | "tablet" | "desktop";
    current: "mobile" | "tablet" | "desktop";
    screenWidth: number;
  };

  /** Data processing complete */
  onDataProcessed: {
    rowCount: number;
    processingTime: number;
    ticker: string;
  };

  /** Error occurred */
  onError: {
    error: TableError;
    context: string;
    recoverable: boolean;
  };
}
```

### 2. Keyboard Navigation Events

```typescript
/**
 * Keyboard navigation configuration
 */
interface KeyboardNavigation {
  /** Enable arrow key navigation */
  arrowKeys: boolean;

  /** Enable tab navigation */
  tabNavigation: boolean;

  /** Enable enter/space activation */
  activation: boolean;

  /** Custom key mappings */
  customKeys: {
    sort: string; // Default: 'Space'
    nextColumn: string; // Default: 'ArrowRight'
    prevColumn: string; // Default: 'ArrowLeft'
  };
}

/**
 * Keyboard event handler types
 */
interface KeyboardEventHandlers {
  onKeyDown: (event: React.KeyboardEvent, context: "header" | "row") => void;
  onFocus: (element: HTMLElement, context: "header" | "row") => void;
  onBlur: (element: HTMLElement, context: "header" | "row") => void;
}
```

---

## Integration Contracts

### 1. Chart Widget Integration

```typescript
/**
 * Shared state between chart and table
 */
interface SharedWidgetState {
  /** Selected ticker symbol */
  ticker: string;

  /** Chart data (source of truth) */
  chartData: ChartData | null;

  /** Loading state */
  isLoading: boolean;

  /** Error state */
  error: string | null;

  /** Last update timestamp */
  lastUpdated: Date;
}

/**
 * Integration context
 */
interface WidgetIntegrationContext {
  /** Shared state */
  state: SharedWidgetState;

  /** State updaters */
  actions: {
    setTicker: (ticker: string) => void;
    setData: (data: ChartData | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
  };

  /** Event subscriptions */
  subscribe: (event: string, handler: Function) => () => void;
  emit: (event: string, data: unknown) => void;
}
```

### 2. Home Page Layout Integration

```typescript
/**
 * Layout props for home page integration
 */
interface HomePageLayoutProps {
  /** Widget spacing configuration */
  spacing: {
    betweenWidgets: string; // CSS value: "1.5rem"
    containerPadding: string; // CSS value: "1rem"
  };

  /** Responsive layout configuration */
  layout: {
    maxWidth: string; // CSS value: "max-width: 4xl"
    gridGap: string; // CSS value: "1.5rem"
  };

  /** Animation configuration */
  animations: {
    enabled: boolean;
    duration: number; // ms
    easing: string; // CSS easing function
  };
}
```

---

## Validation Contracts

### 1. Data Validation

```typescript
/**
 * Data validation schemas (using Zod)
 */
const TableDataPointSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  formattedDate: z.string().min(1),
  price: z.number().positive(),
  formattedPrice: z.string().min(1),
  change: z.object({
    absolute: z.number(),
    percentage: z.number(),
    trend: z.enum(["up", "down", "neutral"]),
  }),
  formattedChange: z.string(),
  ariaLabel: z.string().min(1),
  id: z.string().min(1),
});

const TableDataSchema = z.object({
  rows: z.array(TableDataPointSchema),
  metadata: z.object({
    symbol: z.string().min(1),
    name: z.string().min(1),
    currency: z.string().length(3),
    totalRows: z.number().min(0),
    dateRange: z.object({
      start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }),
    lastUpdated: z.string().datetime(),
    source: z.object({
      provider: z.string(),
      isLive: z.boolean(),
      error: z.string().optional(),
    }),
  }),
  summary: z.object({
    highestPrice: z.number().positive(),
    lowestPrice: z.number().positive(),
    averagePrice: z.number().positive(),
    totalChange: z.object({
      absolute: z.number(),
      percentage: z.number(),
      trend: z.enum(["up", "down", "neutral"]),
    }),
    volatility: z.number().min(0),
  }),
});

/**
 * Validation functions
 */
interface ValidationFunctions {
  validateTableData: (data: unknown) => TableData;
  validateProps: (props: unknown) => DataTableWidgetProps;
  validateConfig: (config: unknown) => ResponsiveConfig;
  isValidSortColumn: (column: string) => column is SortColumn;
  isValidSortDirection: (direction: string) => direction is SortDirection;
}
```

### 2. Runtime Validation

```typescript
/**
 * Runtime validation configuration
 */
interface RuntimeValidation {
  /** Enable prop validation in development */
  validateProps: boolean;

  /** Enable data validation */
  validateData: boolean;

  /** Enable performance validation */
  validatePerformance: boolean;

  /** Validation error handling */
  onValidationError: (error: ValidationError) => void;
}

/**
 * Validation error interface
 */
interface ValidationError extends Error {
  field: string;
  expectedType: string;
  receivedType: string;
  value: unknown;
}
```

---

## Testing Contracts

### 1. Unit Test Interfaces

```typescript
/**
 * Test data generators
 */
interface TestDataGenerators {
  generateTableDataPoint: (
    overrides?: Partial<TableDataPoint>
  ) => TableDataPoint;
  generateTableData: (overrides?: Partial<TableData>) => TableData;
  generateChartData: (overrides?: Partial<ChartData>) => ChartData;
  generateMockApiResponse: () => ChartApiResponse;
}

/**
 * Test utilities
 */
interface TestUtilities {
  renderWithProviders: (component: React.ReactElement) => RenderResult;
  mockChartData: (data: ChartData) => void;
  mockResponsiveBreakpoint: (
    breakpoint: "mobile" | "tablet" | "desktop"
  ) => void;
  simulateSort: (column: SortColumn, direction: SortDirection) => void;
  waitForDataProcessing: () => Promise<void>;
}
```

### 2. E2E Test Interfaces

```typescript
/**
 * E2E test page objects
 */
interface DataTablePageObject {
  /** Element selectors */
  selectors: {
    table: string;
    headers: string;
    rows: string;
    sortButton: (column: SortColumn) => string;
    mobileCard: (index: number) => string;
    loadingState: string;
    errorState: string;
  };

  /** Action methods */
  actions: {
    clickSort: (column: SortColumn) => Promise<void>;
    waitForData: () => Promise<void>;
    scrollToRow: (index: number) => Promise<void>;
    changeTicker: (ticker: string) => Promise<void>;
  };

  /** Assertion methods */
  assertions: {
    hasRows: (count: number) => Promise<boolean>;
    isSorted: (
      column: SortColumn,
      direction: SortDirection
    ) => Promise<boolean>;
    isResponsive: (
      breakpoint: "mobile" | "tablet" | "desktop"
    ) => Promise<boolean>;
    isAccessible: () => Promise<boolean>;
  };
}
```

---

## Security Contracts

### 1. Data Sanitization

```typescript
/**
 * Data sanitization functions
 */
interface DataSanitization {
  /** Sanitize user input for sort operations */
  sanitizeSortInput: (input: string) => SortColumn | null;

  /** Sanitize ticker symbol */
  sanitizeTicker: (ticker: string) => string;

  /** Sanitize numeric values */
  sanitizeNumericValue: (value: unknown) => number | null;

  /** Escape HTML in formatted strings */
  escapeHtml: (value: string) => string;
}
```

### 2. XSS Prevention

```typescript
/**
 * XSS prevention configuration
 */
interface XSSPrevention {
  /** Enable HTML escaping for user data */
  escapeUserData: boolean;

  /** Sanitize ARIA labels */
  sanitizeAriaLabels: boolean;

  /** Content Security Policy compliance */
  cspCompliant: boolean;

  /** Trusted data sources */
  trustedSources: string[];
}
```

---

## Documentation Contracts

### 1. API Documentation

```typescript
/**
 * Component documentation metadata
 */
interface ComponentDocumentation {
  /** Component description */
  description: string;

  /** Usage examples */
  examples: {
    basic: string;
    advanced: string;
    responsive: string;
    accessibility: string;
  };

  /** Props documentation */
  props: Record<
    string,
    {
      type: string;
      description: string;
      required: boolean;
      defaultValue?: unknown;
    }
  >;

  /** Best practices */
  bestPractices: string[];

  /** Common pitfalls */
  pitfalls: string[];
}
```

### 2. Accessibility Documentation

```typescript
/**
 * Accessibility documentation
 */
interface AccessibilityDocumentation {
  /** ARIA labels used */
  ariaLabels: Record<string, string>;

  /** Keyboard shortcuts */
  keyboardShortcuts: Record<string, string>;

  /** Screen reader instructions */
  screenReaderInstructions: string[];

  /** Color contrast information */
  colorContrast: {
    ratios: Record<string, number>;
    compliance: "AA" | "AAA";
  };

  /** Focus management */
  focusManagement: {
    order: string[];
    trapFocus: boolean;
    restoreFocus: boolean;
  };
}
```

---

## Migration and Versioning Contracts

### 1. Version Compatibility

```typescript
/**
 * Version compatibility interface
 */
interface VersionCompatibility {
  /** Current API version */
  currentVersion: string;

  /** Supported versions */
  supportedVersions: string[];

  /** Breaking changes */
  breakingChanges: {
    version: string;
    changes: string[];
    migrationGuide: string;
  }[];

  /** Deprecation warnings */
  deprecations: {
    feature: string;
    since: string;
    removedIn: string;
    replacement: string;
  }[];
}
```

### 2. Migration Utilities

```typescript
/**
 * Migration utility functions
 */
interface MigrationUtilities {
  /** Migrate old prop format to new */
  migrateProps: (oldProps: Record<string, unknown>) => DataTableWidgetProps;

  /** Migrate data format */
  migrateData: (oldData: unknown) => TableData;

  /** Check compatibility */
  checkCompatibility: (version: string) => boolean;

  /** Get migration warnings */
  getMigrationWarnings: (oldProps: Record<string, unknown>) => string[];
}
```

---

## Implementation Notes

### Required Dependencies

```json
{
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "zod": "^3.22.0",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0"
  },
  "devDependencies": {
    "@testing-library/react": "^16.3.0",
    "@testing-library/jest-dom": "^6.8.0",
    "@playwright/test": "^1.55.0",
    "typescript": "~5.8.3"
  }
}
```

### File Structure

```
src/components/widgets/DataTableWidget/
├── DataTableWidget.tsx          # Main component implementing DataTableWidgetProps
├── components/
│   ├── DataTableHeader.tsx      # Implements sorting contracts
│   ├── DataTableRow.tsx         # Implements TableDataPoint display
│   ├── MobileDataCard.tsx       # Implements MobileDataCardProps
│   └── TableLoadingState.tsx    # Loading state component
├── hooks/
│   ├── useTableData.ts          # Implements UseTableDataReturn
│   ├── useSorting.ts           # Implements UseSortingReturn
│   └── useResponsive.ts        # Implements UseResponsiveReturn
├── utils/
│   ├── tableHelpers.ts         # Data transformation utilities
│   ├── validation.ts           # Implements ValidationFunctions
│   └── accessibility.ts       # Accessibility utilities
├── types.ts                    # All TypeScript interfaces
└── __tests__/                  # Test files implementing test contracts
```

### Integration Points

1. **Home Page Integration**: Modify `src/pages/home.tsx` to include DataTableWidget
2. **Shared State**: Implement ticker state management at Home component level
3. **Data Hook Reuse**: Leverage existing `useChartData` hook
4. **Styling**: Extend existing Tailwind CSS classes and design tokens

---

## Validation Commands

```bash
# Type checking
npm run type-check

# Unit tests
npm run test -- DataTableWidget

# E2E tests
npm run test:e2e -- data-table

# Accessibility tests
npm run test:a11y

# Performance validation
npm run test:perf
```

## Summary

This API contract defines comprehensive interfaces for the Data Table Widget feature, ensuring:

- **Type Safety**: Complete TypeScript coverage
- **Performance**: Optimized data structures and memoization
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsive Design**: Mobile-first approach
- **Integration**: Seamless connection with existing chart infrastructure
- **Testing**: Comprehensive test interface coverage
- **Documentation**: Self-documenting code with examples

The contracts enable efficient development while maintaining high quality standards and ensuring compatibility with the existing codebase.
