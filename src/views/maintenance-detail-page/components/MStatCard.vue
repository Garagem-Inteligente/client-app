<template>
  <div :class="['stat-card', `stat-card-${variant}`]">
    <div class="stat-background"></div>
    <div class="stat-content-wrapper">
      <div :class="['stat-icon', `stat-icon-${variant}`]">
        <ion-icon :icon="icon"></ion-icon>
      </div>
      <div class="stat-details">
        <p class="stat-label">{{ label }}</p>
        <h3 class="stat-value" :class="{ 'stat-value-sm': isSmall }">
          {{ value }}
        </h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'

withDefaults(
  defineProps<{
    label: string
    value: string
    icon: unknown
    variant?: 'blue' | 'purple' | 'green' | 'yellow'
    isSmall?: boolean
  }>(),
  {
    variant: 'blue',
    isSmall: false,
  },
)
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.stat-card {
  position: relative;
  padding: $spacing-2xl;
  border-radius: $radius-xl;
  overflow: hidden;
  @include card-hover;
  @include smooth-transition;

  > .stat-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.1;
    background: $gradient-background-overlay;
  }

  &-blue {
    background: $gradient-blue;
  }

  &-purple {
    background: $gradient-purple;
  }

  &-green {
    background: $gradient-green;
  }

  &-yellow {
    background: $gradient-yellow;
  }
}

.stat-content-wrapper {
  position: relative;
  z-index: 1;
  @include flex-gap($spacing-lg);
  align-items: center;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: $radius-lg;
  @include flex-center;
  font-size: 1.75rem;
  flex-shrink: 0;
  box-shadow: $shadow-md;
  color: $color-text-primary;

  &-blue {
    @include icon-gradient($gradient-blue-icon);
  }

  &-purple {
    @include icon-gradient($gradient-purple-icon);
  }

  &-green {
    @include icon-gradient($gradient-green-icon);
  }

  &-yellow {
    @include icon-gradient($gradient-yellow-icon);
  }
}

.stat-details {
  flex: 1;
  @include flex-gap($spacing-xs);
  flex-direction: column;
}

.stat-label {
  @include label-uppercase;
  margin: 0;
}

.stat-value {
  @include heading-primary;
  font-size: 1.5rem;
  margin: 0;

  &-sm {
    font-size: $font-size-lg;
  }
}
</style>
