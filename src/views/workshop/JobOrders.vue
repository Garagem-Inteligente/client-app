<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Ordens de Serviço</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">Gerencie todas as ordens de serviço da oficina</p>
        </div>
        <Button variant="primary" @click="showCreateModal = true" class="mt-4 md:mt-0">
          Nova Ordem
        </Button>
      </div>

      <!-- Filtros -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              v-model="selectedStatus"
              @change="applyFilters"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos</option>
              <option value="open">Aberto</option>
              <option value="in-progress">Em Andamento</option>
              <option value="awaiting-approval">Aguardando Aprovação</option>
              <option value="completed">Concluído</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          <div class="flex items-end">
            <Button variant="outline" @click="clearFilters">
              Limpar Filtros
            </Button>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ filteredOrders.length }} ordem(ns) encontrada(s)
          </p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Carregando ordens...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredOrders.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhuma ordem encontrada</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ selectedStatus ? 'Tente ajustar os filtros' : 'Nenhuma ordem de serviço cadastrada' }}
        </p>
      </div>

      <!-- Tabela de Ordens -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ordem
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cliente
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Veículo
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Data
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="order in filteredOrders"
                :key="order.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                @click="viewOrderDetail(order)"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  #{{ order.id?.substring(0, 8) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {{ order.customerEmail }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {{ order.vehicleId?.substring(0, 8) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <Badge :variant="getStatusVariant(order.status)">
                    {{ getStatusLabel(order.status) }}
                  </Badge>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  R$ {{ order.totalCost.toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDate(order.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="outline"
                    size="sm"
                    @click.stop="editOrder(order)"
                  >
                    Editar
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes/Edição -->
    <div
      v-if="selectedOrder"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click.self="selectedOrder = null"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              Ordem #{{ selectedOrder.id?.substring(0, 8) }}
            </h2>
            <button
              @click="selectedOrder = null"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <Alert v-if="formError" variant="error" class="mb-4">
            {{ formError }}
          </Alert>

          <form @submit.prevent="saveOrder" class="space-y-6">
            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                v-model="editForm.status"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="open">Aberto</option>
                <option value="in-progress">Em Andamento</option>
                <option value="awaiting-approval">Aguardando Aprovação</option>
                <option value="completed">Concluído</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            <!-- Cliente e Veículo -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cliente
                </label>
                <Input
                  v-model="editForm.customerEmail"
                  type="email"
                  disabled
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Veículo
                </label>
                <Input
                  v-model="editForm.vehicleId"
                  type="text"
                  disabled
                />
              </div>
            </div>

            <!-- Serviços -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Serviços
                </label>
                <Button type="button" variant="outline" size="sm" @click="addService">
                  Adicionar Serviço
                </Button>
              </div>
              <div class="space-y-3">
                <div
                  v-for="(service, index) in editForm.services"
                  :key="index"
                  class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div class="md:col-span-2">
                      <Input
                        v-model="service.name"
                        type="text"
                        placeholder="Nome do serviço"
                        required
                      />
                    </div>
                    <div>
                      <Input
                        v-model.number="service.qty"
                        type="number"
                        placeholder="Qtd"
                        min="1"
                        required
                      />
                    </div>
                    <div class="flex gap-2">
                      <Input
                        v-model.number="service.unitPrice"
                        type="number"
                        placeholder="Preço"
                        min="0"
                        step="0.01"
                        required
                      />
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        @click="removeService(index)"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                  <Input
                    v-model="service.description"
                    type="text"
                    placeholder="Descrição (opcional)"
                    class="mt-2"
                  />
                </div>
              </div>
            </div>

            <!-- Notas -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Observações
              </label>
              <textarea
                v-model="editForm.notes"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Observações sobre o serviço..."
              ></textarea>
            </div>

            <!-- Total -->
            <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="flex justify-between items-center text-xl">
                <span class="font-semibold text-gray-900 dark:text-white">Total:</span>
                <span class="font-bold text-blue-600 dark:text-blue-400">
                  R$ {{ calculateTotal().toFixed(2) }}
                </span>
              </div>
            </div>

            <!-- Ações -->
            <div class="flex gap-3 justify-end">
              <Button type="button" variant="outline" @click="selectedOrder = null">
                Cancelar
              </Button>
              <Button type="submit" variant="primary" :disabled="submitting">
                {{ submitting ? 'Salvando...' : 'Salvar Alterações' }}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Criação -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click.self="showCreateModal = false"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
        <div class="p-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Nova Ordem de Serviço
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            As ordens de serviço são criadas pelos clientes através do sistema.
            Use esta opção apenas para registrar serviços presenciais.
          </p>
          <div class="flex gap-3 justify-end">
            <Button variant="outline" @click="showCreateModal = false">
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWorkshopsStore, type JobOrder, type JobStatus, type ServiceItem } from '@/stores/workshops'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/Button.vue'
import Badge from '@/components/Badge.vue'
import Alert from '@/components/Alert.vue'
import Input from '@/components/Input.vue'

const workshopsStore = useWorkshopsStore()
const authStore = useAuthStore()

const loading = ref(true)
const selectedStatus = ref<JobStatus | ''>('')
const selectedOrder = ref<JobOrder | null>(null)
const showCreateModal = ref(false)
const submitting = ref(false)
const formError = ref('')

const editForm = ref({
  status: 'open' as JobStatus,
  customerEmail: '',
  vehicleId: '',
  services: [] as ServiceItem[],
  notes: ''
})

const filteredOrders = computed(() => {
  if (!selectedStatus.value) {
    return workshopsStore.jobOrders
  }
  return workshopsStore.jobOrders.filter(order => order.status === selectedStatus.value)
})

const getStatusVariant = (status: JobStatus) => {
  const variants: Record<JobStatus, 'default' | 'success' | 'warning' | 'error'> = {
    draft: 'default',
    open: 'default',
    'in-progress': 'warning',
    'awaiting-approval': 'warning',
    completed: 'success',
    cancelled: 'error'
  }
  return variants[status]
}

const getStatusLabel = (status: JobStatus) => {
  const labels: Record<JobStatus, string> = {
    draft: 'Rascunho',
    open: 'Aberto',
    'in-progress': 'Em Andamento',
    'awaiting-approval': 'Aguardando Aprovação',
    completed: 'Concluído',
    cancelled: 'Cancelado'
  }
  return labels[status]
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const applyFilters = async () => {
  if (!authStore.user) return
  
  loading.value = true
  const workshopId = workshopsStore.myWorkshops[0]?.id
  if (workshopId) {
    await workshopsStore.fetchJobOrders(workshopId, selectedStatus.value || undefined)
  }
  loading.value = false
}

const clearFilters = () => {
  selectedStatus.value = ''
  applyFilters()
}

const viewOrderDetail = (order: JobOrder) => {
  selectedOrder.value = order
  editForm.value = {
    status: order.status,
    customerEmail: order.customerEmail || '',
    vehicleId: order.vehicleId,
    services: [...order.services],
    notes: order.notes || ''
  }
}

const editOrder = (order: JobOrder) => {
  viewOrderDetail(order)
}

const addService = () => {
  editForm.value.services.push({
    id: `temp-${Date.now()}`,
    name: '',
    description: '',
    qty: 1,
    unitPrice: 0
  })
}

const removeService = (index: number) => {
  editForm.value.services.splice(index, 1)
}

const calculateTotal = () => {
  return editForm.value.services.reduce((sum, service) => {
    return sum + (service.qty * service.unitPrice)
  }, 0)
}

const saveOrder = async () => {
  if (!selectedOrder.value || !authStore.user) return

  formError.value = ''
  submitting.value = true

  try {
    const workshopId = workshopsStore.myWorkshops[0]?.id
    if (!workshopId) throw new Error('Oficina não encontrada')
    
    // Atualizar status da ordem
    await workshopsStore.updateJobOrderStatus(workshopId, selectedOrder.value.id!, editForm.value.status)
    
    // Nota: atualização completa de serviços e valores pode ser implementada posteriormente
    
    selectedOrder.value = null
    await applyFilters()
  } catch (error: any) {
    console.error('Erro ao salvar ordem:', error)
    formError.value = error.message || 'Erro ao salvar ordem de serviço'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (!authStore.user) return

  try {
    // Buscar a oficina do usuário
    await workshopsStore.fetchWorkshops()
    const workshopId = workshopsStore.myWorkshops[0]?.id
    
    if (workshopId) {
      await workshopsStore.fetchJobOrders(workshopId)
    }
  } catch (error: any) {
    console.error('Erro ao carregar ordens:', error)
  } finally {
    loading.value = false
  }
})
</script>
