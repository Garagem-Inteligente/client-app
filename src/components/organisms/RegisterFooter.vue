<template>
  <footer class="c-register-footer">
    <p class="c-register-footer__text">
      Ao criar uma conta, você concorda com nossos
      <a href="#" class="c-register-footer__link">Termos de Uso</a> e
      <RouterLink to="/privacy-policy" class="c-register-footer__link"
        >Política de Privacidade</RouterLink
      >
    </p>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style scoped lang="scss">
/* ====================================
   REGISTER FOOTER - Legal Links & Info
   ==================================== */

.c-register-footer {
  margin-top: 2rem;
  text-align: center;
  animation: fadeInUp 0.6s ease-out 0.4s backwards;

  &__text {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.4);
    line-height: 1.6;
    margin: 0;
  }

  &__link {
    color: #6366f1;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: #8b5cf6;
      text-decoration: underline;
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
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
</style>
