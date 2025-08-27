# Data Table Widget - Complete Implementation PRP 🗃️

**Version**: 1.0.0  
**Date**: August 27, 2025  
**Foundation Documents**:

- `PRPs/data-table-widget-prd.md` (Product Requirements)
- `PRPs/contracts/data-table-widget-api-contract.md` (API Specifications)

---

## Goal

Implement a fully functional, responsive Data Table Widget that displays cryptocurrency price history in tabular format, synchronized with the existing AreaChartWidget, following the comprehensive specifications defined in the PRD and API contracts.

**Primary Deliverable**: Production-ready DataTableWidget component with complete test coverage and documentation.

## Why This Implementation Matters

### Technical Value

- **Data Visualization Completeness**: Provides tabular complement to existing chart visualization
- **Architecture Demonstration**: Showcases proper component architecture with hooks, utils, and testing
- **Performance Optimization**: Implements efficient data processing with memoization and responsive design
- **Accessibility Excellence**: Sets standard for WCAG 2.1 AA compliance across the application

### Business Impact

- **Enhanced User Experience**: Users get both visual and numerical data access
- **Professional Tool Feel**: Elevates application from demo to professional cryptocurrency analysis tool
- **User Retention**: Comprehensive data display encourages longer engagement
- **Accessibility**: Screen readers can access tabular data more easily than charts

### Development Benefits

- **Reusable Patterns**: Creates reusable table and responsive design patterns
- **Testing Foundation**: Establishes comprehensive testing patterns for widgets
- **Data Infrastructure**: Leverages and validates existing data hooks and API integration
- **Documentation Standards**: Sets documentation and code quality standards

## What We're Building

### Core Component Architecture

```
DataTableWidget/
├── DataTableWidget.tsx          # Main component (150-200 lines)
├── components/
│   ├── DataTableHeader.tsx      # Sortable column headers (80-100 lines)
│   ├── DataTableRow.tsx         # Individual table rows (60-80 lines)
│   ├── MobileDataCard.tsx       # Mobile card view (100-120 lines)
│   └── TableLoadingState.tsx    # Loading skeleton (40-60 lines)
├── hooks/
│   ├── useTableData.ts          # Data processing hook (120-150 lines)
│   ├── useSorting.ts           # Sorting logic hook (80-100 lines)
│   └── useResponsive.ts        # Responsive design hook (60-80 lines)
├── utils/
│   ├── tableHelpers.ts         # Data transformation (100-120 lines)
│   ├── validation.ts           # Zod validation schemas (80-100 lines)
│   └── accessibility.ts       # A11y utilities (60-80 lines)
├── types.ts                    # TypeScript interfaces (200-250 lines)
├── index.ts                    # Export barrel (10-15 lines)
└── __tests__/                  # Comprehensive test suite
    ├── DataTableWidget.test.tsx
    ├── useTableData.test.ts
    ├── useSorting.test.ts
    ├── tableHelpers.test.ts
    └── accessibility.test.ts
```

### Integration Points

1. **Home Page Layout**: Add DataTableWidget below AreaChartWidget
2. **Shared State Management**: Implement ticker synchronization between widgets
3. **Data Hook Reuse**: Leverage existing `useChartData` hook infrastructure
4. **UI Consistency**: Use existing shadcn/ui components and Tailwind classes

### Feature Specifications

#### Data Display

- **7-day price history** in responsive table format
- **Columns**: Date, Price (USD), Change ($ and %), Trend indicator
- **Real-time sync** with AreaChartWidget ticker selection
- **Loading and error states** consistent with chart patterns

#### Responsive Design

- **Desktop**: Full table with all columns visible
- **Tablet**: Compact table with optimized spacing
- **Mobile**: Card-based layout with stacked information

#### Interactive Features

- **Sortable columns** (date, price, change percentage)
- **Row hover effects** for enhanced usability
- **Keyboard navigation** for accessibility compliance
- **Sort state persistence** during ticker changes

## All Needed Context

### Existing Codebase Patterns

#### Widget System Architecture

- **File**: `hello-ai-agent/src/components/widgets/AreaChartWidget/AreaChartWidget.tsx`
- **Pattern**: Card-based widget with header, content, and loading states
- **Styling**: Consistent use of shadcn/ui Card component with Tailwind CSS
- **Data Integration**: `useChartData` hook with error handling and fallbacks

#### Data Hook Pattern

- **File**: `hello-ai-agent/src/components/widgets/AreaChartWidget/hooks/useChartData.ts`
- **Pattern**: Custom hook with loading, error, and data states
- **Error Handling**: Comprehensive fallback system with mock data
- **Performance**: Memoization and efficient re-fetch logic

#### Responsive Design System

