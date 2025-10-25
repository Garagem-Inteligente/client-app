<template>
  <div class="page-layout">
    <slot />
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
.page-layout {
  position: relative;
  min-height: 100vh;
  width: 100%;
}

.page-layout::before,
.page-layout::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.page-layout::before {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  z-index: -2;
}

.page-layout::after {
  background-image:
    radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  z-index: -1;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .page-layout::before,
  .page-layout::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
