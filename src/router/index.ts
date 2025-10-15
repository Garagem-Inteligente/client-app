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
    meta: { requiresAuth: true, requiresUser: true }
  },
  {
    path: '/vehicles',
    name: 'Vehicles',
    component: () => import('../views/Vehicles.vue'),
    meta: { requiresAuth: true, requiresUser: true }
  },
  {
    path: '/vehicles/:id',
    name: 'VehicleDetails',
    component: () => import('../views/VehicleDetails.vue'),
    meta: { requiresAuth: true, requiresUser: true }
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: () => import('../views/Maintenance.vue'),
    meta: { requiresAuth: true, requiresUser: true }
  },
  {
    path: '/transfers',
    name: 'Transfers',
    component: () => import('../views/Transfers.vue'),
    meta: { requiresAuth: true, requiresUser: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/workshops',
    name: 'Workshops',
    component: () => import('../views/Workshops.vue'),
    meta: { requiresAuth: true, requiresUser: true }
  },
  {
    path: '/workshops/:id',
    name: 'WorkshopDetail',
    component: () => import('../views/WorkshopDetail.vue'),
    meta: { requiresAuth: true, requiresUser: true }
  },
  // Workshop routes
  {
    path: '/workshop/dashboard',
    name: 'WorkshopDashboard',
    component: () => import('../views/workshop/Dashboard.vue'),
    meta: { requiresAuth: true, requiresWorkshop: true }
  },
  {
    path: '/workshop/job-orders',
    name: 'WorkshopJobOrders',
    component: () => import('../views/workshop/JobOrders.vue'),
    meta: { requiresAuth: true, requiresWorkshop: true }
  },
  {
    path: '/workshop/reviews',
    name: 'WorkshopReviews',
    component: () => import('../views/workshop/Reviews.vue'),
    meta: { requiresAuth: true, requiresWorkshop: true }
  },
  {
    path: '/workshop/profile',
    name: 'WorkshopProfile',
    component: () => import('../views/workshop/Profile.vue'),
    meta: { requiresAuth: true, requiresWorkshop: true }
  },
  {
    path: '/select-type',
    name: 'SelectType',
    component: () => import('../views/auth/SelectType.vue'),
    meta: { requiresGuest: true }
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
    path: '/workshop/register',
    name: 'WorkshopRegister',
    component: () => import('../views/workshop/Register.vue'),
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
  const requiresWorkshop = to.matched.some(record => record.meta.requiresWorkshop)
  const requiresUser = to.matched.some(record => record.meta.requiresUser)
  const isAuthenticated = authStore.isAuthenticated
  const isWorkshop = authStore.isWorkshop
  
  if (requiresAuth && !isAuthenticated) {
    // Redirect to login with return URL
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else if (requiresGuest && isAuthenticated) {
    // Redirect authenticated users to appropriate dashboard
    if (isWorkshop) {
      next('/workshop/dashboard')
    } else {
      next('/dashboard')
    }
  } else if (requiresWorkshop && !isWorkshop) {
    // Redirect non-workshop users trying to access workshop routes
    next('/dashboard')
  } else if (requiresUser && isWorkshop) {
    // Redirect workshop users trying to access user-only routes
    next('/workshop/dashboard')
  } else {
    next()
  }
})

export default router