# Database CRUD System - API Contract Specification

## Overview

This document defines the comprehensive API contracts for the Database CRUD System based on the architecture specified in `PRPs/db-crud-system-prd.md`. The system uses Supabase as the primary database platform with TypeScript interfaces for type safety and comprehensive error handling.

## Core Entity Definitions

### Primary Entity: GenericRecord

```typescript
// Core database entity interface
export interface GenericRecord {
  id: string; // UUID primary key
  name: string; // Display name (required)
  description?: string; // Optional description
  category: RecordCategory; // Classification category
  status: RecordStatus; // Current status
  metadata: Record<string, any>; // Flexible JSON metadata
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
  created_by: string; // UUID of creating user
  updated_by: string; // UUID of last updating user
}

// Supported record categories
export type RecordCategory =
  | "products"
  | "customers"
  | "orders"
  | "inventory"
  | "campaigns"
  | "settings"
  | "content"
  | "analytics";

// Record status enumeration
export type RecordStatus = "active" | "inactive" | "archived";

// Input type for creating new records
export interface CreateRecordInput {
  name: string;
  description?: string;
  category: RecordCategory;
  status?: RecordStatus; // Defaults to 'active'
  metadata?: Record<string, any>; // Defaults to {}
}

// Input type for updating existing records
export interface UpdateRecordInput {
  name?: string;
  description?: string;
  category?: RecordCategory;
  status?: RecordStatus;
  metadata?: Record<string, any>;
}
```

## Supabase Client Configuration

### Environment Variables

```typescript
// Environment configuration interface
export interface SupabaseConfig {
  url: string; // Supabase project URL
  anonKey: string; // Supabase anonymous key
  serviceKey?: string; // Service role key (server-side only)
}

// Required environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VITE_SUPABASE_URL: string;
      VITE_SUPABASE_ANON_KEY: string;
      SUPABASE_SERVICE_ROLE_KEY?: string;
    }
  }
}
```

### Client Initialization

```typescript
// Supabase client interface
export interface SupabaseClient {
  // Core database operations
  from<T = any>(table: string): SupabaseQueryBuilder<T>;

  // Authentication
  auth: {
    getUser(): Promise<{ data: { user: User | null }; error: Error | null }>;
    signOut(): Promise<{ error: Error | null }>;
  };

  // Real-time subscriptions
  channel(name: string): RealtimeChannel;
  removeAllChannels(): void;
}

// Query builder interface for type-safe operations
export interface SupabaseQueryBuilder<T> {
  select(columns?: string): SupabaseQueryBuilder<T>;
  insert(values: Partial<T> | Partial<T>[]): SupabaseQueryBuilder<T>;
  update(values: Partial<T>): SupabaseQueryBuilder<T>;
  delete(): SupabaseQueryBuilder<T>;
  eq(column: keyof T, value: any): SupabaseQueryBuilder<T>;
  in(column: keyof T, values: any[]): SupabaseQueryBuilder<T>;
  order(
    column: keyof T,
    options?: { ascending: boolean }
  ): SupabaseQueryBuilder<T>;
  range(from: number, to: number): SupabaseQueryBuilder<T>;
  limit(count: number): SupabaseQueryBuilder<T>;
  single(): Promise<{ data: T | null; error: Error | null }>;
  execute(): Promise<{ data: T[] | null; error: Error | null }>;
}
```

## CRUD Service Layer API

### Core CRUD Operations Interface

