<template>
  <ion-page class="c-login-page">
    <ion-content :fullscreen="true" class="c-login-page__content">
      <!-- Background layers -->
      <div class="c-login-page__bg-gradient" aria-hidden="true"></div>
      <div class="c-login-page__bg-pattern" aria-hidden="true"></div>

      <main class="c-login-page__main">
        <!-- Logo Section -->
        <LoginHeader />

        <!-- Login Card -->
        <LoginCard
          v-model="form"
          :error="error"
          :loading="loading"
          @submit="handleLogin"
          @forgot-password="handleForgotPassword"
          @register="$router.push('/register')"
        >
          <template #oauth>
            <GoogleSignInButton />
          </template>
        </LoginCard>

        <!-- Footer -->
        <LoginFooter />
      </main>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { IonPage, IonContent } from '@ionic/vue';
  import { useAuthStore } from '@/stores/auth';
  import { GoogleSignInButton } from '@/components';
  import LoginHeader from '@/components/organisms/LoginHeader.vue';
  import LoginCard from '@/components/organisms/LoginCard.vue';
  import LoginFooter from '@/components/organisms/LoginFooter.vue';

  const router = useRouter();
  const authStore = useAuthStore();

  const form = ref({
    email: '',
    password: '',
  });

  const loading = ref(false);
  const error = ref('');

  const handleLogin = async () => {
    loading.value = true;
    error.value = '';

    try {
      const success = await authStore.login(form.value.email, form.value.password);

      if (success) {
        const redirect = router.currentRoute.value.query.redirect as string;
        router.push(redirect || '/tabs/home');
      } else {
        error.value = authStore.error || 'Erro ao fazer login';
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado ao fazer login';
      error.value = errorMessage;
    } finally {
      loading.value = false;
    }
  };

  const handleForgotPassword = async () => {
    if (!form.value.email) {
      error.value = 'Digite seu email primeiro';
      return;
    }

    try {
      const success = await authStore.resetPassword(form.value.email);
      if (success) {
        error.value = '';
      } else {
        error.value = authStore.error || 'Erro ao enviar email de recuperação';
      }
    } catch (err) {
      console.error('Password reset error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado';
      error.value = errorMessage;
    }
  };
</script>

<style lang="scss" scoped>
  $color-primary: #6366f1;
  $color-primary-dark: #8b5cf6;

  // ====================================
  // PAGE COMPONENT
  // ====================================

  .c-login-page {
    &__content {
      background: linear-gradient(to bottom, #1e293b, #0f172a);
    }

    &__bg-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, #1e293b, #0f172a);
      pointer-events: none;
    }

    &__bg-pattern {
      position: absolute;
      inset: 0;
      background: url('/assets/pattern.svg');
      opacity: 0.1;
      pointer-events: none;
    }

    &__main {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 2rem 1.5rem;
      max-width: 480px;
      margin: 0 auto;
    }
  }

  // ====================================
  // RESPONSIVE
  // ====================================

  @media (max-width: 640px) {
    .c-login-page__main {
      padding: 1.5rem 1rem;
    }
  }

  @media (min-height: 800px) {
    .c-login-page__main {
      justify-content: flex-start;
      padding-top: 4rem;
    }
  }

  // ====================================
  // ACCESSIBILITY
  // ====================================

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  @media (prefers-color-scheme: dark) {
    .c-login-page__content {
      background: linear-gradient(to bottom, #1e293b, #0f172a);
    }
  }

  @media (prefers-contrast: more) {
    .c-login-page__content {
      background: linear-gradient(to bottom, #0f1419, #000000);
    }
  }
</style>
