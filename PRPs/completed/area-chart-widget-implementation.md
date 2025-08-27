# Area Chart Widget - Implementation Guide (PRP)

## 🎯 Goal

Implement a full-width area chart widget using shadcn/ui components that displays real-time Bitcoin price data from CoinGecko API. The widget will be positioned below the existing DateWidget and TimeWidget on the home page, following the established project patterns and providing users with dynamic data visualization capabilities.

## 🏗️ Why

This implementation delivers on key business objectives:

- **Enhanced User Experience**: Beautiful gradient area chart adds visual appeal to dashboard
- **Data Integration**: Demonstrates real-time API consumption and data visualization
- **Component Reusability**: Creates extensible pattern for future chart widgets
- **Modern UI Standards**: Leverages shadcn/ui chart system with responsive design

## 📝 What - User Visible Behavior

### Core Features

1. **Visual Display**: Gradient-filled area chart showing Bitcoin price trend (7 days)
2. **Real-time Updates**: Chart data refreshes every 5 minutes automatically
3. **Interactive Elements**: Hover tooltips with price details and timestamp
4. **Responsive Design**: Adapts to mobile, tablet, and desktop screen sizes
5. **Loading States**: Smooth loading indicators during data fetching
6. **Error Handling**: Graceful fallback when API is unavailable

### Layout Integration

- Positioned below TimeWidget and DateWidget in grid layout
- Full container width on all screen sizes
- Height: 300px (desktop), 250px (tablet), 200px (mobile)
- Consistent styling with existing widget cards

## 🧠 All Needed Context

### Project Architecture Patterns

**File Structure (from existing widgets):**

```
src/components/widgets/
├── DateWidget/
│   ├── DateWidget.tsx          # Main component
│   ├── index.ts               # Barrel export
│   ├── types.ts               # TypeScript interfaces
│   └── utils.ts               # Helper functions
└── TimeWidget/
    ├── TimeWidget.tsx          # Main component
    ├── index.ts               # Barrel export
    └── types.ts               # TypeScript interfaces
```

**Component Pattern (from TimeWidget.tsx):**

```tsx
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

export function TimeWidget(
  {
    /* props */
  }
) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    // Setup and cleanup logic
  }, [dependencies]);

  const memoizedValue = useMemo(() => {
    // Expensive computations
  }, [dependencies]);

  return (
    <Card className="w-full max-w-sm transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-6">{/* Widget content */}</CardContent>
    </Card>
  );
}
```

### Technology Stack

- **React 19** with TypeScript and strict mode
- **shadcn/ui** components for consistent styling
- **Tailwind CSS** with HSL color variables
- **date-fns** for date formatting
- **Vitest** for unit testing
- **Path aliases**: `@/` maps to `./src/`

### Existing Dependencies (package.json)

```json
{
  "dependencies": {
    "react": "^19.1.1",
    "date-fns": "^4.1.0",
    "clsx": "^2.1.1",
    "class-variance-authority": "^0.7.1",
    "tailwind-merge": "^3.3.1"
  }
}
```

### Chart System Configuration

**Tailwind Chart Colors (already configured):**

```javascript
// tailwind.config.js
chart: {
  1: 'hsl(var(--chart-1))',
  2: 'hsl(var(--chart-2))',
  3: 'hsl(var(--chart-3))',
  4: 'hsl(var(--chart-4))',
  5: 'hsl(var(--chart-5))',
}
```

### API Documentation

**CoinGecko API Endpoint:**

```
GET https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7&interval=daily
```

**Response Structure:**

```json
{
  "prices": [[timestamp, price], [timestamp, price], ...],
  "market_caps": [[timestamp, cap], ...],
  "total_volumes": [[timestamp, volume], ...]
}
```

**Example Response:**

```json
{
  "prices": [
    [1703721600000, 42000.5],
    [1703808000000, 42500.75],
    [1703894400000, 41800.25]
  ]
}
```

### Chart Library Requirements

