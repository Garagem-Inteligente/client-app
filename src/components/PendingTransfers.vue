<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTransferStore } from '../stores/transfer'
import { useAuthStore } from '../stores/auth'
import { useVehiclesStore } from '../stores/vehicles'
import type { ConfirmTransferInput } from '../types/transfer'
import Card from './Card.vue'
import Button from './Button.vue'
import Input from './Input.vue'
import Alert from './Alert.vue'
import Badge from './Badge.vue'

const transferStore = useTransferStore()
const authStore = useAuthStore()
const vehiclesStore = useVehiclesStore()

const confirmingTransferId = ref<string | null>(null)
const confirmationCode = ref('')
const localError = ref<string | null>(null)
const localSuccess = ref<string | null>(null)

const pendingTransfers = computed(() => {
  return transferStore.transfers.filter(t => t.status === 'pending')
})

const handleConfirm = async (transferId: string) => {
  if (!authStore.user?.email) return

  if (!confirmationCode.value || confirmationCode.value.length !== 6) {
    localError.value = 'Por favor, informe o código de 6 dígitos'
    return
  }

  const input: ConfirmTransferInput = {
    transferId,
    confirmationCode: confirmationCode.value,
    userEmail: authStore.user.email
  }

  const result = await transferStore.confirmTransfer(input)

  if (result.success) {
    localSuccess.value = result.message
    confirmationCode.value = ''
    confirmingTransferId.value = null
    
    // Recarregar veículos se transferência foi concluída
    if (result.message.includes('concluída')) {
      await vehiclesStore.fetchVehicles()
    }
  } else {
    localError.value = result.message
  }
}

const handleCancel = async (transferId: string) => {
  if (!confirm('Tem certeza que deseja cancelar esta transferência?')) return

  const result = await transferStore.cancelTransfer(transferId)
  
  if (result.success) {
    localSuccess.value = result.message
  }
}

const getVehicleName = (vehicleId: string) => {
  const vehicle = vehiclesStore.vehicles.find(v => v.id === vehicleId)
  return vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.plate})` : 'Veículo não encontrado'
}

const isCurrentOwner = (transfer: any) => {
  return transfer.currentOwnerEmail === authStore.user?.email
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const getTimeRemaining = (expiresAt: Date) => {
  const now = new Date()
  const diff = expiresAt.getTime() - now.getTime()
  
  if (diff <= 0) return 'Expirada'
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days} dia${days > 1 ? 's' : ''} restante${days > 1 ? 's' : ''}`
  }
  
  return `${hours}h ${minutes}m restantes`
}

onMounted(async () => {
  await transferStore.fetchPendingTransfers()
  await vehiclesStore.fetchVehicles()
})
</script>

<template>
  <div class="space-y-6">
    <Alert
      v-if="localSuccess"
      type="success"
      :message="localSuccess"
      dismissible
      @close="localSuccess = null"
    />

    <Alert
      v-if="localError"
      type="error"
      :message="localError"
      dismissible
      @close="localError = null"
    />

    <div v-if="pendingTransfers.length === 0" class="text-center py-12">
      <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
      <h3 class="text-lg font-medium text-white mb-2">Nenhuma transferência pendente</h3>
      <p class="text-gray-400">Você não tem transferências aguardando confirmação</p>
    </div>

    <Card
      v-for="transfer in pendingTransfers"
      :key="transfer.id"
      :title="isCurrentOwner(transfer) ? 'Transferindo para' : 'Recebendo de'"
      class="border-l-4"
      :class="isCurrentOwner(transfer) ? 'border-l-yellow-500' : 'border-l-blue-500'"
    >
      <div class="space-y-4">
        <!-- Transfer Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-400">Veículo</p>
            <p class="font-medium text-white">{{ getVehicleName(transfer.vehicleId) }}</p>
          </div>

          <div>
            <p class="text-sm text-gray-400">
              {{ isCurrentOwner(transfer) ? 'Novo Dono' : 'Dono Atual' }}
            </p>
            <p class="font-medium text-white">
              {{ isCurrentOwner(transfer) ? transfer.newOwnerEmail : transfer.currentOwnerEmail }}
            </p>
          </div>

          <div>
            <p class="text-sm text-gray-400">Iniciada em</p>
            <p class="font-medium text-white">{{ formatDate(transfer.createdAt) }}</p>
          </div>

          <div>
            <p class="text-sm text-gray-400">Validade</p>
            <div class="flex items-center gap-2">
              <p class="font-medium text-yellow-400">{{ getTimeRemaining(transfer.expiresAt) }}</p>
              <Badge variant="warning" size="sm">48h</Badge>
            </div>
          </div>
        </div>

        <!-- Status -->
        <div class="flex flex-wrap gap-2">
          <Badge :variant="transfer.currentOwnerConfirmed ? 'success' : 'default'">
            Dono Atual: {{ transfer.currentOwnerConfirmed ? 'Confirmado ✓' : 'Pendente' }}
          </Badge>
          <Badge :variant="transfer.newOwnerConfirmed ? 'success' : 'default'">
            Novo Dono: {{ transfer.newOwnerConfirmed ? 'Confirmado ✓' : 'Pendente' }}
          </Badge>
        </div>

        <!-- Confirmation Form -->
        <div
          v-if="
            (isCurrentOwner(transfer) && !transfer.currentOwnerConfirmed) ||
            (!isCurrentOwner(transfer) && !transfer.newOwnerConfirmed)
          "
          class="bg-gray-900/50 rounded-lg p-4 border border-gray-700"
        >
          <p class="text-sm text-gray-300 mb-4">
            Um código de confirmação de 6 dígitos foi enviado para seu email.
            <span class="block text-xs text-gray-400 mt-1">
              (Para testes: verifique o console do navegador)
            </span>
          </p>

          <form
            v-if="confirmingTransferId === transfer.id"
            @submit.prevent="handleConfirm(transfer.id)"
            class="flex gap-3"
          >
            <div class="flex-1">
              <Input
                v-model="confirmationCode"
                type="text"
                placeholder="000000"
                maxlength="6"
                pattern="[0-9]{6}"
                :disabled="transferStore.loading"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              :disabled="transferStore.loading"
            >
              Confirmar
            </Button>
            <Button
              type="button"
              variant="outline"
              @click="confirmingTransferId = null; confirmationCode = ''"
              :disabled="transferStore.loading"
            >
              Cancelar
            </Button>
          </form>

          <Button
            v-else
            variant="primary"
            @click="confirmingTransferId = transfer.id"
          >
            Inserir Código
          </Button>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3">
          <Button
            v-if="isCurrentOwner(transfer)"
            variant="outline"
            size="sm"
            @click="handleCancel(transfer.id)"
            :disabled="transferStore.loading"
          >
            Cancelar Transferência
          </Button>
        </div>
      </div>
    </Card>
  </div>
</template>
