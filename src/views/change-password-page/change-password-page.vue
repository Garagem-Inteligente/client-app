<template>
  <ion-page>
    <ModernHeader title="Alterar Senha" show-back-button />

    <ion-content :fullscreen="true" class="app-content">
      <div class="background-gradient"></div>
      <div class="background-pattern"></div>

      <div class="container page-content-wrapper">
        <!-- Info Section -->
        <div class="info-card">
          <ion-icon :icon="informationCircleOutline" class="info-icon"></ion-icon>
          <p class="info-text">Por segurança, você precisará confirmar sua senha atual antes de alterar.</p>
        </div>

        <!-- Form Card -->
        <div class="form-card">
          <div class="form-section">
            <h2 class="section-title">Autenticação</h2>

            <!-- Senha Atual -->
            <div class="form-group">
              <label for="currentPassword" class="form-label">
                <ion-icon :icon="lockClosedOutline" class="label-icon"></ion-icon>
                Senha Atual
              </label>

              <ion-input
                id="currentPassword"
                v-model="form.currentPassword"
                type="password"
                placeholder="Digite sua senha atual"
                class="form-input"
                @ion-blur="validateCurrentPassword"
              ></ion-input>

              <div v-if="errors.currentPassword" class="error-feedback">
                <ion-icon :icon="alertCircleOutline"></ion-icon>
                <span>{{ errors.currentPassword }}</span>
              </div>
            </div>
          </div>

          <div class="form-divider"></div>

          <div class="form-section">
            <h2 class="section-title">Nova Senha</h2>

            <!-- Nova Senha -->
            <div class="form-group">
              <label for="newPassword" class="form-label">
                <ion-icon :icon="lockClosedOutline" class="label-icon"></ion-icon>
                Nova Senha
              </label>

              <ion-input
                id="newPassword"
                v-model="form.newPassword"
                type="password"
                placeholder="Digite sua nova senha"
                class="form-input"
                :maxlength="120"
                @ion-blur="validateNewPassword"
              ></ion-input>

              <div v-if="errors.newPassword" class="error-feedback">
                <ion-icon :icon="alertCircleOutline"></ion-icon>
                <span>{{ errors.newPassword }}</span>
              </div>

              <p class="form-help-text">Mínimo 6 caracteres, máximo 120</p>

              <!-- Password Strength Indicator -->
              <div v-if="form.newPassword" class="password-strength">
                <div class="strength-bar">
                  <div
                    class="strength-fill"
                    :class="passwordStrengthClass"
                    :style="{ width: passwordStrength + '%' }"
                  ></div>
                </div>
                <p class="strength-label" :class="passwordStrengthClass">
                  {{ passwordStrengthLabel }}
                </p>
              </div>
            </div>

            <!-- Confirmar Nova Senha -->
            <div class="form-group">
              <label for="confirmPassword" class="form-label">
                <ion-icon :icon="lockClosedOutline" class="label-icon"></ion-icon>
                Confirmar Senha
              </label>

              <ion-input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                placeholder="Confirme sua nova senha"
                class="form-input"
                :maxlength="120"
                @ion-blur="validateConfirmPassword"
              ></ion-input>

              <div v-if="errors.confirmPassword" class="error-feedback">
                <ion-icon :icon="alertCircleOutline"></ion-icon>
                <span>{{ errors.confirmPassword }}</span>
              </div>
            </div>
          </div>

          <div class="form-divider"></div>

          <div class="form-section">
            <h2 class="section-title">🛡️ Dicas de Segurança</h2>
            <ul class="security-tips">
              <li>Use pelo menos 8 caracteres</li>
              <li>Inclua letras maiúsculas e minúsculas</li>
              <li>Adicione números e caracteres especiais</li>
              <li>Evite usar informações pessoais</li>
              <li>Use uma senha única para cada serviço</li>
            </ul>
          </div>
        </div>

        <!-- Error Alert -->
        <div v-if="generalError" class="error-card">
          <ion-icon :icon="warningOutline"></ion-icon>
          <p>{{ generalError }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="button-group">
          <button class="btn btn-secondary" @click="handleCancel" :disabled="loading">
            <ion-icon :icon="closeOutline"></ion-icon>
            <span>Cancelar</span>
          </button>

          <button
            class="btn btn-primary"
            @click="handleSubmit"
            :disabled="!isFormValid || loading"
          >
            <ion-spinner v-if="loading" name="crescent"></ion-spinner>
            <span v-else>
              <ion-icon :icon="checkmarkOutline"></ion-icon>
              Alterar Senha
            </span>
          </button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage,
  IonContent,
  IonInput,
  IonIcon,
  IonSpinner,
  toastController,
} from '@ionic/vue'
import {
  lockClosedOutline,
  alertCircleOutline,
  closeOutline,
  checkmarkOutline,
  warningOutline,
  informationCircleOutline,
} from 'ionicons/icons'
import { useAuthStore } from '@/stores/auth'
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { getErrorMessage } from '@/utils/errorMessages'
import ModernHeader from '@/components/organisms/ModernHeader.vue'

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface PasswordErrors {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const router = useRouter()
const authStore = useAuthStore()

const form = reactive<PasswordForm>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const errors = reactive<PasswordErrors>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const loading = ref(false)
const generalError = ref('')

// Password strength calculation
const passwordStrength = computed(() => {
  const password = form.newPassword
  let strength = 0

  if (password.length >= 8) strength += 20
  if (password.length >= 12) strength += 20
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20
  if (/[0-9]/.test(password)) strength += 20
  if (/[^a-zA-Z0-9]/.test(password)) strength += 20

  return Math.min(strength, 100)
})

const passwordStrengthClass = computed(() => {
  if (passwordStrength.value < 40) return 'weak'
  if (passwordStrength.value < 70) return 'medium'
  return 'strong'
})

const passwordStrengthLabel = computed(() => {
  const strength = passwordStrengthClass.value
  if (strength === 'weak') return 'Fraca'
  if (strength === 'medium') return 'Média'
  return 'Forte'
})

// Form validation
const validateCurrentPassword = () => {
  errors.currentPassword = ''
  if (!form.currentPassword.trim()) {
    errors.currentPassword = 'A senha atual é obrigatória'
  } else if (form.currentPassword.length < 6) {
    errors.currentPassword = 'Senha deve ter no mínimo 6 caracteres'
  }
}

const validateNewPassword = () => {
  errors.newPassword = ''
  if (!form.newPassword.trim()) {
    errors.newPassword = 'A nova senha é obrigatória'
  } else if (form.newPassword.length < 6) {
    errors.newPassword = 'A nova senha deve ter no mínimo 6 caracteres'
  } else if (form.newPassword.length > 120) {
    errors.newPassword = 'A nova senha não pode ter mais de 120 caracteres'
  } else if (form.newPassword === form.currentPassword) {
    errors.newPassword = 'A nova senha deve ser diferente da atual'
  }
}

const validateConfirmPassword = () => {
  errors.confirmPassword = ''
  if (!form.confirmPassword.trim()) {
    errors.confirmPassword = 'A confirmação é obrigatória'
  } else if (form.confirmPassword !== form.newPassword) {
    errors.confirmPassword = 'As senhas não conferem'
  }
}

const isFormValid = computed(() => {
  return (
    form.currentPassword.trim() &&
    form.newPassword.trim() &&
    form.confirmPassword.trim() &&
    form.newPassword.length >= 6 &&
    form.newPassword.length <= 120 &&
    form.newPassword !== form.currentPassword &&
    form.newPassword === form.confirmPassword &&
    !errors.currentPassword &&
    !errors.newPassword &&
    !errors.confirmPassword
  )
})

const handleCancel = () => {
  if (form.currentPassword || form.newPassword || form.confirmPassword) {
    // Limpar formulário e voltar
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
    errors.currentPassword = ''
    errors.newPassword = ''
    errors.confirmPassword = ''
    generalError.value = ''
  }
  router.push('/tabs/profile')
}

const handleSubmit = async () => {
  // Validar tudo novamente antes de enviar
  validateCurrentPassword()
  validateNewPassword()
  validateConfirmPassword()

  if (!isFormValid.value) {
    generalError.value = 'Por favor, corrija os erros acima'
    return
  }

  loading.value = true
  generalError.value = ''

  try {
    const currentUser = auth.currentUser
    if (!currentUser || !currentUser.email) {
      throw new Error('Usuário não autenticado')
    }

    // Re-authenticate user before changing password
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      form.currentPassword,
    )
    await reauthenticateWithCredential(currentUser, credential)

    // Update password
    await updatePassword(currentUser, form.newPassword)

    // Show success message
    const toast = await toastController.create({
      message: 'Senha alterada com sucesso!',
      duration: 3000,
      position: 'bottom',
      color: 'success',
    })
    await toast.present()

    // Limpar e voltar
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
    setTimeout(() => {
      router.push('/tabs/profile')
    }, 500)
  } catch (err) {
    generalError.value = getErrorMessage(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
})
</script>

<style scoped lang="scss">
.page-content-wrapper {
  animation: fadeInDown 0.6s ease-out;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.info-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(66, 133, 244, 0.1);
  border: 1px solid rgba(66, 133, 244, 0.3);
  backdrop-filter: blur(10px);
  animation: slideIn 0.8s ease-out;

  .info-icon {
    font-size: 1.5rem;
    color: var(--ion-color-primary);
    flex-shrink: 0;
  }

  .info-text {
    margin: 0;
    color: var(--ion-color-medium);
    font-size: 0.95rem;
    line-height: 1.4;
  }
}

.form-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  animation: fadeInUp 0.8s ease-out;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}

