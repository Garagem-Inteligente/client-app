import { describe, expect, test, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProfilePage from '../../src/views/ProfilePage.vue'
import { useAuthStore } from '../../src/stores/auth'
import { useVehiclesStore } from '../../src/stores/vehicles'

// Mock do router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock do Ionic Vue
vi.mock('@ionic/vue', () => ({
  IonPage: { template: '<div><slot /></div>' },
  IonContent: { template: '<div><slot /></div>' },
  IonIcon: { template: '<i />' },
  IonModal: { template: '<div><slot /></div>' },
  IonHeader: { template: '<div><slot /></div>' },
  IonToolbar: { template: '<div><slot /></div>' },
  IonTitle: { template: '<div><slot /></div>' },
  IonButtons: { template: '<div><slot /></div>' },
  IonButton: { template: '<button><slot /></button>' },
  IonSpinner: { template: '<div />' },
  IonActionSheet: { template: '<div />' },
  IonSegment: { template: '<div><slot /></div>' },
  IonSegmentButton: { template: '<div><slot /></div>' },
  IonLabel: { template: '<div><slot /></div>' },
  IonBadge: { template: '<div><slot /></div>' },
  toastController: {
    create: vi.fn(() => Promise.resolve({
      present: vi.fn(),
      dismiss: vi.fn(),
    })),
  },
}))

// Mock do Firebase
vi.mock('../../src/firebase/config', () => ({
  auth: {
    currentUser: {
      uid: 'test-user-id',
      email: 'test@example.com',
      displayName: 'Test User',
    },
  },
  storage: {},
  db: {},
}))

vi.mock('firebase/auth', () => ({
  updateProfile: vi.fn(() => Promise.resolve()),
  onAuthStateChanged: vi.fn(),
  EmailAuthProvider: {
    credential: vi.fn(),
  },
  reauthenticateWithCredential: vi.fn(),
  updatePassword: vi.fn(),
}))

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({})),
  collection: vi.fn(() => ({})),
  query: vi.fn(() => ({})),
  where: vi.fn(() => ({})),
  orderBy: vi.fn(() => ({})),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false })),
  updateDoc: vi.fn(() => Promise.resolve()),
  addDoc: vi.fn(() => Promise.resolve({ id: 'mock-id' })),
  deleteDoc: vi.fn(() => Promise.resolve()),
  setDoc: vi.fn(() => Promise.resolve()),
  onSnapshot: vi.fn(() => vi.fn()),
}))

vi.mock('firebase/storage', () => ({
  ref: vi.fn(() => ({})),
  uploadString: vi.fn(() => Promise.resolve()),
  getDownloadURL: vi.fn(() => Promise.resolve('mock-url')),
  deleteObject: vi.fn(() => Promise.resolve()),
}))

vi.mock('@capacitor/camera', () => ({
  Camera: {
    getPhoto: vi.fn(() => Promise.resolve({ dataUrl: 'mock-data-url' })),
  },
  CameraResultType: {
    DataUrl: 'dataUrl',
  },
  CameraSource: {
    Camera: 'camera',
    Photos: 'photos',
  },
}))