- **File**: `hello-ai-agent/src/components/layout/root-layout.tsx`
- **Pattern**: Mobile-first responsive design with Tailwind breakpoints
- **Breakpoints**: `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- **Navigation**: Collapsible sidebar with responsive behavior

#### UI Component Patterns

- **Files**: `hello-ai-agent/src/components/ui/`
- **Components**: Card, Button, Separator, Skeleton, Table from shadcn/ui
- **Table Components**: Table, TableHeader, TableBody, TableRow, TableHead, TableCell
- **Styling**: Consistent use of CSS variables and design tokens
- **Accessibility**: Built-in ARIA support and keyboard navigation

#### Testing Patterns

- **Files**: `hello-ai-agent/src/components/widgets/AreaChartWidget/__tests__/`
- **Framework**: Vitest + React Testing Library
- **Patterns**: Component rendering, hook testing, user interaction simulation
- **Coverage**: Minimum 80% coverage requirement

### Technical Architecture References

#### React 19 Patterns

- **File**: `hello-ai-agent/package.json`
- **Version**: React 19.1.1 with modern patterns
- **Compiler**: Built-in React compiler for automatic optimizations
- **Hooks**: Latest React hooks API with concurrent features

#### TypeScript Configuration

- **File**: `hello-ai-agent/tsconfig.json`
- **Mode**: Strict TypeScript with comprehensive type checking
- **Patterns**: Interface-first design with proper generic usage
- **Validation**: Runtime validation with Zod schemas

#### Tailwind CSS Design System

- **File**: `hello-ai-agent/tailwind.config.js`
- **Theme**: Custom design tokens with CSS variables
- **Responsive**: Mobile-first breakpoint system
- **Animations**: Custom animations with tailwindcss-animate

### Integration Documentation

#### CoinGecko API Integration

- **File**: `hello-ai-agent/src/components/widgets/AreaChartWidget/services/chartDataApi.ts`
- **Endpoints**: Historical price data with fallback mechanisms
- **Rate Limiting**: Built-in retry logic with exponential backoff
- **Mock Data**: Comprehensive fallback system for development

#### State Management Patterns

- **Pattern**: Component-level state with prop drilling for shared data
- **Context**: No global state management (Redux/Zustand) currently used
- **Synchronization**: Direct prop passing for widget communication

#### Performance Optimization

- **Memoization**: React.memo, useMemo, useCallback for performance
- **Bundle Optimization**: Vite with tree shaking and code splitting
- **Loading States**: Skeleton components for perceived performance

### Known Gotchas and Critical Details

#### Data Processing Gotchas

```typescript
// CRITICAL: Chart data timestamps are in milliseconds, need conversion
const dateString = format(new Date(timestamp), "yyyy-MM-dd");

// CRITICAL: Price changes calculation must handle missing previous values
const changeCalculation = previousPrice
  ? ((currentPrice - previousPrice) / previousPrice) * 100
  : 0;

// CRITICAL: Sorting must be stable to prevent UI jumps
const stableSort = [...data].sort((a, b) => {
  const result = sortFn(a, b);
  return result !== 0 ? result : a.id.localeCompare(b.id);
});
```

#### Responsive Design Gotchas

```typescript
// CRITICAL: Use useEffect with window.matchMedia for SSR compatibility
useEffect(() => {
  const mediaQuery = window.matchMedia("(max-width: 768px)");
  const handleChange = () => setIsMobile(mediaQuery.matches);
  handleChange(); // Set initial value
  mediaQuery.addListener(handleChange);
  return () => mediaQuery.removeListener(handleChange);
}, []);

// CRITICAL: Mobile card layout needs proper key props for performance
{
  mobileData.map((item, index) => (
    <MobileDataCard key={`${item.id}-${index}`} data={item} />
  ));
}
```

#### Accessibility Gotchas

```typescript
// CRITICAL: Table must have proper ARIA labels for screen readers
<table role="table" aria-label={`${ticker} price history table`}>
  <thead role="rowgroup">
    <tr role="row">
      <th role="columnheader" aria-sort={sortDirection}>
        Date
      </th>
    </tr>
  </thead>
</table>

// CRITICAL: Sort buttons need aria-pressed state
<button
  aria-pressed={isActive}
  aria-label={`Sort by ${column} ${direction}`}
>
```

#### Performance Gotchas

```typescript
// CRITICAL: Memoize expensive calculations
const processedData = useMemo(() => {
  if (!chartData) return null;
  return transformChartDataToTable(chartData, ticker);
}, [chartData, ticker]);

