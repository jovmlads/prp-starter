/**
 * Table Loading State Component
 *
 * Skeleton loading states for both desktop table and mobile card layouts.
 * Provides visual feedback during data loading with proper accessibility.
 */

import { Card } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { TableLoadingStateProps } from '../types';

/**
 * Loading state component for data table
 * CRITICAL: Matches the structure of actual table for seamless transitions
 */
export function TableLoadingState({
  rows = 7,
  responsive,
  className,
}: TableLoadingStateProps) {
  if (responsive.isMobile) {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: rows }, (_, index) => (
          <Card key={index} className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-28" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card className={cn('w-full border-0 shadow-sm', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
              <Skeleton className="h-4 w-20" />
            </TableHead>
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300 hidden sm:table-cell">
              <Skeleton className="h-4 w-16" />
            </TableHead>
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell">
              <Skeleton className="h-4 w-24" />
            </TableHead>
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300 hidden lg:table-cell">
              <Skeleton className="h-4 w-20" />
            </TableHead>
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300 hidden xl:table-cell">
              <Skeleton className="h-4 w-24" />
            </TableHead>
            <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-right">
              <Skeleton className="h-4 w-16 ml-auto" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }, (_, index) => (
            <TableRow
              key={index}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <TableCell className="py-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell className="hidden xl:table-cell">
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell className="text-right">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20 ml-auto" />
                  <Skeleton className="h-3 w-16 ml-auto" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
