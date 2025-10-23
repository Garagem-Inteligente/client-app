import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthNavigation } from '@/composables/useAuthNavigation'

// Mock do Vue Router
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  currentRoute: { value: { query: {} } },
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
}))

// Mock do Capacitor
vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: () => false,
  },
}))

describe('useAuthNavigation', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Estado inicial', () => {
    test('deve inicializar corretamente', () => {
      const { getRedirectPath } = useAuthNavigation()

      expect(typeof getRedirectPath).toBe('function')
    })
  })

  describe('Navegação para login', () => {
    test('deve navegar para login', async () => {
      const { navigateToLogin } = useAuthNavigation()

      await navigateToLogin()

      expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })

    test('deve navegar para login com query params', async () => {
      const { navigateWithRedirect } = useAuthNavigation()

      await navigateWithRedirect('/login', '/dashboard')

      expect(mockRouter.push).toHaveBeenCalledWith({ path: '/login', query: { redirect: '/dashboard' } })
    })
  })

  describe('Navegação para registro', () => {
    test('deve navegar para registro', async () => {
      const { navigateToRegister } = useAuthNavigation()

      await navigateToRegister()

      expect(mockRouter.push).toHaveBeenCalledWith('/register')
    })

    test('deve navegar para registro com query params', async () => {
      const { navigateWithRedirect } = useAuthNavigation()

      await navigateWithRedirect('/register', '/premium')

      expect(mockRouter.push).toHaveBeenCalledWith({ path: '/register', query: { redirect: '/premium' } })
    })
  })

  describe('Navegação para outras páginas', () => {
    test('deve navegar para home', async () => {
      const { navigateToHome } = useAuthNavigation()

      await navigateToHome()

      expect(mockRouter.push).toHaveBeenCalledWith('/tabs/home')
    })

    test('deve navegar para forgot password', async () => {
      const { navigateToForgotPassword } = useAuthNavigation()

      await navigateToForgotPassword()

      expect(mockRouter.push).toHaveBeenCalledWith('/forgot-password')
    })

    test('deve navegar para privacy policy', async () => {
      const { navigateToPrivacyPolicy } = useAuthNavigation()

      await navigateToPrivacyPolicy()

      expect(mockRouter.push).toHaveBeenCalledWith('/privacy-policy')
    })
  })

  describe('Manipulação de redirecionamento', () => {
    test('deve retornar caminho de redirecionamento quando presente', () => {
      mockRouter.currentRoute.value.query = { redirect: '/dashboard' }
      const { getRedirectPath } = useAuthNavigation()

      const result = getRedirectPath()

      expect(result).toBe('/dashboard')
    })

    test('deve retornar null quando não há redirecionamento', () => {
      mockRouter.currentRoute.value.query = {}
      const { getRedirectPath } = useAuthNavigation()

      const result = getRedirectPath()

      expect(result).toBeNull()
    })
  })

  describe('Manipulação de elementos DOM durante navegação', () => {
    beforeEach(() => {
      // Setup DOM elements
      document.body.innerHTML = `
        <input id="email-input" />
        <input id="password-input" />
        <button id="submit-btn" />
      `
    })

    afterEach(() => {
      document.body.innerHTML = ''
    })

    test('deve remover foco do elemento ativo durante navegação para login', async () => {
      const { navigateToLogin } = useAuthNavigation()
      const emailInput = document.getElementById('email-input') as HTMLInputElement
      emailInput.focus()

      await navigateToLogin()

      expect(document.activeElement).not.toBe(emailInput)
    })

    test('deve remover foco do elemento ativo durante navegação para registro', async () => {
      const { navigateToRegister } = useAuthNavigation()
      const passwordInput = document.getElementById('password-input') as HTMLInputElement
      passwordInput.focus()

      await navigateToRegister()

      expect(document.activeElement).not.toBe(passwordInput)
    })
  })
})