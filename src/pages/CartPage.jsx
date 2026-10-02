import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { books } from '../data/books'
import { CartItem } from '../components/cart/CartItem'
import { CartSummary } from '../components/cart/CartSummary'
import { BookCard } from '../components/book/BookCard'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'

/**
 * CartRecommendations — "Recommended for you" strip.
 *
 * Shows up to 4 books from the same categories as cart items,
 * excluding books already in the cart.
 * Reuses BookCard directly — no new recommendation engine needed.
 */
function CartRecommendations({ cartItems }) {
  const recommendations = useMemo(() => {
    const cartBookIds = new Set(cartItems.map(i => i.book.id))
    const cartCategories = new Set(cartItems.map(i => i.book.category))

    return books
      .filter(b => !cartBookIds.has(b.id) && cartCategories.has(b.category))
      .slice(0, 4)
  }, [cartItems])

  if (recommendations.length === 0) return null

  return (
    <section aria-labelledby="recommendations-heading" className="mt-14">
      <h2
        id="recommendations-heading"
        className="mb-5 text-xl font-bold text-white"
      >
        Recommended for you
      </h2>
      <ul
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
        role="list"
      >
        {recommendations.map(book => (
          <li key={book.id} role="listitem">
            <BookCard book={book} />
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * CartPage — view and manage shopping cart items.
 * Route: /cart
 */
export default function CartPage() {
  const { items, itemCount, clearCart } = useCart()
  const isEmpty = items.length === 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page header */}
      <header className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Shopping Cart
          </h1>
          {!isEmpty && (
            <p className="mt-1 text-sm text-gray-400">
              {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
            </p>
          )}
        </div>

        {/* Clear cart — only when items exist */}
        {!isEmpty && (
          <button
            type="button"
            onClick={clearCart}
            aria-label="Clear all items from cart"
            className="text-sm text-gray-500 underline underline-offset-2 hover:text-red-400 transition-colors
              focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
          >
            Clear cart
          </button>
        )}
      </header>

      {/* Empty state */}
      {isEmpty ? (
        <EmptyState
          title="Your cart is empty"
          message="Browse our catalogue and add some books you'll love."
          action={
            <Button variant="primary">
              <Link to="/catalogue" className="contents">
                Browse Catalogue
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          {/* Two-column layout: items list + sticky summary */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">

            {/* ── Cart items list ── */}
            <section aria-label="Cart items">
              <ul className="flex flex-col gap-4" role="list">
                {items.map(item => (
                  <CartItem key={item.book.id} item={item} />
                ))}
              </ul>
            </section>

            {/* ── Order summary sidebar ── */}
            <CartSummary />
          </div>

          {/* Recommendations based on cart categories */}
          <CartRecommendations cartItems={items} />
        </>
      )}
    </div>
  )
}
