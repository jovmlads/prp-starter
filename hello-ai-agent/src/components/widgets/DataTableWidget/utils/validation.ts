/**
 * Data Table Widget Validation Schemas
 *
 * Zod schemas for runtime validation of data structures and props.
 * Ensures data integrity and provides helpful error messages.
 */

import { z } from 'zod';

// ================================
// Base Schemas
// ================================

/**
 * Sort column schema
 */
export const SortColumnSchema = z.enum(['date', 'price', 'change']);

/**
 * Sort direction schema
 */
export const SortDirectionSchema = z.enum(['asc', 'desc']);

/**
 * Sort state schema
 */
export const SortStateSchema = z.object({
  column: SortColumnSchema.nullable(),
  direction: SortDirectionSchema,
});

/**
 * Trend schema
 */
export const TrendSchema = z.enum(['up', 'down', 'neutral']);

// ================================
// Data Structure Schemas
// ================================

/**
 * Price change schema
 */
export const PriceChangeSchema = z.object({
  absolute: z.number(),
  percentage: z.number(),
  formattedAbsolute: z.string(),
  formattedPercentage: z.string(),
  trend: TrendSchema,
});

/**
 * Table data point schema
 */
export const TableDataPointSchema = z.object({
  id: z.string().min(1),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  formattedDate: z.string().min(1),
  price: z.number().positive('Price must be positive'),
  formattedPrice: z.string().min(1),
  change: PriceChangeSchema,
  timestamp: z.number().int().positive('Timestamp must be a positive integer'),
  ariaLabel: z.string().min(1),
});

/**
 * Table metadata schema
 */
export const TableMetadataSchema = z.object({
  symbol: z.string().min(1),
  name: z.string().min(1),
  totalRows: z.number().int().nonnegative(),
  dateRange: z.object({
    start: z.string(),
    end: z.string(),
  }),
  lastUpdated: z.number().int().positive(),
});

/**
 * Table data schema
 */
export const TableDataSchema = z.object({
  rows: z.array(TableDataPointSchema),
  metadata: TableMetadataSchema,
});

// ================================
// Configuration Schemas
// ================================

/**
 * Responsive configuration schema
 */
export const ResponsiveConfigSchema = z.object({
  mobileBreakpoint: z.number().int().positive().default(768),
  tabletBreakpoint: z.number().int().positive().default(1024),
  desktopBreakpoint: z.number().int().positive().default(1280),
  maxRows: z.number().int().positive().default(7),
});

/**
 * Sorting configuration schema
 */
export const SortingConfigSchema = z.object({
  defaultColumn: SortColumnSchema.default('date'),
  defaultDirection: SortDirectionSchema.default('desc'),
  allowUnsorted: z.boolean().default(false),
});

/**
 * Accessibility configuration schema
 */
export const AccessibilityConfigSchema = z.object({
  enableScreenReader: z.boolean().default(true),
  enableKeyboardNav: z.boolean().default(true),
  enableFocusIndicators: z.boolean().default(true),
  ariaLabels: z.object({
    table: z.string().default('Price history table'),
    sortButton: z.string().default('Sort by {column}'),
    row: z.string().default('Price data for {date}'),
    price: z.string().default('Price: {price}'),
    change: z.string().default('Change: {change}'),
  }),
});

// ================================
// Component Props Schemas
// ================================

/**
 * Chart data point schema (from existing AreaChartWidget)
 */
export const ChartDataPointSchema = z.object({
  timestamp: z.number().int().positive(),
  value: z.number().positive(),
});

/**
 * Chart data schema
 */
export const ChartDataSchema = z.object({
  data: z.array(ChartDataPointSchema),
  symbol: z.string().optional(),
  name: z.string().optional(),
});

/**
 * DataTableWidget props schema
 */
export const DataTableWidgetPropsSchema = z.object({
  ticker: z.string().optional(),
  data: ChartDataSchema.nullable().optional(),
  isLoading: z.boolean().optional().default(false),
  error: z.string().nullable().optional(),
  className: z.string().optional(),
  responsiveConfig: ResponsiveConfigSchema.partial().optional(),
  sortingConfig: SortingConfigSchema.partial().optional(),
  onRowClick: z.function().optional(),
  onSortChange: z.function().optional(),
  showLoadingState: z.boolean().optional().default(true),
  showErrorState: z.boolean().optional().default(true),
  emptyStateMessage: z.string().optional(),
  enableAccessibility: z.boolean().optional().default(true),
});

// ================================
// Validation Functions
// ================================

/**
 * Validate table data with detailed error reporting
 */
export function validateTableData(data: unknown) {
  const result = TableDataSchema.safeParse(data);

  if (!result.success) {
    return {
      isValid: false,
      error: formatZodError(result.error),
      data: null,
    };
  }

  return {
    isValid: true,
    error: null,
    data: result.data,
  };
}

/**
 * Validate chart data with detailed error reporting
 */
export function validateChartData(data: unknown) {
  const result = ChartDataSchema.safeParse(data);

  if (!result.success) {
    return {
      isValid: false,
      error: formatZodError(result.error),
      data: null,
    };
  }

  return {
    isValid: true,
    error: null,
    data: result.data,
  };
}

/**
 * Validate component props
 */
export function validateDataTableWidgetProps(props: unknown) {
  const result = DataTableWidgetPropsSchema.safeParse(props);

  if (!result.success) {
    return {
      isValid: false,
      error: formatZodError(result.error),
      data: null,
    };
  }

  return {
    isValid: true,
    error: null,
    data: result.data,
  };
}

/**
 * Validate sort state
 */
export function validateSortState(state: unknown) {
  const result = SortStateSchema.safeParse(state);

  if (!result.success) {
    return {
      isValid: false,
      error: formatZodError(result.error),
      data: null,
    };
  }

  return {
    isValid: true,
    error: null,
    data: result.data,
  };
}

// ================================
// Utility Functions
// ================================

/**
 * Format Zod validation errors into readable messages
 */
function formatZodError(error: z.ZodError): string {
  const issues = error.issues.map((issue) => {
    const path = issue.path.length > 0 ? ` at ${issue.path.join('.')}` : '';
    return `${issue.message}${path}`;
  });

  return issues.join('; ');
}

/**
 * Create a safe parser that returns null on error
 */
export function createSafeParser<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): T | null => {
    const result = schema.safeParse(data);
    return result.success ? result.data : null;
  };
}

/**
 * Create a validator that throws on error
 */
export function createStrictValidator<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): T => {
    const result = schema.parse(data);
    return result;
  };
}

// ================================
// Exported Parsers
// ================================

/**
 * Safe parsers for common data types
 */
export const safeParseTableData = createSafeParser(TableDataSchema);
export const safeParseChartData = createSafeParser(ChartDataSchema);
export const safeParseSortState = createSafeParser(SortStateSchema);

/**
 * Strict validators for critical data
 */
export const validateTableDataStrict = createStrictValidator(TableDataSchema);
export const validateChartDataStrict = createStrictValidator(ChartDataSchema);
export const validateSortStateStrict = createStrictValidator(SortStateSchema);
