<template>
  <ion-page>
    <ion-content :fullscreen="true" class="auth-content">
      <!-- Background Gradient -->
      <div class="background-gradient"></div>
      <div class="background-pattern"></div>

      <div class="page-content-wrapper login-container">
        <!-- Logo Section -->
        <LogoSection />

        <!-- Login Card -->
        <AuthCard @register-click="handleRegisterClick" />

        <!-- Footer -->
        <AuthFooter />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import LogoSection from '@/components/organisms/LogoSection.vue'
import AuthCard from '@/components/organisms/AuthCard.vue'
import AuthFooter from '@/components/organisms/AuthFooter.vue'
import { useAuthNavigation } from '@/composables/useAuthNavigation'

const { navigateToRegister } = useAuthNavigation()

const handleRegisterClick = async () => {
  await navigateToRegister()
}
</script>

<style scoped lang="scss">
/* ====================================
   MODERN LOGIN PAGE - RSCSS Structure
   ==================================== */

/* Base Component */
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--space-2xl) var(--space-lg);
  max-width: 480px;
  margin: 0 auto;

  /* Responsive */
  @media (max-width: 640px) {
    padding: var(--space-xl) var(--space-md);
  }

  @media (min-height: 800px) {
    justify-content: flex-start;
    padding-top: calc(var(--space-2xl) * 2);
  }
}

/* Background Elements */
.background-gradient {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  z-index: -2;
}

.background-pattern {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  z-index: -1;
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




