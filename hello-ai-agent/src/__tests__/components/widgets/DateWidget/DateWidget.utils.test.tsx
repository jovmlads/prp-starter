/**
 * @fileoverview Tests for DateWidget utility functions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  calculateMidnight,
  formatDate,
  calculateTimeUntil,
  isValidFormatPattern,
} from '../../../../components/widgets/DateWidget/utils';

describe('DateWidget Utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('calculateMidnight', () => {
    it('calculates correct milliseconds until midnight', () => {
      // Set current time to 2:30 PM on August 26, 2025
      const mockDate = new Date('2025-08-26T14:30:00.000Z');
      vi.setSystemTime(mockDate);

      const msUntilMidnight = calculateMidnight();

      // Should be approximately 9.5 hours (9.5 * 60 * 60 * 1000 = 34,200,000 ms)
      const expected = 9.5 * 60 * 60 * 1000;
      expect(msUntilMidnight).toBeCloseTo(expected, -3); // Allow 1000ms tolerance
    });

    it('handles edge case when called at midnight', () => {
      // Set current time to exactly midnight
      const mockDate = new Date('2025-08-26T00:00:00.000Z');
      vi.setSystemTime(mockDate);

      const msUntilMidnight = calculateMidnight();

      // Should be exactly 24 hours until next midnight
      const expected = 24 * 60 * 60 * 1000;
      expect(msUntilMidnight).toBe(expected);
    });

    it('handles edge case when called just before midnight', () => {
      // Set current time to 11:59:59 PM
      const mockDate = new Date('2025-08-26T23:59:59.000Z');
      vi.setSystemTime(mockDate);

      const msUntilMidnight = calculateMidnight();

      // Should be exactly 1 second until midnight
      expect(msUntilMidnight).toBe(1000);
    });

    it('returns positive value regardless of current time', () => {
      const testTimes = [
        '2025-08-26T06:00:00.000Z', // 6 AM
        '2025-08-26T12:00:00.000Z', // Noon
        '2025-08-26T18:00:00.000Z', // 6 PM
        '2025-08-26T23:30:00.000Z', // 11:30 PM
      ];

      testTimes.forEach((timeString) => {
        vi.setSystemTime(new Date(timeString));
        const result = calculateMidnight();
        expect(result).toBeGreaterThan(0);
        expect(result).toBeLessThanOrEqual(24 * 60 * 60 * 1000); // Max 24 hours
      });
    });
  });

  describe('formatDate', () => {
    it('formats date with valid pattern correctly', () => {
      const testDate = new Date('2025-08-26T14:30:00.000Z');

      // Note: This test will use the actual date-fns format function
      // Results may vary based on timezone
      const result = formatDate(testDate, 'yyyy-MM-dd');
      expect(result).toMatch(/\d{4}-\d{2}-\d{2}/);
    });

    it('handles invalid date gracefully', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const invalidDate = new Date('invalid');
      const result = formatDate(invalidDate, 'yyyy-MM-dd');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Date formatting error:',
        expect.any(Error)
      );
      expect(result).toBe('Invalid Date'); // Fallback from toLocaleDateString()

      consoleSpy.mockRestore();
    });

    it('handles empty format pattern gracefully', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const testDate = new Date('2025-08-26T14:30:00.000Z');
      const result = formatDate(testDate, '');

      expect(consoleSpy).toHaveBeenCalledWith(
        'Date formatting error:',
        expect.any(Error)
      );
      expect(typeof result).toBe('string');

      consoleSpy.mockRestore();
    });

    it('handles malformed format pattern gracefully', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const testDate = new Date('2025-08-26T14:30:00.000Z');
      const result = formatDate(testDate, 'invalid-pattern-xyz');

      expect(consoleSpy).toHaveBeenCalled();
      expect(typeof result).toBe('string'); // Should return fallback string

      consoleSpy.mockRestore();
    });
  });

  describe('calculateTimeUntil', () => {
    it('calculates correct time until target hour today', () => {
      // Set current time to 10:00 AM
      const mockDate = new Date('2025-08-26T10:00:00.000Z');
      vi.setSystemTime(mockDate);

      // Calculate time until 3:00 PM (15:00)
      const msUntil3PM = calculateTimeUntil(15, 0);

      // Should be 5 hours (5 * 60 * 60 * 1000 = 18,000,000 ms)
      const expected = 5 * 60 * 60 * 1000;
      expect(msUntil3PM).toBe(expected);
    });

    it('calculates correct time until target hour tomorrow when time has passed', () => {
      // Set current time to 10:00 AM
      const mockDate = new Date('2025-08-26T10:00:00.000Z');
      vi.setSystemTime(mockDate);

      // Calculate time until 6:00 AM (already passed today)
      const msUntil6AM = calculateTimeUntil(6, 0);

      // Should be 20 hours until 6 AM tomorrow (20 * 60 * 60 * 1000 = 72,000,000 ms)
      const expected = 20 * 60 * 60 * 1000;
      expect(msUntil6AM).toBe(expected);
    });

    it('handles minutes parameter correctly', () => {
      // Set current time to 10:00 AM
      const mockDate = new Date('2025-08-26T10:00:00.000Z');
      vi.setSystemTime(mockDate);

      // Calculate time until 10:30 AM (30 minutes)
      const msUntil1030AM = calculateTimeUntil(10, 30);

      // Should be 30 minutes (30 * 60 * 1000 = 1,800,000 ms)
      const expected = 30 * 60 * 1000;
      expect(msUntil1030AM).toBe(expected);
    });

    it('defaults minutes to 0 when not provided', () => {
      // Set current time to 10:30 AM
      const mockDate = new Date('2025-08-26T10:30:00.000Z');
      vi.setSystemTime(mockDate);

      // Calculate time until 15:00 (3 PM)
      const msUntil3PM = calculateTimeUntil(15);

      // Should be 4.5 hours (4.5 * 60 * 60 * 1000 = 16,200,000 ms)
      const expected = 4.5 * 60 * 60 * 1000;
      expect(msUntil3PM).toBe(expected);
    });
  });

  describe('isValidFormatPattern', () => {
    it('returns true for valid date-fns format patterns', () => {
      const validPatterns = [
        'yyyy-MM-dd',
        'EEEE, MMMM d, yyyy',
        'MM/dd/yyyy',
        'dd.MM.yyyy',
        'HH:mm:ss',
        'MMM d, yyyy',
      ];

      validPatterns.forEach((pattern) => {
        expect(isValidFormatPattern(pattern)).toBe(true);
      });
    });

    it('returns false for invalid format patterns', () => {
      const invalidPatterns = [
        'invalid-pattern',
        'xyz123',
        '',
        'random text',
        '+++invalid+++',
      ];

      invalidPatterns.forEach((pattern) => {
        expect(isValidFormatPattern(pattern)).toBe(false);
      });
    });

    it('handles edge cases gracefully', () => {
      expect(isValidFormatPattern(' ')).toBe(false); // Whitespace only
      expect(isValidFormatPattern('  yyyy-MM-dd  ')).toBe(true); // With surrounding whitespace
    });
  });

  describe('Integration Tests', () => {
    it('calculateMidnight works with formatDate for day transitions', () => {
      // Set time to just before midnight
      const beforeMidnight = new Date('2025-08-26T23:59:59.000Z');
      vi.setSystemTime(beforeMidnight);

      const msUntilMidnight = calculateMidnight();
      expect(msUntilMidnight).toBe(1000); // 1 second

      // Format current date
      const beforeFormat = formatDate(beforeMidnight, 'yyyy-MM-dd');

      // Advance time past midnight
      vi.advanceTimersByTime(msUntilMidnight + 1000);
      const afterMidnight = new Date();

      const afterFormat = formatDate(afterMidnight, 'yyyy-MM-dd');

      // Dates should be different (next day)
      expect(beforeFormat).not.toBe(afterFormat);
    });
  });
});
