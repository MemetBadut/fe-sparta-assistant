import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/admin/DashboardView.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import UserLayout from '@/layouts/UserLayout.vue'
import AdminTicketsView from '@/views/admin/TicketsView.vue'
import AdminTicketDetailView from '@/views/admin/TicketDetailView.vue'
import UserDashboardView from '@/views/user/DashboardView.vue'
import LoginPage from '@/views/auth/LoginPage.vue'
import MyTicketsView from '@/views/user/MyTicketsView.vue'
import TicketDetailView from '@/views/user/TicketDetailView.vue'
import TroubleShootingResultView from '@/views/user/TroubleShootingResultView.vue'
import CreateTicketView from '@/views/user/CreateTicketView.vue'
import TicketSuccessView from '@/views/user/TicketSuccessView.vue'
import { useAuthStore, type UserRole } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, role: 'admin' },
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
          path: 'tickets/:ticketNumber',
          name: 'admin-ticket-detail',
          component: AdminTicketDetailView,
        },
        {
          path: 'knowledge',
          name: 'admin-knowledge',
          component: () => import('@/views/admin/KnowledgeBaseView.vue'),
        },
      ],
    },
    {
      path: '/user',
      component: UserLayout,
      meta: { requiresAuth: true, role: 'employee' },
      children: [
        {
          path: 'dashboard',
          name: 'user-dashboard',
          component: UserDashboardView,
        },
        {
          path: 'tickets',
          name: 'user-tickets',
          component: MyTicketsView,
        },
        {
          path: 'tickets/create',
          name: 'user-ticket-create',
          component: CreateTicketView,
        },
        {
          path: 'tickets/success/:ticketNumber',
          name: 'user-ticket-success',
          component: TicketSuccessView,
        },
        {
          path: 'tickets/:ticketNumber',
          name: 'user-ticket-detail',
          component: TicketDetailView,
        },
        {
          path: 'troubleshooting/:id',
          name: 'user-troubleshooting',
          component: TroubleShootingResultView,
        },
      ],
    },
  ],
})

function dashboardFor(role: UserRole) {
  return role === 'admin' ? { name: 'admin-dashboard' } : { name: 'user-dashboard' }
}

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  if (!authStore.checked && to.meta.requiresAuth) await authStore.fetchUser()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) return { name: 'login' }
  if (to.name === 'login' && authStore.isAuthenticated) return dashboardFor(authStore.user!.role)
  if (to.meta.role && to.meta.role !== authStore.user?.role) return dashboardFor(authStore.user!.role)
})

export default router
