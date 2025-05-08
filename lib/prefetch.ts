import { getUserActivities, getUserGoals } from "@/lib/auth"

/**
 * Prefetches essential user data needed for the homepage
 * to minimize loading times after login
 *
 * @param userId The ID of the logged-in user
 * @returns A promise that resolves when all data is prefetched
 */
export async function prefetchUserData(userId: string): Promise<void> {
  try {
    // Start performance measurement
    const startTime = performance.now()

    // Create an array of promises for parallel data fetching
    const fetchPromises = [
      // Prefetch user activities
      new Promise<void>((resolve) => {
        getUserActivities(userId)
        resolve()
      }),

      // Prefetch user goals
      new Promise<void>((resolve) => {
        getUserGoals(userId)
        resolve()
      }),

      // Prefetch any other essential data
      // Add more prefetch operations as needed

      // Simulate network delay for demo purposes (remove in production)
      new Promise<void>((resolve) => setTimeout(resolve, 300)),
    ]

    // Wait for all prefetch operations to complete
    await Promise.all(fetchPromises)

    // Log performance metrics
    const endTime = performance.now()
    console.log(`Data prefetching completed in ${Math.round(endTime - startTime)}ms`)

    // Store prefetch timestamp in sessionStorage to avoid duplicate prefetching
    if (typeof window !== "undefined") {
      sessionStorage.setItem("lastPrefetchTimestamp", Date.now().toString())
    }
  } catch (error) {
    console.error("Error during data prefetching:", error)
    // Continue with navigation even if prefetching fails
  }
}

/**
 * Checks if data has been recently prefetched to avoid duplicate operations
 *
 * @returns Boolean indicating if data was recently prefetched
 */
export function wasRecentlyPrefetched(): boolean {
  if (typeof window === "undefined") return false

  const lastPrefetchTimestamp = sessionStorage.getItem("lastPrefetchTimestamp")
  if (!lastPrefetchTimestamp) return false

  // Consider data "fresh" if prefetched within the last 30 seconds
  const PREFETCH_TTL = 30 * 1000 // 30 seconds in milliseconds
  const now = Date.now()
  const timestamp = Number.parseInt(lastPrefetchTimestamp, 10)

  return now - timestamp < PREFETCH_TTL
}
