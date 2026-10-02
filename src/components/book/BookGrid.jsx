import { BookCard } from './BookCard'

/**
 * BookGrid — responsive grid of BookCard components.
 * Used in CataloguePage and (later) as a featured section on HomePage.
 *
 * @param {Object[]} books - Array of book objects to display
 */
export function BookGrid({ books }) {
  return (
    <section aria-label="Book listing">
      <ul
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5"
        role="list"
      >
        {books.map(book => (
          <li key={book.id} role="listitem">
            <BookCard book={book} />
          </li>
        ))}
      </ul>
    </section>
  )
}
