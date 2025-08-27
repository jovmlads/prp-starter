/**
 * Data Table Row Component
 *
 * Individual table row displaying cryptocurrency price data.
 * Optimized for desktop and tablet layouts with full accessibility support.
 */

import { TableRow, TableCell } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DataTableRowProps } from '../types';
import {
  getTableRowAriaAttributes,
  getTableDataCellAriaAttributes,
  handleTableKeyDown,
} from '../utils/accessibility';

/**
 * Table row component for desktop/tablet layouts
 * CRITICAL: Responsive design with proper column visibility breakpoints
 */
export function DataTableRow({
  data,
  index,
  onClick,
  className,
  showTrend = true,
}: DataTableRowProps) {
  const trendColor =
    data.change.trend === 'up'
      ? 'text-green-600 dark:text-green-400'
      : data.change.trend === 'down'
        ? 'text-red-600 dark:text-red-400'
        : 'text-gray-600 dark:text-gray-400';

  const TrendIcon =
    data.change.trend === 'up'
      ? TrendingUp
      : data.change.trend === 'down'
        ? TrendingDown
        : Minus;

  const rowAriaAttributes = getTableRowAriaAttributes(data, index);

  return (
    <TableRow
      className={cn(
        'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer',
        'transition-colors duration-150',
        className
      )}
      onClick={() => onClick?.(data)}
      onKeyDown={(e) => handleTableKeyDown(e, () => onClick?.(data))}
      {...rowAriaAttributes}
    >
      {/* Date Column - Always visible */}
      <TableCell className="py-3 px-4" {...getTableDataCellAriaAttributes(0)}>
        <div className="flex flex-col">
          <span className="font-medium text-foreground">
            {data.formattedDate}
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            {data.date}
          </span>
        </div>
      </TableCell>

      {/* Price Column - Hidden on smallest screens */}
      <TableCell
        className="py-3 px-4 hidden sm:table-cell"
        {...getTableDataCellAriaAttributes(1)}
      >
        <span className="font-semibold text-foreground">
          {data.formattedPrice}
        </span>
      </TableCell>

      {/* Change (Absolute) Column - Hidden on small screens */}
      <TableCell
        className="py-3 px-4 hidden md:table-cell"
        {...getTableDataCellAriaAttributes(2)}
      >
        <div className={cn('flex items-center gap-1', trendColor)}>
          {showTrend && <TrendIcon className="h-4 w-4" />}
          <span className="font-medium">{data.change.formattedAbsolute}</span>
        </div>
      </TableCell>

      {/* Change (Percentage) Column - Hidden on medium screens */}
      <TableCell
        className="py-3 px-4 hidden lg:table-cell"
        {...getTableDataCellAriaAttributes(3)}
      >
        <div className={cn('flex items-center gap-1', trendColor)}>
          <span className="font-medium">{data.change.formattedPercentage}</span>
        </div>
      </TableCell>

      {/* Trend Column - Hidden on smaller screens */}
      <TableCell
        className="py-3 px-4 hidden xl:table-cell"
        {...getTableDataCellAriaAttributes(4)}
      >
        <div className={cn('flex items-center gap-2', trendColor)}>
          {showTrend && <TrendIcon className="h-4 w-4" />}
          <span className="capitalize font-medium">{data.change.trend}</span>
        </div>
      </TableCell>

      {/* Summary Column - Always visible on right */}
      <TableCell
        className="py-3 px-4 text-right"
        {...getTableDataCellAriaAttributes(5)}
      >
        <div className="flex flex-col items-end">
          {/* Show price on mobile when price column is hidden */}
          <span className="font-semibold text-foreground sm:hidden">
            {data.formattedPrice}
          </span>
          {/* Show change info */}
          <div className={cn('flex items-center gap-1', trendColor)}>
            {showTrend && <TrendIcon className="h-4 w-4" />}
            <span className="font-medium">
              {data.change.formattedPercentage}
            </span>
          </div>
          {/* Show absolute change on smaller screens where it's hidden */}
          <span className={cn('text-xs mt-1 md:hidden', trendColor)}>
            {data.change.formattedAbsolute}
          </span>
        </div>
      </TableCell>

      {/* Screen Reader Only Content */}
      <td className="sr-only">
        <span>
          Row {index + 1}: {data.ariaLabel}
        </span>
      </td>
    </TableRow>
  );
}
