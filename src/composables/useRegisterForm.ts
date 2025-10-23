import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface RegisterFormErrors {
  name: string
  email: string
  password: string
  confirmPassword: string
  general: string
}

export function useRegisterForm() {
  const router = useRouter()
  const authStore = useAuthStore()

  // Form state
  const formData = reactive<RegisterForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const isLoading = ref(false)
  const successMessage = ref('')
  const errors = reactive<RegisterFormErrors>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: ''
  })

  // Computed
  const isFormValid = computed(() => {
    return formData.name.trim() !== '' &&
           formData.email.trim() !== '' &&
           formData.password.trim() !== '' &&
           formData.confirmPassword.trim() !== '' &&
           formData.password === formData.confirmPassword &&
           formData.password.length >= 6
  })

  const isEmailValid = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(formData.email)
  })

  const passwordStrength = computed(() => {
    const password = formData.password
    if (!password) return 0

    let strength = 0
    if (password.length >= 6) strength += 25
    if (password.length >= 8) strength += 25
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25
    if (/\d/.test(password)) strength += 15
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10

    return Math.min(strength, 100)
  })

  const passwordStrengthLabel = computed(() => {
    const strength = passwordStrength.value
    if (strength < 40) return 'Fraca'
    if (strength < 70) return 'Média'
    return 'Forte'
  })

  // Methods
  const validateName = (name: string): boolean => {
    if (!name.trim()) {
      errors.name = 'Nome é obrigatório'
      return false
    }

    if (name.trim().length < 2) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres'
      return false
    }

    errors.name = ''
    return true
  }

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      errors.email = 'E-mail é obrigatório'
      return false
    }

    if (email.includes(' ')) {
      errors.email = 'E-mail não deve conter espaços'
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      errors.email = 'E-mail deve ter um formato válido'
      return false
    }

    errors.email = ''
    return true
  }

  const validatePassword = (password: string): boolean => {
    if (!password.trim()) {
      errors.password = 'Senha é obrigatória'
      return false
    }

    if (password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres'
      return false
    }

    errors.password = ''
    return true
  }

  const validateConfirmPassword = (confirmPassword: string): boolean => {
    if (!confirmPassword.trim()) {
      errors.confirmPassword = 'Confirmação de senha é obrigatória'
      return false
    }

    if (confirmPassword !== formData.password) {
      errors.confirmPassword = 'As senhas não coincidem'
      return false
    }

    errors.confirmPassword = ''
    return true
  }

  const validateForm = (): boolean => {
    const nameValid = validateName(formData.name)
    const emailValid = validateEmail(formData.email)
    const passwordValid = validatePassword(formData.password)
    const confirmPasswordValid = validateConfirmPassword(formData.confirmPassword)
    return nameValid && emailValid && passwordValid && confirmPasswordValid
  }

  const clearErrors = () => {
    errors.name = ''
    errors.email = ''
    errors.password = ''
    errors.confirmPassword = ''
    errors.general = ''
  }

  const clearNameError = () => {
    errors.name = ''
  }

  const clearEmailError = () => {
    errors.email = ''
  }

  const clearPasswordError = () => {
    errors.password = ''
  }

  const clearConfirmPasswordError = () => {
    errors.confirmPassword = ''
  }

  const register = async (): Promise<boolean> => {
    if (!validateForm()) {
      return false
    }

    isLoading.value = true
    successMessage.value = ''
    clearErrors()

    try {
      const success = await authStore.register(
        formData.email,
        formData.password,
        formData.name
      )

      if (success) {
        successMessage.value = 'Conta criada com sucesso! Redirecionando...'
        setTimeout(() => {
          router.push('/tabs/home')
        }, 2000)
        return true
      } else {
        errors.general = authStore.error || 'Erro ao criar conta'
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado ao criar conta'
      errors.general = errorMessage
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    formData,
    errors,
    isLoading,
    successMessage,

    // Computed
    isFormValid,
    isEmailValid,
    passwordStrength,
    passwordStrengthLabel,

    // Methods
    validateName,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    validateForm,
    clearErrors,
    clearNameError,
    clearEmailError,
    clearPasswordError,
    clearConfirmPasswordError,
    register
  }
}