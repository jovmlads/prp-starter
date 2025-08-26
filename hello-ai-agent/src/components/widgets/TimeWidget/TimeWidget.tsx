import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { TimeWidgetProps } from './types';

export function TimeWidget({
  showSeconds = true,
  updateInterval = 1000,
}: TimeWidgetProps) {
  const [time, setTime] = useState(new Date());

  // Update time at specified interval
  useEffect(() => {
    setTime(new Date()); // Update immediately
    const timer = setInterval(() => {
      setTime(new Date());
    }, updateInterval);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [updateInterval]);

  // Memoize formatted time and date
  const formattedTime = useMemo(() => {
    const pattern = showSeconds ? 'HH:mm:ss' : 'HH:mm';
    return format(time, pattern);
  }, [time, showSeconds]);

  const formattedDate = useMemo(() => {
    return format(time, 'EEEE, MMMM d, yyyy');
  }, [time]);

  return (
    <Card
      className="w-full max-w-sm transition-all duration-200 hover:shadow-lg"
      role="region"
      aria-label="Current time and date"
    >
      <CardContent className="p-6">
        <div className="space-y-2 text-center">
          <div className="text-3xl font-medium text-foreground">
            {formattedTime}
          </div>
          <div className="text-sm text-muted-foreground">{formattedDate}</div>
        </div>
      </CardContent>
    </Card>
  );
}
