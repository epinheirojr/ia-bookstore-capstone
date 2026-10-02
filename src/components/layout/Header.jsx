import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { Badge } from '../ui/Badge'

/**
 * Header — site-wide navigation bar.
 * Responsive: collapses nav links on mobile to a minimal layout.
 */
export function Header() {
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
          aria-label="PageTurner Bookstore — Home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-7 w-7 text-amber-500"
            aria-hidden="true"
          >
            <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
          </svg>
          <span>
            Page<span className="text-amber-500">Turner</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden items-center gap-6 sm:flex">
          <NavLink
            to="/catalogue"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded px-1 ${
                isActive ? 'text-amber-400' : 'text-gray-300 hover:text-white'
              }`
            }
          >
            Catalogue
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded px-1 ${
                isActive ? 'text-amber-400' : 'text-gray-300 hover:text-white'
              }`
            }
          >
            Orders
          </NavLink>
        </nav>

        {/* Cart icon */}
        <Link
          to="/cart"
          aria-label={`Shopping cart, ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
          className="relative flex items-center gap-1 rounded p-1.5 text-gray-300 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
          </svg>
          {itemCount > 0 && (
            <Badge variant="count" className="absolute -right-1 -top-1 text-[10px]">
              {itemCount}
            </Badge>
          )}
        </Link>
      </div>

      {/* Mobile bottom nav */}
      <nav
        aria-label="Mobile navigation"
        className="flex border-t border-gray-800 sm:hidden"
      >
        {[
          { to: '/', label: 'Home' },
          { to: '/catalogue', label: 'Catalogue' },
          { to: '/orders', label: 'Orders' },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 py-2 text-center text-xs font-medium transition-colors ${
                isActive ? 'text-amber-400' : 'text-gray-400 hover:text-white'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
