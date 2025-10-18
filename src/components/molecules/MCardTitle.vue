<template>
  <div class="card-title">
    <ion-icon v-if="icon" :icon="icon" class="icon"></ion-icon>
    <span class="text">{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'

interface Props {
  icon?: string
  title: string
}

defineProps<Props>()
</script>

<style scoped>
/* ====================================
   CARD TITLE - RSCSS PATTERN
   Component: card-title
   ==================================== */

.card-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
}

/* Element: icon */
.icon {
  font-size: 1.5rem;
  color: rgba(129, 140, 248, 0.8);
}

/* Element: text */
.text {
  flex: 1;
}
</style>
