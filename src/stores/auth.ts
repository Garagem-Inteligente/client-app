import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  type User as FirebaseUser
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase/config'
import { Capacitor } from '@capacitor/core'
import { FirebaseAuthentication } from '@capacitor-firebase/authentication'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  userType: 'user' | 'workshop'
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userName = computed(() => user.value?.name || '')
  const userEmail = computed(() => user.value?.email || '')
  const userType = computed(() => user.value?.userType || 'user')

  // Initialize auth state listener
  const initializeAuth = () => {
    onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Buscar userType do Firestore (com fallback para 'user')
        let userType: 'user' | 'workshop' = 'user'
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
      console.log('🔐 Tentando login com email/senha:', email)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      console.log('✅ Login bem-sucedido! UID:', firebaseUser.uid)
      console.log('📋 Provedores disponíveis:', firebaseUser.providerData.map(p => p.providerId))
      
      // Buscar userType do Firestore (com fallback para 'user')
      let userType: 'user' | 'workshop' = 'user'
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          userType = userDoc.data()?.userType || 'user'
        }
      } catch (error_) {
        console.warn('Erro ao buscar userType do Firestore, usando padrão "user":', error_)
      }
      
      user.value = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
        avatar: firebaseUser.photoURL || undefined,
        userType: userType
      }
      
      return true
    } catch (err: unknown) {
      console.error('❌ Erro no login:', err)
      
      let friendlyError = 'Erro ao fazer login'
      
      if (err instanceof Error) {
        const errorMessage = err.message
        console.error('📝 Mensagem de erro:', errorMessage)
        
        // Mensagens amigáveis para erros comuns
        if (errorMessage.includes('invalid-credential') || errorMessage.includes('wrong-password')) {
          friendlyError = 'Senha incorreta. Se você vinculou sua conta com o Google, use o botão "Continuar com Google" ou clique em "Esqueceu a senha?" para redefinir.'
        } else if (errorMessage.includes('user-not-found')) {
          friendlyError = 'Usuário não encontrado. Verifique o email digitado.'
        } else if (errorMessage.includes('too-many-requests')) {
          friendlyError = 'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.'
        } else if (errorMessage.includes('invalid-email')) {
          friendlyError = 'Email inválido. Verifique o formato do email.'
        } else {
          friendlyError = errorMessage
        }
      }
      
      error.value = friendlyError
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
      
      // Salvar userType no Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        email: firebaseUser.email,
        name: name,
        userType: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      user.value = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: name,
        avatar: firebaseUser.photoURL || undefined,
        userType: 'user'
      }
      
      return true
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta'
      error.value = errorMessage
      return false
    } finally {
      loading.value = false
    }
  }

  const signInWithGoogle = async () => {
    loading.value = true
    error.value = null
    
    try {
      const isNative = Capacitor.isNativePlatform()
      let firebaseUser: FirebaseUser
      
      if (isNative) {
        // Fluxo nativo para Android/iOS usando Capacitor Firebase Authentication
        console.log('🔐 Login Google via Capacitor (Nativo)')
        
        // Verificar se o plugin está disponível
        if (!FirebaseAuthentication || typeof FirebaseAuthentication.signInWithGoogle !== 'function') {
          console.error('❌ Plugin FirebaseAuthentication não está disponível')
          throw new Error('Plugin de autenticação não está disponível. Reinstale o aplicativo.')
        }
        
        // Verificar se estamos realmente em uma plataforma nativa
        console.log('🔍 Detalhes da plataforma:', {
          isNative: Capacitor.isNativePlatform(),
          platform: Capacitor.getPlatform(),
          isPluginAvailable: Capacitor.isPluginAvailable('FirebaseAuthentication')
        })
        
        // CRÍTICO: passar o serverClientId (Web Client ID) para Android
        const result = await FirebaseAuthentication.signInWithGoogle({
          mode: 'redirect',
          scopes: ['profile', 'email']
        } as any)
        console.log('📱 Resultado do FirebaseAuthentication:', result)
        
        if (!result.user) {
          console.error('❌ Usuário não encontrado na resposta do Google')
          throw new Error('Usuário não encontrado na resposta do Google')
        }
        
        console.log('✅ Usuário recebido do plugin:', result.user.uid)
        console.log('📧 Email do usuário:', result.user.email)
        console.log('👤 Nome do usuário:', result.user.displayName)
        
        // Tentar usar o usuário retornado pelo plugin diretamente
        if (result.user && result.user.uid) {
          console.log('🔄 Usando usuário do plugin diretamente...')
          // Converter o usuário do plugin para FirebaseUser
          firebaseUser = {
            uid: result.user.uid,
            email: result.user.email || null,
            displayName: result.user.displayName || null,
            photoURL: result.user.photoUrl || null,
            emailVerified: result.user.emailVerified || false,
            isAnonymous: false,
            metadata: {} as any,
            providerData: [],
            refreshToken: '',
            tenantId: null,
            phoneNumber: null,
            providerId: 'google.com',
            delete: async () => {},
            getIdToken: async () => '',
            getIdTokenResult: async () => ({} as any),
            reload: async () => {},
            toJSON: () => ({})
          } as unknown as FirebaseUser
        } else {
          // Fallback: aguardar sincronização com Firebase Auth
          console.log('🔄 Aguardando sincronização com Firebase Auth...')
          let attempts = 0
          let currentUser = auth.currentUser
          
          while (!currentUser && attempts < 10) {
            console.log(`⏳ Aguardando sincronização com Firebase Auth... tentativa ${attempts + 1}`)
            await new Promise(resolve => setTimeout(resolve, 500))
            currentUser = auth.currentUser
            attempts++
          }
          
          if (!currentUser) {
            console.error('❌ Erro ao sincronizar com Firebase Auth após 10 tentativas')
            console.error('🔍 Estado do auth:', {
              hasCurrentUser: !!auth.currentUser,
              isSignedIn: !!auth.currentUser,
              userUid: auth.currentUser?.uid
            })
            throw new Error('Erro ao sincronizar com Firebase Auth. O usuário foi autenticado no Google mas não foi sincronizado com o Firebase. Tente novamente.')
          }
          
          console.log('✅ Firebase Auth sincronizado:', currentUser.uid)
          console.log('📧 Email sincronizado:', currentUser.email)
          console.log('👤 Nome sincronizado:', currentUser.displayName)
          firebaseUser = currentUser
        }
      } else {
        // Fluxo web usando popup
        console.log('🔐 Login Google via Popup (Web)')
        
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({
          prompt: 'select_account'
        })
        
        const result = await signInWithPopup(auth, provider)
        firebaseUser = result.user
      }
      
      if (!firebaseUser.email) {
        throw new Error('Email não encontrado na conta Google')
      }
      
      // Verificar se o usuário já existe no Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid)
      const userDoc = await getDoc(userDocRef)
      
      let userType: 'user' | 'workshop' = 'user'
      
      if (userDoc.exists()) {
        // Usuário existente - obter userType
        const userData = userDoc.data()
        userType = userData.userType || 'user'
        
        // Atualizar avatar e adicionar 'google' aos providers
        const providers = userData.providers || ['google']
        if (!providers.includes('google')) {
          providers.push('google')
        }
        
        await setDoc(userDocRef, {
          ...userData,
          avatar: firebaseUser.photoURL || userData.avatar,
          providers: providers,
          updatedAt: new Date()
        }, { merge: true })
      } else {
        // Novo usuário - criar documento no Firestore
        await setDoc(userDocRef, {
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0] || 'Usuário',
          avatar: firebaseUser.photoURL || undefined,
          userType: 'user',
          providers: ['google'],
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
      
      user.value = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0] || 'Usuário',
        avatar: firebaseUser.photoURL || undefined,
        userType
      }
      
      return true
    } catch (err: unknown) {
      console.error('❌ Erro no login Google:', err)
      
      // Se já setamos um erro específico, não sobrescrever
      if (!error.value) {
        let errorMessage = 'Erro ao fazer login com Google'
        
        if (err instanceof Error) {
          const message = err.message
          console.error('📝 Mensagem de erro detalhada:', message)
          
          // Tratamento específico para erros do Android
          if (message.includes('signInWithGoogle')) {
            errorMessage = 'Falha ao conectar com o Google. Verifique se o Google Play Services está atualizado e tente novamente.'
          } else if (message.includes('network')) {
            errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.'
          } else if (message.includes('cancelled') || message.includes('canceled')) {
            errorMessage = 'Login cancelado pelo usuário.'
          } else if (message.includes('sincronizar')) {
            errorMessage = 'Erro de sincronização. Tente novamente em alguns segundos.'
          } else if (message.includes('Plugin de autenticação não está disponível')) {
            errorMessage = 'Plugin de autenticação não está disponível. Reinstale o aplicativo.'
          } else if (message.includes('10')) {
            errorMessage = 'Timeout na autenticação. Tente novamente.'
          } else if (message.includes('missing') || message.includes('insufficient') || message.includes('permission')) {
            errorMessage = 'Erro de permissões OAuth. Verifique a configuração no Google Cloud Console. O app pode estar em modo de teste.'
          } else if (message.includes('unauthorized') || message.includes('forbidden')) {
            errorMessage = 'Acesso negado. Verifique se o OAuth consent screen está configurado corretamente.'
          } else {
            errorMessage = message
          }
        }
        
        error.value = errorMessage
      }
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer logout'
      error.value = errorMessage
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar email de recuperação'
      error.value = errorMessage
      return false
    } finally {
      loading.value = false
    }
  }

  // Verificar métodos de login disponíveis para um email
  const checkSignInMethods = async (email: string): Promise<string[]> => {
    try {
      return await fetchSignInMethodsForEmail(auth, email)
    } catch (err: unknown) {
      console.error('Erro ao verificar métodos de login:', err)
      return []
    }
  }

  // Vincular conta Google a uma conta existente com email/senha
  const linkGoogleAccount = async (email: string, password: string, _googleCredential: string): Promise<{ success: boolean; error?: string }> => {
    loading.value = true
    error.value = null
    
    try {
      // 1. Fazer logout se houver sessão ativa
      if (auth.currentUser) {
        await signOut(auth)
      }
      
      // 2. Fazer login com email e senha
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // 3. Vincular Google usando linkWithPopup
      const provider = new GoogleAuthProvider()
      const { linkWithPopup } = await import('firebase/auth')
      await linkWithPopup(userCredential.user, provider)
      
      // 4. Atualizar Firestore para incluir 'google' nos providers
      const userDocRef = doc(db, 'users', userCredential.user.uid)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        const userData = userDoc.data()
        const providers = userData.providers || ['password']
        if (!providers.includes('google')) {
          providers.push('google')
        }
        
        await setDoc(userDocRef, {
          ...userData,
          providers: providers,
          avatar: userCredential.user.photoURL || userData.avatar,
          updatedAt: new Date()
        }, { merge: true })
        
        // Atualizar estado local
        user.value = {
          id: userCredential.user.uid,
          email: userCredential.user.email || '',
          name: userData.name || userCredential.user.displayName || '',
          avatar: userCredential.user.photoURL || userData.avatar,
          userType: userData.userType || 'user'
        }
      }
      
      return { success: true }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao vincular conta Google'
      
      // Mensagens de erro mais amigáveis
      let friendlyError = errorMessage
      if (errorMessage.includes('wrong-password')) {
        friendlyError = 'Senha incorreta. Tente novamente.'
      } else if (errorMessage.includes('user-not-found')) {
        friendlyError = 'Usuário não encontrado.'
      } else if (errorMessage.includes('too-many-requests')) {
        friendlyError = 'Muitas tentativas. Aguarde alguns minutos.'
      }
      
      error.value = friendlyError
      return { success: false, error: friendlyError }
    } finally {
      loading.value = false
    }
  }

  // Desvincular conta Google (manter apenas email/senha)
  const unlinkGoogleAccount = async (): Promise<boolean> => {
    loading.value = true
    error.value = null
    
    try {
      if (!auth.currentUser) {
        throw new Error('Usuário não autenticado')
      }

      // Verificar se o usuário tem email/senha como método alternativo
      const providers = auth.currentUser.providerData.map(p => p.providerId)
      
      if (!providers.includes('password')) {
        error.value = 'Você precisa ter uma senha configurada antes de desvincular o Google. Configure uma senha primeiro.'
        return false
      }

      // Desvincular Google
      const { unlink } = await import('firebase/auth')
      await unlink(auth.currentUser, 'google.com')

      // Atualizar Firestore
      if (user.value) {
        const userDocRef = doc(db, 'users', user.value.id)
        const userDoc = await getDoc(userDocRef)
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          const providers = (userData.providers || []).filter((p: string) => p !== 'google')
          
          await setDoc(userDocRef, {
            ...userData,
            providers: providers,
            updatedAt: new Date()
          }, { merge: true })
        }
      }

      return true
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao desvincular conta Google'
      error.value = errorMessage
      return false
    } finally {
      loading.value = false
    }
  }

  // Obter providers vinculados ao usuário atual
  const getUserProviders = (): string[] => {
    if (!auth.currentUser) return []
    return auth.currentUser.providerData.map(p => p.providerId)
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
    // Actions
    login,
    register,
    signInWithGoogle,
    logout,
    resetPassword,
    clearError,
    initializeAuth,
    checkSignInMethods,
    linkGoogleAccount,
    unlinkGoogleAccount,
    getUserProviders
  }
})




