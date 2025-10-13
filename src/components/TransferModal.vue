<script setup lang="ts">
import { ref } from 'vue'
import { useTransferStore } from '../stores/transfer'
import type { TransferRequestInput } from '../types/transfer'
import Button from './Button.vue'
import Input from './Input.vue'
import Alert from './Alert.vue'

interface Props {
  vehicleId: string
  vehicleName: string
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'close': []
  'success': [transferId: string]
}>()

const transferStore = useTransferStore()
const newOwnerEmail = ref('')
const successMessage = ref('')

const handleSubmit = async () => {
  if (!newOwnerEmail.value) {
    transferStore.error = 'Por favor, informe o email do novo dono'
    return
  }

  const input: TransferRequestInput = {
    vehicleId: props.vehicleId,
    newOwnerEmail: newOwnerEmail.value
  }

  const result = await transferStore.initiateTransfer(input)

  if (result.success) {
    successMessage.value = result.message
    setTimeout(() => {
      emit('success', result.transferId!)
      handleClose()
    }, 3000)
  }
}

const handleClose = () => {
  newOwnerEmail.value = ''
  successMessage.value = ''
  transferStore.clearError()
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        @click.self="handleClose"
      >
        <div
          class="bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6 border border-gray-700"
          @click.stop
        >
          <!-- Header -->
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-white">Transferir Veículo</h2>
            <button
              type="button"
              class="text-gray-400 hover:text-white transition-colors"
              @click="handleClose"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Success Message -->
          <Alert
            v-if="successMessage"
            type="success"
            :message="successMessage"
            class="mb-4"
          />

          <!-- Error Message -->
          <Alert
            v-if="transferStore.error"
            type="error"
            :message="transferStore.error"
            dismissible
            @close="transferStore.clearError"
            class="mb-4"
          />

          <!-- Content -->
          <div class="mb-6">
            <div class="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
              <div class="flex items-start gap-3">
                <svg class="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="flex-1">
                  <h3 class="font-medium text-blue-400 mb-1">Como funciona a transferência</h3>
                  <ul class="text-sm text-gray-300 space-y-1">
                    <li>• Você receberá um código de confirmação por email</li>
                    <li>• O novo dono também receberá um código</li>
                    <li>• Ambos devem confirmar com seus códigos</li>
                    <li>• A transferência é válida por 48 horas</li>
                    <li>• Todo o histórico será transferido</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <p class="text-sm text-gray-400 mb-2">Veículo</p>
              <p class="text-lg font-medium text-white">{{ vehicleName }}</p>
            </div>

            <form @submit.prevent="handleSubmit">
              <div class="mb-6">
                <label for="newOwnerEmail" class="block text-sm font-medium text-gray-300 mb-2">
                  Email do Novo Dono *
                </label>
                <Input
                  id="newOwnerEmail"
                  v-model="newOwnerEmail"
                  type="email"
                  placeholder="email@exemplo.com"
                  required
                  :disabled="transferStore.loading"
                />
                <p class="text-xs text-gray-400 mt-1">
                  O novo dono deve ter uma conta cadastrada no AutoCare
                </p>
              </div>

              <div class="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  @click="handleClose"
                  :disabled="transferStore.loading"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  :disabled="transferStore.loading || !!successMessage"
                >
                  <svg v-if="transferStore.loading" class="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciar Transferência
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-gray-800,
.modal-leave-active .bg-gray-800 {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-gray-800,
.modal-leave-to .bg-gray-800 {
  transform: scale(0.9);
}
</style>
