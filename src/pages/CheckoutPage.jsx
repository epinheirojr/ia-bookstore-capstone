import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { formatPrice, calcShipping } from '../utils/formatters'
import { AddressForm, EMPTY_ADDRESS, validateAddress, isAddressValid } from '../components/checkout/AddressForm'
import { GiftPoints } from '../components/checkout/GiftPoints'
import { PaymentSelector, PAYMENT_METHODS } from '../components/checkout/PaymentSelector'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'

/**
 * SummaryRow — reusable row for the inline order summary panel.
 */
function SummaryRow({ label, value, highlight = false, strikethrough = false }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-400">{label}</span>
      <span
        className={`text-sm font-medium ${
          highlight ? 'text-amber-400' : strikethrough ? 'text-gray-600 line-through' : 'text-gray-200'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

/**
 * CheckoutPage — delivery address + gift points + payment method selection.
 * Route: /checkout
 *
 * On submit: passes all checkout state to /payment via React Router location state.
 * Order creation happens on the Payment page after simulated payment.
 */
export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, itemCount, subtotal, discount, giftPointsRedeemed } = useCart()

  // ── Address state ──────────────────────────────────────────────
  const [address, setAddress] = useState(EMPTY_ADDRESS)
  const [touched, setTouched] = useState(new Set())
  const [addressErrors, setAddressErrors] = useState({})

  function handleAddressChange(name, value) {
    const updated = { ...address, [name]: value }
    setAddress(updated)
    // Re-validate field on change if it has already been touched
    if (touched.has(name)) {
      setAddressErrors(prev => ({
        ...prev,
        [name]: validateAddress(updated)[name],
      }))
    }
  }

  function handleAddressBlur(name) {
    setTouched(prev => new Set([...prev, name]))
    setAddressErrors(prev => ({
      ...prev,
      [name]: validateAddress(address)[name],
    }))
  }

  // ── Payment state ──────────────────────────────────────────────
  const [paymentMethod, setPaymentMethod] = useState(null)

  // ── Derived totals ─────────────────────────────────────────────
  const shipping = calcShipping(subtotal)
  const total = Math.max(0, subtotal - discount + shipping)

  // ── Guard: empty cart ──────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <EmptyState
          title="Your cart is empty"
          message="Add some books before checking out."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/catalogue"
                className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-amber-400"
              >
                Browse Catalogue
              </Link>
              <Link
                to="/cart"
                className="inline-flex items-center justify-center rounded-lg border border-gray-600 px-5 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-gray-400 hover:text-white"
              >
                View Cart
              </Link>
            </div>
          }
        />
      </div>
    )
  }

  // ── Form validity ──────────────────────────────────────────────
  const addressValid = isAddressValid(address)
  const canSubmit = addressValid && paymentMethod !== null

  // ── Submit handler — forwards state to /payment ────────────────
  function handleSubmit(e) {
    e.preventDefault()

    // Touch all fields to surface any un-touched errors
    const allErrors = validateAddress(address)
    setAddressErrors(allErrors)
    setTouched(new Set(Object.keys(address)))

    if (!addressValid || !paymentMethod) return

    // Pass all checkout info to the Payment page via location state
    navigate('/payment', {
      state: {
        checkoutState: {
          items: items.map(i => ({ book: i.book, quantity: i.quantity })),
          address,
          paymentMethod,
          giftPointsUsed: giftPointsRedeemed ? 1000 : 0,
          subtotal,
          discount,
          shipping,
          total,
        },
      },
    })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page header */}
      <header className="mb-8">
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link
                to="/cart"
                className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
              >
                Cart
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-700">/</li>
            <li className="text-gray-300" aria-current="page">Checkout</li>
          </ol>
        </nav>
        <h1 className="text-3xl font-bold tracking-tight text-white">Checkout</h1>
        <p className="mt-1 text-sm text-gray-400">
          {itemCount} item{itemCount !== 1 ? 's' : ''} in your order
        </p>
      </header>

      {/* Two-column layout: form + summary */}
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-label="Checkout form"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">

          {/* ── Left: form sections ── */}
          <div className="flex flex-col gap-10">

            {/* 1. Delivery Address */}
            <AddressForm
              address={address}
              errors={addressErrors}
              onChange={handleAddressChange}
              touched={touched}
              onBlur={handleAddressBlur}
            />

            {/* Divider */}
            <hr className="border-gray-800" />

            {/* 2. Gift Points */}
            <GiftPoints />

            {/* Divider */}
            <hr className="border-gray-800" />

            {/* 3. Payment Method */}
            <PaymentSelector
              selected={paymentMethod}
              onChange={setPaymentMethod}
            />
          </div>

          {/* ── Right: sticky order summary ── */}
          <aside
            aria-label="Order summary"
            className="lg:sticky lg:top-24 self-start"
          >
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <h2 className="mb-4 text-lg font-bold text-white">
                {/* Step 4 indicator */}
                <span className="inline-flex items-center gap-2">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-gray-900"
                    aria-hidden="true"
                  >
                    4
                  </span>
                  Order Summary
                </span>
              </h2>

              {/* Item list */}
              <ul className="mb-4 flex flex-col gap-3" aria-label="Items in order">
                {items.map(({ book, quantity }) => (
                  <li key={book.id} className="flex items-center gap-3">
                    <img
                      src={book.coverUrl}
                      alt={`Cover of ${book.title}`}
                      className="h-12 w-8 rounded object-cover shrink-0"
                      onError={e => {
                        e.currentTarget.src = `https://placehold.co/32x48/1f2937/9ca3af?text=📖`
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-medium text-gray-200">{book.title}</p>
                      <p className="text-xs text-gray-500">
                        {formatPrice(book.price)} × {quantity}
                      </p>
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
                  <SummaryRow label={`Subtotal (${itemCount} items)`} value={formatPrice(subtotal)} />
                  <SummaryRow
                    label="Shipping"
                    value={shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    highlight={shipping === 0}
                  />
                  {giftPointsRedeemed && (
                    <SummaryRow
                      label="Gift Points (1,000 pts)"
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
                  <p className="mt-1 text-xs text-gray-500">Tax included where applicable</p>
                </div>
              </div>

              {/* Selected payment method */}
              {paymentMethod && (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-gray-300">
                    {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.label}
                  </p>
                </div>
              )}

              {/* Submit CTA */}
              <Button
                type="submit"
                variant="primary"
                disabled={!canSubmit}
                className="mt-6 w-full py-3 text-base"
                aria-disabled={!canSubmit}
                aria-label={
                  !addressValid
                    ? 'Complete the delivery address to continue'
                    : !paymentMethod
                    ? 'Select a payment method to continue'
                    : 'Continue to Payment'
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                </svg>
                Continue to Payment
              </Button>

              {/* Validation hint */}
              {!canSubmit && (
                <p className="mt-2 text-center text-xs text-gray-500" aria-live="polite">
                  {!addressValid
                    ? 'Please complete the delivery address.'
                    : 'Please select a payment method.'}
                </p>
              )}

              {/* Back to cart */}
              <div className="mt-4 text-center">
                <Link
                  to="/cart"
                  className="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-300 transition-colors
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
                >
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </div>
  )
}
