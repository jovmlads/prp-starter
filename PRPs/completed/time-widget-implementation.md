# Time Widget Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing the time widget feature using Material-UI Card component. The implementation follows the requirements specified in `PRPs/time-widget-prd.md`.

## Prerequisites

1. Install required packages:

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled date-fns
```

## Implementation Steps

### Step 1: Create Component Structure

1. Create the following directory structure:

```
src/
  components/
    widgets/
      TimeWidget/
        index.ts
        TimeWidget.tsx
        types.ts
        TimeWidget.test.tsx
```

2. Create `types.ts`:

```typescript
export interface TimeWidgetProps {
  /** Whether to show seconds in the time display */
  showSeconds?: boolean;
  /** Milliseconds between updates (default: 1000) */
  updateInterval?: number;
}
```

3. Create `index.ts`:

```typescript
export * from "./TimeWidget";
export * from "./types";
```

### Step 2: Implement TimeWidget Component

Create `TimeWidget.tsx`:

```typescript
import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { format } from "date-fns";
import { TimeWidgetProps } from "./types";

export function TimeWidget({
  showSeconds = true,
  updateInterval = 1000,
}: TimeWidgetProps) {
  const [time, setTime] = useState(new Date());

  // Update time at specified interval
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, updateInterval);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [updateInterval]);

  // Memoize formatted time and date
  const formattedTime = useMemo(() => {
    const pattern = showSeconds ? "HH:mm:ss" : "HH:mm";
    return format(time, pattern);
  }, [time, showSeconds]);

  const formattedDate = useMemo(() => {
    return format(time, "EEEE, MMMM d, yyyy");
  }, [time]);

  return (
    <Card elevation={2}>
      <CardContent className="space-y-2">
        <Typography variant="h3" component="div" className="font-medium">
          {formattedTime}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {formattedDate}
        </Typography>
      </CardContent>
    </Card>
  );
}
```

### Step 3: Add Unit Tests

Create `TimeWidget.test.tsx`:

```typescript
import { render, screen } from "@testing-library/react";
import { TimeWidget } from "./TimeWidget";
import { format } from "date-fns";

describe("TimeWidget", () => {
  beforeEach(() => {
    // Mock date-fns to return consistent date/time for testing
    jest.useFakeTimers();
    const mockDate = new Date("2025-08-26T12:34:56");
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders time and date correctly", () => {
    render(<TimeWidget />);

    // Check time format (HH:mm:ss)
    expect(screen.getByText("12:34:56")).toBeInTheDocument();

    // Check date format
    expect(screen.getByText("Tuesday, August 26, 2025")).toBeInTheDocument();
  });

  it("updates time at specified interval", () => {
    render(<TimeWidget updateInterval={1000} />);

    // Initial time
    expect(screen.getByText("12:34:56")).toBeInTheDocument();

    // Advance timer by 1 second
    jest.advanceTimersByTime(1000);

    // Should show updated time
    expect(screen.getByText("12:34:57")).toBeInTheDocument();
  });

  it("respects showSeconds prop", () => {
    render(<TimeWidget showSeconds={false} />);

    // Should only show hours and minutes
    expect(screen.getByText("12:34")).toBeInTheDocument();
    expect(screen.queryByText("12:34:56")).not.toBeInTheDocument();
  });
});
```

### Step 4: Add Widget to Home Page

1. Locate the home page component (e.g., `src/pages/Home.tsx`)
2. Import and add the TimeWidget:

```typescript
import { TimeWidget } from "@/components/widgets/TimeWidget";

export function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Welcome to the application!
      </h1>

      <div className="max-w-sm">
        <TimeWidget />
      </div>
    </div>
  );
}
```

### Step 5: Quality Checks

1. **Type Check**

```bash
npm run type-check
```

2. **Lint**

```bash
npm run lint
```

3. **Unit Tests**

```bash
npm run test
```

4. **Visual Testing**

- Check widget appearance in both light and dark themes
- Verify responsive behavior on different screen sizes
- Ensure smooth time updates without UI jank

### Step 6: Performance Optimization

1. **Verify React DevTools**

- Check that unnecessary re-renders are not occurring
- Confirm useCallback and useMemo are working as intended

2. **Bundle Size**

```bash
npm run build
```

- Review bundle size impact of date-fns import
- Consider using dynamic imports if needed

### Step 7: Accessibility

1. Add ARIA attributes to improve screen reader experience:

```typescript
<Card
  elevation={2}
  role="region"
  aria-label="Current time and date"
>
```

2. Verify color contrast meets WCAG standards
3. Test with screen readers

## Validation Checklist

### Functionality

- [ ] Time updates every second (or as specified)
- [ ] Date is correctly formatted
- [ ] Props work as documented
- [ ] Cleanup on unmount works properly

### Visual Design

- [ ] Matches Material-UI Card design
- [ ] Typography scales appropriately
- [ ] Spacing is consistent
- [ ] Dark theme support works

### Performance

- [ ] No visible performance impact
- [ ] Memory usage is stable
- [ ] Bundle size is acceptable

### Accessibility

- [ ] Screen reader friendly
- [ ] Proper ARIA attributes
- [ ] Sufficient color contrast
- [ ] Keyboard navigation support

## Troubleshooting

### Common Issues

1. **Time Updates Lag**

- Check updateInterval prop value
- Verify interval cleanup is working
- Consider using requestAnimationFrame for smoother updates

2. **Memory Leaks**

- Ensure useEffect cleanup runs
- Check React DevTools for warning messages
- Monitor memory usage during extended runtime

3. **Bundle Size**

- Use specific imports from date-fns
- Consider code splitting if needed
- Review MUI component imports

## Future Enhancements

1. **Additional Features**

- Add timezone support
- Include 12/24 hour format toggle
- Add analog clock view option

2. **Performance**

- Implement worker for time calculations
- Add virtualization for multiple instances
- Optimize date-fns imports

## References

1. Material-UI Card Documentation:
   https://mui.com/material-ui/react-card/

2. date-fns Documentation:
   https://date-fns.org/docs/

3. React Performance Optimization:
   https://react.dev/learn/render-and-commit
