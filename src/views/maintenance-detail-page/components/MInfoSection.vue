<template>
  <div class="info-section">
    <h4 class="info-section__title">{{ title }}</h4>
    <div class="info-section__grid">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.info-section {
  margin-bottom: 28px;

  &:last-child {
    margin-bottom: 0;
  }

  &__title {
    font-size: $font-size-xs;
    font-weight: $font-weight-bold;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: $color-primary;
    margin: 0 0 $spacing-lg 0;
    padding-bottom: $spacing-sm;
    border-bottom: 2px solid rgba($color-primary, 0.2);
  }

  &__grid {
    @include grid-auto-fit(240px);
  }
}
</style>
