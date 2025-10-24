import { computed } from 'vue'
import { useVehiclesStore } from '@/stores/vehicles'
import { formatCurrency } from '@/utils/dashboard'

export function useStats() {
  const vehiclesStore = useVehiclesStore()

  const vehicleCount = computed(() => vehiclesStore.vehicleCount)
  const totalMaintenanceRecords = computed(() => vehiclesStore.totalMaintenanceRecords)
  const totalCost = computed(() => vehiclesStore.totalMaintenanceCost)
  const upcomingMaintenanceCount = computed(() => vehiclesStore.upcomingMaintenance.length)
  const overdueCount = computed(() => vehiclesStore.overdueMaintenance.length)

  const formattedStats = computed(() => ({
    vehicleCount: vehicleCount.value,
    totalMaintenanceRecords: totalMaintenanceRecords.value,
    totalCost: totalCost.value,
    formattedTotalCost: formatCurrency(totalCost.value),
    upcomingMaintenanceCount: upcomingMaintenanceCount.value,
    overdueCount: overdueCount.value
  }))

  return {
    vehicleCount,
    totalMaintenanceRecords,
    totalCost,
    upcomingMaintenanceCount,
    overdueCount,
    formattedStats
  }
}