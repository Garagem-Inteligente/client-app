<template>
  <ion-card :class="cardClass">
    <ion-card-header v-if="$slots.header || $slots.title || title || subtitle">
      <slot name="header">
        <ion-card-title v-if="$slots.title || title">
          <slot name="title">{{ title }}</slot>
        </ion-card-title>
        <ion-card-subtitle v-if="subtitle">{{ subtitle }}</ion-card-subtitle>
      </slot>
    </ion-card-header>

    <ion-card-content>
      <slot />
    </ion-card-content>

    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </ion-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue'

interface Props {
  title?: string
  subtitle?: string
  variant?: 'default' | 'elevated' | 'outlined'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const cardClass = computed(() => {
  return `card-${props.variant}`
})
</script>

<style scoped>
.card-elevated {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.card-outlined {
  border: 1px solid var(--ion-color-light);
}

.card-footer {
  padding: 0 16px 16px;
  border-top: 1px solid var(--ion-color-light);
  padding-top: 16px;
}
</style>

