<template>
  <ion-modal :is-open="isOpen" @didDismiss="$emit('update:isOpen', false)">
    <ion-header>
      <ion-toolbar class="modal-toolbar">
        <ion-title class="modal-title">Editar Perfil</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="handleCancel" class="close-button">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="modal-content">
      <div class="edit-form-container">
        <!-- Nome Completo -->
        <div class="form-group">
          <div class="form-label-wrapper">
            <label for="editName" class="form-label">
              <ion-icon :icon="personOutline" class="label-icon"></ion-icon>
              Nome Completo
            </label>
            <span class="char-count">{{ form.name.length }}/100</span>
          </div>

          <ion-input
            id="editName"
            v-model="form.name"
            type="text"
            placeholder="Seu nome completo"
            class="form-input"
            :maxlength="100"
            @ion-blur="validateName"
          ></ion-input>

          <div v-if="errors.name" class="error-message">
            <ion-icon :icon="alertCircleOutline"></ion-icon>
            <span>{{ errors.name }}</span>
          </div>

          <p class="form-hint">Mínimo 3 caracteres, máximo 100</p>
        </div>

        <!-- Email (Desabilitado) -->
        <div class="form-group">
          <label for="editEmail" class="form-label">
            <ion-icon :icon="mailOutline" class="label-icon"></ion-icon>
            Email (não pode ser alterado)
          </label>

          <ion-input
            id="editEmail"
            v-model="form.email"
            type="email"
            placeholder="seu@email.com"
            class="form-input form-input-disabled"
            disabled
          ></ion-input>

          <p class="form-hint info-hint">
            <ion-icon :icon="informationCircleOutline"></ion-icon>
            Para alterar o email, entre em contato com o suporte
          </p>
        </div>

        <!-- Ações -->
        <div class="form-actions">
          <button class="btn btn-secondary" @click="handleCancel" :disabled="loading" aria-label="Cancelar edição">
            <ion-icon :icon="closeOutline"></ion-icon>
            <span>Cancelar</span>
          </button>

          <button
            class="btn btn-primary"
            @click="handleSave"
            :disabled="loading || !isFormValid"
            :class="{ 'btn-loading': loading }"
            aria-label="Salvar alterações do perfil"
          >
            <ion-spinner v-if="loading" name="crescent" class="spinner-icon"></ion-spinner>
            <ion-icon v-else :icon="checkmarkOutline" class="button-icon"></ion-icon>
            <span>{{ loading ? 'Salvando...' : 'Salvar Alterações' }}</span>
          </button>
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
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
  IonInput,
} from '@ionic/vue'
import {
  closeOutline,
  personOutline,
  mailOutline,
  informationCircleOutline,
  alertCircleOutline,
  checkmarkOutline,
} from 'ionicons/icons'

interface EditForm {
  name: string
  email: string
}

interface FormErrors {
  name?: string
}

interface Props {
  isOpen: boolean
  initialName: string
  initialEmail: string
  loading?: boolean
}

interface Emits {
  'update:isOpen': [value: boolean]
  save: [form: EditForm]
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<Emits>()

const form = reactive<EditForm>({
  name: props.initialName,
  email: props.initialEmail,
})

const errors = reactive<FormErrors>({})

const validateName = () => {
  errors.name = undefined

  if (!form.name.trim()) {
    errors.name = 'O nome não pode estar vazio'
  } else if (form.name.trim().length < 3) {
    errors.name = 'O nome deve ter no mínimo 3 caracteres'
  } else if (form.name.length > 100) {
    errors.name = 'O nome não pode ter mais de 100 caracteres'
  }
}

const isFormValid = computed(() => {
  return (
    form.name.trim().length >= 3 &&
    form.name.length <= 100 &&
    form.name !== props.initialName &&
    !errors.name
  )
})

const handleCancel = () => {
  form.name = props.initialName
  form.email = props.initialEmail
  errors.name = undefined
  emit('update:isOpen', false)
}

const handleSave = () => {
  validateName()

  if (isFormValid.value) {
    emit('save', { ...form })
  }
}

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      form.name = props.initialName
      form.email = props.initialEmail
      errors.name = undefined
    }
  }
)
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

ion-modal {
  --width: 90%;
  --max-width: 600px;
  --height: auto;
  --border-radius: 20px;

  @media (min-width: 768px) {
    --width: 500px;
    --max-width: 500px;
  }
}

.modal-toolbar {
  background: rgba(31, 41, 55, 0.95);
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #f3f4f6;
  letter-spacing: 0.3px;
}

.close-button {
  --color: white;

  &:hover {
    --color: #9ca3af;
  }
}

.modal-content {
  --padding-start: 12px;
  --padding-end: 12px;
  --padding-top: 40px;
  --padding-bottom: 40px;
  --background: linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%);

  @media (min-width: 768px) {
    --padding-start: 32px;
    --padding-end: 32px;
    --padding-top: 48px;
    --padding-bottom: 48px;
  }
}

.edit-form-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 100%;
  background: rgba(31, 41, 55, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 16px;
  padding: 28px;
  margin-top: 16px;

  @media (min-width: 768px) {
    max-width: 500px;
    margin: 0 auto;
    gap: 28px;
    padding: 32px;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-label-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: #f3f4f6;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  > .label-icon {
    font-size: 18px;
    color: #3b82f6;
    flex-shrink: 0;
  }
}

.char-count {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
  flex-shrink: 0;
}

.form-input {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  --background: rgba(255, 255, 255, 0.05);
  --border-radius: 12px;
  --border: 1px solid rgba(255, 255, 255, 0.08);
  --color: white;
  --placeholder-color: #9ca3af;

  &:focus {
    --background: rgba(59, 130, 246, 0.1);
    --border: 1px solid rgba(59, 130, 246, 0.3);
  }

  &.form-input-disabled {
    --background: rgba(255, 255, 255, 0.02);
    --border: 1px solid rgba(255, 255, 255, 0.05);
    opacity: 0.6;
  }
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  font-size: 13px;
  color: #fca5a5;
  animation: slideIn 0.2s ease-out;

  > ion-icon {
    font-size: 16px;
    flex-shrink: 0;
  }
}

.form-hint {
  font-size: 11px;
  color: #9ca3af;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  padding-left: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 500;

  &.info-hint {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: rgba(99, 102, 241, 0.1);
    border-radius: 8px;
    color: #c4b5fd;
    margin-top: 4px;
    text-transform: none;
    letter-spacing: normal;
    font-weight: normal;

    > ion-icon {
      font-size: 16px;
      flex-shrink: 0;
    }
  }
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 480px) {
    flex-direction: column-reverse;
  }
}

.btn {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all $transition-base;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;

  > ion-icon,
  > ion-spinner {
    font-size: 20px;
    flex-shrink: 0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 100%;
    font-size: 15px;
    padding: 12px 16px;
  }
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

  &:not(:disabled):hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  }

  &:not(:disabled):active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  }

  &.btn-loading {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  }
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:not(:disabled):hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.15);
  }

  &:not(:disabled):active {
    background: rgba(255, 255, 255, 0.1);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dialog styling for desktop */
ion-modal::part(content) {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: none;
}

ion-modal::part(backdrop) {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}
</style>
