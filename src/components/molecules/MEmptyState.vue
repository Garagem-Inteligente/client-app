<template>
  <div class="empty-state-container">
    <div class="empty-state">
      <ion-icon v-if="icon" :icon="icon" class="empty-icon"></ion-icon>
      <h3 v-if="title" class="empty-title">{{ title }}</h3>
      <p v-if="subtitle" class="empty-subtitle">{{ subtitle }}</p>
      
      <!-- Slot para botão customizado ou use o botão padrão -->
      <slot>
        <AButton v-if="showButton && buttonLabel" @click="$emit('action')">
          {{ buttonLabel }}
        </AButton>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import AButton from '@/components/atoms/AButton.vue'

interface Props {
  icon?: string
  title?: string
  subtitle?: string
  showButton?: boolean
  buttonLabel?: string
}

withDefaults(defineProps<Props>(), {
  showButton: true
})

defineEmits<{
  action: []
}>()
</script>

<style scoped>
/* ====================================
   EMPTY STATE - RSCSS PATTERN
   Component: empty-state-container
   ==================================== */

.empty-state-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 2rem 1rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 400px;
  padding: 2rem;
  background: rgba(31, 41, 55, 0.75);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 2px dashed rgba(129, 140, 248, 0.4);
  border-radius: 24px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Element: empty-icon */
.empty-icon {
  font-size: 4rem;
  color: rgba(129, 140, 248, 0.6);
  margin-bottom: 1.5rem;
  opacity: 0.5;
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Element: empty-title */
.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 0.75rem 0;
}

/* Element: empty-subtitle */
.empty-subtitle {
  font-size: 1rem;
  font-weight: 400;
  color: rgba(156, 163, 175, 1);
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 640px) {
  .empty-state {
    padding: 1.5rem;
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .empty-title {
    font-size: 1.25rem;
  }

  .empty-subtitle {
    font-size: 0.875rem;
  }
}
</style>
