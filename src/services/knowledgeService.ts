import { http } from './api'

export interface KnowledgeArticle {
  id: number
  title: string
  category: string
  symptoms: string
  keywords: string | null
  problem_description: string
  steps: string[]
  expected_result: string
  status: 'Draft' | 'Published'
  updated_by: number | null
  created_at: string | null
  updated_at: string | null
}

export type KnowledgeArticleInput = Pick<
  KnowledgeArticle,
  'title' | 'category' | 'symptoms' | 'keywords' | 'problem_description' | 'steps' | 'expected_result' | 'status'
>

interface Paginated<T> {
  data: T[]
}

export const KnowledgeService = {
  list: () => http.get<Paginated<KnowledgeArticle>>('/admin/articles').then((res) => res.data),

  create: (payload: KnowledgeArticleInput) =>
    http.post<{ data: KnowledgeArticle }>('/admin/articles', payload).then((res) => res.data),

  update: (id: number, payload: Partial<KnowledgeArticleInput>) =>
    http.patch<{ data: KnowledgeArticle }>(`/admin/articles/${id}`, payload).then((res) => res.data),

  remove: (id: number) => http.delete<void>(`/admin/articles/${id}?confirm=1`),
}
