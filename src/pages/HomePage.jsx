import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { books } from '../data/books'
import { useOrders } from '../hooks/useOrders'
import { BookCard } from '../components/book/BookCard'

// ─── Featured book IDs ─────────────────────────────────────────────────────
// Deterministic selection: one from each major category, highest-rated first.
const FEATURED_IDS = ['b001', 'b004', 'b007', 'b010', 'b012', 'b015']

// ─── Category metadata ─────────────────────────────────────────────────────
const CATEGORY_META = [
  {
    name: 'Technology',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
        <path fillRule="evenodd" d="M2.25 5.25a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 0 1-.53 1.28h-9a.75.75 0 0 1-.53-1.28l.621-.622a2.25 2.25 0 0 0 .659-1.59V18h-3a3 3 0 0 1-3-3V5.25Zm1.5 0v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5Z" clipRule="evenodd" />
      </svg>
    ),
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    name: 'Fiction',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
        <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
      </svg>
    ),
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
  {
    name: 'Science',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
        <path fillRule="evenodd" d="M10.5 3.798v5.02a3 3 0 0 1-.879 2.121l-2.377 2.377a9.845 9.845 0 0 1 5.091 1.013 8.315 8.315 0 0 0 5.713.636l.285-.071-3.954-3.955a3 3 0 0 1-.879-2.121v-5.02a23.614 23.614 0 0 0-3 0Zm4.5.138a.75.75 0 0 0 .093-1.495A24.837 24.837 0 0 0 12 2.25a25.048 25.048 0 0 0-3.093.191A.75.75 0 0 0 9 3.936v4.882a1.5 1.5 0 0 1-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0 1 15 8.818V4.936Z" clipRule="evenodd" />
      </svg>
    ),
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
  },
  {
    name: 'History',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
      </svg>
    ),
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
  },
  {
    name: 'Self-Help',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
      </svg>
    ),
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/20',
  },
  {
    name: 'Business',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
        <path fillRule="evenodd" d="M3 2.25a.75.75 0 0 1 .75.75v.54l1.838-.46a9.75 9.75 0 0 1 6.725.738l.108.054A8.25 8.25 0 0 0 18 4.524l3.11-.732a.75.75 0 0 1 .917.81 47.784 47.784 0 0 0 .005 10.337.75.75 0 0 1-.574.812l-3.114.733a9.75 9.75 0 0 1-6.594-.77l-.108-.054a8.25 8.25 0 0 0-5.69-.625l-2.202.55V21a.75.75 0 0 1-1.5 0V3A.75.75 0 0 1 3 2.25Z" clipRule="evenodd" />
      </svg>
    ),
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
]

// ─── Store benefits data ───────────────────────────────────────────────────
const BENEFITS = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
        <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875H5.25a3.375 3.375 0 0 0 6.75 0h3.375a1.875 1.875 0 0 0 1.875-1.875V13.5H15v1.5ZM8.625 17.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" />
        <path d="M19.875 4.5h-1.5v8.25h2.625a1.875 1.875 0 0 0 1.875-1.875v-3c0-1.863-1.512-3.375-3.375-3.375h-.125ZM16.5 8.25h-.375V4.5h.375v3.75ZM18.75 17.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" />
      </svg>
    ),
    title: 'Fast Delivery',
    description: 'Delivered to your door in 3–5 business days.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
      </svg>
    ),
    title: 'Secure Checkout',
    description: 'Simulated secure payment — your details stay private.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
      </svg>
    ),
    title: 'Curated Selection',
    description: 'Handpicked titles across 6 knowledge-enriching categories.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
        <path fillRule="evenodd" d="M15.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H7.5a.75.75 0 0 1 0-1.5h11.69l-3.22-3.22a.75.75 0 0 1 0-1.06Zm-7.94 9a.75.75 0 0 1 0 1.06l-3.22 3.22H16.5a.75.75 0 0 1 0 1.5H4.81l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
      </svg>
    ),
    title: 'Easy Returns',
    description: 'Changed your mind? Hassle-free returns within 30 days.',
  },
]

// ─── Sub-components ────────────────────────────────────────────────────────

/**
 * SectionHeader — consistent section title + optional subtitle + CTA.
 */
function SectionHeader({ id, title, subtitle, ctaLabel, ctaTo }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 id={id} className="text-2xl font-bold text-white sm:text-3xl">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
      </div>
      {ctaLabel && ctaTo && (
        <Link
          to={ctaTo}
          className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors
            underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
          aria-label={ctaLabel}
        >
          {ctaLabel} →
        </Link>
      )}
    </div>
  )
}

/**
 * CategoryCard — a single clickable category tile.
 */
function CategoryCard({ meta }) {
  return (
    <Link
      to={`/catalogue?category=${encodeURIComponent(meta.name)}`}
      aria-label={`Browse ${meta.name} books`}
      className={`flex flex-col items-center gap-3 rounded-xl border p-6 text-center
        transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/30
        focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2
        focus-visible:ring-offset-gray-950 ${meta.bg}`}
    >
      <span className={meta.color}>{meta.icon}</span>
      <span className="text-sm font-semibold text-white">{meta.name}</span>
    </Link>
  )
}

/**
 * BenefitCard — a single store benefit tile.
 */
