/**
 * @fileoverview Utility functions for DateWidget date calculations and formatting
 */

import { format } from 'date-fns';

/**
 * Calculates the number of milliseconds until the next midnight.
 * Used for scheduling automatic date updates at day boundaries.
 *
 * @returns Number of milliseconds until next midnight
 *
 * @example
 * ```typescript
 * const msUntilMidnight = calculateMidnight();
 * setTimeout(() => {
 *   // Update date at midnight
 *   setCurrentDate(new Date());
 * }, msUntilMidnight);
 * ```
 */
export function calculateMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);

  // Set to next midnight (24:00:00.000)
  midnight.setHours(24, 0, 0, 0);

  return midnight.getTime() - now.getTime();
}

/**
 * Formats a date using the specified pattern.
 * Wrapper around date-fns format function with error handling.
 *
 * @param date - The date to format
 * @param pattern - The format pattern using date-fns syntax
 * @returns Formatted date string
 *
 * @example
 * ```typescript
 * const formatted = formatDate(new Date(), 'EEEE, MMMM d, yyyy');
 * // Returns: "Monday, August 26, 2025"
 * ```
 *
 * @throws {Error} If date is invalid or pattern is malformed
 */
export function formatDate(date: Date, pattern: string): string {
  try {
    // Validate date object
    if (!date || isNaN(date.getTime())) {
      throw new Error('Invalid date provided');
    }

    // Validate pattern is not empty
    if (!pattern || pattern.trim().length === 0) {
      throw new Error('Format pattern cannot be empty');
    }

    return format(date, pattern);
  } catch (error) {
    // Log error for debugging but provide fallback
    console.error('Date formatting error:', error);

    // Fallback to ISO date string
    return date.toLocaleDateString();
  }
}

/**
 * Calculates the time remaining until the next occurrence of a specific time.
 * More flexible version of calculateMidnight for future enhancements.
 *
 * @param targetHour - Target hour (0-23)
 * @param targetMinute - Target minute (0-59)
 * @returns Number of milliseconds until target time
 *
 * @example
 * ```typescript
 * // Calculate time until 6:00 AM
 * const msUntil6AM = calculateTimeUntil(6, 0);
 * ```
 */
export function calculateTimeUntil(
  targetHour: number,
  targetMinute: number = 0
): number {
  const now = new Date();
  const target = new Date(now);

  target.setHours(targetHour, targetMinute, 0, 0);

  // If target time has already passed today, set for tomorrow
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  return target.getTime() - now.getTime();
}

/**
 * Validates if a given format string is valid for date-fns.
 * Used for prop validation in development.
 *
 * @param pattern - The format pattern to validate
 * @returns True if pattern is valid, false otherwise
 *
 * @example
 * ```typescript
 * const isValid = isValidFormatPattern('EEEE, MMMM d, yyyy'); // true
 * const isInvalid = isValidFormatPattern('invalid'); // false
 * ```
 */
export function isValidFormatPattern(pattern: string): boolean {
  try {
    // Test with a known date
    const testDate = new Date('2025-08-26');
    format(testDate, pattern);
    return true;
  } catch {
    return false;
  }
}
