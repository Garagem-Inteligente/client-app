<template>
  <div class="register-auth-footer">
    <p class="footer-text">
      Ao criar uma conta, você concorda com nossos
      <a href="#" class="footer-link">Termos de Uso</a> e
      <RouterLink to="/privacy-policy" class="footer-link">Política de Privacidade</RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped lang="scss">
.register-auth-footer {
  margin-top: 2rem;
  text-align: center;
  animation: fadeInUp 0.6s ease-out 0.4s backwards;

  .footer-text {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.4);
    line-height: 1.6;
    margin: 0;

    .footer-link {
      color: #6366f1;
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: #8b5cf6;
        text-decoration: underline;
      }
    }
  }
}

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

@media (prefers-reduced-motion: reduce) {
  .register-auth-footer,
  .register-auth-footer *,
  .register-auth-footer *::before,
  .register-auth-footer *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>