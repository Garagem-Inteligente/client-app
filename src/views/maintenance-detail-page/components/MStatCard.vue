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
.stat-card {
  position: relative;
  padding: 24px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }

  &-blue {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%);
  }

  &-purple {
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(147, 51, 234, 0.1) 100%);
  }

  &-green {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.1) 100%);
  }

  &-yellow {
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%);
  }
}

.stat-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
}

.stat-content-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  color: white;

  &-blue {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  }

  &-purple {
    background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
  }

  &-green {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }

  &-yellow {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  }
}

.stat-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  &-sm {
    font-size: 1.125rem;
  }
}
</style>
