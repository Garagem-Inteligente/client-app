<template>
  <ion-modal
    :is-open="isOpen"
    @will-dismiss="$emit('close')"
    :backdrop-dismiss="false"
    class="change-password-modal"
  >
    <ion-header>
      <ion-toolbar>
        <ion-title>Alterar Senha</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$emit('close')">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="modal-content">
      <form @submit.prevent="handleSubmit" class="change-password-form">
        <!-- Current Password -->
        <div class="form-group">
          <ion-label position="stacked">Senha Atual</ion-label>
          <ion-input
            v-model="formData.currentPassword"
            type="password"
            placeholder="Digite sua senha atual"
            :class="{ 'ion-invalid': errors.currentPassword }"
          />
          <ion-note v-if="errors.currentPassword" color="danger">
            {{ errors.currentPassword }}
          </ion-note>
        </div>

        <!-- New Password -->
        <div class="form-group">
          <ion-label position="stacked">Nova Senha</ion-label>
          <ion-input
            v-model="formData.newPassword"
            type="password"
            placeholder="Digite a nova senha"
            :class="{ 'ion-invalid': errors.newPassword }"
            @input="updatePasswordStrength"
          />
          <ion-note v-if="errors.newPassword" color="danger">
            {{ errors.newPassword }}
          </ion-note>

          <!-- Password Strength Indicator -->
          <div v-if="formData.newPassword" class="password-strength">
            <div class="strength-bar">
              <div
                class="strength-fill"
                :class="passwordStrength.class"
                :style="{ width: `${passwordStrength.score}%` }"
              ></div>
            </div>
            <span class="strength-text">{{ passwordStrength.label }}</span>
          </div>
        </div>

        <!-- Confirm New Password -->
        <div class="form-group">
          <ion-label position="stacked">Confirmar Nova Senha</ion-label>
          <ion-input
            v-model="formData.confirmPassword"
            type="password"
            placeholder="Confirme a nova senha"
            :class="{ 'ion-invalid': errors.confirmPassword }"
          />
          <ion-note v-if="errors.confirmPassword" color="danger">
            {{ errors.confirmPassword }}
          </ion-note>
        </div>

        <!-- Password Requirements -->
        <div class="password-requirements">
          <h4>Requisitos da senha:</h4>
          <ul>
            <li :class="{ 'met': passwordRequirements.minLength }">
              Pelo menos 8 caracteres
            </li>
            <li :class="{ 'met': passwordRequirements.hasUppercase }">
              Uma letra maiúscula
            </li>
            <li :class="{ 'met': passwordRequirements.hasLowercase }">
              Uma letra minúscula
            </li>
            <li :class="{ 'met': passwordRequirements.hasNumber }">
              Um número
            </li>
            <li :class="{ 'met': passwordRequirements.hasSpecialChar }">
              Um caractere especial (!@#$%^&*)
            </li>
          </ul>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <ion-button
            fill="outline"
            @click="$emit('close')"
            :disabled="isSubmitting"
          >
            Cancelar
          </ion-button>

          <ion-button
            type="submit"
            :disabled="isSubmitting || !isFormValid"
            :loading="isSubmitting"
          >
            <span v-if="!isSubmitting">Alterar Senha</span>
            <span v-else>Alterando...</span>
          </ion-button>
        </div>
      </form>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonLabel,
  IonInput,
  IonNote,
} from '@ionic/vue'
import { closeOutline } from 'ionicons/icons'
import { ref, computed, watch } from 'vue'
import { calculatePasswordStrength, validatePasswordForm } from '@/utils/password'
import type { PasswordChangeForm } from '@/types/profile'

interface Props {
  isOpen: boolean
  isSubmitting: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  submit: [data: PasswordChangeForm]
}>()

// Form data
const formData = ref<PasswordChangeForm>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// Form errors
const errors = ref<Record<string, string>>({})

// Password strength
const passwordStrength = computed(() =>
  calculatePasswordStrength(formData.value.newPassword)
)

// Password requirements
const passwordRequirements = computed(() => {
  const password = formData.value.newPassword
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?/]/.test(password),
  }
})

// Form validation
const isFormValid = computed(() => {
  return formData.value.currentPassword.trim() &&
         formData.value.newPassword &&
         formData.value.confirmPassword &&
         formData.value.newPassword === formData.value.confirmPassword &&
         passwordStrength.value.score >= 40 && // Not weak
         Object.keys(errors.value).length === 0
})

// Update password strength on input
const updatePasswordStrength = () => {
  // Clear new password error when typing
  if (errors.value.newPassword) {
    delete errors.value.newPassword
  }
}

// Validate form
const validateForm = (): boolean => {
  errors.value = {}

  // Current password validation
  if (!formData.value.currentPassword.trim()) {
    errors.value.currentPassword = 'Senha atual é obrigatória'
  }

  // New password validation
  const passwordValidation = validatePasswordForm(
    formData.value.currentPassword,
    formData.value.newPassword,
    formData.value.confirmPassword
  )
  if (!passwordValidation.isValid) {
    errors.value.newPassword = passwordValidation.errors.join(', ')
  }

  return Object.keys(errors.value).length === 0
}

// Handle form submission
const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', { ...formData.value })
  }
}

// Reset form when modal closes
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    formData.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
    errors.value = {}
  }
})
</script>

<style scoped lang="scss">
/* ====================================
   CHANGE PASSWORD MODAL - RSCSS
   ==================================== */

.change-password-modal {
  --border-radius: 16px;
}

/* ====================================
   MODAL CONTENT
   ==================================== */

.modal-content {
  --padding-start: 20px;
  --padding-end: 20px;
  --padding-top: 0;
  --padding-bottom: 20px;
}

/* ====================================
   CHANGE PASSWORD FORM
   ==================================== */

.change-password-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 100%;
}

/* ====================================
   FORM GROUP
   ==================================== */

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ====================================
   PASSWORD STRENGTH
   ==================================== */

.password-strength {
  margin-top: 8px;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background: var(--bg-input);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.strength-weak {
  background: var(--danger-500);
}

.strength-medium {
  background: var(--warning-500);
}

.strength-strong {
  background: var(--success-500);
}

.strength-text {
  font-size: 12px;
  color: var(--text-secondary);
}

/* ====================================
   PASSWORD REQUIREMENTS
   ==================================== */

.password-requirements {
  background: var(--bg-input);
  border: 1px solid var(--border-input);
  border-radius: 8px;
  padding: 16px;

  h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--ion-text-color);
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  li {
    font-size: 13px;
    color: var(--danger-600);
    display: flex;
    align-items: center;

    &::before {
      content: '✗';
      margin-right: 8px;
      color: var(--danger-500);
    }

    &.met {
      color: var(--success-600);

      &::before {
        content: '✓';
        color: var(--success-500);
      }
    }
  }
}

/* ====================================
   FORM ACTIONS
   ==================================== */

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;

  ion-button {
    flex: 1;
  }
}

/* ====================================
   RESPONSIVE DESIGN
   ==================================== */

@media (max-width: 480px) {
  .modal-content {
    --padding-start: 16px;
    --padding-end: 16px;
  }

  .form-actions {
    flex-direction: column;

    ion-button {
      width: 100%;
    }
  }

  .password-requirements {
    padding: 12px;

    ul {
      gap: 6px;
    }

    li {
      font-size: 12px;
    }
  }
}
</style>