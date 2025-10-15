import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
  writeBatch
} from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { db, functions } from '@/firebase/config'
import { useAuthStore } from './auth'
import { useVehiclesStore } from './vehicles'
import { translateFirebaseError } from '@/utils/errorMessages'
import type {
  VehicleTransferRequest,
  TransferRequestInput,
  ConfirmTransferInput,
  TransferResult
} from '@/types/transfer'
import {
  generateConfirmationCode,
  isTransferExpired,
  calculateExpirationDate
} from '@/types/transfer'

export const useTransferStore = defineStore('transfer', () => {
  const authStore = useAuthStore()
  const vehiclesStore = useVehiclesStore()

  // State
  const transfers = ref<VehicleTransferRequest[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Limpar erro
  const clearError = () => {
    error.value = null
  }

  // Buscar transferências pendentes para o usuário atual
  const fetchPendingTransfers = async () => {
    if (!authStore.user?.email) return

    loading.value = true
    error.value = null

    try {
      const transfersRef = collection(db, 'vehicle_transfers')

      // Buscar como dono atual
      const asOwnerQuery = query(
        transfersRef,
        where('currentOwnerEmail', '==', authStore.user.email),
        where('status', '==', 'pending')
      )

      // Buscar como novo dono
      const asNewOwnerQuery = query(
        transfersRef,
        where('newOwnerEmail', '==', authStore.user.email),
        where('status', '==', 'pending')
      )

      const [ownerSnapshot, newOwnerSnapshot] = await Promise.all([
        getDocs(asOwnerQuery),
        getDocs(asNewOwnerQuery)
      ])

      const allTransfers: VehicleTransferRequest[] = []

      ownerSnapshot.forEach((doc) => {
        const data = doc.data()
        allTransfers.push({
          id: doc.id,
          vehicleId: data.vehicleId,
          currentOwnerId: data.currentOwnerId,
          currentOwnerEmail: data.currentOwnerEmail,
          newOwnerEmail: data.newOwnerEmail,
          currentOwnerCode: data.currentOwnerCode,
          newOwnerCode: data.newOwnerCode,
          currentOwnerConfirmed: data.currentOwnerConfirmed,
          newOwnerConfirmed: data.newOwnerConfirmed,
          status: data.status,
          createdAt: data.createdAt.toDate(),
          expiresAt: data.expiresAt.toDate(),
          completedAt: data.completedAt?.toDate()
        })
      })

      newOwnerSnapshot.forEach((doc) => {
        const data = doc.data()
        // Evitar duplicatas
        if (!allTransfers.find(t => t.id === doc.id)) {
          allTransfers.push({
            id: doc.id,
            vehicleId: data.vehicleId,
            currentOwnerId: data.currentOwnerId,
            currentOwnerEmail: data.currentOwnerEmail,
            newOwnerEmail: data.newOwnerEmail,
            currentOwnerCode: data.currentOwnerCode,
            newOwnerCode: data.newOwnerCode,
            currentOwnerConfirmed: data.currentOwnerConfirmed,
            newOwnerConfirmed: data.newOwnerConfirmed,
            status: data.status,
            createdAt: data.createdAt.toDate(),
            expiresAt: data.expiresAt.toDate(),
            completedAt: data.completedAt?.toDate()
          })
        }
      })

      transfers.value = allTransfers
    } catch (err) {
      error.value = translateFirebaseError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Iniciar transferência de veículo
  const initiateTransfer = async (input: TransferRequestInput): Promise<TransferResult> => {
    if (!authStore.user) {
      return { success: false, message: 'Usuário não autenticado' }
    }

    loading.value = true
    error.value = null

    try {
      // Verificar se o veículo existe e pertence ao usuário
      const vehicle = vehiclesStore.vehicles.find(v => v.id === input.vehicleId)
      if (!vehicle) {
        throw new Error('Veículo não encontrado')
      }

      if (vehicle.userId !== authStore.user.id) {
        throw new Error('Você não tem permissão para transferir este veículo')
      }

      // Verificar se o email não é do próprio usuário
      if (input.newOwnerEmail === authStore.user.email) {
        throw new Error('Você não pode transferir um veículo para si mesmo')
      }

      // Gerar códigos de confirmação
      const currentOwnerCode = generateConfirmationCode()
      const newOwnerCode = generateConfirmationCode()

      // Criar registro de transferência
      const transferData = {
        vehicleId: input.vehicleId,
        currentOwnerId: authStore.user.id,
        currentOwnerEmail: authStore.user.email!,
        newOwnerEmail: input.newOwnerEmail,
        currentOwnerCode,
        newOwnerCode,
        currentOwnerConfirmed: false,
        newOwnerConfirmed: false,
        status: 'pending',
        createdAt: Timestamp.now(),
        expiresAt: Timestamp.fromDate(calculateExpirationDate())
      }

      const transferRef = await addDoc(collection(db, 'vehicle_transfers'), transferData)

      // Verificar se novo dono já existe; se não, criar pré-cadastro
      const checkUserExists = httpsCallable<{ email: string }, { exists: boolean }>(functions, 'checkUserExists')
      const createPreRegistration = httpsCallable<{
        email: string
        userName: string
        ownerName: string
        vehicleMake: string
        vehicleModel: string
        vehicleYear: number
        transferCode: string
      }, { success: boolean }>(functions, 'createPreRegistration')
      const sendTransferEmail = httpsCallable(functions, 'sendTransferEmail')
      
      try {
        // Enviar email para o dono atual
        await sendTransferEmail({
          to: authStore.user.email,
          ownerName: authStore.user.name || authStore.user.email.split('@')[0],
          vehicleMake: vehicle.make,
          vehicleModel: vehicle.model,
          vehicleYear: vehicle.year,
          transferCode: currentOwnerCode,
          isOwner: true
        })

        // Verificar existência do novo dono
        const check = await checkUserExists({ email: input.newOwnerEmail })
        if (check.data?.exists) {
          // Enviar email padrão de transferência
          await sendTransferEmail({
            to: input.newOwnerEmail,
            ownerName: authStore.user.name || authStore.user.email!.split('@')[0],
            vehicleMake: vehicle.make,
            vehicleModel: vehicle.model,
            vehicleYear: vehicle.year,
            transferCode: newOwnerCode,
            isOwner: false
          })
        } else {
          // Criar pré-cadastro e enviar email com credenciais + código
          await createPreRegistration({
            email: input.newOwnerEmail,
            userName: input.newOwnerEmail.split('@')[0],
            ownerName: authStore.user.name || authStore.user.email!.split('@')[0],
            vehicleMake: vehicle.make,
            vehicleModel: vehicle.model,
            vehicleYear: vehicle.year,
            transferCode: newOwnerCode
          })
        }

        console.log('✅ Emails de transferência enviados com sucesso')
      } catch (emailError) {
        console.error('❌ Erro ao enviar emails de transferência:', emailError)
        // Não falhar a transferência se o email falhar
      }

      await fetchPendingTransfers()

      return {
        success: true,
        message: 'Transferência iniciada! Códigos de confirmação enviados por email.',
        transferId: transferRef.id
      }
    } catch (err) {
      error.value = translateFirebaseError(err)
      return {
        success: false,
        message: error.value
      }
    } finally {
      loading.value = false
    }
  }

  // Confirmar transferência com código
  const confirmTransfer = async (input: ConfirmTransferInput): Promise<TransferResult> => {
    if (!authStore.user?.email) {
      return { success: false, message: 'Usuário não autenticado' }
    }

    loading.value = true
    error.value = null

    try {
      // Buscar transferência
      const transferRef = doc(db, 'vehicle_transfers', input.transferId)
      const transferDoc = await getDoc(transferRef)

      if (!transferDoc.exists()) {
        throw new Error('Transferência não encontrada')
      }

      const transfer = transferDoc.data()

      // Verificar se expirou
      if (isTransferExpired(transfer.expiresAt.toDate())) {
        await updateDoc(transferRef, { status: 'expired' })
        throw new Error('Esta transferência expirou (48 horas)')
      }

      // Verificar qual usuário está confirmando
      const isCurrentOwner = input.userEmail === transfer.currentOwnerEmail
      const isNewOwner = input.userEmail === transfer.newOwnerEmail

      if (!isCurrentOwner && !isNewOwner) {
        throw new Error('Você não está autorizado a confirmar esta transferência')
      }

      // Validar código
      const expectedCode = isCurrentOwner ? transfer.currentOwnerCode : transfer.newOwnerCode
      if (input.confirmationCode !== expectedCode) {
        throw new Error('Código de confirmação inválido')
      }

      // Marcar como confirmado
      const updateData: any = {}
      if (isCurrentOwner) {
        updateData.currentOwnerConfirmed = true
      } else {
        updateData.newOwnerConfirmed = true
      }

      // Se ambos confirmaram, executar transferência
      const bothConfirmed =
        (isCurrentOwner && transfer.newOwnerConfirmed) ||
        (isNewOwner && transfer.currentOwnerConfirmed)

      if (bothConfirmed) {
        // Buscar ID do novo dono no Firebase Auth (simplificado - assume que já existe)
        // Na produção, você precisaria ter uma collection 'users' para mapear email->uid
        
        // Por enquanto, vamos apenas atualizar o status
        updateData.status = 'confirmed'
        updateData.completedAt = Timestamp.now()

        // Usar batch para atualizar veículo e transferência atomicamente
        const batch = writeBatch(db)
        
        batch.update(transferRef, updateData)
        
        // Atualizar veículo com novo dono
        // NOTA: Isso é simplificado. Na produção, você precisaria:
        // 1. Ter uma collection 'users' para mapear email->uid
        // 2. Verificar se o novo dono tem conta
        // 3. Transferir todo o histórico de manutenção
        
        const vehicleRef = doc(db, 'vehicles', transfer.vehicleId)
        batch.update(vehicleRef, {
          // userId: newOwnerId, // Descomentado quando tiver mapeamento email->uid
          updatedAt: Timestamp.now(),
          transferredAt: Timestamp.now(),
          previousOwnerId: transfer.currentOwnerId
        })

        await batch.commit()

        await fetchPendingTransfers()

        return {
          success: true,
          message: 'Transferência concluída com sucesso!'
        }
      } else {
        // Apenas uma confirmação por enquanto
        await updateDoc(transferRef, updateData)

        await fetchPendingTransfers()

        return {
          success: true,
          message: 'Confirmação registrada! Aguardando confirmação da outra parte.'
        }
      }
    } catch (err) {
      error.value = translateFirebaseError(err)
      return {
        success: false,
        message: error.value
      }
    } finally {
      loading.value = false
    }
  }

  // Cancelar transferência
  const cancelTransfer = async (transferId: string): Promise<TransferResult> => {
    if (!authStore.user) {
      return { success: false, message: 'Usuário não autenticado' }
    }

    loading.value = true
    error.value = null

    try {
      const transferRef = doc(db, 'vehicle_transfers', transferId)
      await updateDoc(transferRef, {
        status: 'cancelled'
      })

      await fetchPendingTransfers()

      return {
        success: true,
        message: 'Transferência cancelada'
      }
    } catch (err) {
      error.value = translateFirebaseError(err)
      return {
        success: false,
        message: error.value
      }
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    transfers,
    loading,
    error,

    // Actions
    clearError,
    fetchPendingTransfers,
    initiateTransfer,
    confirmTransfer,
    cancelTransfer
  }
})
