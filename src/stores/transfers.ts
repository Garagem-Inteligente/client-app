import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot,
  orderBy,
  Unsubscribe
} from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { db, functions } from '@/firebase/config'
import { useAuthStore } from './auth'
import type { Transfer, TransferredVehicle } from '@/types'
import { translateFirebaseError } from '@/utils/errorMessages'

export const useTransfersStore = defineStore('transfers', () => {
  const authStore = useAuthStore()

  // State
  const activeTransfers = ref<Transfer[]>([])
  const transferredVehicles = ref<TransferredVehicle[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  let activeTransfersUnsubscribe: Unsubscribe | null = null
  let transferredVehiclesUnsubscribe: Unsubscribe | null = null

  // Computed
  const pendingTransfersAsSender = computed(() => 
    activeTransfers.value.filter(t => 
      t.fromUserId === authStore.user?.id && 
      (t.status === 'pending' || t.status === 'confirmed')
    )
  )

  const pendingTransfersAsReceiver = computed(() => 
    activeTransfers.value.filter(t => 
      t.toEmail === authStore.userEmail?.toLowerCase() && 
      (t.status === 'pending' || t.status === 'confirmed')
    )
  )

  const completedTransfers = computed(() => 
    activeTransfers.value.filter(t => t.status === 'completed')
  )

  // Actions

  /**
   * Initiate a vehicle transfer
   */
  const initiateTransfer = async (
    vehicleId: string, 
    toEmail: string, 
    message?: string
  ): Promise<{ success: boolean; message: string }> => {
    loading.value = true
    error.value = null

    try {
      const initiateTransferFn = httpsCallable<
        { vehicleId: string; toEmail: string; message?: string },
        { success: boolean; message: string }
      >(functions, 'initiateVehicleTransfer')

      const result = await initiateTransferFn({
        vehicleId,
        toEmail: toEmail.toLowerCase().trim(),
        message: message || undefined
      })

      return result.data
    } catch (err) {
      const errorMsg = translateFirebaseError(err)
      error.value = errorMsg
      throw new Error(errorMsg)
    } finally {
      loading.value = false
    }
  }

  /**
   * Confirm a vehicle transfer with confirmation code
   */
  const confirmTransfer = async (
    transferId: string,
    confirmationCode: string,
    isNewOwner: boolean
  ): Promise<{ success: boolean; message: string }> => {
    loading.value = true
    error.value = null

    try {
      const confirmTransferFn = httpsCallable<
        { transferId: string; confirmationCode: string; isNewOwner: boolean },
        { success: boolean; message: string }
      >(functions, 'confirmVehicleTransfer')

      const result = await confirmTransferFn({
        transferId,
        confirmationCode: confirmationCode.toUpperCase().trim(),
        isNewOwner
      })

      return result.data
    } catch (err) {
      const errorMsg = translateFirebaseError(err)
      error.value = errorMsg
      throw new Error(errorMsg)
    } finally {
      loading.value = false
    }
  }

  /**
   * Cancel a pending vehicle transfer
   */
  const cancelTransfer = async (
    transferId: string
  ): Promise<{ success: boolean; message: string }> => {
    loading.value = true
    error.value = null

    try {
      const cancelTransferFn = httpsCallable<
        { transferId: string },
        { success: boolean; message: string }
      >(functions, 'cancelVehicleTransfer')

      const result = await cancelTransferFn({ transferId })

      return result.data
    } catch (err) {
      const errorMsg = translateFirebaseError(err)
      error.value = errorMsg
      throw new Error(errorMsg)
    } finally {
      loading.value = false
    }
  }

  /**
   * Subscribe to active transfers in real-time
   */
  const subscribeToActiveTransfers = () => {
    if (!authStore.user?.id || !authStore.userEmail) return

    const userId = authStore.user.id
    const userEmail = authStore.userEmail.toLowerCase()

    // Query transfers where user is sender OR receiver
    const transfersQuery = query(
      collection(db, 'transfers'),
      where('fromUserId', '==', userId)
    )

    const transfersQuery2 = query(
      collection(db, 'transfers'),
      where('toEmail', '==', userEmail)
    )

    // Subscribe to both queries
    activeTransfersUnsubscribe = onSnapshot(transfersQuery, (snapshot) => {
      const transfers: Transfer[] = []
      
      snapshot.forEach((doc) => {
        const data = doc.data()
        transfers.push({
          id: doc.id,
          vehicleId: data.vehicleId,
          vehicleName: data.vehicleName,
          vehiclePlate: data.vehiclePlate,
          fromUserId: data.fromUserId,
          fromUserName: data.fromUserName,
          fromUserEmail: data.fromUserEmail,
          toUserId: data.toUserId || undefined,
          toUserName: data.toUserName || undefined,
          toEmail: data.toEmail,
          fromConfirmationCode: data.fromConfirmationCode,
          toConfirmationCode: data.toConfirmationCode,
          fromConfirmed: data.fromConfirmed,
          toConfirmed: data.toConfirmed,
          status: data.status,
          message: data.message || undefined,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          expiresAt: data.expiresAt?.toDate() || new Date(),
          completedAt: data.completedAt?.toDate() || undefined
        })
      })

      activeTransfers.value = transfers
    })

    // Also subscribe to transfers as receiver
    onSnapshot(transfersQuery2, (snapshot) => {
      snapshot.forEach((doc) => {
        const data = doc.data()
        
        // Only add if not already in the list (avoid duplicates)
        const exists = activeTransfers.value.find(t => t.id === doc.id)
        if (!exists) {
          activeTransfers.value.push({
            id: doc.id,
            vehicleId: data.vehicleId,
            vehicleName: data.vehicleName,
            vehiclePlate: data.vehiclePlate,
            fromUserId: data.fromUserId,
            fromUserName: data.fromUserName,
            fromUserEmail: data.fromUserEmail,
            toUserId: data.toUserId || undefined,
            toUserName: data.toUserName || undefined,
            toEmail: data.toEmail,
            fromConfirmationCode: data.fromConfirmationCode,
            toConfirmationCode: data.toConfirmationCode,
            fromConfirmed: data.fromConfirmed,
            toConfirmed: data.toConfirmed,
            status: data.status,
            message: data.message || undefined,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            expiresAt: data.expiresAt?.toDate() || new Date(),
            completedAt: data.completedAt?.toDate() || undefined
          })
        }
      })
    })
  }

  /**
   * Subscribe to transferred vehicles in real-time
   */
  const subscribeToTransferredVehicles = () => {
    if (!authStore.user?.id) return

    const transferredQuery = query(
      collection(db, 'transferredVehicles'),
      where('userId', '==', authStore.user.id),
      orderBy('transferredAt', 'desc')
    )

    transferredVehiclesUnsubscribe = onSnapshot(transferredQuery, (snapshot) => {
      const vehicles: TransferredVehicle[] = []
      
      snapshot.forEach((doc) => {
        const data = doc.data()
        vehicles.push({
          id: doc.id,
          vehicleId: data.vehicleId,
          userId: data.userId,
          transferredAt: data.transferredAt?.toDate() || new Date(),
          transferredTo: data.transferredTo,
          transferId: data.transferId,
          vehicleSnapshot: {
            make: data.vehicleSnapshot?.make || '',
            model: data.vehicleSnapshot?.model || '',
            year: data.vehicleSnapshot?.year || '',
            plate: data.vehicleSnapshot?.plate || '',
            mileage: data.vehicleSnapshot?.mileage || 0,
            imageUrl: data.vehicleSnapshot?.imageUrl || undefined
          }
        })
      })

      transferredVehicles.value = vehicles
    })
  }

  /**
   * Fetch active transfers (one-time)
   */
  const fetchActiveTransfers = async () => {
    if (!authStore.user?.id || !authStore.userEmail) return

    loading.value = true
    error.value = null

    try {
      const userId = authStore.user.id
      const userEmail = authStore.userEmail.toLowerCase()

      // Get transfers as sender
      const senderQuery = query(
        collection(db, 'transfers'),
        where('fromUserId', '==', userId)
      )

      // Get transfers as receiver
      const receiverQuery = query(
        collection(db, 'transfers'),
        where('toEmail', '==', userEmail)
      )

      const [senderSnapshot, receiverSnapshot] = await Promise.all([
        getDocs(senderQuery),
        getDocs(receiverQuery)
      ])

      const transfers: Transfer[] = []
      const processedIds = new Set<string>()

      // Process sender transfers
      senderSnapshot.forEach((doc) => {
        if (!processedIds.has(doc.id)) {
          processedIds.add(doc.id)
          const data = doc.data()
          transfers.push({
            id: doc.id,
            vehicleId: data.vehicleId,
            vehicleName: data.vehicleName,
            vehiclePlate: data.vehiclePlate,
            fromUserId: data.fromUserId,
            fromUserName: data.fromUserName,
            fromUserEmail: data.fromUserEmail,
            toUserId: data.toUserId || undefined,
            toUserName: data.toUserName || undefined,
            toEmail: data.toEmail,
            fromConfirmationCode: data.fromConfirmationCode,
            toConfirmationCode: data.toConfirmationCode,
            fromConfirmed: data.fromConfirmed,
            toConfirmed: data.toConfirmed,
            status: data.status,
            message: data.message || undefined,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            expiresAt: data.expiresAt?.toDate() || new Date(),
            completedAt: data.completedAt?.toDate() || undefined
          })
        }
      })

      // Process receiver transfers
      receiverSnapshot.forEach((doc) => {
        if (!processedIds.has(doc.id)) {
          processedIds.add(doc.id)
          const data = doc.data()
          transfers.push({
            id: doc.id,
            vehicleId: data.vehicleId,
            vehicleName: data.vehicleName,
            vehiclePlate: data.vehiclePlate,
            fromUserId: data.fromUserId,
            fromUserName: data.fromUserName,
            fromUserEmail: data.fromUserEmail,
            toUserId: data.toUserId || undefined,
            toUserName: data.toUserName || undefined,
            toEmail: data.toEmail,
            fromConfirmationCode: data.fromConfirmationCode,
            toConfirmationCode: data.toConfirmationCode,
            fromConfirmed: data.fromConfirmed,
            toConfirmed: data.toConfirmed,
            status: data.status,
            message: data.message || undefined,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            expiresAt: data.expiresAt?.toDate() || new Date(),
            completedAt: data.completedAt?.toDate() || undefined
          })
        }
      })

      activeTransfers.value = transfers
    } catch (err) {
      error.value = translateFirebaseError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch transferred vehicles (one-time)
   */
  const fetchTransferredVehicles = async () => {
    if (!authStore.user?.id) return

    loading.value = true
    error.value = null

    try {
      const transferredQuery = query(
        collection(db, 'transferredVehicles'),
        where('userId', '==', authStore.user.id),
        orderBy('transferredAt', 'desc')
      )

      const snapshot = await getDocs(transferredQuery)
      const vehicles: TransferredVehicle[] = []

      snapshot.forEach((doc) => {
        const data = doc.data()
        vehicles.push({
          id: doc.id,
          vehicleId: data.vehicleId,
          userId: data.userId,
          transferredAt: data.transferredAt?.toDate() || new Date(),
          transferredTo: data.transferredTo,
          transferId: data.transferId,
          vehicleSnapshot: {
            make: data.vehicleSnapshot?.make || '',
            model: data.vehicleSnapshot?.model || '',
            year: data.vehicleSnapshot?.year || '',
            plate: data.vehicleSnapshot?.plate || '',
            mileage: data.vehicleSnapshot?.mileage || 0,
            imageUrl: data.vehicleSnapshot?.imageUrl || undefined
          }
        })
      })

      transferredVehicles.value = vehicles
    } catch (err) {
      error.value = translateFirebaseError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Unsubscribe from all listeners
   */
  const unsubscribeAll = () => {
    if (activeTransfersUnsubscribe) {
      activeTransfersUnsubscribe()
      activeTransfersUnsubscribe = null
    }
    if (transferredVehiclesUnsubscribe) {
      transferredVehiclesUnsubscribe()
      transferredVehiclesUnsubscribe = null
    }
  }

  /**
   * Clear all data
   */
  const clearData = () => {
    activeTransfers.value = []
    transferredVehicles.value = []
    error.value = null
    unsubscribeAll()
  }

  return {
    // State
    activeTransfers,
    transferredVehicles,
    loading,
    error,

    // Computed
    pendingTransfersAsSender,
    pendingTransfersAsReceiver,
    completedTransfers,

    // Actions
    initiateTransfer,
    confirmTransfer,
    cancelTransfer,
    subscribeToActiveTransfers,
    subscribeToTransferredVehicles,
    fetchActiveTransfers,
    fetchTransferredVehicles,
    unsubscribeAll,
    clearData
  }
})
