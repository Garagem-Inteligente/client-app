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
import { logger } from '@/utils/logger'

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
  fipeValue?: number // Valor atual do veículo na tabela FIPE
  fipeCode?: string // Código FIPE para consultas futuras
  // Dados do Seguro
  insuranceCompany?: string
  insurancePhone?: string
  insurancePolicyNumber?: string
  insuranceExpiryDate?: Date
  insuranceValue?: number
  brokerContact?: string // Telefone do corretor de seguro
  // Documentos
  documentCRLV?: string // Base64 do CRLV
  documentInsurancePolicy?: string // Base64 da apólice
  createdAt: Date
  updatedAt: Date
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

export interface WarrantyInfo {
  months: number // Prazo da garantia em meses
  expiryDate: Date // Data de expiração calculada
}

export interface MaintenanceRecord {
  id: string
  vehicleId: string
  type: MaintenanceType
  description: string
  cost: number // Total cost (kept for backward compatibility)
  partsCost?: number // Cost of parts/materials
  laborCost?: number // Cost of labor/service
  warrantyParts?: WarrantyInfo // Garantia das peças
  warrantyLabor?: WarrantyInfo // Garantia da mão de obra
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
  insuranceExpiryDate?: Date | string
  insuranceValue?: number
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
  
  const vehiclesByType = computed(() => {
    const grouped: Record<VehicleType, Vehicle[]> = {
      car: [],
      motorcycle: [],
      van: [],
      truck: [],
      bus: [],
      pickup: []
    }
    
    vehicles.value.forEach(vehicle => {
      grouped[vehicle.vehicleType].push(vehicle)
    })
    
    return grouped
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
      .filter(record => record.date)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5)
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
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) return

    loading.value = true
    error.value = null

