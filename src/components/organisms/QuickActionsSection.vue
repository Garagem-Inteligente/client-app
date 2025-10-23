<template>
  <div class="quick-actions-section">
    <div class="quick-actions-grid">
      <button
        v-for="action in quickActions"
        :key="action.id"
        class="quick-action-btn"
        @click="handleAction(action)"
      >
        <div :class="['action-icon', action.color]">
          <ion-icon :icon="getIcon(action.icon)" />
        </div>
        <div class="action-text">
          <p class="action-title">{{ action.title }}</p>
          <p class="action-subtitle">{{ action.subtitle }}</p>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { add, construct, car, clipboard } from 'ionicons/icons'
import { useQuickActions } from '@/composables/useQuickActions'

const { quickActions, handleAction } = useQuickActions()

const getIcon = (iconName: string) => {
  const icons = { add, construct, car, clipboard }
  return icons[iconName as keyof typeof icons]
}
</script>

<style scoped lang="scss">
/* ====================================
 QUICK ACTIONS - GLASSMORPHISM
 ==================================== */

.quick-actions-section {
  margin-bottom: 1.5rem;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .quick-actions-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--bg-card);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid var(--border-card);
  border-radius: 16px;
  padding: 0.875rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  animation: fadeInUp 0.6s ease-out backwards;
}

.quick-action-btn:nth-child(1) {
  animation-delay: 0.1s;
}
.quick-action-btn:nth-child(2) {
  animation-delay: 0.15s;
}
.quick-action-btn:nth-child(3) {
  animation-delay: 0.2s;
}
.quick-action-btn:nth-child(4) {
  animation-delay: 0.25s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.quick-action-btn:hover {
  background: var(--gray-800);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* ====================================
 ACTION ICONS
 ==================================== */

.action-icon {
  padding: 0.625rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.action-icon svg {
  width: 1.125rem;
  height: 1.125rem;
}

.action-icon.blue {
  background: linear-gradient(135deg, rgba(var(--ion-color-primary-rgb), 0.2), rgba(var(--blue-400), 0.1));
  color: var(--blue-400);
}

.action-icon.green {
  background: linear-gradient(135deg, rgba(var(--ion-color-success-rgb), 0.2), rgba(var(--green-400), 0.1));
  color: var(--green-400);
}

.action-icon.purple {
  background: linear-gradient(135deg, rgba(var(--ion-color-secondary-rgb), 0.2), rgba(var(--purple-500), 0.1));
  color: var(--purple-500);
}

.action-icon.orange {
  background: linear-gradient(135deg, rgba(var(--ion-color-warning-rgb), 0.2), rgba(var(--orange-400), 0.1));
  color: var(--orange-400);
}

.quick-action-btn:hover .action-icon {
  transform: scale(1.05);
}

/* ====================================
 ACTION TEXT
 ==================================== */

.action-text {
  flex: 1;
  text-align: left;
}

.action-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--ion-text-color);
  margin: 0 0 0.125rem 0;
  letter-spacing: 0.01em;
}

.quick-action-btn:hover .action-title {
  color: var(--blue-400);
}

.action-subtitle {
  font-size: 0.6875rem;
  color: var(--text-secondary);
  margin: 0;
  letter-spacing: 0.01em;
}
</style>