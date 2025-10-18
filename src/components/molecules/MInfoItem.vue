<template>
  <div class="info-item" :class="{ '-highlight': highlight }">
    <div class="icon-wrapper" :class="{ '-highlight': highlight }">
      <ion-icon :icon="icon"></ion-icon>
    </div>
    <div class="content">
      <span class="label">{{ label }}</span>
      <span class="value">{{ value }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'

interface Props {
  icon: string
  label: string
  value: string | number
  highlight?: boolean
}

withDefaults(defineProps<Props>(), {
  highlight: false
})
</script>

<style scoped>
/* ====================================
   INFO ITEM - RSCSS PATTERN
   Component: info-item
   ==================================== */

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(17, 24, 39, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.info-item:hover {
  background: rgba(31, 41, 55, 0.7);
  border-color: rgba(129, 140, 248, 0.3);
  transform: translateY(-2px);
}

/* Variant: -highlight */
.info-item.-highlight {
  background: linear-gradient(135deg, rgba(129, 140, 248, 0.1) 0%, rgba(102, 126, 234, 0.05) 100%);
  border-color: rgba(129, 140, 248, 0.3);
}

.info-item.-highlight:hover {
  background: linear-gradient(135deg, rgba(129, 140, 248, 0.15) 0%, rgba(102, 126, 234, 0.08) 100%);
  border-color: rgba(129, 140, 248, 0.5);
}

/* Element: icon-wrapper */
.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  min-width: 2.5rem;
  border-radius: 10px;
  background: rgba(129, 140, 248, 0.15);
  border: 1px solid rgba(129, 140, 248, 0.3);
  transition: all 0.3s ease;
}

.icon-wrapper ion-icon {
  font-size: 1.25rem;
  color: rgba(129, 140, 248, 0.9);
}

.info-item:hover .icon-wrapper {
  background: rgba(129, 140, 248, 0.25);
  border-color: rgba(129, 140, 248, 0.5);
  transform: scale(1.1);
}

/* Variant: icon-wrapper -highlight */
.icon-wrapper.-highlight {
  background: linear-gradient(135deg, rgba(129, 140, 248, 0.3) 0%, rgba(102, 126, 234, 0.2) 100%);
  border-color: rgba(129, 140, 248, 0.5);
}

.icon-wrapper.-highlight ion-icon {
  color: rgba(147, 197, 253, 1);
}

/* Element: content */
.content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
}

/* Element: label */
.label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(156, 163, 175, 1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Element: value */
.value {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  word-break: break-word;
}
</style>
