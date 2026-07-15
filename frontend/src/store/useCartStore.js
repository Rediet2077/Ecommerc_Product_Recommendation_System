import { create } from 'zustand'
import api from '../api/axios'
import toast from 'react-hot-toast'

const useCartStore = create((set, get) => ({
  items: [],
  isLoading: false,

  fetchCart: async () => {
    try {
      const res = await api.get('/cart')
      set({ items: res.data })
    } catch {}
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      const res = await api.post('/cart', { product_id: productId, quantity })
      await get().fetchCart()
      toast.success('Added to cart')
      return res.data
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add to cart')
      throw err
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      await api.put(`/cart/${itemId}?quantity=${quantity}`)
      await get().fetchCart()
    } catch {}
  },

  removeFromCart: async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`)
      set((state) => ({ items: state.items.filter((i) => i.id !== itemId) }))
      toast.success('Removed from cart')
    } catch {}
  },

  clearCart: async () => {
    try {
      await api.delete('/cart')
      set({ items: [] })
    } catch {}
  },

  getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  getTotalPrice: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
}))

export default useCartStore
