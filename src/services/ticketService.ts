import { http } from './api'

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent'
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed'

export interface Ticket {
  ticket_number: string
  name: string
  division: string
  issue_title: string
  description: string
  category: string
  device_code: string | null
  priority: TicketPriority
  status: TicketStatus
  assigned_technician: string | null
  repair_required: boolean
  troubleshooting_history: string | null
  resolution_notes?: string | null
  created_at: string
  updated_at: string
}

interface Paginated<T> {
  data: T[]
}

export const ticketService = {
  list: () => http.get<Paginated<Ticket>>('/tickets').then((res) => res.data),
  get: (ticketNumber: string) =>
    http.get<{ data: Ticket }>(`/tickets/${ticketNumber}`).then((res) => res.data),
  create: (payload: {
    name: string
    division: string
    issue_title: string
    description: string
    category: string
    priority: TicketPriority
    device_code?: string
    troubleshooting_result_id?: number
  }) => http.post<{ data: Ticket }>('/tickets', payload).then((res) => res.data),
}
