<template>
  <div :class="spinnerClasses">
    <ion-spinner :name="name" :color="color"></ion-spinner>
    <p v-if="text" class="spinner-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonSpinner } from '@ionic/vue'

interface Props {
  name?: 'lines' | 'lines-small' | 'dots' | 'bubbles' | 'circles' | 'crescent'
  color?: string
  text?: string
  centered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  name: 'crescent',
  color: 'primary',
  centered: false
})

const spinnerClasses = computed(() => [
  'spinner-container',
  { 'spinner-centered': props.centered }
])
</script>

<style scoped>
.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.spinner-centered {
  justify-content: center;
  min-height: 200px;
}

.spinner-text {
  color: var(--ion-color-medium);
  font-size: 0.875rem;
  margin: 0;
}
</style>

