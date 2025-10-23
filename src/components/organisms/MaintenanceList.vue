<template>
  <!-- Manutenções Atrasadas -->
  <div v-if="overdueMaintenances.length > 0" class="card card-danger">
    <h3 class="card-title">⚠️ Manutenções Atrasadas</h3>
    <div class="maintenance-list">
      <div
        v-for="maintenance in displayedOverdueMaintenances"
        :key="maintenance.id"
        class="maintenance-item maintenance-item-danger"
        @click="$emit('navigate', `/tabs/maintenance/${maintenance.id}`)"
      >
        <div class="maintenance-info">
          <div class="maintenance-header">
            <span class="badge-error">ATRASADA</span>
            <h3 class="maintenance-name">{{ getMaintenanceTypeLabel(maintenance.type) }}</h3>
          </div>
          <p class="maintenance-vehicle">{{ getVehicleName(maintenance.vehicleId) }}</p>
        </div>
        <div class="maintenance-date">
          <p class="date-text danger">{{ formatDate(maintenance.nextDueDate!) }}</p>
          <p class="days-text">
            {{ Math.abs(daysUntilNext(maintenance.nextDueDate!)) }} dias atrás
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Grid de Últimas e Próximas Manutenções -->
  <div class="maintenance-grid">
    <!-- Últimas Manutenções -->
    <div class="card">
      <h3 class="card-title">🔧 Últimas Manutenções</h3>

      <!-- Empty State -->
      <div v-if="recentMaintenances.length === 0" class="empty-state">
        <ion-icon :icon="clipboard" class="empty-icon" />
        <p class="empty-text">Nenhuma manutenção registrada</p>
        <button class="btn-primary" @click="$emit('navigate', '/tabs/vehicles')">
          Registrar manutenção
        </button>
      </div>

      <!-- Lista -->
      <div v-else class="maintenance-list">
        <div
          v-for="maintenance in recentMaintenances"
          :key="maintenance.id"
          class="maintenance-item"
          @click="$emit('navigate', `/tabs/maintenance/${maintenance.id}`)"
        >
          <div class="maintenance-info">
            <div class="maintenance-header">
              <span class="badge-success">{{
                getMaintenanceTypeLabel(maintenance.type)
              }}</span>
            </div>
            <p class="maintenance-vehicle">{{ getVehicleName(maintenance.vehicleId) }}</p>
            <p v-if="maintenance.description" class="maintenance-description">
              {{ maintenance.description }}
            </p>
          </div>
          <div class="maintenance-meta">
            <p class="date-text">{{ formatDate(maintenance.date) }}</p>
            <p class="cost-text">{{ formatCurrency(maintenance.cost) }}</p>
            <p v-if="maintenance.mileage" class="mileage-text">
              {{ maintenance.mileage.toLocaleString('pt-BR') }} km
            </p>
          </div>
        </div>

        <button class="btn-outline btn-outline-full-width" @click="$emit('navigate', '/tabs/maintenance')">
          Ver histórico completo
        </button>
      </div>
    </div>

    <!-- Próximas Manutenções -->
    <div class="card">
      <h3 class="card-title">📅 Próximas Manutenções</h3>

      <!-- Empty State -->
      <div v-if="upcomingMaintenances.length === 0" class="empty-state">
        <ion-icon :icon="checkmarkCircle" class="empty-icon" />
        <p class="empty-text">Nenhuma manutenção agendada</p>
        <button class="btn-primary" @click="$emit('navigate', '/tabs/vehicles')">
          Agendar manutenção
        </button>
      </div>

      <!-- Lista -->
      <div v-else class="maintenance-list">
        <div
          v-for="maintenance in displayedUpcomingMaintenances"
          :key="maintenance.id"
          :class="['maintenance-item', getMaintenanceItemClass(maintenance.nextDueDate!) ? `maintenance-item-${getMaintenanceItemClass(maintenance.nextDueDate!)}` : '']"
          @click="$emit('navigate', `/tabs/maintenance/${maintenance.id}`)"
        >
          <div class="maintenance-info">
            <div class="maintenance-header">
              <span :class="['badge', getMaintenanceBadgeClass(maintenance.nextDueDate!)]">
                {{ daysUntilNext(maintenance.nextDueDate!) }} dias
              </span>
              <h3 class="maintenance-name">
                {{ getMaintenanceTypeLabel(maintenance.type) }}
              </h3>
            </div>
            <p class="maintenance-vehicle">{{ getVehicleName(maintenance.vehicleId) }}</p>
          </div>
          <div class="maintenance-meta">
            <p class="date-text">{{ formatDate(maintenance.nextDueDate!) }}</p>
            <p v-if="maintenance.nextDueMileage" class="mileage-text">
              {{ maintenance.nextDueMileage.toLocaleString('pt-BR') }} km
            </p>
          </div>
        </div>

        <button class="btn-outline btn-outline-full-width" @click="$emit('navigate', '/tabs/maintenance')">
          Ver todas as manutenções
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonIcon } from '@ionic/vue'
import { clipboard, checkmarkCircle } from 'ionicons/icons'
import {
  formatDate,
  formatCurrency,
  daysUntilNext,
  getMaintenanceTypeLabel,
  getMaintenanceBadgeClass,
  getMaintenanceItemClass
} from '@/utils/dashboard'

