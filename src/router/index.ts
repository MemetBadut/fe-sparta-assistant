import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/admin/DashboardView.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import AdminTicketsView from '@/views/admin/TicketsView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin',
      component: AdminLayout,
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
      ],
    },
  ],
})

export default router
