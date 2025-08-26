import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TickerSearch } from './TickerSearch';

// Mock the API calls
vi.mock('../services/chartDataApi', () => ({
  getPopularCoins: vi.fn(() => [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
  ]),
  fetchCoinsList: vi.fn(() =>
    Promise.resolve([
      { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
      { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
      { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
      { id: 'solana', symbol: 'SOL', name: 'Solana' },
    ])
  ),
}));

describe('TickerSearch', () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('should render search button with placeholder text', () => {
    render(<TickerSearch onSelect={mockOnSelect} />);

    expect(screen.getByText('Search cryptocurrency...')).toBeInTheDocument();
  });

  it('should display selected coin when value is provided', () => {
    render(<TickerSearch value="bitcoin" onSelect={mockOnSelect} />);

    expect(screen.getByText('BTC')).toBeInTheDocument();
    expect(screen.getByText('• Bitcoin')).toBeInTheDocument();
  });

  it('should open dropdown when button is clicked', async () => {
    render(<TickerSearch onSelect={mockOnSelect} />);

    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Search cryptocurrency...')
      ).toBeInTheDocument();
    });
  });

  it('should show popular coins in dropdown', async () => {
    render(<TickerSearch onSelect={mockOnSelect} />);

    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
      expect(screen.getByText('Ethereum')).toBeInTheDocument();
      expect(screen.getByText('Cardano')).toBeInTheDocument();
    });
  });

  it('should call onSelect when a coin is selected', async () => {
    render(<TickerSearch onSelect={mockOnSelect} />);

    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    await waitFor(() => {
      const bitcoinOption = screen.getByText('Bitcoin');
      fireEvent.click(bitcoinOption);
    });

    expect(mockOnSelect).toHaveBeenCalledWith('bitcoin');
  });

  it('should filter coins based on search input', async () => {
    render(<TickerSearch onSelect={mockOnSelect} />);

    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(
        'Search cryptocurrency...'
      );
      fireEvent.change(searchInput, { target: { value: 'eth' } });
    });

    await waitFor(() => {
      expect(screen.getByText('Ethereum')).toBeInTheDocument();
      expect(screen.queryByText('Bitcoin')).not.toBeInTheDocument();
    });
  });
});
