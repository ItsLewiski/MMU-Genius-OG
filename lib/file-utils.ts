/**
 * Extracts text content from a file
 */
export async function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      if (!event.target || typeof event.target.result !== "string") {
        reject(new Error("Failed to read file content"))
        return
      }
      resolve(event.target.result)
    }

    reader.onerror = () => {
      reject(new Error("Error reading file"))
    }

    reader.readAsText(file)
  })
}

/**
 * Truncates text to a specified maximum length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text

  // Try to truncate at a sentence boundary
  const lastSentence = text.substring(0, maxLength).lastIndexOf(".")
  if (lastSentence > maxLength * 0.8) {
    return text.substring(0, lastSentence + 1)
  }

  // Try to truncate at a paragraph boundary
  const lastParagraph = text.substring(0, maxLength).lastIndexOf("\n\n")
  if (lastParagraph > maxLength * 0.7) {
    return text.substring(0, lastParagraph)
  }

  // Truncate at a word boundary
  const lastSpace = text.substring(0, maxLength).lastIndexOf(" ")
  if (lastSpace > 0) {
    return text.substring(0, lastSpace) + "..."
  }

  // Just truncate at the max length if all else fails
  return text.substring(0, maxLength) + "..."
}

/**
 * Checks if a file exceeds a specified size limit in MB
 */
export function isFileTooLarge(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size > maxSizeBytes
}

/**
 * Formats file size in a human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " bytes"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

/**
 * Validates a file type against a list of allowed types
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

/**
 * Gets the file extension from a file name
 */
export function getFileExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() || ""
}

/**
 * Safely handles file operations with error catching
 */
export async function safeFileOperation<T>(
  operation: () => Promise<T>,
  errorHandler?: (error: Error) => void,
): Promise<T | null> {
  try {
    return await operation()
  } catch (error) {
    if (errorHandler && error instanceof Error) {
      errorHandler(error)
    } else {
      console.error("File operation error:", error)
    }
    return null
  }
}