// CRITICAL: Debounce sort operations to prevent excessive re-renders
const debouncedSort = useMemo(
  () =>
    debounce((column: SortColumn) => {
      /* sort logic */
    }, 150),
  []
);
```

### Required Dependencies

All dependencies are already available in the project:

- React 19.1.1 (existing)
- TypeScript 5.8.3 (existing)
- Tailwind CSS (existing)
- shadcn/ui components (existing)
- date-fns 4.1.0 (existing)
- clsx 2.1.1 (existing)
- Zod (needs to be added)

### Integration with Existing Components

#### AreaChartWidget Integration

```typescript
// Pattern from existing AreaChartWidget
export interface DataTableWidgetProps {
  ticker?: string;
  data?: ChartData | null;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

// Reuse existing data transformation patterns
import { useChartData } from "../AreaChartWidget/hooks/useChartData";
import { ChartData, ChartDataPoint } from "../AreaChartWidget/types";
```

#### Home Page Integration Pattern

```typescript
// Pattern from existing home.tsx
export default function Home() {
  const [selectedTicker, setSelectedTicker] = useState("bitcoin");
  const chartData = useChartData({ ticker: selectedTicker });

  return (
    <div className="max-w-4xl w-full">
      <AreaChartWidget
        ticker={selectedTicker}
        onTickerChange={setSelectedTicker}
      />
      <DataTableWidget
        ticker={selectedTicker}
        data={chartData.data}
        isLoading={chartData.isLoading}
        error={chartData.error}
      />
    </div>
  );
}
```

## Implementation Blueprint

### Phase 1: Foundation Setup (Day 1)

#### Step 1.1: Create Directory Structure

```powershell
# Create component directory structure
New-Item -ItemType Directory -Path "hello-ai-agent\src\components\widgets\DataTableWidget" -Force
New-Item -ItemType Directory -Path "hello-ai-agent\src\components\widgets\DataTableWidget\components" -Force
New-Item -ItemType Directory -Path "hello-ai-agent\src\components\widgets\DataTableWidget\hooks" -Force
New-Item -ItemType Directory -Path "hello-ai-agent\src\components\widgets\DataTableWidget\utils" -Force
New-Item -ItemType Directory -Path "hello-ai-agent\src\components\widgets\DataTableWidget\__tests__" -Force
```

#### Step 1.2: Install Required Dependencies

```powershell
cd hello-ai-agent
npm install zod
```

#### Step 1.3: Create TypeScript Interfaces

Create `src/components/widgets/DataTableWidget/types.ts` with all interfaces from API contract:

- TableDataPoint interface
- TableData interface
- DataTableWidgetProps interface
- All configuration interfaces (ResponsiveConfig, SortingConfig, etc.)
- Hook return types (UseTableDataReturn, UseSortingReturn, etc.)

#### Step 1.4: Create Export Barrel

Create `src/components/widgets/DataTableWidget/index.ts` for clean imports:

```typescript
export { DataTableWidget } from "./DataTableWidget";
export type {
  DataTableWidgetProps,
  TableDataPoint,
  TableData,
  SortColumn,
  SortDirection,
} from "./types";
```

### Phase 2: Core Data Processing (Day 1-2)

#### Step 2.1: Create Table Helpers Utility

Create `src/components/widgets/DataTableWidget/utils/tableHelpers.ts`:

- `transformChartDataToTable`: Convert ChartData to TableData
- `calculatePriceChange`: Calculate price change between data points
- `formatTableData`: Format prices and dates for display
- `generateTableSummary`: Calculate summary statistics

Key functions:

```typescript
export function transformChartDataToTable(
  chartData: ChartData,
  ticker: string
): TableData {
  // Sort data by date (oldest first for change calculations)
  const sortedData = [...chartData.data].sort(
    (a, b) => a.timestamp - b.timestamp
  );

  // Process each data point with change calculations
  const rows: TableDataPoint[] = sortedData.map((point, index) => {
    const previousPoint = index > 0 ? sortedData[index - 1] : null;
    const change = calculatePriceChange(point.value, previousPoint?.value);

    return {
      date: format(new Date(point.timestamp), "yyyy-MM-dd"),
      formattedDate: format(new Date(point.timestamp), "MMM dd, yyyy"),
      price: point.value,
      formattedPrice: formatCurrency(point.value),
      change: {
        absolute: change.absolute,
        percentage: change.percentage,
        trend: change.trend,
      },
      formattedChange: formatChange(change),
      ariaLabel: generateAriaLabel(point, change),
      id: `${ticker}-${point.timestamp}`,
    };
  });

  // Generate metadata and summary
  return {
    rows: rows.reverse(), // Show newest first in table
    metadata: generateMetadata(chartData, ticker, rows),
    summary: generateTableSummary(rows),
  };
}
```

#### Step 2.2: Create Table Data Processing Hook

Create `src/components/widgets/DataTableWidget/hooks/useTableData.ts`:

```typescript
export function useTableData(options: UseTableDataOptions): UseTableDataReturn {
  const [state, setState] = useState({
    tableData: null,
    isProcessing: false,
    processingError: null,
    performanceMetrics: {
      processingTimeMs: 0,
      dataPointsProcessed: 0,
      lastProcessedAt: new Date(),
    },
  });

  const processData = useCallback(async () => {
    if (!options.chartData) {
      setState((prev) => ({ ...prev, tableData: null, isProcessing: false }));
      return;
    }

    setState((prev) => ({
      ...prev,
      isProcessing: true,
      processingError: null,
    }));

    try {
      const startTime = performance.now();

      // Transform chart data to table format
      const tableData = transformChartDataToTable(
        options.chartData,
        options.ticker
      );

      // Apply sorting if specified
      if (options.sortConfig.isActive) {
        tableData.rows = applySorting(tableData.rows, options.sortConfig);
      }

      const processingTime = performance.now() - startTime;

      setState((prev) => ({
        ...prev,
        tableData,
        isProcessing: false,
        performanceMetrics: {
          processingTimeMs: processingTime,
          dataPointsProcessed: tableData.rows.length,
          lastProcessedAt: new Date(),
        },
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isProcessing: false,
        processingError: error.message,
      }));
    }
  }, [options.chartData, options.ticker, options.sortConfig]);

  // Process data when dependencies change
  useEffect(() => {
    processData();
  }, [processData]);

  // Memoize result for performance
  return useMemo(
    () => ({
      ...state,
      reprocess: processData,
    }),
    [state, processData]
  );
}
```

#### Step 2.3: Create Sorting Logic Hook

Create `src/components/widgets/DataTableWidget/hooks/useSorting.ts`:

```typescript
export function useSorting(options: UseSortingOptions): UseSortingReturn {
  const [sortState, setSortState] = useState<SortState>(options.initialSort);

  const sortConfigMap: SortConfigMap = {
    date: {
      label: "Date",
      accessor: (row) => row.date,
      sortFn: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ariaLabel: "Sort by date",
    },
    price: {
      label: "Price",
      accessor: (row) => row.price,
      sortFn: (a, b) => a.price - b.price,
      ariaLabel: "Sort by price",
    },
    change: {
      label: "Change",
      accessor: (row) => row.change.percentage,
      sortFn: (a, b) => a.change.percentage - b.change.percentage,
      ariaLabel: "Sort by price change",
    },
  };

  const sortData = useCallback(
    (data: TableDataPoint[]): TableDataPoint[] => {
      if (!sortState.isActive) return data;

      const config = sortConfigMap[sortState.column];
      const sorted = [...data].sort(config.sortFn);

      return sortState.direction === "desc" ? sorted.reverse() : sorted;
    },
    [sortState]
  );

  const handleSort = useCallback((column: SortColumn) => {
    setSortState((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === "asc" ? "desc" : "asc",
      isActive: true,
    }));
  }, []);