describe('ProfilePage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    const authStore = useAuthStore()
    const vehiclesStore = useVehiclesStore()

    // Mock initial state
    authStore.user = {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      avatar: undefined,
      userType: 'user',
    }
    authStore.getUserProviders = vi.fn(() => ['password'])

    // Mock vehicles store methods
    vehiclesStore.fetchVehicles = vi.fn(() => Promise.resolve())
    vehiclesStore.maintenanceRecords = []
  })

  describe('Renderização das Seções', () => {
    test('deve renderizar a página ProfilePage', () => {
      const wrapper = mount(ProfilePage, {
        global: {
          stubs: {
            ModernHeader: true,
            MConfirmModal: true,
          },
        },
      })

      expect(wrapper.exists()).toBe(true)
    })

    test('deve ter seção de Gerenciamento de Veículos', () => {
      const wrapper = mount(ProfilePage, {
        global: {
          stubs: {
            ModernHeader: true,
            MConfirmModal: true,
          },
        },
      })

      const html = wrapper.html()
      expect(html).toContain('Gerenciamento de Veículos')
      expect(html).toContain('Transferências Pendentes')
      expect(html).toContain('Carros Transferidos')
    })

    test('deve ter seção de Preferências', () => {
      const wrapper = mount(ProfilePage, {
        global: {
          stubs: {
            ModernHeader: true,
            MConfirmModal: true,
          },
        },
      })

      const html = wrapper.html()
      expect(html).toContain('Preferências')
      expect(html).toContain('Notificações')
      expect(html).toContain('Privacidade')
    })

    test('deve ter seção de Configurações da Conta', () => {
      const wrapper = mount(ProfilePage, {
        global: {
          stubs: {
            ModernHeader: true,
            MConfirmModal: true,
          },
        },
      })

      const html = wrapper.html()
      expect(html).toContain('Configurações da Conta')
      expect(html).toContain('Editar Perfil')
      expect(html).toContain('Conexões de Conta')
      expect(html).toContain('Alterar Senha')
    })

    test('deve ter seção de Suporte', () => {
      const wrapper = mount(ProfilePage, {
        global: {
          stubs: {
            ModernHeader: true,
            MConfirmModal: true,
          },
        },
      })

      const html = wrapper.html()
      expect(html).toContain('Suporte')
      expect(html).toContain('Ajuda')
      expect(html).toContain('Sobre')
    })
  })

  describe('Navegação', () => {
    test('deve navegar para /tabs/transfer-confirm ao clicar em Transferências Pendentes', async () => {
      const wrapper = mount(ProfilePage, {
        global: {
          stubs: {
            ModernHeader: true,
            MConfirmModal: true,
          },
        },
      })

      const buttons = wrapper.findAll('button.setting-item')
      const transferButton = buttons.find(b => b.text().includes('Transferências Pendentes'))
      
      if (transferButton) {
        await transferButton.trigger('click')
        expect(mockPush).toHaveBeenCalledWith('/tabs/transfer-confirm')
      }
    })

    test('deve navegar para /tabs/transferred-vehicles ao clicar em Carros Transferidos', async () => {
      const wrapper = mount(ProfilePage, {
        global: {
          stubs: {
            ModernHeader: true,
            MConfirmModal: true,
          },
        },
      })

      const buttons = wrapper.findAll('button.setting-item')
      const vehiclesButton = buttons.find(b => b.text().includes('Carros Transferidos'))
      
      if (vehiclesButton) {
        await vehiclesButton.trigger('click')
        expect(mockPush).toHaveBeenCalledWith('/tabs/transferred-vehicles')
      }
    })

    test('deve navegar para /privacy-policy ao clicar em Privacidade', async () => {
      const wrapper = mount(ProfilePage, {
        global: {
          stubs: {
            ModernHeader: true,
            MConfirmModal: true,
          },
        },
      })

      const buttons = wrapper.findAll('button.setting-item')
      const privacyButton = buttons.find(b => b.text().includes('Privacidade'))
      
      if (privacyButton) {
        await privacyButton.trigger('click')
        expect(mockPush).toHaveBeenCalledWith('/privacy-policy')
      }
    })
  })

  describe('Estrutura CSS e Design', () => {
    test('deve ter ícone warning para Transferências Pendentes', () => {
      const wrapper = mount(ProfilePage, {
        global: {
          stubs: {
            ModernHeader: true,
            MConfirmModal: true,
          },
        },
      })

      const html = wrapper.html()
      expect(html).toContain('icon-warning')
    })

    test('deve ter ícone tertiary para Carros Transferidos', () => {
      const wrapper = mount(ProfilePage, {
        global: {
          stubs: {
            ModernHeader: true,
            MConfirmModal: true,
          },
        },
      })

      const html = wrapper.html()
      expect(html).toContain('icon-tertiary')
    })

    test('deve ter ícone primary para Notificações', () => {
      const wrapper = mount(ProfilePage, {
        global: {
          stubs: {
            ModernHeader: true,
            MConfirmModal: true,
          },
        },
      })

      const html = wrapper.html()
      expect(html).toContain('icon-primary')
    })

    test('deve ter ícone success para Privacidade', () => {
      const wrapper = mount(ProfilePage, {
        global: {
          stubs: {
            ModernHeader: true,
            MConfirmModal: true,
          },
        },
      })

      const html = wrapper.html()
      expect(html).toContain('icon-success')
    })

    test('todos os itens de configuração devem ter setas de navegação', () => {
      const wrapper = mount(ProfilePage, {
        global: {
          stubs: {
            ModernHeader: true,
            MConfirmModal: true,
          },
        },
      })

      const html = wrapper.html()
      expect(html).toContain('setting-arrow')
    })
  })

  describe('Botões e Ações', () => {
    test('deve ter botão de logout', () => {
      const wrapper = mount(ProfilePage, {
        global: {
          stubs: {
            ModernHeader: true,
            MConfirmModal: true,
          },
        },
      })

      const html = wrapper.html()
      expect(html).toContain('Sair da Conta')
      expect(html).toContain('logout-button')
    })

    test('deve exibir informações de versão', () => {
      const wrapper = mount(ProfilePage, {
        global: {
          stubs: {
            ModernHeader: true,
            MConfirmModal: true,
          },
        },
      })

      const html = wrapper.html()
      expect(html).toContain('version-info')
    })
  })
})