```typescript
// Generic CRUD service interface
export interface CrudService<T extends { id: string }> {
  // Read operations
  getAll(options?: QueryOptions): Promise<ApiResponse<T[]>>;
  getById(id: string): Promise<ApiResponse<T>>;
  getByCategory(
    category: string,
    options?: QueryOptions
  ): Promise<ApiResponse<T[]>>;
  search(query: string, options?: QueryOptions): Promise<ApiResponse<T[]>>;

  // Write operations
  create(
    input: Omit<
      T,
      "id" | "created_at" | "updated_at" | "created_by" | "updated_by"
    >
  ): Promise<ApiResponse<T>>;
  update(id: string, input: Partial<T>): Promise<ApiResponse<T>>;
  delete(id: string): Promise<ApiResponse<void>>;
  bulkDelete(ids: string[]): Promise<ApiResponse<void>>;

  // Utility operations
  count(filters?: FilterOptions): Promise<ApiResponse<number>>;
  exists(id: string): Promise<ApiResponse<boolean>>;
  export(
    format: ExportFormat,
    filters?: FilterOptions
  ): Promise<ApiResponse<ExportResult>>;
}

// Query options for filtering, sorting, and pagination
export interface QueryOptions {
  // Pagination
  page?: number; // Page number (1-based)
  pageSize?: number; // Records per page (default: 25)

  // Sorting
  sortBy?: string; // Column to sort by
  sortOrder?: "asc" | "desc"; // Sort direction

  // Filtering
  filters?: FilterOptions; // Filter conditions

  // Search
  searchQuery?: string; // Full-text search query
  searchColumns?: string[]; // Columns to search in
}

// Filter options for advanced querying
export interface FilterOptions {
  category?: RecordCategory | RecordCategory[];
  status?: RecordStatus | RecordStatus[];
  dateRange?: {
    start: string; // ISO 8601 date
    end: string; // ISO 8601 date
    field: "created_at" | "updated_at"; // Date field to filter
  };
  metadata?: Record<string, any>; // Metadata field filters
  createdBy?: string | string[]; // Filter by creator
}

// Export functionality
export type ExportFormat = "csv" | "json" | "xlsx";

export interface ExportResult {
  url: string; // Download URL
  filename: string; // Generated filename
  recordCount: number; // Number of exported records
  format: ExportFormat; // Export format used
}
```

### Specific GenericRecord CRUD Service

```typescript
// Concrete implementation for GenericRecord
export interface GenericRecordService extends CrudService<GenericRecord> {
  // Additional GenericRecord-specific methods
  getCategories(): Promise<ApiResponse<RecordCategory[]>>;
  getRecordsByStatus(
    status: RecordStatus,
    options?: QueryOptions
  ): Promise<ApiResponse<GenericRecord[]>>;
  getRecentRecords(limit?: number): Promise<ApiResponse<GenericRecord[]>>;
  getRecordStats(): Promise<ApiResponse<RecordStats>>;
  duplicateRecord(
    id: string,
    newName?: string
  ): Promise<ApiResponse<GenericRecord>>;
}

// Statistics interface for dashboard/analytics
export interface RecordStats {
  totalRecords: number;
  recordsByCategory: Record<RecordCategory, number>;
  recordsByStatus: Record<RecordStatus, number>;
  recentActivity: {
    created: number; // Records created in last 24h
    updated: number; // Records updated in last 24h
    deleted: number; // Records deleted in last 24h
  };
}
```

## API Response Patterns

### Standard Response Wrapper

```typescript
// Generic API response wrapper
export interface ApiResponse<T> {
  data: T | null; // Response data (null on error)
  error: ApiError | null; // Error details (null on success)
  meta?: ResponseMeta; // Additional metadata
}

// Error interface for consistent error handling
export interface ApiError {
  code: string; // Error code for programmatic handling
  message: string; // Human-readable error message
  details?: Record<string, any>; // Additional error context
  timestamp: string; // ISO 8601 timestamp
  requestId?: string; // Optional request tracking ID
}

// Response metadata for pagination and additional info
export interface ResponseMeta {
  pagination?: {
    page: number; // Current page
    pageSize: number; // Records per page
    totalPages: number; // Total available pages
    totalRecords: number; // Total record count
    hasNextPage: boolean; // Whether next page exists
    hasPreviousPage: boolean; // Whether previous page exists
  };
  performance?: {
    queryTime: number; // Query execution time (ms)
    totalTime: number; // Total request time (ms)
  };
  filters?: FilterOptions; // Applied filters
}
```

