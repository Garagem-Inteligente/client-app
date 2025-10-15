import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  collectionGroup,
  type Query
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuthStore } from './auth'

export interface Workshop {
  id: string
  name: string
  cnpj?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  specialties?: string[]
  workHours?: string
  description?: string
  photos?: string[]
  ownerId: string
  verified: boolean
  rating?: number
  totalReviews: number
  createdAt: Date
  updatedAt: Date
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
  customerEmail?: string
  status: JobStatus
  services: ServiceItem[]
  totalLabor: number
  totalParts: number
  totalCost: number
  notes?: string
  customerComment?: string
  photosBefore?: string[]
  photosAfter?: string[]
  pendingApproval?: boolean
  approvedByCustomer?: boolean
  customerApprovedAt?: Date
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

export interface WorkshopReview {
  id: string
  workshopId: string
  userId: string
  userName: string
  rating: number
  comment?: string
  workshopResponse?: string
  workshopResponseAt?: Date
  createdAt: Date
}

export interface WorkshopInput extends Omit<Workshop, 'id' | 'createdAt' | 'updatedAt' | 'verified' | 'totalReviews'> {}
export interface JobOrderInput extends Omit<JobOrder, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'> {}
export interface ReviewInput extends Omit<WorkshopReview, 'id' | 'createdAt'> {}

export const useWorkshopsStore = defineStore('workshops', () => {
  const authStore = useAuthStore()
  
  const workshops = ref<Workshop[]>([])
  const jobOrders = ref<JobOrder[]>([])
  const reviews = ref<WorkshopReview[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const myWorkshops = computed(() => 
    workshops.value.filter(w => w.ownerId === authStore.user?.id)
  )

  const workshopById = computed(() => (id: string) => 
    workshops.value.find(w => w.id === id)
  )

  const averageRating = computed(() => (workshopId: string) => {
    const workshopReviews = reviews.value.filter(r => r.workshopId === workshopId)
    if (workshopReviews.length === 0) return 0
    const sum = workshopReviews.reduce((acc, r) => acc + r.rating, 0)
    return sum / workshopReviews.length
  })

  // Actions
  const fetchWorkshops = async (filters?: { city?: string; specialty?: string; minRating?: number }) => {
    loading.value = true
    error.value = null
    try {
      let q: Query = collection(db, 'workshops')
      
      const constraints = []
      if (filters?.city) {
        constraints.push(where('city', '==', filters.city))
      }
      if (filters?.specialty) {
        constraints.push(where('specialties', 'array-contains', filters.specialty))
      }
      
      if (constraints.length > 0) {
        q = query(q as any, ...constraints, orderBy('rating', 'desc'))
      } else {
        q = query(q as any, orderBy('createdAt', 'desc'))
      }

      const snapshot = await getDocs(q)
      workshops.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Workshop[]

      // Filtrar por rating se necessário (pós-query)
      if (filters?.minRating) {
        workshops.value = workshops.value.filter(w => 
          (w.rating || 0) >= filters.minRating!
        )
      }

      return workshops.value
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao carregar oficinas'
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchWorkshopById = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const docRef = doc(db, 'workshops', id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const workshop = {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate()
        } as Workshop
        
        // Atualizar no array se já existir
        const index = workshops.value.findIndex(w => w.id === id)
        if (index >= 0) {
          workshops.value[index] = workshop
        } else {
          workshops.value.push(workshop)
        }
        
        return workshop
      }
      
      return null
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao carregar oficina'
      return null
    } finally {
      loading.value = false
    }
  }

  const createWorkshop = async (input: WorkshopInput) => {
    if (!authStore.user?.id) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    loading.value = true
    error.value = null
    try {
      const now = Timestamp.now()
      const workshopData = {
        ...input,
        ownerId: authStore.user.id,
        verified: false,
        totalReviews: 0,
        createdAt: now,
        updatedAt: now
      }

      const docRef = await addDoc(collection(db, 'workshops'), workshopData)
      
      const newWorkshop: Workshop = {
        id: docRef.id,
        ...workshopData,
        createdAt: now.toDate(),
        updatedAt: now.toDate()
      }
      
      workshops.value.push(newWorkshop)
      
      return { success: true, id: docRef.id, workshop: newWorkshop }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao criar oficina'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateWorkshop = async (id: string, data: Partial<WorkshopInput>) => {
    loading.value = true
    error.value = null
    try {
      const docRef = doc(db, 'workshops', id)
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      })

      const index = workshops.value.findIndex(w => w.id === id)
      if (index >= 0) {
        workshops.value[index] = {
          ...workshops.value[index],
          ...data,
          updatedAt: new Date()
        }
      }

      return { success: true }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao atualizar oficina'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchJobOrders = async (workshopId: string, statusFilter?: JobStatus) => {
    loading.value = true
    error.value = null
    try {
      let q: Query = collection(db, 'workshops', workshopId, 'job_orders')
      
      if (statusFilter) {
        q = query(q as any, 
          where('status', '==', statusFilter),
          orderBy('createdAt', 'desc')
        )
      } else {
        q = query(q as any, orderBy('createdAt', 'desc'))
      }

      const snapshot = await getDocs(q)
      jobOrders.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        completedAt: doc.data().completedAt?.toDate()
      })) as JobOrder[]

      return jobOrders.value
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao carregar ordens de serviço'
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchMyJobOrders = async (statusFilter?: JobStatus) => {
    if (!authStore.user?.id) return []
    
    loading.value = true
    error.value = null
    try {
      // Buscar em todas as oficinas (collection group)
      let q: Query = collectionGroup(db, 'job_orders')
      
      if (statusFilter) {
        q = query(q as any,
          where('customerId', '==', authStore.user.id),
          where('status', '==', statusFilter),
          orderBy('createdAt', 'desc')
        )
      } else {
        q = query(q as any,
          where('customerId', '==', authStore.user.id),
          orderBy('createdAt', 'desc')
        )
      }

      const snapshot = await getDocs(q)
      jobOrders.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        completedAt: doc.data().completedAt?.toDate()
      })) as JobOrder[]

      return jobOrders.value
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao carregar suas ordens'
      return []
    } finally {
      loading.value = false
    }
  }

  const createJobOrder = async (workshopId: string, input: JobOrderInput) => {
    loading.value = true
    error.value = null
    try {
      const now = Timestamp.now()
      const orderData = {
        ...input,
        pendingApproval: true, // Por padrão, precisa aprovação do cliente
        createdAt: now,
        updatedAt: now
      }

      const docRef = await addDoc(
        collection(db, 'workshops', workshopId, 'job_orders'),
        orderData
      )

      const newOrder: JobOrder = {
        id: docRef.id,
        ...orderData,
        createdAt: now.toDate(),
        updatedAt: now.toDate()
      }

      jobOrders.value.push(newOrder)

      // Criar notificação para o cliente
      if (input.customerId) {
        try {
          // Buscar nome da oficina
          const workshopDoc = await getDoc(doc(db, 'workshops', workshopId))
          const workshopName = workshopDoc.exists() ? workshopDoc.data().name : 'Uma oficina'
          
          const { useNotificationStore } = await import('./notifications')
          const notificationStore = useNotificationStore()
          
          await notificationStore.addNotification({
            userId: input.customerId,
            type: 'job_order_approval',
            title: 'Nova ordem de serviço',
            message: `${workshopName} cadastrou uma nova ordem de serviço para aprovação.`,
            actionUrl: `/my-job-orders/${docRef.id}`,
            actionLabel: 'Ver detalhes',
            metadata: {
              jobOrderId: docRef.id,
              workshopId: workshopId
            }
          })
        } catch (notifError) {
          console.error('Erro ao criar notificação:', notifError)
          // Não falha se a notificação não puder ser criada
        }
      }

      return { success: true, id: docRef.id, order: newOrder }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao criar ordem de serviço'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateJobOrderStatus = async (
    workshopId: string,
    orderId: string,
    status: JobStatus,
    comment?: string
  ) => {
    loading.value = true
    error.value = null
    try {
      const docRef = doc(db, 'workshops', workshopId, 'job_orders', orderId)
      const updateData: any = {
        status,
        updatedAt: Timestamp.now()
      }

      if (status === 'completed') {
        updateData.completedAt = Timestamp.now()
      }

      if (comment) {
        updateData.customerComment = comment
      }

      await updateDoc(docRef, updateData)

      const index = jobOrders.value.findIndex(o => o.id === orderId)
      if (index >= 0) {
        jobOrders.value[index] = {
          ...jobOrders.value[index],
          status,
          customerComment: comment,
          updatedAt: new Date(),
          ...(status === 'completed' && { completedAt: new Date() })
        }
      }

      return { success: true }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao atualizar status'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateJobOrder = async (
    workshopId: string,
    orderId: string,
    updates: {
      status?: JobStatus
      services?: ServiceItem[]
      notes?: string
      customerComment?: string
      photosBefore?: string[]
      photosAfter?: string[]
    }
  ) => {
    loading.value = true
    error.value = null
    try {
      const docRef = doc(db, 'workshops', workshopId, 'job_orders', orderId)
      
      // Calcular totais se services foi atualizado
      let updateData: any = {
        ...updates,
        updatedAt: Timestamp.now()
      }

      if (updates.services) {
        const totalCost = updates.services.reduce((sum, service) => {
          return sum + (service.qty * service.unitPrice)
        }, 0)
        
        updateData.totalCost = totalCost
        updateData.totalLabor = totalCost * 0.6 // 60% mão de obra (ajustar conforme necessário)
        updateData.totalParts = totalCost * 0.4  // 40% peças
      }

      if (updates.status === 'completed') {
        updateData.completedAt = Timestamp.now()
      }

      await updateDoc(docRef, updateData)

      // Atualizar estado local
      const index = jobOrders.value.findIndex(o => o.id === orderId)
      if (index >= 0) {
        jobOrders.value[index] = {
          ...jobOrders.value[index],
          ...updates,
          updatedAt: new Date(),
          ...(updates.services && {
            totalCost: updateData.totalCost,
            totalLabor: updateData.totalLabor,
            totalParts: updateData.totalParts
          }),
          ...(updates.status === 'completed' && { completedAt: new Date() })
        }
      }

      return { success: true }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao atualizar ordem'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const approveJobOrder = async (workshopId: string, orderId: string) => {
    loading.value = true
    error.value = null
    try {
      const now = Timestamp.now()
      const docRef = doc(db, 'workshops', workshopId, 'job_orders', orderId)
      
      await updateDoc(docRef, {
        pendingApproval: false,
        approvedByCustomer: true,
        customerApprovedAt: now,
        updatedAt: now
      })

      // Atualizar estado local
      const index = jobOrders.value.findIndex(o => o.id === orderId)
      if (index >= 0) {
        jobOrders.value[index] = {
          ...jobOrders.value[index],
          pendingApproval: false,
          approvedByCustomer: true,
          customerApprovedAt: now.toDate(),
          updatedAt: now.toDate()
        }
      }

      return { success: true }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao aprovar ordem de serviço'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchReviews = async (workshopId: string) => {
    loading.value = true
    error.value = null
    try {
      const q = query(
        collection(db, 'workshop_reviews'),
        where('workshopId', '==', workshopId),
        orderBy('createdAt', 'desc')
      )

      const snapshot = await getDocs(q)
      reviews.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as WorkshopReview[]

      return reviews.value
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao carregar avaliações'
      return []
    } finally {
      loading.value = false
    }
  }

  const createReview = async (input: ReviewInput) => {
    if (!authStore.user?.id) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    loading.value = true
    error.value = null
    try {
      const reviewData = {
        ...input,
        userId: authStore.user.id,
        createdAt: Timestamp.now()
      }

      const docRef = await addDoc(collection(db, 'workshop_reviews'), reviewData)

      const newReview: WorkshopReview = {
        id: docRef.id,
        ...reviewData,
        createdAt: reviewData.createdAt.toDate()
      }

      reviews.value.push(newReview)

      // Atualizar contagem de reviews da oficina
      const workshopRef = doc(db, 'workshops', input.workshopId)
      const workshopSnap = await getDoc(workshopRef)
      if (workshopSnap.exists()) {
        const currentTotal = workshopSnap.data().totalReviews || 0
        await updateDoc(workshopRef, {
          totalReviews: currentTotal + 1
        })
      }

      return { success: true, id: docRef.id, review: newReview }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao criar avaliação'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const respondToReview = async (reviewId: string, response: string) => {
    loading.value = true
    error.value = null
    try {
      const reviewRef = doc(db, 'workshop_reviews', reviewId)
      
      await updateDoc(reviewRef, {
        workshopResponse: response,
        workshopResponseAt: Timestamp.now()
      })

      // Atualizar localmente
      const reviewIndex = reviews.value.findIndex(r => r.id === reviewId)
      if (reviewIndex !== -1) {
        reviews.value[reviewIndex] = {
          ...reviews.value[reviewIndex],
          workshopResponse: response,
          workshopResponseAt: new Date()
        }
      }

      return { success: true }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao responder avaliação'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    // state
    workshops,
    jobOrders,
    reviews,
    loading,
    error,
    // computed
    myWorkshops,
    workshopById,
    averageRating,
    // actions
    fetchWorkshops,
    fetchWorkshopById,
    createWorkshop,
    updateWorkshop,
    fetchJobOrders,
    fetchMyJobOrders,
    createJobOrder,
    approveJobOrder,
    updateJobOrderStatus,
    updateJobOrder,
    fetchReviews,
    createReview,
    respondToReview
  }
})
