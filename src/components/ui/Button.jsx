/**
 * Button — reusable button with variant support.
 * Variants: primary | secondary | ghost | danger
 */
export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-amber-500 text-gray-900 hover:bg-amber-400 focus-visible:ring-amber-400',
    secondary:
      'bg-gray-700 text-gray-100 hover:bg-gray-600 focus-visible:ring-gray-400',
    ghost:
      'bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white focus-visible:ring-gray-400',
    danger:
      'bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-400',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
