<template>
  <div class="warranty-badge">
    <div class="warranty-badge__header">
      <ion-icon :icon="icon" class="warranty-badge__icon"></ion-icon>
      <h4 class="warranty-badge__title">{{ title }}</h4>
    </div>
    <p class="warranty-badge__months">{{ months }} meses</p>
    <p class="warranty-badge__expiry">
      Válida até:
      <strong>{{ expiryDate }}</strong>
    </p>
    <div class="warranty-badge__status" :class="`warranty-badge__status--${statusVariant}`">
      {{ statusText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'

interface Props {
  title: string
  icon: unknown
  months: number
  expiryDate: string
  isValid: boolean
}

const props = defineProps<Props>()

const statusVariant = props.isValid ? 'active' : 'expired'
const statusText = props.isValid ? '✅ Ativa' : '❌ Expirada'
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.warranty-badge {
  @include flex-gap($spacing-lg);
  flex-direction: column;

  &__header {
    @include flex-gap($spacing-sm);
    align-items: center;
  }

  &__icon {
    font-size: 1.5rem;
    color: $color-success;
  }

  &__title {
    color: $color-text-primary;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    margin: 0;
  }

  &__months {
    color: $color-primary;
    font-size: 1.5rem;
    font-weight: $font-weight-bold;
    margin: 0 0 $spacing-sm 0;
  }

  &__expiry {
    color: $color-text-tertiary;
    font-size: $font-size-sm;
    margin: 0 0 $spacing-lg 0;

    & strong {
      color: $color-text-primary;
    }
  }

  &__status {
    padding: $spacing-sm $spacing-md;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    text-align: center;

    &--active {
      background: rgba($color-success, 0.1);
      color: $color-success;
      border: 1px solid rgba($color-success, 0.3);
    }

    &--expired {
      background: rgba($color-danger, 0.1);
      color: $color-danger;
      border: 1px solid rgba($color-danger, 0.3);
    }
  }
}
</style>
