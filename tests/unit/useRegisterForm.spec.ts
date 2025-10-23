import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useRegisterForm } from '../../src/composables/useRegisterForm'

// Mock do Vue Router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    currentRoute: {
      value: {
        query: {}
      }
    }
  })),
  createRouter: vi.fn(),
  createWebHistory: vi.fn(),
}))

// Mock do useAuthStore
const mockAuthStore = {
  register: vi.fn().mockResolvedValue(true),
  error: null as string | null,
}

vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(() => mockAuthStore),
}))

describe('useRegisterForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('Estado inicial', () => {
    test('deve inicializar com valores vazios', () => {
      const { formData, errors, isLoading, successMessage } = useRegisterForm()

      expect(formData.name).toBe('')
      expect(formData.email).toBe('')
      expect(formData.password).toBe('')
      expect(formData.confirmPassword).toBe('')
      expect(errors.name).toBe('')
      expect(errors.email).toBe('')
      expect(errors.password).toBe('')
      expect(errors.confirmPassword).toBe('')
      expect(errors.general).toBe('')
      expect(isLoading.value).toBe(false)
      expect(successMessage.value).toBe('')
    })
  })

  describe('Validação de nome', () => {
    test('deve validar nome válido', () => {
      const { validateName } = useRegisterForm()

      expect(validateName('João Silva')).toBe(true)
      expect(validateName('Maria')).toBe(true)
    })

    test('deve rejeitar nome vazio', () => {
      const { validateName, errors } = useRegisterForm()

      expect(validateName('')).toBe(false)
      expect(errors.name).toBe('Nome é obrigatório')
    })

    test('deve rejeitar nome muito curto', () => {
      const { validateName, errors } = useRegisterForm()

      expect(validateName('A')).toBe(false)
      expect(errors.name).toBe('Nome deve ter pelo menos 2 caracteres')
    })
  })

  describe('Validação de email', () => {
    test('deve validar email válido', () => {
      const { validateEmail } = useRegisterForm()

      expect(validateEmail('teste@email.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
    })

    test('deve rejeitar email vazio', () => {
      const { validateEmail, errors } = useRegisterForm()

      expect(validateEmail('')).toBe(false)
      expect(errors.email).toBe('E-mail é obrigatório')
    })

    test('deve rejeitar email com espaços', () => {
      const { validateEmail, errors } = useRegisterForm()

      expect(validateEmail('teste @email.com')).toBe(false)
      expect(errors.email).toBe('E-mail não deve conter espaços')
    })

    test('deve rejeitar email inválido', () => {
      const { validateEmail, errors } = useRegisterForm()

      expect(validateEmail('invalid-email')).toBe(false)
      expect(errors.email).toBe('E-mail deve ter um formato válido')
    })
  })

  describe('Validação de senha', () => {
    test('deve validar senha válida', () => {
      const { validatePassword } = useRegisterForm()

      expect(validatePassword('123456')).toBe(true)
      expect(validatePassword('mypassword123')).toBe(true)
    })

    test('deve rejeitar senha vazia', () => {
      const { validatePassword, errors } = useRegisterForm()

      expect(validatePassword('')).toBe(false)
      expect(errors.password).toBe('Senha é obrigatória')
    })

    test('deve rejeitar senha muito curta', () => {
      const { validatePassword, errors } = useRegisterForm()

      expect(validatePassword('12345')).toBe(false)
      expect(errors.password).toBe('Senha deve ter pelo menos 6 caracteres')
    })
  })

  describe('Validação de confirmação de senha', () => {
    test('deve validar confirmação de senha válida', () => {
      const { formData, validateConfirmPassword } = useRegisterForm()
      formData.password = '123456'

      expect(validateConfirmPassword('123456')).toBe(true)
    })

    test('deve rejeitar confirmação vazia', () => {
      const { validateConfirmPassword, errors } = useRegisterForm()

      expect(validateConfirmPassword('')).toBe(false)
      expect(errors.confirmPassword).toBe('Confirmação de senha é obrigatória')
    })

    test('deve rejeitar senhas diferentes', () => {
      const { formData, validateConfirmPassword, errors } = useRegisterForm()
      formData.password = '123456'

      expect(validateConfirmPassword('123457')).toBe(false)
      expect(errors.confirmPassword).toBe('As senhas não coincidem')
    })
  })

  describe('Força da senha', () => {
    test('deve calcular força da senha corretamente', () => {
      const { formData, passwordStrength, passwordStrengthLabel } = useRegisterForm()

      // Senha vazia
      formData.password = ''
      expect(passwordStrength.value).toBe(0)

      // Senha fraca (apenas comprimento)
      formData.password = '123456'
      expect(passwordStrength.value).toBe(40) // 25 (comprimento) + 15 (dígito) = 40
      expect(passwordStrengthLabel.value).toBe('Média')

      // Senha média
      formData.password = 'MyPass123'
      expect(passwordStrength.value).toBe(90)
      expect(passwordStrengthLabel.value).toBe('Forte')

      // Senha forte
      formData.password = 'MyStrongPass123!'
      expect(passwordStrength.value).toBe(100)
      expect(passwordStrengthLabel.value).toBe('Forte')
    })
  })

  describe('Validação do formulário completo', () => {
    test('deve validar formulário válido', () => {
      const { formData, validateForm } = useRegisterForm()

      formData.name = 'João Silva'
      formData.email = 'joao@email.com'
      formData.password = '123456'
      formData.confirmPassword = '123456'

      expect(validateForm()).toBe(true)
    })

    test('deve rejeitar formulário inválido', () => {
      const { formData, validateForm } = useRegisterForm()

      formData.name = ''
      formData.email = 'invalid-email'
      formData.password = '123'
      formData.confirmPassword = '123'

      expect(validateForm()).toBe(false)
    })
  })

  describe('Estado de formulário válido', () => {
    test('deve indicar formulário válido quando todos os campos estão corretos', () => {
      const { formData, isFormValid } = useRegisterForm()

      expect(isFormValid.value).toBe(false)

      formData.name = 'João Silva'
      formData.email = 'joao@email.com'
      formData.password = '123456'
      formData.confirmPassword = '123456'

      expect(isFormValid.value).toBe(true)
    })

    test('deve indicar formulário inválido quando senhas não coincidem', () => {
      const { formData, isFormValid } = useRegisterForm()

      formData.name = 'João Silva'
      formData.email = 'joao@email.com'
      formData.password = '123456'
      formData.confirmPassword = '123457'

      expect(isFormValid.value).toBe(false)
    })
  })

  describe('Registro', () => {
    beforeEach(() => {
      mockAuthStore.register.mockResolvedValue(true)
      mockAuthStore.error = null
    })
    test('deve registrar usuário com sucesso', async () => {
      const { formData, register, successMessage, errors, validateForm } = useRegisterForm()

      formData.name = 'João Silva'
      formData.email = 'joao@email.com'
      formData.password = '123456'
      formData.confirmPassword = '123456'

      // Verificar se a validação passa
      const isValid = validateForm()
      expect(isValid).toBe(true)

      const result = await register()

      expect(result).toBe(true)
      expect(mockAuthStore.register).toHaveBeenCalledWith('joao@email.com', '123456', 'João Silva')

      expect(successMessage.value).toBe('Conta criada com sucesso! Redirecionando...')
      expect(errors.general).toBe('')
    })

    test('deve lidar com erro de registro', async () => {
      mockAuthStore.register.mockResolvedValueOnce(false)
      mockAuthStore.error = 'Email já cadastrado'

      const { formData, register, errors } = useRegisterForm()

      formData.name = 'João Silva'
      formData.email = 'joao@email.com'
      formData.password = '123456'
      formData.confirmPassword = '123456'

      const result = await register()

      expect(result).toBe(false)
      expect(errors.general).toBe('Email já cadastrado')
    })

    test('deve lidar com erro de validação', async () => {
      const { formData, register, errors } = useRegisterForm()

      // Formulário inválido
      formData.name = ''
      formData.email = 'joao@email.com'
      formData.password = '123456'
      formData.confirmPassword = '123456'

      const result = await register()

      expect(result).toBe(false)
      expect(errors.name).toBe('Nome é obrigatório')
      expect(mockAuthStore.register).not.toHaveBeenCalled()
    })

    test('deve lidar com erro inesperado', async () => {
      mockAuthStore.register.mockRejectedValueOnce(new Error('Erro de rede'))

      const { formData, register, errors } = useRegisterForm()

      formData.name = 'João Silva'
      formData.email = 'joao@email.com'
      formData.password = '123456'
      formData.confirmPassword = '123456'

      const result = await register()

      expect(result).toBe(false)
      expect(errors.general).toBe('Erro de rede')
    })
  })

  describe('Limpeza de erros', () => {
    test('deve limpar erros específicos', () => {
      const { errors, clearNameError, clearEmailError, clearPasswordError, clearConfirmPasswordError } = useRegisterForm()

      errors.name = 'Erro de nome'
      errors.email = 'Erro de email'
      errors.password = 'Erro de senha'
      errors.confirmPassword = 'Erro de confirmação'

      clearNameError()
      expect(errors.name).toBe('')
      expect(errors.email).toBe('Erro de email')

      clearEmailError()
      expect(errors.email).toBe('')

      clearPasswordError()
      expect(errors.password).toBe('')

      clearConfirmPasswordError()
      expect(errors.confirmPassword).toBe('')
    })

    test('deve limpar todos os erros', () => {
      const { errors, clearErrors } = useRegisterForm()

      errors.name = 'Erro de nome'
      errors.email = 'Erro de email'
      errors.password = 'Erro de senha'
      errors.confirmPassword = 'Erro de confirmação'
      errors.general = 'Erro geral'

      clearErrors()

      expect(errors.name).toBe('')
      expect(errors.email).toBe('')
      expect(errors.password).toBe('')
      expect(errors.confirmPassword).toBe('')
      expect(errors.general).toBe('')
    })
  })
})