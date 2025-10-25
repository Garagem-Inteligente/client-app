import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVehiclesStore } from '@/stores/vehicles'
import {
  calculateFuelBetweenMaintenances,
  getEstimatedFuelPrice,
} from '@/utils/fuelCalculations'

export const useMaintenanceDetail = () => {
  const route = useRoute()
  const router = useRouter()
  const vehiclesStore = useVehiclesStore()
  const showDeleteModal = ref(false)

  const maintenanceId = route.params.id as string

  const maintenanceRecord = computed(() => {
    return vehiclesStore.maintenanceRecords.find((r) => r.id === maintenanceId)
  })

  const vehicle = computed(() => {
    if (!maintenanceRecord.value) return null
    return vehiclesStore.getVehicleById(maintenanceRecord.value.vehicleId)
  })

  const fuelConsumptionData = computed(() => {
    if (!maintenanceRecord.value || !vehicle.value || !vehicle.value.averageFuelConsumption) {
      return null
    }

    const allMaintenanceRecords = vehiclesStore.maintenanceRecords
      .filter((r) => r.vehicleId === maintenanceRecord.value!.vehicleId)
      .sort((a, b) => a.mileage - b.mileage)

    const currentIndex = allMaintenanceRecords.findIndex(
      (r) => r.id === maintenanceRecord.value!.id,
    )
    if (currentIndex <= 0) {
      return null
    }

    const previousMaintenance = allMaintenanceRecords[currentIndex - 1]
    const fuelPrice = getEstimatedFuelPrice(vehicle.value.fuelType)

    return calculateFuelBetweenMaintenances(
      previousMaintenance,
      maintenanceRecord.value,
      vehicle.value,
      fuelPrice,
    )
  })

  const goToVehicle = (): void => {
    if (vehicle.value) {
      router.push(`/tabs/vehicle/${vehicle.value.id}`)
    }
  }

  const handleEdit = (): void => {
    router.push(`/tabs/maintenance/${maintenanceId}/edit`)
  }

  const handleDelete = async (): Promise<void> => {
    showDeleteModal.value = true
  }

  const confirmDelete = async (): Promise<void> => {
    const success = await vehiclesStore.deleteMaintenanceRecord(maintenanceId)
    if (success) {
      router.back()
    }
  }

  const initializeData = async (): Promise<void> => {
    if (vehiclesStore.maintenanceRecords.length === 0) {
      await vehiclesStore.fetchMaintenanceRecords()
    }
    if (vehiclesStore.vehicles.length === 0) {
      await vehiclesStore.fetchVehicles()
    }

    if (!maintenanceRecord.value) {
      router.push('/tabs/maintenance')
    }
  }

  onMounted(async () => {
    await initializeData()
  })

  return {
    maintenanceId,
    maintenanceRecord,
    vehicle,
    fuelConsumptionData,
    showDeleteModal,
    goToVehicle,
    handleEdit,
    handleDelete,
    confirmDelete,
  }
}
