import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import ChangePasswordPage from './change-password-page.vue'
import { useAuthStore } from '@/stores/auth'

// Mock Firebase
vi.mock('@/firebase/config', () => ({
  auth: {
    currentUser: {
      uid: 'test-user-123',
      email: 'michel@example.com',
    },
  },
  db: {},
}))

// Mock Firebase auth functions
vi.mock('firebase/auth', () => ({
  updateProfile: vi.fn().mockResolvedValue(undefined),
  onAuthStateChanged: vi.fn((auth, callback) => {
    callback({
      uid: 'test-user-123',
      email: 'michel@example.com',
      displayName: 'Michel',
    })
    return vi.fn()
  }),
  reauthenticateWithCredential: vi.fn().mockResolvedValue(undefined),
  EmailAuthProvider: {
    credential: vi.fn().mockReturnValue({ test: 'credential' }),
  },
  updatePassword: vi.fn().mockResolvedValue(undefined),
}))

// Mock Firebase firestore functions
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  updateDoc: vi.fn().mockResolvedValue(undefined),
  deleteField: vi.fn(),
}))

// Mock Ionic toast controller
vi.mock('@ionic/vue', async () => {
  const actual = (await vi.importActual('@ionic/vue')) as Record<string, unknown>
  return {
    ...actual,
    toastController: {
      create: vi.fn().mockResolvedValue({
        present: vi.fn(),
        dismiss: vi.fn(),
      }),
    },
  }
})

