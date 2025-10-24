<template>
  <ion-page>
    <PageLayout>
      <ion-content :fullscreen="true" class="auth-content">
        <button @click="navigateToLogin" class="back-button">
          <ion-icon :icon="arrowBackOutline" class="back-icon"></ion-icon>
        </button>

        <div class="page-content-wrapper register-container">
          <RegisterLogoSection />

          <RegisterCard
            v-model="formData"
            :error="errors.general"
            :success-message="successMessage"
            :loading="isLoading"
            @submit="handleRegister"
            @login="navigateToLogin"
          >
            <template #oauth>
              <div class="divider">
                <span class="divider-text">ou</span>
              </div>

              <GoogleSignInButton />
            </template>
          </RegisterCard>

          <RegisterAuthFooter />
        </div>
      </ion-content>
    </PageLayout>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonIcon } from '@ionic/vue'
import { arrowBackOutline } from 'ionicons/icons'
import { useRegisterForm } from '@/composables/useRegisterForm'
import { useAuthNavigation } from '@/composables/useAuthNavigation'
import {
  PageLayout,
  RegisterCard,
  RegisterLogoSection,
  RegisterAuthFooter
} from '@/components'
import GoogleSignInButton from '@/components/atoms/GoogleSignInButton.vue'

// Composables
const {
  formData,
  errors,
  isLoading,
  successMessage,
  register
} = useRegisterForm()

const { navigateToLogin } = useAuthNavigation()

// Methods
const handleRegister = async () => {
  await register()
}
</script>

<style scoped lang="scss">
.back-button {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 10;
  width: 48px;
  height: 48px;
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.back-button:hover {
  background: rgba(30, 41, 59, 0.95);
  transform: translateX(-4px);
}

.back-icon {
  font-size: 1.5rem;
  color: white;
}

.register-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 1.5rem;
  max-width: 480px;
  margin: 0 auto;
}

.divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.divider-text {
  position: relative;
  display: inline-block;
  padding: 0 1rem;
  background: rgba(30, 41, 59, 0.8);
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.875rem;
  font-weight: 500;
}

@media (max-width: 640px) {
  .register-container {
    padding: 1.5rem 1rem;
  }

  .back-button {
    width: 44px;
    height: 44px;
  }

  .back-icon {
    font-size: 1.25rem;
  }
}

@media (min-height: 900px) {
  .register-container {
    justify-content: flex-start;
    padding-top: 4rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>




