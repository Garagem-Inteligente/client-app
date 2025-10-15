import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/**
 * Guard para proteger rotas que requerem autenticação
 */
export const requireAuth = (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
}

/**
 * Guard para proteger rotas exclusivas de oficinas
 */
export const requireWorkshop = (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (!authStore.isWorkshop) {
    next({ name: 'Dashboard' }) // Redirecionar para dashboard de usuário
  } else {
    next()
  }
}

/**
 * Guard para proteger rotas exclusivas de usuários (não oficinas)
 */
export const requireUser = (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (authStore.isWorkshop) {
    next({ name: 'WorkshopDashboard' }) // Redirecionar para dashboard de oficina
  } else {
    next()
  }
}

/**
 * Guard para redirecionar usuários autenticados para o dashboard apropriado
 */
export const redirectIfAuthenticated = (
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()
  
  if (authStore.isAuthenticated) {
    if (authStore.isWorkshop) {
      next({ name: 'WorkshopDashboard' })
    } else {
      next({ name: 'Dashboard' })
    }
  } else {
    next()
  }
}
