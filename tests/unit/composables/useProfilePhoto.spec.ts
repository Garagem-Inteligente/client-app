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
      const { photoState, photoActionButtons, handlePhotoError, photoUrl } = useProfilePhoto()

      expect(photoState.value).toEqual({
        currentPhotoUrl: '',
        photoLoadError: false,
      })

      expect(photoActionButtons.value).toHaveLength(2)
      expect(typeof handlePhotoError).toBe('function')
      expect(photoUrl.value).toBe('/assets/avatar-default.svg')
    })
  })
})
  describe('photoUrl computed', () => {
    test('deve retornar foto atual quando disponível e sem erro', () => {
      const { photoState, photoUrl } = useProfilePhoto()

      photoState.value.currentPhotoUrl = 'https://example.com/photo.jpg'
      photoState.value.photoLoadError = false

      expect(photoUrl.value).toBe('https://example.com/photo.jpg')
    })

    test('deve retornar avatar padrão quando não há foto atual', () => {
      const { photoState, photoUrl } = useProfilePhoto()

      photoState.value.currentPhotoUrl = ''
      photoState.value.photoLoadError = false

      expect(photoUrl.value).toBe('/assets/avatar-default.svg')
    })

    test('deve retornar avatar padrão quando há erro de carregamento', () => {
      const { photoState, photoUrl, handlePhotoError } = useProfilePhoto()

      photoState.value.currentPhotoUrl = 'https://example.com/photo.jpg'
      handlePhotoError()

      expect(photoUrl.value).toBe('/assets/avatar-default.svg')
    })
  })