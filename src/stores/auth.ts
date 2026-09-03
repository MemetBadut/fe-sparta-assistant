import { defineStore } from 'pinia'
import { http } from '@/services/api'

interface User {
  id: number
  name: string
  email: string
  employee_id: string | null
  division: string | null
  role: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    checked: false,
  }),

  getters: {
    isAuthenticated: (state) => state.user !== null,
  },

  actions: {
    async login(email: string, password: string) {
      const res = await http.post<{ data: User }>('/auth/login', { email, password })
      this.user = res.data
      this.checked = true
    },

    async logout() {
      await http.post('/auth/logout', {})
      this.user = null
    },

    async fetchUser() {
      try {
        const res = await http.get<{ data: User }>('/profile')
        this.user = res.data
      } catch {
        this.user = null
      } finally {
        this.checked = true
      }
    },
  },
})
