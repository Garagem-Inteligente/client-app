import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  type User
} from 'firebase/auth'
import { auth } from '@/firebase/config'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)

  // Actions
  const login = async (email: string, password: string): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      user.value = result.user
      return true
    } catch (err) {
      console.error('Login error:', err)
      error.value = err instanceof Error ? err.message : 'Erro ao fazer login'
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async (): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      await signOut(auth)
      user.value = null
    } catch (err) {
      console.error('Logout error:', err)
      error.value = err instanceof Error ? err.message : 'Erro ao fazer logout'
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (email: string): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      await sendPasswordResetEmail(auth, email)
      return true
    } catch (err) {
      console.error('Password reset error:', err)
      error.value = err instanceof Error ? err.message : 'Erro ao enviar email de recuperação'
      return false
    } finally {
      loading.value = false
    }
  }

  // Initialize auth state listener
  const initAuth = () => {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
      loading.value = false
    })
  }

  return {
    // State
    user,
    loading,
    error,

    // Getters
    isAuthenticated,

    // Actions
    login,
    logout,
    resetPassword,
    initAuth
  }
})