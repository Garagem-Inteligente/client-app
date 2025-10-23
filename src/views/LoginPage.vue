<template>
  <ion-page>
    <ion-content :fullscreen="true" class="auth-content">
      <!-- Background Gradient -->
      <div class="background-gradient"></div>
      <div class="background-pattern"></div>

      <div class="page-content-wrapper login-container">
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
              <label for="login-email" class="form-label">
                <ion-icon :icon="mailOutline" class="label-icon"></ion-icon>
                Email
              </label>
              <div class="input-wrapper">
                <input
                  id="login-email"
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
              <label for="login-password" class="form-label">
                <ion-icon :icon="lockClosedOutline" class="label-icon"></ion-icon>
                Senha
              </label>
              <div class="input-wrapper">
                <input
                  id="login-password"
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

          <!-- Google Sign-In Button -->
          <GoogleSignInButton />

          <!-- Register Link -->
          <button @click="handleRegister" class="secondary-button" style="margin-top: 16px;">
            <ion-icon :icon="personAddOutline" class="button-icon"></ion-icon>
            Criar nova conta
          </button>
        </div>

        <!-- Footer -->
        <div class="auth-footer">
          <p class="footer-text">
            Ao continuar, você concorda com nossos
            <a href="#" class="footer-link">Termos de Uso</a> e
            <RouterLink to="/privacy-policy" class="footer-link">Política de Privacidade</RouterLink>
          </p>
          <p class="footer-text version-text">
            Versão: {{ shortVersion }} | Build: {{ version.buildNumber }} | SHA: {{ shortSha }}
          </p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
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
import GoogleSignInButton from '@/components/atoms/GoogleSignInButton.vue'
import { useVersion } from '@/composables/useVersion'
const { shortVersion, shortSha, version } = useVersion()

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
    console.error('Login error:', err)
    const errorMessage = err instanceof Error ? err.message : 'Erro inesperado ao fazer login'
    error.value = errorMessage
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
    console.error('Password reset error:', err)
    const errorMessage = err instanceof Error ? err.message : 'Erro inesperado'
    error.value = errorMessage
  }
}

const handleRegister = async (event: Event) => {
  // Blur the button to prevent aria-hidden focus issues during navigation
  const target = event.target as HTMLElement
  target.blur()
  
  // Wait for next DOM update to ensure blur is applied
  await nextTick()
  
  // Navigate to register page
  router.push('/register')
}
</script>

<style scoped lang="scss">
/* ====================================
   MODERN LOGIN PAGE - RSCSS Structure
   ==================================== */

/* Base Component */
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--space-2xl) var(--space-lg);
  max-width: 480px;
  margin: 0 auto;

  /* Responsive */
  @media (max-width: 640px) {
    padding: var(--space-xl) var(--space-md);
  }

  @media (min-height: 800px) {
    justify-content: flex-start;
    padding-top: calc(var(--space-2xl) * 2);
  }
}

