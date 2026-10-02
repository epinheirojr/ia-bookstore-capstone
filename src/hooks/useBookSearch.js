import { useState, useMemo } from 'react'

/**
 * useBookSearch — filters a list of books by search query and category.
 * Ready to be swapped for an API call in a future backend integration.
 *
 * @param {Object[]} books          - Full book list to filter
 * @param {string}   initialCategory - Seed the category filter (e.g. from ?category= query param)
 */
export function useBookSearch(books, initialCategory = 'All') {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(initialCategory)

  const filtered = useMemo(() => {
    let result = books
    if (category !== 'All') {
      result = result.filter(b => b.category === category)
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        b =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
      )
    }
    return result
  }, [books, query, category])

  return { query, setQuery, category, setCategory, filtered }
}
