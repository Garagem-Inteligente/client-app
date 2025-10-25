<template>
  <div class="feature-item">
    <ion-icon :icon="icon" color="success"></ion-icon>
    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'

interface Props {
  label: string
  icon: string
}

defineProps<Props>()
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(31, 41, 55, 0.5);
  border-radius: 12px;
  text-align: left;
  transition: all $transition-base;

  &:hover {
    background: rgba(31, 41, 55, 0.7);
    transform: translateX(4px);
  }

  ion-icon {
    font-size: 24px;
    color: #10b981;
    flex-shrink: 0;
  }

  span {
    font-size: 14px;
    color: #d1d5db;
  }
}
</style>
