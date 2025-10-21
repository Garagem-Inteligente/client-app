<template>
  <section class="c-register-header">
    <div class="c-register-header__wrapper">
      <div class="c-register-header__logo">
        <div class="c-register-header__logo-glow"></div>
        <ion-icon :icon="car" class="c-register-header__logo-icon"></ion-icon>
      </div>

      <h1 class="c-register-header__title">Criar Conta</h1>
      <p class="c-register-header__subtitle">Junte-se à Garagem Inteligente</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
import { car } from "ionicons/icons";
</script>

<style scoped lang="scss">
/* ====================================
   REGISTER HEADER - Logo & Title
   ==================================== */

.c-register-header {
  text-align: center;
  margin-bottom: 2.5rem;

  &__wrapper {
    animation: fadeInDown 0.6s ease-out;
  }

  &__logo {
    position: relative;
    display: inline-block;
    margin-bottom: 1.5rem;
  }

  &__logo-glow {
    position: absolute;
    inset: -20px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    border-radius: 50%;
    filter: blur(30px);
    opacity: 0.4;
    animation: logoGlow 3s ease-in-out infinite;
  }

  &__logo-icon {
    font-size: 4rem;
    color: #6366f1;
    position: relative;
    z-index: 2;
    filter: drop-shadow(0 8px 16px rgba(99, 102, 241, 0.4));
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.5px;
  }

  &__subtitle {
    font-size: 0.938rem;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
    font-weight: 400;
  }
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

/* Responsive */
@media (max-width: 640px) {
  .c-register-header__title {
    font-size: 1.75rem;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
</style>
