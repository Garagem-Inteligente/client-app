<template>
  <div v-if="show" :class="alertClasses">
    <div class="alert-content">
      <ion-icon v-if="showIcon" :icon="alertIcon" class="alert-icon"></ion-icon>
      <div class="alert-text">
        <div v-if="title" class="alert-title">{{ title }}</div>
        <div class="alert-message">
          <slot />
        </div>
      </div>
      <ion-button v-if="closable" fill="clear" size="small" @click="handleClose">
        <ion-icon slot="icon-only" :icon="closeIcon"></ion-icon>
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonIcon, IonButton } from '@ionic/vue'
import {
  informationCircle,
  checkmarkCircle,
  alertCircle,
  warningOutline,
  close
} from 'ionicons/icons'

interface Props {
  show?: boolean
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  closable?: boolean
  showIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
  type: 'info',
  closable: true,
  showIcon: true
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const alertClasses = computed(() => [
  'alert',
  `alert-${props.type}`
])

const alertIcon = computed(() => {
  switch (props.type) {
    case 'success':
      return checkmarkCircle
    case 'warning':
      return warningOutline
    case 'error':
      return alertCircle
    default:
      return informationCircle
  }
})

const closeIcon = close

const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  border-left: 4px solid;
}

.alert-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.alert-icon {
  font-size: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.alert-text {
  flex: 1;
}

.alert-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.alert-message {
  font-size: 0.875rem;
  line-height: 1.5;
}

.alert-info {
  background: rgba(var(--ion-color-primary-rgb), 0.1);
  border-color: var(--ion-color-primary);
}

.alert-info .alert-icon {
  color: var(--ion-color-primary);
}

.alert-success {
  background: rgba(var(--ion-color-success-rgb), 0.1);
  border-color: var(--ion-color-success);
}

.alert-success .alert-icon {
  color: var(--ion-color-success);
}

.alert-warning {
  background: rgba(var(--ion-color-warning-rgb), 0.1);
  border-color: var(--ion-color-warning);
}

.alert-warning .alert-icon {
  color: var(--ion-color-warning);
}

.alert-error {
  background: rgba(var(--ion-color-danger-rgb), 0.1);
  border-color: var(--ion-color-danger);
}

.alert-error .alert-icon {
  color: var(--ion-color-danger);
}
</style>

