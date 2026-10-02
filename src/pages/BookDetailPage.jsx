import { useParams, Link } from 'react-router-dom'
import { books } from '../data/books'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../utils/formatters'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { StarRating } from '../components/ui/StarRating'
import { RelatedBooks } from '../components/book/RelatedBooks'
import { EmptyState } from '../components/ui/EmptyState'

/**
 * MetaStat — a labelled stat row used in the book detail sidebar.
 */
function MetaStat({ label, children }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-800 py-3 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-200">{children}</span>
    </div>
  )
}

/**
 * BookDetailPage — full detail view for a single book.
 * Route: /book/:id
 */
export default function BookDetailPage() {
  const { id } = useParams()
  const book = books.find(b => b.id === id)
  const { items, addItem } = useCart()

  // Guard: unknown book ID
  if (!book) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <EmptyState
          title="Book not found"
          message="The book you're looking for doesn't exist or may have been removed."
          action={
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-4 py-2 text-sm font-medium
                text-gray-100 transition-colors hover:bg-gray-600
                focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2
                focus-visible:ring-offset-gray-950"
            >
              ← Back to Catalogue
            </Link>
          }
        />
      </div>
    )
  }

  const inCart = items.some(i => i.book.id === book.id)

  // Delivery estimate: 3–5 business days from today
  const today = new Date()
  const minDate = new Date(today)
  minDate.setDate(today.getDate() + 3)
  const maxDate = new Date(today)
  maxDate.setDate(today.getDate() + 5)
  const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
  const deliveryWindow = `${dateFormatter.format(minDate)} – ${dateFormatter.format(maxDate)}`

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link
              to="/catalogue"
              className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
            >
              Catalogue
            </Link>
          </li>
          <li aria-hidden="true" className="text-gray-700">/</li>
          <li className="truncate text-gray-300" aria-current="page">
            {book.title}
          </li>
        </ol>
      </nav>

      {/* Main detail layout */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">

        {/* ── Left column: cover ── */}
        <aside>
          <div className="sticky top-24">
            <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-xl shadow-black/40">
              <img
                src={book.coverUrl}
                alt={`Cover of ${book.title} by ${book.author}`}
                className="w-full object-cover"
                onError={e => {
                  e.currentTarget.src = `https://placehold.co/400x560/1f2937/9ca3af?text=${encodeURIComponent(book.title)}`
                }}
              />
            </div>
          </div>
        </aside>

        {/* ── Right column: details ── */}
        <div className="flex flex-col gap-8">

          {/* Category + Title + Author */}
          <header>
            <Badge variant="category" className="mb-3">{book.category}</Badge>
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              {book.title}
            </h1>
            <p className="mt-2 text-lg text-gray-400">by {book.author}</p>
          </header>

          {/* Rating + Price row */}
          <div className="flex flex-wrap items-center gap-6">
            <StarRating rating={book.rating} size="md" />
            <span className="text-3xl font-bold text-amber-400">
              {formatPrice(book.price)}
            </span>
          </div>

          {/* Description */}
          <section aria-labelledby="description-heading">
            <h2
              id="description-heading"
              className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-500"
            >
              About this book
            </h2>
            <p className="leading-relaxed text-gray-300">{book.description}</p>
          </section>

          {/* Book metadata stats */}
          <section
            aria-label="Book details"
            className="rounded-xl border border-gray-800 bg-gray-900 px-5"
          >
            <MetaStat label="Category">{book.category}</MetaStat>
            <MetaStat label="Pages">{book.pages.toLocaleString()}</MetaStat>
            <MetaStat label="Rating">{book.rating.toFixed(1)} / 5.0</MetaStat>
            <MetaStat label="Availability">
              <span className="flex items-center gap-1.5 text-green-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" aria-hidden="true" />
                In Stock
              </span>
            </MetaStat>
            <MetaStat label="Estimated delivery">
              <span className="text-amber-400">{deliveryWindow}</span>
            </MetaStat>
          </section>

          {/* Add to Cart CTA */}
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant={inCart ? 'secondary' : 'primary'}
              onClick={() => !inCart && addItem(book)}
              aria-label={inCart ? `${book.title} is already in your cart` : `Add ${book.title} to cart`}
              className="px-8 py-3 text-base"
              disabled={inCart}
            >
              {inCart ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                  Added to Cart
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                    <path d="M1 1.75A.75.75 0 0 1 1.75 1h1.628a1.75 1.75 0 0 1 1.734 1.51L5.17 3h12.56a1.75 1.75 0 0 1 1.723 2.06l-1.5 8.5A1.75 1.75 0 0 1 16.23 15H7.42a1.75 1.75 0 0 1-1.734-1.51L4.5 6.25l-.345-2.07A.25.25 0 0 0 3.91 4H1.75A.75.75 0 0 1 1 3.25v-1.5zM7 17.25a1.25 1.25 0 1 1 2.5 0 1.25 1.25 0 0 1-2.5 0zm9.5 0a1.25 1.25 0 1 1 2.5 0 1.25 1.25 0 0 1-2.5 0z" />
                  </svg>
                  Add to Cart
                </>
              )}
            </Button>

            <Link
              to="/catalogue"
              className="text-sm text-gray-400 underline underline-offset-4 hover:text-white transition-colors
                focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
            >
              ← Continue shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Related books */}
      <RelatedBooks currentBook={book} />
    </div>
  )
}
