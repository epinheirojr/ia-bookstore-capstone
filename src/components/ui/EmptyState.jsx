/**
 * EmptyState — shown when a list has no results.
 */
export function EmptyState({ title = 'Nothing here yet', message = '', action = null }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-12 w-12 text-gray-600"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
      <div>
        <p className="text-lg font-semibold text-gray-300">{title}</p>
        {message && <p className="mt-1 text-sm text-gray-500">{message}</p>}
      </div>
      {action}
    </div>
  )
}
