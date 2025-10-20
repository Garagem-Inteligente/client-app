<template>
  <article class="c-register-card">
    <!-- Header -->
    <header class="c-register-card__header">
      <h2 class="c-register-card__title">Começe agora</h2>
      <p class="c-register-card__subtitle">Preencha seus dados para criar sua conta</p>
    </header>

    <!-- Form -->
    <form @submit.prevent="$emit('submit')" class="c-register-card__form">
      <!-- Name Input -->
      <div class="c-register-card__form-group">
        <label for="register-name" class="c-register-card__label">
          <ion-icon :icon="personOutline" class="c-register-card__label-icon"></ion-icon>
          Nome Completo
        </label>
        <div class="c-register-card__input-wrapper">
          <input
            id="register-name"
            :value="modelValue.name"
            type="text"
            class="c-register-card__input"
            placeholder="Seu nome completo"
            required
            autocomplete="name"
            @input="handleUpdateName"
          />
        </div>
      </div>

      <!-- Email Input -->
      <div class="c-register-card__form-group">
        <label for="register-email" class="c-register-card__label">
          <ion-icon :icon="mailOutline" class="c-register-card__label-icon"></ion-icon>
          Email
        </label>
        <div class="c-register-card__input-wrapper">
          <input
            id="register-email"
            :value="modelValue.email"
            type="email"
            class="c-register-card__input"
            placeholder="seu@email.com"
            required
            autocomplete="email"
            @input="handleUpdateEmail"
          />
        </div>
      </div>

      <!-- Password Input -->
      <div class="c-register-card__form-group">
        <label for="register-password" class="c-register-card__label">
          <ion-icon :icon="lockClosedOutline" class="c-register-card__label-icon"></ion-icon>
          Senha
        </label>
        <div class="c-register-card__input-wrapper">
          <input
            id="register-password"
            :value="modelValue.password"
            type="password"
            class="c-register-card__input"
            placeholder="Mínimo 6 caracteres"
            required
            autocomplete="new-password"
            @input="handleUpdatePassword"
          />
        </div>
        <div v-if="modelValue.password" class="c-register-card__password-strength">
          <div class="c-register-card__strength-bar">
            <div
              class="c-register-card__strength-fill"
              :style="{ width: passwordStrength + '%' }"
            ></div>
          </div>
          <span class="c-register-card__strength-text">{{ passwordStrengthLabel }}</span>
        </div>
      </div>

      <!-- Confirm Password Input -->
      <div class="c-register-card__form-group">
        <label for="register-confirm-password" class="c-register-card__label">
          <ion-icon :icon="checkmarkCircleOutline" class="c-register-card__label-icon"></ion-icon>
          Confirmar Senha
        </label>
        <div class="c-register-card__input-wrapper">
          <input
            id="register-confirm-password"
            :value="modelValue.confirmPassword"
            type="password"
            class="c-register-card__input"
            placeholder="Digite a senha novamente"
            required
            autocomplete="new-password"
            @input="handleUpdateConfirmPassword"
          />
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="c-register-card__error-message">
        <ion-icon :icon="alertCircle" class="c-register-card__error-icon"></ion-icon>
        <span>{{ error }}</span>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="c-register-card__success-message">
        <ion-icon :icon="checkmarkCircle" class="c-register-card__success-icon"></ion-icon>
        <span>{{ successMessage }}</span>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading || !isFormValid"
        class="c-register-card__submit-button"
      >
        <ion-spinner
          v-if="loading"
          name="crescent"
          class="c-register-card__button-spinner"
        ></ion-spinner>
        <span v-else>Criar Conta</span>
      </button>
    </form>

    <!-- Divider -->
    <div class="c-register-card__divider">
      <span class="c-register-card__divider-text">ou</span>
    </div>

    <!-- OAuth Button Slot -->
    <slot name="oauth"></slot>

    <!-- Login Link -->
    <button @click="$emit('login')" class="c-register-card__secondary-button">
      <ion-icon :icon="logInOutline" class="c-register-card__button-icon"></ion-icon>
      Já tenho uma conta
    </button>
  </article>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { IonIcon, IonSpinner } from '@ionic/vue';
  import {
    alertCircle,
    checkmarkCircle,
    personOutline,
    mailOutline,
    lockClosedOutline,
    checkmarkCircleOutline,
    logInOutline,
  } from 'ionicons/icons';

  interface RegisterForm {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  const props = defineProps<{
    modelValue: RegisterForm;
    error: string;
    successMessage: string;
    loading: boolean;
  }>();

  const emit = defineEmits<{
    'update:modelValue': [form: RegisterForm];
    submit: [];
    login: [];
  }>();

  const passwordStrength = computed(() => {
    const password = props.modelValue.password;
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;

    return Math.min(strength, 100);
  });

  const passwordStrengthLabel = computed(() => {
    const strength = passwordStrength.value;
    if (strength < 40) return 'Fraca';
    if (strength < 70) return 'Média';
    return 'Forte';
  });

  const isFormValid = computed(() => {
    const form = props.modelValue;
    return (
      form.name.length > 0 &&
      form.email.length > 0 &&
      form.password.length >= 6 &&
      form.password === form.confirmPassword
    );
  });

  const handleUpdateName = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', { ...props.modelValue, name: target.value });
  };

  const handleUpdateEmail = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', { ...props.modelValue, email: target.value });
  };

  const handleUpdatePassword = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', { ...props.modelValue, password: target.value });
  };

  const handleUpdateConfirmPassword = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', { ...props.modelValue, confirmPassword: target.value });
  };