**Missing Dependencies to Install:**

```bash
npm install recharts
npm install @types/recharts
```

**shadcn/ui Chart Component:**

```bash
npx shadcn@latest add chart
```

### Home Page Integration (src/pages/home.tsx)

```tsx
// Current structure
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  <TimeWidget />
  <DateWidget />
</div>

// After implementation
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  <TimeWidget />
  <DateWidget />
</div>
{/* Full-width chart below */}
<div className="mt-6">
  <AreaChartWidget />
</div>
```

### Code Examples & Patterns

**React Hook Pattern (from DateWidget):**

```tsx
const [currentDate, setCurrentDate] = useState(new Date());

useEffect(() => {
  const scheduleUpdate = () => {
    const timer = setTimeout(() => {
      setCurrentDate(new Date());
      scheduleUpdate();
    }, interval);
    return timer;
  };

  const timer = scheduleUpdate();
  return () => clearTimeout(timer);
}, []);
```

**Memoization Pattern (from TimeWidget):**

```tsx
const formattedTime = useMemo(() => {
  return format(time, pattern);
}, [time, pattern]);
```

**Error Handling Pattern:**

```tsx
try {
  return format(currentDate, dateFormat);
} catch (error) {
  console.error("Date formatting error:", error);
  return currentDate.toLocaleDateString();
}
```

### Accessibility Requirements (from existing widgets)

```tsx
<Card
  className="w-full max-w-sm transition-all duration-200 hover:shadow-lg"
  role="region"
  aria-label="Current time and date"
>
```

### Testing Pattern (from project structure)

- Unit tests for components: `*.test.tsx`
- Hook tests: `hooks/*.test.ts`
- Vitest configuration with React Testing Library

## 🔨 Implementation Blueprint

### Phase 1: Setup & Dependencies (Level 1 - Foundation)

**Tasks:**

1. Install required dependencies
2. Add shadcn/ui chart component
3. Create basic component structure
4. Set up TypeScript interfaces

**Step 1.1: Install Dependencies**

```powershell
# Install chart dependencies
Set-Location "c:\Users\Mladen.DESKTOP-DBOOG3P\Documents\Development\MJ Playground\PRPs-agentic-eng\hello-ai-agent"
npm install recharts
npm install -D @types/recharts

# Add shadcn/ui chart component
npx shadcn@latest add chart
```

**Step 1.2: Create Component Structure**

```
src/components/widgets/AreaChartWidget/
├── AreaChartWidget.tsx          # Main component
├── index.ts                     # Barrel export
├── types.ts                     # TypeScript interfaces
├── hooks/
│   ├── useChartData.ts          # Data fetching hook
│   └── useChartData.test.ts     # Hook tests
├── services/
│   ├── chartDataApi.ts          # API service
│   └── chartDataApi.test.ts     # API tests
├── utils/
│   ├── chartHelpers.ts          # Utility functions
│   └── chartHelpers.test.ts     # Utils tests
└── AreaChartWidget.test.tsx     # Component tests
```

**Step 1.3: Create TypeScript Interfaces**

```typescript
// src/components/widgets/AreaChartWidget/types.ts
export interface ChartDataPoint {
  timestamp: number;
  value: number;
  formattedDate: string;
  formattedValue: string;
}

export interface ChartApiResponse {
  prices: [number, number][];
  market_caps?: [number, number][];
  total_volumes?: [number, number][];
}

export interface ChartData {
  data: ChartDataPoint[];
  metadata: {
    title: string;
    subtitle: string;
    currency: string;
    lastUpdated: string;
  };
}

export interface AreaChartWidgetProps {
  className?: string;
  refreshInterval?: number;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
}

export interface UseChartDataOptions {
  refreshInterval: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface ChartDataState {
  data: ChartData | null;
  isLoading: boolean;
  error: string | null;
  lastFetch: Date | null;
}
```

**Step 1.4: Create Basic Component Shell**

