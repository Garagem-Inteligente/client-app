import { describe, expect, test, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useProfilePhoto } from '../../../src/composables/useProfilePhoto'

// Mocks simples para evitar problemas de hoisting
vi.mock('firebase/storage', () => ({
  ref: vi.fn(() => ({})),
  uploadString: vi.fn(() => Promise.resolve()),
  getDownloadURL: vi.fn(() => Promise.resolve('mock-url')),
  deleteObject: vi.fn(() => Promise.resolve()),
}))

vi.mock('firebase/auth', () => ({
  updateProfile: vi.fn(() => Promise.resolve()),
  onAuthStateChanged: vi.fn(() => {}),
}))

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({})),
  updateDoc: vi.fn(() => Promise.resolve()),
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

vi.mock('../../../src/firebase/config', () => ({
  auth: {
    currentUser: {
      uid: 'test-user-id',
      email: 'test@example.com',
    },
  },
  storage: {},
  db: {},
}))

// Mock do auth store
const mockAuthStore = {
  user: {
    avatar: 'https://example.com/avatar.jpg' as string | null,
  },
  updateUserAvatar: vi.fn(),
}

vi.mock('../../src/stores/auth', () => ({
  useAuthStore: () => mockAuthStore,
}))

describe('useProfilePhoto', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Estado inicial', () => {
    test('deve inicializar com estado correto', () => {
      const { photoState, photoActionButtons, handlePhotoError } = useProfilePhoto()

      expect(photoState.value).toEqual({
        currentPhotoUrl: '',
        photoLoadError: false,
      })

      expect(photoActionButtons.value).toHaveLength(2)
      expect(typeof handlePhotoError).toBe('function')
    })
  })

  describe('handlePhotoError', () => {
    test('deve marcar erro de carregamento', () => {
      const { photoState, handlePhotoError } = useProfilePhoto()

      handlePhotoError()

      expect(photoState.value.photoLoadError).toBe(true)
    })
  })
})