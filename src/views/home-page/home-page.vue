<template>
  <ion-page>
    <ModernHeader :title="`Bem-vindo, ${authStore.userName}`" />

    <ion-content :fullscreen="true" class="app-content">
      <div class="background-gradient"></div>
      <div class="background-pattern"></div>

      <div class="container page-content-wrapper dashboard-container">

          <div v-if="overdueCount > 0" class="alert-danger">
            <div class="alert-content">
              <div class="alert-left">
                <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span class="alert-text"
                  >Você tem {{ overdueCount }} manutenção(ões) atrasada(s)!</span
                >
              </div>
              <button class="alert-btn" @click="handleNavigation('/tabs/maintenance')">Ver detalhes</button>
            </div>
          </div>

          <QuickActionsSection @navigate="handleNavigation" />

          <StatsGrid :stats="stats" @navigate="handleNavigation" />

          <FuelSummaryCard
            :total-fuel-costs="totalFuelCosts"
            :has-fuel-data="hasFuelData"
          />

          <VehiclesList :vehicles="vehiclesStore.vehicles" @navigate="handleNavigation" />

          <MaintenanceList
            :recent-maintenances="vehiclesStore.recentMaintenance"
            :upcoming-maintenances="vehiclesStore.upcomingMaintenance"
            :overdue-maintenances="vehiclesStore.overdueMaintenance"
            :get-vehicle-name="getVehicleName"
            @navigate="handleNavigation"
          />
        </div>
      </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonContent } from '@ionic/vue'
import { useAuthStore } from '@/stores/auth'
import { useVehiclesStore } from '@/stores/vehicles'
import { calculateTotalFuelCost, getEstimatedFuelPrice } from '@/utils/fuelCalculations'
import ModernHeader from '@/components/organisms/ModernHeader.vue'
import QuickActionsSection from './components/QuickActionsSection.vue'
import StatsGrid from './components/StatsGrid.vue'
import FuelSummaryCard from './components/FuelSummaryCard.vue'
import VehiclesList from './components/VehiclesList.vue'
import MaintenanceList from './components/MaintenanceList.vue'

const router = useRouter()
const authStore = useAuthStore()
const vehiclesStore = useVehiclesStore()

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await vehiclesStore.fetchVehicles()
    await vehiclesStore.fetchMaintenanceRecords()
  }
})

const handleNavigation = (path: string) => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }
  setTimeout(() => {
    router.push(path)
  }, 10)
}

const totalCost = computed(() => vehiclesStore.totalMaintenanceCost)
const overdueCount = computed(() => vehiclesStore.overdueMaintenance.length)

const stats = computed(() => ({
  vehicleCount: vehiclesStore.vehicleCount,
  totalMaintenanceRecords: vehiclesStore.totalMaintenanceRecords,
  totalCost: totalCost.value,
  upcomingMaintenanceCount: vehiclesStore.upcomingMaintenance.length,
  overdueCount: overdueCount.value
}))

const totalFuelCosts = computed(() => {
  let totalLiters = 0
  let totalCost = 0
  let totalDistance = 0

  vehiclesStore.vehicles.forEach((vehicle) => {
    if (!vehicle.averageFuelConsumption) return

    const maintenanceRecords = vehiclesStore.maintenanceRecords.filter(
      (r) => r.vehicleId === vehicle.id,
    )

    if (maintenanceRecords.length < 2) return

    const fuelPrice = getEstimatedFuelPrice(vehicle.fuelType)
    const fuelData = calculateTotalFuelCost(maintenanceRecords, vehicle, fuelPrice)

    if (fuelData) {
      totalLiters += fuelData.totalLiters
      totalCost += fuelData.totalCost
      totalDistance += fuelData.totalDistance
    }
  })

  return { totalLiters, totalCost, totalDistance }
})

const hasFuelData = computed(() => {
  return totalFuelCosts.value.totalCost > 0
})

const getVehicleName = (vehicleId: string) => {
  const vehicle = vehiclesStore.getVehicleById(vehicleId)
  return vehicle ? `${vehicle.make} ${vehicle.model}` : 'Veículo desconhecido'
}
</script>

<style scoped lang="scss">
/* ====================================
 MODERN DASHBOARD - 2025 DESIGN
 ==================================== */

/* Container com padding */
.dashboard-container {
  padding: 1rem 1rem 1rem;
}

/* ====================================
 ALERT DANGER - GLASSMORPHISM
 ==================================== */

.alert-danger {
  background: var(--bg-card);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(var(--ion-color-danger-rgb), 0.4);
  border-radius: 16px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.6s ease-out 0.3s backwards;
}

.alert-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.alert-left {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex: 1;
  min-width: 0;
}

.alert-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--red-400);
  flex-shrink: 0;
}

.alert-text {
  font-weight: 500;
  color: var(--ion-text-color);
  font-size: 0.8125rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.alert-btn {
  background: var(--bg-input);
  border: 1px solid var(--border-input);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: var(--ion-text-color);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.alert-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
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