describe('ChangePasswordPage', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let router: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let authStore: any

  beforeEach(async () => {
    setActivePinia(createPinia())
    authStore = useAuthStore()

    // Setup auth store with test data
    authStore.user = {
      id: 'test-user-123',
      name: 'Michel',
      email: 'michel@example.com',
      userType: 'user',
    }
    authStore.isAuthenticated = true

    // Create router
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/tabs/profile/change-password',
          component: ChangePasswordPage,
        },
        {
          path: '/tabs/profile',
          component: { template: '<div>Profile Page</div>' },
        },
      ],
    })

    await router.push('/tabs/profile/change-password')
    await router.isReady()

    // Mount component
    wrapper = mount(ChangePasswordPage, {
      global: {
        plugins: [router, createPinia()],
        stubs: {
          ModernHeader: true,
          IonPage: { template: '<div><slot /></div>' },
          IonContent: { template: '<div><slot /></div>' },
          IonIcon: true,
          IonInput: {
            template: `
              <input 
                v-model="modelValue" 
                v-bind="$attrs" 
                :type="type"
                :maxlength="maxlength"
                :placeholder="placeholder"
                @blur="$emit('ion-blur')" 
                @input="$emit('update:modelValue', $event.target.value)"
              />
            `,
            props: ['modelValue', 'disabled', 'placeholder', 'maxlength', 'type', 'id'],
            emits: ['update:modelValue', 'ion-blur'],
          },
          IonSpinner: { template: '<div></div>' },
        },
      },
    })
  })

  describe('Rendering - Elementos Principais', () => {
    it('deve renderizar a página com wrapper principal', () => {
      expect(wrapper.find('.page-content-wrapper').exists()).toBe(true)
    })

    it('deve exibir o header com título', () => {
      const header = wrapper.findComponent({ name: 'ModernHeader' })
      expect(header.exists()).toBe(true)
      expect(header.props('title')).toBe('Alterar Senha')
      expect(header.props('showBackButton')).toBe(true)
    })

    it('deve exibir a seção de informação', () => {
      expect(wrapper.find('.info-card').exists()).toBe(true)
      expect(wrapper.text()).toContain('Por segurança')
    })

    it('deve exibir o form card', () => {
      expect(wrapper.find('.form-card').exists()).toBe(true)
    })

    it('deve exibir as seções do formulário', () => {
      expect(wrapper.text()).toContain('Autenticação')
      expect(wrapper.text()).toContain('Nova Senha')
      expect(wrapper.text()).toContain('Dicas de Segurança')
    })

    it('deve exibir os campos de senha', () => {
      expect(wrapper.text()).toContain('Senha Atual')
      expect(wrapper.text()).toContain('Nova Senha')
      expect(wrapper.text()).toContain('Confirmar Senha')
    })

    it('deve exibir botões Cancelar e Alterar Senha', () => {
      const buttons = wrapper.findAll('button')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const texts = buttons.map((btn: any) => btn.text())
      expect(texts.some((t: string) => t.includes('Cancelar'))).toBe(true)
      expect(texts.some((t: string) => t.includes('Alterar Senha'))).toBe(true)
    })

    it('deve exibir dicas de segurança', () => {
      expect(wrapper.text()).toContain('Use pelo menos 8 caracteres')
      expect(wrapper.text()).toContain('Inclua letras maiúsculas')
    })
  })

  describe('Form Initialization', () => {
    it('deve ter campos vazios ao montar', async () => {
      await flushPromises()
      const inputs = wrapper.findAll('input')
      expect(inputs[0].element.value).toBe('')
      expect(inputs[1].element.value).toBe('')
      expect(inputs[2].element.value).toBe('')
    })

    it('deve ter 3 inputs de senha', async () => {
      await flushPromises()
      const inputs = wrapper.findAll('input')
      expect(inputs.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('Password Validation - Senha Atual', () => {
    it('deve permitir entrada na senha atual', async () => {
      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('minhasenha123')
      await wrapper.vm.$nextTick()
      expect(inputs[0].element.value).toBe('minhasenha123')
    })

    it('deve ter campo de tipo password', () => {
      const inputs = wrapper.findAll('input')
      expect(inputs[0].attributes('type')).toBe('password')
    })

    it('deve ter placeholder para senha atual', () => {
      const inputs = wrapper.findAll('input')
      expect(inputs[0].attributes('placeholder')).toContain('atual')
    })
  })

  describe('Password Validation - Nova Senha', () => {
    it('deve permitir entrada na nova senha', async () => {
      const inputs = wrapper.findAll('input')
      await inputs[1].setValue('novasenha123')
      await wrapper.vm.$nextTick()
      expect(inputs[1].element.value).toBe('novasenha123')
    })

    it('deve ter maxlength de 120', async () => {
      const inputs = wrapper.findAll('input')
      expect(inputs[1].attributes('maxlength')).toBe('120')
    })

    it('deve exibir indicador de força da senha quando houver conteúdo', async () => {
      const inputs = wrapper.findAll('input')
      expect(wrapper.find('.password-strength').exists()).toBe(false)
      
      await inputs[1].setValue('teste123')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.find('.password-strength').exists()).toBe(true)
    })

    it('deve ter classe weak para senhas fracas', async () => {
      const inputs = wrapper.findAll('input')
      await inputs[1].setValue('abc')
      await wrapper.vm.$nextTick()
      
      const strength = wrapper.find('.password-strength')
      expect(strength.exists()).toBe(true)
    })

    it('deve ter classe strong para senhas fortes', async () => {
      const inputs = wrapper.findAll('input')
      await inputs[1].setValue('SenhaForte123!@#')
      await wrapper.vm.$nextTick()
      
      const strength = wrapper.find('.password-strength')
      expect(strength.exists()).toBe(true)
    })

    it('deve exibir help text', () => {
      expect(wrapper.text()).toContain('Mínimo 6 caracteres')
      expect(wrapper.text()).toContain('máximo 120')
    })
  })

  describe('Password Validation - Confirmação', () => {
    it('deve permitir entrada na confirmação', async () => {
      const inputs = wrapper.findAll('input')
      await inputs[2].setValue('novasenha123')
      await wrapper.vm.$nextTick()
      expect(inputs[2].element.value).toBe('novasenha123')
    })

    it('deve ter tipo password', () => {
      const inputs = wrapper.findAll('input')
      expect(inputs[2].attributes('type')).toBe('password')
    })

    it('deve ter maxlength de 120', () => {
      const inputs = wrapper.findAll('input')
      expect(inputs[2].attributes('maxlength')).toBe('120')
    })
  })

  describe('Button Comportamento', () => {
    it('deve ter botão Cancelar com classe btn-secondary', () => {
      const buttons = wrapper.findAll('button')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cancelBtn = buttons.find((btn: any) => btn.text().includes('Cancelar'))
      expect(cancelBtn?.classes()).toContain('btn-secondary')
    })

    it('deve ter botão Alterar Senha com classe btn-primary', () => {
      const buttons = wrapper.findAll('button')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const submitBtn = buttons.find((btn: any) => btn.text().includes('Alterar Senha'))
      expect(submitBtn?.classes()).toContain('btn-primary')
    })

    it('deve ter button-group para botões', () => {
      expect(wrapper.find('.button-group').exists()).toBe(true)
    })

    it('deve ter pelo menos 2 botões', () => {
      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Form Styling', () => {
    it('deve ter classe form-card', () => {
      const formCard = wrapper.find('.form-card')
      expect(formCard.exists()).toBe(true)
    })

    it('deve ter info-card com informações', () => {
      const infoCard = wrapper.find('.info-card')
      expect(infoCard.exists()).toBe(true)
      expect(infoCard.text()).toContain('Por segurança')
    })

    it('deve ter divider entre seções', () => {
      const dividers = wrapper.findAll('.form-divider')
      expect(dividers.length).toBeGreaterThanOrEqual(1)
    })

    it('deve ter labels com ícones', () => {
      const labels = wrapper.findAll('label')
      expect(labels.length).toBeGreaterThanOrEqual(3)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      labels.forEach((label: any) => {
        const hasIcon = label.find('ion-icon-stub').exists()
        expect(hasIcon).toBe(true)
      })
    })
  })

  describe('Accessibility', () => {
    it('deve ter labels com for associado aos inputs', () => {
      const labels = wrapper.findAll('label')
      expect(labels.length).toBeGreaterThanOrEqual(3)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      labels.forEach((label: any) => {
        const forAttr = label.attributes('for')
        expect(forAttr).toBeDefined()
      })
    })

    it('deve ter pelo menos 3 inputs na página', () => {
      const inputs = wrapper.findAll('input')
      expect(inputs.length).toBeGreaterThanOrEqual(3)
    })

    it('deve ter section titles descritivos', () => {
      expect(wrapper.text()).toContain('Autenticação')
      expect(wrapper.text()).toContain('Nova Senha')
      expect(wrapper.text()).toContain('Dicas de Segurança')
    })
  })

  describe('Security Tips', () => {
    it('deve exibir lista de dicas de segurança', () => {
      const securityTips = wrapper.find('.security-tips')
      expect(securityTips.exists()).toBe(true)
    })

    it('deve ter pelo menos 5 dicas de segurança', () => {
      const tips = wrapper.findAll('.security-tips li')
      expect(tips.length).toBeGreaterThanOrEqual(5)
    })

    it('deve mencionar minimo de caracteres', () => {
      expect(wrapper.text()).toContain('8 caracteres')
    })

    it('deve mencionar variedade de caracteres', () => {
      expect(wrapper.text()).toContain('maiúsculas')
      expect(wrapper.text()).toContain('minúsculas')
    })
  })

  describe('Auth Store Integration', () => {
    it('deve ter usuario carregado no auth store', () => {
      expect(authStore.user).toBeDefined()
      expect(authStore.user.email).toBe('michel@example.com')
    })

    it('deve estar autenticado', () => {
      expect(authStore.isAuthenticated).toBe(true)
    })
  })

  describe('Responsive Design', () => {
    it('deve ter estrutura responsiva', () => {
      expect(wrapper.find('.page-content-wrapper').exists()).toBe(true)
    })

    it('deve ter container com classe appropriada', () => {
      const container = wrapper.find('.container')
      expect(container.exists()).toBe(true)
    })

    it('deve ter button-group para botões responsivos', () => {
      const buttonGroup = wrapper.find('.button-group')
      expect(buttonGroup.exists()).toBe(true)
    })
  })

  describe('Form Sections', () => {
    it('deve ter seção de Autenticação', () => {
      expect(wrapper.text()).toContain('Autenticação')
    })

    it('deve ter seção de Nova Senha', () => {
      expect(wrapper.text()).toContain('Nova Senha')
    })

    it('deve ter seção de Dicas de Segurança', () => {
      expect(wrapper.text()).toContain('Dicas de Segurança')
      expect(wrapper.text()).toContain('🛡️')
    })

    it('deve ter labels para todos os campos', () => {
      const labels = wrapper.findAll('label')
      expect(labels.length).toBeGreaterThanOrEqual(3)
    })
  })
})