### Error Code Definitions

```typescript
// Standardized error codes
export enum ApiErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  INVALID_TOKEN = "INVALID_TOKEN",

  // Validation Errors
  VALIDATION_FAILED = "VALIDATION_FAILED",
  REQUIRED_FIELD_MISSING = "REQUIRED_FIELD_MISSING",
  INVALID_FORMAT = "INVALID_FORMAT",

  // Database Errors
  RECORD_NOT_FOUND = "RECORD_NOT_FOUND",
  DUPLICATE_RECORD = "DUPLICATE_RECORD",
  DATABASE_CONNECTION_ERROR = "DATABASE_CONNECTION_ERROR",
  QUERY_FAILED = "QUERY_FAILED",

  // Business Logic Errors
  OPERATION_NOT_ALLOWED = "OPERATION_NOT_ALLOWED",
  RECORD_IN_USE = "RECORD_IN_USE",
  INVALID_STATUS_TRANSITION = "INVALID_STATUS_TRANSITION",

  // System Errors
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
}
```

## Real-time Subscriptions API

### Subscription Management

```typescript
// Real-time subscription interface
export interface RealtimeSubscription {
  // Subscription control
  subscribe(): Promise<void>;
  unsubscribe(): Promise<void>;
  isSubscribed(): boolean;

  // Event handlers
  onInsert(callback: (record: GenericRecord) => void): void;
  onUpdate(callback: (record: GenericRecord) => void): void;
  onDelete(callback: (record: { id: string }) => void): void;
  onError(callback: (error: ApiError) => void): void;
}

// Real-time event types
export interface RealtimeEvent<T = any> {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new?: T; // New record data (INSERT, UPDATE)
  old?: T; // Old record data (UPDATE, DELETE)
  timestamp: string; // Event timestamp
  schema: string; // Database schema
  table: string; // Table name
}

// Subscription options
export interface SubscriptionOptions {
  filters?: FilterOptions; // Only subscribe to filtered records
  events?: ("INSERT" | "UPDATE" | "DELETE")[]; // Event types to listen for
  includeOldValues?: boolean; // Include old values in UPDATE/DELETE events
}
```

## React Hooks API Contracts

### Primary CRUD Hook

```typescript
// Main CRUD operations hook
export interface UseCrudOperationsResult<T> {
  // Data state
  data: T[];
  isLoading: boolean;
  error: ApiError | null;

  // CRUD operations
  create: (input: CreateRecordInput) => Promise<void>;
  update: (id: string, input: UpdateRecordInput) => Promise<void>;
  delete: (id: string) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
  refresh: () => Promise<void>;

  // Search and filtering
  search: (query: string) => void;
  setFilters: (filters: FilterOptions) => void;
  clearFilters: () => void;

  // Sorting
  sort: (column: string, direction: "asc" | "desc") => void;

  // Pagination
  pagination: PaginationState;

  // Selection state (for bulk operations)
  selectedIds: string[];
  selectRecord: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;

  // Export functionality
  exportData: (format: ExportFormat) => Promise<void>;
}

// Pagination state interface
export interface PaginationState {
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  previousPage: () => void;
}
```

### Real-time Data Hook

```typescript
// Real-time data subscription hook
export interface UseRealTimeDataResult<T> {
  // Connection state
  isConnected: boolean;
  connectionError: ApiError | null;

  // Subscription management
  subscribe: (options?: SubscriptionOptions) => void;
  unsubscribe: () => void;

  // Event callbacks
  onRecordCreated: (callback: (record: T) => void) => void;
  onRecordUpdated: (callback: (record: T) => void) => void;
  onRecordDeleted: (callback: (recordId: string) => void) => void;

  // Event history (for debugging)
  eventHistory: RealtimeEvent<T>[];
  clearEventHistory: () => void;
}
```

## Component Props Interfaces

### Main Data Table Component

