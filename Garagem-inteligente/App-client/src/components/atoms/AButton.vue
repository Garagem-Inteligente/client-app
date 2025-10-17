<template>
  <ion-button
    :expand="expand"
    :fill="fill"
    :size="size"
    :color="color"
    :disabled="disabled"
    :strong="strong"
    @click="$emit('click', $event)"
  >
    <slot />
  </ion-button>
</template>

<script setup lang="ts">
import { IonButton } from '@ionic/vue'

interface Props {
  expand?: 'block' | 'full'
  fill?: 'clear' | 'outline' | 'solid' | 'default'
  size?: 'small' | 'default' | 'large'
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark'
  disabled?: boolean
  strong?: boolean
}

withDefaults(defineProps<Props>(), {
  expand: undefined,
  fill: 'solid',
  size: 'default',
  color: 'primary',
  disabled: false,
  strong: false
})

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

