import { create } from 'zustand'
import api from '../api/axios'

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const res = await api.post('/login', { email, password })
      localStorage.setItem('token', res.data.access_token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      set({ user: res.data.user, token: res.data.access_token, isLoading: false })
      return res.data
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true })
    try {
      const res = await api.post('/register', { name, email, password })
      localStorage.setItem('token', res.data.access_token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      set({ user: res.data.user, token: res.data.access_token, isLoading: false })
      return res.data
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  },

  isAuthenticated: () => !!get().token,
  isAdmin: () => get().user?.is_admin === true,
}))

export default useAuthStore
