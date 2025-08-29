/**
 * @fileoverview React hooks for CRUD operations with React Query integration
 * @module hooks/useCrudOperations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { DatabaseService } from '../services/recordsService';
import {
  GenericRecord,
  CreateRecordInput,
  UpdateRecordInput,
  QueryOptions,
  ApiResponse,
} from '../types/records';

// Query keys for React Query
export const QUERY_KEYS = {
  RECORDS: 'records',
  RECORD_DETAIL: 'record-detail',
} as const;

// Initialize database service
const databaseService = new DatabaseService();

/**
 * Hook for fetching records with caching and background updates
 */
export function useRecords(options?: QueryOptions) {
  return useQuery({
    queryKey: [QUERY_KEYS.RECORDS, options],
    queryFn: () => databaseService.getAllRecords(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Retry up to 3 times for network errors
      return failureCount < 3 && error.message.includes('network');
    },
  });
}

/**
 * Hook for fetching a single record by ID
 */
export function useRecord(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.RECORD_DETAIL, id],
    queryFn: () => databaseService.getRecordById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for creating a new record
 */
export function useCreateRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecordInput) => databaseService.createRecord(data),
    onSuccess: (response: ApiResponse<GenericRecord>) => {
      // Invalidate and refetch records list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECORDS] });

      if (!response.error) {
        toast.success('Record created successfully!');
      } else {
        toast.error(response.error.message || 'Failed to create record');
      }
    },
    onError: (error: Error) => {
      console.error('Create record error:', error);
      toast.error('Failed to create record. Please try again.');
    },
  });
}

/**
 * Hook for updating an existing record
 */
export function useUpdateRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecordInput }) =>
      databaseService.updateRecord(id, data),
    onSuccess: (response: ApiResponse<GenericRecord>, { id }) => {
      // Update the record in cache
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECORDS] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.RECORD_DETAIL, id],
      });

      if (!response.error) {
        toast.success('Record updated successfully!');
      } else {
        toast.error(response.error.message || 'Failed to update record');
      }
    },
    onError: (error: Error) => {
      console.error('Update record error:', error);
      toast.error('Failed to update record. Please try again.');
    },
  });
}

/**
 * Hook for deleting a single record
 */
export function useDeleteRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => databaseService.deleteRecord(id),
    onSuccess: (response: ApiResponse<void>) => {
      // Invalidate records list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECORDS] });

      if (!response.error) {
        toast.success('Record deleted successfully!');
      } else {
        toast.error(response.error.message || 'Failed to delete record');
      }
    },
    onError: (error: Error) => {
      console.error('Delete record error:', error);
      toast.error('Failed to delete record. Please try again.');
    },
  });
}

/**
 * Hook for bulk deleting multiple records
 */
export function useBulkDeleteRecords() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => databaseService.bulkDeleteRecords(ids),
    onSuccess: (response: ApiResponse<void>, ids: string[]) => {
      // Invalidate records list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECORDS] });

      if (!response.error) {
        toast.success(`${ids.length} record(s) deleted successfully!`);
      } else {
        toast.error(response.error.message || 'Failed to delete records');
      }
    },
    onError: (error: Error) => {
      console.error('Bulk delete error:', error);
      toast.error('Failed to delete records. Please try again.');
    },
  });
}

/**
 * Combined hook that provides all CRUD operations
 */
export function useCrudOperations(queryOptions?: QueryOptions) {
  const recordsQuery = useRecords(queryOptions);
  const createMutation = useCreateRecord();
  const updateMutation = useUpdateRecord();
  const deleteMutation = useDeleteRecord();
  const bulkDeleteMutation = useBulkDeleteRecords();

  return {
    // Query operations
    records: recordsQuery.data?.data || [],
    isLoading: recordsQuery.isLoading,
    isError: recordsQuery.isError,
    error: recordsQuery.error,
    refetch: recordsQuery.refetch,

    // Mutation operations
    createRecord: createMutation.mutate,
    updateRecord: updateMutation.mutate,
    deleteRecord: deleteMutation.mutate,
    bulkDeleteRecords: bulkDeleteMutation.mutate,

    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isBulkDeleting: bulkDeleteMutation.isPending,

    // Combined loading state
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      bulkDeleteMutation.isPending,
  };
}

/**
 * Hook for managing real-time data synchronization
 */
export function useRealTimeRecords() {
  const queryClient = useQueryClient();

  // Set up real-time subscription
  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel('records_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'records',
        },
        (payload: any) => {
          console.log('Real-time update:', payload);

          // Invalidate queries to refetch data
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RECORDS] });

          // Show notification based on event type
          switch (payload.eventType) {
            case 'INSERT':
              toast.success('New record added');
              break;
            case 'UPDATE':
              toast.success('Record updated');
              break;
            case 'DELETE':
              toast.success('Record deleted');
              break;
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  return {
    setupRealtimeSubscription,
  };
}
