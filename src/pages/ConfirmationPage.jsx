import { Link, useParams, useLocation } from 'react-router-dom'
import { useOrders } from '../hooks/useOrders'
import { formatPrice, formatDate } from '../utils/formatters'
import { PAYMENT_LABELS } from '../utils/paymentLabels'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'

/**
 * ConfirmationRow — a single labelled row in the confirmation summary.
 */
function ConfirmationRow({ label, value, highlight = false }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-gray-800 last:border-0">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <span className={`text-sm font-medium text-right ${highlight ? 'text-amber-400' : 'text-gray-200'}`}>
        {value}
      </span>
    </div>
  )
}

/**
 * ConfirmationPage — purchase confirmation summary.
 * Route: /confirmation/:orderId
 *
 * Reads order from:
 *   1. React Router location.state (immediately after payment, most reliable)
 *   2. OrderContext orders array (if user navigates back to this URL)
 */
export default function ConfirmationPage() {
  const { orderId } = useParams()
  const location = useLocation()
  const { orders } = useOrders()

  // Prefer location state (fresh from payment), fall back to context lookup
  const order = location.state?.order ?? orders.find(o => o.id === orderId) ?? null

  if (!order) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <EmptyState
          title="Order not found"
          message="We couldn't find this order. It may have been placed in a previous session."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="primary">
                <Link to="/catalogue" className="contents">Browse Catalogue</Link>
              </Button>
              <Button variant="secondary">
                <Link to="/orders" className="contents">View Order History</Link>
              </Button>
            </div>
          }
        />
      </div>
    )
  }

  const { items, address, paymentMethod, subtotal, discount, shipping, total, giftPointsUsed, date } = order

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">

      {/* Success banner */}
      <div className="mb-10 flex flex-col items-center gap-4 text-center">
        {/* Success icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 border border-green-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
            className="h-8 w-8 text-green-400" aria-hidden="true">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Order Confirmed!</h1>
          <p className="mt-2 text-gray-400">
            Thank you for your purchase. Your books are on their way.
          </p>
        </div>
        <div className="rounded-lg border border-gray-700 bg-gray-900 px-5 py-3 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-widest">Order ID</p>
          <p className="mt-0.5 font-mono text-sm font-bold text-amber-400">{orderId}</p>
          <p className="mt-0.5 text-xs text-gray-500">{formatDate(date)}</p>
        </div>
      </div>

      {/* Items ordered */}
      <section aria-labelledby="items-heading" className="mb-8">
        <h2 id="items-heading" className="mb-4 text-lg font-bold text-white">Items Ordered</h2>
        <ul className="flex flex-col gap-3" role="list">
          {items.map(({ book, quantity }) => (
            <li
              key={book.id}
              className="flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-900 p-4"
            >
              <img
                src={book.coverUrl}
                alt={`Cover of ${book.title}`}
                className="h-16 w-11 rounded-lg object-cover shrink-0"
                onError={e => { e.currentTarget.src = `https://placehold.co/44x64/1f2937/9ca3af?text=📖` }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{book.title}</p>
                <p className="text-sm text-gray-400">{book.author}</p>
                <p className="mt-1 text-xs text-gray-500">Qty: {quantity}</p>
              </div>
              <span className="text-sm font-bold text-amber-400 shrink-0">
                {formatPrice(book.price * quantity)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Two-column: payment + delivery */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">

        {/* Payment summary */}
        <section aria-labelledby="payment-heading">
          <h2 id="payment-heading" className="mb-3 text-base font-semibold text-white">Payment</h2>
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <ConfirmationRow label="Method" value={PAYMENT_LABELS[paymentMethod] ?? paymentMethod} />
            <ConfirmationRow label="Subtotal" value={formatPrice(subtotal)} />
            <ConfirmationRow
              label="Shipping"
              value={shipping === 0 ? 'FREE' : formatPrice(shipping)}
              highlight={shipping === 0}
            />
            {giftPointsUsed > 0 && (
              <ConfirmationRow
                label={`Gift Points (${giftPointsUsed.toLocaleString()} pts)`}
                value={`−${formatPrice(discount)}`}
                highlight
              />
            )}
            <ConfirmationRow label="Total Charged" value={formatPrice(total)} highlight />
          </div>
        </section>

        {/* Delivery address */}
        <section aria-labelledby="delivery-heading">
          <h2 id="delivery-heading" className="mb-3 text-base font-semibold text-white">Delivery Address</h2>
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 text-sm text-gray-300">
            <p className="font-semibold text-white">{address.fullName}</p>
            <p>{address.street}{address.apartment ? `, ${address.apartment}` : ''}</p>
            <p>{address.city}, {address.state} {address.zip}</p>
            <p>{address.country}</p>
          </div>
        </section>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Button variant="primary" className="px-8">
          <Link to="/catalogue" className="contents">Continue Shopping</Link>
        </Button>
        <Button variant="secondary" className="px-8">
          <Link to="/orders" className="contents">View Order History</Link>
        </Button>
      </div>
    </div>
  )
}
