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
  signInWithCredential,
  fetchSignInMethodsForEmail,
  type User as FirebaseUser
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase/config'
import { Capacitor } from '@capacitor/core'
import { SocialLogin } from '@capgo/capacitor-social-login'

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
        // Fluxo nativo usando @capgo/capacitor-social-login
        console.log('🔐 Login Google via @capgo/capacitor-social-login (Nativo)')
        
        // Web Client ID do OAuth 2.0 (OBRIGATÓRIO para Android)
        const WEB_CLIENT_ID = '868408826724-fraf20uj8jeflctur19rif19lbgiapse.apps.googleusercontent.com'
        
        // Inicializar o plugin com o Web Client ID
        await SocialLogin.initialize({
          google: {
            webClientId: WEB_CLIENT_ID
          }
        })
        console.log('✅ Plugin @capgo inicializado com Web Client ID')
        
        // Fazer login
        const result = await SocialLogin.login({
          provider: 'google',
          options: {
            scopes: ['profile', 'email']
          }
        })
        console.log('📱 Resultado do login:', result)
        
        // Validar estrutura da resposta
        if (!result.result || result.result.responseType !== 'online') {
          console.error('❌ Resposta inválida do Google - esperado modo online')
          throw new Error('Erro no login do Google: resposta inválida')
        }
        
        const profile = result.result.profile
        if (!profile || !profile.id || !profile.email) {
          console.error('❌ Perfil do usuário não encontrado na resposta')
          throw new Error('Perfil do usuário não encontrado')
        }
        
        console.log('✅ Perfil recebido do Google:', profile.id)
        console.log('📧 Email do usuário:', profile.email)
        console.log('👤 Nome do usuário:', profile.name)
        
        // Obter ID Token do Firebase usando a credencial do Google
        const idToken = result.result.idToken
        if (!idToken) {
          console.error('❌ ID Token não encontrado na resposta')
          throw new Error('ID Token não encontrado')
        }
        
        // Autenticar no Firebase usando o ID Token do Google
        console.log('� Autenticando no Firebase com ID Token...')
        const credential = GoogleAuthProvider.credential(idToken)
        const userCredential = await signInWithCredential(auth, credential)
        firebaseUser = userCredential.user
        
        console.log('✅ Firebase Auth sincronizado:', firebaseUser.uid)
        console.log('📧 Email sincronizado:', firebaseUser.email)
        console.log('👤 Nome sincronizado:', firebaseUser.displayName)
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
      
      // Log detalhado do erro para diagnóstico
      if (err && typeof err === 'object') {
        console.error('🔍 Detalhes completos do erro:', {
          name: (err as any).name,
          message: (err as any).message,
          code: (err as any).code,
          errorCode: (err as any).errorCode,
          serverResponse: (err as any).serverResponse,
          customData: (err as any).customData,
          stack: (err as any).stack
        })
      }
      
      // Se já setamos um erro específico, não sobrescrever
      if (!error.value) {
        let errorMessage = 'Erro ao fazer login com Google'
        
        if (err instanceof Error) {
          const message = err.message
          const errorCode = (err as any).code || (err as any).errorCode
          
          console.error('📝 Código do erro:', errorCode)
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
          } else if (errorCode === '10' || errorCode === 10 || message.includes('10:')) {
            errorMessage = 'Erro 10: Configuração OAuth inválida. Verifique o SHA-1 e Web Client ID no Google Cloud Console.'
          } else if (message.includes('12500') || errorCode === '12500') {
            errorMessage = 'Erro 12500: Falha na autenticação. Verifique se o app está registrado no Google Cloud Console com o SHA-1 correto.'
          } else if (message.includes('missing') || message.includes('insufficient') || message.includes('permission')) {
            errorMessage = 'Erro de permissões OAuth. Verifique a configuração no Google Cloud Console. O app pode estar em modo de teste.'
          } else if (message.includes('unauthorized') || message.includes('forbidden')) {
            errorMessage = 'Acesso negado. Verifique se o OAuth consent screen está configurado corretamente e em modo PRODUÇÃO.'
          } else if (message.includes('DEVELOPER_ERROR') || errorCode === 'DEVELOPER_ERROR') {
            errorMessage = 'Erro de desenvolvedor: Verifique se o Web Client ID (server_client_id) está correto no strings.xml e se o SHA-1 está cadastrado no Firebase Console.'
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




