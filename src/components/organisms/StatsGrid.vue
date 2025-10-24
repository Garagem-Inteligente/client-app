<template>
  <div class="stats-grid">
    <!-- Veículos Card -->
    <div class="stat-card stat-card-blue" @click="$emit('navigate', '/tabs/vehicles')">
      <div class="stat-content">
        <div class="stat-info">
          <p class="stat-label">Total de Veículos</p>
          <div class="stat-value">{{ stats.vehicleCount }}</div>
        </div>
        <div class="stat-icon stat-icon-blue">
          <ion-icon :icon="carSportOutline" />
        </div>
      </div>
      <p class="stat-description">Veículos na sua garagem</p>
    </div>

    <!-- Manutenções Card -->
    <div class="stat-card stat-card-green" @click="$emit('navigate', '/tabs/maintenance')">
      <div class="stat-content">
        <div class="stat-info">
          <p class="stat-label">Manutenções</p>
          <div class="stat-value">{{ stats.totalMaintenanceRecords }}</div>
        </div>
        <div class="stat-icon stat-icon-green">
          <ion-icon :icon="constructOutline" />
        </div>
      </div>
      <p class="stat-description">Registros no histórico</p>
    </div>

    <!-- Custo Total Card -->
    <div class="stat-card stat-card-purple" @click="$emit('navigate', '/tabs/maintenance')">
      <div class="stat-content">
        <div class="stat-info">
          <p class="stat-label">Custo Total</p>
          <div class="stat-value stat-value-currency">{{ formatCurrency(stats.totalCost) }}</div>
        </div>
        <div class="stat-icon stat-icon-purple">
          <ion-icon :icon="cashOutline" />
        </div>
      </div>
      <p class="stat-description">Investido em manutenções</p>
    </div>

    <!-- Agendadas Card -->
    <div class="stat-card stat-card-yellow" @click="$emit('navigate', '/tabs/maintenance')">
      <div class="stat-content">
        <div class="stat-info">
          <p class="stat-label">Agendadas</p>
          <div class="stat-value">{{ stats.upcomingMaintenanceCount }}</div>
        </div>
        <div class="stat-icon stat-icon-yellow">
          <ion-icon :icon="calendarOutline" />
        </div>
      </div>
      <div class="stat-footer">
        <p class="stat-description">Próximas manutenções</p>
        <span v-if="stats.overdueCount > 0" class="badge-error">{{ stats.overdueCount }} atrasadas</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { carSportOutline, constructOutline, cashOutline, calendarOutline } from 'ionicons/icons'
import { formatCurrency } from '@/utils/dashboard'

interface StatsData {
  vehicleCount: number
  totalMaintenanceRecords: number
  totalCost: number
  upcomingMaintenanceCount: number
  overdueCount: number
}

interface Props {
  stats: StatsData
}

defineProps<Props>()

defineEmits<{
  navigate: [path: string]
}>()
</script>

<style scoped lang="scss">
/* ====================================
 STATS GRID - GLASSMORPHISM CARDS
 ==================================== */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-card {
  background: var(--bg-card);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid var(--border-card);
  border-radius: 16px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.6s ease-out backwards;

  &:nth-child(1) {
    animation-delay: 0.35s;
  }

  &:nth-child(2) {
    animation-delay: 0.4s;
  }

  &:nth-child(3) {
    animation-delay: 0.45s;
  }

  &:nth-child(4) {
    animation-delay: 0.5s;
  }

  &:hover {
    background: var(--gray-800);
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);

    > .stat-content > .stat-icon {
      transform: scale(1.05);
    }
  }

  &-blue {
    border-color: rgba(147, 197, 253, 0.3);
  }

  &-green {
    border-color: rgba(134, 239, 172, 0.3);
  }

  &-purple {
    border-color: rgba(196, 181, 253, 0.3);
  }

  &-yellow {
    border-color: rgba(253, 224, 71, 0.3);
  }
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

.stat-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.625rem;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 0.6875rem;
  color: var(--text-secondary);
  margin: 0 0 0.375rem 0;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--ion-text-color);
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &-currency {
    font-size: var(--font-size-lg);
  }
}

.stat-icon {
  padding: 0.625rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }

  &-blue {
    background: linear-gradient(135deg, rgba(var(--ion-color-primary-rgb), 0.2), rgba(var(--blue-400), 0.1));
    color: var(--blue-400);
  }

  &-green {
    background: linear-gradient(135deg, rgba(var(--ion-color-success-rgb), 0.2), rgba(var(--green-400), 0.1));
    color: var(--green-400);
  }

  &-purple {
    background: linear-gradient(135deg, rgba(var(--ion-color-secondary-rgb), 0.2), rgba(var(--purple-500), 0.1));
    color: var(--purple-500);
  }

  &-yellow {
    background: linear-gradient(135deg, rgba(var(--ion-color-warning-rgb), 0.2), rgba(var(--orange-400), 0.1));
    color: var(--orange-400);
  }
}

.stat-description {
  font-size: 0.6875rem;
  color: var(--text-secondary);
  margin: 0;
  letter-spacing: 0.01em;
}

.stat-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

/* Badges */
.badge-error {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.625rem;
  font-weight: 600;
  background: var(--bg-error);
  color: var(--ion-color-danger);
  border: 1px solid rgba(var(--ion-color-danger-rgb), 0.3);
}
</style>