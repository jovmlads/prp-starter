/**
 * Data Table Widget Accessibility Utilities
 *
 * Comprehensive accessibility support for WCAG 2.1 AA compliance.
 * Includes ARIA labels, keyboard navigation, and screen reader support.
 */

import type {
  TableDataPoint,
  AccessibilityConfig,
  SortColumn,
  SortDirection,
} from '../types';

// ================================
// Default Configuration
// ================================

/**
 * Default accessibility configuration
 */
export const DEFAULT_A11Y_CONFIG: AccessibilityConfig = {
  enableScreenReader: true,
  enableKeyboardNav: true,
  enableFocusIndicators: true,
  ariaLabels: {
    table: 'Cryptocurrency price history table',
    sortButton: 'Sort by {column}',
    row: 'Price data for {date}',
    price: 'Price: {price}',
    change: 'Change: {change}',
  },
};

// ================================
// ARIA Label Generators
// ================================

/**
 * Generate ARIA label for the main table
 */
export function generateTableAriaLabel(
  ticker: string,
  totalRows: number,
  _config: AccessibilityConfig = DEFAULT_A11Y_CONFIG
): string {
  const tickerName = ticker.charAt(0).toUpperCase() + ticker.slice(1);
  return `${tickerName} price history table with ${totalRows} rows`;
}

/**
 * Generate ARIA label for table rows
 */
export function generateRowAriaLabel(
  data: TableDataPoint,
  index: number,
  _config: AccessibilityConfig = DEFAULT_A11Y_CONFIG
): string {
  const changeDirection =
    data.change.trend === 'up'
      ? 'increased'
      : data.change.trend === 'down'
        ? 'decreased'
        : 'unchanged';

  return `Row ${index + 1}: ${data.formattedDate}, price ${data.formattedPrice}, ${changeDirection} by ${data.change.formattedPercentage}`;
}

/**
 * Generate ARIA label for sort buttons
 */
export function generateSortButtonAriaLabel(
  column: SortColumn,
  currentColumn: SortColumn | null,
  direction: SortDirection,
  _config: AccessibilityConfig = DEFAULT_A11Y_CONFIG
): string {
  const columnName = getColumnDisplayName(column);
  const isActive = column === currentColumn;

  if (isActive) {
    const nextDirection = direction === 'asc' ? 'descending' : 'ascending';
    return `Sort by ${columnName}, currently ${direction === 'asc' ? 'ascending' : 'descending'}, click to sort ${nextDirection}`;
  }

  return `Sort by ${columnName}`;
}

/**
 * Generate ARIA label for mobile cards
 */
export function generateCardAriaLabel(
  data: TableDataPoint,
  index: number,
  _config: AccessibilityConfig = DEFAULT_A11Y_CONFIG
): string {
  return `Card ${index + 1}: ${data.formattedDate}, ${data.formattedPrice}, ${data.change.formattedPercentage} change`;
}

// ================================
// ARIA Attributes
// ================================

/**
 * Get ARIA attributes for table element
 */
export function getTableAriaAttributes(
  ticker: string,
  totalRows: number,
  config: AccessibilityConfig = DEFAULT_A11Y_CONFIG
) {
  return {
    role: 'table',
    'aria-label': generateTableAriaLabel(ticker, totalRows, config),
    'aria-rowcount': totalRows + 1, // +1 for header row
    'aria-colcount': 6, // Date, Price, Change columns + mobile equivalents
  };
}

/**
 * Get ARIA attributes for table header
 */
export function getTableHeaderAriaAttributes() {
  return {
    role: 'rowgroup',
  };
}

/**
 * Get ARIA attributes for table body
 */
export function getTableBodyAriaAttributes() {
  return {
    role: 'rowgroup',
  };
}

/**
 * Get ARIA attributes for table rows
 */
export function getTableRowAriaAttributes(
  data: TableDataPoint,
  index: number,
  config: AccessibilityConfig = DEFAULT_A11Y_CONFIG
) {
  return {
    role: 'row',
    'aria-rowindex': index + 2, // +2 because header is row 1
    'aria-label': generateRowAriaLabel(data, index, config),
  };
}

/**
 * Get ARIA attributes for table header cells
 */
export function getTableHeaderCellAriaAttributes(
  column: SortColumn,
  currentColumn: SortColumn | null,
  direction: SortDirection
) {
  const isActive = column === currentColumn;

  return {
    role: 'columnheader' as const,
    'aria-sort': (isActive
      ? direction === 'asc'
        ? 'ascending'
        : 'descending'
      : 'none') as 'ascending' | 'descending' | 'none',
    scope: 'col' as const,
  };
}

/**
 * Get ARIA attributes for table data cells
 */
export function getTableDataCellAriaAttributes(columnIndex: number) {
  return {
    role: 'cell',
    'aria-colindex': columnIndex + 1,
  };
}

/**
 * Get ARIA attributes for sort buttons
 */
