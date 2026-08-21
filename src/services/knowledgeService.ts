import { http } from './api'

export interface KnowledgeArticle {
  id: string
  title: string
  category: string
  content: string
  authorName: string
  published: boolean
  updatedAt: string
}

export type KnowledgeArticleInput = Pick<
  KnowledgeArticle,
  'title' | 'category' | 'content' | 'published'
>

export const KnowledgeService = {
  list: () => http.get<KnowledgeArticle[]>('/knowledge'),

  create: (payload: KnowledgeArticleInput) => http.post<KnowledgeArticle>('/knowledge', payload),

  update: (id: string, payload: KnowledgeArticleInput) =>
    http.put<KnowledgeArticle>(`/knowledge/${id}`, payload),

  remove: (id: string) => http.delete<void>(`/knowledge/${id}`),
}
