import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../utils/formatters'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { StarRating } from '../ui/StarRating'

/**
 * BookCard — displays a single book with cover, metadata, and Add to Cart.
 * Used in BookGrid (catalogue) and RelatedBooks (book detail).
 */
export function BookCard({ book }) {
  const { items, addItem } = useCart()
  const inCart = items.some(i => i.book.id === book.id)

  function handleAddToCart(e) {
    // Prevent the parent <Link> from navigating when clicking the button
    e.preventDefault()
    e.stopPropagation()
    addItem(book)
  }

  return (
    <article className="group flex flex-col rounded-xl border border-gray-800 bg-gray-900 overflow-hidden transition-all duration-200 hover:border-gray-700 hover:shadow-lg hover:shadow-black/30">
      {/* Cover image — links to book detail */}
      <Link
        to={`/book/${book.id}`}
        aria-label={`View details for ${book.title}`}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-500"
        tabIndex={0}
      >
        <div className="relative h-52 w-full overflow-hidden bg-gray-800">
          <img
            src={book.coverUrl}
            alt={`Cover of ${book.title} by ${book.author}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={e => {
              e.currentTarget.src = `https://placehold.co/200x300/1f2937/9ca3af?text=${encodeURIComponent(book.title)}`
            }}
          />
          {/* Category badge overlay */}
          <div className="absolute left-2 top-2">
            <Badge variant="category">{book.category}</Badge>
          </div>
        </div>
      </Link>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title + author */}
        <div className="flex-1">
          <Link
            to={`/book/${book.id}`}
            className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
            tabIndex={-1}
            aria-hidden="true"
          >
            <h2 className="line-clamp-2 text-sm font-semibold leading-snug text-white group-hover:text-amber-400 transition-colors">
              {book.title}
            </h2>
          </Link>
          <p className="mt-1 text-xs text-gray-400">{book.author}</p>
        </div>

        {/* Rating */}
        <StarRating rating={book.rating} />

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-base font-bold text-amber-400">
            {formatPrice(book.price)}
          </span>
          <Button
            variant={inCart ? 'secondary' : 'primary'}
            onClick={handleAddToCart}
            aria-label={inCart ? `${book.title} is in your cart` : `Add ${book.title} to cart`}
            className="shrink-0 px-3 py-1.5 text-xs"
          >
            {inCart ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                </svg>
                In Cart
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  )
}