/* Logo Section Component */
.logo-section {
  text-align: center;
  margin-bottom: var(--space-3xl);
  animation: fadeInDown 0.6s ease-out;

  .logo-wrapper {
    position: relative;
    display: inline-block;
    margin-bottom: var(--space-xl);

    .logo-glow {
      position: absolute;
      inset: -20px;
      background: linear-gradient(135deg, var(--ion-color-primary) 0%, var(--ion-color-secondary) 100%);
      border-radius: 50%;
      filter: blur(30px);
      opacity: 0.4;
      animation: logoGlow 3s ease-in-out infinite;
    }

    .logo-icon {
      font-size: var(--font-size-4xl);
      color: var(--ion-color-primary);
      position: relative;
      z-index: 2;
      filter: drop-shadow(0 8px 16px rgba(59, 130, 246, 0.4));
    }
  }

  .brand-title {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    background: linear-gradient(135deg, var(--ion-color-primary) 0%, var(--ion-color-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 var(--space-xs) 0;
    letter-spacing: -0.5px;

    @media (max-width: 640px) {
      font-size: calc(var(--font-size-3xl) * 0.875);
    }
  }

  .brand-subtitle {
    font-size: var(--font-size-input);
    color: var(--text-secondary);
    margin: 0;
    font-weight: 400;
  }
}

/* Auth Card Component */
.auth-card {
  width: 100%;
  background: var(--bg-card);
  backdrop-filter: var(--blur-card);
  -webkit-backdrop-filter: var(--blur-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-card);
  padding: var(--space-2xl);
  box-shadow: var(--shadow-card);
  animation: fadeInUp 0.6s ease-out 0.2s backwards;

  @media (max-width: 640px) {
    padding: var(--space-xl);
  }

  .card-header {
    margin-bottom: var(--space-2xl);
    text-align: center;

    .card-title {
      font-size: var(--font-size-xl);
      font-weight: 700;
      color: white;
      margin: 0 0 var(--space-xs) 0;

      @media (max-width: 640px) {
        font-size: calc(var(--font-size-xl) * 0.833);
      }
    }

    .card-subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-muted);
      margin: 0;
    }
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);

      .form-label {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        font-size: var(--font-size-sm);
        font-weight: 600;
        color: var(--text-primary);
        letter-spacing: 0.3px;

        .label-icon {
          font-size: var(--font-size-base);
          color: var(--ion-color-primary);
        }
      }

      .input-wrapper {
        position: relative;

        .form-input {
          width: 100%;
          padding: var(--space-sm) var(--space-md);
          background: var(--bg-input);
          border: 1.5px solid var(--border-input);
          border-radius: var(--radius-sm);
          color: white;
          font-size: var(--font-size-input);
          transition: var(--transition-normal);
          outline: none;

          &::placeholder {
            color: var(--text-placeholder);
          }

          &:focus {
            border-color: var(--ion-color-primary);
            background: var(--bg-input-focus);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
        }
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: calc(var(--space-xs) * -1);

      .text-link {
        background: none;
        border: none;
        color: var(--ion-color-primary);
        font-size: var(--font-size-sm);
        font-weight: 500;
        cursor: pointer;
        padding: 0;
        transition: var(--transition-fast);

        &:hover {
          color: var(--ion-color-secondary);
          text-decoration: underline;
        }
      }
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      background: var(--bg-error);
      border: 1px solid var(--border-error);
      border-radius: var(--radius-sm);
      color: var(--red-400);
      font-size: var(--font-size-sm);
      animation: shake 0.4s ease-in-out;

      .error-icon {
        font-size: calc(var(--font-size-xl) * 0.8);
        flex-shrink: 0;
      }
    }

    .submit-button {
      width: 100%;
      padding: var(--space-sm) var(--space-xl);
      background: linear-gradient(135deg, var(--ion-color-primary) 0%, var(--ion-color-secondary) 100%);
      border: none;
      border-radius: var(--radius-sm);
      color: white;
      font-size: var(--font-size-base);
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-normal);
      box-shadow: var(--shadow-button);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-xs);
      margin-top: var(--space-xs);

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: var(--shadow-button-hover);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .button-spinner {
        font-size: calc(var(--font-size-xl) * 0.8);
      }
    }
  }

  .divider {
    position: relative;
    text-align: center;
    margin: var(--space-xl) 0;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--text-border);
    }

    .divider-text {
      position: relative;
      display: inline-block;
      padding: 0 var(--space-md);
      background: var(--bg-card);
      color: var(--text-placeholder);
      font-size: var(--font-size-sm);
      font-weight: 500;
    }
  }

  .secondary-button {
    width: 100%;
    padding: var(--space-sm) var(--space-xl);
    background: rgba(255, 255, 255, 0.05);
    border: 1.5px solid var(--text-border);
    border-radius: var(--radius-sm);
    color: white;
    font-size: var(--font-size-input);
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition-normal);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }

    .button-icon {
      font-size: calc(var(--font-size-lg) * 0.875);
    }
  }
}

/* Footer Component */
.auth-footer {
  margin-top: var(--space-2xl);
  text-align: center;
  animation: fadeInUp 0.6s ease-out 0.4s backwards;

  .footer-text {
    font-size: calc(var(--font-size-xs) * 1.111);
    color: var(--text-placeholder);
    line-height: 1.6;
    margin: 0;

    &.version-text {
      margin-top: var(--space-xs);
    }

    .footer-link {
      color: var(--ion-color-primary);
      text-decoration: none;
      transition: var(--transition-fast);

      &:hover {
        color: var(--ion-color-secondary);
        text-decoration: underline;
      }
    }
  }
}

/* Background Elements */
.background-gradient {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  z-index: -2;
}

.background-pattern {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  z-index: -1;
}

/* Animations */
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




