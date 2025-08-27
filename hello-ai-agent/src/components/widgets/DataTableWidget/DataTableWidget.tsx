/**
 * Data Table Widget - Main Component
 *
 * Complete data table widget for displaying cryptocurrency price history.
 * Features responsive design, sorting, loading states, and accessibility.
 */

import { useMemo, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Table, TableBody } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Component imports
import { DataTableHeader } from './components/DataTableHeader';
import { DataTableRow } from './components/DataTableRow';
import { MobileDataCard } from './components/MobileDataCard';
import { TableLoadingState } from './components/TableLoadingState';

// Hook imports
import { useTableData } from './hooks/useTableData';
import { useSorting } from './hooks/useSorting';
import { useResponsive } from './hooks/useResponsive';

// Type imports
import type { DataTableWidgetProps, SortColumn } from './types';

// Utility imports
import {
  generateTableAriaLabel,
  announceLoadingState,
  announceError,
  announceSortChange,
} from './utils/accessibility';

/**
 * Main Data Table Widget Component
 * CRITICAL: Integrates all features with proper error handling and accessibility
 */
export function DataTableWidget({
  ticker = 'bitcoin',
  data: externalData,
  isLoading: externalIsLoading,
  error: externalError,
  className,
  responsiveConfig,
  sortingConfig,
  onRowClick,
  onSortChange,
  showLoadingState = true,
  showErrorState = true,
  emptyStateMessage,
  enableAccessibility = true,
}: DataTableWidgetProps) {
  // Hooks
  const { responsive, isLoading: responsiveLoading } =
    useResponsive(responsiveConfig);
  const sorting = useSorting(sortingConfig);
  const {
    tableData,
    isLoading: dataLoading,
    error: dataError,
    isProcessing,
    processingError,
    refresh,
    clearError,
  } = useTableData(ticker, externalData, responsiveConfig);

  // Combine loading states
  const isLoading =
    externalIsLoading || dataLoading || responsiveLoading || isProcessing;

  // Combine error states
  const error = externalError || dataError || processingError;

  // Sort data when available
  const sortedData = useMemo(() => {
    if (!tableData?.rows) return [];
    return sorting.sortData(tableData.rows);
  }, [tableData?.rows, sorting]);

  // Handle sort changes
  const handleSort = useCallback(
    (column: SortColumn) => {
      sorting.handleSort(column);
      onSortChange?.(column, sorting.sortState.direction, sorting.sortState);

      // Announce sort change for accessibility
      if (enableAccessibility && tableData) {
        announceSortChange(
          column,
          sorting.sortState.direction,
          tableData.rows.length
        );
      }
    },
    [sorting, onSortChange, enableAccessibility, tableData]
  );

  // Handle row clicks
  const handleRowClick = useCallback(
    (rowData: any) => {
      onRowClick?.(rowData);
    },
    [onRowClick]
  );

  // Announce loading states for accessibility
  const announceLoadingIfEnabled = useCallback(
    (loading: boolean) => {
      if (enableAccessibility) {
        announceLoadingState(loading, ticker);
      }
    },
    [enableAccessibility, ticker]
  );

  // Announce errors for accessibility
  const announceErrorIfEnabled = useCallback(
    (errorMsg: string) => {
      if (enableAccessibility) {
        announceError(errorMsg);
      }
    },
    [enableAccessibility]
  );

  // Loading state
  if (isLoading && showLoadingState) {
    announceLoadingIfEnabled(true);

    return (
      <Card className={cn('w-full', className)} data-testid="data-table-widget">
        <CardHeader>
          <CardTitle>Data Table</CardTitle>
          <CardDescription>Loading historical data...</CardDescription>
        </CardHeader>
        <CardContent>
          <TableLoadingState
            rows={7}
            responsive={responsive}
            data-testid="table-loading"
          />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error && showErrorState) {
    announceErrorIfEnabled(error);

    return (
      <Card className={cn('w-full', className)} data-testid="data-table-widget">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <span>Data Unavailable</span>
          </CardTitle>
          <CardDescription>
            {error || 'Unable to load price history'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline" onClick={refresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
            {(dataError || processingError) && (
              <Button variant="ghost" onClick={clearError}>
                Clear Error
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // No data state
  if (!tableData || sortedData.length === 0) {
    return (
      <Card className={cn('w-full', className)} data-testid="data-table-widget">
        <CardHeader>
          <CardTitle>Data Table</CardTitle>
          <CardDescription>
            {emptyStateMessage || 'No historical data available'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No price data found for {ticker}</p>
            <Button variant="outline" onClick={refresh} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get display name for ticker
  const totalRows = sortedData.length;

  // Generate table ARIA label
  const tableAriaLabel = enableAccessibility
    ? generateTableAriaLabel(ticker, totalRows)
    : undefined;

  // Main render
  return (
    <Card className={cn('w-full', className)} data-testid="data-table-widget">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Data Table</span>
          <span className="text-sm font-normal text-muted-foreground">
            {tableData.metadata.symbol.toUpperCase()}
          </span>
        </CardTitle>
        <CardDescription>
          Detailed view of chart data in tabular format
        </CardDescription>
      </CardHeader>
      <CardContent>
        {responsive.isMobile ? (
          // Mobile card layout
          <div className="space-y-3">
            {sortedData.map((row, index) => (
              <MobileDataCard
                key={row.id}
                data={row}
                index={index}
                onClick={handleRowClick}
                compact={responsive.isCompact}
                data-testid="mobile-data-card"
              />
            ))}
          </div>
        ) : (
          // Desktop/tablet table layout
          <div className="overflow-x-auto">
            <Table
              aria-label={tableAriaLabel}
              data-testid="data-table"
              role="table"
            >
              <DataTableHeader
                sortState={sorting.sortState}
                onSort={handleSort}
                responsive={responsive}
              />
              <TableBody>
                {sortedData.map((row, index) => (
                  <DataTableRow
                    key={row.id}
                    data={row}
                    index={index}
                    onClick={handleRowClick}
                    responsive={responsive}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Footer with refresh button */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">
            Last updated:{' '}
            {new Date(tableData.metadata.lastUpdated).toLocaleTimeString()}
          </span>
          <Button variant="ghost" size="sm" onClick={refresh}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
