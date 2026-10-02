import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useOrders } from '../hooks/useOrders'
import { useCart } from '../hooks/useCart'
import { formatPrice, generateOrderId } from '../utils/formatters'
import { PAYMENT_LABELS } from '../utils/paymentLabels'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'

// ─── Shared helpers ────────────────────────────────────────────────────────

/**
 * SummaryRow — labelled value row used in the order summary panel.
 */
function SummaryRow({ label, value, highlight = false }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-gray-400">{label}</span>
      <span className={`text-sm font-medium ${highlight ? 'text-amber-400' : 'text-gray-200'}`}>
        {value}
      </span>
    </div>
  )
}

/**
 * DemoDisclaimer — prominent banner reminding user this is a simulation.
 */
function DemoDisclaimer() {
  return (
    <div
      role="note"
      aria-label="Demo application notice"
      className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
        className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true">
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
      </svg>
      <p className="text-xs text-amber-400">
        <strong>Demo only.</strong> No real payment is processed. Do not enter real card details.
        All data entered here is discarded immediately.
      </p>
    </div>
  )
}

// ─── Payment panels ────────────────────────────────────────────────────────

/**
 * CreditCardPanel — simulated card form. Validates presence of fields only.
 * Explicitly NOT a real payment form — no card data is stored or transmitted.
 */
function CreditCardPanel({ fields, errors, onChange, onBlur, touched }) {
  function input(name, label, opts = {}) {
    const errId = `cc-err-${name}`
    const showErr = touched.has(name) && errors[name]
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={`cc-${name}`} className="text-sm font-medium text-gray-300">
          {label}
        </label>
        <input
          id={`cc-${name}`}
          value={fields[name]}
          onChange={e => onChange(name, e.target.value)}
          onBlur={() => onBlur(name)}
          aria-required="true"
          aria-invalid={showErr ? 'true' : undefined}
          aria-describedby={showErr ? errId : undefined}
          autoComplete="off"
          className={`w-full rounded-md border bg-gray-800 px-3 py-2 text-sm text-gray-100
            placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-amber-500 transition-colors
            ${showErr ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-amber-500'}`}
          {...opts}
        />
        {showErr && (
          <p id={errId} role="alert" className="text-xs text-red-400">{errors[name]}</p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <DemoDisclaimer />
      <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="Demo card details">
        <legend className="sr-only">Simulated credit card details</legend>
        <div className="sm:col-span-2">
          {input('cardName', 'Cardholder Name', { placeholder: 'Jane Smith' })}
        </div>
        <div className="sm:col-span-2">
          {input('cardNumber', 'Demo Card Number', {
            placeholder: '4242 4242 4242 4242',
            maxLength: 19,
          })}
        </div>
        <div>
          {input('expiry', 'Expiration (MM/YY)', { placeholder: '12/27', maxLength: 5 })}
        </div>
        <div>
          {input('cvv', 'CVV', { placeholder: '123', maxLength: 4 })}
        </div>
      </fieldset>
    </div>
  )
}

/**
 * PayPalPanel — simulated PayPal confirmation.
 */
function PayPalPanel({ total }) {
  return (
    <div className="flex flex-col gap-4">
      <DemoDisclaimer />
      <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-700 bg-gray-800/60 p-8 text-center">
        {/* PayPal brand mark (text-based, no external assets) */}
        <div className="flex items-center gap-1 text-2xl font-bold">
          <span className="text-blue-400">Pay</span>
          <span className="text-blue-600">Pal</span>
        </div>
        <p className="text-sm text-gray-300">
          You would be redirected to PayPal to complete a payment of{' '}
          <strong className="text-amber-400">{formatPrice(total)}</strong>.
        </p>
        <p className="text-xs text-gray-500">
          This is a simulated flow. No real PayPal transaction will occur.
        </p>
      </div>
    </div>
  )
}

/**
 * GiftCardPanel — simulated gift card redemption.
 */
function GiftCardPanel({ total, field, error, onChange, onBlur, touched }) {
  const showErr = touched && error
  const errId = 'gc-err-code'
  return (
    <div className="flex flex-col gap-4">
      <DemoDisclaimer />
      <div className="rounded-xl border border-gray-700 bg-gray-800/60 p-6">
        <div className="mb-4 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
            className="h-8 w-8 text-amber-400" aria-hidden="true">
            <path fillRule="evenodd" d="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v3.026a.75.75 0 0 1-.375.65 2.249 2.249 0 0 0 0 3.898.75.75 0 0 1 .375.65v3.026c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 17.625v-3.026a.75.75 0 0 1 .374-.65 2.249 2.249 0 0 0 0-3.898.75.75 0 0 1-.374-.65V6.375Zm15-1.125a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm.75 4.5a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75Zm-.75 3a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75a.75.75 0 0 1 .75-.75Zm.75 4.5a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-.75ZM6 12a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 12Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold text-white">PageTurner Gift Card</p>
            <p className="text-xs text-gray-400">Enter your gift card code below</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="gc-code" className="text-sm font-medium text-gray-300">
            Gift Card Code
          </label>
          <input
            id="gc-code"
            value={field}
            onChange={e => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder="DEMO-XXXX-XXXX"
            maxLength={16}
            aria-required="true"
            aria-invalid={showErr ? 'true' : undefined}
            aria-describedby={showErr ? errId : undefined}
            autoComplete="off"
            className={`w-full rounded-md border bg-gray-800 px-3 py-2 text-sm text-gray-100
              placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:border-amber-500 uppercase
              ${showErr ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-amber-500'}`}
          />
          {showErr && <p id={errId} role="alert" className="text-xs text-red-400">{error}</p>}
        </div>
        <p className="mt-3 text-sm text-gray-300">
          Simulated total to pay:{' '}
          <strong className="text-amber-400">{formatPrice(total)}</strong>
        </p>
      </div>
    </div>
  )
}

// ─── PaymentPage ───────────────────────────────────────────────────────────

const PAYMENT_ICONS = {
  credit_card: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
      <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
    </svg>
  ),
  paypal: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm0 8.625a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM15.375 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clipRule="evenodd" />
    </svg>
  ),
  gift_card: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path fillRule="evenodd" d="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v3.026a.75.75 0 0 1-.375.65 2.249 2.249 0 0 0 0 3.898.75.75 0 0 1 .375.65v3.026c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 17.625v-3.026a.75.75 0 0 1 .374-.65 2.249 2.249 0 0 0 0-3.898.75.75 0 0 1-.374-.65V6.375Zm15-1.125a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm.75 4.5a.75.75 0 0 0-1.5 0v.75a.75.75 0 0 0 1.5 0v-.75Zm-.75 3a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75a.75.75 0 0 1 .75-.75Zm.75 4.5a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-.75ZM6 12a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 12Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
    </svg>
  ),
}

