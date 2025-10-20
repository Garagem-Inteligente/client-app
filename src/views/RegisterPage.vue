<template>
  <ion-page>
    <ion-content :fullscreen="true" class="c-register-page__content">
      <!-- Background Gradient -->
      <div class="c-register-page__background-gradient"></div>
      <div class="c-register-page__background-pattern"></div>

      <!-- Back Button -->
      <button @click="$router.push('/login')" class="c-register-page__back-button">
        <ion-icon :icon="arrowBackOutline" class="c-register-page__back-icon"></ion-icon>
      </button>

      <!-- Main Container -->
      <main class="c-register-page__main">
        <!-- Components -->
        <RegisterHeader />
        
        <RegisterCard
          v-model="form"
          :error="error"
          :success-message="successMessage"
          :loading="loading"
          @submit="handleRegister"
          @login="$router.push('/login')"
        >
          <template #oauth>
            <GoogleSignInButton />
          </template>
        </RegisterCard>

        <RegisterFooter />
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonContent, IonIcon } from '@ionic/vue'
import { arrowBackOutline } from 'ionicons/icons'
import { useAuthStore } from '@/stores/auth'
import { GoogleSignInButton, RegisterHeader, RegisterCard, RegisterFooter } from '@/components'

const router = useRouter()
const authStore = useAuthStore()

interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const form = ref<RegisterForm>({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')
const successMessage = ref('')

const isFormValid = computed(() => {
  return form.value.name.length > 0 &&
         form.value.email.length > 0 &&
         form.value.password.length >= 6 &&
         form.value.password === form.value.confirmPassword
})

const handleRegister = async () => {
  if (!isFormValid.value) {
    error.value = 'Preencha todos os campos corretamente'
    return
  }

  loading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    const success = await authStore.register(
      form.value.email,
      form.value.password,
      form.value.name
    )
    
    if (success) {
      successMessage.value = 'Conta criada com sucesso! Redirecionando...'
      setTimeout(() => {
        router.push('/tabs/home')
      }, 2000)
    } else {
      error.value = authStore.error || 'Erro ao criar conta'
    }
  } catch (err) {
    console.error('Registration error:', err)
    const errorMessage = err instanceof Error ? err.message : 'Erro inesperado ao criar conta'
    error.value = errorMessage
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
/* ====================================
   REGISTER PAGE - Container
   ==================================== */

.c-register-page {
  &__content {
    --background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  }

  &__background-gradient {
    position: fixed;
    inset: 0;
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%);
    z-index: 0;
    opacity: 0.5;
  }

  &__background-pattern {
    position: fixed;
    inset: 0;
    background-image: 
      radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
    z-index: 0;
    pointer-events: none;
  }

  &__back-button {
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

    &:hover {
      background: rgba(30, 41, 59, 0.95);
      transform: translateX(-4px);
    }
  }

  &__back-icon {
    font-size: 1.5rem;
    color: white;
  }

  &__main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem 1.5rem;
    max-width: 480px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .c-register-page__back-button {
    width: 44px;
    height: 44px;
  }

  .c-register-page__back-icon {
    font-size: 1.25rem;
  }

  .c-register-page__main {
    padding: 1.5rem 1rem;
  }
}

@media (min-height: 900px) {
  .c-register-page__main {
    justify-content: flex-start;
    padding-top: 4rem;
  }
}

/* Accessibility */
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