.form-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  margin: 1.5rem 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .form-label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .label-icon {
      font-size: 1.1rem;
      color: var(--ion-color-primary);
    }
  }

  ion-input::part(native) {
    font-size: 1rem;
  }
}

.form-input {
  --padding-start: 1rem;
  --padding-end: 1rem;
  --padding-top: 0.75rem;
  --padding-bottom: 0.75rem;
  --background: rgba(255, 255, 255, 0.08);
  --border-radius: 10px;
  --border-bottom: 2px solid rgba(66, 133, 244, 0.3);
  --border-color: transparent;
  border-radius: 10px;

  &:focus {
    --background: rgba(255, 255, 255, 0.12);
    --border-bottom: 2px solid var(--ion-color-primary);
  }
}

.error-feedback {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(255, 59, 48, 0.1);
  border-radius: 8px;
  color: #ff3b30;
  font-size: 0.85rem;
  margin-top: 0.25rem;

  ion-icon {
    flex-shrink: 0;
    margin-top: 0.1rem;
  }

  span {
    line-height: 1.4;
  }
}

.form-help-text {
  font-size: 0.8rem;
  color: var(--ion-color-medium);
  margin: 0;
  font-style: italic;
}

.password-strength {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;

  .strength-bar {
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    overflow: hidden;

    .strength-fill {
      height: 100%;
      transition: all 0.3s ease;
      border-radius: 2px;

      &.weak {
        background: #ff3b30;
      }

      &.medium {
        background: #ffcc00;
      }

      &.strong {
        background: #34c759;
      }
    }
  }

  .strength-label {
    font-size: 0.8rem;
    margin: 0;
    font-weight: 600;

    &.weak {
      color: #ff3b30;
    }

    &.medium {
      color: #ffcc00;
    }

    &.strong {
      color: #34c759;
    }
  }
}

.security-tips {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  li {
    padding-left: 1.5rem;
    position: relative;
    color: var(--ion-color-medium);
    font-size: 0.9rem;
    line-height: 1.4;

    &:before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--ion-color-success);
      font-weight: bold;
    }
  }
}

.error-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  animation: slideIn 0.4s ease-out;

  ion-icon {
    font-size: 1.5rem;
    color: #ff3b30;
    flex-shrink: 0;
  }

  p {
    margin: 0;
    color: #ff3b30;
    font-size: 0.95rem;
  }
}

.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }

  .btn {
    flex: 1;
    min-width: 120px;
    padding: 0.875rem 1.5rem;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &-primary {
      background: var(--ion-color-primary);
      color: white;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(66, 133, 244, 0.3);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }
    }

    &-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: var(--ion-color-dark);
      border: 1px solid rgba(255, 255, 255, 0.2);

      &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-2px);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }
    }
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
