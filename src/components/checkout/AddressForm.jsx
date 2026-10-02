/**
 * REQUIRED_FIELDS — list of fields that must be non-empty to submit.
 * apartment is intentionally absent (optional).
 */
export const REQUIRED_ADDRESS_FIELDS = ['fullName', 'street', 'city', 'state', 'zip', 'country']

export const EMPTY_ADDRESS = {
  fullName: '',
  street: '',
  apartment: '',
  city: '',
  state: '',
  zip: '',
  country: '',
}

/**
 * Validate a single field value.
 * Returns an error string or '' if valid.
 */
export function validateAddressField(name, value) {
  if (REQUIRED_ADDRESS_FIELDS.includes(name) && !value.trim()) {
    return 'This field is required.'
  }
  if (name === 'zip' && value.trim() && !/^[A-Za-z0-9\s\-]{3,10}$/.test(value.trim())) {
    return 'Enter a valid ZIP / postal code.'
  }
  return ''
}

/**
 * Validate all fields, return a map of fieldName → errorString.
 */
export function validateAddress(address) {
  return Object.fromEntries(
    Object.entries(address).map(([key, val]) => [key, validateAddressField(key, val)])
  )
}

/**
 * Returns true if an address object passes all validations.
 */
export function isAddressValid(address) {
  return Object.entries(validateAddress(address)).every(([, err]) => !err)
}

/**
 * FieldError — accessible inline error message for a form field.
 */
function FieldError({ id, message }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="mt-1 text-xs text-red-400">
      {message}
    </p>
  )
}

/**
 * AddressForm — delivery address form section.
 *
 * Props:
 *   address   — current address object
 *   errors    — validation errors map (fieldName → string)
 *   onChange  — (fieldName, value) => void
 *   touched   — set of field names that have been blurred
 *   onBlur    — (fieldName) => void
 */
export function AddressForm({ address, errors, onChange, touched, onBlur }) {
  function field(name, label, opts = {}) {
    const errorId = `addr-error-${name}`
    const showError = touched.has(name) && errors[name]
    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`addr-${name}`}
          className="text-sm font-medium text-gray-300"
        >
          {label}
          {!REQUIRED_ADDRESS_FIELDS.includes(name) && (
            <span className="ml-1 text-xs text-gray-500">(optional)</span>
          )}
        </label>
        <input
          id={`addr-${name}`}
          name={name}
          value={address[name]}
          onChange={e => onChange(name, e.target.value)}
          onBlur={() => onBlur(name)}
          aria-required={REQUIRED_ADDRESS_FIELDS.includes(name)}
          aria-invalid={showError ? 'true' : undefined}
          aria-describedby={showError ? errorId : undefined}
          className={`w-full rounded-md border bg-gray-800 px-3 py-2 text-sm text-gray-100
            placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-amber-500
            disabled:opacity-50 transition-colors
            ${showError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-700 focus:ring-amber-500'
            }`}
          {...opts}
        />
        {showError && <FieldError id={errorId} message={errors[name]} />}
      </div>
    )
  }

  return (
    <section aria-labelledby="address-heading">
      <h2
        id="address-heading"
        className="mb-5 flex items-center gap-2 text-lg font-bold text-white"
      >
        {/* Step indicator */}
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-gray-900" aria-hidden="true">
          1
        </span>
        Delivery Address
      </h2>

      <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="Delivery address">
        <legend className="sr-only">Delivery address</legend>

        {/* Full name — spans both columns */}
        <div className="sm:col-span-2">
          {field('fullName', 'Full Name', { placeholder: 'Jane Smith', autoComplete: 'name' })}
        </div>

        {/* Street — spans both columns */}
        <div className="sm:col-span-2">
          {field('street', 'Street Address', { placeholder: '123 Main St', autoComplete: 'address-line1' })}
        </div>

        {/* Apartment — spans both columns */}
        <div className="sm:col-span-2">
          {field('apartment', 'Apartment, Suite, etc.', { placeholder: 'Apt 4B', autoComplete: 'address-line2' })}
        </div>

        {/* City */}
        {field('city', 'City', { placeholder: 'New York', autoComplete: 'address-level2' })}

        {/* State */}
        {field('state', 'State / Province', { placeholder: 'NY', autoComplete: 'address-level1' })}

        {/* ZIP */}
        {field('zip', 'ZIP / Postal Code', { placeholder: '10001', autoComplete: 'postal-code' })}

        {/* Country */}
        {field('country', 'Country', { placeholder: 'United States', autoComplete: 'country-name' })}
      </fieldset>
    </section>
  )
}