  const getSortIndicator = useCallback(
    (column: SortColumn) => {
      if (!sortState.isActive || sortState.column !== column) return "↕";
      return sortState.direction === "asc" ? "↑" : "↓";
    },
    [sortState]
  );

  // Persist sort state if enabled
  useEffect(() => {
    if (options.persistState && options.storageKey) {
      localStorage.setItem(options.storageKey, JSON.stringify(sortState));
    }
  }, [sortState, options.persistState, options.storageKey]);

  return {
    sortState,
    sortData,
    handleSort,
    resetSort: () => setSortState(options.initialSort),
    getSortIndicator,
  };
}
```

### Phase 3: Responsive Design System (Day 2)

#### Step 3.1: Create Responsive Hook

Create `src/components/widgets/DataTableWidget/hooks/useResponsive.ts`:

```typescript
export function useResponsive(
  options: UseResponsiveOptions
): UseResponsiveReturn {
  const [responsive, setResponsive] = useState<ResponsiveState>({
    screenWidth: 0,
    currentBreakpoint: "desktop",
    isMobile: false,
    isCompact: false,
    visibleColumns: ["date", "price", "change"],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateResponsiveState = () => {
      const width = window.innerWidth;
      const isMobile = width < options.config.mobileBreakpoint;
      const isTablet =
        width >= options.config.mobileBreakpoint &&
        width < options.config.tabletBreakpoint;

      const currentBreakpoint = isMobile
        ? "mobile"
        : isTablet
        ? "tablet"
        : "desktop";

      const visibleColumns = isMobile
        ? ["date", "price", "change"].filter(
            (col) => !options.config.hideColumnsOnMobile.includes(col)
          )
        : ["date", "price", "change"];

      setResponsive({
        screenWidth: width,
        currentBreakpoint,
        isMobile,
        isCompact: isTablet && options.config.compactMode,
        visibleColumns: visibleColumns as SortColumn[],
      });
      setIsLoading(false);
    };

    // Set initial state
    updateResponsiveState();

    // Listen for window resize
    const handleResize = debounce(updateResponsiveState, 150);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [options.config]);

  return { responsive, isLoading };
}
```

#### Step 3.2: Create Mobile Card Component

Create `src/components/widgets/DataTableWidget/components/MobileDataCard.tsx`:

```typescript
export function MobileDataCard({
  data,
  index,
  onClick,
  className,
  showTrend = true,
  compact = false,
}: MobileDataCardProps) {
  const trendColor =
    data.change.trend === "up"
      ? "text-green-600"
      : data.change.trend === "down"
      ? "text-red-600"
      : "text-gray-600";

  const TrendIcon =
    data.change.trend === "up"
      ? TrendingUp
      : data.change.trend === "down"
      ? TrendingDown
      : Minus;

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
        "border border-border bg-card",
        compact && "p-3",
        className
      )}
      onClick={() => onClick?.(data)}
      role="button"
      tabIndex={0}
      aria-label={data.ariaLabel}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(data);
        }
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className={cn("font-medium", compact ? "text-sm" : "text-base")}>
            {data.formattedDate}
          </div>
          <div className={cn("text-2xl font-bold", compact && "text-xl")}>
            {data.formattedPrice}
          </div>
        </div>
        {showTrend && (
          <div className={cn("flex items-center", trendColor)}>
            <TrendIcon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className={cn("flex items-center justify-between")}>
        <span
          className={cn(
            trendColor,
            "font-medium",
            compact ? "text-sm" : "text-base"
          )}
        >
          {data.formattedChange}
        </span>
        <span className="text-xs text-muted-foreground">#{index + 1}</span>
      </div>
    </Card>
  );
}
```

### Phase 4: Core Components (Day 2-3)

#### Step 4.1: Create Table Header Component

Create `src/components/widgets/DataTableWidget/components/DataTableHeader.tsx`:

```typescript
import {
  TableHead,
  TableHeader as ShadcnTableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { SortColumn, SortState } from "../types";

interface DataTableHeaderProps {
  columns: SortColumn[];
  sortState: SortState;
  onSort: (column: SortColumn) => void;
  responsive: {
    isCompact: boolean;
  };
  className?: string;
}

export function DataTableHeader({
  columns,
  sortState,
  onSort,
  responsive,
  className,
}: DataTableHeaderProps) {
  return (
    <ShadcnTableHeader className={className}>
      <TableRow>
        {columns.map((column) => (
          <TableHead
            key={column}
            aria-sort={
              sortState.column === column && sortState.isActive
                ? sortState.direction === "asc"
                  ? "ascending"
                  : "descending"
                : "none"
            }
            className={cn(responsive.isCompact && "px-2 py-2 text-xs")}
          >
            <button
              onClick={() => onSort(column)}
              className={cn(
                "flex items-center space-x-1 hover:text-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "transition-colors duration-200"
              )}
              aria-label={`Sort by ${column}`}
            >
              <span className="capitalize">{column}</span>
              <span className="text-muted-foreground">
                {getSortIndicator(column, sortState)}
              </span>
            </button>
          </TableHead>
        ))}
      </TableRow>
    </ShadcnTableHeader>
  );
}

function getSortIndicator(column: SortColumn, sortState: SortState): string {
  if (!sortState.isActive || sortState.column !== column) return "↕";
  return sortState.direction === "asc" ? "↑" : "↓";
}
```

#### Step 4.2: Create Table Row Component

Create `src/components/widgets/DataTableWidget/components/DataTableRow.tsx`:

```typescript
import { TableCell, TableRow as ShadcnTableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TableDataPoint, SortColumn } from '../types';

interface DataTableRowProps {
  data: TableDataPoint;
  index: number;
  visibleColumns: SortColumn[];
  onClick?: (data: TableDataPoint) => void;
  responsive: {
    isCompact: boolean;
  };
  className?: string;
}

export function DataTableRow({
  data,
  index,
  visibleColumns,
  onClick,
  responsive,
  className,
}: DataTableRowProps) {
  const trendColor =
    data.change.trend === "up"
      ? "text-green-600"
      : data.change.trend === "down"
      ? "text-red-600"
      : "text-gray-600";

  return (
    <ShadcnTableRow
      className={cn(
        "cursor-pointer",
        className
      )}
      onClick={() => onClick?.(data)}
      tabIndex={0}
      aria-label={data.ariaLabel}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(data);
        }
      }}
    >
      {visibleColumns.includes("date") && (
        <TableCell
          className={cn(
            responsive.isCompact && "px-2 py-2 text-xs"
          )}
        >
          <div className="font-medium">{data.formattedDate}</div>
        </TableCell>
      )}

      {visibleColumns.includes("price") && (
        <TableCell
          className={cn(
            "font-mono",
            responsive.isCompact && "px-2 py-2 text-xs"
          )}
        >
          <div className="font-semibold">{data.formattedPrice}</div>
        </TableCell>
      )}

      {visibleColumns.includes("change") && (
        <TableCell
          className={cn(
            responsive.isCompact && "px-2 py-2 text-xs"
          )}
        >
          <div className={cn("flex items-center space-x-1", trendColor)}>
            <span className="font-medium">{data.formattedChange}</span>
            <TrendIcon trend={data.change.trend} />
          </div>
        </TableCell>
      )}
    </ShadcnTableRow>
        <td
          className={cn(
            "px-4 py-3 text-sm font-mono",
            responsive.isCompact && "px-2 py-2 text-xs"
          )}
        >
          <div className="font-semibold">{data.formattedPrice}</div>
        </td>
      )}

      {visibleColumns.includes("change") && (
        <td
          className={cn(
            "px-4 py-3 text-sm",
            responsive.isCompact && "px-2 py-2 text-xs"
          )}
        >
          <div className={cn("flex items-center space-x-1", trendColor)}>
            <span className="font-medium">{data.formattedChange}</span>
            <TrendIcon trend={data.change.trend} />
          </div>
        </td>
      )}
    </tr>
  );
}