```typescript
// Primary CRUD data table component props
export interface CrudDataTableProps {
  // Core functionality
  onCreateRecord: () => void;
  onEditRecord: (record: GenericRecord) => void;
  onDeleteRecord: (record: GenericRecord) => void;
  onBulkDelete: (recordIds: string[]) => void;

  // Table configuration
  columns: ColumnDefinition[];
  pageSize?: number; // Default: 25
  enableBulkOperations?: boolean; // Default: true
  enableExport?: boolean; // Default: true
  enableRealTime?: boolean; // Default: true

  // Styling and layout
  height?: string; // Table height
  className?: string; // Additional CSS classes

  // Loading and error states
  loadingComponent?: React.ComponentType;
  errorComponent?: React.ComponentType<{ error: ApiError }>;
  emptyStateComponent?: React.ComponentType;
}

// Column definition for data table
export interface ColumnDefinition {
  key: keyof GenericRecord; // Record field key
  label: string; // Display label
  sortable?: boolean; // Can be sorted
  filterable?: boolean; // Can be filtered
  searchable?: boolean; // Included in search
  width?: string; // Column width
  align?: "left" | "center" | "right"; // Text alignment
  render?: (value: any, record: GenericRecord) => React.ReactNode;
  headerRender?: () => React.ReactNode; // Custom header content
}
```

### Modal Component Props

```typescript
// Create record dialog props
export interface RecordCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateRecordInput) => Promise<void>;
  categories: RecordCategory[];
  isLoading?: boolean;
  error?: ApiError | null;
}

// Edit record dialog props
export interface RecordEditDialogProps {
  isOpen: boolean;
  record: GenericRecord | null;
  onClose: () => void;
  onSubmit: (input: UpdateRecordInput) => Promise<void>;
  categories: RecordCategory[];
  isLoading?: boolean;
  error?: ApiError | null;
}

// Delete confirmation dialog props
export interface RecordDeleteDialogProps {
  isOpen: boolean;
  record: GenericRecord | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
  error?: ApiError | null;
}

// Bulk operations component props
export interface BulkOperationsProps {
  selectedCount: number;
  onBulkDelete: () => Promise<void>;
  onClearSelection: () => void;
  isLoading?: boolean;
  error?: ApiError | null;
}
```

## Validation Schemas

### Zod Validation Schemas

```typescript
import { z } from "zod";

// Core validation schemas
export const RecordCategorySchema = z.enum([
  "products",
  "customers",
  "orders",
  "inventory",
  "campaigns",
  "settings",
  "content",
  "analytics",
]);

export const RecordStatusSchema = z.enum(["active", "inactive", "archived"]);

// Create record validation
export const CreateRecordInputSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  category: RecordCategorySchema,
  status: RecordStatusSchema.default("active"),
  metadata: z.record(z.any()).default({}),
});

// Update record validation
export const UpdateRecordInputSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters")
    .optional(),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  category: RecordCategorySchema.optional(),
  status: RecordStatusSchema.optional(),
  metadata: z.record(z.any()).optional(),
});

// Query options validation
export const QueryOptionsSchema = z.object({
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  searchQuery: z.string().optional(),
  searchColumns: z.array(z.string()).optional(),
  filters: z
    .object({
      category: z
        .union([RecordCategorySchema, z.array(RecordCategorySchema)])
        .optional(),
      status: z
        .union([RecordStatusSchema, z.array(RecordStatusSchema)])
        .optional(),
      dateRange: z
        .object({
          start: z.string().datetime(),
          end: z.string().datetime(),
          field: z.enum(["created_at", "updated_at"]),
        })
        .optional(),
      metadata: z.record(z.any()).optional(),
      createdBy: z.union([z.string(), z.array(z.string())]).optional(),
    })
    .optional(),
});
```

## Database Operations

### Supabase-Specific Operations

