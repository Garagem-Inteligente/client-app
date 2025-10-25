<template>
  <div class="timeline-item" :class="{ 'timeline-item--last': isLast }">
    <div class="timeline-item__dot"></div>
    <div class="timeline-item__content">
      <p class="timeline-item__title">{{ title }}</p>
      <p class="timeline-item__date">{{ date }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  date: string
  isLast?: boolean
}

withDefaults(defineProps<Props>(), {
  isLast: false,
})
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.timeline-item {
  position: relative;
  padding-bottom: 1.5rem;
  padding-left: 2rem;

  &--last {
    padding-bottom: 0;

    &::before {
      display: none;
    }
  }

  &::before {
    content: '';
    position: absolute;
    left: -1.625rem;
    top: 1rem;
    bottom: -0.5rem;
    width: 2px;
    background: $color-bg-surface-hover;
  }

  &__dot {
    position: absolute;
    left: -2rem;
    top: $spacing-sm;
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    background: $color-primary;
    border: 2px solid $color-bg-surface;
  }

  &__content {
    padding-left: $spacing-md;
  }

  &__title {
    color: $color-text-primary;
    font-weight: $font-weight-medium;
    margin: 0 0 $spacing-sm 0;
  }

  &__date {
    color: $color-text-tertiary;
    font-size: $font-size-sm;
    margin: 0;
  }
}
</style>
