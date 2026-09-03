import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/admin/DashboardView.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AdminTicketsView from '@/views/admin/TicketsView.vue'
import LoginPage from '@/views/auth/LoginPage.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: DashboardView,
        },
        {
          path: 'tickets',
          name: 'admin-tickets',
          component: AdminTicketsView,
        },
        {
          path: 'knowledge',
          name: 'admin-knowledge',
          component: () => import('@/views/admin/KnowledgeBaseView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  if (!authStore.checked) await authStore.fetchUser()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) return { name: 'login' }
  if (to.name === 'login' && authStore.isAuthenticated) return { name: 'admin-dashboard' }
})

export default router
