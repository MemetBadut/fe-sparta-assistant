import { defineStore } from 'pinia'
import { ticketService, type Ticket } from '@/services/ticketService'

export const useTicketStore = defineStore('ticket', {
  state: () => ({
    tickets: [] as Ticket[],
    loading: false,
    error: '',
  }),
  getters: {
    recent: (s) =>
      [...s.tickets].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    stats: (s) => ({
      total: s.tickets.length,
      open: s.tickets.filter((t) => t.status === 'open').length,
      inProgress: s.tickets.filter((t) => t.status === 'in_progress').length,
      resolved: s.tickets.filter((t) => t.status === 'resolved').length,
    }),
    volumeByCategory: (s) => {
      const map = new Map<string, number>()
      for (const t of s.tickets) map.set(t.category, (map.get(t.category) ?? 0) + 1)
      const max = Math.max(1, ...map.values())
      return [...map.entries()].map(([category, count]) => ({
        category,
        count,
        pct: (count / max) * 100,
      }))
    },
  },
  actions: {
    async fetchTickets() {
      this.loading = true
      this.error = ''
      try {
        this.tickets = await ticketService.list()
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Failed to load tickets'
      } finally {
        this.loading = false
      }
    },
  },
})
