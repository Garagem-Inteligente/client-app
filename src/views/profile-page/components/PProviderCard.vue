<template>
  <div class="provider-card">
    <div class="provider-header">
      <div class="provider-icon" :class="`icon-${iconVariant}`">
        <ion-icon :icon="icon"></ion-icon>
      </div>
      <div class="provider-info">
        <h3>{{ title }}</h3>
        <p>{{ subtitle }}</p>
      </div>
      <span class="provider-status" :class="`status-${statusVariant}`">
        {{ statusLabel }}
      </span>
    </div>
    <slot v-if="$slots.action" name="action"></slot>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'

interface Props {
  title: string
  subtitle: string
  icon: string
  iconVariant?: 'primary' | 'google'
  statusLabel: string
  statusVariant?: 'connected' | 'inactive'
}

withDefaults(defineProps<Props>(), {
  iconVariant: 'primary',
  statusVariant: 'inactive',
})
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.provider-card {
  background: rgba(31, 41, 55, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  transition: all $transition-base;

  &:hover {
    background: rgba(31, 41, 55, 0.7);
    border-color: rgba(255, 255, 255, 0.1);
  }
}

.provider-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

.provider-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 24px;

  &-primary {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
  }

  &-google {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
}

.provider-info {
  flex: 1;
  min-width: 0;

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: white;
    margin: 0 0 4px 0;
  }

  p {
    font-size: 14px;
    color: #9ca3af;
    margin: 0;
  }
}

.provider-status {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 12px;
  flex-shrink: 0;

  &-connected {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
  }

  &-inactive {
    background: rgba(156, 163, 175, 0.15);
    color: #9ca3af;
  }
}
</style>