```tsx
// src/components/widgets/AreaChartWidget/AreaChartWidget.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChartWidgetProps } from "./types";

export function AreaChartWidget({
  className = "",
  refreshInterval = 300000, // 5 minutes
  height = 300,
  showGrid = true,
  showTooltip = true,
}: AreaChartWidgetProps) {
  return (
    <Card
      className={`w-full transition-all duration-200 hover:shadow-lg ${className}`}
    >
      <CardHeader>
        <CardTitle>Bitcoin Price Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height }} className="w-full">
          {/* Chart implementation will go here */}
          <p>Chart placeholder</p>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Step 1.5: Create Barrel Export**

```typescript
// src/components/widgets/AreaChartWidget/index.ts
export { AreaChartWidget } from "./AreaChartWidget";
export type { AreaChartWidgetProps, ChartDataPoint, ChartData } from "./types";
```

### Phase 2: API Integration (Level 2 - Core Logic)

**Step 2.1: Create API Service**

```typescript
// src/components/widgets/AreaChartWidget/services/chartDataApi.ts
import { ChartApiResponse, ChartData } from "../types";

const COINGECKO_API_URL =
  "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart";

export class ChartDataApiError extends Error {
  constructor(message: string, public status?: number, public cause?: Error) {
    super(message);
    this.name = "ChartDataApiError";
  }
}

export async function fetchBitcoinPriceData(
  days = 7
): Promise<ChartApiResponse> {
  const url = `${COINGECKO_API_URL}?vs_currency=usd&days=${days}&interval=daily`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new ChartDataApiError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    const data = await response.json();

    if (!data.prices || !Array.isArray(data.prices)) {
      throw new ChartDataApiError("Invalid API response format");
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ChartDataApiError) {
      throw error;
    }

    if (error.name === "AbortError") {
      throw new ChartDataApiError("Request timeout", 0, error);
    }

    throw new ChartDataApiError(
      "Network error occurred",
      0,
      error instanceof Error ? error : new Error(String(error))
    );
  }
}

export function generateMockData(): ChartApiResponse {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const basePrice = 42000;

  const prices: [number, number][] = [];

  for (let i = 6; i >= 0; i--) {
    const timestamp = now - i * oneDay;
    const variance = (Math.random() - 0.5) * 4000; // ±$2000 variance
    const price = basePrice + variance + Math.sin(i) * 1000;
    prices.push([timestamp, Math.round(price * 100) / 100]);
  }

  return { prices };
}
```

**Step 2.2: Create Data Transformation Utilities**

```typescript
// src/components/widgets/AreaChartWidget/utils/chartHelpers.ts
import { format } from "date-fns";
import { ChartApiResponse, ChartData, ChartDataPoint } from "../types";

