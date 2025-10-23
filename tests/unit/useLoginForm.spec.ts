import { describe, expect, test, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useLoginForm } from '@/composables/useLoginForm'

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
  login: vi.fn().mockResolvedValue(true),
  register: vi.fn().mockResolvedValue(true),
  resetPassword: vi.fn().mockResolvedValue(true),
  error: null,
}

vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(() => mockAuthStore),
}))

describe('useLoginForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Estado inicial', () => {
    test('deve inicializar com valores vazios', () => {
      const { formData, errors, isLoading } = useLoginForm()

      expect(formData.email).toBe('')
      expect(formData.password).toBe('')
      expect(errors.email).toBe('')
      expect(errors.password).toBe('')
      expect(isLoading).toBe(false)
    })
  })

  describe('Validação de email', () => {
    test('deve validar email válido', () => {
      const { validateEmail, errors } = useLoginForm()

      const result = validateEmail('usuario@email.com')
      expect(result).toBe(true)
      expect(errors.email).toBe('')
    })

    test('deve rejeitar email vazio', () => {
      const { validateEmail, errors } = useLoginForm()

      const result = validateEmail('')
      expect(result).toBe(false)
      expect(errors.email).toBe('E-mail é obrigatório')
    })

    test('deve rejeitar email inválido', () => {
      const { validateEmail, errors } = useLoginForm()

      const result = validateEmail('email-invalido')
      expect(result).toBe(false)
      expect(errors.email).toBe('E-mail deve ter um formato válido')
    })

    test('deve rejeitar email com espaços', () => {
      const { validateEmail, errors } = useLoginForm()

      const result = validateEmail(' usuario@email.com ')
      expect(result).toBe(false)
      expect(errors.email).toBe('E-mail não deve conter espaços')
    })
  })

  describe('Validação de senha', () => {
    test('deve validar senha válida', () => {
      const { validatePassword, errors } = useLoginForm()

      const result = validatePassword('senha123')
      expect(result).toBe(true)
      expect(errors.password).toBe('')
    })

    test('deve rejeitar senha vazia', () => {
      const { validatePassword, errors } = useLoginForm()

      const result = validatePassword('')
      expect(result).toBe(false)
      expect(errors.password).toBe('Senha é obrigatória')
    })

    test('deve rejeitar senha muito curta', () => {
      const { validatePassword, errors } = useLoginForm()

      const result = validatePassword('123')
      expect(result).toBe(false)
      expect(errors.password).toBe('Senha deve ter pelo menos 6 caracteres')
    })
  })

  describe('Limpeza de erros', () => {
    test('deve limpar erro de email', () => {
      const { errors, clearEmailError } = useLoginForm()

      errors.email = 'Erro de teste'
      clearEmailError()
      expect(errors.email).toBe('')
    })

    test('deve limpar erro de senha', () => {
      const { errors, clearPasswordError } = useLoginForm()

      errors.password = 'Erro de teste'
      clearPasswordError()
      expect(errors.password).toBe('')
    })

    test('deve limpar todos os erros', () => {
      const { errors, clearErrors } = useLoginForm()

      errors.email = 'Erro de email'
      errors.password = 'Erro de senha'
      clearErrors()
      expect(errors.email).toBe('')
      expect(errors.password).toBe('')
    })
  })

  describe('Validação completa do formulário', () => {
    test('deve validar formulário válido', () => {
      const { formData, validateForm } = useLoginForm()

      formData.email = 'usuario@email.com'
      formData.password = 'senha123'

      const result = validateForm()
      expect(result).toBe(true)
    })

    test('deve rejeitar formulário com email inválido', () => {
      const { formData, validateForm } = useLoginForm()

      formData.email = 'email-invalido'
      formData.password = 'senha123'

      const result = validateForm()
      expect(result).toBe(false)
    })

    test('deve rejeitar formulário com senha inválida', () => {
      const { formData, validateForm } = useLoginForm()

      formData.email = 'usuario@email.com'
      formData.password = '123'

      const result = validateForm()
      expect(result).toBe(false)
    })
  })

  describe('Login', () => {
    test('deve fazer login com sucesso', async () => {
      const { formData, login, isLoading } = useLoginForm()

      formData.email = 'usuario@email.com'
      formData.password = 'senha123'

      const result = await login()

      expect(result).toBe(true)
      expect(isLoading).toBe(false)
      expect(mockAuthStore.login).toHaveBeenCalledWith('usuario@email.com', 'senha123')
    })

    test('deve lidar com erro de login', async () => {
      const { formData, login, isLoading, errors } = useLoginForm()

      formData.email = 'usuario@email.com'
      formData.password = 'senha123'

      // Mock do erro de login
      const error = new Error('Credenciais inválidas')
      mockAuthStore.login.mockRejectedValue(error)

      const result = await login()

      expect(result).toBe(false)
      expect(isLoading).toBe(false)
      expect(errors.email).toContain('Credenciais inválidas')
    })

    test('deve validar formulário antes do login', async () => {
      const { formData, login } = useLoginForm()

      formData.email = 'email-invalido'
      formData.password = 'senha123'

      const result = await login()

      expect(result).toBe(false)
      expect(mockAuthStore.login).not.toHaveBeenCalled()
    })
  })

  describe('Registro', () => {
    test('deve registrar usuário com sucesso', async () => {
      const { formData, register, isLoading } = useLoginForm()

      formData.email = 'usuario@email.com'
      formData.password = 'senha123'

      // Mock do registro bem-sucedido
      mockAuthStore.register.mockResolvedValue(true)

      const result = await register()

      expect(result).toBe(true)
      expect(isLoading).toBe(false)
      expect(mockAuthStore.register).toHaveBeenCalledWith('usuario@email.com', 'senha123', '')
    })

    test('deve lidar com erro de registro', async () => {
      const { formData, register, isLoading, errors } = useLoginForm()

      formData.email = 'usuario@email.com'
      formData.password = 'senha123'

      // Mock do erro de registro
      const error = new Error('Email já cadastrado')
      mockAuthStore.register.mockRejectedValue(error)

      const result = await register()

      expect(result).toBe(false)
      expect(isLoading).toBe(false)
      expect(errors.email).toContain('Email já cadastrado')
    })
  })

  describe('Reset de senha', () => {
    test('deve enviar email de reset com sucesso', async () => {
      const { formData, resetPassword, isLoading } = useLoginForm()

      formData.email = 'usuario@email.com'

      // Mock do reset bem-sucedido
      mockAuthStore.resetPassword.mockResolvedValue(true)

      const result = await resetPassword()

      expect(result).toBe(true)
      expect(isLoading).toBe(false)
      expect(mockAuthStore.resetPassword).toHaveBeenCalledWith('usuario@email.com')
    })

    test('deve validar email antes do reset', async () => {
      const { formData, resetPassword } = useLoginForm()

      formData.email = 'email-invalido'

      const result = await resetPassword()

      expect(result).toBe(false)
      expect(mockAuthStore.resetPassword).not.toHaveBeenCalled()
    })
  })
})