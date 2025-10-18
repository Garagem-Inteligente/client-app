<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Garagem Inteligente</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div class="login-container">
        <!-- Logo -->
        <div class="logo-section">
          <ion-icon :icon="car" size="large" color="primary"></ion-icon>
          <h1>Garagem Inteligente</h1>
          <p>Gerencie seus veículos de forma inteligente</p>
        </div>

        <!-- Login Form -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Entrar</ion-card-title>
            <ion-card-subtitle>Faça login na sua conta</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <form @submit.prevent="handleLogin">
              <ion-item>
                <ion-label position="stacked">Email</ion-label>
                <ion-input
                  v-model="form.email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                ></ion-input>
              </ion-item>

              <ion-item>
                <ion-label position="stacked">Senha</ion-label>
                <ion-input
                  v-model="form.password"
                  type="password"
                  placeholder="Sua senha"
                  required
                ></ion-input>
              </ion-item>

              <ion-button
                expand="block"
                type="submit"
                :disabled="loading"
                class="ion-margin-top"
              >
                <ion-spinner v-if="loading" name="crescent"></ion-spinner>
                <span v-else>Entrar</span>
              </ion-button>
            </form>

            <!-- Error Message -->
            <ion-item v-if="error" color="danger">
              <template v-slot:start>
<ion-icon :icon="alertCircle" ></ion-icon>
</template>
              <ion-label>{{ error }}</ion-label>
            </ion-item>

            <!-- Links -->
            <div class="ion-text-center ion-margin-top">
              <ion-button fill="clear" @click="$router.push('/register')">
                Não tem conta? Cadastre-se
              </ion-button>
            </div>

            <div class="ion-text-center">
              <ion-button fill="clear" @click="handleForgotPassword">
                Esqueceu a senha?
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner
} from '@ionic/vue'
import { car, alertCircle } from 'ionicons/icons'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const success = await authStore.login(form.value.email, form.value.password)
    
    if (success) {
      // Redirect to intended page or home
      const redirect = router.currentRoute.value.query.redirect as string
      router.push(redirect || '/tabs/home')
    } else {
      error.value = authStore.error || 'Erro ao fazer login'
    }
  } catch (err) {
    error.value = 'Erro inesperado ao fazer login'
  } finally {
    loading.value = false
  }
}

const handleForgotPassword = async () => {
  if (!form.value.email) {
    error.value = 'Digite seu email primeiro'
    return
  }

  try {
    const success = await authStore.resetPassword(form.value.email)
    if (success) {
      // Show success message
      error.value = ''
      // You could show a toast here
    } else {
      error.value = authStore.error || 'Erro ao enviar email de recuperação'
    }
  } catch (err) {
    error.value = 'Erro inesperado'
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem 0;
}

.logo-section {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-section h1 {
  margin: 1rem 0 0.5rem 0;
  color: var(--ion-color-primary);
}

.logo-section p {
  color: var(--ion-color-medium);
  margin: 0;
}
</style>




