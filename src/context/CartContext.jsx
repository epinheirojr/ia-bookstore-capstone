import { createContext, useReducer, useEffect } from 'react'
import { loadFromStorage, saveToStorage } from '../utils/storage'

export const CartContext = createContext(null)

const STORAGE_KEY = 'pt_cart'

const initialState = {
  items: [],              // [{ book, quantity }]
  giftPointsRedeemed: false,
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find(i => i.book.id === action.payload.id)
      if (exists) {
        return {
          ...state,
          items: state.items.map(i =>
            i.book.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return { ...state, items: [...state.items, { book: action.payload, quantity: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.book.id !== action.payload) }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(i =>
          i.book.id === action.payload.id
            ? { ...i, quantity: Math.max(1, action.payload.quantity) }
            : i
        ),
      }
    case 'ADD_ORDER_ITEMS': {
      // Buy Again: merge items from a previous order into the cart
      let nextItems = [...state.items]
      for (const { book, quantity } of action.payload) {
        const exists = nextItems.find(i => i.book.id === book.id)
        if (exists) {
          nextItems = nextItems.map(i =>
            i.book.id === book.id ? { ...i, quantity: i.quantity + quantity } : i
          )
        } else {
          nextItems = [...nextItems, { book, quantity }]
        }
      }
      return { ...state, items: nextItems }
    }
    case 'TOGGLE_GIFT_POINTS':
      return { ...state, giftPointsRedeemed: !state.giftPointsRedeemed }
    case 'CLEAR_CART':
      return { ...initialState }
    default:
      return state
  }
}

/**
 * Load persisted cart state from localStorage, validating the shape.
 * Falls back to initialState if the stored value is missing or malformed.
 */
function loadInitialCartState() {
  const stored = loadFromStorage(STORAGE_KEY, null)
  if (
    stored &&
    Array.isArray(stored.items) &&
    typeof stored.giftPointsRedeemed === 'boolean'
  ) {
    return stored
  }
  return initialState
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialCartState)

  // Persist to localStorage on every state change
  useEffect(() => {
    saveToStorage(STORAGE_KEY, state)
  }, [state])

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}
