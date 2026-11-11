import { createRouter, createWebHistory } from 'vue-router'
import { getSession } from '@/lib/auth'
import ProtectedLayout from '@/layouts/ProtectedLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AuthLayout,
      children: [
        { path: '', redirect: '/login' },
        { path: 'login', name: 'login', component: () => import('@/pages/LoginPage.vue') },
        { path: 'sign-in', redirect: '/login' },
        { path: 'sign-up', name: 'sign-up', component: () => import('@/pages/SignUpPage.vue') },
      ],
    },
    {
      path: '/',
      component: ProtectedLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/pages/DashboardPage.vue'),
        },
        { path: 'orders', name: 'orders', component: () => import('@/pages/OrdersPage.vue') },
        { path: 'products', name: 'products', component: () => import('@/pages/ProductsPage.vue') },
        { path: 'pos', name: 'pos', component: () => import('@/pages/POSPage.vue') },
        { path: 'users', name: 'users', component: () => import('@/pages/UsersPage.vue') },
        { path: 'customers', name: 'customers', component: () => import('@/pages/CustomersPage.vue') },
        { path: 'invoices', name: 'invoices', component: () => import('@/pages/InvoicesPage.vue') },
        { path: 'billing', name: 'billing', component: () => import('@/pages/BillingPage.vue') },
        { path: 'analytics', name: 'analytics', component: () => import('@/pages/AnalyticsPage.vue') },
        { path: 'charts', name: 'charts', component: () => import('@/pages/ChartsPage.vue') },
        { path: 'assets', name: 'assets', component: () => import('@/pages/AssetsPage.vue') },
        {
          path: 'procurement',
          name: 'procurement',
          component: () => import('@/pages/ProcurementPage.vue'),
        },
        {
          path: 'inventory',
          name: 'inventory',
          component: () => import('@/pages/InventoryPage.vue'),
        },
        {
          path: 'suppliers',
          name: 'suppliers',
          component: () => import('@/pages/SuppliersPage.vue'),
        },
        { path: 'hr', name: 'hr', component: () => import('@/pages/HRPage.vue') },
        { path: 'mail', name: 'mail', component: () => import('@/pages/MailPage.vue') },
        { path: 'chat', name: 'chat', component: () => import('@/pages/ChatPage.vue') },
        { path: 'files', name: 'files', component: () => import('@/pages/FilesPage.vue') },
        { path: 'kanban', name: 'kanban', component: () => import('@/pages/KanbanPage.vue') },
        { path: 'calendar', name: 'calendar', component: () => import('@/pages/CalendarPage.vue') },
      ],
    },
    {
      path: '/docs',
      name: 'docs',
      component: () => import('@/pages/DocsPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard',
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !getSession()) {
    return { path: '/login' }
  }
  if (to.path === '/login' && getSession()) {
    return { path: '/dashboard' }
  }
  return true
})

export default router
