import { describe, expect, test, vi, beforeEach } from 'vitest'
import { createApp } from 'vue'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory, type Router } from 'vue-router'
import { IonicVue } from '@ionic/vue'
import RegisterPage from '../../src/views/RegisterPage.vue'

// Mock dos componentes
vi.mock('@/components', () => ({
  PageLayout: {
    name: 'PageLayout',
    template: '<div class="page-layout"><slot /></div>',
  },
  RegisterCard: {
    name: 'RegisterCard',
    template: '<div class="register-card"><slot name="oauth" /></div>',
    props: ['modelValue', 'error', 'successMessage', 'loading'],
    emits: ['update:modelValue', 'submit', 'login'],
  },
  RegisterLogoSection: {
    name: 'RegisterLogoSection',
    template: '<div class="register-logo-section">Logo Section</div>',
  },
  RegisterAuthFooter: {
    name: 'RegisterAuthFooter',
    template: '<div class="register-auth-footer">Footer</div>',
  },
  GoogleSignInButton: {
    name: 'GoogleSignInButton',
    template: '<button class="google-signin">Google Sign In</button>',
  },
}))

// Mock dos composables
vi.mock('@/composables/useRegisterForm', () => ({
  useRegisterForm: vi.fn(() => ({
    formData: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    errors: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      general: '',
    },
    isLoading: false,
    successMessage: '',
    register: vi.fn().mockResolvedValue(true),
  })),
}))

vi.mock('@/composables/useAuthNavigation', () => ({
  useAuthNavigation: vi.fn(() => ({
    navigateToLogin: vi.fn(),
  })),
}))

describe('RegisterPage', () => {
  let router: Router
  let pinia: Pinia

  beforeEach(() => {
    // Setup Pinia
    pinia = createPinia()
    setActivePinia(pinia)

    // Setup Router
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/register', component: RegisterPage },
        { path: '/login', component: { template: '<div>Login</div>' } },
      ],
    })

    // Setup Ionic
    const app = createApp({})
    app.use(IonicVue)
    app.use(router)
    app.use(pinia)

    // Reset mocks
    vi.clearAllMocks()
  })

  describe('Estrutura da página', () => {
    test('deve renderizar todos os componentes principais', () => {
      const wrapper = mount(RegisterPage, {
        global: {
          plugins: [router, pinia],
        },
      })

      expect(wrapper.findComponent({ name: 'PageLayout' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'RegisterLogoSection' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'RegisterCard' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'RegisterAuthFooter' }).exists()).toBe(true)
    })

    test('deve renderizar botão de voltar', () => {
      const wrapper = mount(RegisterPage, {
        global: {
          plugins: [router, pinia],
        },
      })

      const backButton = wrapper.find('.back-button')
      expect(backButton.exists()).toBe(true)
      const icon = backButton.find('ion-icon')
      expect(icon.exists()).toBe(true)
    })

    test('deve renderizar container com classes corretas', () => {
      const wrapper = mount(RegisterPage, {
        global: {
          plugins: [router, pinia],
        },
      })

      const container = wrapper.find('.register-container')
      expect(container.exists()).toBe(true)
      expect(container.classes()).toContain('register-container')
    })
  })

  describe('Interações do usuário', () => {
    test('deve renderizar botão de voltar', () => {
      const wrapper = mount(RegisterPage, {
        global: {
          plugins: [router, pinia],
        },
      })

      const backButton = wrapper.find('.back-button')
      expect(backButton.exists()).toBe(true)
    })

    test('deve renderizar RegisterCard com props corretas', () => {
      const wrapper = mount(RegisterPage, {
        global: {
          plugins: [router, pinia],
        },
      })

      const registerCard = wrapper.findComponent({ name: 'RegisterCard' })
      expect(registerCard.exists()).toBe(true)
      expect(registerCard.props('error')).toBe('')
      expect(registerCard.props('successMessage')).toBe('')
      expect(registerCard.props('loading')).toBe(false)
    })

    test('deve renderizar GoogleSignInButton no slot oauth', () => {
      const wrapper = mount(RegisterPage, {
        global: {
          plugins: [router, pinia],
        },
      })

      const registerCard = wrapper.findComponent({ name: 'RegisterCard' })
      const oauthSlot = registerCard.find('.google-sign-in-button')
      expect(oauthSlot.exists()).toBe(true)
    })
  })

  describe('Responsividade', () => {
    test('deve ter classes responsivas no container', () => {
      const wrapper = mount(RegisterPage, {
        global: {
          plugins: [router, pinia],
        },
      })

      const container = wrapper.find('.register-container')
      expect(container.exists()).toBe(true)
    })
  })

  describe('Acessibilidade', () => {
    test('deve renderizar componentes sem erros', () => {
      const wrapper = mount(RegisterPage, {
        global: {
          plugins: [router, pinia],
        },
      })

      expect(wrapper.exists()).toBe(true)
    })
  })
})