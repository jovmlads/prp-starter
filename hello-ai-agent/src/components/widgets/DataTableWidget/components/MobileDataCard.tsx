/**
 * Mobile Data Card Component
 *
 * Card-based layout for displaying table data on mobile devices.
 * Optimized for touch interaction and small screens.
 */

import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MobileDataCardProps } from '../types';
import {
  getCardAriaAttributes,
  handleCardKeyDown,
} from '../utils/accessibility';

/**
 * Mobile card component for table data
 * CRITICAL: Provides all table data in accessible card format for mobile
 */
export function MobileDataCard({
  data,
  index,
  onClick,
  className,
  showTrend = true,
  compact = false,
  ...props
}: MobileDataCardProps) {
  const trendColor =
    data.change.trend === 'up'
      ? 'text-green-600'
      : data.change.trend === 'down'
        ? 'text-red-600'
        : 'text-gray-600';

  const TrendIcon =
    data.change.trend === 'up'
      ? TrendingUp
      : data.change.trend === 'down'
        ? TrendingDown
        : Minus;

  const cardAriaAttributes = getCardAriaAttributes(data, index);

  return (
    <Card
      className={cn(
        'p-4 cursor-pointer transition-all duration-200 hover:shadow-md',
        'border border-border bg-card',
        compact && 'p-3',
        className
      )}
      onClick={() => onClick?.(data)}
      onKeyDown={(e) => handleCardKeyDown(e, () => onClick?.(data))}
      {...cardAriaAttributes}
      {...props}
    >
      {/* Header Row: Date and Price */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-base text-foreground">
            {data.formattedDate}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{data.date}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg text-foreground">
            {data.formattedPrice}
          </p>
        </div>
      </div>

      {/* Change Information */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Change:</span>
          <div className={cn('flex items-center gap-1', trendColor)}>
            {showTrend && <TrendIcon className="h-4 w-4" />}
            <span className="font-medium">
              {data.change.formattedPercentage}
            </span>
          </div>
        </div>
        <div className={cn('text-right', trendColor)}>
          <span className="font-medium text-sm">
            {data.change.formattedAbsolute}
          </span>
        </div>
      </div>

      {/* Additional Details (when not compact) */}
      {!compact && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>
              <span className="block">Date:</span>
              <span className="font-medium text-foreground">
                {data.formattedDate}
              </span>
            </div>
            <div>
              <span className="block">Trend:</span>
              <span className={cn('font-medium capitalize', trendColor)}>
                {data.change.trend}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Screen Reader Only Content */}
      <div className="sr-only">
        <span>
          Price data for {data.formattedDate}: Current price{' '}
          {data.formattedPrice},
          {data.change.trend === 'up'
            ? 'increased'
            : data.change.trend === 'down'
              ? 'decreased'
              : 'unchanged'}{' '}
          by {data.change.formattedPercentage}
        </span>
      </div>
    </Card>
  );
}
