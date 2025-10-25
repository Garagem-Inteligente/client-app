<template>
  <div :class="['info-box', { 'info-box-full-width': fullWidth }]">
    <div v-if="$slots.header" class="info-box-header">
      <slot name="header"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  fullWidth?: boolean
}

withDefaults(defineProps<Props>(), {
  fullWidth: false,
})
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.info-box {
  @include info-box-base;
  @include card-hover;
  @include smooth-transition;

  &-full-width {
    grid-column: 1 / -1;
  }

  > .info-box-header {
    @include flex-gap($spacing-md);
    align-items: center;
    margin-bottom: $spacing-md;
  }
}
</style>