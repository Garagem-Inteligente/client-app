<template>
  <ion-page>
    <PageLayout>
      <ion-content :fullscreen="true" class="auth-content">
        <div class="page-content-wrapper login-container">
          <!-- Logo Section -->
          <LogoSection />

          <!-- Login Card -->
          <AuthCard @register-click="handleRegisterClick" />

          <!-- Footer -->
          <AuthFooter />
        </div>
      </ion-content>
    </PageLayout>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import LogoSection from '@/components/organisms/LogoSection.vue'
import AuthCard from '@/components/organisms/AuthCard.vue'
import AuthFooter from '@/components/organisms/AuthFooter.vue'
import { PageLayout } from '@/components'
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




