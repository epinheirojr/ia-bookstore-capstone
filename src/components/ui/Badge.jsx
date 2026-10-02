/**
 * Badge — small pill label.
 * Variants: default | category | count
 */
export function Badge({ children, variant = 'default', className = '' }) {
  const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'

  const variants = {
    default: 'bg-gray-700 text-gray-300',
    category: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    count: 'bg-amber-500 text-gray-900 min-w-[1.25rem] justify-center',
  }

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