interface Maintenance {
  id: string
  vehicleId: string
  type: string
  description?: string
  cost: number
  date: Date
  mileage?: number
  nextDueDate?: Date
  nextDueMileage?: number
}

interface Props {
  recentMaintenances: Maintenance[]
  upcomingMaintenances: Maintenance[]
  overdueMaintenances: Maintenance[]
  getVehicleName: (vehicleId: string) => string
}

const props = defineProps<Props>()

defineEmits<{
  navigate: [path: string]
}>()

const displayedOverdueMaintenances = computed(() => props.overdueMaintenances.slice(0, 3))
const displayedUpcomingMaintenances = computed(() => props.upcomingMaintenances.slice(0, 5))
</script>

<style scoped lang="scss">
/* ====================================
 GLASS CARD
 ==================================== */

.card {
  background: var(--bg-card);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid var(--border-card);
  border-radius: 16px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.6s ease-out 0.55s backwards;
  margin-bottom: 24px;

  &:hover {
    background: var(--gray-800);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  }

  &-danger {
    border: 1.5px solid rgba(var(--ion-color-danger-rgb), 0.4);
  }
}

.card-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--ion-text-color);
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.01em;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 2rem 0;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  color: var(--gray-500);
  margin: 0 auto 1rem;
}

.empty-text {
  color: var(--gray-400);
  margin: 0 0 1rem 0;
}

/* ====================================
 MODERN BUTTONS
 ==================================== */

.btn-primary {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--ion-text-color);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15));
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
}

.btn-outline {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 0.625rem 1.25rem;
  color: var(--ion-text-color);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  &-full-width {
    width: 100%;
    margin-top: 0.75rem;
  }
}

/* ====================================
 BADGES
 ==================================== */

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

.badge-success {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.625rem;
  font-weight: 600;
  background: rgba(var(--ion-color-success-rgb), 0.1);
  color: var(--green-400);
  border: 1px solid rgba(var(--ion-color-success-rgb), 0.3);
}

.badge-warning {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.625rem;
  font-weight: 600;
  background: rgba(var(--ion-color-warning-rgb), 0.1);
  color: var(--orange-400);
  border: 1px solid rgba(var(--ion-color-warning-rgb), 0.3);
}

.badge-default {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.625rem;
  font-weight: 600;
  background: rgba(107, 114, 128, 0.1);
  color: var(--gray-400);
  border: 1px solid rgba(107, 114, 128, 0.3);
}

/* Maintenance List */
.maintenance-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.maintenance-item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  background: rgba(31, 41, 55, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--gray-700);
    border-color: rgba(var(--ion-color-primary-rgb), 0.3);
    transform: translateY(-2px);
  }

  &-danger {
    background: rgba(153, 27, 27, 0.2);
    border: 1px solid rgba(var(--ion-color-danger-rgb), 0.3);
  }

  &-urgent {
    background: rgba(154, 52, 18, 0.2);
    border: 1px solid rgba(var(--ion-color-warning-rgb), 0.3);
  }

  &-soon {
    background: rgba(133, 77, 14, 0.2);
    border: 1px solid rgba(234, 179, 8, 0.3);
  }
}

.maintenance-info {
  flex: 1;
  min-width: 0;
}

.maintenance-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
}

.maintenance-name {
  font-weight: 500;
  color: var(--ion-text-color);
  margin: 0;
  font-size: 0.9375rem;
}

.maintenance-vehicle {
  font-size: 0.875rem;
  color: var(--gray-400);
  margin: 0.25rem 0;
}

.maintenance-description {
  font-size: 0.75rem;
  color: var(--gray-500);
  margin: 0.25rem 0 0 0;
}

.maintenance-meta,
.maintenance-date {
  text-align: right;
  flex-shrink: 0;
}

.date-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ion-text-color);
  margin: 0 0 0.25rem 0;
}

.date-text.danger {
  color: var(--ion-color-danger);
}

.cost-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ion-color-success);
  margin: 0.25rem 0;
}

.mileage-text,
.days-text {
  font-size: 0.75rem;
  color: var(--gray-400);
  margin: 0;
}

/* Maintenance Grid */
.maintenance-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .maintenance-grid {
    grid-template-columns: repeat(2, 1fr);
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
</style>