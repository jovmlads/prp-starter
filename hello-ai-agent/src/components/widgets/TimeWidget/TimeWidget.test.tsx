import { render, screen } from '@testing-library/react';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { TimeWidget } from './TimeWidget';

describe('TimeWidget', () => {
  beforeEach(() => {
    // Mock date-fns to return consistent date/time for testing
    vi.useFakeTimers();
    const mockDate = new Date('2025-08-26T12:34:56');
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders time and date correctly', () => {
    render(<TimeWidget />);

    // Check time format (HH:mm:ss)
    expect(screen.getByText('12:34:56')).toBeDefined();

    // Check date format
    expect(screen.getByText('Tuesday, August 26, 2025')).toBeDefined();
  });

  it('updates time at specified interval', async () => {
    render(<TimeWidget updateInterval={1000} />);

    // Initial time
    expect(screen.getByText('12:34:56')).toBeDefined();

    // Advance timer by 1 second to trigger the interval
    vi.advanceTimersByTime(1000);

    // Advance system time by 1 second
    const newMockDate = new Date('2025-08-26T12:34:57');
    vi.setSystemTime(newMockDate);

    // Advance timer again to trigger component update
    vi.advanceTimersByTime(1000);

    // Should show updated time
    expect(screen.getByText('12:34:57')).toBeDefined();
  });

  it('respects showSeconds prop', () => {
    render(<TimeWidget showSeconds={false} />);

    // Should only show hours and minutes
    expect(screen.getByText('12:34')).toBeDefined();
    expect(screen.queryByText('12:34:56')).toBeNull();
  });
});
