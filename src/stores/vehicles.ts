import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Vehicle {
  id: string
  userId: string
  make: string
  model: string
  year: number
  plate: string
  color?: string
  mileage: number
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid'
  createdAt: Date
  updatedAt: Date
}

export interface MaintenanceRecord {
  id: string
  vehicleId: string
  type: 'oil_change' | 'tire_rotation' | 'brake_service' | 'general_inspection' | 'other'
  description: string
  cost: number
  mileage: number
  date: Date
  nextDueDate?: Date
  nextDueMileage?: number
  serviceProvider?: string
  notes?: string
  createdAt: Date
}

export const useVehiclesStore = defineStore('vehicles', () => {
  // State
  const vehicles = ref<Vehicle[]>([])
  const maintenanceRecords = ref<MaintenanceRecord[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const vehicleCount = computed(() => vehicles.value.length)
  const totalMaintenanceRecords = computed(() => maintenanceRecords.value.length)
  
  const getVehicleById = computed(() => {
    return (id: string) => vehicles.value.find(v => v.id === id)
  })
  
  const getMaintenanceByVehicle = computed(() => {
    return (vehicleId: string) => 
      maintenanceRecords.value
        .filter(record => record.vehicleId === vehicleId)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
  })

  const upcomingMaintenance = computed(() => {
    const now = new Date()
    return maintenanceRecords.value
      .filter(record => record.nextDueDate && record.nextDueDate > now)
      .sort((a, b) => (a.nextDueDate!.getTime() - b.nextDueDate!.getTime()))
      .slice(0, 5)
  })

  // Actions
  const fetchVehicles = async () => {
    loading.value = true
    error.value = null
    
    try {
      // TODO: Implement Firestore fetch
      console.log('Fetching vehicles...')
      
      // Simulate data for now
      vehicles.value = [
        {
          id: '1',
          userId: '1',
          make: 'Toyota',
          model: 'Corolla',
          year: 2020,
          plate: 'ABC-1234',
          color: 'Branco',
          mileage: 45000,
          fuelType: 'gasoline',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch vehicles'
    } finally {
      loading.value = false
    }
  }

  const addVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true
    error.value = null
    
    try {
      // TODO: Implement Firestore add
      const newVehicle: Vehicle = {
        ...vehicleData,
        id: Date.now().toString(),
        userId: '1', // TODO: Get from auth store
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      vehicles.value.push(newVehicle)
      return newVehicle
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add vehicle'
      return null
    } finally {
      loading.value = false
    }
  }

  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    loading.value = true
    error.value = null
    
    try {
      // TODO: Implement Firestore update
      const index = vehicles.value.findIndex(v => v.id === id)
      if (index !== -1) {
        vehicles.value[index] = {
          ...vehicles.value[index],
          ...updates,
          updatedAt: new Date()
        }
        return vehicles.value[index]
      }
      return null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update vehicle'
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteVehicle = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      // TODO: Implement Firestore delete
      vehicles.value = vehicles.value.filter(v => v.id !== id)
      // Also remove related maintenance records
      maintenanceRecords.value = maintenanceRecords.value.filter(r => r.vehicleId !== id)
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete vehicle'
      return false
    } finally {
      loading.value = false
    }
  }

  const addMaintenanceRecord = async (recordData: Omit<MaintenanceRecord, 'id' | 'createdAt'>) => {
    loading.value = true
    error.value = null
    
    try {
      // TODO: Implement Firestore add
      const newRecord: MaintenanceRecord = {
        ...recordData,
        id: Date.now().toString(),
        createdAt: new Date()
      }
      
      maintenanceRecords.value.push(newRecord)
      return newRecord
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add maintenance record'
      return null
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    vehicles,
    maintenanceRecords,
    loading,
    error,
    // Getters
    vehicleCount,
    totalMaintenanceRecords,
    getVehicleById,
    getMaintenanceByVehicle,
    upcomingMaintenance,
    // Actions
    fetchVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addMaintenanceRecord,
    clearError
  }
})