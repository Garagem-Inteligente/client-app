<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <template v-slot:start>
<ion-buttons >
          <ion-back-button></ion-back-button>
        </ion-buttons>
</template>
        <ion-title>Cadastro</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div class="register-container">
        <!-- Logo -->
        <div class="logo-section">
          <ion-icon :icon="car" size="large" color="primary"></ion-icon>
          <h1>Criar Conta</h1>
          <p>Junte-se à Garagem Inteligente</p>
        </div>

        <!-- Register Form -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Cadastre-se</ion-card-title>
            <ion-card-subtitle>Preencha os dados abaixo</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <form @submit.prevent="handleRegister">
              <ion-item>
                <ion-label position="stacked">Nome Completo</ion-label>
                <ion-input
                  v-model="form.name"
                  type="text"
                  placeholder="Seu nome completo"
                  required
                ></ion-input>
              </ion-item>

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
                  placeholder="Mínimo 6 caracteres"
                  required
                ></ion-input>
              </ion-item>

              <ion-item>
                <ion-label position="stacked">Confirmar Senha</ion-label>
                <ion-input
                  v-model="form.confirmPassword"
                  type="password"
                  placeholder="Digite a senha novamente"
                  required
                ></ion-input>
              </ion-item>

              <ion-button
                expand="block"
                type="submit"
                :disabled="loading || !isFormValid"
                class="ion-margin-top"
              >
                <ion-spinner v-if="loading" name="crescent"></ion-spinner>
                <span v-else>Criar Conta</span>
              </ion-button>
            </form>

            <!-- Error Message -->
            <ion-item v-if="error" color="danger">
              <template v-slot:start>
<ion-icon :icon="alertCircle" ></ion-icon>
</template>
              <ion-label>{{ error }}</ion-label>
            </ion-item>

            <!-- Success Message -->
            <ion-item v-if="successMessage" color="success">
              <template v-slot:start>
<ion-icon :icon="checkmarkCircle" ></ion-icon>
</template>
              <ion-label>{{ successMessage }}</ion-label>
            </ion-item>

            <!-- Links -->
            <div class="ion-text-center ion-margin-top">
              <ion-button fill="clear" @click="$router.push('/login')">
                Já tem conta? Faça login
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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
  IonSpinner,
  IonBackButton,
  IonButtons
} from '@ionic/vue'
import { car, alertCircle, checkmarkCircle } from 'ionicons/icons'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
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
    error.value = 'Erro inesperado ao criar conta'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
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




