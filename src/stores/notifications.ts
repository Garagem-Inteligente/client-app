/**
 * Store Pinia para gerenciar notificações do usuário
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
  Timestamp,
  writeBatch
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuthStore } from './auth'

export type NotificationType = 'maintenance' | 'transfer' | 'insurance' | 'system' | 'job_order_approval' | 'review_response'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  actionUrl?: string // URL para navegar ao clicar (ex: /vehicles/123)
  actionLabel?: string // Label do botão de ação (ex: "Ver veículo")
  metadata?: {
    jobOrderId?: string
    workshopId?: string
    reviewId?: string
  }
  createdAt: Date
}

export interface NotificationInput {
  userId?: string // Opcional para permitir notificações para outros usuários
  type: NotificationType
  title: string
  message: string
  actionUrl?: string
  actionLabel?: string
  metadata?: {
    jobOrderId?: string
    workshopId?: string
    reviewId?: string
  }
}

export const useNotificationStore = defineStore('notifications', () => {
  const authStore = useAuthStore()
  const notifications = ref<Notification[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed: Notificações não lidas
  const unreadNotifications = computed(() => {
    return notifications.value.filter(n => !n.read)
  })

  // Computed: Contagem de não lidas
  const unreadCount = computed(() => unreadNotifications.value.length)

  // Computed: Notificações por tipo
  const getByType = computed(() => {
    return (type: NotificationType) => {
      return notifications.value.filter(n => n.type === type)
    }
  })

  /**
   * Buscar todas as notificações do usuário
   */
  const fetchNotifications = async () => {
    if (!authStore.user) {
      error.value = 'Usuário não autenticado'
      return
    }

    loading.value = true
    error.value = null

    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', authStore.user.id),
        orderBy('createdAt', 'desc')
      )

      const querySnapshot = await getDocs(q)
      notifications.value = querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          userId: data.userId,
          type: data.type,
          title: data.title,
          message: data.message,
          read: data.read || false,
          actionUrl: data.actionUrl,
          actionLabel: data.actionLabel,
          metadata: data.metadata,
          createdAt: data.createdAt.toDate()
        } as Notification
      })
    } catch (err) {
      console.error('Erro ao buscar notificações:', err)
      error.value = 'Erro ao buscar notificações'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Adicionar nova notificação
   */
  const addNotification = async (input: NotificationInput) => {
    // Se userId não for fornecido, usa o usuário autenticado
    const targetUserId = input.userId || authStore.user?.id
    
    if (!targetUserId) {
      throw new Error('Usuário não especificado')
    }

    loading.value = true
    error.value = null

    try {
      const now = Timestamp.now()
      const docRef = await addDoc(collection(db, 'notifications'), {
        userId: targetUserId,
        type: input.type,
        title: input.title,
        message: input.message,
        read: false,
        actionUrl: input.actionUrl || null,
        actionLabel: input.actionLabel || null,
        metadata: input.metadata || null,
        createdAt: now
      })

      const newNotification: Notification = {
        id: docRef.id,
        userId: targetUserId,
        type: input.type,
        title: input.title,
        message: input.message,
        read: false,
        actionUrl: input.actionUrl,
        actionLabel: input.actionLabel,
        metadata: input.metadata,
        createdAt: now.toDate()
      }

      // Só adiciona no array se for notificação do usuário atual
      if (targetUserId === authStore.user?.id) {
        notifications.value.unshift(newNotification)
      }
      
      return newNotification
    } catch (err) {
      console.error('Erro ao adicionar notificação:', err)
      error.value = 'Erro ao adicionar notificação'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Marcar notificação como lida
   */
  const markAsRead = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const docRef = doc(db, 'notifications', id)
      await updateDoc(docRef, {
        read: true
      })

      const index = notifications.value.findIndex(n => n.id === id)
      if (index !== -1) {
        notifications.value[index].read = true
      }
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err)
      error.value = 'Erro ao marcar notificação como lida'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Marcar todas as notificações como lidas
   */
  const markAllAsRead = async () => {
    if (!authStore.user) return

    loading.value = true
    error.value = null

    try {
      const batch = writeBatch(db)
      const unread = unreadNotifications.value

      unread.forEach(notification => {
        const docRef = doc(db, 'notifications', notification.id)
        batch.update(docRef, { read: true })
      })

      await batch.commit()

      // Atualizar localmente
      notifications.value.forEach(n => {
        n.read = true
      })
    } catch (err) {
      console.error('Erro ao marcar todas como lidas:', err)
      error.value = 'Erro ao marcar todas como lidas'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Deletar notificação
   */
  const deleteNotification = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await deleteDoc(doc(db, 'notifications', id))
      notifications.value = notifications.value.filter(n => n.id !== id)
    } catch (err) {
      console.error('Erro ao deletar notificação:', err)
      error.value = 'Erro ao deletar notificação'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Criar notificação de manutenção vencida
   */
  const createMaintenanceNotification = async (vehicleId: string, vehicleName: string, maintenanceType: string) => {
    await addNotification({
      type: 'maintenance',
      title: 'Manutenção Vencida',
      message: `A manutenção "${maintenanceType}" do veículo ${vehicleName} está vencida!`,
      actionUrl: `/vehicles/${vehicleId}`,
      actionLabel: 'Ver veículo'
    })
  }

  /**
   * Criar notificação de transferência
   */
  const createTransferNotification = async (vehicleId: string, vehicleName: string) => {
    await addNotification({
      type: 'transfer',
      title: 'Transferência Recebida',
      message: `Você recebeu a transferência do veículo ${vehicleName}`,
      actionUrl: `/vehicles/${vehicleId}`,
      actionLabel: 'Ver veículo'
    })
  }

  /**
   * Criar notificação de seguro vencendo
   */
  const createInsuranceNotification = async (vehicleId: string, vehicleName: string, daysRemaining: number) => {
    await addNotification({
      type: 'insurance',
      title: 'Seguro Vencendo',
      message: `O seguro do veículo ${vehicleName} vence em ${daysRemaining} dias`,
      actionUrl: `/vehicles/${vehicleId}`,
      actionLabel: 'Ver veículo'
    })
  }

  return {
    // State
    notifications,
    loading,
    error,

    // Computed
    unreadNotifications,
    unreadCount,
    getByType,

    // Actions
    fetchNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createMaintenanceNotification,
    createTransferNotification,
    createInsuranceNotification
  }
})
