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
import { httpsCallable } from 'firebase/functions'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { functions, db } from '@/firebase/config'
import { auth } from '@/firebase/config'
import { translateFirebaseError } from '@/utils/errorMessages'

export type UserType = 'user' | 'workshop'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  userType: UserType
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
  const userType = computed(() => user.value?.userType || 'user')
  const isWorkshop = computed(() => user.value?.userType === 'workshop')

  // Initialize auth state listener
  const initializeAuth = () => {
    onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Buscar userType do Firestore (com fallback para 'user')
        let userType: UserType = 'user'
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            userType = userDoc.data()?.userType || 'user'
          }
        } catch (error) {
          console.warn('Erro ao buscar userType do Firestore, usando padrão "user":', error)
        }
        
        user.value = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
          avatar: firebaseUser.photoURL || undefined,
          userType: userType
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
      
      // Buscar userType do Firestore (com fallback para 'user')
      let userType: UserType = 'user'
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          userType = userDoc.data()?.userType || 'user'
        }
      } catch (firestoreErr) {
        console.warn('Erro ao buscar userType do Firestore, usando padrão "user":', firestoreErr)
      }
      
      user.value = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
        avatar: firebaseUser.photoURL || undefined,
        userType: userType
      }
      
      return true
    } catch (err: any) {
      error.value = translateFirebaseError(err, 'Erro ao fazer login')
      return false
    } finally {
      loading.value = false
    }
  }

  const register = async (email: string, password: string, name: string, userType: UserType = 'user') => {
    loading.value = true
    error.value = null
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      
      // Update user profile with name
      await updateProfile(firebaseUser, {
        displayName: name
      })
      
      // Salvar userType no Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        email: firebaseUser.email,
        name: name,
        userType: userType,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      user.value = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: name,
        avatar: firebaseUser.photoURL || undefined,
        userType: userType
      }
      
      // Enviar email de boas-vindas (não bloqueante)
      try {
        const sendWelcomeEmail = httpsCallable<{ to: string; userName: string }, { success: boolean }>(functions, 'sendWelcomeEmail')
        await sendWelcomeEmail({ to: email, userName: name })
      } catch (welcomeErr) {
        // Não falhar o registro se o email não for enviado
        console.warn('Falha ao enviar email de boas-vindas:', welcomeErr)
      }

      return true
    } catch (err: any) {
      error.value = translateFirebaseError(err, 'Erro ao criar conta')
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
    userType,
    isWorkshop,
    // Actions
    login,
    register,
    logout,
    resetPassword,
    clearError,
    initializeAuth
  }
})