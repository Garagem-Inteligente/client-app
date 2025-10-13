import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  type User as FirebaseUser
} from 'firebase/auth'
import { auth } from '@/firebase/config'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const loading = ref(true) // Start as true to wait for Firebase
  const error = ref<string | null>(null)
  const initialized = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userName = computed(() => user.value?.name || '')
  const userEmail = computed(() => user.value?.email || '')

  // Initialize auth state listener
  const initializeAuth = () => {
    onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        user.value = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
          avatar: firebaseUser.photoURL || undefined
        }
      } else {
        user.value = null
      }
      loading.value = false
      initialized.value = true
    })
  }

  // Actions
  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      
      user.value = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
        avatar: firebaseUser.photoURL || undefined
      }
      
      return true
    } catch (err: any) {
      let errorMessage = 'Erro ao fazer login'
      
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado'
          break
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta'
          break
        case 'auth/invalid-email':
          errorMessage = 'Email inválido'
          break
        case 'auth/user-disabled':
          errorMessage = 'Usuário desabilitado'
          break
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas. Tente novamente mais tarde'
          break
        default:
          errorMessage = err.message || 'Erro ao fazer login'
      }
      
      error.value = errorMessage
      return false
    } finally {
      loading.value = false
    }
  }

  const register = async (email: string, password: string, name: string) => {
    loading.value = true
    error.value = null
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      
      // Update user profile with name
      await updateProfile(firebaseUser, {
        displayName: name
      })
      
      user.value = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: name,
        avatar: firebaseUser.photoURL || undefined
      }
      
      return true
    } catch (err: any) {
      let errorMessage = 'Erro ao criar conta'
      
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este email já está em uso'
          break
        case 'auth/invalid-email':
          errorMessage = 'Email inválido'
          break
        case 'auth/weak-password':
          errorMessage = 'A senha deve ter pelo menos 6 caracteres'
          break
        case 'auth/operation-not-allowed':
          errorMessage = 'Operação não permitida'
          break
        default:
          errorMessage = err.message || 'Erro ao criar conta'
      }
      
      error.value = errorMessage
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    
    try {
      await signOut(auth)
      user.value = null
      error.value = null
    } catch (err: any) {
      error.value = err.message || 'Erro ao fazer logout'
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (email: string) => {
    loading.value = true
    error.value = null
    
    try {
      await sendPasswordResetEmail(auth, email)
      return true
    } catch (err: any) {
      let errorMessage = 'Erro ao enviar email de recuperação'
      
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado'
          break
        case 'auth/invalid-email':
          errorMessage = 'Email inválido'
          break
        default:
          errorMessage = err.message || 'Erro ao enviar email de recuperação'
      }
      
      error.value = errorMessage
      return false
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Initialize auth on store creation
  initializeAuth()

  return {
    // State
    user,
    loading,
    error,
    initialized,
    // Getters
    isAuthenticated,
    userName,
    userEmail,
    // Actions
    login,
    register,
    logout,
    resetPassword,
    clearError,
    initializeAuth
  }
})