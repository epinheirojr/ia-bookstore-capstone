import { createContext, useReducer, useEffect } from 'react'
import { loadFromStorage, saveToStorage } from '../utils/storage'

export const OrderContext = createContext(null)

const STORAGE_KEY = 'pt_orders'

const initialState = {
  orders: [], // [{ id, date, items, address, paymentMethod, giftPointsUsed, subtotal, discount, shipping, total }]
}

function orderReducer(state, action) {
  switch (action.type) {
    case 'PLACE_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] }
    default:
      return state
  }
}

/**
 * Load persisted order state from localStorage, validating the shape.
 * Falls back to initialState if stored value is missing or malformed.
 */
function loadInitialOrderState() {
  const stored = loadFromStorage(STORAGE_KEY, null)
  if (stored && Array.isArray(stored.orders)) {
    return stored
  }
  return initialState
}

export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(orderReducer, undefined, loadInitialOrderState)

  // Persist to localStorage on every state change
  useEffect(() => {
    saveToStorage(STORAGE_KEY, state)
  }, [state])

  return (
    <OrderContext.Provider value={{ state, dispatch }}>
      {children}
    </OrderContext.Provider>
  )
}
