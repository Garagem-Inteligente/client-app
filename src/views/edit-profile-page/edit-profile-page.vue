<template>
  <ion-page>
    <ModernHeader title="Editar Perfil" show-back-button />

    <ion-content :fullscreen="true" class="app-content">
      <div class="background-gradient"></div>
      <div class="background-pattern"></div>

      <div class="container page-content-wrapper">
        <!-- Avatar Section -->
        <div class="avatar-section">
          <div class="avatar-container" @click="showPhotoSheet = true">
            <img
              v-if="currentPhotoUrl && !photoLoadError"
              :src="currentPhotoUrl"
              alt="Foto do perfil"
              class="avatar-image"
              @error="handlePhotoError"
              @load="handlePhotoLoad"
            />
            <div v-else class="avatar-placeholder">
              <ion-icon :icon="personOutline" class="placeholder-icon"></ion-icon>
            </div>
            <div class="avatar-overlay">
              <ion-icon :icon="cameraOutline" class="camera-icon"></ion-icon>
            </div>
          </div>
          <p class="avatar-hint">Clique para alterar sua foto</p>
        </div>

        <!-- Form Card -->
        <div class="form-card">
          <div class="form-section">
            <h2 class="section-title">Informações Pessoais</h2>

            <!-- Nome Completo -->
            <div class="form-group">
              <label for="editName" class="form-label">
                <ion-icon :icon="personOutline" class="label-icon"></ion-icon>
                Nome Completo
              </label>

              <ion-input
                id="editName"
                v-model="form.name"
                type="text"
                placeholder="Seu nome completo"
                class="form-input"
                :maxlength="100"
                @ion-blur="validateName"
              ></ion-input>

              <div v-if="errors.name" class="error-feedback">
                <ion-icon :icon="alertCircleOutline"></ion-icon>
                <span>{{ errors.name }}</span>
              </div>

              <p class="form-help-text">Mínimo 3 caracteres, máximo 100</p>
              <div class="char-count">{{ form.name.length }}/100</div>
            </div>
          </div>

          <div class="form-divider"></div>

          <div class="form-section">
            <h2 class="section-title">Dados da Conta</h2>

            <!-- Email -->
            <div class="form-group">
              <label for="editEmail" class="form-label">
                <ion-icon :icon="mailOutline" class="label-icon"></ion-icon>
                Email
              </label>

              <ion-input
                id="editEmail"
                v-model="form.email"
                type="email"
                placeholder="seu@email.com"
                class="form-input form-input-disabled"
                disabled
              ></ion-input>

              <p class="form-help-text info-text">
                <ion-icon :icon="informationCircleOutline"></ion-icon>
                Para alterar o email, entre em contato com o suporte
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="button-group">
          <button class="btn btn-secondary" @click="handleCancel" :disabled="loading">
            <ion-icon :icon="closeOutline"></ion-icon>
            <span>Cancelar</span>
          </button>

          <button
            class="btn btn-primary"
            @click="handleSave"
            :disabled="loading || !isFormValid"
            :class="{ 'btn-loading': loading }"
          >
            <ion-spinner v-if="loading" name="crescent" class="spinner-icon"></ion-spinner>
            <ion-icon v-else :icon="checkmarkOutline" class="button-icon"></ion-icon>
            <span>{{ loading ? 'Salvando...' : 'Salvar Alterações' }}</span>
          </button>
        </div>
      </div>
    </ion-content>

    <!-- Photo Action Sheet -->
    <ion-action-sheet
      :is-open="showPhotoSheet"
      header="Foto do Perfil"
      :buttons="photoActionButtons"
      @didDismiss="showPhotoSheet = false"
    ></ion-action-sheet>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonContent, IonIcon, IonActionSheet, IonSpinner, IonInput, toastController } from '@ionic/vue'
import {
  personOutline,
  cameraOutline,
  mailOutline,
  informationCircleOutline,
  alertCircleOutline,
  checkmarkOutline,
  closeOutline,
} from 'ionicons/icons'
import { useAuthStore } from '@/stores/auth'
import { useProfilePhoto } from '@/composables/useProfilePhoto'
import ModernHeader from '@/components/organisms/ModernHeader.vue'

interface EditForm {
  name: string
  email: string
}

interface FormErrors {
  name?: string
}

const router = useRouter()
const authStore = useAuthStore()
const { photoState, photoActionButtons, handlePhotoLoad } = useProfilePhoto()

const form = reactive<EditForm>({
  name: authStore.userName,
  email: authStore.userEmail,
})

const errors = reactive<FormErrors>({})
const loading = ref(false)
const showPhotoSheet = ref(false)
const photoLoadError = ref(false)

const currentPhotoUrl = computed(() => photoState.value.currentPhotoUrl)

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
    form.name !== authStore.userName &&
    !errors.name
  )
})

const handleCancel = () => {
  form.name = authStore.userName
  form.email = authStore.userEmail
  errors.name = undefined
  router.back()
}

