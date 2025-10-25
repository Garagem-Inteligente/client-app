<template>
  <div class="cost-item" :class="{ 'cost-item--total': isTotal }">
    <div class="cost-item__label">
      <ion-icon :icon="icon" class="cost-item__icon"></ion-icon>
      <span>
        <slot></slot>
      </span>
    </div>
    <span class="cost-item__value">{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'

interface Props {
  icon: unknown
  value: string
  isTotal?: boolean
}

withDefaults(defineProps<Props>(), {
  isTotal: false,
})
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.cost-item {
  @include flex-gap($spacing-lg);
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md;
  background: $color-bg-surface;
  border-radius: $radius-sm;
  @include smooth-transition;

  &--total {
    background: linear-gradient(135deg, rgba($color-primary, 0.15) 0%, rgba($color-primary, 0.05) 100%);
    border: 1px solid rgba($color-primary, 0.3);
  }

  &__label {
    @include flex-gap($spacing-sm);
    align-items: center;
    color: $color-text-tertiary;
    font-size: $font-size-sm;

    &:has(.cost-item--total) {
      color: white;
      font-weight: $font-weight-bold;
    }
  }

  &__icon {
    font-size: 1.25rem;
  }

  &__value {
    color: $color-text-primary;
    font-weight: $font-weight-semibold;
    font-size: $font-size-base;
  }

  .cost-item--total & {
    &__label {
      color: white;
      font-weight: $font-weight-bold;
    }
  }
}
</style>
