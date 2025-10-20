<template>
  <ion-modal
    :is-open="isOpen"
    @didDismiss="handleDismiss"
    :initial-breakpoint="1"
    :breakpoints="[0, 1]"
    class="confirm-modal"
  >
    <div class="modal-content">
      <!-- Icon -->
      <div class="modal-icon" :class="`icon-${variant}`">
        <ion-icon :icon="modalIcon" />
      </div>

      <!-- Title -->
      <h2 class="modal-title">{{ title }}</h2>

      <!-- Message -->
      <p class="modal-message">{{ message }}</p>

      <!-- Details List (optional) -->
      <div v-if="details && details.length > 0" class="modal-details">
        <div v-for="(detail, index) in details" :key="index" class="detail-item">
          <ion-icon :icon="checkmarkCircleOutline" class="detail-icon" />
          <span>{{ detail }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="modal-actions">
        <AButton
          v-if="showCancel"
          expand="block"
          fill="outline"
          color="medium"
          @click="handleCancel"
          class="cancel-button"
        >
          {{ cancelText }}
        </AButton>
        <AButton
          expand="block"
          :color="buttonColor"
          @click="handleConfirm"
          class="confirm-button"
        >
          {{ confirmText }}
        </AButton>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonModal, IonIcon } from '@ionic/vue'
import {
  warningOutline,
  trashOutline,
  informationCircleOutline,
  checkmarkCircleOutline,
  swapHorizontalOutline
} from 'ionicons/icons'
import { AButton } from '@/components'

interface Props {
  isOpen: boolean
  title: string
  message: string
  details?: string[]
  variant?: 'warning' | 'danger' | 'info' | 'success' | 'transfer'
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  confirmColor?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'tertiary' | 'light' | 'medium' | 'dark'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  showCancel: true,
  confirmColor: 'primary'
})

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'update:isOpen', value: boolean): void
}>()

const modalIcon = computed(() => {
  switch (props.variant) {
    case 'warning':
      return warningOutline
    case 'danger':
      return trashOutline
    case 'success':
      return checkmarkCircleOutline
    case 'transfer':
      return swapHorizontalOutline
    default:
      return informationCircleOutline
  }
})

const buttonColor = computed(() => {
  return props.confirmColor
})

const handleConfirm = () => {
  emit('confirm')
  emit('update:isOpen', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:isOpen', false)
}

const handleDismiss = () => {
  emit('update:isOpen', false)
}
</script>

<style scoped>
.confirm-modal {
  --backdrop-opacity: 0.6;
  --background: transparent;
}

.confirm-modal::part(content) {
  backdrop-filter: blur(4px);
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
}


.modal-content {
  background: linear-gradient(135deg, #1a1f2e 0%, #151922 100%);
  border-radius: 24px 24px 0 0;
  padding: 32px 24px 24px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* Icon Styles */
.modal-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  position: relative;
  animation: pulse 2s infinite;
}

.modal-icon ion-icon {
  font-size: 40px;
  color: white;
  z-index: 2;
}

/* Icon variants with gradients */
.icon-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.3);
}

.icon-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
}

.icon-info {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
}

.icon-success {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
}

.icon-transfer {
  background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
  box-shadow: 0 8px 24px rgba(168, 85, 247, 0.3);
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
}

/* Text Styles */
.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 12px;
  line-height: 1.3;
}

.modal-message {
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 24px;
  line-height: 1.6;
  max-width: 400px;
}

/* Details List */
.modal-details {
  width: 100%;
  max-width: 400px;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  text-align: left;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
  line-height: 1.5;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-icon {
  font-size: 20px;
  color: #22c55e;
  flex-shrink: 0;
  margin-top: 2px;
}

/* Actions */
.modal-actions {
  width: 100%;
  max-width: 400px;
  display: flex;
  gap: 12px;
  margin-top: auto;
}

.cancel-button,
.confirm-button {
  flex: 1;
  font-weight: 600;
  height: 48px;
  font-size: 1rem;
}

.cancel-button {
  --border-width: 2px;
}

/* Responsive */
@media (min-width: 768px) {
  .confirm-modal::part(content) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-content {
    border-radius: 24px;
    max-width: 480px;
    min-height: auto;
    padding: 40px 32px 32px;
  }
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .modal-content {
    background: linear-gradient(135deg, #1a1f2e 0%, #151922 100%);
  }
}

@media (prefers-color-scheme: light) {
  .modal-content {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  }
  
  .modal-title {
    color: #1e293b;
  }
  
  .modal-message {
    color: rgba(30, 41, 59, 0.8);
  }
  
  .detail-item {
    color: rgba(30, 41, 59, 0.9);
  }
  
  .modal-details {
    background: rgba(30, 41, 59, 0.05);
  }
}
</style>
