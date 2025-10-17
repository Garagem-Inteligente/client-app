<template>
  <ion-header :translucent="true" class="modern-app-header">
    <ion-toolbar class="modern-toolbar">
      <!-- Back Button -->
      <ion-buttons v-if="showBackButton" slot="start">
        <ion-button class="back-button-modern" @click="handleBack">
          <ion-icon :icon="arrowBack" class="back-icon"></ion-icon>
        </ion-button>
      </ion-buttons>

      <!-- Centered Title -->
      <ion-title class="modern-title-centered">{{ title }}</ion-title>

      <!-- Action Buttons -->
      <ion-buttons slot="end">
        <!-- Primary Action Button (e.g., Add, Save) -->
        <ion-button
          v-if="primaryAction"
          class="primary-action-button"
          :class="{ 'pulse-animation': primaryAction.pulse }"
          @click="primaryAction.handler"
          :disabled="primaryAction.disabled"
        >
          <ion-icon
            v-if="primaryAction.icon"
            :icon="primaryAction.icon"
            class="action-icon"
          ></ion-icon>
          <span v-if="primaryAction.text" class="action-text">{{ primaryAction.text }}</span>
        </ion-button>

        <!-- Secondary Actions -->
        <ion-button
          v-for="(action, index) in secondaryActions"
          :key="index"
          class="secondary-action-button"
          @click="action.handler"
          :disabled="action.disabled"
        >
          <ion-icon :icon="action.icon"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon } from '@ionic/vue'
import { arrowBack } from 'ionicons/icons'
import { useRouter } from 'vue-router'

export interface ActionButton {
  icon?: string
  text?: string
  handler: () => void
  disabled?: boolean
  pulse?: boolean
}

interface Props {
  title: string
  showBackButton?: boolean
  backPath?: string
  primaryAction?: ActionButton
  secondaryActions?: ActionButton[]
}

const props = withDefaults(defineProps<Props>(), {
  showBackButton: false,
  backPath: '',
  secondaryActions: () => []
})

const router = useRouter()

const handleBack = () => {
  if (props.backPath) {
    router.push(props.backPath)
  } else {
    router.back()
  }
}
</script>

<style scoped>
/* ====================================
   MODERN APP HEADER
   ==================================== */

.modern-app-header {
  --background: transparent;
}

.modern-toolbar {
  --background: linear-gradient(135deg, 
    rgba(31, 41, 55, 0.98) 0%, 
    rgba(17, 24, 39, 0.98) 100%
  );
  --border-width: 0;
  --min-height: 56px;
  padding: 4px 8px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

/* ====================================
   BACK BUTTON
   ==================================== */

.back-button-modern {
  --background: rgba(102, 126, 234, 0.15);
  --background-activated: rgba(102, 126, 234, 0.25);
  --background-hover: rgba(102, 126, 234, 0.2);
  --color: #667eea;
  --border-radius: 10px;
  --padding-start: 10px;
  --padding-end: 10px;
  height: 40px;
  margin: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-button-modern:hover {
  transform: translateX(-2px);
}

.back-icon {
  font-size: 1.375rem;
  transition: transform 0.3s ease;
}

.back-button-modern:active .back-icon {
  transform: scale(0.9);
}

/* ====================================
   CENTERED TITLE
   ==================================== */

.modern-title-centered {
  text-align: center;
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: white;
  padding: 0 16px;
}

/* ====================================
   PRIMARY ACTION BUTTON
   ==================================== */

.primary-action-button {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --background-activated: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
  --background-hover: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
  --color: white;
  --border-radius: 12px;
  --padding-start: 16px;
  --padding-end: 16px;
  height: 40px;
  margin: 0;
  font-weight: 600;
  box-shadow: 
    0 4px 12px rgba(102, 126, 234, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.primary-action-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.primary-action-button:hover::before {
  opacity: 1;
}

.primary-action-button:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 16px rgba(102, 126, 234, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.primary-action-button:active {
  transform: translateY(0);
  box-shadow: 
    0 2px 8px rgba(102, 126, 234, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.primary-action-button[disabled] {
  --background: rgba(156, 163, 175, 0.3);
  --color: rgba(156, 163, 175, 0.6);
  box-shadow: none;
  cursor: not-allowed;
}

/* Pulse Animation for Primary Button */
.pulse-animation {
  animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 
      0 4px 12px rgba(102, 126, 234, 0.4),
      0 0 0 0 rgba(102, 126, 234, 0.7),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow: 
      0 4px 12px rgba(102, 126, 234, 0.4),
      0 0 0 8px rgba(102, 126, 234, 0),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
}

.action-icon {
  font-size: 1.25rem;
}

.action-text {
  margin-left: 6px;
  font-size: 0.938rem;
}

/* ====================================
   SECONDARY ACTION BUTTONS
   ==================================== */

.secondary-action-button {
  --background: rgba(255, 255, 255, 0.08);
  --background-activated: rgba(255, 255, 255, 0.15);
  --background-hover: rgba(255, 255, 255, 0.12);
  --color: rgba(255, 255, 255, 0.9);
  --border-radius: 10px;
  --padding-start: 10px;
  --padding-end: 10px;
  height: 40px;
  margin-left: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.secondary-action-button:hover {
  transform: translateY(-2px);
}

.secondary-action-button:active {
  transform: translateY(0);
}

.secondary-action-button[disabled] {
  --background: rgba(156, 163, 175, 0.15);
  --color: rgba(156, 163, 175, 0.5);
  cursor: not-allowed;
}

/* ====================================
   RESPONSIVE ADJUSTMENTS
   ==================================== */

@media (max-width: 360px) {
  .modern-toolbar {
    --min-height: 52px;
    padding: 2px 6px;
  }

  .modern-title-centered {
    font-size: 1rem;
    padding: 0 12px;
  }

  .back-button-modern,
  .primary-action-button,
  .secondary-action-button {
    height: 36px;
  }

  .action-text {
    display: none;
  }
}

@media (min-width: 768px) {
  .modern-app-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .modern-toolbar {
    --min-height: 64px;
    padding: 8px 24px;
    max-width: 1200px;
    margin: 0 auto;
    border-radius: 0;
  }

  .modern-title-centered {
    font-size: 1.375rem;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .back-button-modern {
    height: 44px;
    --padding-start: 14px;
    --padding-end: 14px;
    --border-radius: 12px;
    font-weight: 500;
  }

  .primary-action-button {
    height: 44px;
    --padding-start: 20px;
    --padding-end: 20px;
    --border-radius: 14px;
    font-size: 1rem;
  }

  .secondary-action-button {
    height: 44px;
    --padding-start: 14px;
    --padding-end: 14px;
    --border-radius: 12px;
  }

  .action-text {
    display: inline-block;
    font-size: 0.938rem;
  }
}

/* ====================================
   ACCESSIBILITY
   ==================================== */

.back-button-modern:focus-visible,
.primary-action-button:focus-visible,
.secondary-action-button:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>

