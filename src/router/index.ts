import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import TabsPage from '../views/tabs-page/tabs-page.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/home',
  },
  {
    path: '/onboarding',
    component: () => import('@/views/onboarding-page/onboarding-page.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/login',
    component: () => import('@/views/login-page/login-page.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    component: () => import('@/views/register-page/register-page.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/privacy-policy',
    component: () => import('@/views/privacy-policy-page/privacy-policy-page.vue'),
  },
  {
    path: '/tabs/',
    component: TabsPage,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/tabs/home',
      },
      {
        path: 'home',
        component: () => import('@/views/home-page/home-page.vue'),
      },
      {
        path: 'vehicles',
        component: () => import('@/views/vehicles-page/vehicles-page.vue'),
      },
      {
        path: 'orders',
        component: () => import('@/views/orders-page/orders-page.vue'),
      },
      {
        path: 'profile',
        component: () => import('@/views/profile-page/profile-page.vue'),
      },
      {
        path: 'profile/edit',
        component: () => import('@/views/edit-profile-page/edit-profile-page.vue'),
      },
      {
        path: 'maintenance',
        component: () => import('@/views/maintenance-page/maintenance-page.vue'),
      },
      {
        path: 'maintenance/new',
        component: () => import('@/views/maintenance-form-page/maintenance-form-page.vue'),
      },
      {
        path: 'maintenance/:id/edit',
        component: () => import('@/views/maintenance-form-page/maintenance-form-page.vue'),
      },
      {
        path: 'maintenance/:id',
        component: () => import('@/views/maintenance-detail-page/maintenance-detail-page.vue'),
      },
      {
        path: 'vehicle/new',
        component: () => import('@/views/vehicle-form-page/vehicle-form-page.vue'),
      },
      {
        path: 'vehicle/:id/edit',
        component: () => import('@/views/vehicle-form-page/vehicle-form-page.vue'),
      },
      {
        path: 'vehicle/:id',
        component: () => import('@/views/vehicle-detail-page/vehicle-detail-page.vue'),
      },
      {
        path: 'order/:id',
        component: () => import('@/views/order-detail-page/order-detail-page.vue'),
      },
      {
        path: 'vehicle-transfer/:id',
        component: () => import('@/views/vehicle-transfer-page/vehicle-transfer-page.vue'),
      },
      {
        path: 'transfer-confirm',
        component: () => import('@/views/transfer-confirm-page/transfer-confirm-page.vue'),
      },
      {
        path: 'transferred-vehicles',
        component: () => import('@/views/transferred-vehicles-page/transferred-vehicles-page.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guards for authentication
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  // Wait for auth state to be initialized
  if (!authStore.initialized) {
    // Wait for Firebase auth to initialize
    let attempts = 0;
    while (!authStore.initialized && attempts < 50) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest);
  const isAuthenticated = authStore.isAuthenticated;

  // Check if onboarding was completed
  const onboardingCompleted = localStorage.getItem('onboardingCompleted');

  // If not authenticated and trying to access guest routes (login/register)
  // but onboarding not completed, redirect to onboarding
  if (requiresGuest && !isAuthenticated && !onboardingCompleted && to.path !== '/onboarding') {
    next('/onboarding');
    return;
  }

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login with return URL
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    });
  } else if (requiresGuest && isAuthenticated) {
    // Redirect authenticated users to home
    next('/tabs/home');
  } else {
    next();
  }
});

export default router;

