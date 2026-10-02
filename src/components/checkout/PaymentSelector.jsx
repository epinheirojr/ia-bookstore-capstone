/**
 * PaymentSelector — radio-button group for choosing a payment method.
 *
 * This is a demo application. No real payment credentials are collected or stored.
 *
 * Props:
 *   selected  — currently selected method id string | null
 *   onChange  — (methodId) => void
 */

const PAYMENT_METHODS = [
  {
    id: 'credit_card',
    label: 'Credit / Debit Card',
    description: 'Visa, Mastercard, Amex — simulated, no real data collected',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
        <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: 'paypal',
    label: 'PayPal',
    description: 'Simulated PayPal checkout — no real transaction',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm0 8.625a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM15.375 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: 'gift_card',
    label: 'Gift Card',
    description: 'Redeem a PageTurner gift card — simulated',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path fillRule="evenodd" d="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v3.026a.75.75 0 0 1-.375.65 2.249 2.249 0 0 0 0 3.898.75.75 0 0 1 .375.65v3.026c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 17.625v-3.026a.75.75 0 0 1 .374-.65 2.249 2.249 0 0 0 0-3.898.75.75 0 0 1-.374-.65V6.375Zm15-1.125a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm.75 4.5a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75Zm-.75 3a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75a.75.75 0 0 1 .75-.75Zm.75 4.5a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-.75ZM6 12a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 12Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
      </svg>
    ),
  },
]

export { PAYMENT_METHODS }

export function PaymentSelector({ selected, onChange }) {
  return (
    <section aria-labelledby="payment-heading">
      <h2
        id="payment-heading"
        className="mb-5 flex items-center gap-2 text-lg font-bold text-white"
      >
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-gray-900"
          aria-hidden="true"
        >
          3
        </span>
        Payment Method
      </h2>

      <p className="mb-3 text-xs text-gray-500">
        This is a demo application. No real payment data is collected or processed.
      </p>

      <fieldset aria-label="Select payment method">
        <legend className="sr-only">Select a payment method</legend>
        <div className="flex flex-col gap-3">
          {PAYMENT_METHODS.map(method => {
            const isSelected = selected === method.id
            return (
              <label
                key={method.id}
                htmlFor={`payment-${method.id}`}
                className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4
                  transition-colors hover:border-amber-500/50
                  ${isSelected
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-gray-700 bg-gray-900 hover:bg-gray-800/50'
                  }`}
              >
                {/* Radio input */}
                <input
                  type="radio"
                  id={`payment-${method.id}`}
                  name="payment-method"
                  value={method.id}
                  checked={isSelected}
                  onChange={() => onChange(method.id)}
                  className="h-4 w-4 cursor-pointer accent-amber-500
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500
                    focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
                />

                {/* Icon */}
                <span className={isSelected ? 'text-amber-400' : 'text-gray-400'}>
                  {method.icon}
                </span>

                {/* Label + description */}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                    {method.label}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">{method.description}</p>
                </div>

                {/* Selected indicator */}
                {isSelected && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0 text-amber-400" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                  </svg>
                )}
              </label>
            )
          })}
        </div>
      </fieldset>

      {/* Validation nudge */}
      {selected === null && (
        <p className="mt-3 text-xs text-gray-500" aria-live="polite">
          Please select a payment method to continue.
        </p>
      )}
    </section>
  )
}
