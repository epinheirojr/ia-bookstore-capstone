/**
 * SearchBar — controlled input with optional debounce via onChange.
 */
export function SearchBar({ value, onChange, placeholder = 'Search books or authors…', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400"
      >
        {/* magnifying glass icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <input
        type="search"
        role="searchbox"
        aria-label="Search books"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-700 bg-gray-800 py-2 pl-10 pr-4 text-sm text-gray-100
          placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
      />
    </div>
  )
}
