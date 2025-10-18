<template>
  <ion-chip :color="color" :outline="outline">
    <ion-icon v-if="icon" :icon="icon"></ion-icon>
    <ion-label>
      <slot />
    </ion-label>
    <ion-icon v-if="closable" :icon="close" @click="$emit('close')"></ion-icon>
  </ion-chip>
</template>

<script setup lang="ts">
import { IonChip, IonIcon, IonLabel } from '@ionic/vue'
import { close } from 'ionicons/icons'

interface Props {
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark'
  outline?: boolean
  icon?: string
  closable?: boolean
}

withDefaults(defineProps<Props>(), {
  color: 'primary',
  outline: false,
  closable: false
})

defineEmits<{
  (e: 'close'): void
}>()
</script>

