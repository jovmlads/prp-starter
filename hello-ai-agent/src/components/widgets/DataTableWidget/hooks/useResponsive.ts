/**
 * Responsive Design Hook for Data Table Widget
 *
 * Provides responsive breakpoint detection and responsive state management.
 * Ensures SSR compatibility and optimal performance.
 */

import { useState, useEffect, useMemo } from 'react';
import type {
  ResponsiveState,
  ResponsiveConfig,
  UseResponsiveReturn,
} from '../types';

// ================================
// Default Configuration
// ================================

const DEFAULT_RESPONSIVE_CONFIG: ResponsiveConfig = {
  mobileBreakpoint: 768,
  tabletBreakpoint: 1024,
  desktopBreakpoint: 1280,
  maxRows: 7,
};

// ================================
// Hook Implementation
// ================================

/**
 * Custom hook for responsive design management
 * CRITICAL: Uses useEffect with window.matchMedia for SSR compatibility
 */
export function useResponsive(
  config: Partial<ResponsiveConfig> = {}
): UseResponsiveReturn {
  const finalConfig = useMemo(
    () => ({ ...DEFAULT_RESPONSIVE_CONFIG, ...config }),
    [config]
  );

  // State for responsive breakpoints
  const [viewportWidth, setViewportWidth] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Update viewport width on resize
  useEffect(() => {
    // CRITICAL: Check if we're in browser environment for SSR compatibility
    if (typeof window === 'undefined') {
      return;
    }

    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth);
      setIsLoading(false);
    };

    // Set initial viewport width
    updateViewportWidth();

    // Listen for resize events
    window.addEventListener('resize', updateViewportWidth);

    return () => {
      window.removeEventListener('resize', updateViewportWidth);
    };
  }, []);

  // Calculate responsive state based on viewport width
  const responsive: ResponsiveState = useMemo(() => {
    const isMobile = viewportWidth < finalConfig.mobileBreakpoint;
    const isTablet =
      viewportWidth >= finalConfig.mobileBreakpoint &&
      viewportWidth < finalConfig.desktopBreakpoint;
    const isDesktop = viewportWidth >= finalConfig.desktopBreakpoint;

    // Compact layout for smaller screens
    const isCompact = viewportWidth < finalConfig.tabletBreakpoint;

    return {
      isMobile,
      isTablet,
      isDesktop,
      isCompact,
      viewportWidth,
    };
  }, [viewportWidth, finalConfig]);

  return {
    responsive,
    isLoading,
  };
}

// ================================
// Utility Hooks
// ================================

/**
 * Hook for media query matching
 * CRITICAL: SSR-safe media query hook
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // CRITICAL: Check for browser environment
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    const handleInitial = () => {
      setMatches(mediaQuery.matches);
      setIsLoading(false);
    };

    // Set initial value
    handleInitial();

    // Listen for changes
    if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
    } else {
      // Modern browsers
      mediaQuery.addEventListener('change', handleChange);
    }

    return () => {
      if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleChange);
      } else {
        mediaQuery.removeEventListener('change', handleChange);
      }
    };
  }, [query]);

  return isLoading ? false : matches;
}

/**
 * Hook for specific breakpoint detection
 */
export function useBreakpoint(
  breakpoint: 'mobile' | 'tablet' | 'desktop',
  config?: Partial<ResponsiveConfig>
) {
  const finalConfig = useMemo(
    () => ({ ...DEFAULT_RESPONSIVE_CONFIG, ...config }),
    [config]
  );

  const query = useMemo(() => {
    switch (breakpoint) {
      case 'mobile':
        return `(max-width: ${finalConfig.mobileBreakpoint - 1}px)`;
      case 'tablet':
        return `(min-width: ${finalConfig.mobileBreakpoint}px) and (max-width: ${finalConfig.desktopBreakpoint - 1}px)`;
      case 'desktop':
        return `(min-width: ${finalConfig.desktopBreakpoint}px)`;
      default:
        return '(min-width: 0px)';
    }
  }, [breakpoint, finalConfig]);

  return useMediaQuery(query);
}