export function getSortButtonAriaAttributes(
  column: SortColumn,
  currentColumn: SortColumn | null,
  direction: SortDirection,
  config: AccessibilityConfig = DEFAULT_A11Y_CONFIG
) {
  const isActive = column === currentColumn;

  return {
    'aria-label': generateSortButtonAriaLabel(
      column,
      currentColumn,
      direction,
      config
    ),
    'aria-pressed': isActive,
    'aria-describedby': `sort-help-${column}`,
    type: 'button' as const,
  };
}

/**
 * Get ARIA attributes for mobile cards
 */
export function getCardAriaAttributes(
  data: TableDataPoint,
  index: number,
  config: AccessibilityConfig = DEFAULT_A11Y_CONFIG
) {
  return {
    role: 'button',
    tabIndex: 0,
    'aria-label': generateCardAriaLabel(data, index, config),
    'aria-describedby': `card-details-${data.id}`,
  };
}

// ================================
// Keyboard Navigation
// ================================

/**
 * Handle keyboard navigation for table rows
 */
export function handleTableKeyDown(
  event: React.KeyboardEvent,
  onSelect?: () => void,
  onFocus?: (direction: 'up' | 'down' | 'left' | 'right') => void
) {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      onSelect?.();
      break;
    case 'ArrowUp':
      event.preventDefault();
      onFocus?.('up');
      break;
    case 'ArrowDown':
      event.preventDefault();
      onFocus?.('down');
      break;
    case 'ArrowLeft':
      event.preventDefault();
      onFocus?.('left');
      break;
    case 'ArrowRight':
      event.preventDefault();
      onFocus?.('right');
      break;
    case 'Home':
      event.preventDefault();
      // Focus first row
      break;
    case 'End':
      event.preventDefault();
      // Focus last row
      break;
  }
}

/**
 * Handle keyboard navigation for sort buttons
 */
export function handleSortKeyDown(
  event: React.KeyboardEvent,
  onSort: () => void
) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onSort();
  }
}

/**
 * Handle keyboard navigation for mobile cards
 */
export function handleCardKeyDown(
  event: React.KeyboardEvent,
  onSelect?: () => void
) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onSelect?.();
  }
}

// ================================
// Focus Management
// ================================

/**
 * Focus management utilities
 */
export class FocusManager {
  private focusableElements: HTMLElement[] = [];
  private currentIndex = -1;

  constructor(container: HTMLElement) {
    this.updateFocusableElements(container);
  }

  /**
   * Update list of focusable elements
   */
  updateFocusableElements(container: HTMLElement) {
    const selector = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    this.focusableElements = Array.from(container.querySelectorAll(selector));
    this.currentIndex = -1;
  }

  /**
   * Focus next element
   */
  focusNext(): boolean {
    if (this.focusableElements.length === 0) return false;

    this.currentIndex = (this.currentIndex + 1) % this.focusableElements.length;
    this.focusableElements[this.currentIndex]?.focus();
    return true;
  }

  /**
   * Focus previous element
   */
  focusPrevious(): boolean {
    if (this.focusableElements.length === 0) return false;

    this.currentIndex =
      this.currentIndex <= 0
        ? this.focusableElements.length - 1
        : this.currentIndex - 1;
    this.focusableElements[this.currentIndex]?.focus();
    return true;
  }

  /**
   * Focus first element
   */
  focusFirst(): boolean {
    if (this.focusableElements.length === 0) return false;

    this.currentIndex = 0;
    this.focusableElements[0]?.focus();
    return true;
  }

  /**
   * Focus last element
   */
  focusLast(): boolean {
    if (this.focusableElements.length === 0) return false;

    this.currentIndex = this.focusableElements.length - 1;
    this.focusableElements[this.currentIndex]?.focus();
    return true;
  }
}

// ================================
// Screen Reader Support
// ================================

/**
 * Announce changes to screen readers
 */
export function announceToScreenReader(message: string) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Announce sort changes
 */
export function announceSortChange(
  column: SortColumn,
  direction: SortDirection,
  totalRows: number
) {
  const columnName = getColumnDisplayName(column);
  const directionText = direction === 'asc' ? 'ascending' : 'descending';
  const message = `Table sorted by ${columnName} in ${directionText} order. ${totalRows} rows.`;

  announceToScreenReader(message);
}

/**
 * Announce data loading states
 */
export function announceLoadingState(isLoading: boolean, ticker?: string) {
  if (isLoading) {
    announceToScreenReader(`Loading ${ticker || 'price'} data...`);
  } else {
    announceToScreenReader(`${ticker || 'Price'} data loaded successfully.`);
  }
}

/**
 * Announce errors
 */
export function announceError(error: string) {
  announceToScreenReader(`Error: ${error}`);
}

// ================================
// Utility Functions
// ================================

/**
 * Get display name for table columns
 */
export function getColumnDisplayName(column: SortColumn): string {
  const names: Record<SortColumn, string> = {
    date: 'date',
    price: 'price',
    change: 'price change',
  };

  return names[column];
}

/**
 * Check if element is visible to screen readers
 */
export function isVisibleToScreenReader(element: HTMLElement): boolean {
  const style = getComputedStyle(element);
  return !(
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    style.opacity === '0' ||
    element.hasAttribute('aria-hidden')
  );
}

/**
 * Generate unique IDs for form elements
 */
export function generateUniqueId(prefix: string = 'dt-widget'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}
