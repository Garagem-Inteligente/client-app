<template>
  <ion-page>
    <ion-content :fullscreen="true" class="register-content">
      <!-- Background Gradient -->
      <div class="background-gradient"></div>
      <div class="background-pattern"></div>

      <!-- Back Button -->
      <button @click="$router.push('/login')" class="back-button">
        <ion-icon :icon="arrowBackOutline" class="back-icon"></ion-icon>
      </button>

      <div class="register-container">
        <!-- Logo Section -->
        <div class="logo-section">
          <div class="logo-wrapper">
            <div class="logo-glow"></div>
            <ion-icon :icon="car" class="logo-icon"></ion-icon>
          </div>
          <h1 class="brand-title">Criar Conta</h1>
          <p class="brand-subtitle">Junte-se à Garagem Inteligente</p>
        </div>

        <!-- Register Card -->
        <div class="auth-card">
          <div class="card-header">
            <h2 class="card-title">Começe agora</h2>
            <p class="card-subtitle">Preencha seus dados para criar sua conta</p>
          </div>

          <form @submit.prevent="handleRegister" class="auth-form">
            <!-- Name Input -->
            <div class="form-group">
              <label for="register-name" class="form-label">
                <ion-icon :icon="personOutline" class="label-icon"></ion-icon>
                Nome Completo
              </label>
              <div class="input-wrapper">
                <input
                  id="register-name"
                  v-model="form.name"
                  type="text"
                  class="form-input"
                  placeholder="Seu nome completo"
                  required
                  autocomplete="name"
                />
              </div>
            </div>

            <!-- Email Input -->
            <div class="form-group">
              <label for="register-email" class="form-label">
                <ion-icon :icon="mailOutline" class="label-icon"></ion-icon>
                Email
              </label>
              <div class="input-wrapper">
                <input
                  id="register-email"
                  v-model="form.email"
                  type="email"
                  class="form-input"
                  placeholder="seu@email.com"
                  required
                  autocomplete="email"
                />
              </div>
            </div>

            <!-- Password Input -->
            <div class="form-group">
              <label for="register-password" class="form-label">
                <ion-icon :icon="lockClosedOutline" class="label-icon"></ion-icon>
                Senha
              </label>
              <div class="input-wrapper">
                <input
                  id="register-password"
                  v-model="form.password"
                  type="password"
                  class="form-input"
                  placeholder="Mínimo 6 caracteres"
                  required
                  autocomplete="new-password"
                />
              </div>
              <div v-if="form.password" class="password-strength">
                <div class="strength-bar">
                  <div class="strength-fill" :style="{ width: passwordStrength + '%' }"></div>
                </div>
                <span class="strength-text">{{ passwordStrengthLabel }}</span>
              </div>
            </div>

            <!-- Confirm Password Input -->
            <div class="form-group">
              <label for="register-confirm-password" class="form-label">
                <ion-icon :icon="checkmarkCircleOutline" class="label-icon"></ion-icon>
                Confirmar Senha
              </label>
              <div class="input-wrapper">
                <input
                  id="register-confirm-password"
                  v-model="form.confirmPassword"
                  type="password"
                  class="form-input"
                  placeholder="Digite a senha novamente"
                  required
                  autocomplete="new-password"
                />
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="error-message">
              <ion-icon :icon="alertCircle" class="error-icon"></ion-icon>
              <span>{{ error }}</span>
            </div>

            <!-- Success Message -->
            <div v-if="successMessage" class="success-message">
              <ion-icon :icon="checkmarkCircle" class="success-icon"></ion-icon>
              <span>{{ successMessage }}</span>
            </div>

            <!-- Submit Button -->
            <button type="submit" :disabled="loading || !isFormValid" class="submit-button">
              <ion-spinner v-if="loading" name="crescent" class="button-spinner"></ion-spinner>
              <span v-else>Criar Conta</span>
            </button>
          </form>

          <!-- Divider -->
          <div class="divider">
            <span class="divider-text">ou</span>
          </div>

          <!-- Google Sign-In Button -->
          <GoogleSignInButton />

          <!-- Login Link -->
          <button @click="$router.push('/login')" class="secondary-button" style="margin-top: 16px;">
            <ion-icon :icon="logInOutline" class="button-icon"></ion-icon>
            Já tenho uma conta
          </button>
        </div>

        <!-- Footer -->
        <div class="auth-footer">
          <p class="footer-text">
            Ao criar uma conta, você concorda com nossos
            <a href="#" class="footer-link">Termos de Uso</a> e
            <a href="#" class="footer-link">Política de Privacidade</a>
          </p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonContent, IonIcon, IonSpinner } from '@ionic/vue'
