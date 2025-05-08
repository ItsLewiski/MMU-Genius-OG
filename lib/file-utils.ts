/**
 * Utility functions for file handling and text extraction
 */

/**
 * Extracts text from various file types
 * @param file The file to extract text from
 * @returns Promise resolving to the extracted text
 */
export async function extractTextFromFile(file: File): Promise<string> {
  // For text files, simply read as text
  if (file.type === "text/plain") {
    return await readTextFile(file)
  }

  // For PDF files
  else if (file.type === "application/pdf") {
    return "PDF extraction is temporarily disabled. Please copy and paste the text manually."
  }

  // For Word documents
  else if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.type === "application/msword"
  ) {
    return "Word document extraction is temporarily disabled. Please copy and paste the text manually."
  }

  throw new Error(`Unsupported file type: ${file.type}`)
}

/**
 * Reads a text file
 */
async function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string)
      } else {
        reject(new Error("Failed to read text file"))
      }
    }
    reader.onerror = () => reject(new Error("Error reading text file"))
    reader.readAsText(file)
  })
}

/**
 * Truncates text to a specified length, trying to break at sentence boundaries
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text

  // Try to find a sentence boundary near the maxLength
  const breakPoint = text.lastIndexOf(".", maxLength)
  if (breakPoint > maxLength * 0.8) {
    return text.substring(0, breakPoint + 1)
  }

  // If no good sentence boundary, just cut at maxLength
  return text.substring(0, maxLength) + "..."
}

/**
 * Checks if a file is too large
 * @param file The file to check
 * @param maxSizeMB Maximum size in MB
 * @returns Boolean indicating if the file is too large
 */
export function isFileTooLarge(file: File, maxSizeMB = 5): boolean {
  return file.size > maxSizeMB * 1024 * 1024
}

/**
 * Gets a human-readable file size
 * @param bytes File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " bytes"
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
  else return (bytes / 1048576).toFixed(1) + " MB"
}
