<template>
  <div class="info-item" :class="{ 'info-item--full-width': fullWidth }">
    <div class="info-item__header">
      <ion-icon :icon="icon" class="info-item__icon" :class="`info-item__icon--${variant}`"></ion-icon>
      <span class="info-item__label">{{ label }}</span>
    </div>
    <p class="info-item__value">
      <slot></slot>
    </p>
    <p v-if="$slots.helper" class="info-item__helper">
      <slot name="helper"></slot>
    </p>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'

interface Props {
  label: string
  icon: unknown
  variant?: 'blue' | 'purple' | 'green' | 'yellow'
  fullWidth?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'blue',
  fullWidth: false,
})
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.info-item {
  @include info-box-base;
  @include smooth-transition;

  &:hover {
    border-color: rgba($color-primary, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  &--full-width {
    grid-column: 1 / -1;
  }

  &__header {
    @include flex-gap($spacing-md);
    align-items: center;
    margin-bottom: $spacing-md;
  }

  &__icon {
    font-size: 1.5rem;
    padding: $spacing-sm;
    border-radius: $radius-md;
    background: rgba(255, 255, 255, 0.05);

    &--blue {
      color: $color-primary;
      background: rgba($color-primary, 0.1);
    }

    &--purple {
      color: $color-secondary;
      background: rgba($color-secondary, 0.1);
    }

    &--green {
      color: $color-success;
      background: rgba($color-success, 0.1);
    }

    &--yellow {
      color: $color-warning;
      background: rgba($color-warning, 0.1);
    }
  }

  &__label {
    @include label-uppercase;
  }

  &__value {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    margin: 0;
    line-height: $line-height-snug;
  }

  &__helper {
    font-size: $font-size-sm;
    color: $color-text-muted;
    margin: $spacing-sm 0 0 0;
    font-weight: $font-weight-medium;
  }
}
</style>
