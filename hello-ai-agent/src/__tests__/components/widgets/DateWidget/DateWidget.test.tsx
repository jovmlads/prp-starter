/**
 * @fileoverview Tests for DateWidget component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { format } from 'date-fns';
import { DateWidget } from '../../../../components/widgets/DateWidget/DateWidget';

// Mock date-fns format function
vi.mock('date-fns', () => ({
  format: vi.fn(),
}));

describe('DateWidget', () => {
  const mockFormat = vi.mocked(format);
  const mockDate = new Date('2025-08-26T14:30:00.000Z');

  beforeEach(() => {
    // Mock Date constructor to return consistent date
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);

    // Setup default mock implementation
    mockFormat.mockImplementation((_date, pattern) => {
      if (pattern === 'EEEE, MMMM d, yyyy') {
        return 'Monday, August 26, 2025';
      }
      if (pattern === 'MM/dd/yyyy') {
        return '08/26/2025';
      }
      return 'Formatted Date';
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders current date with default format', () => {
      render(<DateWidget />);

      const dateDisplay = screen.getByRole('region', {
        name: /current date display/i,
      });
      expect(dateDisplay).toBeInTheDocument();

      const dateText = screen.getByText('Monday, August 26, 2025');
      expect(dateText).toBeInTheDocument();

      expect(mockFormat).toHaveBeenCalledWith(
        expect.any(Date),
        'EEEE, MMMM d, yyyy'
      );
    });

    it('renders with custom format prop', () => {
      render(<DateWidget format="MM/dd/yyyy" />);

      const dateText = screen.getByText('08/26/2025');
      expect(dateText).toBeInTheDocument();

      expect(mockFormat).toHaveBeenCalledWith(expect.any(Date), 'MM/dd/yyyy');
    });

    it('applies custom className prop', () => {
      render(<DateWidget className="custom-date-widget" />);

      const dateCard = screen.getByRole('region');
      expect(dateCard).toHaveClass('custom-date-widget');
    });

    it('shows calendar icon when showIcon is true', () => {
      render(<DateWidget showIcon={true} />);

      const icon = screen.getByText('📅');
      expect(icon).toBeInTheDocument();
    });

    it('hides calendar icon when showIcon is false', () => {
      render(<DateWidget showIcon={false} />);

      const icon = screen.queryByText('📅');
      expect(icon).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<DateWidget />);

      const dateDisplay = screen.getByRole('region');
      expect(dateDisplay).toHaveAttribute('aria-label', 'Current date display');
    });

    it('uses semantic HTML structure', () => {
      render(<DateWidget />);

      const dateDisplay = screen.getByRole('region');
      expect(dateDisplay).toBeInTheDocument();

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Monday, August 26, 2025');
    });
  });

  describe('Error Handling', () => {
    it('handles date formatting errors gracefully', () => {
      // Mock format to throw an error
      mockFormat.mockImplementation(() => {
        throw new Error('Invalid format pattern');
      });

      // Mock console.error to avoid test output pollution
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      render(<DateWidget />);

      // Should fallback to locale date string
      expect(consoleSpy).toHaveBeenCalledWith(
        'Date formatting error in DateWidget:',
        expect.any(Error)
      );

      // Should still render something (fallback)
      const dateDisplay = screen.getByRole('region');
      expect(dateDisplay).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('Timer Management', () => {
    it('sets up midnight update timer on mount', () => {
      const setTimeoutSpy = vi.spyOn(global, 'setTimeout');

      render(<DateWidget />);

      // Should call setTimeout for midnight update
      expect(setTimeoutSpy).toHaveBeenCalled();

      setTimeoutSpy.mockRestore();
    });

    it('cleans up timer on unmount', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      const { unmount } = render(<DateWidget />);
      unmount();

      // Should call clearTimeout during cleanup
      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    it('memoizes formatted date to avoid unnecessary recalculations', () => {
      const { rerender } = render(<DateWidget />);

      // Initial render should call format once
      expect(mockFormat).toHaveBeenCalledTimes(1);

      // Re-render with same props should not call format again
      rerender(<DateWidget />);
      expect(mockFormat).toHaveBeenCalledTimes(1);

      // Re-render with different format should call format again
      rerender(<DateWidget format="MM/dd/yyyy" />);
      expect(mockFormat).toHaveBeenCalledTimes(2);
    });
  });

  describe('Shadcn/UI Integration', () => {
    it('renders as shadcn/ui Card component', () => {
      render(<DateWidget />);

      const card = screen.getByRole('region');
      expect(card).toBeInTheDocument();
      expect(card.tagName).toBe('DIV');
    });

    it('uses semantic heading for text display', () => {
      render(<DateWidget />);

      const dateText = screen.getByText('Monday, August 26, 2025');
      expect(dateText).toBeInTheDocument();

      // Should be wrapped in a heading element (h2)
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toContain(dateText);
    });
  });
});
