import { Link } from 'react-router-dom'

/**
 * NotFoundPage — catch-all 404 page.
 * Rendered by the <Route path="*"> in App.jsx.
 */
export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-7xl font-extrabold text-amber-500">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-100">Page not found</h1>
      <p className="mt-2 text-gray-400">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-gray-950 transition hover:bg-amber-400"
      >
        Back to Home
      </Link>
    </div>
  )
}
