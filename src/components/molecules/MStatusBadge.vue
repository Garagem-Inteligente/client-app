<template>
  <div class="status-badge" :class="badgeClass">
    <ion-icon v-if="icon" :icon="icon" class="icon"></ion-icon>
    <span class="text">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonIcon } from '@ionic/vue'

type StatusType = 'success' | 'warning' | 'error' | 'info'

interface Props {
  status: StatusType
  icon?: string
  label: string
  pulse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  pulse: false
})

const badgeClass = computed(() => ({
  [`-${props.status}`]: true,
  '-pulse': props.pulse && props.status === 'error'
}))
</script>

<style scoped>
/* ====================================
   STATUS BADGE - RSCSS PATTERN
   Component: status-badge
   ==================================== */

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid;
  transition: all 0.3s ease;
}

/* Variant: -success */
.status-badge.-success {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
  border-color: rgba(34, 197, 94, 0.4);
}

.status-badge.-success .icon {
  color: #4ade80;
}

/* Variant: -warning */
.status-badge.-warning {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%);
  border-color: rgba(245, 158, 11, 0.4);
}

.status-badge.-warning .icon {
  color: #fb923c;
}

/* Variant: -error */
.status-badge.-error {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%);
  border-color: rgba(239, 68, 68, 0.4);
}

.status-badge.-error .icon {
  color: #f87171;
}

/* Variant: -info */
.status-badge.-info {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
  border-color: rgba(59, 130, 246, 0.4);
}

.status-badge.-info .icon {
  color: #60a5fa;
}

/* Removed pulse-error animation for better performance */
.status-badge.-pulse {
  border-color: rgba(239, 68, 68, 0.5);
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.05);
}

/* Element: icon */
.icon {
  font-size: 2rem;
}

/* Element: text */
.text {
  font-size: 1rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 0.3px;
}
</style>
