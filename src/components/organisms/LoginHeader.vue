<template>
  <section class="c-login-header" aria-labelledby="brand-title">
    <div class="c-login-header__logo-wrapper">
      <div class="c-login-header__logo-glow" aria-hidden="true"></div>
      <ion-icon :icon="car" class="c-login-header__logo-icon" aria-hidden="true"></ion-icon>
    </div>
    <h1 id="brand-title" class="c-login-header__title">Garagem Inteligente</h1>
    <p class="c-login-header__subtitle">Gerencie seus veículos com inteligência</p>
  </section>
</template>

<script setup lang="ts">
  import { IonIcon } from '@ionic/vue';
  import { car } from 'ionicons/icons';
</script>

<style lang="scss" scoped>
  $color-primary: #6366f1;
  $color-primary-dark: #8b5cf6;
  $color-text-secondary: rgba(255, 255, 255, 0.6);

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

  @keyframes logoGlow {
    0%,
    100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.1);
    }
  }

  // ====================================
  // LOGIN HEADER (Logo Section)
  // ====================================

  .c-login-header {
    text-align: center;
    margin-bottom: 3rem;
    animation: fadeInDown 0.6s ease-out;

    &__logo-wrapper {
      position: relative;
      display: inline-block;
      margin-bottom: 1.5rem;
    }

    &__logo-glow {
      position: absolute;
      inset: -20px;
      background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
      border-radius: 50%;
      filter: blur(30px);
      opacity: 0.4;
      animation: logoGlow 3s ease-in-out infinite;
      pointer-events: none;
    }

    &__logo-icon {
      font-size: 4rem;
      color: $color-primary;
      position: relative;
      z-index: 2;
      filter: drop-shadow(0 8px 16px rgba(99, 102, 241, 0.4));
    }

    &__title {
      font-size: 2rem;
      font-weight: 700;
      background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.5px;
    }

    &__subtitle {
      font-size: 0.938rem;
      color: $color-text-secondary;
      margin: 0;
      font-weight: 400;
    }
  }

  @media (max-width: 640px) {
    .c-login-header__title {
      font-size: 1.75rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .c-login-header {
      animation: none;
    }

    .c-login-header__logo-glow {
      animation: none;
    }
  }
</style>
