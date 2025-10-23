<template>
  <div v-if="hasFuelData" class="fuel-summary-card">
    <div class="fuel-summary-header">
      <h2 class="section-title">⛽ Gastos com Combustível</h2>
      <p class="section-subtitle">Total estimado de todos os veículos</p>
    </div>
    <div class="fuel-summary-grid">
      <div class="fuel-stat-item">
        <div class="fuel-stat-icon purple">
          <ion-icon :icon="trendingUp" />
        </div>
        <div class="fuel-stat-content">
          <p class="fuel-stat-label">Distância Total</p>
          <p class="fuel-stat-value">
            {{ totalFuelCosts.totalDistance.toLocaleString('pt-BR') }} km
          </p>
        </div>
      </div>
      <div class="fuel-stat-item">
        <div class="fuel-stat-icon green">
          <ion-icon :icon="water" />
        </div>
        <div class="fuel-stat-content">
          <p class="fuel-stat-label">Litros Consumidos</p>
          <p class="fuel-stat-value">
            {{
              totalFuelCosts.totalLiters.toLocaleString('pt-BR', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })
            }}
            L
          </p>
        </div>
      </div>
      <div class="fuel-stat-item highlight">
        <div class="fuel-stat-icon gold">
          <ion-icon :icon="cash" />
        </div>
        <div class="fuel-stat-content">
          <p class="fuel-stat-label">Custo Total Estimado</p>
          <p class="fuel-stat-value primary">
            {{ formatCurrency(totalFuelCosts.totalCost) }}
          </p>
        </div>
      </div>
    </div>
    <p class="fuel-summary-note">
      💡 Estimativas baseadas no consumo médio configurado em cada veículo
    </p>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { trendingUp, water, cash } from 'ionicons/icons'
import { formatCurrency } from '@/utils/dashboard'

interface FuelCosts {
  totalDistance: number
  totalLiters: number
  totalCost: number
}

interface Props {
  totalFuelCosts: FuelCosts
  hasFuelData: boolean
}

defineProps<Props>()
</script>

<style scoped lang="scss">
/* ====================================
 FUEL SUMMARY CARD
 ==================================== */

.fuel-summary-card {
  background: linear-gradient(135deg, rgba(var(--ion-color-secondary-rgb), 0.1) 0%, rgba(124, 58, 237, 0.05) 100%);
  border: 1px solid rgba(var(--ion-color-secondary-rgb), 0.2);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  animation: fadeInUp 0.6s ease-out;
}

.fuel-summary-header {
  margin-bottom: 20px;
}

.fuel-summary-header .section-title {
  margin-bottom: 4px;
  font-size: 1.25rem;
}

.section-subtitle {
  color: var(--gray-400);
  font-size: 0.875rem;
  margin: 0;
}

.fuel-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.fuel-stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.fuel-stat-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.fuel-stat-item.highlight {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%);
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.fuel-stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.fuel-stat-icon.purple {
  background: linear-gradient(135deg, var(--ion-color-secondary) 0%, #7c3aed 100%);
}

.fuel-stat-icon.green {
  background: linear-gradient(135deg, var(--ion-color-success) 0%, #059669 100%);
}

.fuel-stat-icon.gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffc107 100%);
}

.fuel-stat-icon svg {
  width: 24px;
  height: 24px;
  color: var(--ion-text-color);
}

.fuel-stat-content {
  flex: 1;
}

.fuel-stat-label {
  font-size: 0.75rem;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.fuel-stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--ion-text-color);
  margin: 0;
}

.fuel-stat-value.primary {
  font-size: 1.5rem;
  color: #ffd700;
  text-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}

.fuel-summary-note {
  background: rgba(var(--ion-color-secondary-rgb), 0.1);
  border: 1px solid rgba(var(--ion-color-secondary-rgb), 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 0.875rem;
  color: var(--purple-500);
  margin: 0;
  line-height: 1.5;
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

@media (max-width: 768px) {
  .fuel-summary-grid {
    grid-template-columns: 1fr;
  }

  .fuel-stat-value {
    font-size: 1.125rem;
  }

  .fuel-stat-value.primary {
    font-size: 1.375rem;
  }
}
</style>