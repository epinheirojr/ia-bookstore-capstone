import { useRef } from 'react'
import { books } from '../../data/books'
import { BookCard } from './BookCard'

/**
 * RelatedBooks — horizontal scroll row of BookCards.
 *
 * Resolution order:
 *   1. Use book.relatedIds when present and resolves to ≥ 1 book.
 *   2. Fall back to other books in the same category (excluding current).
 *   3. If still empty, render nothing.
 *
 * @param {Object} currentBook - The book currently being viewed
 * @param {number} [max=4]     - Maximum number of related books to show
 */
export function RelatedBooks({ currentBook, max = 4 }) {
  const scrollRef = useRef(null)

  // 1. Resolve via relatedIds
  let related = []
  if (currentBook.relatedIds?.length) {
    related = currentBook.relatedIds
      .map(id => books.find(b => b.id === id))
      .filter(Boolean)
  }

  // 2. Fallback: same category, excluding current book
  if (related.length === 0) {
    related = books.filter(
      b => b.category === currentBook.category && b.id !== currentBook.id
    )
  }

  // Limit to max
  related = related.slice(0, max)

  if (related.length === 0) return null

  function scrollBy(direction) {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 280, behavior: 'smooth' })
    }
  }

  return (
    <section aria-labelledby="related-books-heading" className="mt-14">
      {/* Section header */}
      <div className="mb-5 flex items-center justify-between">
        <h2
          id="related-books-heading"
          className="text-xl font-bold text-white"
        >
          You might also like
        </h2>

        {/* Scroll controls — visible only when content overflows */}
        <div className="flex gap-2" aria-label="Scroll related books">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-700
              bg-gray-900 text-gray-400 transition-colors hover:border-gray-500 hover:text-white
              focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-700
              bg-gray-900 text-gray-400 transition-colors hover:border-gray-500 hover:text-white
              focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Horizontal scroll list */}
      <ul
        ref={scrollRef}
        role="list"
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
        aria-label="Related books"
      >
        {related.map(book => (
          <li
            key={book.id}
            role="listitem"
            className="w-48 shrink-0 snap-start sm:w-52"
          >
            <BookCard book={book} />
          </li>
        ))}
      </ul>
    </section>
  )
}
