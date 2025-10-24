import { describe, expect, test, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { usePasswordChange } from '../../../src/composables/usePasswordChange'

// Mock simples para evitar erros de import
vi.mock('firebase/auth', () => ({
  EmailAuthProvider: {
    credential: vi.fn(),
  },
  reauthenticateWithCredential: vi.fn(),
  updatePassword: vi.fn(),
}))

vi.mock('../../../src/firebase/config', () => ({
  auth: {
    currentUser: null,
  },
}))

vi.mock('../../../src/utils/errorMessages', () => ({
  translateFirebaseError: vi.fn(() => 'Erro simulado'),
}))

vi.mock('../../../src/utils/password', () => ({
  calculatePasswordStrength: vi.fn(() => ({
    score: 0,
    label: 'Fraca',
    class: 'strength-weak',
  })),
  validatePasswordForm: vi.fn(() => ({
    isValid: false,
    errors: { currentPassword: 'Campo obrigatório' },
  })),
}))

describe('usePasswordChange', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Estado inicial', () => {
    test('deve inicializar com estado correto', () => {
      const {
        passwordForm,
        changingPassword,
        passwordError,
        passwordStrength,
        isPasswordFormValid,
        passwordErrors,
      } = usePasswordChange()

      expect(passwordForm.value).toEqual({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      expect(changingPassword.value).toBe(false)
      expect(passwordError.value).toBe('')

      // Testar computeds (usam mocks simples)
      expect(passwordStrength.value).toEqual({
        score: 0,
        label: 'Fraca',
        class: 'strength-weak',
      })
      expect(isPasswordFormValid.value).toBe(false)
      expect(passwordErrors.value).toEqual({ currentPassword: 'Campo obrigatório' })
    })
  })

  describe('resetForm', () => {
    test('deve limpar formulário e erros', () => {
      const { passwordForm, passwordError, resetForm } = usePasswordChange()

      // Simular dados no formulário
      passwordForm.value = {
        currentPassword: 'oldpass',
        newPassword: 'newpass',
        confirmPassword: 'newpass',
      }
      passwordError.value = 'Erro de teste'

      resetForm()

      expect(passwordForm.value).toEqual({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      expect(passwordError.value).toBe('')
    })
  })

  describe('changePassword', () => {
    test('deve falhar quando usuário não está autenticado', async () => {
      const { changePassword, passwordError } = usePasswordChange()

      const result = await changePassword()

      expect(result).toBe(false)
      expect(passwordError.value).toBe('Usuário não autenticado')
    })
  })
})