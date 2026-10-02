/**
 * StarRating — renders up to 5 filled/empty stars for a given rating value.
 * Shared between BookCard and BookDetailPage.
 *
 * @param {number} rating   - Numeric rating (e.g. 4.8)
 * @param {string} size     - 'sm' (3.5 / card) | 'md' (5 / detail page)
 */
export function StarRating({ rating, size = 'sm' }) {
  const starSize = size === 'md' ? 'h-5 w-5' : 'h-3.5 w-3.5'
  const textSize = size === 'md' ? 'text-sm' : 'text-xs'

  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Rating: ${rating} out of 5`}
      role="img"
    >
      {[1, 2, 3, 4, 5].map(star => {
        const filled = star <= Math.floor(rating)
        const partial = !filled && star === Math.ceil(rating) && rating % 1 !== 0
        return (
          <svg
            key={star}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            aria-hidden="true"
            className={`${starSize} ${filled || partial ? 'text-amber-400' : 'text-gray-600'}`}
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
              clipRule="evenodd"
            />
          </svg>
        )
      })}
      <span className={`ml-1 ${textSize} text-gray-400`}>{rating.toFixed(1)}</span>
    </div>
  )
}