export function transformApiData(apiResponse: ChartApiResponse): ChartData {
  const transformedData: ChartDataPoint[] = apiResponse.prices.map(
    ([timestamp, value]) => ({
      timestamp,
      value: Math.round(value * 100) / 100, // Round to 2 decimal places
      formattedDate: format(new Date(timestamp), "MMM dd"),
      formattedValue: formatCurrency(value),
    })
  );

  return {
    data: transformedData,
    metadata: {
      title: "Bitcoin Price (USD)",
      subtitle: "Last 7 days",
      currency: "USD",
      lastUpdated: new Date().toISOString(),
    },
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function calculatePriceChange(data: ChartDataPoint[]): {
  absolute: number;
  percentage: number;
  trend: "up" | "down" | "neutral";
} {
  if (data.length < 2) {
    return { absolute: 0, percentage: 0, trend: "neutral" };
  }

  const first = data[0].value;
  const last = data[data.length - 1].value;
  const absolute = last - first;
  const percentage = (absolute / first) * 100;

  return {
    absolute: Math.round(absolute * 100) / 100,
    percentage: Math.round(percentage * 100) / 100,
    trend: absolute > 0 ? "up" : absolute < 0 ? "down" : "neutral",
  };
}

export function getChartColors() {
  return {
    gradient: {
      from: "hsl(var(--chart-1))",
      to: "hsl(var(--chart-1) / 0.1)",
    },
    stroke: "hsl(var(--chart-1))",
    grid: "hsl(var(--border))",
    text: "hsl(var(--muted-foreground))",
  };
}
```

**Step 2.3: Create Data Fetching Hook**

```typescript
// src/components/widgets/AreaChartWidget/hooks/useChartData.ts
import { useState, useEffect, useCallback, useMemo } from "react";
import { ChartDataState, ChartData, UseChartDataOptions } from "../types";
import {
  fetchBitcoinPriceData,
  generateMockData,
  ChartDataApiError,
} from "../services/chartDataApi";
import { transformApiData } from "../utils/chartHelpers";

const DEFAULT_OPTIONS: UseChartDataOptions = {
  refreshInterval: 300000, // 5 minutes
  retryAttempts: 3,
  retryDelay: 2000, // 2 seconds
};

export function useChartData(options: Partial<UseChartDataOptions> = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options };

  const [state, setState] = useState<ChartDataState>({
    data: null,
    isLoading: true,
    error: null,
    lastFetch: null,
  });

  const fetchData = useCallback(
    async (attempt = 1): Promise<void> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const apiResponse = await fetchBitcoinPriceData();
        const transformedData = transformApiData(apiResponse);

        setState({
          data: transformedData,
          isLoading: false,
          error: null,
          lastFetch: new Date(),
        });
      } catch (error) {
        console.warn(`Chart data fetch attempt ${attempt} failed:`, error);

        if (attempt < config.retryAttempts) {
          // Retry with exponential backoff
          const delay = config.retryDelay * Math.pow(2, attempt - 1);
          setTimeout(() => fetchData(attempt + 1), delay);
          return;
        }

        // Use fallback data on final failure
        try {
          const fallbackResponse = generateMockData();
          const fallbackData = transformApiData(fallbackResponse);

          setState({
            data: fallbackData,
            isLoading: false,
            error: "Using demo data (API unavailable)",
            lastFetch: new Date(),
          });
        } catch (fallbackError) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error:
              error instanceof ChartDataApiError
                ? error.message
                : "Failed to load chart data",
          }));
        }
      }
    },
    [config.retryAttempts, config.retryDelay]
  );

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, config.refreshInterval);

    return () => clearInterval(interval);
  }, [fetchData, config.refreshInterval]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const memoizedState = useMemo(() => state, [state]);

  return {
    ...memoizedState,
    refetch,
  };
}
```

### Phase 3: Chart Implementation (Level 3 - UI & UX)

**Step 3.1: Install and Configure Chart Component**

```powershell
# Add shadcn chart component (if not already added)
Set-Location "c:\Users\Mladen.DESKTOP-DBOOG3P\Documents\Development\MJ Playground\PRPs-agentic-eng\hello-ai-agent"
npx shadcn@latest add chart
```

**Step 3.2: Implement Chart Component**

```tsx
// src/components/widgets/AreaChartWidget/AreaChartWidget.tsx
import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useChartData } from "./hooks/useChartData";
import { calculatePriceChange, getChartColors } from "./utils/chartHelpers";
import { AreaChartWidgetProps } from "./types";

