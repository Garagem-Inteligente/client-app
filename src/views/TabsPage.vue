<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      
      <!-- Ultra Modern Premium Tab Bar -->
      <template v-slot:bottom>
<ion-tab-bar  class="premium-tab-bar">
        <!-- Animated Background Gradient -->
        <div class="tab-bar-gradient"></div>
        <div class="tab-bar-glow"></div>
        
        <!-- Tab Buttons with Micro-interactions -->
        <ion-tab-button 
          v-for="tab in tabs" 
          :key="tab.name"
          :tab="tab.name" 
          :href="tab.href" 
          class="premium-tab-button"
        >
          <div class="tab-wrapper">
            <!-- Icon Container with Ripple Effect -->
            <div class="icon-container">
              <div class="icon-ripple"></div>
              <div class="icon-glow" :class="`glow-${tab.name}`"></div>
              <ion-icon 
                aria-hidden="true" 
                :icon="tab.icon" 
                class="tab-icon"
              />
            </div>
            
            <!-- Label with Slide Animation -->
            <ion-label class="tab-label">
              <span class="label-text">{{ tab.label }}</span>
            </ion-label>
          </div>
        </ion-tab-button>
      </ion-tab-bar>
</template>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue'
import { 
  home, 
  car, 
  construct, 
  person
} from 'ionicons/icons'

interface Tab {
  name: string
  href: string
  icon: string
  label: string
}

const tabs: Tab[] = [
  { name: 'home', href: '/tabs/home', icon: home, label: 'Início' },
  { name: 'vehicles', href: '/tabs/vehicles', icon: car, label: 'Veículos' },
  { name: 'maintenance', href: '/tabs/maintenance', icon: construct, label: 'Manutenção' },
  { name: 'profile', href: '/tabs/profile', icon: person, label: 'Perfil' }
]

const route = useRoute()
const activeTabIndex = ref(0)

// Watch route changes to update active tab
watch(() => route.path, (newPath) => {
  const index = tabs.findIndex(tab => newPath.includes(tab.name))
  if (index !== -1 && index !== activeTabIndex.value) {
    activeTabIndex.value = index
  }
})

// Set initial active tab based on route
onMounted(() => {
  const currentPath = route.path
  const index = tabs.findIndex(tab => currentPath.includes(tab.name))
  if (index !== -1) {
    activeTabIndex.value = index
  }
})
</script>

<style scoped>
/* ====================================
   ULTRA PREMIUM TAB BAR - 2025 DESIGN
   ==================================== */

.premium-tab-bar {
  --background: transparent;
  --border: none;
  position: relative;
  height: 76px;
  padding: 10px 16px 14px;
  margin: 0 16px 16px;
  border-radius: 32px;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: space-around;
  isolation: isolate;
}

/* Animated Background with Glassmorphism */
.tab-bar-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(31, 41, 55, 0.95) 0%, 
    rgba(17, 24, 39, 0.98) 50%, 
    rgba(31, 41, 55, 0.95) 100%
  );
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  z-index: 0;
  animation: gradientShift 15s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Subtle Glow Effect */
.tab-bar-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%);
  border-radius: 32px;
  opacity: 0;
  filter: blur(20px);
  z-index: -1;
  animation: glowPulse 8s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.05;
  }
  50% {
    opacity: 0.12;
  }
}

/* ====================================
   TAB BUTTONS
   ==================================== */

.premium-tab-button {
  --background: transparent;
  --background-focused: transparent;
  --color: rgba(156, 163, 175, 0.7);
  --color-selected: white;
  --ripple-color: rgba(102, 126, 234, 0.25);
  position: relative;
  flex: 1;
  min-height: 56px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  animation: tabSlideUp 0.6s ease-out backwards;
}

.premium-tab-button:nth-child(2) { animation-delay: 0.05s; }
.premium-tab-button:nth-child(3) { animation-delay: 0.1s; }
.premium-tab-button:nth-child(4) { animation-delay: 0.15s; }
.premium-tab-button:nth-child(5) { animation-delay: 0.2s; }

@keyframes tabSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.premium-tab-button::part(native) {
  padding: 0;
  border-radius: 20px;
  overflow: visible;
}

.tab-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  position: relative;
  z-index: 3;
}

/* ====================================
   ICON CONTAINER WITH EFFECTS
   ==================================== */

