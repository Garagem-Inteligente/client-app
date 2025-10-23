import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithPopup,
  unlink,
  type User
} from 'firebase/auth'
import { auth } from '@/firebase/config'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value)

  const userId = computed(() => user.value?.uid || null)

  const userEmail = computed(() => user.value?.email || null)

  const userName = computed(() => {
    if (!user.value) return null
    // Try to get displayName, or fallback to email prefix
    return user.value.displayName || user.value.email?.split('@')[0] || null
  })

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

  const register = async (email: string, password: string): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      user.value = result.user
      return true
    } catch (err) {
      console.error('Register error:', err)
      error.value = err instanceof Error ? err.message : 'Erro ao criar conta'
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

  const signInWithGoogle = async (): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      user.value = result.user
      return true
    } catch (err) {
      console.error('Google sign-in error:', err)
      error.value = err instanceof Error ? err.message : 'Erro ao fazer login com Google'
      return false
    } finally {
      loading.value = false
    }
  }

  const linkGoogleAccount = async (): Promise<boolean> => {
    if (!auth.currentUser) {
      error.value = 'Usuário não autenticado'
      return false
    }

    loading.value = true
    error.value = null

    try {
      const provider = new GoogleAuthProvider()
      const result = await linkWithPopup(auth.currentUser, provider)
      user.value = result.user
      return true
    } catch (err) {
      console.error('Link Google account error:', err)
      error.value = err instanceof Error ? err.message : 'Erro ao vincular conta Google'
      return false
    } finally {
      loading.value = false
    }
  }

  const unlinkGoogleAccount = async (): Promise<boolean> => {
    if (!auth.currentUser) {
      error.value = 'Usuário não autenticado'
      return false
    }

    loading.value = true
    error.value = null

    try {
      const provider = new GoogleAuthProvider()
      await unlink(auth.currentUser, provider.providerId)
      // Refresh user data
      user.value = auth.currentUser
      return true
    } catch (err) {
      console.error('Unlink Google account error:', err)
      error.value = err instanceof Error ? err.message : 'Erro ao desvincular conta Google'
      return false
    } finally {
      loading.value = false
    }
  }

  const getUserProviders = (): string[] => {
    if (!user.value) return []

    const providers: string[] = []

    // Check email/password provider
    if (user.value.email && user.value.providerData.some(p => p.providerId === 'password')) {
      providers.push('password')
    }

    // Check Google provider
    if (user.value.providerData.some(p => p.providerId === 'google.com')) {
      providers.push('google.com')
    }

    return providers
  }

  // Initialize auth state listener
  const initAuth = () => {
    onAuthStateChanged(auth, (firebaseUser: any) => {
      if (firebaseUser) {
        // Add custom properties for backward compatibility
        firebaseUser.id = firebaseUser.uid
        user.value = firebaseUser
      } else {
        user.value = null
      }
      initialized.value = true
      loading.value = false
    })
  }

  return {
    // State
    user,
    loading,
    error,
    initialized,

    // Getters
    isAuthenticated,
    userId,
    userEmail,
    userName,

    // Actions
    login,
    register,
    logout,
    resetPassword,
    signInWithGoogle,
    linkGoogleAccount,
    unlinkGoogleAccount,
    getUserProviders,
    initAuth
  }
})