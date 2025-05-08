/**
 * Helper function to get the logo URL
 * This centralizes the logo path in case we need to change it later
 */
export function getLogoUrl(): string {
  return "/assets/images/mmu-genius-logo.png"
}

/**
 * Helper function to get logo dimensions based on size
 * @param size - small, medium, large, or custom size
 * @returns width and height in pixels
 */
export function getLogoDimensions(size: "small" | "medium" | "large" | number): { width: number; height: number } {
  switch (size) {
    case "small":
      return { width: 32, height: 32 }
    case "medium":
      return { width: 64, height: 64 }
    case "large":
      return { width: 96, height: 96 }
    default:
      return { width: size, height: size }
  }
}

/**
 * Helper function to get responsive logo class names
 * @param size - The base size of the logo
 * @param additionalClasses - Any additional classes to add
 * @returns A string of class names
 */
export function getLogoClasses(size: "small" | "medium" | "large", additionalClasses = ""): string {
  const baseClasses = "mmu-genius-logo-responsive"
  const sizeClasses = {
    small: "transform scale-100 sm:scale-110",
    medium: "transform scale-110 sm:scale-120",
    large: "transform scale-120 sm:scale-130",
  }

  return `${baseClasses} ${sizeClasses[size]} ${additionalClasses}`.trim()
}
