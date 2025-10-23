<template>
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
</template>

<script setup lang="ts">
import { IonIcon, IonSpinner } from '@ionic/vue'
import {
  alertCircle,
  mailOutline,
  lockClosedOutline,
  personAddOutline
} from 'ionicons/icons'
import GoogleSignInButton from '@/components/atoms/GoogleSignInButton.vue'
import { useLoginForm } from '@/composables/useLoginForm'

const {
  form,
  loading,
  error,
  handleLogin,
  handleForgotPassword
} = useLoginForm()

// Events
const emit = defineEmits<{
  registerClick: []
}>()

const handleRegister = async (event: Event) => {
  // Blur the button to prevent aria-hidden focus issues during navigation
  const target = event.target as HTMLElement
  target.blur()

  // Emit event instead of direct navigation
  emit('registerClick')
}
</script><style scoped lang="scss">
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

/* Animations */
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
  .auth-card {
    animation-duration: 0.01ms !important;
  }

  .auth-card .error-message {
    animation-duration: 0.01ms !important;
  }
}
</style>