import {
  car,
  alertCircle,
  checkmarkCircle,
  personOutline,
  mailOutline,
  lockClosedOutline,
  checkmarkCircleOutline,
  arrowBackOutline,
  logInOutline
} from 'ionicons/icons'
import { useAuthStore } from '@/stores/auth'
import { GoogleSignInButton } from '@/components'

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

// Password strength calculation
const passwordStrength = computed(() => {
  const password = form.value.password
  if (!password) return 0
  
  let strength = 0
  if (password.length >= 6) strength += 25
  if (password.length >= 8) strength += 25
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25
  if (/\d/.test(password)) strength += 15
  if (/[^a-zA-Z0-9]/.test(password)) strength += 10
  
  return Math.min(strength, 100)
})

const passwordStrengthLabel = computed(() => {
  const strength = passwordStrength.value
  if (strength < 40) return 'Fraca'
  if (strength < 70) return 'Média'
  return 'Forte'
})

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

<style scoped>
/* ====================================
   MODERN REGISTER PAGE - 2025 DESIGN
   ==================================== */

.register-content {
  --background: #0f172a;
  position: relative;
  overflow: hidden;
}

/* Background Effects */
.background-gradient {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, 
    #0f172a 0%, 
    #1e293b 50%, 
    #0f172a 100%
  );
  z-index: 0;
}

.background-pattern {
  position: fixed;
  inset: 0;
  background-image: 
    radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  z-index: 1;
  animation: patternFloat 20s ease-in-out infinite;
}

@keyframes patternFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(30px, -30px) scale(1.1);
  }
}

/* Back Button */
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

/* Container */
.register-container {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 1.5rem;
  max-width: 480px;
  margin: 0 auto;
}

/* Logo Section */
.logo-section {
  text-align: center;
  margin-bottom: 2.5rem;
  animation: fadeInDown 0.6s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
}

.logo-glow {
  position: absolute;
  inset: -20px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 50%;
  filter: blur(30px);
  opacity: 0.4;
  animation: logoGlow 3s ease-in-out infinite;
}

@keyframes logoGlow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

.logo-icon {
  font-size: 4rem;
  color: #6366f1;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 8px 16px rgba(99, 102, 241, 0.4));
}

.brand-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.5px;
}

.brand-subtitle {
  font-size: 0.938rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  font-weight: 400;
}

/* Auth Card */
.auth-card {
  width: 100%;
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: fadeInUp 0.6s ease-out 0.2s backwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header {
  margin-bottom: 2rem;
  text-align: center;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

/* Form */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.3px;
}

.label-icon {
  font-size: 1rem;
  color: #6366f1;
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 0.938rem;
  transition: all 0.3s ease;
  outline: none;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.form-input:focus {
  border-color: #6366f1;
  background: rgba(15, 23, 42, 0.8);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Password Strength Indicator */
.password-strength {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  background: linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #10b981 100%);
  transition: width 0.3s ease;
  border-radius: 2px;
}

.strength-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  min-width: 50px;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  color: #fca5a5;
  font-size: 0.875rem;
  animation: shake 0.4s ease-in-out;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

.error-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

/* Success Message */
.success-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
  color: #6ee7b7;
  font-size: 0.875rem;
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

/* Buttons */
.submit-button {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-spinner {
  font-size: 1.25rem;
}

.secondary-button {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 0.938rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.secondary-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.button-icon {
  font-size: 1.125rem;
}

/* Divider */
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

/* Footer */
.auth-footer {
  margin-top: 2rem;
  text-align: center;
  animation: fadeInUp 0.6s ease-out 0.4s backwards;
}

.footer-text {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.6;
  margin: 0;
}

.footer-link {
  color: #6366f1;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #8b5cf6;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 640px) {
  .register-container {
    padding: 1.5rem 1rem;
  }

  .auth-card {
    padding: 1.5rem;
  }

  .brand-title {
    font-size: 1.75rem;
  }

  .card-title {
    font-size: 1.25rem;
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




