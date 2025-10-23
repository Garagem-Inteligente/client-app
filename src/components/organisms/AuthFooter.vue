<template>
  <div class="auth-footer">
    <p class="footer-text">
      Ao continuar, você concorda com nossos
      <a href="#" class="footer-link">Termos de Uso</a> e
      <RouterLink to="/privacy-policy" class="footer-link">Política de Privacidade</RouterLink>
    </p>
    <p class="footer-text version-text">
      Versão: {{ shortVersion }} | Build: {{ version.buildNumber }} | SHA: {{ shortSha }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useVersion } from '@/composables/useVersion'

const { shortVersion, shortSha, version } = useVersion()
</script>

<style scoped lang="scss">
/* Footer Component */
.auth-footer {
  margin-top: var(--space-2xl);
  text-align: center;
  animation: fadeInUp 0.6s ease-out 0.4s backwards;

  .footer-text {
    font-size: calc(var(--font-size-xs) * 1.111);
    color: var(--text-placeholder);
    line-height: 1.6;
    margin: 0;

    &.version-text {
      margin-top: var(--space-xs);
    }

    .footer-link {
      color: var(--ion-color-primary);
      text-decoration: none;
      transition: var(--transition-fast);

      &:hover {
        color: var(--ion-color-secondary);
        text-decoration: underline;
      }
    }
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

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .auth-footer {
    animation-duration: 0.01ms !important;
  }
}
</style>