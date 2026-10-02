/**
 * Utility formatters and shared constants — pure, no side effects.
 */

// Shipping: free above threshold, flat rate otherwise
export const SHIPPING_THRESHOLD = 35
export const SHIPPING_COST = 4.99

/** Calculate shipping cost from a subtotal */
export function calcShipping(subtotal) {
  return subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
}


/** Format a number as a USD currency string: $12.99 */
export function formatPrice(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

/** Format an ISO date string to a readable date: May 29, 2025 */
export function formatDate(isoString) {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(
    new Date(isoString)
  )
}

/** Generate a simple order ID based on current timestamp */
export function generateOrderId() {
  return `ORD-${Date.now()}`
}
