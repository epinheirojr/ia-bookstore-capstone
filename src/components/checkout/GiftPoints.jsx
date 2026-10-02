import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../utils/formatters'

/**
 * GiftPoints — lets the user toggle redemption of their 1 000 loyalty points.
 *
 * Reads and toggles state directly from CartContext via useCart().
 * All discount calculations are already handled in the hook:
 *   discount = giftPointsRedeemed ? GIFT_POINTS_VALUE : 0
 */
export function GiftPoints() {
  const {
    giftPointsRedeemed,
    toggleGiftPoints,
    GIFT_POINTS_AVAILABLE,
    GIFT_POINTS_VALUE,
    subtotal,
    discount,
  } = useCart()

  const checkboxId = 'redeem-gift-points'

  return (
    <section aria-labelledby="gift-points-heading">
      <h2
        id="gift-points-heading"
        className="mb-5 flex items-center gap-2 text-lg font-bold text-white"
      >
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-gray-900"
          aria-hidden="true"
        >
          2
        </span>
        Gift Points
      </h2>

      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        {/* Points balance */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-200">Available Points</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {GIFT_POINTS_AVAILABLE.toLocaleString()} pts = {formatPrice(GIFT_POINTS_VALUE)} discount
            </p>
          </div>
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm font-bold text-amber-400">
            {GIFT_POINTS_AVAILABLE.toLocaleString()} pts
          </span>
        </div>

        {/* Toggle checkbox */}
        <label
          htmlFor={checkboxId}
          className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-700 p-4
            transition-colors hover:border-amber-500/50
            has-[:checked]:border-amber-500/50 has-[:checked]:bg-amber-500/5"
        >
          <div className="relative mt-0.5 flex shrink-0 items-center justify-center">
            <input
              type="checkbox"
              id={checkboxId}
              checked={giftPointsRedeemed}
              onChange={toggleGiftPoints}
              className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-600
                bg-gray-800 transition-colors checked:border-amber-500 checked:bg-amber-500
                focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2
                focus-visible:ring-offset-gray-900"
              aria-describedby="gift-points-effect"
            />
            {/* Custom checkmark */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="pointer-events-none absolute hidden h-3 w-3 text-gray-900 peer-checked:block"
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
            </svg>
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium text-gray-200">
              Redeem {GIFT_POINTS_AVAILABLE.toLocaleString()} points
            </p>
            <p
              id="gift-points-effect"
              className="mt-0.5 text-xs text-gray-400"
            >
              Save {formatPrice(GIFT_POINTS_VALUE)} on this order
            </p>
          </div>

          {/* Discount badge */}
          {giftPointsRedeemed && (
            <span
              className="shrink-0 rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-400"
              aria-live="polite"
            >
              −{formatPrice(GIFT_POINTS_VALUE)}
            </span>
          )}
        </label>

        {/* Live discount feedback */}
        {giftPointsRedeemed && (
          <p
            className="mt-3 text-sm text-green-400"
            aria-live="polite"
            aria-atomic="true"
          >
            ✓ Points applied — your order total is now{' '}
            <strong>{formatPrice(Math.max(0, subtotal - discount))}</strong>
          </p>
        )}
      </div>
    </section>
  )
}
