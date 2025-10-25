<template>
  <div class="warranty-cards">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// Component para agrupar MWarrantyBadge components dentro de ACard
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.warranty-cards {
  @include grid-auto-fit(250px);
}
</style>
