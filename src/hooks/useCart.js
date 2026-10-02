import { useContext } from 'react'
import { CartContext } from '../context/CartContext'

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  const { state, dispatch } = ctx

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = state.items.reduce((sum, i) => sum + i.book.price * i.quantity, 0)

  // Gift points: 1 000 points = $10 discount
  const GIFT_POINTS_AVAILABLE = 1000
  const GIFT_POINTS_VALUE = 10
  const discount = state.giftPointsRedeemed ? GIFT_POINTS_VALUE : 0
  const total = Math.max(0, subtotal - discount)

  return {
    items: state.items,
    giftPointsRedeemed: state.giftPointsRedeemed,
    itemCount,
    subtotal,
    discount,
    total,
    GIFT_POINTS_AVAILABLE,
    GIFT_POINTS_VALUE,
    addItem: (book) => dispatch({ type: 'ADD_ITEM', payload: book }),
    removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', payload: id }),
    updateQuantity: (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }),
    toggleGiftPoints: () => dispatch({ type: 'TOGGLE_GIFT_POINTS' }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    /** Buy Again: re-add all items from a completed order, preserving quantities */
    buyAgain: (orderItems) => dispatch({ type: 'ADD_ORDER_ITEMS', payload: orderItems }),
  }
}