/**
 * PaymentPage — simulated payment step.
 * Route: /payment
 *
 * Reads checkoutState from React Router location.state (set by CheckoutPage).
 * Validates simulated payment fields, then:
 *   1. Calls placeOrder() to record the order in OrderContext
 *   2. Calls clearCart() to empty the cart
 *   3. Navigates to /confirmation/:orderId
 *
 * Guards against direct access (missing state).
 */
export default function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { placeOrder } = useOrders()
  const { clearCart } = useCart()

  const checkoutState = location.state?.checkoutState ?? null

  // ── Credit card simulated fields ───────────────────────────────
  const [ccFields, setCcFields] = useState({ cardName: '', cardNumber: '', expiry: '', cvv: '' })
  const [ccErrors, setCcErrors] = useState({})
  const [ccTouched, setCcTouched] = useState(new Set())

  // ── Gift card simulated field ──────────────────────────────────
  const [gcCode, setGcCode] = useState('')
  const [gcError, setGcError] = useState('')
  const [gcTouched, setGcTouched] = useState(false)

  // ── Processing state ───────────────────────────────────────────
  const [processing, setProcessing] = useState(false)

  // ── Guard: no checkout state ───────────────────────────────────
  if (!checkoutState) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <EmptyState
          title="No checkout information found"
          message="Please complete the checkout form before proceeding to payment."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="primary">
                <Link to="/cart" className="contents">View Cart</Link>
              </Button>
              <Button variant="secondary">
                <Link to="/checkout" className="contents">Return to Checkout</Link>
              </Button>
            </div>
          }
        />
      </div>
    )
  }

  const { items, address, paymentMethod, subtotal, discount, shipping, total, giftPointsUsed } = checkoutState

  // ── Credit card validation ─────────────────────────────────────
  function validateCcFields(fields) {
    const errs = {}
    if (!fields.cardName.trim()) errs.cardName = 'Cardholder name is required.'
    if (!fields.cardNumber.trim()) errs.cardNumber = 'Demo card number is required.'
    if (!fields.expiry.trim()) errs.expiry = 'Expiration is required.'
    if (!fields.cvv.trim()) errs.cvv = 'CVV is required.'
    return errs
  }

  function handleCcChange(name, value) {
    const updated = { ...ccFields, [name]: value }
    setCcFields(updated)
    if (ccTouched.has(name)) {
      setCcErrors(validateCcFields(updated))
    }
  }

  function handleCcBlur(name) {
    setCcTouched(prev => new Set([...prev, name]))
    setCcErrors(validateCcFields(ccFields))
  }

  // ── Gift card validation ───────────────────────────────────────
  function validateGcCode(value) {
    if (!value.trim()) return 'Gift card code is required.'
    return ''
  }

  function handleGcChange(value) {
    setGcCode(value)
    if (gcTouched) setGcError(validateGcCode(value))
  }

  function handleGcBlur() {
    setGcTouched(true)
    setGcError(validateGcCode(gcCode))
  }

  // ── Payment submission ─────────────────────────────────────────
  function handleSubmit(e) {
    e.preventDefault()

    // Validate per-method simulated fields
    if (paymentMethod === 'credit_card') {
      const errs = validateCcFields(ccFields)
      setCcErrors(errs)
      setCcTouched(new Set(Object.keys(ccFields)))
      if (Object.values(errs).some(Boolean)) return
    }

    if (paymentMethod === 'gift_card') {
      const err = validateGcCode(gcCode)
      setGcError(err)
      setGcTouched(true)
      if (err) return
    }

    setProcessing(true)

    // Simulate a 1s payment processing delay
    setTimeout(() => {
      const orderId = generateOrderId()
      const order = {
        id: orderId,
        date: new Date().toISOString(),
        items,
        address,
        paymentMethod,
        giftPointsUsed,
        subtotal,
        discount,
        shipping,
        total,
      }
      placeOrder(order)
      clearCart()
      navigate(`/confirmation/${orderId}`, { state: { order }, replace: true })
    }, 1000)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

      {/* Breadcrumb */}
      <header className="mb-8">
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link to="/cart" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded">
                Cart
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-700">/</li>
            <li>
              <Link to="/checkout" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded">
                Checkout
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-700">/</li>
            <li className="text-gray-300" aria-current="page">Payment</li>
          </ol>
        </nav>
        <h1 className="text-3xl font-bold tracking-tight text-white">Payment</h1>
        <p className="mt-1 text-sm text-gray-400">
          Simulated payment — no real transaction will occur
        </p>
      </header>

      {/* Two-column layout */}
      <form onSubmit={handleSubmit} noValidate aria-label="Payment form">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">

          {/* ── Left: payment method panel ── */}
          <div className="flex flex-col gap-8">

            {/* Payment method header */}
            <section aria-labelledby="payment-method-heading">
              <div className="mb-5 flex items-center gap-3">
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 p-2 text-amber-400">
                  {PAYMENT_ICONS[paymentMethod]}
                </span>
                <div>
                  <h2 id="payment-method-heading" className="text-lg font-bold text-white">
                    {PAYMENT_LABELS[paymentMethod]}
                  </h2>
                  <p className="text-xs text-gray-500">Selected at checkout</p>
                </div>
              </div>

              {paymentMethod === 'credit_card' && (
                <CreditCardPanel
                  fields={ccFields}
                  errors={ccErrors}
                  onChange={handleCcChange}
                  onBlur={handleCcBlur}
                  touched={ccTouched}
                />
              )}
              {paymentMethod === 'paypal' && (
                <PayPalPanel total={total} />
              )}
              {paymentMethod === 'gift_card' && (
                <GiftCardPanel
                  total={total}
                  field={gcCode}
                  error={gcError}
                  onChange={handleGcChange}
                  onBlur={handleGcBlur}
                  touched={gcTouched}
                />
              )}
            </section>

            {/* Delivery summary */}
            <section aria-labelledby="delivery-summary-heading">
              <h2 id="delivery-summary-heading" className="mb-3 text-base font-semibold text-white">
                Delivering to
              </h2>
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 text-sm text-gray-300">
                <p className="font-medium text-white">{address.fullName}</p>
                <p>{address.street}{address.apartment ? `, ${address.apartment}` : ''}</p>
                <p>{address.city}, {address.state} {address.zip}</p>
                <p>{address.country}</p>
              </div>
            </section>
          </div>

          {/* ── Right: sticky order summary ── */}
          <aside aria-label="Order summary" className="lg:sticky lg:top-24 self-start">
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <h2 className="mb-4 text-lg font-bold text-white">Order Summary</h2>

              {/* Items */}
              <ul className="mb-4 flex flex-col gap-3" aria-label="Items in order">
                {items.map(({ book, quantity }) => (
                  <li key={book.id} className="flex items-center gap-3">
                    <img
                      src={book.coverUrl}
                      alt={`Cover of ${book.title}`}
                      className="h-12 w-8 rounded object-cover shrink-0"
                      onError={e => { e.currentTarget.src = `https://placehold.co/32x48/1f2937/9ca3af?text=📖` }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-medium text-gray-200">{book.title}</p>
                      <p className="text-xs text-gray-500">{formatPrice(book.price)} × {quantity}</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-300 shrink-0">
                      {formatPrice(book.price * quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Totals */}
              <div className="divide-y divide-gray-800 border-t border-gray-800">
                <div className="pt-1">
                  <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />
                  <SummaryRow
                    label="Shipping"
                    value={shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    highlight={shipping === 0}
                  />
                  {discount > 0 && (
                    <SummaryRow
                      label="Gift Points"
                      value={`−${formatPrice(discount)}`}
                      highlight
                    />
                  )}
                </div>
                <div className="pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Total</span>
                    <span className="text-xl font-bold text-amber-400">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Complete Payment CTA */}
              <Button
                type="submit"
                variant="primary"
                disabled={processing}
                className="mt-6 w-full py-3 text-base"
                aria-label="Complete simulated payment"
              >
                {processing ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Processing payment…
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                    Complete Payment — {formatPrice(total)}
                  </>
                )}
              </Button>

              {/* Back to checkout */}
              <div className="mt-4 text-center">
                <Link
                  to="/checkout"
                  className="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-300 transition-colors
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
                >
                  ← Back to Checkout
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </div>
  )
}
