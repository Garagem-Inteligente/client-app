<template>
  <button class="setting-item" @click="$emit('click')">
    <div class="setting-icon-wrapper" :class="`icon-${iconVariant}`">
      <ion-icon :icon="icon"></ion-icon>
    </div>
    <div class="setting-content">
      <span class="setting-title">{{ title }}</span>
      <span class="setting-description">{{ description }}</span>
    </div>
    <div v-if="badge" class="setting-end">
      <span class="badge">{{ badge }}</span>
    </div>
    <ion-icon :icon="chevronForwardOutline" class="setting-arrow"></ion-icon>
  </button>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { chevronForwardOutline } from 'ionicons/icons'

interface Props {
  title: string
  description: string
  icon: string
  iconVariant?: 'primary' | 'tertiary' | 'warning' | 'success' | 'medium' | 'info'
  badge?: string
}

withDefaults(defineProps<Props>(), {
  iconVariant: 'primary',
})

defineEmits<{
  click: []
}>()
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.setting-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all $transition-base;
  width: 100%;
  text-align: left;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  &:active {
    background: rgba(255, 255, 255, 0.05);
  }
}

.setting-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;

  &.icon-primary {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
  }

  &.icon-tertiary {
    background: rgba(168, 85, 247, 0.15);
    color: #a855f7;
  }

  &.icon-warning {
    background: rgba(251, 191, 36, 0.15);
    color: #fbbf24;
  }

  &.icon-success {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
  }

  &.icon-medium {
    background: rgba(156, 163, 175, 0.15);
    color: #9ca3af;
  }

  &.icon-info {
    background: rgba(99, 102, 241, 0.15);
    color: #6366f1;
  }
}

.setting-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.setting-title {
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.setting-description {
  font-size: 13px;
  color: #9ca3af;
}

.setting-end {
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge {
  font-size: 12px;
  color: #10b981;
  background: rgba(16, 185, 129, 0.15);
  padding: 4px 8px;
  border-radius: 8px;
  font-weight: 600;
}

.setting-arrow {
  font-size: 20px;
  color: #6b7280;
}
</style>
