import { http } from './api'
import type { Ticket, TicketPriority, TicketStatus } from './ticketService'

interface Paginated<T> {
  data: T[]
  meta?: {
    total?: number
  }
}

export interface AdminTicketFilters {
  search?: string
  category?: string
  status?: TicketStatus | ''
  priority?: TicketPriority | ''
}

function queryString(filters: AdminTicketFilters) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value)
  }
  const query = params.toString()
  return query ? `?${query}` : ''
}

export const adminTicketService = {
  list: (filters: AdminTicketFilters = {}) =>
    http.get<Paginated<Ticket>>(`/admin/tickets${queryString(filters)}`).then((res) => res),
  get: (ticketNumber: string) =>
    http.get<{ data: Ticket }>(`/admin/tickets/${ticketNumber}`).then((res) => res.data),
}
