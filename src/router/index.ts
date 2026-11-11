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
        { path: 'dashboard', name: 'dashboard', component: () => import('@/pages/DashboardPage.vue') },
        { path: 'analytics', name: 'analytics', component: () => import('@/pages/AnalyticsPage.vue') },
        { path: 'ecommerce', name: 'ecommerce', component: () => import('@/pages/EcommercePage.vue') },
        { path: 'crm', name: 'crm', component: () => import('@/pages/CrmPage.vue') },
        { path: 'pipeline', name: 'pipeline', component: () => import('@/pages/PipelinePage.vue') },
        { path: 'saas', name: 'saas', component: () => import('@/pages/SaasPage.vue') },
        { path: 'finance', name: 'finance', component: () => import('@/pages/FinancePage.vue') },
        { path: 'marketing', name: 'marketing', component: () => import('@/pages/MarketingPage.vue') },
        {
          path: 'project-management',
          name: 'project-management',
          component: () => import('@/pages/ProjectManagementPage.vue'),
        },
        { path: 'charts', name: 'charts', component: () => import('@/pages/ChartsPage.vue') },
        { path: 'assets', name: 'assets', component: () => import('@/pages/AssetsPage.vue') },
        { path: 'procurement', name: 'procurement', component: () => import('@/pages/ProcurementPage.vue') },
        { path: 'inventory', name: 'inventory', component: () => import('@/pages/InventoryPage.vue') },
        { path: 'suppliers', name: 'suppliers', component: () => import('@/pages/SuppliersPage.vue') },
        { path: 'hr', name: 'hr', component: () => import('@/pages/HRPage.vue') },
        { path: 'orders', name: 'orders', component: () => import('@/pages/OrdersPage.vue') },
        { path: 'pos', name: 'pos', component: () => import('@/pages/POSPage.vue') },
        { path: 'products', name: 'products', component: () => import('@/pages/ProductsPage.vue') },
        { path: 'customers', name: 'customers', component: () => import('@/pages/CustomersPage.vue') },
        { path: 'invoices', name: 'invoices', component: () => import('@/pages/InvoicesPage.vue') },
        { path: 'billing', name: 'billing', component: () => import('@/pages/BillingPage.vue') },
        { path: 'pricing', name: 'pricing', component: () => import('@/pages/PricingPage.vue') },
        {
          path: 'customers/:id',
          name: 'customer-detail',
          component: () => import('@/pages/CustomerDetailPage.vue'),
        },
        { path: 'orders/:id', name: 'order-detail', component: () => import('@/pages/OrderDetailPage.vue') },
        {
          path: 'products/:id',
          name: 'product-detail',
          component: () => import('@/pages/ProductDetailPage.vue'),
        },
        { path: 'mail', name: 'mail', component: () => import('@/pages/MailPage.vue') },
        { path: 'chat', name: 'chat', component: () => import('@/pages/ChatPage.vue') },
        { path: 'files', name: 'files', component: () => import('@/pages/FilesPage.vue') },
        { path: 'kanban', name: 'kanban', component: () => import('@/pages/KanbanPage.vue') },
        { path: 'calendar', name: 'calendar', component: () => import('@/pages/CalendarPage.vue') },
        { path: 'wizard', name: 'wizard', component: () => import('@/pages/WizardPage.vue') },
        { path: 'forms', name: 'forms', component: () => import('@/pages/FormsPage.vue') },
        { path: 'ai-chat', name: 'ai-chat', component: () => import('@/pages/AiChatPage.vue') },
        { path: 'editor', name: 'editor', component: () => import('@/pages/EditorPage.vue') },
        { path: 'maps', name: 'maps', component: () => import('@/pages/MapsPage.vue') },
        { path: 'widgets', name: 'widgets', component: () => import('@/pages/WidgetsPage.vue') },
        { path: 'profile', name: 'profile', component: () => import('@/pages/ProfilePage.vue') },
        { path: 'users', name: 'users', component: () => import('@/pages/UsersPage.vue') },
        {
          path: 'notifications',
          name: 'notifications',
          component: () => import('@/pages/NotificationsPage.vue'),
        },
        {
          path: 'settings/appearance',
          name: 'settings-appearance',
          component: () => import('@/pages/SettingsAppearancePage.vue'),
        },
        { path: 'support', name: 'support', component: () => import('@/pages/SupportPage.vue') },
        { path: 'search', name: 'search', component: () => import('@/pages/SearchPage.vue') },
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
