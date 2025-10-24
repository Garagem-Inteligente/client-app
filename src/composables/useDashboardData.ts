import { ref, computed, readonly, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useVehiclesStore } from '@/stores/vehicles'
import { calculateTotalFuelCost, getEstimatedFuelPrice } from '@/utils/fuelCalculations'

export interface DashboardStats {
  vehicleCount: number
  totalMaintenanceRecords: number
  totalCost: number
  upcomingMaintenanceCount: number
  overdueCount: number
}

export interface FuelCosts {
  totalDistance: number
  totalLiters: number
  totalCost: number
}

export function useDashboardData() {
  const authStore = useAuthStore()
  const vehiclesStore = useVehiclesStore()

  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadDashboardData = async () => {
    if (!authStore.isAuthenticated) return

    loading.value = true
    error.value = null

    try {
      await vehiclesStore.fetchVehicles()
      await vehiclesStore.fetchMaintenanceRecords()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar dados do dashboard'
      console.error('Erro ao carregar dados do dashboard:', err)
    } finally {
      loading.value = false
    }
  }

  const stats = computed<DashboardStats>(() => ({
    vehicleCount: vehiclesStore.vehicleCount,
    totalMaintenanceRecords: vehiclesStore.totalMaintenanceRecords,
    totalCost: vehiclesStore.totalMaintenanceCost,
    upcomingMaintenanceCount: vehiclesStore.upcomingMaintenance.length,
    overdueCount: vehiclesStore.overdueMaintenance.length
  }))

  const totalFuelCosts = computed<FuelCosts>(() => {
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

  const hasFuelData = computed(() => totalFuelCosts.value.totalCost > 0)

  const getVehicleName = (vehicleId: string): string => {
    const vehicle = vehiclesStore.getVehicleById(vehicleId)
    return vehicle ? `${vehicle.make} ${vehicle.model}` : 'Veículo desconhecido'
  }

  onMounted(() => {
    loadDashboardData()
  })

  return {
    loading: readonly(loading),
    error: readonly(error),

    // Dados
    vehicles: computed(() => vehiclesStore.vehicles),
    recentMaintenances: computed(() => vehiclesStore.recentMaintenance),
    upcomingMaintenances: computed(() => vehiclesStore.upcomingMaintenance),
    overdueMaintenances: computed(() => vehiclesStore.overdueMaintenance),

    stats,
    totalFuelCosts,
    hasFuelData,

    getVehicleName,
    loadDashboardData
  }
}