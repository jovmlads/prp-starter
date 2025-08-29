/**
 * @fileoverview Enhanced database service for CRUD operations
 * @module services/recordsService
 */

import { supabase } from '../lib/supabase';
import {
  GenericRecord,
  CreateRecordInput,
  UpdateRecordInput,
  QueryOptions,
  ApiResponse,
  ApiError,
} from '../types/records';

export class DatabaseService {
  /**
   * Get all records with optional filtering, pagination, and sorting
   */
  async getAllRecords(
    options?: QueryOptions
  ): Promise<ApiResponse<GenericRecord[]>> {
    try {
      let query = supabase.from('records').select('*');

      // Apply pagination
      if (options?.page && options?.pageSize) {
        const from = (options.page - 1) * options.pageSize;
        const to = from + options.pageSize - 1;
        query = query.range(from, to);
      }

      // Apply sorting
      if (options?.sortBy && options?.sortOrder) {
        query = query.order(options.sortBy, {
          ascending: options.sortOrder === 'asc',
        });
      }

      // Apply filters
      if (options?.filters?.category) {
        query = query.eq('category', options.filters.category);
      }

      if (options?.filters?.status) {
        query = query.eq('status', options.filters.status);
      }

      // Apply search
      if (options?.searchQuery) {
        query = query.or(
          `name.ilike.%${options.searchQuery}%,description.ilike.%${options.searchQuery}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  } /**
   * Get record by ID
   */
  async getRecordById(id: string): Promise<ApiResponse<GenericRecord>> {
    try {
      const { data, error } = await supabase
        .from('records')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }

  /**
   * Create new record
   */
  async createRecord(
    input: CreateRecordInput
  ): Promise<ApiResponse<GenericRecord>> {
    try {
      const { data: userData } = await supabase.auth.getUser();

      // Prepare the record data with required fields and defaults
      const recordData: any = {
        name: input.name,
        description: input.description || null,
        category: input.category,
        status: input.status || 'active',
        metadata: input.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Only add user fields if we have an authenticated user
      if (userData.user?.id) {
        recordData.created_by = userData.user.id;
        recordData.updated_by = userData.user.id;
      }
      // If no user, let database handle it (might have DEFAULT values or allow NULL)

      const { data, error } = await supabase
        .from('records')
        .insert(recordData)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  } /**
   * Update existing record
   */
  async updateRecord(
    id: string,
    input: UpdateRecordInput
  ): Promise<ApiResponse<GenericRecord>> {
    try {
      const { data: userData } = await supabase.auth.getUser();

      // Prepare the update data
      const updateData: any = {
        ...input,
        updated_at: new Date().toISOString(),
      };

      // Only include updated_by if user is authenticated
      if (userData.user?.id) {
        updateData.updated_by = userData.user.id;
      }

      const { data, error } = await supabase
        .from('records')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }

  /**
   * Delete record by ID
   */
  async deleteRecord(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.from('records').delete().eq('id', id);

      if (error) throw error;

      return { data: null, error: null };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }

  /**
   * Bulk delete records
   */
  async bulkDeleteRecords(ids: string[]): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.from('records').delete().in('id', ids);

      if (error) throw error;

      return { data: null, error: null };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }

  /**
   * Get record count with optional filters
   */
  async getRecordCount(
    filters?: QueryOptions['filters']
  ): Promise<ApiResponse<number>> {
    try {
      let query = supabase
        .from('records')
        .select('*', { count: 'exact', head: true });

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { count, error } = await query;

      if (error) throw error;

      return { data: count || 0, error: null };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }

  /**
   * Handle and standardize errors
   */
  private handleError(error: any): ApiError {
    // For development: If we get auth errors, provide helpful message
    if (
      error.message?.includes('Invalid API key') ||
      error.message?.includes('row-level security') ||
      error.code === '42501' || // RLS policy violation
      error.code === 'PGRST301' || // RLS policy violation (alternative code)
      error.message?.includes('violates row-level security policy')
    ) {
      console.warn(
        'Database authentication error - using mock data for development'
      );
      return {
        code: 'AUTH_ERROR',
        message:
          'Database authentication error. Using mock data for development.',
        details: { originalError: error.message, originalCode: error.code },
      };
    }

    console.error('Database Service Error:', error);
    return {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred',
      details: error.details || {},
    };
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();

// Export individual functions for backward compatibility
export async function getAllRecords() {
  return databaseService.getAllRecords();
}

export async function getRecordById(id: string) {
  return databaseService.getRecordById(id);
}

export async function createRecord(input: CreateRecordInput) {
  return databaseService.createRecord(input);
}

export async function updateRecord(id: string, input: UpdateRecordInput) {
  return databaseService.updateRecord(id, input);
}

export async function deleteRecord(id: string) {
  return databaseService.deleteRecord(id);
}

export async function bulkDeleteRecords(ids: string[]) {
  return databaseService.bulkDeleteRecords(ids);
}
