<template>
  <ion-modal :is-open="isOpen" @didDismiss="$emit('update:isOpen', false)">
    <ion-header>
      <ion-toolbar>
        <ion-title>Editar Perfil</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$emit('update:isOpen', false)">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="modal-content">
      <div class="edit-form">
        <div class="form-group">
          <label for="editName">Nome completo</label>
          <input
            id="editName"
            v-model="form.name"
            type="text"
            placeholder="Seu nome"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="editEmail">Email</label>
          <input
            id="editEmail"
            v-model="form.email"
            type="email"
            placeholder="seu@email.com"
            class="form-input"
            disabled
          />
          <p class="form-helper">O email não pode ser alterado</p>
        </div>

        <div class="form-actions">
          <button class="btn-secondary" @click="$emit('update:isOpen', false)">Cancelar</button>
          <button class="btn-primary" @click="$emit('save', form)" :disabled="loading">
            <ion-spinner v-if="loading" name="crescent"></ion-spinner>
            <span v-else>Salvar alterações</span>
          </button>
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
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
import { closeOutline } from 'ionicons/icons'

interface EditForm {
  name: string
  email: string
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

defineEmits<Emits>()

const form = reactive<EditForm>({
  name: props.initialName,
  email: props.initialEmail,
})
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.modal-content {
  --padding-start: 20px;
  --padding-end: 20px;
  --padding-top: 0;
  --padding-bottom: 20px;
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
</style>
