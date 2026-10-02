/**
 * Input — styled text input field.
 */
export function Input({ label, id, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500
          disabled:opacity-50 ${className}`}
        {...props}
      />
    </div>
  )
}
