<template>
  <div class="stat-item">
    <div class="stat-icon" :class="`stat-${variant}`">
      <ion-icon :icon="icon"></ion-icon>
    </div>
    <div class="stat-content">
      <span class="stat-value">{{ value }}</span>
      <span class="stat-label">{{ label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'

interface Props {
  label: string
  value: string | number
  icon: string
  variant?: 'primary' | 'success' | 'warning'
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
})
</script>

<style scoped lang="scss">
@use '@/theme/tokens' as *;

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: rgba(31, 41, 55, 0.6);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all $transition-base;
  animation: fadeInUp 0.6s ease-out backwards;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(31, 41, 55, 0.8);
    border-color: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
  }
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;

  &.stat-primary {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
  }

  &.stat-success {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
  }

  &.stat-warning {
    background: rgba(251, 191, 36, 0.15);
    color: #fbbf24;
  }
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  color: #9ca3af;
  margin-top: 4px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
