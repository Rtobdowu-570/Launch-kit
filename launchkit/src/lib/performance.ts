/**
 * Performance monitoring and optimization utilities
 */

interface PerformanceMetric {
  name: string
  duration: number
  timestamp: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private timers: Map<string, number> = new Map()
  
  /**
   * Start timing an operation
   */
  startTimer(name: string): void {
    this.timers.set(name, Date.now())
  }
  
  /**
   * End timing an operation and record the metric
   */
  endTimer(name: string): number | null {
    const startTime = this.timers.get(name)
    if (!startTime) {
      console.warn(`Timer "${name}" was not started`)
      return null
    }
    
    const duration = Date.now() - startTime
    this.timers.delete(name)
    
    this.metrics.push({
      name,
      duration,
      timestamp: Date.now()
    })
    
    // Log slow operations (> 1 second)
    if (duration > 1000) {
      console.warn(`Slow operation detected: ${name} took ${duration}ms`)
    }
    
    return duration
  }
  
  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }
  
  /**
   * Get metrics for a specific operation
   */
  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(m => m.name === name)
  }
  
  /**
   * Get average duration for an operation
   */
  getAverageDuration(name: string): number {
    const metrics = this.getMetricsByName(name)
    if (metrics.length === 0) return 0
    
    const total = metrics.reduce((sum, m) => sum + m.duration, 0)
    return total / metrics.length
  }
  
  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = []
  }
  
  /**
   * Clear old metrics (older than specified time)
   */
  clearOldMetrics(maxAgeMs: number = 3600000): void {
    const cutoff = Date.now() - maxAgeMs
    this.metrics = this.metrics.filter(m => m.timestamp > cutoff)
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

/**
 * Decorator for timing async functions
 */
export function timed(name?: string) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value
    const timerName = name || `${target?.constructor?.name}.${propertyKey}`
    
    descriptor.value = async function (...args: unknown[]) {
      performanceMonitor.startTimer(timerName)
      try {
        const result = await originalMethod.apply(this, args)
        return result
      } finally {
        performanceMonitor.endTimer(timerName)
      }
    }
    
    return descriptor
  }
}

/**
 * Measure the performance of a function
 */
export async function measurePerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  performanceMonitor.startTimer(name)
  try {
    return await fn()
  } finally {
    performanceMonitor.endTimer(name)
  }
}

/**
 * Debounce function to limit execution rate
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function to limit execution frequency
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Memoize function results
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  func: T
): T {
  const cache = new Map<string, ReturnType<T>>()
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = func(...args) as ReturnType<T>
    cache.set(key, result)
    
    return result
  }) as T
}

/**
 * Lazy load a module
 */
export async function lazyLoad<T>(
  importFn: () => Promise<{ default: T }>
): Promise<T> {
  const loadedModule = await importFn()
  return loadedModule.default
}

/**
 * Check if code is running on the client side
 */
export function isClient(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Check if code is running on the server side
 */
export function isServer(): boolean {
  return typeof window === 'undefined'
}

/**
 * Get Web Vitals metrics (client-side only)
 */
export function reportWebVitals(metric: {
  id: string
  name: string
  value: number
  label: string
}): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric)
  }
  
  // Send to analytics service in production
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to analytics service
    // Example: sendToAnalytics(metric)
  }
}

/**
 * Optimize images by lazy loading
 */
export function lazyLoadImages(): void {
  if (!isClient()) return
  
  const images = document.querySelectorAll('img[data-src]')
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        const src = img.getAttribute('data-src')
        if (src) {
          img.src = src
          img.removeAttribute('data-src')
          imageObserver.unobserve(img)
        }
      }
    })
  })
  
  images.forEach((img) => imageObserver.observe(img))
}
