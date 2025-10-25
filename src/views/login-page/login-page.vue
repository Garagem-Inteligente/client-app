<template>
  <ion-page>
    <PageLayout>
      <ion-content :fullscreen="true" class="auth-content">
        <div class="page-content-wrapper login-container">
          <LogoSection />
          <AuthCard @register-click="handleRegisterClick" />
          <AuthFooter />
        </div>
      </ion-content>
    </PageLayout>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue'
import LogoSection from './components/LogoSection.vue'
import AuthCard from './components/AuthCard.vue'
import AuthFooter from './components/AuthFooter.vue'
import PageLayout from './components/PageLayout.vue'
import { useAuthNavigation } from '@/composables/useAuthNavigation'

const { navigateToRegister } = useAuthNavigation()

const handleRegisterClick = async () => {
  await navigateToRegister()
}
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--space-2xl) var(--space-lg);
  max-width: 480px;
  margin: 0 auto;

  @media (max-width: 640px) {
    padding: var(--space-xl) var(--space-md);
  }

  @media (min-height: 800px) {
    justify-content: flex-start;
    padding-top: calc(var(--space-2xl) * 2);
  }
}

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
