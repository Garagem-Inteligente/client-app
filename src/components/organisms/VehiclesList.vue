<template>
  <div class="card">
    <h3 class="card-title">Meus Veículos</h3>

    <!-- Empty State -->
    <div v-if="vehicles.length === 0" class="empty-state">
      <ion-icon :icon="car" class="empty-icon" />
      <p class="empty-text">Nenhum veículo cadastrado</p>
      <button class="btn-primary" @click="$emit('navigate', '/tabs/vehicle/new')">
        Adicionar primeiro veículo
      </button>
    </div>

    <!-- Lista de Veículos -->
    <div v-else class="vehicles-list">
      <div
        v-for="vehicle in displayedVehicles"
        :key="vehicle.id"
        @click="$emit('navigate', `/tabs/vehicle/${vehicle.id}`)"
        class="vehicle-item"
      >
        <div class="vehicle-icon-wrapper">
          <ion-icon :icon="car" class="vehicle-icon" />
        </div>
        <div class="vehicle-info">
          <h3 class="vehicle-name">{{ vehicle.make }} {{ vehicle.model }}</h3>
          <p class="vehicle-details">{{ vehicle.year }} • {{ vehicle.plate }}</p>
        </div>
        <div class="vehicle-meta">
          <p class="vehicle-mileage">{{ vehicle.mileage.toLocaleString('pt-BR') }} km</p>
          <span :class="['badge', getFuelBadgeClass(vehicle.fuelType)]">
            {{ getFuelLabel(vehicle.fuelType) }}
          </span>
        </div>
        <ion-icon :icon="chevronForward" class="chevron-icon" />
      </div>

      <button
        v-if="vehicles.length > 3"
        class="btn-outline full-width"
        @click="$emit('navigate', '/tabs/vehicles')"
      >
        Ver todos os veículos
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonIcon } from '@ionic/vue'
import { car, chevronForward } from 'ionicons/icons'
import { getFuelLabel, getFuelBadgeClass } from '@/utils/dashboard'

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  plate: string
  mileage: number
  fuelType: string
}

interface Props {
  vehicles: Vehicle[]
}

const props = defineProps<Props>()

defineEmits<{
  navigate: [path: string]
}>()

const displayedVehicles = computed(() => props.vehicles.slice(0, 3))
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

  &.full-width {
    width: 100%;
    margin-top: 0.75rem;
  }
}

/* ====================================
 VEHICLES LIST
 ==================================== */

.vehicles-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.vehicle-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: rgba(31, 41, 55, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  flex-wrap: wrap;

  &:hover {
    background: var(--gray-700);
    border-color: rgba(var(--ion-color-primary-rgb), 0.5);
    transform: translateY(-2px);

    > .vehicle-icon-wrapper {
      background: rgba(var(--ion-color-primary-rgb), 0.2);
      border-color: rgba(var(--ion-color-primary-rgb), 0.5);
    }

    > .vehicle-info > .vehicle-name {
      color: var(--blue-400);
    }

    > .chevron-icon {
      color: var(--blue-400);
    }
  }
}

.vehicle-icon-wrapper {
  padding: 0.625rem;
  background: rgba(var(--ion-color-primary-rgb), 0.1);
  border: 1px solid rgba(var(--ion-color-primary-rgb), 0.3);
  border-radius: 0.5rem;
  transition: all 0.2s;
  flex-shrink: 0;
}

.vehicle-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--blue-400);
}

.vehicle-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.vehicle-name {
  font-weight: 500;
  color: var(--ion-text-color);
  margin: 0 0 0.25rem 0;
  transition: color 0.2s;
  font-size: 0.9375rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vehicle-details {
  font-size: 0.8125rem;
  color: var(--gray-400);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vehicle-meta {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  flex-shrink: 0;
}

.vehicle-mileage {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--ion-text-color);
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.625rem;
  font-weight: 600;

  &-default {
    background: rgba(107, 114, 128, 0.1);
    color: var(--gray-400);
    border: 1px solid rgba(107, 114, 128, 0.3);
  }

  &-success {
    background: rgba(var(--ion-color-success-rgb), 0.1);
    color: var(--green-400);
    border: 1px solid rgba(var(--ion-color-success-rgb), 0.3);
  }
}

.chevron-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: var(--gray-500);
  flex-shrink: 0;
  transition: color 0.2s;
  margin-left: auto;
}

/* ====================================
 RESPONSIVE DESIGN
 ==================================== */

@media (max-width: 480px) {
  .vehicle-item {
    gap: 0.5rem;
    padding: 0.75rem;
  }

  .vehicle-icon-wrapper {
    padding: 0.5rem;
  }

  .vehicle-icon {
    width: 1rem;
    height: 1rem;
  }

  .vehicle-name {
    font-size: 0.875rem;
  }

  .vehicle-details {
    font-size: 0.75rem;
  }

  .vehicle-mileage {
    font-size: 0.75rem;
  }

  .badge {
    font-size: 0.5625rem;
    padding: 0.125rem 0.375rem;
  }

  .chevron-icon {
    width: 1rem;
    height: 1rem;
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