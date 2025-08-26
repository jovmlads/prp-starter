import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useChartData } from './hooks/useChartData';
import { calculatePriceChange, getChartColors } from './utils/chartHelpers';
import { AreaChartWidgetProps } from './types';
import { TickerSearch } from './components/TickerSearch';

const chartConfig = {
  value: {
    label: 'Price',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function AreaChartWidget({
  className = '',
  refreshInterval = 300000,
  height = 300,
  showGrid = true,
  showTooltip = true,
  defaultTicker = 'bitcoin',
}: AreaChartWidgetProps) {
  const [selectedTicker, setSelectedTicker] = useState(defaultTicker);
  const { data, isLoading, error, refetch } = useChartData({
    refreshInterval,
    ticker: selectedTicker,
  });

  const { priceChange, TrendIcon, trendColor } = useMemo(() => {
    if (!data?.data) {
      return { priceChange: null, TrendIcon: null, trendColor: '' };
    }

    const change = calculatePriceChange(data.data);
    const Icon =
      change.trend === 'up'
        ? TrendingUp
        : change.trend === 'down'
          ? TrendingDown
          : Minus;

    const color =
      change.trend === 'up'
        ? 'text-green-600'
        : change.trend === 'down'
          ? 'text-red-600'
          : 'text-muted-foreground';

    return { priceChange: change, TrendIcon: Icon, trendColor: color };
  }, [data]);

  const chartColors = getChartColors();
  const gradientId = 'areaGradient';

  const handleTickerSelect = (tickerId: string) => {
    setSelectedTicker(tickerId);
  };

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
          <div className="space-y-4">
            <TickerSearch
              value={selectedTicker}
              onSelect={handleTickerSelect}
            />
            <div className="flex items-center justify-center h-32">
              <button
                onClick={refetch}
                className="flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-accent"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`w-full max-w-full transition-all duration-200 hover:shadow-lg ${className}`}
    >
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <CardTitle className="flex items-center gap-2">
                {data?.metadata.title || 'Cryptocurrency Price Chart'}
                {isLoading && (
                  <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </CardTitle>
              <CardDescription>
                {data?.metadata.subtitle || 'Loading...'}
                {error && (
                  <span className="text-amber-600 ml-2">({error})</span>
                )}
              </CardDescription>
            </div>
            {priceChange && (
              <div
                className={`flex items-center gap-1 text-sm font-medium ${trendColor} flex-shrink-0`}
              >
                {TrendIcon && <TrendIcon className="h-4 w-4" />}
                <span>
                  {priceChange.absolute > 0 ? '+' : ''}
                  {priceChange.absolute.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-muted-foreground">
                  ({priceChange.percentage > 0 ? '+' : ''}
                  {priceChange.percentage.toFixed(1)}%)
                </span>
              </div>
            )}
          </div>

          {/* Ticker Search */}
          <div className="w-full max-w-md">
            <TickerSearch
              value={selectedTicker}
              onSelect={handleTickerSelect}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div
          style={{ height, width: '100%' }}
          className="relative chart-container"
        >
          {isLoading && !data ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2 text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Loading chart data...
              </div>
            </div>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="h-full w-full chart-container"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data?.data || []}
                  margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
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
                    tickFormatter={(value) => {
                      if (value < 1) {
                        return `$${value.toFixed(4)}`;
                      } else if (value < 1000) {
                        return `$${value.toFixed(0)}`;
                      } else {
                        return `$${(value / 1000).toFixed(0)}k`;
                      }
                    }}
                  />
                  {showTooltip && (
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelFormatter={(value) => `Date: ${value}`}
                          formatter={(value, name) => [
                            new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 6,
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
