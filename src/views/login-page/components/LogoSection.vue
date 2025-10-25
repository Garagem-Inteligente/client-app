<template>
  <div class="logo-section">
    <div class="logo-wrapper">
      <div class="logo-glow"></div>
      <ion-icon :icon="car" class="logo-icon"></ion-icon>
    </div>
    <h1 class="brand-title">Garagem Inteligente</h1>
    <p class="brand-subtitle">Gerencie seus veículos com inteligência</p>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { car } from 'ionicons/icons'
</script>

<style scoped lang="scss">
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
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .logo-section {
    animation-duration: 0.01ms !important;
  }
}
</style>