    try {
      const vehiclesRef = collection(db, 'vehicles')
      const q = query(
        vehiclesRef,
        where('userId', '==', authStore.user!.id),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      vehicles.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        insuranceExpiryDate: doc.data().insuranceExpiryDate?.toDate()
      })) as Vehicle[]
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar veículos'
    } finally {
      loading.value = false
    }
  }

  const addVehicle = async (vehicleData: VehicleInput) => {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) return false

    loading.value = true
    error.value = null

    try {
      // Converter insuranceExpiryDate para Date se for string
      const insuranceDate = vehicleData.insuranceExpiryDate 
        ? (typeof vehicleData.insuranceExpiryDate === 'string' 
            ? new Date(vehicleData.insuranceExpiryDate) 
            : vehicleData.insuranceExpiryDate)
        : undefined

      const vehicleRef = collection(db, 'vehicles')
      const docRef = await addDoc(vehicleRef, {
        ...vehicleData,
        userId: authStore.user!.id,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        insuranceExpiryDate: insuranceDate ? Timestamp.fromDate(insuranceDate) : null
      })

      // Adicionar o novo veículo à lista local
      const newVehicle: Vehicle = {
        id: docRef.id,
        ...vehicleData,
        userId: authStore.user!.id,
        insuranceExpiryDate: insuranceDate,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      vehicles.value.unshift(newVehicle)

      return true
    } catch (err: any) {
      error.value = err.message || 'Erro ao adicionar veículo'
      return false
    } finally {
      loading.value = false
    }
  }

  const updateVehicle = async (vehicleId: string, vehicleData: Partial<VehicleInput>) => {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) return false

    loading.value = true
    error.value = null

    try {
      // Converter insuranceExpiryDate para Date se for string
      const insuranceDate = vehicleData.insuranceExpiryDate 
        ? (typeof vehicleData.insuranceExpiryDate === 'string' 
            ? new Date(vehicleData.insuranceExpiryDate) 
            : vehicleData.insuranceExpiryDate)
        : undefined

      const vehicleRef = doc(db, 'vehicles', vehicleId)
      await updateDoc(vehicleRef, {
        ...vehicleData,
        updatedAt: Timestamp.now(),
        insuranceExpiryDate: insuranceDate ? Timestamp.fromDate(insuranceDate) : null
      })

      // Atualizar o veículo na lista local
      const index = vehicles.value.findIndex(v => v.id === vehicleId)
      if (index !== -1) {
        vehicles.value[index] = {
          ...vehicles.value[index],
          ...vehicleData,
          insuranceExpiryDate: insuranceDate,
          updatedAt: new Date()
        }
      }

      return true
    } catch (err: any) {
      error.value = err.message || 'Erro ao atualizar veículo'
      return false
    } finally {
      loading.value = false
    }
  }

  const deleteVehicle = async (vehicleId: string) => {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) return false

    loading.value = true
    error.value = null

    try {
      await deleteDoc(doc(db, 'vehicles', vehicleId))

      // Remover o veículo da lista local
      vehicles.value = vehicles.value.filter(v => v.id !== vehicleId)

      return true
    } catch (err: any) {
      error.value = err.message || 'Erro ao excluir veículo'
      return false
    } finally {
      loading.value = false
    }
  }

  const getVehicleById = (vehicleId: string) => {
    return vehicles.value.find(v => v.id === vehicleId)
  }

  // Maintenance Actions
  const fetchMaintenanceRecords = async () => {
    loading.value = true
    error.value = null
    
    try {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return

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
            partsCost: data.partsCost,
            laborCost: data.laborCost,
            warrantyParts: data.warrantyParts ? {
              months: data.warrantyParts.months,
              expiryDate: data.warrantyParts.expiryDate?.toDate()
            } : undefined,
            warrantyLabor: data.warrantyLabor ? {
              months: data.warrantyLabor.months,
              expiryDate: data.warrantyLabor.expiryDate?.toDate()
            } : undefined,
            mileage: data.mileage,
            date: data.date?.toDate() || new Date(),
            nextDueDate: data.nextDueDate?.toDate(),
            nextDueMileage: data.nextDueMileage,
            serviceProvider: data.serviceProvider,
            notes: data.notes,
            attachments: data.attachments?.map((att: any) => ({
              ...att,
              uploadedAt: att.uploadedAt?.toDate() || new Date()
            })),
            beforePhoto: data.beforePhoto,
            afterPhoto: data.afterPhoto,
            createdAt: data.createdAt?.toDate() || new Date()
          })
        })
      }
      
      // Ordenar todas as manutenções por data (mais recentes primeiro)
      fetchedRecords.sort((a, b) => b.date.getTime() - a.date.getTime())
      
      maintenanceRecords.value = fetchedRecords
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar manutenções'
      console.error('Error fetching maintenance records:', err)
    } finally {
      loading.value = false
    }
  }

  const addMaintenanceRecord = async (maintenanceData: Partial<MaintenanceRecord>): Promise<boolean> => {
    logger.info('🚀 addMaintenanceRecord called with:', maintenanceData)
    
    const authStore = useAuthStore()
    if (!authStore.user?.id) {
      logger.error('❌ No authenticated user')
      error.value = 'Usuário não autenticado'
      return false
    }

    loading.value = true
    error.value = null

    try {
      logger.info('📝 Creating maintenance record...')
      
      const newRecord = {
        ...maintenanceData,
        userId: authStore.user.id,
        createdAt: Timestamp.now()
      }

      logger.debug('📦 Record to be saved:', newRecord)

      const docRef = await addDoc(collection(db, 'maintenance'), newRecord)
      logger.info('✅ Record saved with ID:', docRef.id)

      // Recarrega a lista de manutenções
      await fetchMaintenanceRecords(maintenanceData.vehicleId!)
      logger.info('🔄 Maintenance list reloaded')

      return true
    } catch (err) {
      logger.error('❌ Error adding maintenance record:', err)
      logger.error('Error code:', (err as any).code)
      logger.error('Error message:', (err as any).message)
      error.value = translateFirebaseError(err)
      return false
    } finally {
      loading.value = false
    }
  }

  const deleteMaintenanceRecord = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return false

      const recordRef = doc(db, 'maintenance', id)
      await deleteDoc(recordRef)
      
      maintenanceRecords.value = maintenanceRecords.value.filter(r => r.id !== id)
      return true
    } catch (err: any) {
      error.value = err.message || 'Erro ao deletar manutenção'
      console.error('Error deleting maintenance record:', err)
      return false
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
    vehiclesByType,
    getMaintenanceByVehicle,
    upcomingMaintenance,
    overdueMaintenance,
    recentMaintenance,
    totalMaintenanceCost,
    maintenanceStats,
    // Vehicle Actions
    fetchVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicleById,
    // Maintenance Actions
    fetchMaintenanceRecords,
    addMaintenanceRecord,
    deleteMaintenanceRecord,
    // Common
    clearError
  }
})




