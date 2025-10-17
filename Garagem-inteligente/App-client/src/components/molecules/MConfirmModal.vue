<template>
  <ion-alert
    :is-open="isOpen"
    :header="title"
    :message="message"
    :buttons="alertButtons"
    @did-dismiss="handleDismiss"
  ></ion-alert>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonAlert } from '@ionic/vue'

interface Props {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmColor?: 'primary' | 'secondary' | 'danger' | 'warning'
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  confirmColor: 'danger'
})

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'update:isOpen', value: boolean): void
}>()

const alertButtons = computed(() => [
  {
    text: props.cancelText,
    role: 'cancel',
    handler: () => {
      emit('cancel')
      emit('update:isOpen', false)
    }
  },
  {
    text: props.confirmText,
    role: 'destructive',
    handler: () => {
      emit('confirm')
      emit('update:isOpen', false)
    }
  }
])

const handleDismiss = () => {
  emit('update:isOpen', false)
}
</script>

