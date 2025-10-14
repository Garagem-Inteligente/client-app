import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  doc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuthStore } from './auth'
import { translateFirebaseError } from '@/utils/errorMessages'

// Tipos de veículos disponíveis no Brasil
export type VehicleType = 'car' | 'motorcycle' | 'van' | 'truck' | 'bus' | 'pickup'

// Tipos de combustível disponíveis no Brasil
export type FuelType = 'flex' | 'gasoline' | 'ethanol' | 'diesel' | 'electric' | 'hybrid-plugin' | 'hybrid-mild' | 'gnv'

export interface Vehicle {
  id: string
  userId: string
  vehicleType: VehicleType
  make: string
  model: string
  year: number
  plate: string
  color?: string
  mileage: number
  fuelType: FuelType
  imageUrl?: string // Base64 da imagem do veículo
  // Dados do Seguro
  insuranceCompany?: string
  insurancePhone?: string
  insurancePolicyNumber?: string
  insuranceExpiryDate?: Date
  insuranceValue?: number
  // Documentos
  documentCRLV?: string // Base64 do CRLV
  documentInsurancePolicy?: string // Base64 da apólice
  createdAt: Date
  updatedAt: Date
}

export interface VehicleInput {
  vehicleType: VehicleType
  make: string
  model: string
  year: number
  plate: string
  color?: string
  mileage: number
  fuelType: FuelType
  imageUrl?: string
  insuranceCompany?: string
  insurancePhone?: string
  insurancePolicyNumber?: string
  insuranceExpiryDate?: Date
  insuranceValue?: number
}

export interface MaintenanceAttachment {
  name: string
  data: string // Base64 string (ex: "data:image/jpeg;base64,...")
  uploadedAt: Date
  type: string
  size: number
}

export type MaintenanceType = 
  | 'oil_change'
  | 'oil_filter'
  | 'air_filter'
  | 'fuel_filter'
  | 'cabin_filter'
  | 'tire_rotation'
  | 'tire_replacement'
  | 'wheel_alignment'
  | 'wheel_balancing'
  | 'brake_pads'
  | 'brake_discs'
  | 'brake_fluid'
  | 'battery'
  | 'spark_plugs'
  | 'timing_belt'
  | 'serpentine_belt'
  | 'coolant'
  | 'transmission_fluid'
  | 'power_steering_fluid'
  | 'windshield_wipers'
  | 'air_conditioning'
  | 'suspension'
  | 'exhaust_system'
  | 'general_inspection'
  | 'other'

export interface MaintenanceRecord {
  id: string
  vehicleId: string
  type: MaintenanceType
  description: string
  cost: number // Total cost (kept for backward compatibility)
  partsCost?: number // Cost of parts/materials
  laborCost?: number // Cost of labor/service
  mileage: number
  date: Date
  nextDueDate?: Date
  nextDueMileage?: number
  serviceProvider?: string
  notes?: string
  attachments?: MaintenanceAttachment[]
  beforePhoto?: string // Base64 encoded image of part before maintenance
  afterPhoto?: string // Base64 encoded image of part after maintenance
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

  const recentMaintenance = computed(() => {
    return maintenanceRecords.value
      .filter(record => record.date) // Apenas registros com data definida
      .sort((a, b) => b.date.getTime() - a.date.getTime()) // Mais recentes primeiro
      .slice(0, 5) // Limitar a 5 registros
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
          vehicleType: data.vehicleType || 'car', // Migração: padrão carro
          make: data.make,
          model: data.model,
          year: data.year,
          plate: data.plate,
          color: data.color,
          mileage: data.mileage,
          fuelType: data.fuelType || 'flex', // Migração: padrão flex
          imageUrl: data.imageUrl,
          insuranceCompany: data.insuranceCompany,
          insurancePhone: data.insurancePhone,
          insurancePolicyNumber: data.insurancePolicyNumber,
          insuranceExpiryDate: data.insuranceExpiryDate?.toDate(),
          insuranceValue: data.insuranceValue,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        })
      })
      
      vehicles.value = fetchedVehicles
    } catch (err) {
      error.value = translateFirebaseError(err, 'Falha ao buscar veículos')
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
      error.value = translateFirebaseError(err, 'Falha ao adicionar veículo')
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
      error.value = translateFirebaseError(err, 'Falha ao atualizar veículo')
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
      error.value = translateFirebaseError(err, 'Falha ao deletar veículo')
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

      // Se não há veículos, não há manutenções para buscar
      if (vehicles.value.length === 0) {
        maintenanceRecords.value = []
        return
      }

      // Buscar manutenções para cada veículo do usuário
      const maintenanceRef = collection(db, 'maintenance')
      const fetchedRecords: MaintenanceRecord[] = []
      
      // Para cada veículo do usuário, buscar suas manutenções
      for (const vehicle of vehicles.value) {
        const q = query(
          maintenanceRef,
          where('vehicleId', '==', vehicle.id),
          orderBy('date', 'desc')
        )
        
        const querySnapshot = await getDocs(q)
        
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
      }
      
      // Ordenar todas as manutenções por data (mais recentes primeiro)
      fetchedRecords.sort((a, b) => b.date.getTime() - a.date.getTime())
      
      maintenanceRecords.value = fetchedRecords
    } catch (err) {
      error.value = translateFirebaseError(err, 'Falha ao buscar manutenções')
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
      
      // Preparar dados removendo campos undefined
      const newRecordData: any = {
        vehicleId: recordData.vehicleId,
        type: recordData.type,
        description: recordData.description,
        cost: recordData.cost,
        mileage: recordData.mileage,
        date: recordData.date instanceof Date ? Timestamp.fromDate(recordData.date) : now,
        createdAt: now
      }
      
      // Persist attachments if present, mapping uploadedAt to Timestamp
      if (recordData.attachments && Array.isArray(recordData.attachments)) {
        newRecordData.attachments = recordData.attachments.map(att => ({
          ...att,
          uploadedAt: att.uploadedAt instanceof Date
            ? Timestamp.fromDate(att.uploadedAt)
            : att.uploadedAt
        }))
      }
      
      // Adicionar campos opcionais apenas se tiverem valor
      if (recordData.nextDueDate) {
        newRecordData.nextDueDate = Timestamp.fromDate(recordData.nextDueDate)
      }
      
      if (recordData.nextDueMileage !== undefined && recordData.nextDueMileage !== null && recordData.nextDueMileage !== 0) {
        newRecordData.nextDueMileage = recordData.nextDueMileage
      }
      
      if (recordData.serviceProvider) {
        newRecordData.serviceProvider = recordData.serviceProvider
      }
      
      if (recordData.notes) {
        newRecordData.notes = recordData.notes
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
      error.value = translateFirebaseError(err, 'Falha ao adicionar manutenção')
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
      error.value = translateFirebaseError(err, 'Falha ao deletar manutenção')
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
    recentMaintenance,
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