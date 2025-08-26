import { describe, it, expect } from 'vitest';
import {
  transformApiData,
  formatCurrency,
  calculatePriceChange,
  getChartColors,
} from './chartHelpers';
import { ChartApiResponse } from '../types';

describe('chartHelpers', () => {
  describe('transformApiData', () => {
    it('should transform API response correctly', () => {
      const apiResponse: ChartApiResponse = {
        prices: [
          [1703721600000, 42000.5],
          [1703808000000, 42500.75],
        ],
      };

      const result = transformApiData(apiResponse);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('metadata');
      expect(result.data).toHaveLength(2);

      const firstPoint = result.data[0];
      expect(firstPoint).toHaveProperty('timestamp', 1703721600000);
      expect(firstPoint).toHaveProperty('value', 42000.5);
      expect(firstPoint).toHaveProperty('formattedDate');
      expect(firstPoint).toHaveProperty('formattedValue');

      expect(result.metadata.title).toBe('Bitcoin Price (USD)');
      expect(result.metadata.subtitle).toBe('Last 7 days');
      expect(result.metadata.currency).toBe('USD');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(42000.5)).toBe('$42,001');
      expect(formatCurrency(1000)).toBe('$1,000');
      expect(formatCurrency(999.99)).toBe('$1,000');
    });
  });

  describe('calculatePriceChange', () => {
    it('should calculate positive price change', () => {
      const data = [
        {
          timestamp: 1,
          value: 40000,
          formattedDate: 'Jan 01',
          formattedValue: '$40,000',
        },
        {
          timestamp: 2,
          value: 42000,
          formattedDate: 'Jan 02',
          formattedValue: '$42,000',
        },
      ];

      const result = calculatePriceChange(data);

      expect(result.absolute).toBe(2000);
      expect(result.percentage).toBe(5);
      expect(result.trend).toBe('up');
    });

    it('should calculate negative price change', () => {
      const data = [
        {
          timestamp: 1,
          value: 42000,
          formattedDate: 'Jan 01',
          formattedValue: '$42,000',
        },
        {
          timestamp: 2,
          value: 40000,
          formattedDate: 'Jan 02',
          formattedValue: '$40,000',
        },
      ];

      const result = calculatePriceChange(data);

      expect(result.absolute).toBe(-2000);
      expect(result.percentage).toBe(-4.76);
      expect(result.trend).toBe('down');
    });

    it('should handle neutral price change', () => {
      const data = [
        {
          timestamp: 1,
          value: 42000,
          formattedDate: 'Jan 01',
          formattedValue: '$42,000',
        },
        {
          timestamp: 2,
          value: 42000,
          formattedDate: 'Jan 02',
          formattedValue: '$42,000',
        },
      ];

      const result = calculatePriceChange(data);

      expect(result.absolute).toBe(0);
      expect(result.percentage).toBe(0);
      expect(result.trend).toBe('neutral');
    });

    it('should handle insufficient data', () => {
      const data = [
        {
          timestamp: 1,
          value: 42000,
          formattedDate: 'Jan 01',
          formattedValue: '$42,000',
        },
      ];

      const result = calculatePriceChange(data);

      expect(result.absolute).toBe(0);
      expect(result.percentage).toBe(0);
      expect(result.trend).toBe('neutral');
    });
  });

  describe('getChartColors', () => {
    it('should return chart color configuration', () => {
      const colors = getChartColors();

      expect(colors).toHaveProperty('gradient');
      expect(colors).toHaveProperty('stroke');
      expect(colors).toHaveProperty('grid');
      expect(colors).toHaveProperty('text');

      expect(colors.gradient).toHaveProperty('from');
      expect(colors.gradient).toHaveProperty('to');
    });
  });
});
