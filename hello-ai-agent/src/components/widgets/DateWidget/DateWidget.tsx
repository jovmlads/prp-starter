/**
 * @fileoverview DateWidget component - displays current date with automatic midnight updates
 */

import { useState, useEffect, useMemo, ReactElement } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { DateWidgetProps } from './types';
import { calculateMidnight } from './utils';

/**
 * DateWidget component displays the current date in a Material-UI Card.
 * Updates automatically at midnight and provides accessible date information.
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage with default formatting
 * <DateWidget />
 *
 * // Custom format
 * <DateWidget format="MM/dd/yyyy" />
 *
 * // With custom styling
 * <DateWidget className="my-custom-class" />
 * ```
 */
export function DateWidget({
  format: dateFormat = 'EEEE, MMMM d, yyyy',
  className = '',
  showIcon = false,
}: Omit<DateWidgetProps, 'timezone'>): ReactElement {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Set up midnight update timer
  useEffect(() => {
    /**
     * Recursive function to schedule the next midnight update.
     * Calculates time until midnight and sets a timeout to update the date.
     */
    const scheduleNextUpdate = (): NodeJS.Timeout => {
      const msUntilMidnight = calculateMidnight();

      const timer = setTimeout(() => {
        // Update to new date at midnight
        setCurrentDate(new Date());

        // Schedule the next update for the following midnight
        scheduleNextUpdate();
      }, msUntilMidnight);

      return timer;
    };

    // Initial setup - schedule first midnight update
    const timer = scheduleNextUpdate();

    // Cleanup function to prevent memory leaks
    return () => {
      clearTimeout(timer);
    };
  }, []); // Empty dependency array - only run on mount/unmount

  /**
   * Memoized formatted date string for performance optimization.
   * Only recalculates when currentDate or dateFormat changes.
   */
  const formattedDate = useMemo(() => {
    try {
      return format(currentDate, dateFormat);
    } catch (error) {
      // Fallback to locale date string if formatting fails
      console.error('Date formatting error in DateWidget:', error);
      return currentDate.toLocaleDateString();
    }
  }, [currentDate, dateFormat]);

  return (
    <Card
      className={`w-full max-w-sm transition-all duration-200 hover:shadow-lg ${className}`}
      role="region"
      aria-label="Current date display"
    >
      <CardContent className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground">
            {formattedDate}
          </h2>
          {showIcon && (
            <div className="mt-2 text-lg text-muted-foreground">📅</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
