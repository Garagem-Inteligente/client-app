<template>
  <div class="register-logo-section">
    <div class="logo-wrapper">
      <div class="logo-glow"></div>
      <ion-icon :icon="car" class="logo-icon"></ion-icon>
    </div>
    <h1 class="brand-title">Criar Conta</h1>
    <p class="brand-subtitle">Junte-se à Garagem Inteligente</p>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { car } from 'ionicons/icons'
</script>

<style scoped lang="scss">
.register-logo-section {
  text-align: center;
  margin-bottom: 2.5rem;
  animation: fadeInDown 0.6s ease-out;

  .logo-wrapper {
    position: relative;
    display: inline-block;
    margin-bottom: 1.5rem;

    .logo-glow {
      position: absolute;
      inset: -20px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      border-radius: 50%;
      filter: blur(30px);
      opacity: 0.4;
      animation: logoGlow 3s ease-in-out infinite;
    }

    .logo-icon {
      font-size: 4rem;
      color: #6366f1;
      position: relative;
      z-index: 2;
      filter: drop-shadow(0 8px 16px rgba(99, 102, 241, 0.4));
    }
  }

  .brand-title {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.5px;
  }

  .brand-subtitle {
    font-size: 0.938rem;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
    font-weight: 400;
  }
}

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

@media (max-width: 640px) {
  .register-logo-section {
    .brand-title {
      font-size: 1.75rem;
    }

    .logo-icon {
      font-size: 3.5rem;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .register-logo-section,
  .register-logo-section *,
  .register-logo-section *::before,
  .register-logo-section *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>