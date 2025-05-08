/**
 * Utility for monitoring and reporting performance metrics
 */

// Store performance marks and measures
const performanceData: Record<string, number[]> = {}

/**
 * Start measuring a performance metric
 *
 * @param metricName Name of the metric to measure
 * @returns A function to stop the measurement
 */
export function startMeasure(metricName: string): () => void {
  const startTime = performance.now()

  return () => {
    const endTime = performance.now()
    const duration = endTime - startTime

    // Store the measurement
    if (!performanceData[metricName]) {
      performanceData[metricName] = []
    }

    performanceData[metricName].push(duration)

    // Log the measurement
    console.log(`[Performance] ${metricName}: ${Math.round(duration)}ms`)
  }
}

/**
 * Get statistics for a specific performance metric
 *
 * @param metricName Name of the metric
 * @returns Statistics object or null if no data
 */
export function getMetricStats(metricName: string): {
  avg: number
  min: number
  max: number
  count: number
} | null {
  const measurements = performanceData[metricName]
  if (!measurements || measurements.length === 0) {
    return null
  }

  const sum = measurements.reduce((acc, val) => acc + val, 0)
  const avg = sum / measurements.length
  const min = Math.min(...measurements)
  const max = Math.max(...measurements)

  return {
    avg: Math.round(avg),
    min: Math.round(min),
    max: Math.round(max),
    count: measurements.length,
  }
}

/**
 * Get all performance metrics
 *
 * @returns Object with all metrics and their statistics
 */
export function getAllMetrics(): Record<
  string,
  {
    avg: number
    min: number
    max: number
    count: number
  } | null
> {
  const result: Record<string, any> = {}

  Object.keys(performanceData).forEach((metricName) => {
    result[metricName] = getMetricStats(metricName)
  })

  return result
}

/**
 * Clear all performance data
 */
export function clearPerformanceData(): void {
  Object.keys(performanceData).forEach((key) => {
    delete performanceData[key]
  })
}

/**
 * Measure the performance of an async function
 *
 * @param metricName Name of the metric
 * @param fn Function to measure
 * @returns Result of the function
 */
export async function measureAsync<T>(metricName: string, fn: () => Promise<T>): Promise<T> {
  const stopMeasure = startMeasure(metricName)
  try {
    const result = await fn()
    stopMeasure()
    return result
  } catch (error) {
    stopMeasure()
    throw error
  }
}
