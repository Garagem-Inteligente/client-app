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
  import { computed } from 'vue';
  import { IonCard, IonCardContent, IonIcon } from '@ionic/vue';
  import { trendingUp, trendingDown } from 'ionicons/icons';

  interface Props {
    label: string;
    value: string | number;
    subtitle?: string;
    icon?: string;
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    trend?: string;
    trendDirection?: 'up' | 'down';
    clickable?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    color: 'primary',
    clickable: false,
  });

  defineEmits<{
    (e: 'click'): void;
  }>();

  const cardClass = computed(() => ({
    'stat-card-clickable': props.clickable,
    [`stat-card-${props.color}`]: true,
  }));

  const iconClasses = computed(() => ['stat-icon-wrapper', `stat-icon-${props.color}`]);

  const trendClass = computed(() => {
    if (!props.trendDirection) return '';
    return props.trendDirection === 'up' ? 'trend-up' : 'trend-down';
  });

  const trendIcon = computed(() => {
    return props.trendDirection === 'up' ? trendingUp : trendingDown;
  });
</script>

<style scoped>
  .stat-card {
    margin: 0;
    height: 100%;
    background: rgba(31, 41, 55, 0.75) !important;
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1.5px solid rgba(255, 255, 255, 0.12) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  /* Colored borders by type */
  .stat-card {
    &.stat-card-primary {
      border-color: rgba(96, 165, 250, 0.4) !important;
    }

    &.stat-card-secondary {
      border-color: rgba(168, 85, 247, 0.4) !important;
    }

    &.stat-card-success {
      border-color: rgba(74, 222, 128, 0.4) !important;
    }

    &.stat-card-warning {
      border-color: rgba(251, 146, 60, 0.4) !important;
    }

    &.stat-card-danger {
      border-color: rgba(239, 68, 68, 0.4) !important;
    }
  }

  .stat-card-clickable {
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .stat-card-clickable:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25) !important;
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
    color: rgba(255, 255, 255, 0.65);
    font-weight: 500;
    letter-spacing: 0.01em;
  }

  .stat-value {
    margin: 0 0 4px 0;
    font-size: 1.875rem;
    font-weight: 700;
    color: white;
    letter-spacing: -0.02em;
  }

  .stat-subtitle {
    margin: 0;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 0.01em;
  }

  .stat-icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s;
  }

  .stat-icon-wrapper ion-icon {
    font-size: 24px;
  }

  .stat-icon-primary {
    background: rgba(96, 165, 250, 0.15);
    color: #60a5fa;
  }

  .stat-icon-secondary {
    background: rgba(168, 85, 247, 0.15);
    color: #a855f7;
  }

  .stat-icon-success {
    background: rgba(74, 222, 128, 0.15);
    color: #4ade80;
  }

  .stat-icon-warning {
    background: rgba(251, 146, 60, 0.15);
    color: #fb923c;
  }

  .stat-icon-danger {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
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
