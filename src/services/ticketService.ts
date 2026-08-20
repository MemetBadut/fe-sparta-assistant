import { http } from './api'

export type TicketStatus = 'open' | 'in_progress' | 'resolved'
export type TicketPriority = 'low' | 'medium' | 'high'

export interface Ticket {
  id: string
  title: string
  requesterName: string
  category: string
  priority: TicketPriority
  status: TicketStatus
  createdAt: string
  assigneeName?: string
}

export interface TicketStats {
  total: number
  open: number
  inProgress: number
  resolved: number
}

export const ticketService = {
  list: (params?: { status?: TicketStatus; search?: string }) => {
    const q = new URLSearchParams()
    if (params?.status) q.set('status', params.status)
    if (params?.search) q.set('search', params.search)
    const qs = q.toString()
    return http.get<Ticket[]>(`/tickets${qs ? `?${qs}` : ''}`)
  },
  get: (id: string) => http.get<Ticket>(`/tickets/${id}`),
  // ponytail: if BE has no /stats endpoint, derive counts client-side in the store
  stats: () => http.get<TicketStats>('/tickets/stats'),
  update: (id: string, patch: Partial<Pick<Ticket, 'status' | 'priority' | 'assigneeName'>>) =>
    http.put<Ticket>(`/tickets/${id}`, patch),
}
