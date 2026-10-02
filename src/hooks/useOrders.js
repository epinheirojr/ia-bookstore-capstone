import { useContext } from 'react'
import { OrderContext } from '../context/OrderContext'

export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrders must be used within OrderProvider')
  const { state, dispatch } = ctx

  return {
    orders: state.orders,
    placeOrder: (order) => dispatch({ type: 'PLACE_ORDER', payload: order }),
  }
}
