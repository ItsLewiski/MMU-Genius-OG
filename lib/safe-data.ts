/**
 * Safely get a property from an object, returning a default value if the property doesn't exist
 * @param obj The object to get the property from
 * @param path The property path (can be nested with dot notation)
 * @param defaultValue The default value to return if the property doesn't exist
 */
export function safeGet<T>(obj: any, path: string, defaultValue: T): T {
  if (!obj) return defaultValue

  const keys = path.split(".")
  let result = obj

  for (const key of keys) {
    if (result === undefined || result === null || typeof result !== "object") {
      return defaultValue
    }
    result = result[key]
  }

  return result === undefined || result === null ? defaultValue : result
}

/**
 * Safely map over an array, handling the case where the array is undefined or null
 * @param arr The array to map over
 * @param callback The mapping function
 */
export function safeMap<T, U>(arr: T[] | null | undefined, callback: (item: T, index: number) => U): U[] {
  if (!arr || !Array.isArray(arr)) return []
  return arr.map(callback)
}

/**
 * Safely access an array element at a specific index, returning a default value if the index is out of bounds
 * @param arr The array to access
 * @param index The index to access
 * @param defaultValue The default value to return if the index is out of bounds
 */
export function safeArrayAccess<T>(arr: T[] | null | undefined, index: number, defaultValue: T | null): T | null {
  if (!arr || !Array.isArray(arr) || index < 0 || index >= arr.length) {
    return defaultValue
  }
  return arr[index]
}
