import { useSearchParams } from 'react-router-dom'
import { books, CATEGORIES } from '../data/books'
import { useBookSearch } from '../hooks/useBookSearch'
import { BookGrid } from '../components/book/BookGrid'
import { SearchBar } from '../components/ui/SearchBar'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'

/**
 * CategoryFilter — pill-style filter buttons for each category.
 */
function CategoryFilter({ categories, active, onChange }) {
  return (
    <nav aria-label="Filter by category">
      <ul className="flex flex-wrap gap-2" role="list">
        {categories.map(cat => (
          <li key={cat}>
            <button
              type="button"
              onClick={() => onChange(cat)}
              aria-pressed={active === cat}
              aria-label={`Filter by ${cat}`}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors duration-150
                focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950
                ${
                  active === cat
                    ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                    : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-500 hover:text-white'
                }`}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/**
 * CataloguePage — browse all books with live search and category filtering.
 * Reuses: useBookSearch, books, CATEGORIES, BookGrid, SearchBar, EmptyState.
 */
export default function CataloguePage() {
  // Read ?category= from URL so HomePage category links work
  const [searchParams] = useSearchParams()
  const initialCategory = (() => {
    const param = searchParams.get('category') ?? 'All'
    return CATEGORIES.includes(param) ? param : 'All'
  })()

  const { query, setQuery, category, setCategory, filtered } = useBookSearch(books, initialCategory)

  function handleClearFilters() {
    setQuery('')
    setCategory('All')
  }

  const hasActiveFilters = query.trim() !== '' || category !== 'All'

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Book Catalogue
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          {books.length} books across {CATEGORIES.length - 1} categories
        </p>
      </header>

      {/* Toolbar: search + filters */}
      <div className="mb-8 flex flex-col gap-4">
        {/* Search bar */}
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search by title or author…"
          className="w-full sm:max-w-md"
        />

        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-4">
          <CategoryFilter
            categories={CATEGORIES}
            active={category}
            onChange={setCategory}
          />
          {/* Clear filters — only shown when a filter is active */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-gray-500 underline underline-offset-2 hover:text-gray-300
                focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
              aria-label="Clear all filters"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Results summary */}
        <p
          className="text-xs text-gray-500"
          aria-live="polite"
          aria-atomic="true"
        >
          {filtered.length === 0
            ? 'No books found'
            : `Showing ${filtered.length} of ${books.length} book${filtered.length !== 1 ? 's' : ''}`}
          {category !== 'All' && ` in ${category}`}
          {query.trim() && ` matching "${query.trim()}"`}
        </p>
      </div>

      {/* Book grid or empty state */}
      {filtered.length > 0 ? (
        <BookGrid books={filtered} />
      ) : (
        <EmptyState
          title="No books found"
          message={
            hasActiveFilters
              ? 'Try a different search term or category.'
              : 'No books are available right now.'
          }
          action={
            hasActiveFilters ? (
              <Button variant="secondary" onClick={handleClearFilters}>
                Clear filters
              </Button>
            ) : null
          }
        />
      )}
    </div>
  )
}
