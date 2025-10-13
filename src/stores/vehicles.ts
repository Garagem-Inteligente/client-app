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
  })

  const overdueMaintenance = computed(() => {
    const now = new Date()
    return maintenanceRecords.value
      .filter(record => record.nextDueDate && record.nextDueDate < now)
      .sort((a, b) => (a.nextDueDate!.getTime() - b.nextDueDate!.getTime()))
  })

  const totalMaintenanceCost = computed(() => {
    return maintenanceRecords.value.reduce((total, record) => total + record.cost, 0)
  })

  const maintenanceStats = computed(() => {
    const stats = {
      total: maintenanceRecords.value.length,
      totalCost: totalMaintenanceCost.value,
      upcoming: upcomingMaintenance.value.length,
      overdue: overdueMaintenance.value.length,
      byType: {} as Record<string, number>
    }

    maintenanceRecords.value.forEach(record => {
      stats.byType[record.type] = (stats.byType[record.type] || 0) + 1
    })

    return stats
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

  const fetchMaintenanceRecords = async () => {
    loading.value = true
    error.value = null
    
    try {
      const authStore = useAuthStore()
      if (!authStore.user?.id) {
        throw new Error('Usuário não autenticado')
      }

      const maintenanceRef = collection(db, 'maintenance')
      const q = query(
        maintenanceRef,
        where('userId', '==', authStore.user.id),
        orderBy('date', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const fetchedRecords: MaintenanceRecord[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        fetchedRecords.push({
          id: doc.id,
          vehicleId: data.vehicleId,
          type: data.type,
          description: data.description,
          cost: data.cost,
          mileage: data.mileage,
          date: data.date?.toDate() || new Date(),
          nextDueDate: data.nextDueDate?.toDate(),
          nextDueMileage: data.nextDueMileage,
          serviceProvider: data.serviceProvider,
          notes: data.notes,
          createdAt: data.createdAt?.toDate() || new Date()
        })
      })
      
      maintenanceRecords.value = fetchedRecords
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao buscar manutenções'
      console.error('Error fetching maintenance records:', err)
    } finally {
      loading.value = false
    }
  }

  const addMaintenanceRecord = async (recordData: Omit<MaintenanceRecord, 'id' | 'createdAt'>) => {
    loading.value = true
    error.value = null
    
    try {
      const authStore = useAuthStore()
      if (!authStore.user?.id) {
        throw new Error('Usuário não autenticado')
      }

      const maintenanceRef = collection(db, 'maintenance')
      const now = Timestamp.now()
      
      const newRecordData = {
        ...recordData,
        userId: authStore.user.id,
        date: recordData.date instanceof Date ? Timestamp.fromDate(recordData.date) : now,
        nextDueDate: recordData.nextDueDate ? Timestamp.fromDate(recordData.nextDueDate) : null,
        createdAt: now
      }
      
      const docRef = await addDoc(maintenanceRef, newRecordData)
      
      const newRecord: MaintenanceRecord = {
        id: docRef.id,
        ...recordData,
        createdAt: now.toDate()
      }
      
      maintenanceRecords.value.unshift(newRecord)
      return newRecord
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao adicionar manutenção'
      console.error('Error adding maintenance record:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteMaintenanceRecord = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      const authStore = useAuthStore()
      if (!authStore.user?.id) {
        throw new Error('Usuário não autenticado')
      }

      const recordRef = doc(db, 'maintenance', id)
      await deleteDoc(recordRef)
      
      maintenanceRecords.value = maintenanceRecords.value.filter(r => r.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Falha ao deletar manutenção'
      console.error('Error deleting maintenance record:', err)
      throw err
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
    overdueMaintenance,
    totalMaintenanceCost,
    maintenanceStats,
    // Actions
    fetchVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    fetchMaintenanceRecords,
    addMaintenanceRecord,
    deleteMaintenanceRecord,
    clearError
  }
})