/**
 * Hook for orientation detection
 */
export function useOrientation(): 'portrait' | 'landscape' | null {
  const [orientation, setOrientation] = useState<
    'portrait' | 'landscape' | null
  >(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const updateOrientation = () => {
      if (window.screen && window.screen.orientation) {
        setOrientation(
          window.screen.orientation.angle % 180 === 0 ? 'portrait' : 'landscape'
        );
      } else {
        // Fallback for older browsers
        setOrientation(
          window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
        );
      }
    };

    updateOrientation();

    window.addEventListener('orientationchange', updateOrientation);
    window.addEventListener('resize', updateOrientation);

    return () => {
      window.removeEventListener('orientationchange', updateOrientation);
      window.removeEventListener('resize', updateOrientation);
    };
  }, []);

  return orientation;
}

// ================================
// Responsive Utilities
// ================================

/**
 * Get responsive column configuration
 */
export function getResponsiveColumns(responsive: ResponsiveState) {
  if (responsive.isMobile) {
    return {
      showDate: true,
      showPrice: true,
      showChange: true,
      showVolume: false,
      showMarketCap: false,
      showSupply: false,
    };
  }

  if (responsive.isTablet) {
    return {
      showDate: true,
      showPrice: true,
      showChange: true,
      showVolume: true,
      showMarketCap: false,
      showSupply: false,
    };
  }

  // Desktop
  return {
    showDate: true,
    showPrice: true,
    showChange: true,
    showVolume: true,
    showMarketCap: true,
    showSupply: true,
  };
}

/**
 * Get responsive table classes
 */
export function getResponsiveTableClasses(responsive: ResponsiveState): string {
  const classes = ['data-table-widget'];

  if (responsive.isMobile) {
    classes.push('mobile-layout');
  } else if (responsive.isTablet) {
    classes.push('tablet-layout');
  } else {
    classes.push('desktop-layout');
  }

  if (responsive.isCompact) {
    classes.push('compact-layout');
  }

  return classes.join(' ');
}

/**
 * Get responsive font sizes
 */
export function getResponsiveFontSizes(responsive: ResponsiveState) {
  if (responsive.isMobile) {
    return {
      header: 'text-sm',
      body: 'text-xs',
      caption: 'text-xs',
    };
  }

  if (responsive.isTablet) {
    return {
      header: 'text-base',
      body: 'text-sm',
      caption: 'text-sm',
    };
  }

  // Desktop
  return {
    header: 'text-lg',
    body: 'text-base',
    caption: 'text-base',
  };
}

/**
 * Get responsive spacing
 */
export function getResponsiveSpacing(responsive: ResponsiveState) {
  if (responsive.isMobile) {
    return {
      padding: 'p-2',
      margin: 'm-1',
      gap: 'gap-2',
    };
  }

  if (responsive.isTablet) {
    return {
      padding: 'p-3',
      margin: 'm-2',
      gap: 'gap-3',
    };
  }

  // Desktop
  return {
    padding: 'p-4',
    margin: 'm-3',
    gap: 'gap-4',
  };
}

/**
 * Determine if touch device
 */
export function useTouchDevice(): boolean {
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          (navigator as any).msMaxTouchPoints > 0
      );
    };

    checkTouchDevice();
  }, []);

  return isTouchDevice;
}

/**
 * Get device pixel ratio
 */
export function useDevicePixelRatio(): number {
  const [pixelRatio, setPixelRatio] = useState<number>(1);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const updatePixelRatio = () => {
      setPixelRatio(window.devicePixelRatio || 1);
    };

    updatePixelRatio();

    // Listen for changes (rare but possible)
    window.addEventListener('resize', updatePixelRatio);

    return () => {
      window.removeEventListener('resize', updatePixelRatio);
    };
  }, []);

  return pixelRatio;
}