const handleSave = async () => {
  const { updateProfile } = await import('firebase/auth')
  const { doc, updateDoc } = await import('firebase/firestore')
  const { auth, db } = await import('@/firebase/config')

  validateName()

  if (isFormValid.value) {
    loading.value = true
    try {
      if (!auth.currentUser) return

      await updateProfile(auth.currentUser, { displayName: form.name })
      await updateDoc(doc(db, 'users', auth.currentUser.uid), { name: form.name })

      if (authStore.user) {
        authStore.user.name = form.name
      }

      const toast = await toastController.create({
        message: '✅ Perfil atualizado com sucesso!',
        duration: 2000,
        color: 'success',
        position: 'bottom',
      })
      await toast.present()
      router.back()
    } catch {
      const toast = await toastController.create({
        message: 'Erro ao atualizar perfil. Tente novamente.',
        duration: 2000,
        color: 'danger',
        position: 'bottom',
      })
      await toast.present()
    } finally {
      loading.value = false
    }
  }
}

const handlePhotoError = () => {
  photoLoadError.value = true
}

onMounted(() => {
  form.name = authStore.userName
  form.email = authStore.userEmail
})
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

/* ====================================
 EDIT PROFILE PAGE - GLASSMORPHISM
 ==================================== */

.page-content-wrapper {
  padding: 1rem;
}

/* ====================================
 AVATAR SECTION
 ==================================== */

.avatar-section {
  text-align: center;
  margin-bottom: 2rem;
  animation: fadeInDown 0.6s ease-out;
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 1rem;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);

    > .avatar-overlay {
      opacity: 1;
    }
  }
}

.avatar-image,
.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(59, 130, 246, 0.5);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
}

.placeholder-icon {
  font-size: 3rem;
  color: rgba(59, 130, 246, 0.6);
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.camera-icon {
  font-size: 2rem;
  color: white;
}

.avatar-hint {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

/* ====================================
 FORM CARD - GLASSMORPHISM
 ==================================== */

.form-card {
  background: var(--bg-card);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid var(--border-card);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.6s ease-out 0.2s backwards;
}

.form-section {
  & + .form-section {
    margin-top: 1.5rem;
  }
}

.form-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-card), transparent);
  margin: 1.5rem 0;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &.danger {
    color: rgba(239, 68, 68, 0.7);
  }
}

/* ====================================
 FORM ELEMENTS
 ==================================== */

.form-group {
  margin-bottom: 1.25rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ion-text-color);
  margin-bottom: 0.625rem;

  > .label-icon {
    font-size: 1.125rem;
    color: rgba(59, 130, 246, 0.7);
    flex-shrink: 0;
  }
}

.form-input {
  --padding-start: 1rem;
  --padding-end: 1rem;
  --padding-top: 0.75rem;
  --padding-bottom: 0.75rem;
  --background: rgba(255, 255, 255, 0.04);
  --border-radius: 12px;
  --border: 1px solid var(--border-input);
  --color: var(--ion-text-color);
  --placeholder-color: var(--text-secondary);
  transition: all 0.3s ease;

  &:focus {
    --background: rgba(59, 130, 246, 0.08);
    --border: 1px solid rgba(59, 130, 246, 0.4);
  }

  &.form-input-disabled {
    --background: rgba(255, 255, 255, 0.02);
    --border: 1px solid rgba(255, 255, 255, 0.05);
    opacity: 0.6;
  }
}

.error-feedback {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  font-size: 0.8125rem;
  color: rgba(239, 68, 68, 0.9);
  margin-top: 0.5rem;
  animation: slideIn 0.2s ease-out;

  > ion-icon {
    font-size: 1rem;
    flex-shrink: 0;
  }
}

.form-help-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0.5rem 0 0 0;
  display: flex;
  align-items: center;
  gap: 0.375rem;

  &.info-text {
    padding: 0.625rem;
    background: rgba(99, 102, 241, 0.1);
    border-radius: 8px;
    color: rgba(196, 181, 253, 0.8);
    margin-top: 0.625rem;

    > ion-icon {
      flex-shrink: 0;
    }
  }
}

.char-count {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: right;
  margin-top: 0.375rem;
}

/* ====================================
 BUTTONS
 ==================================== */

.button-group {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  animation: fadeInUp 0.6s ease-out 0.3s backwards;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    gap: 0.5rem;
  }
}

.btn {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 48px;

  > ion-icon,
  > ion-spinner {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 0.875rem;
    font-size: 0.9375rem;
  }

  &-primary {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(99, 102, 241, 0.9) 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

    &:not(:disabled):hover {
      background: linear-gradient(135deg, rgba(59, 130, 246, 1) 0%, rgba(99, 102, 241, 1) 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
    }

    &:not(:disabled):active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
    }

    &.btn-loading {
      background: linear-gradient(135deg, rgba(29, 78, 216, 0.9) 0%, rgba(79, 70, 229, 0.9) 100%);
    }
  }

  &-secondary {
    background: rgba(255, 255, 255, 0.08);
    color: var(--ion-text-color);
    border: 1px solid rgba(255, 255, 255, 0.1);

    &:not(:disabled):hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }

    &:not(:disabled):active {
      transform: translateY(0);
    }
  }

  &-danger {
    background: rgba(239, 68, 68, 0.1);
    color: rgba(239, 68, 68, 0.9);
    border: 1px solid rgba(239, 68, 68, 0.3);

    &:not(:disabled):hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.5);
      transform: translateY(-2px);
    }

    &:not(:disabled):active {
      transform: translateY(0);
    }
  }
}

/* ====================================
 DANGER SECTION
 ==================================== */

.danger-section {
  padding: 1.5rem;
  background: rgba(239, 68, 68, 0.05);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 16px;
  animation: fadeInUp 0.6s ease-out 0.4s backwards;
}

/* ====================================
 ANIMATIONS
 ==================================== */

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
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
