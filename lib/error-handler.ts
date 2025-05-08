// Global error tracking
const errorTracker = {
  errors: [] as Array<{
    message: string
    timestamp: Date
    componentStack?: string
    url?: string
  }>,
  maxErrors: 50,
}

/**
 * Logs an error to the console and to our error tracker
 */
export function logError(error: Error, componentStack?: string) {
  console.error("Application error:", error)

  // Add to our error tracker
  errorTracker.errors.push({
    message: error.message,
    timestamp: new Date(),
    componentStack,
    url: typeof window !== "undefined" ? window.location.href : undefined,
  })

  // Keep only the most recent errors
  if (errorTracker.errors.length > errorTracker.maxErrors) {
    errorTracker.errors = errorTracker.errors.slice(-errorTracker.maxErrors)
  }
}

/**
 * Gets all tracked errors
 */
export function getTrackedErrors() {
  return [...errorTracker.errors]
}

/**
 * Clears all tracked errors
 */
export function clearTrackedErrors() {
  errorTracker.errors = []
}

/**
 * Sets up global error handling
 */
export function setupGlobalErrorHandling() {
  if (typeof window !== "undefined") {
    // Handle uncaught errors
    window.addEventListener("error", (event) => {
      logError(event.error || new Error(event.message))
      // Don't prevent default so the browser can still handle the error
    })

    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason))
      logError(error)
    })

    console.log("Global error handling initialized")
  }
}
