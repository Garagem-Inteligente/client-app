<template>
  <div class="changelog-content">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// Componente container para changelog
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.changelog-content {
  padding: 16px;

  @media (max-width: 480px) {
    padding: 16px;
  }
}
</style>
