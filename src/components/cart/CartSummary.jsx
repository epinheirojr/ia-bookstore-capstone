import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { formatPrice, calcShipping, SHIPPING_THRESHOLD } from '../../utils/formatters'
import { Button } from '../ui/Button'

/**
 * SummaryRow — a single labelled row in the order summary.
 */
function SummaryRow({ label, value, highlight = false, muted = false }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className={`text-sm ${muted ? 'text-gray-500' : 'text-gray-400'}`}>{label}</span>
      <span className={`text-sm font-medium ${highlight ? 'text-amber-400' : muted ? 'text-gray-500' : 'text-gray-200'}`}>
        {value}
      </span>
    </div>
  )
}

/**
 * CartSummary — order totals panel shown alongside the cart item list.
 * Displays item count, subtotal, shipping, and total.
 * Contains the "Proceed to Checkout" CTA.
 *
 * Shipping logic:
 *   - Free for orders >= $35
 *   - $4.99 flat rate otherwise
 */
export function CartSummary() {
  const { itemCount, subtotal, discount, giftPointsRedeemed } = useCart()

  const shipping = calcShipping(subtotal)
  // Same formula used by CheckoutPage and PaymentPage
  const total = Math.max(0, subtotal - discount + shipping)

  const amountUntilFreeShipping = SHIPPING_THRESHOLD - subtotal

  return (
    <aside
      aria-label="Order summary"
      className="rounded-xl border border-gray-800 bg-gray-900 p-6 lg:sticky lg:top-24"
    >
      <h2 className="mb-4 text-lg font-bold text-white">Order Summary</h2>

      {/* Free shipping progress nudge */}
      {subtotal > 0 && subtotal < SHIPPING_THRESHOLD && (
        <div className="mb-4 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3">
          <p className="text-xs text-amber-400">
            Add{' '}
            <strong>{formatPrice(amountUntilFreeShipping)}</strong>{' '}
            more to get <strong>free shipping!</strong>
          </p>
          {/* Progress bar */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-700" aria-hidden="true">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-300"
              style={{ width: `${Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Free shipping achieved */}
      {subtotal >= SHIPPING_THRESHOLD && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-green-400" aria-hidden="true">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-green-400 font-medium">You've unlocked free shipping!</p>
        </div>
      )}

      {/* Summary rows */}
      <div className="divide-y divide-gray-800">
        <div className="pb-3">
          <SummaryRow
            label={`Items (${itemCount})`}
            value={formatPrice(subtotal)}
          />
          <SummaryRow
            label="Estimated shipping"
            value={shipping === 0 ? 'FREE' : formatPrice(shipping)}
            highlight={shipping === 0}
          />
          {giftPointsRedeemed && discount > 0 && (
            <SummaryRow
              label="Gift Points (1,000 pts)"
              value={`−${formatPrice(discount)}`}
              highlight
            />
          )}
        </div>

        {/* Total */}
        <div className="pt-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-white">Total</span>
            <span className="text-xl font-bold text-amber-400">{formatPrice(total)}</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Tax calculated at checkout
          </p>
        </div>
      </div>

      {/* Proceed to Checkout */}
      <Link to="/checkout" className="mt-6 block">
        <Button
          variant="primary"
          className="w-full py-3 text-base"
          aria-label="Proceed to checkout"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0 1 10 0v2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Zm8-2v2H7V7a3 3 0 0 1 6 0Z" clipRule="evenodd" />
          </svg>
          Proceed to Checkout
        </Button>
      </Link>

      {/* Continue shopping */}
      <div className="mt-4 text-center">
        <Link
          to="/catalogue"
          className="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-300 transition-colors
            focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
        >
          ← Continue Shopping
        </Link>
      </div>
    </aside>
  )
}
