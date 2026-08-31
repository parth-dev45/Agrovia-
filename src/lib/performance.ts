// Performance utilities for rural network optimization

export interface NetworkInfo {
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export const getNetworkInfo = (): NetworkInfo | null => {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  if (!connection) return null;
  
  return {
    effectiveType: connection.effectiveType || '4g',
    downlink: connection.downlink || 10,
    rtt: connection.rtt || 100,
    saveData: connection.saveData || false
  };
};

export const isSlowNetwork = (): boolean => {
  const networkInfo = getNetworkInfo();
  if (!networkInfo) return false;
  
  return networkInfo.effectiveType === '2g' || 
         networkInfo.effectiveType === 'slow-2g' ||
         networkInfo.downlink < 1.5 ||
         networkInfo.saveData;
};

export const shouldUseWebGL = (): boolean => {
  // Check WebGL support
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  
  if (!gl) return false;
  
  // Check if network is too slow for WebGL animations
  if (isSlowNetwork()) return false;
  
  // Check device capabilities
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
  
  // Disable WebGL on low-end mobile devices
  if (isMobile && isLowEndDevice) return false;
  
  return true;
};

export const getOptimalImageFormat = (): 'avif' | 'webp' | 'jpg' => {
  // Check AVIF support
  const avifSupport = document.createElement('canvas').toDataURL('image/avif').indexOf('data:image/avif') === 0;
  if (avifSupport && !isSlowNetwork()) return 'avif';
  
  // Check WebP support
  const webpSupport = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
  if (webpSupport) return 'webp';
  
  return 'jpg';
};

export const getOptimalImageQuality = (): number => {
  const networkInfo = getNetworkInfo();
  
  if (!networkInfo) return 75;
  
  switch (networkInfo.effectiveType) {
    case 'slow-2g':
    case '2g':
      return 40;
    case '3g':
      return 60;
    case '4g':
    default:
      return 75;
  }
};

export const shouldPreloadImages = (): boolean => {
  return !isSlowNetwork() && !getNetworkInfo()?.saveData;
};

export const getOptimalBundleStrategy = () => {
  const isSlowNet = isSlowNetwork();
  
  return {
    shouldCodeSplit: !isSlowNet, // Avoid code splitting on slow networks to reduce requests
    shouldPreloadRoutes: !isSlowNet,
    shouldUseServiceWorker: true, // Always use for offline capability
    maxInitialBundleSize: isSlowNet ? 150 : 300, // KB
    shouldInlineCSS: isSlowNet, // Inline critical CSS on slow networks
  };
};

// Language detection for rural users
export const detectPreferredLanguage = (): string => {
  // Check URL parameters first
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  if (langParam) return langParam;
  
  // Check localStorage
  const savedLang = localStorage.getItem('preferred-language');
  if (savedLang) return savedLang;
  
  // Check browser language
  const browserLang = navigator.language || (navigator as any).userLanguage;
  
  // Map browser languages to supported languages
  const langMap: Record<string, string> = {
    'hi': 'hindi',
    'hi-IN': 'hindi',
    'mr': 'marathi',
    'mr-IN': 'marathi',
    'ta': 'tamil',
    'ta-IN': 'tamil',
    'te': 'telugu',
    'te-IN': 'telugu',
    'pa': 'punjabi',
    'pa-IN': 'punjabi',
    'gu': 'gujarati',
    'gu-IN': 'gujarati',
    'bn': 'bengali',
    'bn-IN': 'bengali',
  };
  
  return langMap[browserLang] || 'english';
};

// Device capability detection
export const getDeviceCapabilities = () => {
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
  const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
  const hasTouch = 'ontouchstart' in window;
  const screenSize = {
    width: window.screen.width,
    height: window.screen.height
  };
  
  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    isLowEndDevice,
    hasTouch,
    screenSize,
    pixelRatio: window.devicePixelRatio || 1,
    memoryInfo: (performance as any).memory ? {
      used: (performance as any).memory.usedJSHeapSize,
      total: (performance as any).memory.totalJSHeapSize,
      limit: (performance as any).memory.jsHeapSizeLimit
    } : null
  };
};

// Accessibility helpers for rural users
export const getAccessibilityPreferences = () => {
  return {
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
    prefersLargeText: window.matchMedia('(prefers-font-size: large)').matches,
    prefersDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  };
};

// Performance monitoring
export const measurePerformance = () => {
  if (!('performance' in window)) return null;
  
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  return {
    // Core Web Vitals
    FCP: navigation.responseStart - navigation.fetchStart, // First Contentful Paint approximation
    LCP: 0, // Would need to be measured separately
    FID: 0, // Would need to be measured separately
    CLS: 0, // Would need to be measured separately
    
    // Network timing
    DNS: navigation.domainLookupEnd - navigation.domainLookupStart,
    TCP: navigation.connectEnd - navigation.connectStart,
    TLS: navigation.secureConnectionStart ? navigation.connectEnd - navigation.secureConnectionStart : 0,
    TTFB: navigation.responseStart - navigation.requestStart,
    
    // Page load timing
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    
    // Resource timing
    totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
  };
};

export default {
  getNetworkInfo,
  isSlowNetwork,
  shouldUseWebGL,
  getOptimalImageFormat,
  getOptimalImageQuality,
  shouldPreloadImages,
  getOptimalBundleStrategy,
  detectPreferredLanguage,
  getDeviceCapabilities,
  getAccessibilityPreferences,
  measurePerformance
};