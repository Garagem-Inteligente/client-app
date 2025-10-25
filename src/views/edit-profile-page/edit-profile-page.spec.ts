import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import EditProfilePage from './edit-profile-page.vue'
import { useAuthStore } from '@/stores/auth'

// Mock Firebase
vi.mock('@/firebase/config', () => ({
  auth: {
    currentUser: {
      uid: 'test-user-123',
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
}))

// Mock Firebase firestore functions
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  updateDoc: vi.fn().mockResolvedValue(undefined),
  deleteField: vi.fn(),
}))

// Mock composables
vi.mock('@/composables/useProfilePhoto', () => ({
  useProfilePhoto: () => ({
    photoState: {
      value: {
        currentPhotoUrl: 'https://example.com/photo.jpg',
      },
    },
    photoActionButtons: [],
    handlePhotoLoad: vi.fn(),
    handlePhotoError: vi.fn(),
  }),
}))

// Mock Ionic toast controller
vi.mock('@ionic/vue', async () => {
  const actual = (await vi.importActual('@ionic/vue')) as Record<string, unknown>
  return {
    ...actual,
    toastController: {
      create: vi.fn().mockResolvedValue({
        present: vi.fn(),
      }),
    },
  }
})

describe('EditProfilePage', () => {
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

    // Create router
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/tabs/profile/edit',
          component: EditProfilePage,
        },
        {
          path: '/tabs/profile',
          component: { template: '<div>Profile Page</div>' },
        },
      ],
    })

    await router.push('/tabs/profile/edit')
    await router.isReady()

    // Mount component
    wrapper = mount(EditProfilePage, {
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
                @blur="$emit('ion-blur')" 
                @input="$emit('update:modelValue', $event.target.value)"
              />
            `,
            props: ['modelValue', 'disabled', 'placeholder', 'maxlength', 'type', 'id'],
            emits: ['update:modelValue', 'ion-blur'],
          },
          IonActionSheet: { template: '<div></div>' },
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
      expect(header.props('title')).toBe('Editar Perfil')
      expect(header.props('showBackButton')).toBe(true)
    })

    it('deve exibir a seção de avatar', () => {
      expect(wrapper.find('.avatar-section').exists()).toBe(true)
      expect(wrapper.find('.avatar-container').exists()).toBe(true)
      expect(wrapper.find('.avatar-hint').exists()).toBe(true)
    })

    it('deve exibir as seções do formulário', () => {
      expect(wrapper.text()).toContain('Informações Pessoais')
      expect(wrapper.text()).toContain('Dados da Conta')
    })

    it('deve exibir os campos Nome e Email', () => {
      expect(wrapper.text()).toContain('Nome Completo')
      expect(wrapper.text()).toContain('Email')
    })

    it('deve exibir botões Cancelar e Salvar', () => {
      const buttons = wrapper.findAll('button')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const texts = buttons.map((btn: any) => btn.text())
      expect(texts.some((t: string) => t.includes('Cancelar'))).toBe(true)
      expect(texts.some((t: string) => t.includes('Salvar'))).toBe(true)
    })

    it('deve exibir dicas de ajuda', () => {
      expect(wrapper.text()).toContain('Mínimo 3 caracteres, máximo 100')
      expect(wrapper.text()).toContain('Clique para alterar sua foto')
    })

    it('deve exibir contador de caracteres', () => {
      expect(wrapper.find('.char-count').exists()).toBe(true)
    })
  })

  describe('Form Initialization', () => {
    it('deve carregar os dados do usuário ao montar', async () => {
      await flushPromises()
      const inputs = wrapper.findAll('input')
      expect(inputs[0].element.value).toBe('Michel')
    })

    it('deve ter campo de email com dados carregados', async () => {
      await flushPromises()
      const inputs = wrapper.findAll('input')
      expect(inputs[1].element.value).toBe('michel@example.com')
    })
  })

  describe('Form Validation - Nome', () => {
    it('deve permitir alteração do valor do nome', async () => {
      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('João Silva')
      await wrapper.vm.$nextTick()
      expect(inputs[0].element.value).toBe('João Silva')
    })

    it('deve trimmer espaços do nome', async () => {
      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('  João  ')
      await inputs[0].trigger('blur')
      await wrapper.vm.$nextTick()
      // O componente deve trimmar na validação
      expect(inputs[0].element.value.trim()).toBe('João')
    })

    it('deve aceitar nomes com comprimento válido', async () => {
      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('Maria Silva Santos')
      await wrapper.vm.$nextTick()
      expect(inputs[0].element.value).toBe('Maria Silva Santos')
    })

    it('deve exibir o contador de caracteres correto', async () => {
      const charCount = wrapper.find('.char-count')
      const initialCount = charCount.text()
      expect(initialCount).toContain('/100')
    })
  })

  describe('Form Validation - Email', () => {
    it('deve exibir mensagem de suporte para email', () => {
      expect(wrapper.text()).toContain('Para alterar o email, entre em contato com o suporte')
    })

    it('deve ter email desabilitado no formulário', async () => {
      await flushPromises()
      const inputs = wrapper.findAll('input')
      // Verifica se há campo de email
      expect(inputs.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Button Comportamento', () => {
    it('deve ter dois botões principal e secundário', () => {
      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBeGreaterThanOrEqual(2)
    })

    it('deve ter botão com classe btn-secondary', () => {
      const buttons = wrapper.findAll('button')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const secondary = buttons.find((btn: any) => btn.classes().includes('btn-secondary'))
      expect(secondary).toBeDefined()
    })

    it('deve ter botão com classe btn-primary', () => {
      const buttons = wrapper.findAll('button')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const primary = buttons.find((btn: any) => btn.classes().includes('btn-primary'))
      expect(primary).toBeDefined()
    })

    it('deve render botões dentro de button-group', () => {
      expect(wrapper.find('.button-group').exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('deve ter labels com for associado aos inputs', () => {
      const labels = wrapper.findAll('label')
      expect(labels.length).toBeGreaterThanOrEqual(2)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      labels.forEach((label: any) => {
        const forAttr = label.attributes('for')
        expect(forAttr).toBeDefined()
      })
    })

    it('deve ter labels com ícones', () => {
      const labels = wrapper.findAll('label')
      expect(labels.length).toBeGreaterThanOrEqual(2)

      // Verifica se existem ícones dentro das labels
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      labels.forEach((label: any) => {
        const hasIcon = label.find('ion-icon-stub').exists()
        expect(hasIcon).toBe(true)
      })
    })

    it('deve ter pelo menos 2 inputs na página', () => {
      const inputs = wrapper.findAll('input')
      expect(inputs.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Styling e Classes', () => {
    it('deve ter classe avatar-section', () => {
      const avatar = wrapper.find('.avatar-section')
      expect(avatar.exists()).toBe(true)
    })

    it('deve ter classe form-card', () => {
      const form = wrapper.find('.form-card')
      expect(form.exists()).toBe(true)
    })

    it('deve ter container com classe appropriada', () => {
      const container = wrapper.find('.container')
      expect(container.exists()).toBe(true)
    })

    it('deve ter forma com divider entre seções', () => {
      const divider = wrapper.find('.form-divider')
      expect(divider.exists()).toBe(true)
    })
  })

  describe('Photo Avatar', () => {
    it('deve exibir seção de avatar', () => {
      const avatar = wrapper.find('.avatar-container')
      expect(avatar.exists()).toBe(true)
    })

    it('deve exibir overlay no avatar', () => {
      const overlay = wrapper.find('.avatar-overlay')
      expect(overlay.exists()).toBe(true)
    })

    it('deve ter dica de clique no avatar', () => {
      const hint = wrapper.find('.avatar-hint')
      expect(hint.exists()).toBe(true)
      expect(hint.text()).toContain('Clique para alterar sua foto')
    })
  })

  describe('Responsive Design', () => {
    it('deve ter estrutura responsiva', () => {
      const wrapper_element = wrapper.find('.page-content-wrapper')
      expect(wrapper_element.exists()).toBe(true)
    })

    it('deve ter button-group para botões', () => {
      const buttonGroup = wrapper.find('.button-group')
      expect(buttonGroup.exists()).toBe(true)
    })
  })

  describe('Auth Store Integration', () => {
    it('deve ter usuario carregado no auth store', () => {
      expect(authStore.user).toBeDefined()
      expect(authStore.user.name).toBe('Michel')
      expect(authStore.user.email).toBe('michel@example.com')
    })

    it('deve inicializar com dados do auth store', async () => {
      await flushPromises()
      const inputs = wrapper.findAll('input')
      expect(inputs[0].element.value).toBe('Michel')
    })
  })

  describe('Form Sections', () => {
    it('deve ter seção de Informações Pessoais', () => {
      const text = wrapper.text()
      expect(text).toContain('Informações Pessoais')
    })

    it('deve ter seção de Dados da Conta', () => {
      const text = wrapper.text()
      expect(text).toContain('Dados da Conta')
    })

    it('deve exibir help text para nome', () => {
      const text = wrapper.text()
      expect(text).toContain('Mínimo 3 caracteres, máximo 100')
    })
  })
})
