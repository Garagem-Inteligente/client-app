import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/home'
  },
  {
    path: '/login',
    component: () => import('@/views/LoginPage.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    component: () => import('@/views/RegisterPage.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/tabs/',
    component: TabsPage,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/tabs/home'
      },
      {
        path: 'home',
        component: () => import('@/views/HomePage.vue')
      },
      {
        path: 'vehicles',
        component: () => import('@/views/VehiclesPage.vue')
      },
      {
        path: 'orders',
        component: () => import('@/views/OrdersPage.vue')
      },
      {
        path: 'profile',
        component: () => import('@/views/ProfilePage.vue')
      },
              {
                path: 'maintenance',
                component: () => import('@/views/MaintenancePage.vue')
              },
              {
                path: 'maintenance/new',
                component: () => import('@/views/MaintenanceFormPage.vue')
              },
              {
                path: 'maintenance/:id/edit',
                component: () => import('@/views/MaintenanceFormPage.vue')
              },
              {
                path: 'maintenance/:id',
                component: () => import('@/views/MaintenanceDetailPage.vue')
              },
      {
        path: 'vehicle/new',
        component: () => import('@/views/VehicleFormPage.vue')
      },
      {
        path: 'vehicle/:id/edit',
        component: () => import('@/views/VehicleFormPage.vue')
      },
      {
        path: 'vehicle/:id',
        component: () => import('@/views/VehicleDetailPage.vue')
      },
      {
        path: 'order/:id',
        component: () => import('@/views/OrderDetailPage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guards for authentication
router.beforeEach(async (to, _from, next) => {
  const { useAuthStore } = await import('../stores/auth')
  const authStore = useAuthStore()
  
  // Wait for auth state to be initialized
  if (!authStore.initialized) {
    // Wait for Firebase auth to initialize
    let attempts = 0
    while (!authStore.initialized && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100))
      attempts++
    }
  }
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const isAuthenticated = authStore.isAuthenticated
  
  if (requiresAuth && !isAuthenticated) {
    // Redirect to login with return URL
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else if (requiresGuest && isAuthenticated) {
    // Redirect authenticated users to home
    next('/tabs/home')
  } else {
    next()
  }
})

export default router
