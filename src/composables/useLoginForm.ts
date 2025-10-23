import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export interface LoginForm {
  email: string
  password: string
  name?: string
}

export interface FormErrors {
  email: string
  password: string
}

export function useLoginForm() {
  const router = useRouter()
  const authStore = useAuthStore()

  // Form state
  const formData = reactive<LoginForm>({
    email: '',
    password: '',
    name: ''
  })

  const isLoading = ref(false)
  const errors = reactive<FormErrors>({
    email: '',
    password: ''
  })

  // Computed
  const isFormValid = computed(() => {
    return formData.email.trim() !== '' && formData.password.trim() !== ''
  })

  const isEmailValid = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(formData.email)
  })

  // Methods
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

  const validateForm = (): boolean => {
    const emailValid = validateEmail(formData.email)
    const passwordValid = validatePassword(formData.password)
    return emailValid && passwordValid
  }

  const clearEmailError = () => {
    errors.email = ''
  }

  const clearPasswordError = () => {
    errors.password = ''
  }

  const clearErrors = () => {
    errors.email = ''
    errors.password = ''
  }

  const login = async (): Promise<boolean> => {
    if (!validateForm()) {
      return false
    }

    isLoading.value = true
    clearErrors()

    try {
      const success = await authStore.login(formData.email, formData.password)

      if (success) {
        // Redirect to intended page or home
        const redirect = router.currentRoute.value.query.redirect as string
        await router.push(redirect || '/tabs/home')
        return true
      } else {
        errors.email = authStore.error || 'Erro ao fazer login'
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado ao fazer login'
      errors.email = errorMessage
      return false
    } finally {
      isLoading.value = false
    }
  }

  const register = async (): Promise<boolean> => {
    if (!validateForm()) {
      return false
    }

    isLoading.value = true
    clearErrors()

    try {
      const success = await authStore.register(formData.email, formData.password, formData.name || '')

      if (success) {
        // Redirect to intended page or home
        const redirect = router.currentRoute.value.query.redirect as string
        await router.push(redirect || '/tabs/home')
        return true
      } else {
        errors.email = authStore.error || 'Erro ao registrar usuário'
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado ao registrar'
      errors.email = errorMessage
      return false
    } finally {
      isLoading.value = false
    }
  }

  const resetPassword = async (): Promise<boolean> => {
    if (!validateEmail(formData.email)) {
      return false
    }

    isLoading.value = true

    try {
      const success = await authStore.resetPassword(formData.email)
      if (success) {
        clearErrors()
        return true
      } else {
        errors.email = authStore.error || 'Erro ao enviar email de recuperação'
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado'
      errors.email = errorMessage
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    formData,
    errors,
    isLoading: isLoading.value,

    // Computed
    isFormValid,
    isEmailValid,

    // Methods
    validateEmail,
    validatePassword,
    validateForm,
    clearEmailError,
    clearPasswordError,
    clearErrors,
    login,
    register,
    resetPassword
  }
}