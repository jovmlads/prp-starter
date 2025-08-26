/**
 * @fileoverview TypeScript interfaces and types for DateWidget component
 */

/**
 * Props interface for the DateWidget component.
 * Provides configuration options for date display and styling.
 */
export interface DateWidgetProps {
  /**
   * Date format pattern using date-fns format syntax
   * @default 'EEEE, MMMM d, yyyy' (e.g., "Monday, August 26, 2025")
   * @example 'MM/dd/yyyy' for "08/26/2025"
   * @example 'MMM d, yyyy' for "Aug 26, 2025"
   */
  format?: string;

  /**
   * Custom CSS class names to apply to the widget container
   * @default ''
   */
  className?: string;

  /**
   * Whether to display a calendar icon alongside the date
   * @default false
   * @future Feature planned for future enhancement
   */
  showIcon?: boolean;

  /**
   * Custom timezone for date display
   * @default undefined (uses system timezone)
   * @future Feature planned for future enhancement
   */
  timezone?: string;
}

/**
 * Internal state interface for date management within the component.
 * Used internally by the DateWidget component for state typing.
 */
export interface DateState {
  /** Current date object */
  currentDate: Date;
  /** Formatted date string ready for display */
  formattedDate: string;
}

/**
 * Type for midnight calculation function.
 * Returns the number of milliseconds until the next midnight.
 */
export type MidnightCalculator = () => number;

/**
 * Type for date formatting function.
 * Takes a date and pattern, returns formatted string.
 */
export type DateFormatter = (date: Date, pattern: string) => string;
