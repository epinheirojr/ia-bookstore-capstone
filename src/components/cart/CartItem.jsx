import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../utils/formatters'

/**
 * QuantityButton — small +/− stepper button.
 */
function QuantityButton({ onClick, label, children, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-700
        bg-gray-800 text-gray-300 transition-colors
        hover:border-gray-500 hover:bg-gray-700 hover:text-white
        focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500
        disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  )
}

/**
 * CartItem — a single line item in the shopping cart.
 *
 * UX decision: clicking "−" when quantity is 1 removes the item entirely,
 * with a visible trash icon to confirm intent. The reducer's Math.max(1, qty)
 * guard means we handle removal here rather than relying on it to silently clamp.
 */
export function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()
  const { book, quantity } = item
  const lineTotal = book.price * quantity

  function handleDecrement() {
    if (quantity === 1) {
      removeItem(book.id)
    } else {
      updateQuantity(book.id, quantity - 1)
    }
  }

  function handleIncrement() {
    updateQuantity(book.id, quantity + 1)
  }

  function handleRemove() {
    removeItem(book.id)
  }

  return (
    <li className="flex gap-4 rounded-xl border border-gray-800 bg-gray-900 p-4 sm:gap-5 sm:p-5">
      {/* Cover thumbnail — links to detail page */}
      <Link
        to={`/book/${book.id}`}
        aria-label={`View details for ${book.title}`}
        className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg"
      >
        <img
          src={book.coverUrl}
          alt={`Cover of ${book.title}`}
          className="h-24 w-16 rounded-lg object-cover sm:h-28 sm:w-20"
          loading="lazy"
          onError={e => {
            e.currentTarget.src = `https://placehold.co/80x112/1f2937/9ca3af?text=${encodeURIComponent(book.title)}`
          }}
        />
      </Link>

      {/* Main content */}
      <div className="flex flex-1 flex-col justify-between gap-3 min-w-0">
        {/* Top row: title + remove button */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/book/${book.id}`}
              className="block font-semibold text-white hover:text-amber-400 transition-colors
                focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded
                line-clamp-2 text-sm sm:text-base"
            >
              {book.title}
            </Link>
            <p className="mt-0.5 text-xs text-gray-400 sm:text-sm">{book.author}</p>
          </div>

          {/* Remove button */}
          <button
            type="button"
            onClick={handleRemove}
            aria-label={`Remove ${book.title} from cart`}
            className="shrink-0 rounded p-1 text-gray-600 transition-colors
              hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Bottom row: quantity stepper + unit price + line total */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Quantity stepper */}
          <div className="flex items-center gap-2" role="group" aria-label={`Quantity for ${book.title}`}>
            <QuantityButton
              onClick={handleDecrement}
              label={quantity === 1 ? `Remove ${book.title}` : `Decrease quantity of ${book.title}`}
            >
              {quantity === 1 ? (
                /* Show a trash icon when at qty=1 to signal removal */
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 text-red-400" aria-hidden="true">
                  <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.712Z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
                </svg>
              )}
            </QuantityButton>

            <span
              className="w-8 text-center text-sm font-semibold text-white"
              aria-live="polite"
              aria-label={`Quantity: ${quantity}`}
            >
              {quantity}
            </span>

            <QuantityButton
              onClick={handleIncrement}
              label={`Increase quantity of ${book.title}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
              </svg>
            </QuantityButton>
          </div>

          {/* Prices */}
          <div className="flex items-center gap-3 text-right">
            <span className="text-xs text-gray-500">
              {formatPrice(book.price)} each
            </span>
            <span className="text-base font-bold text-amber-400">
              {formatPrice(lineTotal)}
            </span>
          </div>
        </div>
      </div>
    </li>
  )
}
