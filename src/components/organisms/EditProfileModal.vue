<template>
  <ion-modal
    :is-open="isOpen"
    @will-dismiss="$emit('close')"
    :backdrop-dismiss="false"
    class="edit-profile-modal"
  >
    <ion-header>
      <ion-toolbar>
        <ion-title>Editar Perfil</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$emit('close')">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="modal-content">
      <form @submit.prevent="handleSubmit" class="edit-profile-form">
        <!-- Name Field -->
        <div class="form-group">
          <ion-label position="stacked">Nome</ion-label>
          <ion-input
            v-model="formData.name"
            placeholder="Digite seu nome"
            :counter="true"
            :maxlength="50"
            :class="{ 'ion-invalid': errors.name }"
          />
          <ion-note v-if="errors.name" color="danger">{{ errors.name }}</ion-note>
        </div>

        <!-- Email Field (Read-only) -->
        <div class="form-group">
          <ion-label position="stacked">E-mail</ion-label>
          <ion-input
            v-model="formData.email"
            readonly
            class="readonly-input"
          />
          <ion-note color="medium">
            Para alterar o e-mail, use as configurações de conta
          </ion-note>
        </div>

        <!-- Phone Field -->
        <div class="form-group">
          <ion-label position="stacked">Telefone (opcional)</ion-label>
          <ion-input
            v-model="formData.phone"
            placeholder="(11) 99999-9999"
            type="tel"
            :class="{ 'ion-invalid': errors.phone }"
          />
          <ion-note v-if="errors.phone" color="danger">{{ errors.phone }}</ion-note>
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
            <span v-if="!isSubmitting">Salvar</span>
            <span v-else>Salvando...</span>
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
import type { ProfileEditForm } from '@/types/profile'

interface Props {
  isOpen: boolean
  initialData: ProfileEditForm
  isSubmitting: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  submit: [data: ProfileEditForm]
}>()

// Form data
const formData = ref<ProfileEditForm>({ ...props.initialData })

// Form errors
const errors = ref<Record<string, string>>({})

// Watch for prop changes to update form data
watch(() => props.initialData, (newData) => {
  formData.value = { ...newData }
}, { deep: true })

// Form validation
const isFormValid = computed(() => {
  return formData.value.name.trim().length >= 2 &&
         formData.value.name.trim().length <= 50 &&
         (!formData.value.phone || isValidPhone(formData.value.phone))
})

// Phone validation
const isValidPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '')
  return cleanPhone.length === 10 || cleanPhone.length === 11
}

// Validate form
const validateForm = (): boolean => {
  errors.value = {}

  // Name validation
  if (!formData.value.name.trim()) {
    errors.value.name = 'Nome é obrigatório'
  } else if (formData.value.name.trim().length < 2) {
    errors.value.name = 'Nome deve ter pelo menos 2 caracteres'
  } else if (formData.value.name.trim().length > 50) {
    errors.value.name = 'Nome deve ter no máximo 50 caracteres'
  }

  // Phone validation (optional)
  if (formData.value.phone && !isValidPhone(formData.value.phone)) {
    errors.value.phone = 'Telefone deve ter 10 ou 11 dígitos'
  }

  return Object.keys(errors.value).length === 0
}

// Handle form submission
const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', { ...formData.value })
  }
}
</script>

<style scoped lang="scss">
/* ====================================
   EDIT PROFILE MODAL - RSCSS
   ==================================== */

.edit-profile-modal {
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
   EDIT PROFILE FORM
   ==================================== */

.edit-profile-form {
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

.readonly-input {
  opacity: 0.6;
  pointer-events: none;
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
}
</style>