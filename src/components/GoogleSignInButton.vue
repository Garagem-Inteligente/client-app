<template>
  <button
    @click="handleGoogleSignIn"
    :disabled="loading"
    class="google-signin-button"
  >
    <div class="button-content">
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google logo"
        class="google-logo"
      />
      <span class="button-text">
        {{ loading ? 'Conectando...' : 'Continuar com Google' }}
      </span>
    </div>
    <ion-spinner v-if="loading" name="crescent" class="button-spinner"></ion-spinner>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonSpinner } from '@ionic/vue'

const loading = ref(false)

const handleGoogleSignIn = async () => {
  loading.value = true

  try {
    // TODO: Implement Google Sign-In
    // This will be implemented when Google Sign-In is set up
    console.log('Google Sign-In clicked - implementation pending')
  } catch (error) {
    console.error('Google Sign-In error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
@use '@/theme/variables.scss' as vars;

.google-signin-button {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: #ffffff;
  border: 1.5px solid #dadce0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-family: inherit;

  &:hover:not(:disabled) {
    background: #f8f9fa;
    border-color: #c4c7c5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .button-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    .google-logo {
      width: 18px;
      height: 18px;
    }

    .button-text {
      color: #3c4043;
      font-size: 0.938rem;
      font-weight: 500;
    }
  }

  .button-spinner {
    font-size: 1.25rem;
    color: #3c4043;
  }
}
</style>