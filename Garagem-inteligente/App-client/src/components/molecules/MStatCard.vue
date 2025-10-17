<template>
  <ion-card class="stat-card" :class="cardClass" @click="$emit('click')">
    <ion-card-content>
      <div class="stat-header">
        <div class="stat-info">
          <p class="stat-label">{{ label }}</p>
          <h2 class="stat-value">{{ value }}</h2>
          <p v-if="subtitle" class="stat-subtitle">{{ subtitle }}</p>
        </div>
        <div v-if="icon" :class="iconClasses">
          <ion-icon :icon="icon"></ion-icon>
        </div>
      </div>
      
      <div v-if="trend" class="stat-trend" :class="trendClass">
        <ion-icon :icon="trendIcon"></ion-icon>
        <span>{{ trend }}</span>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonCard, IonCardContent, IonIcon } from '@ionic/vue'
import { trendingUp, trendingDown } from 'ionicons/icons'

interface Props {
  label: string
  value: string | number
  subtitle?: string
  icon?: string
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  trend?: string
  trendDirection?: 'up' | 'down'
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  clickable: false
})

defineEmits<{
  (e: 'click'): void
}>()

const cardClass = computed(() => ({
  'stat-card-clickable': props.clickable
}))

const iconClasses = computed(() => [
  'stat-icon-wrapper',
  `stat-icon-${props.color}`
])

const trendClass = computed(() => {
  if (!props.trendDirection) return ''
  return props.trendDirection === 'up' ? 'trend-up' : 'trend-down'
})

const trendIcon = computed(() => {
  return props.trendDirection === 'up' ? trendingUp : trendingDown
})
</script>

<style scoped>
.stat-card {
  margin: 0;
  height: 100%;
}

.stat-card-clickable {
  cursor: pointer;
  transition: transform 0.2s;
}

.stat-card-clickable:hover {
  transform: translateY(-2px);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.stat-info {
  flex: 1;
}

.stat-label {
  margin: 0 0 8px 0;
  font-size: 0.875rem;
  color: var(--ion-color-medium);
  font-weight: 500;
}

.stat-value {
  margin: 0 0 4px 0;
  font-size: 1.875rem;
  font-weight: bold;
  color: var(--ion-color-dark);
}

.stat-subtitle {
  margin: 0;
  font-size: 0.75rem;
  color: var(--ion-color-medium);
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-wrapper ion-icon {
  font-size: 24px;
}

.stat-icon-primary {
  background: rgba(var(--ion-color-primary-rgb), 0.1);
  color: var(--ion-color-primary);
}

.stat-icon-secondary {
  background: rgba(var(--ion-color-secondary-rgb), 0.1);
  color: var(--ion-color-secondary);
}

.stat-icon-success {
  background: rgba(var(--ion-color-success-rgb), 0.1);
  color: var(--ion-color-success);
}

.stat-icon-warning {
  background: rgba(var(--ion-color-warning-rgb), 0.1);
  color: var(--ion-color-warning);
}

.stat-icon-danger {
  background: rgba(var(--ion-color-danger-rgb), 0.1);
  color: var(--ion-color-danger);
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.trend-up {
  color: var(--ion-color-success);
}

.trend-down {
  color: var(--ion-color-danger);
}

.stat-trend ion-icon {
  font-size: 16px;
}
</style>

