import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AreaChartWidget } from './AreaChartWidget';
import * as useChartDataHook from './hooks/useChartData';

// Mock the chart components to avoid ResizeObserver issues
vi.mock('recharts', () => ({
  Area: () => <div data-testid="mock-area" />,
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-area-chart">{children}</div>
  ),
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-responsive-container">{children}</div>
  ),
  XAxis: () => <div data-testid="mock-x-axis" />,
  YAxis: () => <div data-testid="mock-y-axis" />,
  CartesianGrid: () => <div data-testid="mock-grid" />,
}));

vi.mock('./hooks/useChartData');

describe('AreaChartWidget', () => {
  const mockUseChartData = vi.mocked(useChartDataHook.useChartData);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    mockUseChartData.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      lastFetch: null,
      refetch: vi.fn(),
    });

    render(<AreaChartWidget />);

    expect(screen.getByText('Loading chart data...')).toBeInTheDocument();
  });

  it('should render chart with data', () => {
    const mockData = {
      data: [
        {
          timestamp: 1703721600000,
          value: 42000.5,
          formattedDate: 'Dec 27',
          formattedValue: '$42,001',
        },
      ],
      metadata: {
        title: 'Bitcoin Price (USD)',
        subtitle: 'Last 7 days',
        currency: 'USD',
        lastUpdated: '2023-12-28T00:00:00.000Z',
      },
    };

    mockUseChartData.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
      lastFetch: new Date(),
      refetch: vi.fn(),
    });

    render(<AreaChartWidget />);

    expect(screen.getByText('Bitcoin Price (USD)')).toBeInTheDocument();
    expect(screen.getByText('Last 7 days')).toBeInTheDocument();
    expect(screen.getByTestId('mock-area-chart')).toBeInTheDocument();
  });

  it('should render error state with retry button', () => {
    const mockRefetch = vi.fn();

    mockUseChartData.mockReturnValue({
      data: null,
      isLoading: false,
      error: 'Network error',
      lastFetch: null,
      refetch: mockRefetch,
    });

    render(<AreaChartWidget />);

    expect(screen.getByText('Chart Unavailable')).toBeInTheDocument();
    expect(
      screen.getByText('Unable to load chart data: Network error')
    ).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('should show fallback data with warning', () => {
    const mockData = {
      data: [
        {
          timestamp: 1703721600000,
          value: 42000.5,
          formattedDate: 'Dec 27',
          formattedValue: '$42,001',
        },
      ],
      metadata: {
        title: 'Bitcoin Price (USD)',
        subtitle: 'Last 7 days',
        currency: 'USD',
        lastUpdated: '2023-12-28T00:00:00.000Z',
      },
    };

    mockUseChartData.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: 'Using demo data (API unavailable)',
      lastFetch: new Date(),
      refetch: vi.fn(),
    });

    render(<AreaChartWidget />);

    expect(screen.getByText('Bitcoin Price (USD)')).toBeInTheDocument();
    expect(
      screen.getByText('(Using demo data (API unavailable))')
    ).toBeInTheDocument();
    expect(screen.getByTestId('mock-area-chart')).toBeInTheDocument();
  });
});