```typescript
// Direct Supabase operations interface
export interface SupabaseOperations {
  // Table operations
  getRecords(options?: QueryOptions): Promise<ApiResponse<GenericRecord[]>>;
  getRecord(id: string): Promise<ApiResponse<GenericRecord>>;
  createRecord(input: CreateRecordInput): Promise<ApiResponse<GenericRecord>>;
  updateRecord(
    id: string,
    input: UpdateRecordInput
  ): Promise<ApiResponse<GenericRecord>>;
  deleteRecord(id: string): Promise<ApiResponse<void>>;

  // Batch operations
  batchCreate(
    inputs: CreateRecordInput[]
  ): Promise<ApiResponse<GenericRecord[]>>;
  batchUpdate(
    updates: Array<{ id: string; input: UpdateRecordInput }>
  ): Promise<ApiResponse<GenericRecord[]>>;
  batchDelete(ids: string[]): Promise<ApiResponse<void>>;

  // Real-time operations
  subscribeToChanges(options?: SubscriptionOptions): RealtimeSubscription;

  // Utility operations
  testConnection(): Promise<ApiResponse<boolean>>;
  getTableInfo(): Promise<ApiResponse<TableInfo>>;
}

// Table information interface
export interface TableInfo {
  name: string;
  recordCount: number;
  columns: ColumnInfo[];
  indexes: IndexInfo[];
  policies: PolicyInfo[];
}

export interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: any;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
}

export interface IndexInfo {
  name: string;
  columns: string[];
  isUnique: boolean;
}

export interface PolicyInfo {
  name: string;
  command: string;
  roles: string[];
  expression: string;
}
```

## Performance and Caching

### Caching Strategy Interface

```typescript
// Cache management interface
export interface CacheManager {
  // Cache operations
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;

  // Cache statistics
  getStats(): Promise<CacheStats>;

  // Cache keys for CRUD operations
  keys: {
    allRecords: (filters?: string) => string;
    recordById: (id: string) => string;
    recordsByCategory: (category: string) => string;
    searchResults: (query: string) => string;
    recordCount: (filters?: string) => string;
  };
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  itemCount: number;
  memoryUsage: number;
}

// Performance monitoring interface
export interface PerformanceMonitor {
  startTimer(operation: string): string;
  endTimer(timerId: string): number;
  recordMetric(name: string, value: number): void;
  getMetrics(): PerformanceMetrics;
}

export interface PerformanceMetrics {
  averageQueryTime: number;
  slowestQueries: Array<{ operation: string; time: number }>;
  errorRate: number;
  totalOperations: number;
}
```

## Security and Authorization

### Security Interface

```typescript
// Security validation interface
export interface SecurityValidator {
  // Role-based access control
  hasPermission(
    user: User,
    action: CrudAction,
    resource?: GenericRecord
  ): boolean;
  requireAdminRole(user: User): void;

  // Input validation and sanitization
  validateInput<T>(input: T, schema: z.ZodSchema<T>): Promise<T>;
  sanitizeInput(input: any): any;

  // SQL injection prevention
  escapeString(value: string): string;
  validateQuery(query: any): boolean;
}

export type CrudAction = "create" | "read" | "update" | "delete" | "export";

// Rate limiting interface
export interface RateLimiter {
  checkLimit(userId: string, action: CrudAction): Promise<boolean>;
  recordAction(userId: string, action: CrudAction): Promise<void>;
  getRemainingAttempts(userId: string, action: CrudAction): Promise<number>;
}
```

## Testing Interfaces

### Mock and Testing Support

```typescript
// Mock service interface for testing
export interface MockCrudService extends CrudService<GenericRecord> {
  // Test data management
  setMockData(data: GenericRecord[]): void;
  addMockRecord(record: GenericRecord): void;
  clearMockData(): void;

  // Error simulation
  simulateError(operation: CrudAction, error: ApiError): void;
  clearErrorSimulation(): void;

  // Performance simulation
  simulateDelay(operation: CrudAction, delay: number): void;
  clearDelaySimulation(): void;
}

// Test utilities interface
export interface TestUtilities {
  // Data generation
  generateMockRecord(overrides?: Partial<GenericRecord>): GenericRecord;
  generateMockRecords(count: number): GenericRecord[];

  // Assertion helpers
  expectValidRecord(record: any): void;
  expectValidApiResponse<T>(response: ApiResponse<T>): void;
  expectError(response: ApiResponse<any>, expectedCode: ApiErrorCode): void;
}
```

