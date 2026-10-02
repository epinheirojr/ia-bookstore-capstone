import { Link } from 'react-router-dom'

/**
 * Footer — site-wide footer with navigation links.
 */
export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Brand */}
          <p className="text-sm font-semibold text-white">
            Page<span className="text-amber-500">Turner</span>
          </p>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/catalogue', label: 'Catalogue' },
                { to: '/cart', label: 'Cart' },
                { to: '/orders', label: 'Orders' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-gray-400 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} PageTurner. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
