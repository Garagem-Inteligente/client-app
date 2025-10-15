import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Workshop {
  id: string
  name: string
  cnpj?: string
  email?: string
  phone?: string
  address?: string
  ownerId: string
  createdAt: Date
}

export interface ServiceItem {
  id: string
  name: string
  description?: string
  qty: number
  unitPrice: number
}

export type JobStatus = 'draft' | 'open' | 'in-progress' | 'awaiting-approval' | 'completed' | 'cancelled'

export interface JobOrder {
  id: string
  workshopId: string
  vehicleId: string
  customerId?: string
  status: JobStatus
  services: ServiceItem[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export const useWorkshopsStore = defineStore('workshops', () => {
  const workshops = ref<Workshop[]>([])
  const jobOrders = ref<JobOrder[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Placeholders: implementar integração com Firestore em etapas futuras (T007)
  const fetchWorkshops = async () => {
    loading.value = true
    error.value = null
    try {
      // TODO: carregar da coleção 'workshops'
      return [] as Workshop[]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao carregar oficinas'
      return [] as Workshop[]
    } finally {
      loading.value = false
    }
  }

  const fetchJobOrders = async (_workshopId: string) => {
    loading.value = true
    error.value = null
    try {
      // TODO: carregar de 'workshops/{id}/job_orders'
      return [] as JobOrder[]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao carregar ordens de serviço'
      return [] as JobOrder[]
    } finally {
      loading.value = false
    }
  }

  const createWorkshop = async (_input: Omit<Workshop, 'id' | 'createdAt'>) => {
    // TODO: persistir no Firestore
    return { success: true, id: crypto.randomUUID() }
  }

  const createJobOrder = async (_input: Omit<JobOrder, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { status?: JobStatus }) => {
    // TODO: persistir no Firestore
    return { success: true, id: crypto.randomUUID() }
  }

  return {
    // state
    workshops,
    jobOrders,
    loading,
    error,
    // actions
    fetchWorkshops,
    fetchJobOrders,
    createWorkshop,
    createJobOrder
  }
})
