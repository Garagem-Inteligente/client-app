import { nextTick } from 'vue'
import { useRouter } from 'vue-router'

export function useAuthNavigation() {
  const router = useRouter()

  const navigateToRegister = async () => {
    // Blur any focused element to prevent aria-hidden focus issues during navigation
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    // Wait for next DOM update to ensure blur is applied
    await nextTick()

    // Navigate to register page
    await router.push('/register')
  }

  const navigateToHome = async () => {
    await router.push('/tabs/home')
  }

  const navigateToLogin = async () => {
    // Blur any focused element to prevent aria-hidden focus issues during navigation
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    // Wait for next DOM update to ensure blur is applied
    await nextTick()

    await router.push('/login')
  }

  const navigateToForgotPassword = async () => {
    await router.push('/forgot-password')
  }

  const navigateToPrivacyPolicy = async () => {
    await router.push('/privacy-policy')
  }

  const navigateWithRedirect = async (path: string, redirectTo?: string) => {
    if (redirectTo) {
      await router.push({ path, query: { redirect: redirectTo } })
    } else {
      await router.push(path)
    }
  }

  const getRedirectPath = (): string | null => {
    return router.currentRoute.value.query.redirect as string || null
  }

  return {
    navigateToRegister,
    navigateToHome,
    navigateToLogin,
    navigateToForgotPassword,
    navigateToPrivacyPolicy,
    navigateWithRedirect,
    getRedirectPath
  }
}