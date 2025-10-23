import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export interface LoginForm {
  email: string
  password: string
}

export function useLoginForm() {
  const router = useRouter()
  const authStore = useAuthStore()

  // Form state
  const form = ref<LoginForm>({
    email: '',
    password: ''
  })

  const loading = ref(false)
  const error = ref('')

  // Computed
  const isFormValid = computed(() => {
    return form.value.email.trim() !== '' && form.value.password.trim() !== ''
  })

  const isEmailValid = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(form.value.email)
  })

  // Methods
  const validateForm = (): boolean => {
    if (!form.value.email.trim()) {
      error.value = 'Email é obrigatório'
      return false
    }

    if (!isEmailValid.value) {
      error.value = 'Email inválido'
      return false
    }

    if (!form.value.password.trim()) {
      error.value = 'Senha é obrigatória'
      return false
    }

    if (form.value.password.length < 6) {
      error.value = 'Senha deve ter pelo menos 6 caracteres'
      return false
    }

    return true
  }

  const handleLogin = async (): Promise<boolean> => {
    if (!validateForm()) {
      return false
    }

    loading.value = true
    error.value = ''

    try {
      const success = await authStore.login(form.value.email, form.value.password)

      if (success) {
        // Redirect to intended page or home
        const redirect = router.currentRoute.value.query.redirect as string
        await router.push(redirect || '/tabs/home')
        return true
      } else {
        error.value = authStore.error || 'Erro ao fazer login'
        return false
      }
    } catch (err) {
      console.error('Login error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado ao fazer login'
      error.value = errorMessage
      return false
    } finally {
      loading.value = false
    }
  }

  const handleForgotPassword = async (): Promise<boolean> => {
    if (!form.value.email.trim()) {
      error.value = 'Digite seu email primeiro'
      return false
    }

    if (!isEmailValid.value) {
      error.value = 'Digite um email válido primeiro'
      return false
    }

    try {
      const success = await authStore.resetPassword(form.value.email)
      if (success) {
        error.value = ''
        return true
      } else {
        error.value = authStore.error || 'Erro ao enviar email de recuperação'
        return false
      }
    } catch (err) {
      console.error('Password reset error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado'
      error.value = errorMessage
      return false
    }
  }

  const resetForm = () => {
    form.value = {
      email: '',
      password: ''
    }
    error.value = ''
    loading.value = false
  }

  const setError = (message: string) => {
    error.value = message
  }

  return {
    // State
    form,
    loading,
    error,

    // Computed
    isFormValid,
    isEmailValid,

    // Methods
    handleLogin,
    handleForgotPassword,
    resetForm,
    setError,
    validateForm
  }
}