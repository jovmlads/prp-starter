# Ticker Search Feature

## Overview

The AreaChartWidget now includes an autocomplete ticker search functionality that allows users to search for and select different cryptocurrencies to display on the chart.

## Features

### 🔍 Autocomplete Search

- Real-time search with autocomplete dropdown
- Search by cryptocurrency name, symbol, or ID
- Supports popular cryptocurrencies with fallback to full list

### 📊 Dynamic Chart Updates

- Chart automatically updates when a new ticker is selected
- Shows appropriate price formatting for different value ranges
- Maintains price change indicators and trend analysis

### 🎯 User Experience

- Built with shadcn/ui components for consistent design
- Responsive design with proper mobile support
- Loading states and error handling

## Usage

```tsx
import { AreaChartWidget } from '@/components/widgets/AreaChartWidget';

// Basic usage with default Bitcoin
<AreaChartWidget />

// With custom default ticker
<AreaChartWidget defaultTicker="ethereum" />

// With custom configuration
<AreaChartWidget
  defaultTicker="solana"
  height={400}
  refreshInterval={60000}
  className="custom-class"
/>
```

## Supported Cryptocurrencies

The widget supports popular cryptocurrencies including:

- Bitcoin (BTC)
- Ethereum (ETH)
- Binance Coin (BNB)
- Cardano (ADA)
- Solana (SOL)
- XRP (XRP)
- Dogecoin (DOGE)
- Polkadot (DOT)
- Avalanche (AVAX)
- Chainlink (LINK)
- Litecoin (LTC)
- Uniswap (UNI)

Plus access to 100+ additional cryptocurrencies from the CoinGecko API.

## Technical Details

### Components

- **TickerSearch**: Autocomplete search component using shadcn/ui Command
- **AreaChartWidget**: Main chart widget with integrated search
- **useChartData**: Hook for managing chart data with ticker support

### API Integration

- Uses CoinGecko API for both cryptocurrency list and price data
- Implements fallback data for offline/error scenarios
- Smart caching and error handling

### Price Formatting

- Automatic decimal place adjustment based on coin value
- Supports micro-cap coins with appropriate precision
- Currency formatting with proper locale support

## Props

### AreaChartWidgetProps

```tsx
interface AreaChartWidgetProps {
  className?: string;
  refreshInterval?: number; // Default: 300000 (5 minutes)
  height?: number; // Default: 300
  showGrid?: boolean; // Default: true
  showTooltip?: boolean; // Default: true
  defaultTicker?: string; // Default: 'bitcoin'
}
```

### TickerSearchProps

```tsx
interface TickerSearchProps {
  value?: string;
  onSelect: (tickerId: string) => void;
  className?: string;
}
```

## Data Flow

1. **Initialization**: Widget loads with default ticker (Bitcoin)
2. **Search**: User types in search box to filter cryptocurrencies
3. **Selection**: User selects a cryptocurrency from dropdown
4. **Update**: Chart data fetches new ticker data and updates display
5. **Refresh**: Periodic updates continue with selected ticker

## Error Handling

- Network failures fall back to mock data
- Invalid tickers default to Bitcoin
- Search failures show popular coins only
- Graceful degradation in all scenarios
