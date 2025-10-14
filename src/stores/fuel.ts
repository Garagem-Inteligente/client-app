/**
 * Store Pinia para gerenciar registros de abastecimento
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuthStore } from './auth'

export interface FuelRecord {
  id: string
  userId: string
  vehicleId: string
  date: Date
  liters: number
  totalCost: number
  costPerLiter: number
  currentMileage: number
  fuelType: 'gasoline' | 'ethanol' | 'diesel' | 'gnv' | 'electric'
  isFullTank: boolean
  distanceTraveled?: number
  efficiency?: number // km/l ou km/kWh
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface FuelRecordInput {
  vehicleId: string
  date: Date
  liters: number
  totalCost: number
  currentMileage: number
  fuelType: 'gasoline' | 'ethanol' | 'diesel' | 'gnv' | 'electric'
  isFullTank: boolean
  notes?: string
}

export const useFuelStore = defineStore('fuel', () => {
  const authStore = useAuthStore()
  const fuelRecords = ref<FuelRecord[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed: Registros por veículo
  const getRecordsByVehicle = computed(() => {
    return (vehicleId: string) => {
      return fuelRecords.value
        .filter(record => record.vehicleId === vehicleId)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
    }
  })

  // Computed: Eficiência média por veículo
  const getAverageEfficiency = computed(() => {
    return (vehicleId: string) => {
      const records = getRecordsByVehicle.value(vehicleId).filter(r => r.efficiency)
      if (records.length === 0) return 0
      const sum = records.reduce((acc, r) => acc + (r.efficiency || 0), 0)
      return Number((sum / records.length).toFixed(2))
    }
  })

  // Computed: Custo total de combustível por veículo
  const getTotalCostByVehicle = computed(() => {
    return (vehicleId: string) => {
      const records = getRecordsByVehicle.value(vehicleId)
      return records.reduce((acc, r) => acc + r.totalCost, 0)
    }
  })

  // Computed: Último abastecimento por veículo
  const getLastRecord = computed(() => {
    return (vehicleId: string) => {
      const records = getRecordsByVehicle.value(vehicleId)
      return records.length > 0 ? records[0] : null
    }
  })

  // Computed: Eficiência nos últimos 6 meses
  const getEfficiencyTrend = computed(() => {
    return (vehicleId: string) => {
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

      return getRecordsByVehicle.value(vehicleId)
        .filter(r => r.efficiency && r.date >= sixMonthsAgo)
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map(r => ({
          date: r.date,
          efficiency: r.efficiency!,
          mileage: r.currentMileage
        }))
    }
  })

  // Computed: Custos mensais de combustível
  const getMonthlyCosts = computed(() => {
    return (vehicleId: string, months = 6) => {
      const monthsAgo = new Date()
      monthsAgo.setMonth(monthsAgo.getMonth() - months)

      const records = getRecordsByVehicle.value(vehicleId)
        .filter(r => r.date >= monthsAgo)

      const monthlyData: { [key: string]: number } = {}

      records.forEach(record => {
        const monthKey = `${record.date.getFullYear()}-${String(record.date.getMonth() + 1).padStart(2, '0')}`
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + record.totalCost
      })

      return Object.entries(monthlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, cost]) => ({ month, cost }))
    }
  })

  /**
   * Buscar todos os registros do usuário
   */
  const fetchFuelRecords = async () => {
    if (!authStore.user) {
      error.value = 'Usuário não autenticado'
      return
    }

    loading.value = true
    error.value = null

    try {
      const q = query(
        collection(db, 'fuel_records'),
        where('userId', '==', authStore.user.uid),
        orderBy('date', 'desc')
      )

      const querySnapshot = await getDocs(q)
      fuelRecords.value = querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          userId: data.userId,
          vehicleId: data.vehicleId,
          date: data.date.toDate(),
          liters: data.liters,
          totalCost: data.totalCost,
          costPerLiter: data.costPerLiter,
          currentMileage: data.currentMileage,
          fuelType: data.fuelType,
          isFullTank: data.isFullTank,
          distanceTraveled: data.distanceTraveled,
          efficiency: data.efficiency,
          notes: data.notes,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        } as FuelRecord
      })
    } catch (err) {
      console.error('Erro ao buscar registros de combustível:', err)
      error.value = 'Erro ao buscar registros de combustível'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Adicionar novo registro de abastecimento
   */
  const addFuelRecord = async (input: FuelRecordInput) => {
    if (!authStore.user) {
      throw new Error('Usuário não autenticado')
    }

    loading.value = true
    error.value = null

    try {
      // Calcular custo por litro
      const costPerLiter = Number((input.totalCost / input.liters).toFixed(2))

      // Buscar último abastecimento do veículo para calcular eficiência
      const lastRecord = getLastRecord.value(input.vehicleId)
      let distanceTraveled: number | undefined
      let efficiency: number | undefined

      if (lastRecord && input.isFullTank && lastRecord.isFullTank) {
        distanceTraveled = input.currentMileage - lastRecord.currentMileage
        if (distanceTraveled > 0 && input.liters > 0) {
          if (input.fuelType === 'electric') {
            efficiency = Number((distanceTraveled / input.liters).toFixed(2)) // km/kWh
          } else {
            efficiency = Number((distanceTraveled / input.liters).toFixed(2)) // km/l
          }
        }
      }

      const now = Timestamp.now()
      const docRef = await addDoc(collection(db, 'fuel_records'), {
        userId: authStore.user.uid,
        vehicleId: input.vehicleId,
        date: Timestamp.fromDate(input.date),
        liters: input.liters,
        totalCost: input.totalCost,
        costPerLiter,
        currentMileage: input.currentMileage,
        fuelType: input.fuelType,
        isFullTank: input.isFullTank,
        distanceTraveled,
        efficiency,
        notes: input.notes || '',
        createdAt: now,
        updatedAt: now
      })

      const newRecord: FuelRecord = {
        id: docRef.id,
        userId: authStore.user.uid,
        vehicleId: input.vehicleId,
        date: input.date,
        liters: input.liters,
        totalCost: input.totalCost,
        costPerLiter,
        currentMileage: input.currentMileage,
        fuelType: input.fuelType,
        isFullTank: input.isFullTank,
        distanceTraveled,
        efficiency,
        notes: input.notes,
        createdAt: now.toDate(),
        updatedAt: now.toDate()
      }

      fuelRecords.value.unshift(newRecord)
      return newRecord
    } catch (err) {
      console.error('Erro ao adicionar registro de combustível:', err)
      error.value = 'Erro ao adicionar registro de combustível'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Atualizar registro de abastecimento
   */
  const updateFuelRecord = async (id: string, updates: Partial<FuelRecordInput>) => {
    loading.value = true
    error.value = null

    try {
      const docRef = doc(db, 'fuel_records', id)
      const updateData: any = {
        ...updates,
        updatedAt: Timestamp.now()
      }

      if (updates.date) {
        updateData.date = Timestamp.fromDate(updates.date)
      }

      if (updates.totalCost !== undefined && updates.liters !== undefined) {
        updateData.costPerLiter = Number((updates.totalCost / updates.liters).toFixed(2))
      }

      await updateDoc(docRef, updateData)

      // Atualizar localmente
      const index = fuelRecords.value.findIndex(r => r.id === id)
      if (index !== -1) {
        fuelRecords.value[index] = {
          ...fuelRecords.value[index],
          ...updates,
          updatedAt: new Date()
        } as FuelRecord
      }
    } catch (err) {
      console.error('Erro ao atualizar registro:', err)
      error.value = 'Erro ao atualizar registro'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Deletar registro de abastecimento
   */
  const deleteFuelRecord = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await deleteDoc(doc(db, 'fuel_records', id))
      fuelRecords.value = fuelRecords.value.filter(r => r.id !== id)
    } catch (err) {
      console.error('Erro ao deletar registro:', err)
      error.value = 'Erro ao deletar registro'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    fuelRecords,
    loading,
    error,

    // Computed
    getRecordsByVehicle,
    getAverageEfficiency,
    getTotalCostByVehicle,
    getLastRecord,
    getEfficiencyTrend,
    getMonthlyCosts,

    // Actions
    fetchFuelRecords,
    addFuelRecord,
    updateFuelRecord,
    deleteFuelRecord
  }
})
