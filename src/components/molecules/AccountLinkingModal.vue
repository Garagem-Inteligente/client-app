<template>
  <ion-modal
    :is-open="isOpen"
    @didDismiss="handleDismiss"
    :backdrop-dismiss="false"
  >
    <ion-header>
      <ion-toolbar>
        <ion-title>Vincular Conta Google</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="handleCancel" :disabled="loading">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="modal-content">
        <!-- Icon -->
        <div class="icon-wrapper">
          <ion-icon :icon="linkOutline" class="link-icon"></ion-icon>
        </div>

        <!-- Title -->
        <h2 class="modal-title">Conta Existente Detectada</h2>

        <!-- Description -->
        <p class="modal-description">
          Você já tem uma conta cadastrada com <strong>{{ email }}</strong> usando senha.
        </p>
        <p class="modal-description">
          Digite sua senha para vincular sua conta Google e poder fazer login com ambos os métodos.
        </p>

        <!-- Password Input -->
        <div class="form-group">
          <label for="account-link-password" class="form-label">
            <ion-icon :icon="lockClosedOutline" class="label-icon"></ion-icon>
            Senha da sua conta
          </label>
          <div class="input-wrapper">
            <input
              id="account-link-password"
              v-model="password"
              type="password"
              class="form-input"
              placeholder="Digite sua senha"
              :disabled="loading"
              @keyup.enter="handleLink"
              autocomplete="current-password"
            />
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="error-message">
          <ion-icon :icon="alertCircle" class="error-icon"></ion-icon>
          <span>{{ error }}</span>
        </div>

        <!-- Forgot Password Link -->
        <button 
          type="button" 
          @click="handleForgotPassword" 
          class="text-link"
          :disabled="loading"
        >
          Esqueceu a senha?
        </button>

        <!-- Actions -->
        <div class="modal-actions">
          <button
            @click="handleCancel"
            class="secondary-button"
            :disabled="loading"
          >
            Cancelar
          </button>
          <button
            @click="handleLink"
            class="primary-button"
            :disabled="loading || !password"
          >
            <ion-spinner v-if="loading" name="crescent" class="button-spinner"></ion-spinner>
            <span v-else>Vincular Conta</span>
          </button>
        </div>

        <!-- Info -->
        <div class="info-box">
          <ion-icon :icon="informationCircleOutline" class="info-icon"></ion-icon>
          <p class="info-text">
            Após vincular, você poderá fazer login usando seu email e senha OU sua conta Google.
          </p>
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonIcon,
  IonSpinner
} from '@ionic/vue'
import {
  closeOutline,
  linkOutline,
  lockClosedOutline,
  alertCircle,
  informationCircleOutline
} from 'ionicons/icons'

interface Props {
  isOpen: boolean
  email: string
  googleCredential: string | null
}

interface Emits {
  (e: 'dismiss'): void
  (e: 'link', password: string): void
  (e: 'forgotPassword'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const password = ref('')
const loading = ref(false)
const error = ref('')

const handleDismiss = () => {
  if (!loading.value) {
    password.value = ''
    error.value = ''
    emit('dismiss')
  }
}

const handleCancel = () => {
  handleDismiss()
}

const handleLink = () => {
  if (!password.value || loading.value) return
  
  error.value = ''
  loading.value = true
  
  emit('link', password.value)
}

const handleForgotPassword = () => {
  emit('forgotPassword')
}

// Expor método para setar erro externamente
defineExpose({
  setError: (msg: string) => {
    error.value = msg
    loading.value = false
  },
  setLoading: (value: boolean) => {
    loading.value = value
  },
  resetForm: () => {
    password.value = ''
    error.value = ''
    loading.value = false
  }
})
</script>

<style scoped>
.modal-content {
  max-width: 500px;
  margin: 0 auto;
  padding: 24px 0;
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.link-icon {
  width: 64px;
  height: 64px;
  color: #6366f1;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border-radius: 50%;
  padding: 16px;
}

.modal-title {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
  color: #1e293b;
}

.modal-description {
  font-size: 16px;
  line-height: 1.6;
  text-align: center;
  color: #64748b;
  margin-bottom: 12px;
}

.modal-description strong {
  color: #6366f1;
  font-weight: 600;
}

.form-group {
  margin-top: 32px;
  margin-bottom: 16px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  margin-bottom: 8px;
}

.label-icon {
  width: 18px;
  height: 18px;
  color: #6366f1;
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  font-size: 16px;
  color: #1e293b;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #6366f1;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  margin-top: 16px;
  animation: shake 0.5s ease;
}

.error-icon {
  width: 20px;
  height: 20px;
  color: #ef4444;
  flex-shrink: 0;
}

.error-message span {
  font-size: 14px;
  color: #dc2626;
}

.text-link {
  background: none;
  border: none;
  color: #6366f1;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 0;
  transition: all 0.3s ease;
  display: block;
  margin: 8px auto 24px;
  text-align: center;
}

.text-link:hover:not(:disabled) {
  color: #4f46e5;
  text-decoration: underline;
}

.text-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.primary-button,
.secondary-button {
  flex: 1;
  height: 48px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
}

.primary-button {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
}

.primary-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.primary-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.secondary-button {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.secondary-button:hover:not(:disabled) {
  background: rgba(99, 102, 241, 0.15);
}

.secondary-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-spinner {
  width: 20px;
  height: 20px;
  --color: white;
}

.info-box {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  margin-top: 24px;
}

.info-icon {
  width: 20px;
  height: 20px;
  color: #3b82f6;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-text {
  font-size: 14px;
  line-height: 1.5;
  color: #1e40af;
  margin: 0;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .modal-title {
    color: #f1f5f9;
  }
  
  .modal-description {
    color: #94a3b8;
  }
  
  .form-label {
    color: #cbd5e1;
  }
  
  .form-input {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(99, 102, 241, 0.3);
    color: #f1f5f9;
  }
  
  .form-input:focus {
    background: rgba(255, 255, 255, 0.08);
  }
}
</style>