const chartConfig = {
  value: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function AreaChartWidget({
  className = "",
  refreshInterval = 300000,
  height = 300,
  showGrid = true,
  showTooltip = true,
}: AreaChartWidgetProps) {
  const { data, isLoading, error, refetch } = useChartData({ refreshInterval });

  const { priceChange, trendIcon, trendColor } = useMemo(() => {
    if (!data?.data) {
      return { priceChange: null, trendIcon: null, trendColor: "" };
    }

    const change = calculatePriceChange(data.data);
    const icon =
      change.trend === "up"
        ? TrendingUp
        : change.trend === "down"
        ? TrendingDown
        : Minus;

    const color =
      change.trend === "up"
        ? "text-green-600"
        : change.trend === "down"
        ? "text-red-600"
        : "text-muted-foreground";

    return { priceChange: change, trendIcon: icon, trendColor: color };
  }, [data]);

  const chartColors = getChartColors();

  const gradientId = "areaGradient";

  if (error && !data) {
    return (
      <Card
        className={`w-full transition-all duration-200 hover:shadow-lg ${className}`}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Chart Unavailable
          </CardTitle>
          <CardDescription>Unable to load chart data: {error}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <button
              onClick={refetch}
              className="flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-accent"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`w-full transition-all duration-200 hover:shadow-lg ${className}`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {data?.metadata.title || "Bitcoin Price Chart"}
              {isLoading && (
                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </CardTitle>
            <CardDescription>
              {data?.metadata.subtitle || "Loading..."}
              {error && <span className="text-amber-600 ml-2">({error})</span>}
            </CardDescription>
          </div>
          {priceChange && (
            <div
              className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}
            >
              {trendIcon && <trendIcon className="h-4 w-4" />}
              <span>
                {priceChange.absolute > 0 ? "+" : ""}
                {priceChange.absolute.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
              <span className="text-muted-foreground">
                ({priceChange.percentage > 0 ? "+" : ""}
                {priceChange.percentage.toFixed(1)}%)
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ height }} className="w-full">
          {isLoading && !data ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2 text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Loading chart data...
              </div>
            </div>
          ) : (
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data?.data || []}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={chartColors.gradient.from}
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="100%"
                        stopColor={chartColors.gradient.from}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  {showGrid && (
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={chartColors.grid}
                      strokeOpacity={0.5}
                    />
                  )}
                  <XAxis
                    dataKey="formattedDate"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: chartColors.text }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: chartColors.text }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  {showTooltip && (
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelFormatter={(value) => `Date: ${value}`}
                          formatter={(value, name) => [
                            new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                            }).format(value as number),
                            name,
                          ]}
                        />
                      }
                    />
                  )}
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={chartColors.stroke}
                    strokeWidth={2}
                    fill={`url(#${gradientId})`}
                    connectNulls={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

**Step 3.3: Update Home Page**

```tsx
// Update src/pages/home.tsx
import { TimeWidget } from "../components/widgets/TimeWidget";
import { DateWidget } from "../components/widgets/DateWidget";
import { AreaChartWidget } from "../components/widgets/AreaChartWidget";

export default function Home() {
  return (
    <div className="max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to Hello AI Agent
          </h1>
          <p className="text-muted-foreground">
            A modern React application with beautiful widgets and data
            visualization.
          </p>
        </div>

        {/* Existing widgets */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <TimeWidget />
          <DateWidget />
        </div>

        {/* Full-width chart widget */}
        <div className="mt-6">
          <AreaChartWidget />
        </div>
      </div>
    </div>
  );
}
```

### Phase 4: Testing & Quality (Level 4 - Production Ready)

**Step 4.1: Unit Tests for API Service**

```typescript
// src/components/widgets/AreaChartWidget/services/chartDataApi.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchBitcoinPriceData,
  generateMockData,
  ChartDataApiError,
} from "./chartDataApi";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("chartDataApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe("fetchBitcoinPriceData", () => {
    it("should fetch data successfully", async () => {
      const mockData = {
        prices: [
          [1703721600000, 42000.5],
          [1703808000000, 42500.75],
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await fetchBitcoinPriceData();

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart"
        ),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
          headers: expect.objectContaining({
            Accept: "application/json",
          }),
        })
      );
    });

    it("should handle HTTP errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(fetchBitcoinPriceData()).rejects.toThrow(ChartDataApiError);
    });

    it("should handle network timeouts", async () => {
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(resolve, 15000); // Longer than 10s timeout
          })
      );

      const promise = fetchBitcoinPriceData();

      // Fast-forward past timeout
      vi.advanceTimersByTime(10000);

      await expect(promise).rejects.toThrow("Request timeout");
    });

    it("should validate API response format", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: "data" }),
      });

      await expect(fetchBitcoinPriceData()).rejects.toThrow(
        "Invalid API response format"
      );
    });
  });

  describe("generateMockData", () => {
    it("should generate valid mock data", () => {
      const mockData = generateMockData();

      expect(mockData).toHaveProperty("prices");
      expect(Array.isArray(mockData.prices)).toBe(true);
      expect(mockData.prices).toHaveLength(7);

      mockData.prices.forEach(([timestamp, price]) => {
        expect(typeof timestamp).toBe("number");
        expect(typeof price).toBe("number");
        expect(timestamp).toBeGreaterThan(0);
        expect(price).toBeGreaterThan(0);
      });
    });
  });
});
```

**Step 4.2: Unit Tests for Hook**

```typescript
// src/components/widgets/AreaChartWidget/hooks/useChartData.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useChartData } from "./useChartData";
import * as chartDataApi from "../services/chartDataApi";

vi.mock("../services/chartDataApi");

describe("useChartData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("should fetch data on mount", async () => {
    const mockApiData = {
      prices: [
        [1703721600000, 42000.5],
        [1703808000000, 42500.75],
      ],
    };

    vi.mocked(chartDataApi.fetchBitcoinPriceData).mockResolvedValue(
      mockApiData
    );

    const { result } = renderHook(() => useChartData());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeTruthy();
    expect(result.current.data?.data).toHaveLength(2);
    expect(result.current.error).toBe(null);
  });

  it("should handle API errors with fallback", async () => {
    const mockError = new chartDataApi.ChartDataApiError("API Error");
    vi.mocked(chartDataApi.fetchBitcoinPriceData).mockRejectedValue(mockError);

    const mockFallbackData = {
      prices: [
        [1703721600000, 40000],
        [1703808000000, 41000],
      ],
    };
    vi.mocked(chartDataApi.generateMockData).mockReturnValue(mockFallbackData);

    const { result } = renderHook(() => useChartData({ retryAttempts: 1 }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeTruthy();
    expect(result.current.error).toBe("Using demo data (API unavailable)");
  });

  it("should refetch data on interval", async () => {
    const mockApiData = {
      prices: [[1703721600000, 42000.5]],
    };

    vi.mocked(chartDataApi.fetchBitcoinPriceData).mockResolvedValue(
      mockApiData
    );

    const { result } = renderHook(() =>
      useChartData({ refreshInterval: 1000 })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(chartDataApi.fetchBitcoinPriceData).toHaveBeenCalledTimes(1);

    // Fast-forward time
    vi.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(chartDataApi.fetchBitcoinPriceData).toHaveBeenCalledTimes(2);
    });
  });
});
```

**Step 4.3: Component Tests**

```typescript
// src/components/widgets/AreaChartWidget/AreaChartWidget.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AreaChartWidget } from "./AreaChartWidget";
import * as useChartDataHook from "./hooks/useChartData";

vi.mock("./hooks/useChartData");

describe("AreaChartWidget", () => {
  const mockUseChartData = vi.mocked(useChartDataHook.useChartData);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading state", () => {
    mockUseChartData.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      lastFetch: null,
      refetch: vi.fn(),
    });

    render(<AreaChartWidget />);

    expect(screen.getByText("Loading chart data...")).toBeInTheDocument();
  });

  it("should render chart with data", () => {
    const mockData = {
      data: [
        {
          timestamp: 1703721600000,
          value: 42000.5,
          formattedDate: "Dec 27",
          formattedValue: "$42,001",
        },
      ],
      metadata: {
        title: "Bitcoin Price (USD)",
        subtitle: "Last 7 days",
        currency: "USD",
        lastUpdated: "2023-12-28T00:00:00.000Z",
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

    expect(screen.getByText("Bitcoin Price (USD)")).toBeInTheDocument();
    expect(screen.getByText("Last 7 days")).toBeInTheDocument();
  });

  it("should render error state with retry button", () => {
    const mockRefetch = vi.fn();

    mockUseChartData.mockReturnValue({
      data: null,
      isLoading: false,
      error: "Network error",
      lastFetch: null,
      refetch: mockRefetch,
    });

    render(<AreaChartWidget />);

    expect(screen.getByText("Chart Unavailable")).toBeInTheDocument();
    expect(
      screen.getByText("Unable to load chart data: Network error")
    ).toBeInTheDocument();

    const retryButton = screen.getByRole("button", { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
  });

  it("should show fallback data with warning", () => {
    const mockData = {
      data: [
        {
          timestamp: 1703721600000,
          value: 42000.5,
          formattedDate: "Dec 27",
          formattedValue: "$42,001",
        },
      ],
      metadata: {
        title: "Bitcoin Price (USD)",
        subtitle: "Last 7 days",
        currency: "USD",
        lastUpdated: "2023-12-28T00:00:00.000Z",
      },
    };

    mockUseChartData.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: "Using demo data (API unavailable)",
      lastFetch: new Date(),
      refetch: vi.fn(),
    });

    render(<AreaChartWidget />);

    expect(screen.getByText("Bitcoin Price (USD)")).toBeInTheDocument();
    expect(
      screen.getByText("(Using demo data (API unavailable))")
    ).toBeInTheDocument();
  });
});
```

**Step 4.4: E2E Tests**

```typescript
// tests/area-chart-widget.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Area Chart Widget", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display area chart widget on home page", async ({ page }) => {
    // Wait for chart to load
    await expect(
      page.locator('[data-testid="area-chart-widget"]')
    ).toBeVisible();

    // Check chart title
    await expect(page.locator("text=Bitcoin Price")).toBeVisible();

    // Check that chart content is rendered (SVG)
    await expect(page.locator("svg")).toBeVisible();
  });

  test("should show loading state initially", async ({ page }) => {
    // Look for loading indicator
    await expect(page.locator("text=Loading chart data")).toBeVisible();

    // Wait for loading to complete
    await expect(page.locator("text=Loading chart data")).not.toBeVisible({
      timeout: 10000,
    });
  });

  test("should show tooltips on hover", async ({ page }) => {
    // Wait for chart to be ready
    await page.waitForSelector("svg", { timeout: 10000 });

    // Hover over chart area
    const chartArea = page.locator("svg .recharts-area");
    await chartArea.hover();

    // Check for tooltip content
    await expect(page.locator('[role="tooltip"]')).toBeVisible();
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Chart should still be visible and properly sized
    const chartWidget = page.locator('[data-testid="area-chart-widget"]');
    await expect(chartWidget).toBeVisible();

    // Chart should not overflow container
    const boundingBox = await chartWidget.boundingBox();
    expect(boundingBox?.width).toBeLessThanOrEqual(375);
  });

  test("should handle API errors gracefully", async ({ page }) => {
    // Intercept API calls and return error
    await page.route("**/api.coingecko.com/**", (route) => {
      route.abort("failed");
    });

    await page.reload();

    // Should show demo data warning or error state
    await expect(
      page
        .locator("text=Using demo data")
        .or(page.locator("text=Chart Unavailable"))
    ).toBeVisible({ timeout: 15000 });
  });
});
```

## 🔄 Validation Loop

### Level 1: Syntax & Style Validation

```powershell
# Type checking
Set-Location "c:\Users\Mladen.DESKTOP-DBOOG3P\Documents\Development\MJ Playground\PRPs-agentic-eng\hello-ai-agent"
npm run build

# Linting
npm run lint

# Format check
npm run format
```

### Level 2: Unit Test Validation

```powershell
# Run all unit tests
npm run test

# Run with coverage
npm run test -- --coverage

# Run specific widget tests
npm run test -- AreaChartWidget
```

### Level 3: Integration & E2E Validation

```powershell
# Start development server
npm run dev

# In separate terminal, run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Level 4: Production Validation

```powershell
# Production build test
npm run build
npm run preview

# Performance audit (manual)
# Open browser dev tools and run Lighthouse audit
# Verify:
# - Performance score > 90
# - Accessibility score > 95
# - No console errors
# - Chart loads within 2 seconds

# Cross-browser testing (manual)
# Test in Chrome, Firefox, Safari, Edge
# Verify responsive behavior on mobile devices
```

## 🎯 Definition of Done Checklist

### ✅ Functional Requirements

- [ ] Area chart renders with gradient fill using shadcn/ui styling
- [ ] Chart positioned below TimeWidget and DateWidget with full container width
- [ ] Real-time data fetching from CoinGecko API every 5 minutes
- [ ] Responsive design: 300px (desktop), 250px (tablet), 200px (mobile)
- [ ] Loading states with spinner and "Loading chart data..." message
- [ ] Error handling with retry button and fallback to mock data
- [ ] Interactive tooltips showing formatted price and date on hover
- [ ] Price change indicator with trend arrow and percentage

### ✅ Quality Standards

- [ ] TypeScript strict mode compliance with no type errors
- [ ] ESLint passes with no warnings or errors
- [ ] 100% unit test coverage for new components (API service, hook, utilities)
- [ ] Integration tests for component rendering and interactions
- [ ] E2E tests for user workflows and responsive behavior
- [ ] Accessibility: ARIA labels, keyboard navigation, screen reader support
- [ ] Performance: Chart loads within 2 seconds, smooth animations

### ✅ Code Quality

- [ ] Component follows established widget patterns (Card wrapper, proper exports)
- [ ] Proper error boundaries and graceful degradation
- [ ] Memoization for expensive computations (price calculations, formatting)
- [ ] Clean separation of concerns (API service, business logic, UI components)
- [ ] Comprehensive JSDoc documentation for all public interfaces
- [ ] Consistent code style and naming conventions

### ✅ Production Readiness

- [ ] Production build completes successfully without warnings
- [ ] Bundle size impact analyzed and minimized (<50KB additional)
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness verified on multiple device sizes
- [ ] API error handling tested with network simulation
- [ ] Performance audit shows 90+ score on Lighthouse

### ✅ Integration & Documentation

- [ ] Home page updated to include new widget in proper layout
- [ ] Component properly exported and imported following project conventions
- [ ] README or component documentation updated with usage examples
- [ ] No breaking changes to existing functionality
- [ ] Git commits follow conventional commit format

## 🚀 Execution Commands

**Phase 1 - Foundation:**

```powershell
Set-Location "c:\Users\Mladen.DESKTOP-DBOOG3P\Documents\Development\MJ Playground\PRPs-agentic-eng\hello-ai-agent"
npm install recharts @types/recharts
npx shadcn@latest add chart
```

**Phase 2 - Development:**

```powershell
# Create component structure
New-Item -ItemType Directory -Path "src/components/widgets/AreaChartWidget" -Force
New-Item -ItemType Directory -Path "src/components/widgets/AreaChartWidget/hooks" -Force
New-Item -ItemType Directory -Path "src/components/widgets/AreaChartWidget/services" -Force
New-Item -ItemType Directory -Path "src/components/widgets/AreaChartWidget/utils" -Force

# Run development server
npm run dev
```

**Phase 3 - Testing:**

```powershell
# Run all tests
npm run test

# Run E2E tests
npm run test:e2e
```

**Phase 4 - Validation:**

```powershell
# Final build and validation
npm run build
npm run lint
npm run test -- --coverage
npm run test:e2e
```

---

**Implementation Status:** Ready for Execution  
**Estimated Time:** 6-8 hours  
**Dependencies:** All required packages available  
**Risk Level:** Low (well-defined patterns, reliable API)

This PRP provides comprehensive instructions for implementing the area chart widget following the established project patterns, with proper error handling, testing, and quality assurance measures.
