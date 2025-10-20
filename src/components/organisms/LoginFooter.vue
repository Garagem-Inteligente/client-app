<template>
  <footer class="c-login-footer">
    <p class="c-login-footer__text">
      Ao continuar, você concorda com nossos
      <a href="#" class="c-login-footer__link">Termos de Uso</a> e
      <RouterLink to="/privacy-policy" class="c-login-footer__link"
        >Política de Privacidade</RouterLink
      >
    </p>
    <p class="c-login-footer__version">
      Versão: {{ shortVersion }} | Build: {{ version.buildNumber }} | SHA: {{ shortSha }}
    </p>
  </footer>
</template>

<script setup lang="ts">
  import { useVersion } from '@/composables/useVersion';

  const { shortVersion, shortSha, version } = useVersion();
</script>

<style lang="scss" scoped>
  $color-primary: #6366f1;
  $color-primary-dark: #8b5cf6;

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

  // ====================================
  // LOGIN FOOTER
  // ====================================

  .c-login-footer {
    margin-top: 2rem;
    text-align: center;
    animation: fadeInUp 0.6s ease-out 0.4s backwards;

    &__text {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.4);
      line-height: 1.6;
      margin: 0 0 0.5rem 0;
    }

    &__version {
      font-size: 0.75rem;
      color: #a3e635;
      margin-top: 0.5rem;
      font-weight: 600;
      letter-spacing: 0.02em;
    }

    &__link {
      color: $color-primary;
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: $color-primary-dark;
        text-decoration: underline;
      }

      &:focus-visible {
        outline: 2px solid $color-primary;
        outline-offset: 2px;
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .c-login-footer {
      animation: none;
    }
  }
</style>
