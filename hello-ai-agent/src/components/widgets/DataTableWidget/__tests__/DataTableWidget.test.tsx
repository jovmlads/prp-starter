/**
 * Data Table Widget Component Tests
 *
 * Comprehensive test suite for the DataTableWidget component.
 * Tests functionality, accessibility, and responsive behavior.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DataTableWidget } from '../DataTableWidget';
import type { ChartData } from '../../AreaChartWidget/types';
import { useTableData } from '../hooks/useTableData';
import { useSorting } from '../hooks/useSorting';
import { useResponsive } from '../hooks/useResponsive';

// Mock dependencies
vi.mock('../hooks/useTableData');
vi.mock('../hooks/useSorting');
vi.mock('../hooks/useResponsive');
vi.mock('../utils/accessibility');

// Mock chart data
const mockChartData: ChartData = {
  data: [
    {
      timestamp: 1693440000000, // 2023-08-31
      value: 26000,
      formattedDate: 'Aug 31, 2023',
      formattedValue: '$26,000',
    },
    {
      timestamp: 1693526400000, // 2023-09-01
      value: 26500,
      formattedDate: 'Sep 01, 2023',
      formattedValue: '$26,500',
    },
    {
      timestamp: 1693612800000, // 2023-09-02
      value: 25800,
      formattedDate: 'Sep 02, 2023',
      formattedValue: '$25,800',
    },
  ],
  metadata: {
    title: 'Bitcoin Price',
    subtitle: 'BTC/USD',
    currency: 'USD',
    lastUpdated: '2023-09-02T12:00:00Z',
  },
};

// Mock table data
const mockTableData = {
  rows: [
    {
      id: 'bitcoin-1693440000000',
      date: '2023-08-31',
      formattedDate: 'Aug 31, 2023',
      price: 26000,
      formattedPrice: '$26,000.00',
      change: {
        absolute: 0,
        percentage: 0,
        formattedAbsolute: '$0.00',
        formattedPercentage: '0.00%',
        trend: 'neutral' as const,
      },
      timestamp: 1693440000000,
      ariaLabel: 'Aug 31, 2023: $26,000.00, 0.00% change',
    },
    {
      id: 'bitcoin-1693526400000',
      date: '2023-09-01',
      formattedDate: 'Sep 01, 2023',
      price: 26500,
      formattedPrice: '$26,500.00',
      change: {
        absolute: 500,
        percentage: 1.92,
        formattedAbsolute: '+$500.00',
        formattedPercentage: '+1.92%',
        trend: 'up' as const,
      },
      timestamp: 1693526400000,
      ariaLabel: 'Sep 01, 2023: $26,500.00, +1.92% change',
    },
  ],
  metadata: {
    symbol: 'bitcoin',
    name: 'Bitcoin',
    totalRows: 2,
    dateRange: {
      start: '2023-08-31',
      end: '2023-09-01',
    },
    lastUpdated: Date.now(),
  },
};

describe('DataTableWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock hooks to return predictable values
    const { useTableData } = require('../hooks/useTableData');
    const { useSorting } = require('../hooks/useSorting');
    const { useResponsive } = require('../hooks/useResponsive');

    vi.mocked(useTableData).mockReturnValue({
      tableData: mockTableData,
      isLoading: false,
      error: null,
      isProcessing: false,
      processingError: null,
      refresh: vi.fn(),
      clearError: vi.fn(),
    });

    vi.mocked(useSorting).mockReturnValue({
      sortState: { column: 'date', direction: 'desc' },
      handleSort: vi.fn(),
      sortData: vi.fn((data) => data),
      resetSort: vi.fn(),
      setSortState: vi.fn(),
    });

    vi.mocked(useResponsive).mockReturnValue({
      responsive: {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isCompact: false,
        viewportWidth: 1280,
      },
      isLoading: false,
    });
  });

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<DataTableWidget />);
      expect(screen.getByText('Price History')).toBeInTheDocument();
    });

    it('displays correct title and description', () => {
      render(<DataTableWidget ticker="bitcoin" />);

      expect(screen.getByText('Price History')).toBeInTheDocument();
      expect(screen.getByText('Bitcoin • Last 2 days')).toBeInTheDocument();
    });

    it('renders table data in desktop layout', () => {
      render(<DataTableWidget />);

      // Check for table headers
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Price')).toBeInTheDocument();

      // Check for data rows
      expect(screen.getByText('Aug 31, 2023')).toBeInTheDocument();
      expect(screen.getByText('$26,000.00')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('shows loading state when data is loading', () => {
      const { useTableData } = require('../hooks/useTableData');
      vi.mocked(useTableData).mockReturnValue({
        tableData: null,
        isLoading: true,
        error: null,
        isProcessing: false,
        processingError: null,
        refresh: vi.fn(),
        clearError: vi.fn(),
      });

      render(<DataTableWidget />);

      expect(
        screen.getByText('Loading historical data...')
      ).toBeInTheDocument();
    });

    it('hides loading state when showLoadingState is false', () => {
      const { useTableData } = require('../hooks/useTableData');
      vi.mocked(useTableData).mockReturnValue({
        tableData: null,
        isLoading: true,
        error: null,
        isProcessing: false,
        processingError: null,
        refresh: vi.fn(),
        clearError: vi.fn(),
      });

      render(<DataTableWidget showLoadingState={false} />);

      expect(
        screen.queryByText('Loading historical data...')
      ).not.toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('shows error state when there is an error', () => {
      const { useTableData } = require('../hooks/useTableData');
      vi.mocked(useTableData).mockReturnValue({
        tableData: null,
        isLoading: false,
        error: 'Failed to load data',
        isProcessing: false,
        processingError: null,
        refresh: vi.fn(),
        clearError: vi.fn(),
      });

      render(<DataTableWidget />);

      expect(screen.getByText('Data Unavailable')).toBeInTheDocument();
      expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    });

    it('shows retry button in error state', () => {
      const mockRefresh = vi.fn();
      const { useTableData } = require('../hooks/useTableData');
      vi.mocked(useTableData).mockReturnValue({
        tableData: null,
        isLoading: false,
        error: 'Failed to load data',
        isProcessing: false,
        processingError: null,
        refresh: mockRefresh,
        clearError: vi.fn(),
      });

      render(<DataTableWidget />);

      const retryButton = screen.getByText('Retry');
      expect(retryButton).toBeInTheDocument();

      fireEvent.click(retryButton);
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  describe('Empty States', () => {
    it('shows empty state when no data is available', () => {
      const { useTableData } = require('../hooks/useTableData');
      vi.mocked(useTableData).mockReturnValue({
        tableData: { ...mockTableData, rows: [] },
        isLoading: false,
        error: null,
        isProcessing: false,
        processingError: null,
        refresh: vi.fn(),
        clearError: vi.fn(),
      });

      render(<DataTableWidget ticker="bitcoin" />);

      expect(
        screen.getByText('No price data found for bitcoin')
      ).toBeInTheDocument();
    });

    it('shows custom empty state message', () => {
      const { useTableData } = require('../hooks/useTableData');
      vi.mocked(useTableData).mockReturnValue({
        tableData: null,
        isLoading: false,
        error: null,
        isProcessing: false,
        processingError: null,
        refresh: vi.fn(),
        clearError: vi.fn(),
      });

      render(<DataTableWidget emptyStateMessage="Custom empty message" />);

      expect(screen.getByText('Custom empty message')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('renders mobile layout when isMobile is true', () => {
      const { useResponsive } = require('../hooks/useResponsive');
      vi.mocked(useResponsive).mockReturnValue({
        responsive: {
          isMobile: true,
          isTablet: false,
          isDesktop: false,
          isCompact: true,
          viewportWidth: 375,
        },
        isLoading: false,
      });

      render(<DataTableWidget />);

      // In mobile layout, data is shown as cards instead of table
      // The table headers should not be visible
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('renders desktop layout when isDesktop is true', () => {
      render(<DataTableWidget />);

      // Table should be present in desktop layout
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Sorting Functionality', () => {
    it('calls handleSort when column header is clicked', async () => {
      const mockHandleSort = vi.fn();
      const { useSorting } = require('../hooks/useSorting');
      vi.mocked(useSorting).mockReturnValue({
        sortState: { column: 'date', direction: 'desc' },
        handleSort: mockHandleSort,
        sortData: vi.fn((data) => data),
        resetSort: vi.fn(),
        setSortState: vi.fn(),
      });

      render(<DataTableWidget />);

      const dateHeader = screen.getByText('Date');
      fireEvent.click(dateHeader);

      await waitFor(() => {
        expect(mockHandleSort).toHaveBeenCalledWith('date');
      });
    });

    it('calls onSortChange callback when sorting changes', async () => {
      const mockOnSortChange = vi.fn();
      const mockHandleSort = vi.fn();

      const { useSorting } = require('../hooks/useSorting');
      vi.mocked(useSorting).mockReturnValue({
        sortState: { column: 'price', direction: 'asc' },
        handleSort: mockHandleSort,
        sortData: vi.fn((data) => data),
        resetSort: vi.fn(),
        setSortState: vi.fn(),
      });

      render(<DataTableWidget onSortChange={mockOnSortChange} />);

      const priceHeader = screen.getByText('Price');
      fireEvent.click(priceHeader);

      await waitFor(() => {
        expect(mockOnSortChange).toHaveBeenCalled();
      });
    });
  });

  describe('Row Interaction', () => {
    it('calls onRowClick when row is clicked', async () => {
      const mockOnRowClick = vi.fn();

      render(<DataTableWidget onRowClick={mockOnRowClick} />);

      const firstRow = screen.getByText('Aug 31, 2023').closest('tr');
      expect(firstRow).toBeInTheDocument();

      if (firstRow) {
        fireEvent.click(firstRow);

        await waitFor(() => {
          expect(mockOnRowClick).toHaveBeenCalledWith(mockTableData.rows[0]);
        });
      }
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels when accessibility is enabled', () => {
      render(<DataTableWidget enableAccessibility={true} />);

      const table = screen.getByRole('table');
      expect(table).toHaveAttribute('aria-label');
    });

    it('does not have ARIA labels when accessibility is disabled', () => {
      render(<DataTableWidget enableAccessibility={false} />);

      const table = screen.getByRole('table');
      expect(table).not.toHaveAttribute('aria-label');
    });
  });

  describe('External Data', () => {
    it('uses external data when provided', () => {
      render(
        <DataTableWidget data={mockChartData} isLoading={false} error={null} />
      );

      // Should not call internal data hooks when external data is provided
      expect(screen.getByText('Price History')).toBeInTheDocument();
    });

    it('shows external loading state', () => {
      render(<DataTableWidget data={null} isLoading={true} error={null} />);

      expect(
        screen.getByText('Loading historical data...')
      ).toBeInTheDocument();
    });

    it('shows external error state', () => {
      render(
        <DataTableWidget data={null} isLoading={false} error="External error" />
      );

      expect(screen.getByText('External error')).toBeInTheDocument();
    });
  });
});
