/**
 * localStorage helpers — safe read/write with JSON serialisation.
 * Returns a fallback value if the key is missing or the stored value is corrupt.
 * Never throws; any error is silently caught and the fallback is returned.
 */

/**
 * Load a value from localStorage.
 * @param {string} key
 * @param {*} fallback  Value to return if key is absent or JSON is invalid.
 */
export function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

/**
 * Save a value to localStorage as JSON.
 * Silently ignores errors (e.g. private browsing quota exceeded).
 * @param {string} key
 * @param {*} value
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage unavailable — degrade gracefully, do not crash
  }
}