</script>

<style scoped lang="scss">
  /* ====================================
   REGISTER CARD - Form Section
   ==================================== */

  .c-register-card {
    width: 100%;
    background: rgba(30, 41, 59, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 2rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
    animation: fadeInUp 0.6s ease-out 0.2s backwards;

    &__header {
      margin-bottom: 2rem;
      text-align: center;
    }

    &__title {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin: 0 0 0.5rem 0;
    }

    &__subtitle {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.5);
      margin: 0;
    }

    /* Form */
    &__form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    &__form-group {
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
      color: rgba(255, 255, 255, 0.9);
      letter-spacing: 0.3px;
    }

    &__label-icon {
      font-size: 1rem;
      color: #6366f1;
    }

    &__input-wrapper {
      position: relative;
    }

    &__input {
      width: 100%;
      padding: 0.875rem 1rem;
      background: rgba(15, 23, 42, 0.6);
      border: 1.5px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: white;
      font-size: 0.938rem;
      transition: all 0.3s ease;
      outline: none;

      &::placeholder {
        color: rgba(255, 255, 255, 0.3);
      }

      &:focus {
        border-color: #6366f1;
        background: rgba(15, 23, 42, 0.8);
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
      }
    }

    /* Password Strength */
    &__password-strength {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.25rem;
    }

    &__strength-bar {
      flex: 1;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      overflow: hidden;
    }

    &__strength-fill {
      height: 100%;
      background: linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #10b981 100%);
      transition: width 0.3s ease;
      border-radius: 2px;
    }

    &__strength-text {
      font-size: 0.75rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.6);
      min-width: 50px;
    }

    /* Messages */
    &__error-message {
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

    &__error-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    &__success-message {
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

    &__success-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    /* Buttons */
    &__submit-button {
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
    }

    &__button-spinner {
      font-size: 1.25rem;
    }

    /* Divider */
    &__divider {
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
        background: rgba(255, 255, 255, 0.1);
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

    /* Secondary Button */
    &__secondary-button {
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
      margin-top: 1rem;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);
      }
    }

    &__button-icon {
      font-size: 1.125rem;
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

  /* Responsive */
  @media (max-width: 640px) {
    .c-register-card {
      padding: 1.5rem;
    }

    .c-register-card__title {
      font-size: 1.25rem;
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
