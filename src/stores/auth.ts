import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userName = computed(() => user.value?.name || '')
  const userEmail = computed(() => user.value?.email || '')

  // Actions
  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    
    try {
      // TODO: Implement Firebase authentication
      console.log('Login attempt:', { email, password })
      
      // Simulate login for now
      user.value = {
        id: '1',
        email,
        name: email.split('@')[0]
      }
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  const register = async (email: string, password: string, name: string) => {
    loading.value = true
    error.value = null
    
    try {
      // TODO: Implement Firebase authentication
      console.log('Register attempt:', { email, password, name })
      
      // Simulate registration for now
      user.value = {
        id: '1',
        email,
        name
      }
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Registration failed'
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    
    try {
      // TODO: Implement Firebase sign out
      user.value = null
      error.value = null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Logout failed'
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    user,
    loading,
    error,
    // Getters
    isAuthenticated,
    userName,
    userEmail,
    // Actions
    login,
    register,
    logout,
    clearError
  }
})