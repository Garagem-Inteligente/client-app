<template>
  <div class="quick-stats">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// Componente container para quick stats
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.quick-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}
</style>
