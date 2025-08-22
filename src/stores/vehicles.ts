import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuthStore } from './auth'

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

export interface VehicleInput {
  make: string
  model: string
  year: number
  plate: string
  color?: string
  mileage: number
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid'
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
      const authStore = useAuthStore()
      if (!authStore.user?.id) {
        throw new Error('Usuário não autenticado')
      }

      const vehiclesRef = collection(db, 'vehicles')
      const q = query(
        vehiclesRef, 
        where('userId', '==', authStore.user.id),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const fetchedVehicles: Vehicle[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        fetchedVehicles.push({
          id: doc.id,
          userId: data.userId,
          make: data.make,
          model: data.model,
          year: data.year,
          plate: data.plate,
          color: data.color,
          mileage: data.mileage,
          fuelType: data.fuelType,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        })
      })
      
      vehicles.value = fetchedVehicles
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao buscar veículos'
      console.error('Error fetching vehicles:', err)
    } finally {
      loading.value = false
    }
  }

  const addVehicle = async (vehicleData: VehicleInput) => {
    loading.value = true
    error.value = null
    
    try {
      const authStore = useAuthStore()
      if (!authStore.user?.id) {
        throw new Error('Usuário não autenticado')
      }

      const vehiclesRef = collection(db, 'vehicles')
      const now = Timestamp.now()
      
      const newVehicleData = {
        ...vehicleData,
        userId: authStore.user.id,
        createdAt: now,
        updatedAt: now
      }
      
      const docRef = await addDoc(vehiclesRef, newVehicleData)
      
      const newVehicle: Vehicle = {
        id: docRef.id,
        ...vehicleData,
        userId: authStore.user.id,
        createdAt: now.toDate(),
        updatedAt: now.toDate()
      }
      
      vehicles.value.unshift(newVehicle)
      return newVehicle
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao adicionar veículo'
      console.error('Error adding vehicle:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateVehicle = async (id: string, vehicleData: Partial<VehicleInput>) => {
    loading.value = true
    error.value = null
    
    try {
      const authStore = useAuthStore()
      if (!authStore.user?.id) {
        throw new Error('Usuário não autenticado')
      }

      const vehicleRef = doc(db, 'vehicles', id)
      const updateData = {
        ...vehicleData,
        updatedAt: Timestamp.now()
      }
      
      await updateDoc(vehicleRef, updateData)
      
      const index = vehicles.value.findIndex(v => v.id === id)
      if (index !== -1) {
        vehicles.value[index] = {
          ...vehicles.value[index],
          ...vehicleData,
          updatedAt: new Date()
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao atualizar veículo'
      console.error('Error updating vehicle:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteVehicle = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      const authStore = useAuthStore()
      if (!authStore.user?.id) {
        throw new Error('Usuário não autenticado')
      }

      const vehicleRef = doc(db, 'vehicles', id)
      await deleteDoc(vehicleRef)
      
      vehicles.value = vehicles.value.filter(v => v.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao deletar veículo'
      console.error('Error deleting vehicle:', err)
      throw err
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