<template>
  <ion-page>
    <ion-content :fullscreen="true" class="login-content">
      <!-- Background Gradient -->
      <div class="background-gradient"></div>
      <div class="background-pattern"></div>

      <div class="login-container">
        <!-- Logo Section -->
        <div class="logo-section">
          <div class="logo-wrapper">
            <div class="logo-glow"></div>
            <ion-icon :icon="car" class="logo-icon"></ion-icon>
          </div>
          <h1 class="brand-title">Garagem Inteligente</h1>
          <p class="brand-subtitle">Gerencie seus veículos com inteligência</p>
        </div>

        <!-- Login Card -->
        <div class="auth-card">
          <div class="card-header">
            <h2 class="card-title">Bem-vindo de volta</h2>
            <p class="card-subtitle">Entre com suas credenciais</p>
          </div>

          <form @submit.prevent="handleLogin" class="auth-form">
            <!-- Email Input -->
            <div class="form-group">
              <label class="form-label">
                <ion-icon :icon="mailOutline" class="label-icon"></ion-icon>
                Email
              </label>
              <div class="input-wrapper">
                <input
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
              <label class="form-label">
                <ion-icon :icon="lockClosedOutline" class="label-icon"></ion-icon>
                Senha
              </label>
              <div class="input-wrapper">
                <input
                  v-model="form.password"
                  type="password"
                  class="form-input"
                  placeholder="••••••••"
                  required
                  autocomplete="current-password"
                />
              </div>
            </div>

            <!-- Forgot Password Link -->
            <div class="form-actions">
              <button type="button" @click="handleForgotPassword" class="text-link">
                Esqueceu a senha?
              </button>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="error-message">
              <ion-icon :icon="alertCircle" class="error-icon"></ion-icon>
              <span>{{ error }}</span>
            </div>

            <!-- Submit Button -->
            <button type="submit" :disabled="loading" class="submit-button">
              <ion-spinner v-if="loading" name="crescent" class="button-spinner"></ion-spinner>
              <span v-else>Entrar</span>
            </button>
          </form>

          <!-- Divider -->
          <div class="divider">
            <span class="divider-text">ou</span>
          </div>

          <!-- Register Link -->
          <button @click="$router.push('/register')" class="secondary-button">
            <ion-icon :icon="personAddOutline" class="button-icon"></ion-icon>
            Criar nova conta
          </button>
        </div>

        <!-- Footer -->
        <div class="auth-footer">
          <p class="footer-text">
            Ao continuar, você concorda com nossos
            <a href="#" class="footer-link">Termos de Uso</a> e
            <a href="#" class="footer-link">Política de Privacidade</a>
          </p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonContent, IonIcon, IonSpinner } from '@ionic/vue'
import { 
  car, 
  alertCircle, 
  mailOutline, 
  lockClosedOutline, 
  personAddOutline 
} from 'ionicons/icons'
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
/* ====================================
   MODERN LOGIN PAGE - 2025 DESIGN
   ==================================== */

.login-content {
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

/* Container */
.login-container {
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
  margin-bottom: 3rem;
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: -0.5rem;
}

.text-link {
  background: none;
  border: none;
  color: #6366f1;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
}

.text-link:hover {
  color: #8b5cf6;
  text-decoration: underline;
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
  .login-container {
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
}

@media (min-height: 800px) {
  .login-container {
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




