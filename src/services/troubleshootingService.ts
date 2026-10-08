import { http } from './api'

export interface TroubleshootingArticle {
  id: number
  title: string
  steps: string[]
  expected_result: string
}

export interface TroubleshootingResult {
  id: number
  category: string
  issue_summary: string
  source: 'verified_knowledge_base' | 'general_guidance' | 'no_guidance'
  article: TroubleshootingArticle | null
  general_guidance: string | null
  recommend_ticket: boolean
  helpful?: boolean | null
}

export interface NeedsCategoryResult {
  status: 'needs_category'
  issue_summary: string
  candidates: string[]
}

export type TroubleshootingResponse = TroubleshootingResult | NeedsCategoryResult

export const troubleshootingService = {
  create: (payload: { category?: string; description: string }) =>
    http.post<{ data: TroubleshootingResponse }>('/troubleshooting', payload).then((res) => res.data),
  get: (id: number) => http.get<{ data: TroubleshootingResult }>(`/troubleshooting/${id}`).then((res) => res.data),
  feedback: (id: number, helpful: boolean) =>
    http.post<void>(`/troubleshooting/${id}/feedback`, { helpful }),
}
