<template>
  <section class="c-login-card" aria-labelledby="login-title">
    <header class="c-login-card__header">
      <h2 id="login-title" class="c-login-card__title">Bem-vindo de volta</h2>
      <p class="c-login-card__subtitle">Entre com suas credenciais</p>
    </header>

    <form @submit.prevent="$emit('submit')" class="c-login-form" novalidate>
      <!-- Email Input -->
      <div class="c-login-form__group">
        <label for="login-email" class="c-login-form__label">
          <ion-icon
            :icon="mailOutline"
            class="c-login-form__label-icon"
            aria-hidden="true"
          ></ion-icon>
          <span>Email</span>
        </label>
        <div class="c-login-form__input-wrapper">
          <input
            id="login-email"
            :value="modelValue.email"
            @input="
              $emit('update:modelValue', {
                ...modelValue,
                email: ($event.target as HTMLInputElement).value,
              })
            "
            type="email"
            class="c-login-form__input"
            placeholder="seu@email.com"
            required
            autocomplete="email"
            aria-required="true"
          />
        </div>
      </div>

      <!-- Password Input -->
      <div class="c-login-form__group">
        <label for="login-password" class="c-login-form__label">
          <ion-icon
            :icon="lockClosedOutline"
            class="c-login-form__label-icon"
            aria-hidden="true"
          ></ion-icon>
          <span>Senha</span>
        </label>
        <div class="c-login-form__input-wrapper">
          <input
            id="login-password"
            :value="modelValue.password"
            @input="
              $emit('update:modelValue', {
                ...modelValue,
                password: ($event.target as HTMLInputElement).value,
              })
            "
            type="password"
            class="c-login-form__input"
            placeholder="••••••••"
            required
            autocomplete="current-password"
            aria-required="true"
          />
        </div>
      </div>

      <!-- Forgot Password Link -->
      <div class="c-login-form__actions">
        <button
          type="button"
          @click="$emit('forgot-password')"
          class="c-login-form__link"
        >
          Esqueceu a senha?
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="error" role="alert" class="c-login-form__error">
        <ion-icon
          :icon="alertCircle"
          class="c-login-form__error-icon"
          aria-hidden="true"
        ></ion-icon>
        <span>{{ error }}</span>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading"
        class="c-login-form__submit"
        :aria-busy="loading"
      >
        <ion-spinner
          v-if="loading"
          name="crescent"
          class="c-login-form__spinner"
          aria-label="Carregando"
        ></ion-spinner>
        <span v-else>Entrar</span>
      </button>
    </form>

    <!-- Divider -->
    <div class="c-login-card__divider" aria-hidden="true">
      <span class="c-login-card__divider-text">ou</span>
    </div>

    <!-- Google Sign-In Button -->
    <slot name="oauth"></slot>

    <!-- Register Link -->
    <button @click="$emit('register')" class="c-login-card__secondary-btn">
      <ion-icon
        :icon="personAddOutline"
        class="c-login-card__btn-icon"
        aria-hidden="true"
      ></ion-icon>
      <span>Criar nova conta</span>
    </button>
  </section>
</template>

<script setup lang="ts">
import { IonIcon, IonSpinner } from "@ionic/vue";
import {
  mailOutline,
  lockClosedOutline,
  alertCircle,
  personAddOutline,
} from "ionicons/icons";

interface LoginForm {
  email: string;
  password: string;
}

defineProps<{
  modelValue: LoginForm;
  error: string;
  loading: boolean;
}>();

defineEmits<{
  "update:modelValue": [value: LoginForm];
  submit: [];
  "forgot-password": [];
  register: [];
}>();
</script>

<style lang="scss" scoped>
$color-primary: #6366f1;
$color-primary-dark: #8b5cf6;
$color-text-primary: #ffffff;
$color-border: rgba(255, 255, 255, 0.1);
$color-error: #ef4444;
$color-error-light: #fca5a5;

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
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

// ====================================
// LOGIN CARD
// ====================================

.c-login-card {
  width: 100%;
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid $color-border;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: fadeInUp 0.6s ease-out 0.2s backwards;

  &__header {
    margin-bottom: 2rem;
    text-align: center;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $color-text-primary;
    margin: 0 0 0.5rem 0;
  }

  &__subtitle {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.5);
    margin: 0;
  }

  &__divider {
    position: relative;
    text-align: center;
    margin: 1.5rem 0;

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: $color-border;
    }
  }

  &__divider-text {
    position: relative;
    display: inline-block;
    padding: 0 1rem;
    background: rgba(30, 41, 59, 0.8);
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.875rem;
    font-weight: 500;
  }

  &__secondary-btn {
    width: 100%;
    padding: 0.875rem 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1.5px solid $color-border;
    border-radius: 12px;
    color: $color-text-primary;
    font-size: 0.938rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }

    &:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: 2px;
    }
  }

  &__btn-icon {
    font-size: 1.125rem;
  }
}

// ====================================
// LOGIN FORM
// ====================================

.c-login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  &__group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: $color-text-primary;
    letter-spacing: 0.3px;

    > span {
      line-height: 1.2;
    }
  }

  &__label-icon {
    font-size: 1rem;
    color: $color-primary;
    flex-shrink: 0;
  }

  &__input-wrapper {
    position: relative;
  }

  &__input {
    width: 100%;
    padding: 0.875rem 1rem;
    background: rgba(15, 23, 42, 0.6);
    border: 1.5px solid $color-border;
    border-radius: 12px;
    color: $color-text-primary;
    font-size: 0.938rem;
    font-family: inherit;
    transition: all 0.3s ease;
    outline: none;

    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }

    &:hover:not(:disabled) {
      border-color: rgba(255, 255, 255, 0.2);
      background: rgba(15, 23, 42, 0.7);
    }

    &:focus {
      border-color: $color-primary;
      background: rgba(15, 23, 42, 0.8);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    margin-top: -0.5rem;
  }

  &__link {
    background: none;
    border: none;
    color: $color-primary;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    padding: 0.25rem 0;
    transition: all 0.2s ease;
    text-decoration: none;

    &:hover {
      color: $color-primary-dark;
      text-decoration: underline;
    }

    &:focus-visible {
      outline: 2px solid $color-primary;
      outline-offset: 2px;
      border-radius: 2px;
    }
  }

  &__error {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 12px;
    color: $color-error-light;
    font-size: 0.875rem;
    animation: shake 0.4s ease-in-out;
    line-height: 1.5;
  }

  &__error-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  &__submit {
    width: 100%;
    padding: 0.875rem 1.5rem;
    background: linear-gradient(
      135deg,
      $color-primary 0%,
      $color-primary-dark 100%
    );
    border: none;
    border-radius: 12px;
    color: $color-text-primary;
    font-size: 1rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.5rem;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &:focus-visible {
      outline: 2px solid $color-text-primary;
      outline-offset: 2px;
    }
  }

  &__spinner {
    font-size: 1.25rem;
  }
}

@media (max-width: 640px) {
  .c-login-card {
    padding: 1.5rem;

    &__title {
      font-size: 1.25rem;
    }
  }
}
</style>