.icon-container {
  position: relative;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Ripple Effect on Click */
.icon-ripple {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  transform: scale(0);
  opacity: 0;
  pointer-events: none;
}

.premium-tab-button:active .icon-ripple {
  animation: rippleEffect 0.6s ease-out;
}

@keyframes rippleEffect {
  0% {
    transform: scale(0);
    opacity: 0.6;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* Icon Glow with Custom Colors */
.icon-glow {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  opacity: 0;
  filter: blur(14px);
  transition: opacity 0.4s ease;
  z-index: -1;
}

.glow-home {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.glow-vehicles {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
}

.glow-maintenance {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.glow-profile {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

/* Tab Icon */
.tab-icon {
  font-size: 1.625rem;
  color: inherit;
  position: relative;
  z-index: 2;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  will-change: transform;
}

/* Tab Label */
.tab-label {
  font-size: 0.688rem;
  font-weight: 500;
  letter-spacing: 0.4px;
  transition: all 0.35s ease;
  opacity: 0.7;
  position: relative;
  z-index: 2;
}

.label-text {
  display: inline-block;
  transition: all 0.35s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* ====================================
   SELECTED/ACTIVE STATE
   ==================================== */

.premium-tab-button.tab-selected {
  --color: white;
}

.premium-tab-button.tab-selected .icon-container {
  transform: scale(1.05) translateY(-3px);
}

.premium-tab-button.tab-selected .tab-icon {
  transform: scale(1.2);
  filter: drop-shadow(0 6px 12px rgba(102, 126, 234, 0.4));
  animation: iconBounce 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes iconBounce {
  0%, 100% {
    transform: scale(1.2);
  }
  40% {
    transform: scale(1.35) rotate(5deg);
  }
  60% {
    transform: scale(1.15) rotate(-5deg);
  }
}

.premium-tab-button.tab-selected .tab-label {
  font-weight: 700;
  opacity: 1;
  transform: scale(1.05) translateY(-1px);
}

.premium-tab-button.tab-selected .label-text {
  animation: textPop 0.5s ease-out;
}

@keyframes textPop {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.12);
  }
}

.premium-tab-button.tab-selected .icon-glow {
  opacity: 0.6;
  animation: glowPulseSelected 2s ease-in-out infinite;
}

@keyframes glowPulseSelected {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.15);
  }
}

/* ====================================
   HOVER EFFECTS (Desktop)
   ==================================== */

@media (hover: hover) {
  .premium-tab-button:hover:not(.tab-selected) {
    --color: rgba(255, 255, 255, 0.95);
  }

  .premium-tab-button:hover:not(.tab-selected) .icon-container {
    transform: scale(1.08) translateY(-2px);
  }

  .premium-tab-button:hover:not(.tab-selected) .tab-icon {
    transform: scale(1.15);
    filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.25));
  }

  .premium-tab-button:hover:not(.tab-selected) .tab-label {
    opacity: 0.95;
    transform: translateY(-1px);
  }

  .premium-tab-button:hover:not(.tab-selected) .icon-glow {
    opacity: 0.35;
  }

  .premium-tab-button:hover:not(.tab-selected) .label-text {
    transform: scale(1.08);
  }
}

/* ====================================
   ACTIVE/PRESS STATE
   ==================================== */

.premium-tab-button:active .icon-container {
  transform: scale(0.92) translateY(1px);
}

.premium-tab-button:active .tab-icon {
  transform: scale(0.95);
}

/* ====================================
   RESPONSIVE ADJUSTMENTS
   ==================================== */

@media (max-width: 360px) {
  .premium-tab-bar {
    height: 70px;
    padding: 8px 12px 12px;
    margin: 0 12px 12px;
    border-radius: 28px;
  }

  .icon-container {
    width: 50px;
    height: 50px;
  }

  .premium-tab-button {
    min-height: 50px;
  }

  .tab-icon {
    font-size: 1.375rem;
  }

  .tab-label {
    font-size: 0.625rem;
  }
}

@media (min-width: 768px) {
  .premium-tab-bar {
    height: 82px;
    padding: 12px 24px 16px;
    margin: 0 16px 16px;
    border-radius: 36px;
  }

  .icon-container {
    width: 62px;
    height: 62px;
  }

  .premium-tab-button {
    min-height: 62px;
  }

  .tab-icon {
    font-size: 1.75rem;
  }

  .tab-label {
    font-size: 0.75rem;
  }
}

/* ====================================
   ACCESSIBILITY
   ==================================== */

.premium-tab-button:focus-visible {
  outline: none;
}

.premium-tab-button:focus-visible::before {
  content: '';
  position: absolute;
  inset: -4px;
  border: 3px solid #667eea;
  border-radius: 20px;
  animation: focusPulse 1.5s ease-in-out infinite;
}

@keyframes focusPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.08);
  }
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