function TrendIcon({ trend }: { trend: "up" | "down" | "neutral" }) {
  const Icon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return <Icon className="h-3 w-3" />;
}
```

#### Step 4.3: Create Loading State Component

Create `src/components/widgets/DataTableWidget/components/TableLoadingState.tsx`:

```typescript
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TableLoadingStateProps {
  rows?: number;
  responsive: {
    isMobile: boolean;
  };
  className?: string;
}

export function TableLoadingState({
  rows = 7,
  responsive,
  className,
}: TableLoadingStateProps) {
  return (
    <div className={cn("w-full", className)}>
      {responsive.isMobile ? (
        // Mobile card skeletons
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-32" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        // Desktop table skeleton
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-12" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
```

### Phase 5: Main Component Assembly (Day 3)

#### Step 5.1: Create Main DataTableWidget Component

Create `src/components/widgets/DataTableWidget/DataTableWidget.tsx`:

```typescript
import { useMemo, useState, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import { useTableData } from "./hooks/useTableData";
import { useSorting } from "./hooks/useSorting";
import { useResponsive } from "./hooks/useResponsive";
import { DataTableHeader } from "./components/DataTableHeader";
import { DataTableRow } from "./components/DataTableRow";
import { MobileDataCard } from "./components/MobileDataCard";
import { TableLoadingState } from "./components/TableLoadingState";

import type {
  DataTableWidgetProps,
  ResponsiveConfig,
  SortingConfig,
  AccessibilityConfig,
  PerformanceConfig,
  SortColumn,
} from "./types";

export function DataTableWidget({
  ticker = "bitcoin",
  data,
  isLoading = false,
  error = null,
  className,
  responsive: responsiveConfig = {
    mobileBreakpoint: 768,
    tabletBreakpoint: 1024,
    showMobileCards: true,
    compactMode: true,
    maxRows: 7,
    hideColumnsOnMobile: [],
  },
  sorting: sortingConfig = {
    enabled: true,
    defaultColumn: "date",
    defaultDirection: "desc",
    persistAcrossTickerChanges: false,
    availableColumns: ["date", "price", "change"],
  },
  accessibility: accessibilityConfig = {
    keyboardNavigation: true,
    screenReaderSupport: true,
    highContrast: true,
  },
  performance: performanceConfig = {
    memoizeData: true,
    sortDebounceMs: 150,
    enablePerfMonitoring: false,
  },
  onRowClick,
  onSortChange,
  onError,
}: DataTableWidgetProps) {
  // Responsive state management
  const { responsive, isLoading: responsiveLoading } = useResponsive({
    config: responsiveConfig,
  });

  // Sorting state management
  const sorting = useSorting({
    initialSort: {
      column: sortingConfig.defaultColumn,
      direction: sortingConfig.defaultDirection,
      isActive: true,
    },
    availableColumns: sortingConfig.availableColumns,
    persistState: sortingConfig.persistAcrossTickerChanges,
    storageKey: `data-table-sort-${ticker}`,
  });

  // Table data processing
  const { tableData, isProcessing, processingError, performanceMetrics } =
    useTableData({
      chartData: data,
      ticker,
      sortConfig: sorting.sortState,
      enableMemoization: performanceConfig.memoizeData,
    });

  // Error handling
  useEffect(() => {
    if (processingError && onError) {
      onError(new Error(processingError));
    }
  }, [processingError, onError]);

  // Performance monitoring
  useEffect(() => {
    if (performanceConfig.enablePerfMonitoring && performanceMetrics) {
      console.log("DataTableWidget Performance:", performanceMetrics);
    }
  }, [performanceMetrics, performanceConfig.enablePerfMonitoring]);

  // Handle sort changes
  const handleSort = useCallback(
    (column: SortColumn) => {
      sorting.handleSort(column);
      onSortChange?.(column, sorting.sortState.direction, sorting.sortState);
    },
    [sorting, onSortChange]
  );

  // Loading state
  if (isLoading || responsiveLoading || isProcessing) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>Price History</CardTitle>
          <CardDescription>Loading historical data...</CardDescription>
        </CardHeader>
        <CardContent>
          <TableLoadingState
            rows={responsiveConfig.maxRows}
            responsive={responsive}
          />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error || processingError) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <span>Data Unavailable</span>
          </CardTitle>
          <CardDescription>
            {error || processingError || "Unable to load price history"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // No data state
  if (!tableData || tableData.rows.length === 0) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>Price History</CardTitle>
          <CardDescription>No historical data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No price data found for {ticker}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Main render
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Price History</span>
          <span className="text-sm font-normal text-muted-foreground">
            {tableData.metadata.symbol.toUpperCase()}
          </span>
        </CardTitle>
        <CardDescription>
          {tableData.metadata.name} • Last {tableData.metadata.totalRows} days
        </CardDescription>
      </CardHeader>
      <CardContent>
        {responsive.isMobile ? (
          // Mobile card layout
          <div className="space-y-3">
            {tableData.rows.map((row, index) => (
              <MobileDataCard
                key={row.id}
                data={row}
                index={index}
                onClick={onRowClick}
                compact={responsive.isCompact}
              />
            ))}
          </div>
        ) : (
          // Desktop/tablet table layout
          <div className="overflow-x-auto">
            <Table
              aria-label={`${tableData.metadata.name} price history table`}
            >
              <DataTableHeader
                columns={responsive.visibleColumns}
                sortState={sorting.sortState}
                onSort={handleSort}
                responsive={responsive}
              />
              <TableBody>
                {sorting.sortData(tableData.rows).map((row, index) => (
                  <DataTableRow
                    key={row.id}
                    data={row}
                    index={index}
                    visibleColumns={responsive.visibleColumns}
                    onClick={onRowClick}
                    responsive={responsive}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Table footer with summary info */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Data from {tableData.metadata.source.provider}</span>
            <span>
              Last updated:{" "}
              {format(
                new Date(tableData.metadata.lastUpdated),
                "MMM dd, HH:mm"
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### Phase 6: Integration & Testing (Day 3-4)

#### Step 6.1: Integrate with Home Page

Modify `src/pages/home.tsx`:

```typescript
import { useState, useCallback } from "react";
import { TimeWidget } from "../components/widgets/TimeWidget";
import { DateWidget } from "../components/widgets/DateWidget";
import { AreaChartWidget } from "../components/widgets/AreaChartWidget";
import { DataTableWidget } from "../components/widgets/DataTableWidget";
import { useChartData } from "../components/widgets/AreaChartWidget/hooks/useChartData";

export default function Home() {
  const [selectedTicker, setSelectedTicker] = useState("bitcoin");

  // Shared data for both chart and table
  const chartData = useChartData({ ticker: selectedTicker });

  const handleTickerChange = useCallback((newTicker: string) => {
    setSelectedTicker(newTicker);
  }, []);

  return (
    <div className="max-w-4xl w-full">
      <div className="space-y-6 w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to Hello AI Agent
          </h1>
          <p className="text-muted-foreground">
            A modern React application with beautiful widgets and data
            visualization.
          </p>
        </div>

        {/* Existing widgets */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <TimeWidget />
          <DateWidget />
        </div>

        {/* Chart widget with ticker selection */}
        <div className="mt-6 w-full">
          <AreaChartWidget
            ticker={selectedTicker}
            onTickerChange={handleTickerChange}
          />
        </div>

        {/* NEW: Data table widget synchronized with chart */}
        <div className="mt-6 w-full">
          <DataTableWidget
            ticker={selectedTicker}
            data={chartData.data}
            isLoading={chartData.isLoading}
            error={chartData.error}
            onRowClick={(row) => {
              console.log("Row clicked:", row);
              // Future: Navigate to detailed view or show tooltip
            }}
            onSortChange={(column, direction) => {
              console.log("Sort changed:", { column, direction });
              // Future: Analytics tracking
            }}
          />
        </div>
      </div>
    </div>
  );
}
```

#### Step 6.2: Create Comprehensive Test Suite

Create test files for all components and hooks:

**DataTableWidget.test.tsx**:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DataTableWidget } from "../DataTableWidget";
import { generateMockChartData, generateMockTableData } from "./testUtils";

describe("DataTableWidget", () => {
  const mockProps = {
    ticker: "bitcoin",
    data: generateMockChartData(),
    isLoading: false,
    error: null,
    onRowClick: vi.fn(),
    onSortChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state correctly", () => {
    render(<DataTableWidget {...mockProps} isLoading={true} />);
    expect(screen.getByText("Loading historical data...")).toBeInTheDocument();
  });

  it("renders error state correctly", () => {
    render(<DataTableWidget {...mockProps} error="API Error" />);
    expect(screen.getByText("Data Unavailable")).toBeInTheDocument();
  });

  it("renders table data correctly on desktop", async () => {
    render(<DataTableWidget {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getByText("Price History")).toBeInTheDocument();
      expect(screen.getAllByRole("row")).toHaveLength(8); // 7 data rows + 1 header
    });
  });

  it("handles sort functionality", async () => {
    render(<DataTableWidget {...mockProps} />);

    const priceHeader = screen.getByRole("button", { name: /sort by price/i });
    fireEvent.click(priceHeader);

    await waitFor(() => {
      expect(mockProps.onSortChange).toHaveBeenCalledWith(
        "price",
        "asc",
        expect.any(Object)
      );
    });
  });

  it("handles row click events", async () => {
    render(<DataTableWidget {...mockProps} />);

    const firstRow = screen.getAllByRole("row")[1]; // Skip header
    fireEvent.click(firstRow);

    expect(mockProps.onRowClick).toHaveBeenCalledWith(
      expect.objectContaining({
        date: expect.any(String),
        price: expect.any(Number),
      })
    );
  });

  it("switches to mobile layout on small screens", () => {
    // Mock window.innerWidth
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 600,
    });

    render(<DataTableWidget {...mockProps} />);

    // Should show cards instead of table
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(7); // 7 card buttons
  });
});
```

#### Step 6.3: Create Accessibility Tests

Create `accessibility.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { DataTableWidget } from "../DataTableWidget";
import { generateMockChartData } from "./testUtils";

expect.extend(toHaveNoViolations);

describe("DataTableWidget Accessibility", () => {
  it("should not have accessibility violations", async () => {
    const { container } = render(
      <DataTableWidget
        ticker="bitcoin"
        data={generateMockChartData()}
        isLoading={false}
        error={null}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has proper ARIA labels and roles", () => {
    const { container } = render(
      <DataTableWidget ticker="bitcoin" data={generateMockChartData()} />
    );

    // Check for proper table structure
    const table = container.querySelector("table");
    expect(table).toHaveAttribute("role", "table");
    expect(table).toHaveAttribute("aria-label");

    // Check for proper column headers
    const columnHeaders = container.querySelectorAll('[role="columnheader"]');
    expect(columnHeaders.length).toBeGreaterThan(0);

    columnHeaders.forEach((header) => {
      expect(header).toHaveAttribute("aria-sort");
    });
  });

  it("supports keyboard navigation", () => {
    const { container } = render(
      <DataTableWidget ticker="bitcoin" data={generateMockChartData()} />
    );

    // Check that interactive elements are focusable
    const sortButtons = container.querySelectorAll("button");
    sortButtons.forEach((button) => {
      expect(button).toHaveAttribute("tabindex", "0");
    });

    const rows = container.querySelectorAll('[role="row"]');
    rows.forEach((row) => {
      if (row !== rows[0]) {
        // Skip header row
        expect(row).toHaveAttribute("tabindex", "0");
      }
    });
  });
});
```

## Validation Loop

### Level 1: Syntax & Style Validation

```powershell
cd hello-ai-agent

# TypeScript compilation check
npm run type-check

# ESLint validation
npm run lint

# Prettier formatting check
npx prettier --check "src/components/widgets/DataTableWidget/**/*.{ts,tsx}"

# Import validation
npx tsc --noEmit --skipLibCheck
```

**Expected Output**: No TypeScript errors, no ESLint warnings, properly formatted code

### Level 2: Unit & Integration Tests

```powershell
# Run component tests
npm run test -- DataTableWidget

# Run hook tests
npm run test -- "useTableData|useSorting|useResponsive"

# Run utility tests
npm run test -- "tableHelpers|validation|accessibility"

# Test coverage check
npm run test -- --coverage "DataTableWidget"
```

**Expected Output**: All tests pass, minimum 80% code coverage

### Level 3: End-to-End Validation

```powershell
# Start development server
npm run dev

# In separate terminal, run E2E tests
npm run test:e2e -- data-table
```

**E2E Test Scenarios**:

```typescript
// tests/e2e/data-table-widget.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Data Table Widget E2E", () => {
  test("displays synchronized data with chart widget", async ({ page }) => {
    await page.goto("http://localhost:5173");

    // Wait for both widgets to load
    await page.waitForSelector('[data-testid="area-chart-widget"]');
    await page.waitForSelector('[data-testid="data-table-widget"]');

    // Change ticker in chart
    await page.click('[data-testid="ticker-search"]');
    await page.fill('[data-testid="ticker-input"]', "ethereum");
    await page.click('[data-testid="ticker-option-ethereum"]');

    // Verify table updates
    await page.waitForSelector("text=Ethereum");
    expect(await page.textContent('[data-testid="table-title"]')).toContain(
      "ETH"
    );
  });

  test("sorting functionality works correctly", async ({ page }) => {
    await page.goto("http://localhost:5173");
    await page.waitForSelector('[data-testid="data-table-widget"]');

    // Click price column header
    await page.click('button:has-text("Price")');

    // Verify sort indicator
    expect(await page.textContent('button:has-text("Price")')).toContain("↑");

    // Click again to reverse sort
    await page.click('button:has-text("Price")');
    expect(await page.textContent('button:has-text("Price")')).toContain("↓");
  });

  test("responsive design works on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("http://localhost:5173");

    // Should show cards instead of table
    expect(await page.locator("table").count()).toBe(0);
    expect(await page.locator('[data-testid="mobile-card"]').count()).toBe(7);
  });

  test("accessibility features work correctly", async ({ page }) => {
    await page.goto("http://localhost:5173");
    await page.waitForSelector('[data-testid="data-table-widget"]');

    // Test keyboard navigation
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    // Verify sort activation
    expect(await page.getAttribute("[aria-sort]", "aria-sort")).toBe(
      "ascending"
    );
  });
});
```

### Level 4: Production Validation

```powershell
# Build production version
npm run build

# Preview production build
npm run preview

# Performance validation
npm run test:perf

# Bundle size analysis
npx vite-bundle-analyzer dist
```

**Performance Benchmarks**:

- Initial render: < 100ms
- Sort operation: < 30ms
- Ticker change response: < 50ms
- Bundle size: < 12KB gzipped

## Success Criteria Validation

### Functional Requirements Checklist

```markdown
- [ ] Table displays current ticker's 7-day price history
- [ ] Ticker changes from AreaChartWidget immediately update table data
- [ ] Table loads and displays loading states appropriately
- [ ] Error states are handled gracefully with retry functionality
- [ ] All columns (date, price, change) are sortable with indicators
- [ ] Responsive design works on mobile (320px), tablet (768px), and desktop (1024px+)
- [ ] Mobile card layout displays correctly below 768px breakpoint
- [ ] Data synchronization between chart and table is seamless
- [ ] Sort state indicators are clearly visible and accessible
- [ ] Loading skeleton matches final layout structure
```

### Performance Requirements Checklist

```markdown
- [ ] Table renders within 100ms after data is available
- [ ] Smooth scrolling on mobile devices with 60fps
- [ ] No memory leaks from data subscriptions or event listeners
- [ ] Efficient re-renders when ticker changes (< 50ms)
- [ ] Sort operations complete within 30ms
- [ ] Bundle size addition is under 12KB gzipped
- [ ] No unnecessary re-renders during data processing
- [ ] Memoization prevents redundant calculations
```

### Accessibility Requirements Checklist

```markdown
- [ ] Screen reader announces table content and changes
- [ ] Keyboard navigation supports all interactive elements
- [ ] High contrast mode displays properly
- [ ] Focus indicators are clearly visible
- [ ] ARIA labels provide meaningful descriptions
- [ ] Table structure uses semantic HTML with proper roles
- [ ] Sort buttons have clear aria-pressed states
- [ ] Mobile cards are keyboard accessible
- [ ] Color is not the only means of conveying information
- [ ] Text meets WCAG AA contrast requirements (4.5:1)
```

### Design Requirements Checklist

```markdown
- [ ] Consistent with existing widget design patterns
- [ ] Professional appearance matching financial data tables
- [ ] Proper loading states with skeleton components
- [ ] Mobile-first responsive design implementation
- [ ] Smooth transitions and hover effects
- [ ] Consistent spacing with application grid system
- [ ] Proper error state with retry functionality
- [ ] Card design matches existing widget card styles
- [ ] Typography follows application design system
- [ ] Color scheme consistent with existing charts
```

## Post-Implementation Tasks

### Documentation Updates

1. **Component Documentation**: Add JSDoc comments to all exported functions
2. **README Updates**: Update project README with DataTableWidget information
3. **Storybook Stories**: Create Storybook stories for component variations
4. **API Documentation**: Generate TypeDoc documentation for public interfaces

### Performance Monitoring

1. **Bundle Analysis**: Verify bundle size impact is within acceptable limits
2. **Performance Metrics**: Set up monitoring for component render times
3. **User Analytics**: Implement analytics for table usage patterns
4. **Error Monitoring**: Set up error tracking for production issues

### Future Enhancement Planning

1. **Data Export**: Plan CSV/Excel export functionality
2. **Extended History**: Design 30-day, 90-day view options
3. **Additional Metrics**: Plan volume, market cap column additions
4. **Advanced Filtering**: Design date range and price filter options

---

## Conclusion

This implementation PRP provides a comprehensive roadmap for building a production-ready Data Table Widget that seamlessly integrates with the existing AreaChartWidget infrastructure. The solution leverages established patterns while introducing new capabilities for tabular data visualization.

The implementation follows the PRP methodology with detailed context, step-by-step blueprint, and comprehensive validation loop ensuring high-quality delivery. The resulting component will serve as a foundation for future data visualization enhancements while maintaining excellent performance, accessibility, and user experience standards.

**Ready to execute**: Use `/prp-base-execute PRPs/data-table-widget-implementation.md` to begin implementation.
