<template>
  <div>
    <button
      @click="handleGoogleSignIn"
      :disabled="loading"
      class="google-sign-in-button"
      type="button"
    >
      <div class="button-content">
        <svg
          v-if="!loading"
          class="google-icon"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        
        <ion-spinner 
          v-else 
          name="crescent" 
          class="spinner"
        ></ion-spinner>
        
        <span class="button-text">{{ loading ? 'Conectando...' : 'Continuar com Google' }}</span>
      </div>
    </button>

    <!-- Account Linking Modal -->
    <AccountLinkingModal
      ref="linkingModalRef"
      :is-open="showLinkingModal"
      :email="emailToLink"
      :google-credential="googleCredentialToLink"
      @dismiss="handleDismissModal"
      @link="handleLinkAccount"
      @forgot-password="handleForgotPassword"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonSpinner, alertController } from '@ionic/vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import AccountLinkingModal from '../molecules/AccountLinkingModal.vue'

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)

// Account Linking Modal
const showLinkingModal = ref(false)
const emailToLink = ref('')
const googleCredentialToLink = ref<string | null>(null)
const linkingModalRef = ref<InstanceType<typeof AccountLinkingModal> | null>(null)

const handleGoogleSignIn = async () => {
  loading.value = true
  
  try {
    const success = await authStore.signInWithGoogle()
    
    if (success) {
      // Redirect to home after successful login
      await router.push('/tabs/home')
    } else if (authStore.error && authStore.error.includes('auth/account-exists-with-different-credential')) {
      // Este erro específico indica conflito - mas vamos detectar antes
      console.error('Account conflict detected')
    }
  } catch (error: unknown) {
    console.error('Google Sign-In error:', error)
    
    // Verificar se é erro de conta existente
    if (error instanceof Error) {
      const errorCode = (error as { code?: string }).code
      
      if (errorCode === 'auth/account-exists-with-different-credential') {
        // Mostrar modal para vincular
        const errorEmail = (error as { customData?: { email?: string } }).customData?.email
        if (errorEmail) {
          emailToLink.value = errorEmail
          showLinkingModal.value = true
        }
      }
    }
  } finally {
    loading.value = false
  }
}

const handleLinkAccount = async (password: string) => {
  if (!linkingModalRef.value) return
  
  linkingModalRef.value.setLoading(true)
  
  const result = await authStore.linkGoogleAccount(
    emailToLink.value,
    password,
    googleCredentialToLink.value || ''
  )
  
  if (result.success) {
    // Vincul Success!
    linkingModalRef.value.resetForm()
    showLinkingModal.value = false
    
    // Mostrar mensagem de sucesso
    const alert = await alertController.create({
      header: 'Conta Vinculada!',
      message: 'Sua conta Google foi vinculada com sucesso. Agora você pode fazer login com email/senha ou Google.',
      buttons: ['OK']
    })
    await alert.present()
    await alert.onDidDismiss()
    
    // Redirecionar para home
    await router.push('/tabs/home')
  } else {
    // Mostrar erro no modal
    linkingModalRef.value.setError(result.error || 'Erro ao vincular conta')
  }
}

const handleForgotPassword = async () => {
  showLinkingModal.value = false
  
  const alert = await alertController.create({
    header: 'Recuperar Senha',
    message: `Deseja receber um email de recuperação de senha para ${emailToLink.value}?`,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Enviar',
        handler: async () => {
          const success = await authStore.resetPassword(emailToLink.value)
          if (success) {
            const successAlert = await alertController.create({
              header: 'Email Enviado',
              message: 'Verifique sua caixa de entrada para redefinir sua senha.',
              buttons: ['OK']
            })
            await successAlert.present()
          }
        }
      }
    ]
  })
  await alert.present()
}

const handleDismissModal = () => {
  showLinkingModal.value = false
  if (linkingModalRef.value) {
    linkingModalRef.value.resetForm()
  }
}
</script>

<style scoped>
.google-sign-in-button {
  width: 100%;
  height: 56px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.google-sign-in-button:hover:not(:disabled) {
  background: #f8f9fa;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.google-sign-in-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.google-sign-in-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 100%;
}

.google-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.spinner {
  width: 24px;
  height: 24px;
  --color: #4285F4;
}

.button-text {
  font-size: 16px;
  font-weight: 500;
  color: #3c4043;
  letter-spacing: 0.25px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .google-sign-in-button {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
  }
  
  .google-sign-in-button:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.15);
  }
  
  .button-text {
    color: #ffffff;
  }
}

/* Animation for loading state */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.google-sign-in-button:disabled .button-text {
  animation: pulse 1.5s ease-in-out infinite;
}
</style>
