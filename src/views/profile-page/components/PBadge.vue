<template>
  <div class="badge" :class="`badge-${variant}`">
    <ion-icon v-if="icon" :icon="icon"></ion-icon>
    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'

interface Props {
  label: string
  icon?: string
  variant?: 'primary' | 'success'
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
})
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  transition: all $transition-base;

  ion-icon {
    font-size: 16px;
  }

  &.badge-primary {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.3);

    &:hover {
      background: rgba(59, 130, 246, 0.25);
      border-color: rgba(59, 130, 246, 0.5);
    }
  }

  &.badge-success {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.3);

    &:hover {
      background: rgba(16, 185, 129, 0.25);
      border-color: rgba(16, 185, 129, 0.5);
    }
  }
}
</style>