function BenefitCard({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-gray-800 bg-gray-900 p-5">
      <span className="mt-0.5 shrink-0 text-amber-400">{icon}</span>
      <div>
        <p className="font-semibold text-white">{title}</p>
        <p className="mt-1 text-sm text-gray-400">{description}</p>
      </div>
    </div>
  )
}

// ─── HomePage ──────────────────────────────────────────────────────────────

/**
 * HomePage — full landing page.
 *
 * Sections:
 *   1. Hero
 *   2. Store Benefits
 *   3. Featured Books (personalised if order history exists, otherwise deterministic)
 *   4. Browse by Category
 */
export default function HomePage() {
  const { orders } = useOrders()

  // ── Featured books selection ─────────────────────────────────────
  const featuredBooks = useMemo(() => {
    if (orders.length > 0) {
      // Personalised: prefer categories from order history
      const purchasedIds = new Set(orders.flatMap(o => o.items.map(i => i.book.id)))
      const purchasedCategories = new Set(orders.flatMap(o => o.items.map(i => i.book.category)))

      // Books in purchased categories not already bought
      const personalised = books.filter(
        b => !purchasedIds.has(b.id) && purchasedCategories.has(b.category)
      )

      // Pad with deterministic picks if fewer than 6 personalised results
      if (personalised.length >= 6) return personalised.slice(0, 6)

      const fallback = FEATURED_IDS.map(id => books.find(b => b.id === id)).filter(Boolean)
      const merged = [...personalised]
      for (const b of fallback) {
        if (!merged.find(m => m.id === b.id)) merged.push(b)
        if (merged.length >= 6) break
      }
      return merged.slice(0, 6)
    }

    // No order history — deterministic selection
    return FEATURED_IDS.map(id => books.find(b => b.id === id)).filter(Boolean)
  }, [orders])

  const isPersonalised = orders.length > 0

  return (
    <div className="overflow-hidden">

      {/* ── 1. Hero ── */}
      <section
        aria-labelledby="hero-heading"
        className="relative bg-gray-950 px-4 py-20 sm:px-6 lg:px-8"
      >
        {/* Subtle background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-500/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-6 text-center">
            {/* Capstone badge */}
            <span
              className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10
                px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M8 1a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM6.75 7.25a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 .75.75v4.25h.75a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5h.75V8H6.75Z" />
              </svg>
              Applied AI Specialist Capstone
            </span>

            {/* Headline */}
            <h1
              id="hero-heading"
              className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Your next great read{' '}
              <span className="text-amber-400">starts here.</span>
            </h1>

            {/* Supporting text */}
            <p className="max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg">
              Explore our curated catalogue of over{' '}
              <strong className="text-gray-200">{books.length} books</strong> across technology,
              fiction, science, history, self-help, and business.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                to="/catalogue"
                className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-6 py-3 text-base
                  font-semibold text-gray-900 transition-colors hover:bg-amber-400
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2
                  focus-visible:ring-offset-gray-950"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z" />
                  <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                </svg>
                Browse Books
              </Link>
              <Link
                to="/orders"
                className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-gray-800
                  px-6 py-3 text-base font-semibold text-gray-100 transition-colors hover:bg-gray-700
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2
                  focus-visible:ring-offset-gray-950"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path fillRule="evenodd" d="M4 2a2 2 0 0 0-2 2v11a3 3 0 1 0 6 0V4a2 2 0 0 0-2-2H4Zm1 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm5-1.757 4.9-4.9a2 2 0 0 0 0-2.828L13.485 5.1a2 2 0 0 0-2.828 0L10 5.757v8.486ZM16 17H9.071l6-6H16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2Z" clipRule="evenodd" />
                </svg>
                My Orders
              </Link>
            </div>

            {/* Social proof stats */}
            <div className="flex flex-wrap justify-center gap-6 pt-4 text-center">
              {[
                { value: `${books.length}+`, label: 'Books' },
                { value: '6', label: 'Categories' },
                { value: '3–5', label: 'Day Delivery' },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-amber-400">{value}</span>
                  <span className="text-xs text-gray-500">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Store Benefits ── */}
      <section
        aria-labelledby="benefits-heading"
        className="bg-gray-900/50 px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <h2 id="benefits-heading" className="sr-only">Why shop at PageTurner</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map(b => (
              <BenefitCard key={b.title} {...b} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Featured Books ── */}
      <section
        aria-labelledby="featured-heading"
        className="px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            id="featured-heading"
            title={isPersonalised ? 'Recommended for You' : 'Featured Books'}
            subtitle={
              isPersonalised
                ? 'Based on your reading history'
                : 'Handpicked titles across every category'
            }
            ctaLabel="View all books"
            ctaTo="/catalogue"
          />

          {/* Responsive grid — same grid used by BookGrid, without the wrapper component to avoid redundancy */}
          <ul
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
            role="list"
            aria-label="Featured books"
          >
            {featuredBooks.map(book => (
              <li key={book.id} role="listitem">
                <BookCard book={book} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 4. Browse by Category ── */}
      <section
        aria-labelledby="categories-heading"
        className="bg-gray-900/50 px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            id="categories-heading"
            title="Browse by Category"
            subtitle="Find exactly what you're looking for"
            ctaLabel="Browse all books"
            ctaTo="/catalogue"
          />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORY_META.map(meta => (
              <CategoryCard key={meta.name} meta={meta} />
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
