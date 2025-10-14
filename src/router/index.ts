import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Import components
import Home from '../views/Home.vue'
import Features from '../views/Features.vue'
import Pricing from '../views/Pricing.vue'
import Support from '../views/Support.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/features',
    name: 'Features',
    component: Features
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: Pricing
  },
  {
    path: '/support',
    name: 'Support',
    component: Support
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/vehicles',
    name: 'Vehicles',
    component: () => import('../views/Vehicles.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/vehicles/:id',
    name: 'VehicleDetails',
    component: () => import('../views/VehicleDetails.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: () => import('../views/Maintenance.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/transfers',
    name: 'Transfers',
    component: () => import('../views/Transfers.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/Register.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/auth/login',
    redirect: '/login'
  },
  {
    path: '/auth/register',
    redirect: '/register'
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards for authentication
router.beforeEach(async (to, _from, next) => {
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
    // Redirect authenticated users away from auth pages
    next('/dashboard')
  } else {
    next()
  }
})

export default router