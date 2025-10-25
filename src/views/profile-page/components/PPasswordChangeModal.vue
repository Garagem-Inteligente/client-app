<template>
  <ion-modal :is-open="isOpen" @didDismiss="$emit('update:isOpen', false)">
    <ion-header>
      <ion-toolbar>
        <ion-title>Alterar Senha</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$emit('update:isOpen', false)">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="modal-content">
      <div class="password-change-content">
        <!-- Info Alert -->
        <div class="alert alert-info">
          <ion-icon :icon="informationCircleOutline"></ion-icon>
          <p>Por segurança, você precisará reautenticar antes de alterar sua senha.</p>
        </div>

        <form @submit.prevent="$emit('submit', form)" class="edit-form">
          <div class="form-group">
            <label for="currentPassword">Senha Atual *</label>
            <input
              id="currentPassword"
              v-model="form.currentPassword"
              type="password"
              placeholder="Digite sua senha atual"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label for="newPassword">Nova Senha *</label>
            <input
              id="newPassword"
              v-model="form.newPassword"
              type="password"
              placeholder="Digite sua nova senha"
              class="form-input"
              required
            />
            <p class="form-helper">A senha deve ter no mínimo 6 caracteres</p>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmar Nova Senha *</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              placeholder="Confirme sua nova senha"
              class="form-input"
              required
            />
          </div>

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

          <!-- Error Message -->
          <div v-if="error" class="alert alert-warning">
            <ion-icon :icon="warningOutline"></ion-icon>
            <p>{{ error }}</p>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="$emit('update:isOpen', false)">
              Cancelar
            </button>
            <button type="submit" class="btn-primary" :disabled="loading || !isFormValid">
              <ion-spinner v-if="loading" name="crescent"></ion-spinner>
              <span v-else>Alterar Senha</span>
            </button>
          </div>
        </form>

        <!-- Security Tips -->
        <div class="security-tips-box">
          <h3>🛡️ Dicas para uma senha segura:</h3>
          <ul>
            <li>Use pelo menos 8 caracteres</li>
            <li>Inclua letras maiúsculas e minúsculas</li>
            <li>Adicione números e caracteres especiais</li>
            <li>Evite usar informações pessoais</li>
            <li>Use uma senha única para cada serviço</li>
          </ul>
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonSpinner,
} from '@ionic/vue'
import { closeOutline, informationCircleOutline, warningOutline } from 'ionicons/icons'

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface Props {
  isOpen: boolean
  loading?: boolean
  error?: string
}

withDefaults(defineProps<Props>(), {
  loading: false,
  error: '',
})

defineEmits<{
  'update:isOpen': [value: boolean]
  submit: [form: PasswordForm]
}>()

const form = reactive<PasswordForm>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// Password strength calculator
const passwordStrength = computed(() => {
  const password = form.newPassword
  if (!password) return 0

  let strength = 0
  if (password.length >= 6) strength += 20
  if (password.length >= 8) strength += 20
  if (password.length >= 12) strength += 10
  if (/[a-z]/.test(password)) strength += 10
  if (/[A-Z]/.test(password)) strength += 15
  if (/\d/.test(password)) strength += 15
  if (/[^a-zA-Z\d]/.test(password)) strength += 10

  return Math.min(strength, 100)
})

const passwordStrengthLabel = computed(() => {
  const strength = passwordStrength.value
  if (strength < 40) return 'Fraca'
  if (strength < 70) return 'Média'
  if (strength < 90) return 'Forte'
  return 'Muito Forte'
})

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value
  if (strength < 40) return 'strength-weak'
  if (strength < 70) return 'strength-medium'
  if (strength < 90) return 'strength-strong'
  return 'strength-very-strong'
})

const isFormValid = computed(() => {
  return (
    form.currentPassword.length >= 6 &&
    form.newPassword.length >= 6 &&
    form.confirmPassword === form.newPassword
  )
})
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.modal-content {
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 20px;
}

.password-change-content {
  padding: 24px;

  @media (max-width: 480px) {
    padding: 16px;
  }
}

.alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 24px;

  ion-icon {
    font-size: 20px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  p {
    margin: 0;
    flex: 1;
  }

  &-info {
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.2);
    color: #6366f1;

    ion-icon {
      color: #6366f1;
    }
  }

  &-warning {
    background: rgba(251, 191, 36, 0.1);
    border: 1px solid rgba(251, 191, 36, 0.2);
    color: #f59e0b;

    ion-icon {
      color: #f59e0b;
    }
  }
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 16px;
    font-weight: 500;
    color: white;
  }
}

.form-input {
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 16px;
  transition: border-color $transition-base;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }

  &::placeholder {
    color: #9ca3af;
  }
}

.form-helper {
  font-size: 12px;
  color: #9ca3af;
  margin: 4px 0 0 0;
}

.password-strength {
  margin: 16px 0 24px;
}

.strength-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.strength-fill {
  height: 100%;
  transition: all $transition-base;
  border-radius: 4px;

  &.strength-weak {
    background: #ef4444;
  }

  &.strength-medium {
    background: #f59e0b;
  }

  &.strength-strong {
    background: #3b82f6;
  }

  &.strength-very-strong {
    background: #10b981;
  }
}

.strength-label {
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  margin: 0;

  &.strength-weak {
    color: #ef4444;
  }

  &.strength-medium {
    color: #f59e0b;
  }

  &.strength-strong {
    color: #3b82f6;
  }

  &.strength-very-strong {
    color: #10b981;
  }
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;

  @media (max-width: 480px) {
    flex-direction: column;

    button {
      width: 100%;
    }
  }

  button {
    flex: 1;
    padding: 12px 16px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all $transition-base;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
}

.btn-primary {
  background: #3b82f6;
  color: white;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.15);
  }
}

.security-tips-box {
  background: rgba(31, 41, 55, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-top: 24px;

  h3 {
    margin: 0 0 12px 0;
    font-size: 15px;
    font-weight: 600;
    color: #3b82f6;
  }

  ul {
    margin: 0;
    padding-left: 20px;
    color: #9ca3af;
    font-size: 13px;
    line-height: 1.8;

    li {
      margin-bottom: 6px;
    }
  }
}
</style>