## Configuration and Setup

### Configuration Interface

```typescript
// Complete configuration interface
export interface DatabaseCrudConfig {
  // Database configuration
  database: {
    provider: "supabase" | "firebase" | "mongodb";
    connection: SupabaseConfig;
    table: string;
    enableRLS: boolean;
  };

  // Feature flags
  features: {
    realTime: boolean;
    export: boolean;
    bulkOperations: boolean;
    search: boolean;
    filtering: boolean;
  };

  // Performance settings
  performance: {
    defaultPageSize: number;
    maxPageSize: number;
    cacheEnabled: boolean;
    cacheTTL: number;
  };

  // Security settings
  security: {
    requireAuth: boolean;
    adminOnly: boolean;
    rateLimiting: boolean;
    inputValidation: boolean;
  };

  // UI configuration
  ui: {
    theme: "light" | "dark" | "auto";
    compactMode: boolean;
    showMetadata: boolean;
    defaultColumns: string[];
  };
}
```

## API Endpoint Specifications

### REST API Endpoints (if needed)

```typescript
// REST API endpoint specifications
export interface ApiEndpoints {
  // CRUD operations
  "GET /api/records": {
    query: QueryOptions;
    response: ApiResponse<GenericRecord[]>;
  };

  "GET /api/records/:id": {
    params: { id: string };
    response: ApiResponse<GenericRecord>;
  };

  "POST /api/records": {
    body: CreateRecordInput;
    response: ApiResponse<GenericRecord>;
  };

  "PUT /api/records/:id": {
    params: { id: string };
    body: UpdateRecordInput;
    response: ApiResponse<GenericRecord>;
  };

  "DELETE /api/records/:id": {
    params: { id: string };
    response: ApiResponse<void>;
  };

  // Batch operations
  "POST /api/records/batch": {
    body: CreateRecordInput[];
    response: ApiResponse<GenericRecord[]>;
  };

  "DELETE /api/records/batch": {
    body: { ids: string[] };
    response: ApiResponse<void>;
  };

  // Utility endpoints
  "GET /api/records/categories": {
    response: ApiResponse<RecordCategory[]>;
  };

  "GET /api/records/stats": {
    response: ApiResponse<RecordStats>;
  };

  "POST /api/records/export": {
    body: { format: ExportFormat; filters?: FilterOptions };
    response: ApiResponse<ExportResult>;
  };
}
```

## Implementation Notes

### Key Considerations

1. **Type Safety**: All interfaces use strict TypeScript typing with Zod validation
2. **Error Handling**: Comprehensive error codes and standardized error responses
3. **Performance**: Built-in caching, pagination, and query optimization
4. **Security**: Multi-layer security with RLS, input validation, and role checking
5. **Real-time**: Supabase real-time subscriptions for live data updates
6. **Testing**: Complete mock interfaces and test utilities
7. **Extensibility**: Generic interfaces allow for easy extension and customization

### Database Provider Abstraction

The API contracts are designed to work primarily with Supabase but include abstraction layers that could support other providers:

- **Supabase**: Primary implementation with PostgreSQL and real-time features
- **Firebase**: Alternative implementation with Firestore
- **MongoDB**: Alternative implementation with MongoDB Atlas
- **Custom**: Extension point for custom database implementations

### Migration Strategy

For transitioning from MSW to real database:

1. **Phase 1**: Implement Supabase integration alongside existing MSW
2. **Phase 2**: Add feature flags to switch between MSW and Supabase
3. **Phase 3**: Gradually migrate components to use real database
4. **Phase 4**: Remove MSW dependency once fully migrated

This contract specification provides a complete foundation for implementing the Database CRUD System with type safety, comprehensive error handling, and extensible architecture.
