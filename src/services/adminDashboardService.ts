import { http } from './api'

export interface AdminDashboardSummary {
  open_tickets: number
  in_progress_tickets: number
  resolved_tickets: number
  knowledge_articles: number
}

export interface AdminDashboardTicket {
  ticket_number: string
  name: string
  issue_title: string
  category: string
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  created_at: string
}

export interface AdminDashboardArticle {
  id: number
  title: string
  category: string
  status: 'Draft' | 'Published'
  updated_at: string
}

export interface AdminDashboardData {
  summary: AdminDashboardSummary
  tickets_by_category: Record<string, number>
  recent_tickets: AdminDashboardTicket[]
  recent_articles: AdminDashboardArticle[]
}

export const adminDashboardService = {
  get: () => http.get<{ data: AdminDashboardData }>('/admin/dashboard').then((res) => res.data),
}
