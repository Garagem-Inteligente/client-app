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
          <button @click="$router.push('/register')" class="secondary-button" style="margin-top: 16px;">
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
import { GoogleSignInButton } from '@/components'
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
</script>

<style scoped lang="scss">
// ====================================
// MODERN LOGIN PAGE - 2025 DESIGN
// ====================================

// Import global variables and mixins using modern @use syntax
@use '@/theme/variables.scss' as vars;

// Animations (component-specific)
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

// Layout
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 1.5rem;
  max-width: 480px;
  margin: 0 auto;

  @media (max-width: 640px) {
    padding: 1.5rem 1rem;
  }

  @media (min-height: 800px) {
    justify-content: flex-start;
    padding-top: 4rem;
  }
}

// Logo Section
// POTENCIAL COMPONENTE: LogoSection.vue - Seção do logo reutilizável
.logo-section {
  text-align: center;
  margin-bottom: 3rem;
  @include vars.fade-in-down;

  .logo-wrapper {
    position: relative;
    display: inline-block;
    margin-bottom: 1.5rem;

    .logo-glow {
      position: absolute;
      inset: -20px;
      background: linear-gradient(135deg, vars.$primary-color 0%, vars.$secondary-color 100%);
      border-radius: 50%;
      filter: blur(30px);
      opacity: 0.4;
      animation: logoGlow 3s ease-in-out infinite;
    }

    .logo-icon {
      font-size: 4rem;
      color: vars.$primary-color;
      position: relative;
      z-index: 2;
      filter: drop-shadow(0 8px 16px rgba(vars.$primary-color, 0.4));
    }
  }

  .brand-title {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, vars.$primary-color 0%, vars.$secondary-color 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.5px;

    @media (max-width: 640px) {
      font-size: 1.75rem;
    }
  }

  .brand-subtitle {
    font-size: 0.938rem;
    color: vars.$text-muted;
    margin: 0;
    font-weight: 400;
  }
}

// Auth Card
// POTENCIAL COMPONENTE: AuthCard.vue - Card de autenticação reutilizável
.auth-card {
  width: 100%;
  @include vars.glass-effect;
  border-radius: 24px;
  padding: 2rem;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  @include vars.fade-in-up(0.2s);

  @media (max-width: 640px) {
    padding: 1.5rem;
  }

  .card-header {
    margin-bottom: 2rem;
    text-align: center;

    .card-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: vars.$text-primary;
      margin: 0 0 0.5rem 0;

      @media (max-width: 640px) {
        font-size: 1.25rem;
      }
    }

    .card-subtitle {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.5);
      margin: 0;
    }
  }

  // Form
  // POTENCIAL COMPONENTE: AuthForm.vue - Formulário de login reutilizável
  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .form-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        font-weight: 600;
        color: vars.$text-secondary;
        letter-spacing: 0.3px;

        .label-icon {
          font-size: 1rem;
          color: vars.$primary-color;
        }
      }

      .input-wrapper {
        position: relative;

        .form-input {
          width: 100%;
          padding: 0.875rem 1rem;
          background: vars.$background-darker;
          border: 1.5px solid vars.$border-color;
          border-radius: 12px;
          color: vars.$text-primary;
          font-size: 0.938rem;
          transition: all 0.3s ease;
          outline: none;

          &::placeholder {
            color: rgba(255, 255, 255, 0.3);
          }

          &:focus {
            border-color: vars.$primary-color;
            background: vars.$background-darkest;
            box-shadow: 0 0 0 3px rgba(vars.$primary-color, 0.1);
          }
        }
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: -0.5rem;

      .text-link {
        background: none;
        border: none;
        color: vars.$primary-color;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        padding: 0;
        transition: all 0.2s ease;

        &:hover {
          color: vars.$secondary-color;
          text-decoration: underline;
        }
      }
    }

    // Error Message
    // POTENCIAL COMPONENTE: ErrorMessage.vue - Componente de erro reutilizável
    .error-message {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      background: rgba(vars.$error-color, 0.1);
      border: 1px solid rgba(vars.$error-color, 0.3);
      border-radius: 12px;
      color: vars.$error-light;
      font-size: 0.875rem;
      animation: shake 0.4s ease-in-out;

      .error-icon {
        font-size: 1.25rem;
        flex-shrink: 0;
      }
    }

    // Submit Button
    // POTENCIAL COMPONENTE: PrimaryButton.vue - Botão primário reutilizável
    .submit-button {
      width: 100%;
      padding: 0.875rem 1.5rem;
      background: linear-gradient(135deg, vars.$primary-color 0%, vars.$secondary-color 100%);
      @include vars.button-base;
      color: vars.$text-primary;
      font-size: 1rem;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(vars.$primary-color, 0.3);
      margin-top: 0.5rem;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(vars.$primary-color, 0.4);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .button-spinner {
        font-size: 1.25rem;
      }
    }
  }

  // Divider
  .divider {
    position: relative;
    text-align: center;
    margin: 1.5rem 0;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: vars.$border-color;
    }

    .divider-text {
      position: relative;
      display: inline-block;
      padding: 0 1rem;
      background: vars.$background-dark;
      color: vars.$text-light;
      font-size: 0.875rem;
      font-weight: 500;
    }
  }

  // Secondary Button
  // POTENCIAL COMPONENTE: SecondaryButton.vue - Botão secundário reutilizável
  .secondary-button {
    width: 100%;
    padding: 0.875rem 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1.5px solid vars.$border-color;
    @include vars.button-base;
    color: vars.$text-primary;
    font-size: 0.938rem;
    font-weight: 500;
    margin-top: 16px;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: vars.$border-hover;
      transform: translateY(-1px);
    }

    .button-icon {
      font-size: 1.125rem;
    }
  }
}

// Footer
// POTENCIAL COMPONENTE: AuthFooter.vue - Footer de autenticação reutilizável
.auth-footer {
  margin-top: 2rem;
  text-align: center;
  @include vars.fade-in-up(0.4s);

  .footer-text {
    font-size: 0.75rem;
    color: vars.$text-light;
    line-height: 1.6;
    margin: 0;

    &.version-text {
      margin-top: 0.5rem;
    }
  }

  .footer-link {
    color: vars.$primary-color;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: vars.$secondary-color;
      text-decoration: underline;
    }
  }
}

// Accessibility
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


