<template>
  <div class="attachment-item" @click="$emit('view')">
    <ion-icon :icon="icon" class="attachment-item__icon"></ion-icon>
    <div class="attachment-item__info">
      <p class="attachment-item__name">{{ name }}</p>
      <p class="attachment-item__meta">{{ size }} • {{ date }}</p>
    </div>
    <ion-icon :icon="eyeOutline" class="attachment-item__view-icon"></ion-icon>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { eyeOutline } from 'ionicons/icons'

interface Props {
  name: string
  icon: unknown
  size: string
  date: string
}

defineProps<Props>()
defineEmits<{
  view: []
}>()
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.attachment-item {
  @include flex-gap($spacing-lg);
  align-items: center;
  padding: $spacing-md;
  background: $color-bg-surface;
  border-radius: $radius-sm;
  cursor: pointer;
  @include smooth-transition;

  &:hover {
    background: $color-bg-surface-hover;
  }

  &__icon {
    font-size: 2rem;
    color: $color-primary;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    color: $color-text-primary;
    font-weight: $font-weight-medium;
    margin: 0 0 $spacing-sm 0;
    @include text-ellipsis;
  }

  &__meta {
    color: $color-text-tertiary;
    font-size: $font-size-xs;
    margin: 0;
  }

  &__view-icon {
    color: $color-text-tertiary;
    font-size: 1.25rem;
  }
}
</style>
