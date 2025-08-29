export type RecordStatus = 'active' | 'inactive' | 'archived';

export type RecordCategory =
  | 'products'
  | 'customers'
  | 'orders'
  | 'inventory'
  | 'campaigns'
  | 'settings'
  | 'content'
  | 'analytics';

export interface GenericRecord {
  id: string;
  name: string;
  description?: string;
  category: RecordCategory;
  status: RecordStatus;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface CreateRecordInput {
  name: string;
  description?: string;
  category: RecordCategory;
  status?: RecordStatus;
  metadata?: Record<string, any>;
}

export interface UpdateRecordInput {
  name?: string;
  description?: string;
  category?: RecordCategory;
  status?: RecordStatus;
  metadata?: Record<string, any>;
}

export interface QueryOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  searchQuery?: string;
  filters?: {
    category?: RecordCategory;
    status?: RecordStatus;
    dateRange?: {
      start: string;
      end: string;
      field: 'created_at' | 'updated_at';
    };
  };
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}
