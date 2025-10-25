<template>
  <div class="cost-breakdown">
    <slot></slot>
    <div class="cost-breakdown__separator"></div>
  </div>
</template>

<script setup lang="ts">
// Component para agrupar MCostItem components
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.cost-breakdown {
  @include flex-gap(0.75rem);
  flex-direction: column;

  &__separator {
    height: 1px;
    background: $color-bg-surface-hover;
  }
}
</style>
