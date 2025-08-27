/**
 * Data Table Header Component
 *
 * Sortable table header with accessibility and responsive design.
 * Handles column sorting with visual indicators and keyboard navigation.
 */

import { TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DataTableHeaderProps, SortColumn } from '../types';
import {
  getTableHeaderAriaAttributes,
  getTableHeaderCellAriaAttributes,
  getSortButtonAriaAttributes,
  handleSortKeyDown,
} from '../utils/accessibility';

/**
 * Table header component with sorting functionality
 * CRITICAL: Responsive column visibility and proper ARIA attributes
 */
export function DataTableHeader({
  sortState,
  onSort,
  responsive,
  className,
}: DataTableHeaderProps) {
  /**
   * Get sort icon for column
   */
  const getSortIcon = (column: SortColumn) => {
    if (sortState.column !== column) {
      return ArrowUpDown;
    }
    return sortState.direction === 'asc' ? ArrowUp : ArrowDown;
  };

  /**
   * Get sort button classes
   */
  const getSortButtonClasses = (column: SortColumn) => {
    const isActive = sortState.column === column;
    return cn(
      'flex items-center gap-1 font-semibold text-left',
      'hover:text-foreground transition-colors',
      isActive
        ? 'text-foreground'
        : 'text-muted-foreground hover:text-foreground'
    );
  };

  /**
   * Render sortable column header
   */
  const renderSortableHeader = (
    column: SortColumn,
    label: string,
    className?: string
  ) => {
    const SortIcon = getSortIcon(column);
    const isActive = sortState.column === column;

    return (
      <TableHead
        className={cn('p-0', className)}
        {...getTableHeaderCellAriaAttributes(
          column,
          sortState.column,
          sortState.direction
        )}
      >
        <Button
          variant="ghost"
          size="sm"
          className={getSortButtonClasses(column)}
          onClick={() => onSort(column)}
          onKeyDown={(e) => handleSortKeyDown(e, () => onSort(column))}
          data-testid={`sort-header-${column}`}
          {...getSortButtonAriaAttributes(
            column,
            sortState.column,
            sortState.direction
          )}
        >
          <span>{label}</span>
          <SortIcon
            className={cn(
              'h-4 w-4 transition-opacity',
              isActive ? 'opacity-100' : 'opacity-50'
            )}
            data-testid="sort-indicator"
          />
        </Button>
      </TableHead>
    );
  };

  return (
    <TableHeader className={className} {...getTableHeaderAriaAttributes()}>
      <TableRow>
        {/* Date Column - Always visible */}
        {renderSortableHeader('date', 'Date', 'w-32')}

        {/* Price Column - Hidden on smallest screens */}
        {renderSortableHeader('price', 'Price', 'hidden sm:table-cell w-24')}

        {/* Change (Absolute) Column - Hidden on small screens */}
        <TableHead className="hidden md:table-cell w-28 font-semibold text-muted-foreground">
          Change ($)
        </TableHead>

        {/* Change (Percentage) Column - Hidden on medium screens */}
        {renderSortableHeader(
          'change',
          'Change (%)',
          'hidden lg:table-cell w-28'
        )}

        {/* Trend Column - Hidden on smaller screens */}
        <TableHead className="hidden xl:table-cell w-24 font-semibold text-muted-foreground">
          Trend
        </TableHead>

        {/* Summary Column - Always visible on right */}
        <TableHead className="text-right w-32 font-semibold text-muted-foreground">
          {responsive.isMobile ? 'Price & Change' : 'Summary'}
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}
