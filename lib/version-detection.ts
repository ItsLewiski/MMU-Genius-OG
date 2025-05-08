import { setupGlobalErrorHandling } from "./error-handler"

export function setupVersionDetection() {
  // Set up global error handling
  setupGlobalErrorHandling()

  // Check for app version
  const currentVersion = "1.0.0" // This should be updated with each release

  try {
    const storedVersion = localStorage.getItem("app_version")

    if (storedVersion !== currentVersion) {
      // Version has changed, clear cache if needed
      console.log(`Version changed from ${storedVersion || "none"} to ${currentVersion}`)

      // Clear any cached data that might cause issues
      localStorage.setItem("app_version", currentVersion)

      // Optionally clear other caches
      // localStorage.removeItem('cached_data');

      // Check if this is a fresh install or an update
      if (!storedVersion) {
        console.log("First time app load detected")
      } else {
        console.log("App update detected")
      }
    }
  } catch (error) {
    console.error("Error checking app version:", error)
    // Continue without crashing
  }

  // Log app initialization
  console.log(`App initialized (v${currentVersion})`)

  return {
    version: currentVersion,
  }
}
