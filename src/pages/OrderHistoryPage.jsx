import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrders } from '../hooks/useOrders'
import { useCart } from '../hooks/useCart'
import { books } from '../data/books'
import { formatPrice, formatDate } from '../utils/formatters'
import { PAYMENT_LABELS } from '../utils/paymentLabels'
import { BookCard } from '../components/book/BookCard'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

/**
 * BuyAgainButton — calls buyAgain() from useCart and shows brief feedback.
 */
function BuyAgainButton({ orderItems }) {
  const { buyAgain } = useCart()
  const [added, setAdded] = useState(false)

  function handleClick() {
    buyAgain(orderItems)
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant={added ? 'secondary' : 'primary'}
        onClick={handleClick}
        aria-label="Add all items from this order to cart"
        className="shrink-0"
      >
        {added ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
            </svg>
            Added to Cart
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            Buy Again
          </>
        )}
      </Button>

      {/* Navigate to cart after adding */}
      {added && (
        <Link
          to="/cart"
          className="text-sm text-amber-400 underline underline-offset-2 hover:text-amber-300 transition-colors
            focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
          aria-live="polite"
        >
          View Cart →
        </Link>
      )}
    </div>
  )
}

/**
 * OrderCard — displays a single completed order with all required fields.
 */
function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false)
  const sectionId = `order-items-${order.id}`

  return (
    <article
      className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden"
      aria-label={`Order ${order.id}`}
    >
      {/* Order header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-800 p-5">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {/* Order ID */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500">Order ID</p>
            <p className="mt-0.5 font-mono text-sm font-bold text-amber-400">{order.id}</p>
          </div>
          {/* Date */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500">Date</p>
            <p className="mt-0.5 text-sm text-gray-200">{formatDate(order.date)}</p>
          </div>
          {/* Status */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500">Status</p>
            <span className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-medium text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" aria-hidden="true" />
              Delivered
            </span>
          </div>
          {/* Total */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500">Total</p>
            <p className="mt-0.5 text-sm font-bold text-white">{formatPrice(order.total)}</p>
          </div>
          {/* Payment method */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500">Payment</p>
            <p className="mt-0.5 text-sm text-gray-300">
              {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
            </p>
          </div>
        </div>

        {/* Expand / collapse toggle */}
        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          aria-expanded={expanded}
          aria-controls={sectionId}
          className="shrink-0 text-xs text-gray-500 underline underline-offset-2 hover:text-gray-300 transition-colors
            focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
        >
          {expanded ? 'Hide details' : 'Show details'}
        </button>
      </div>

      {/* Collapsible detail body */}
      {expanded && (
        <div id={sectionId} className="p-5">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">

            {/* ── Items list ── */}
            <section aria-labelledby={`items-label-${order.id}`}>
              <h3
                id={`items-label-${order.id}`}
                className="mb-3 text-sm font-semibold uppercase tracking-widest text-gray-500"
              >
                Items Ordered
              </h3>
              <ul className="flex flex-col gap-3" role="list">
                {order.items.map(({ book, quantity }) => (
                  <li
                    key={book.id}
                    className="flex items-center gap-4 rounded-lg border border-gray-800 bg-gray-950/50 p-3"
                  >
                    <Link
                      to={`/book/${book.id}`}
                      aria-label={`View details for ${book.title}`}
                      className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
                    >
                      <img
                        src={book.coverUrl}
                        alt={`Cover of ${book.title}`}
                        className="h-14 w-10 rounded object-cover"
                        loading="lazy"
                        onError={e => {
                          e.currentTarget.src = `https://placehold.co/40x56/1f2937/9ca3af?text=📖`
                        }}
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/book/${book.id}`}
                        className="block font-medium text-white hover:text-amber-400 transition-colors
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded
                          truncate text-sm"
                      >
                        {book.title}
                      </Link>
                      <p className="text-xs text-gray-400">{book.author}</p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {formatPrice(book.price)} × {quantity}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-amber-400">
                      {formatPrice(book.price * quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* ── Right: totals + delivery + Buy Again ── */}
            <div className="flex flex-col gap-5">

              {/* Order totals */}
              <section aria-labelledby={`totals-label-${order.id}`}>
                <h3
                  id={`totals-label-${order.id}`}
                  className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-500"
                >
                  Order Totals
                </h3>
                <div className="rounded-lg border border-gray-800 bg-gray-950/50 px-4 py-2 text-sm divide-y divide-gray-800">
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-gray-200">{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-400">Shipping</span>
                    <span className={order.shipping === 0 ? 'text-amber-400' : 'text-gray-200'}>
                      {order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}
                    </span>
                  </div>
                  {order.giftPointsUsed > 0 && (
                    <div className="flex justify-between py-1.5">
                      <span className="text-gray-400">Gift Points</span>
                      <span className="text-amber-400">−{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1.5 font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-amber-400">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </section>

              {/* Delivery address */}
              <section aria-labelledby={`delivery-label-${order.id}`}>
                <h3
                  id={`delivery-label-${order.id}`}
                  className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-500"
                >
                  Delivered To
                </h3>
                <div className="rounded-lg border border-gray-800 bg-gray-950/50 p-4 text-sm text-gray-300">
                  <p className="font-medium text-white">{order.address.fullName}</p>
                  <p>{order.address.street}{order.address.apartment ? `, ${order.address.apartment}` : ''}</p>
                  <p>{order.address.city}, {order.address.state} {order.address.zip}</p>
                  <p>{order.address.country}</p>
                </div>
              </section>

              {/* Buy Again */}
              <BuyAgainButton orderItems={order.items} />
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

/**
 * HistoryRecommendations — books suggested from categories in the user's order history.
 * Excludes books already purchased. Reuses BookCard.
 */
function HistoryRecommendations({ orders }) {
  const recommended = useMemo(() => {
    // Collect all purchased book IDs and categories from order history
    const purchasedIds = new Set(
      orders.flatMap(o => o.items.map(i => i.book.id))
    )
    const purchasedCategories = new Set(
      orders.flatMap(o => o.items.map(i => i.book.category))
    )

    return books
      .filter(b => !purchasedIds.has(b.id) && purchasedCategories.has(b.category))
      .slice(0, 4)
  }, [orders])

  if (recommended.length === 0) return null

  return (
    <section aria-labelledby="history-recs-heading" className="mt-14">
      <h2 id="history-recs-heading" className="mb-5 text-xl font-bold text-white">
        Recommended for You
      </h2>
      <p className="mb-5 text-sm text-gray-400">
        Based on your order history
      </p>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4" role="list">
        {recommended.map(book => (
          <li key={book.id} role="listitem">
            <BookCard book={book} />
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * OrderHistoryPage — list of all completed orders.
 * Route: /orders
 */
export default function OrderHistoryPage() {
  const { orders } = useOrders()

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page header */}
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Order History</h1>
          {orders.length > 0 && (
            <p className="mt-1 text-sm text-gray-400">
              {orders.length} completed order{orders.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {orders.length > 0 && (
          <Badge variant="category" className="text-sm px-3 py-1">
            {orders.length} order{orders.length !== 1 ? 's' : ''}
          </Badge>
        )}
      </header>

      {/* Empty state */}
      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          message="Complete a purchase and your orders will appear here."
          action={
            <Button variant="primary">
              <Link to="/catalogue" className="contents">Browse Catalogue</Link>
            </Button>
          }
        />
      ) : (
        <>
          {/* Order list */}
          <div className="flex flex-col gap-6">
            {orders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          {/* History-based recommendations */}
          <HistoryRecommendations orders={orders} />
        </>
      )}
    </div>
  )
}
