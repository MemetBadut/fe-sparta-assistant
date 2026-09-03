import { defineStore } from 'pinia'
import {
  KnowledgeService,
  type KnowledgeArticle,
  type KnowledgeArticleInput,
} from '@/services/knowledgeService'

export const useKnowledgeStore = defineStore('knowledgeBase', {
  state: () => ({
    articles: [] as KnowledgeArticle[],
    loading: false,
    saving: false,
    error: '',
  }),

  getters: {
    publishedCount: (state) => state.articles.filter((article) => article.published).length,

    draftCount: (state) => state.articles.filter((article) => !article.published).length,

    categories: (state) => [...new Set(state.articles.map((article) => article.category))].sort(),
  },

  actions: {
    async fetchArticles() {
      this.loading = true
      this.error = ''

      try {
        this.articles = await KnowledgeService.list()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load knowledge base'
      } finally {
        this.loading = false
      }
    },

    async createArticle(payload: KnowledgeArticleInput) {
      this.saving = true
      this.error = ''

      try {
        const article = await KnowledgeService.create(payload)
        this.articles.unshift(article)
        return article
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create article'
      } finally {
        this.saving = false
      }
    },

    async updateArticle(id: string, payload: KnowledgeArticleInput) {
      this.saving = true
      this.error = ''

      try {
        const updatedArticle = await KnowledgeService.update(id, payload)
        const index = this.articles.findIndex((article) => article.id === id)

        if (index !== -1) {
          this.articles[index] = updatedArticle
        }

        return updatedArticle
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update article'
      } finally {
        this.saving = false
      }
    },

    async deleteArticle(id: string) {
      this.saving = true
      this.error = ''

      try {
        await KnowledgeService.remove(id)
        this.articles = this.articles.filter((article) => article.id !== id)
        return true
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete article'

        return false
      } finally {
        this.saving = false
      }
    },
  },
})
