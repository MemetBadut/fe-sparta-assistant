import { http } from './api'

export interface Category {
  id: string
  label: string
}

export const categoryService = {
  list: () => http.get<{ data: Category[] }>('/categories').then((res) => res.data),
}
