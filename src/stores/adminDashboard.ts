import { adminDashboardService, type AdminDashboardData } from '@/services/adminDashboardService'
import { defineStore } from 'pinia'

export const useAdminDashboardStore = defineStore('adminDashboard', {
  state: () => ({
    data: null as AdminDashboardData | null,
    loading: false,
    error: '',
  }),

  getters: {
    volumeByCategory: (s) => {
      if (!s.data) return []
      const entries = Object.entries(s.data.tickets_by_category)
      const max = Math.max(1, ...entries.map(([, count]) => count))
      return entries.map(([category, count]) => ({ category, count, pct: (count / max) * 100 }))
    },
  },

  actions: {
    async fetch() {
      this.loading = true
      this.error = ''
      try {
        this.data = await adminDashboardService.get()
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Failed to load Dashboard'
      } finally {
        this.loading = false
      }
    },
  },
})
