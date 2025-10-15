<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <WorkshopHeader />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Header -->
      <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Ordens de Serviço</h1>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Gerencie todas as ordens de serviço da oficina</p>
        </div>
        <Button variant="primary" @click="openCreateModal" class="mt-4 md:mt-0">
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
    <!-- Modal de Criação de Ordem -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      @click.self="closeCreateModal"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full my-8">
        <div class="p-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Nova Ordem de Serviço
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Cadastre uma manutenção para um cliente através da placa do veículo
          </p>

          <Alert v-if="createError" variant="error" class="mb-6">
            {{ createError }}
          </Alert>

          <Alert v-if="createSuccess" variant="success" class="mb-6">
            {{ createSuccess }}
          </Alert>

          <form @submit.prevent="handleCreateOrder" class="space-y-6">
            <!-- Busca por Placa -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Placa do Veículo *
              </label>
              <div class="flex gap-2">
                <Input
                  v-model="createForm.licensePlate"
                  type="text"
                  placeholder="ABC-1234"
                  class="flex-1"
                  @input="createForm.licensePlate = createForm.licensePlate.toUpperCase()"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  @click="searchVehicle"
                  :disabled="searchingVehicle || !createForm.licensePlate"
                >
                  <svg v-if="searchingVehicle" class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ searchingVehicle ? 'Buscando...' : 'Buscar' }}
                </Button>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Digite a placa do veículo do cliente
              </p>
            </div>

            <!-- Informações do Veículo (aparece após busca) -->
            <div v-if="foundVehicle" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="flex-1">
                  <p class="font-semibold text-blue-900 dark:text-blue-100">Veículo encontrado!</p>
                  <div class="mt-2 text-sm text-blue-800 dark:text-blue-200">
                    <p><strong>Veículo:</strong> {{ foundVehicle.brand }} {{ foundVehicle.model }} ({{ foundVehicle.year }})</p>
                    <p><strong>Cliente:</strong> {{ foundVehicle.ownerName }}</p>
                    <p><strong>Placa:</strong> {{ foundVehicle.licensePlate }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Serviços -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Serviços Realizados *
              </label>
              <div class="space-y-3">
                <div
                  v-for="(service, index) in createForm.services"
                  :key="index"
                  class="flex gap-2 items-start bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"
                >
                  <div class="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                    <Input
                      v-model="service.name"
                      placeholder="Nome do serviço"
                      class="md:col-span-2"
                      required
                    />
                    <Input
                      v-model.number="service.qty"
                      type="number"
                      min="1"
                      placeholder="Qtd"
                      required
                    />
                    <Input
                      v-model.number="service.unitPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Valor"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    @click="removeServiceFromCreate(index)"
                    class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                @click="addServiceToCreate"
                class="mt-3"
              >
                + Adicionar Serviço
              </Button>
            </div>

            <!-- Total -->
            <div v-if="createForm.services.length > 0" class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div class="flex justify-between items-center text-lg font-semibold">
                <span class="text-gray-900 dark:text-white">Total:</span>
                <span class="text-blue-600 dark:text-blue-400">
                  R$ {{ calculateCreateTotal().toFixed(2) }}
                </span>
              </div>
            </div>

            <!-- Observações -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Observações
              </label>
              <textarea
                v-model="createForm.notes"
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Detalhes adicionais sobre o serviço..."
              ></textarea>
            </div>

            <!-- Botões -->
            <div class="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" type="button" @click="closeCreateModal">
                Cancelar
              </Button>
              <Button
                variant="primary"
                type="submit"
                :disabled="submittingCreate || !foundVehicle || createForm.services.length === 0"
              >
                <svg v-if="submittingCreate" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ submittingCreate ? 'Cadastrando...' : 'Cadastrar Ordem' }}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWorkshopsStore, type JobOrder, type JobStatus, type ServiceItem } from '@/stores/workshops'
import { useAuthStore } from '@/stores/auth'
import WorkshopHeader from '@/components/WorkshopHeader.vue'
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

// Create Order Form
const searchingVehicle = ref(false)
const submittingCreate = ref(false)
const createError = ref('')
const createSuccess = ref('')
const foundVehicle = ref<any>(null)

const createForm = ref({
  licensePlate: '',
  services: [] as ServiceItem[],
  notes: ''
})

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
    
    // Validar serviços
    if (editForm.value.services.length === 0) {
      formError.value = 'Adicione pelo menos um serviço'
      submitting.value = false
      return
    }

    // Validar que todos os serviços têm nome e preço
    const invalidService = editForm.value.services.find(s => !s.name || s.unitPrice <= 0 || s.qty <= 0)
    if (invalidService) {
      formError.value = 'Todos os serviços devem ter nome, quantidade e preço válidos'
      submitting.value = false
      return
    }
    
    // Atualizar ordem completa (status, serviços, notas)
    const result = await workshopsStore.updateJobOrder(workshopId, selectedOrder.value.id!, {
      status: editForm.value.status,
      services: editForm.value.services,
      notes: editForm.value.notes
    })

    if (!result.success) {
      formError.value = result.error || 'Erro ao salvar ordem'
      return
    }
    
    selectedOrder.value = null
    await applyFilters()
  } catch (error: any) {
    console.error('Erro ao salvar ordem:', error)
    formError.value = error.message || 'Erro ao salvar ordem de serviço'
  } finally {
    submitting.value = false
  }
}

// Funções para criar ordem
const searchVehicle = async () => {
  if (!createForm.value.licensePlate.trim()) return

  searchingVehicle.value = true
  createError.value = ''
  foundVehicle.value = null

  try {
    // Buscar veículo pela placa
    const { collection, query, where, getDocs } = await import('firebase/firestore')
    const { db } = await import('@/firebase/config')

    const q = query(
      collection(db, 'vehicles'),
      where('licensePlate', '==', createForm.value.licensePlate.toUpperCase())
    )

    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      createError.value = 'Veículo não encontrado. Verifique a placa digitada.'
      return
    }

    const vehicleDoc = snapshot.docs[0]
    const vehicleData = vehicleDoc.data()

    // Buscar informações do proprietário
    const { doc, getDoc } = await import('firebase/firestore')
    const ownerDoc = await getDoc(doc(db, 'users', vehicleData.ownerId))
    const ownerData = ownerDoc.data()

    foundVehicle.value = {
      id: vehicleDoc.id,
      ...vehicleData,
      ownerName: ownerData?.name || 'Não informado',
      ownerEmail: ownerData?.email || ''
    }

    createSuccess.value = 'Veículo encontrado com sucesso!'
    setTimeout(() => {
      createSuccess.value = ''
    }, 3000)
  } catch (error: any) {
    console.error('Erro ao buscar veículo:', error)
    createError.value = 'Erro ao buscar veículo. Tente novamente.'
  } finally {
    searchingVehicle.value = false
  }
}

const addServiceToCreate = () => {
  createForm.value.services.push({
    id: `temp-${Date.now()}`,
    name: '',
    description: '',
    qty: 1,
    unitPrice: 0
  })
}

const removeServiceFromCreate = (index: number) => {
  createForm.value.services.splice(index, 1)
}

const calculateCreateTotal = () => {
  return createForm.value.services.reduce((total, service) => {
    return total + (service.qty * service.unitPrice)
  }, 0)
}

const handleCreateOrder = async () => {
  if (!foundVehicle.value) {
    createError.value = 'Busque um veículo primeiro'
    return
  }

  if (createForm.value.services.length === 0) {
    createError.value = 'Adicione pelo menos um serviço'
    return
  }

  const invalidService = createForm.value.services.find(s => !s.name || s.unitPrice <= 0 || s.qty <= 0)
  if (invalidService) {
    createError.value = 'Todos os serviços devem ter nome, quantidade e preço válidos'
    return
  }

  submittingCreate.value = true
  createError.value = ''

  try {
    const workshopId = workshopsStore.myWorkshops[0]?.id
    if (!workshopId) {
      createError.value = 'Oficina não encontrada'
      return
    }

    const workshop = workshopsStore.myWorkshops[0]

    const orderData = {
      workshopId,
      workshopName: workshop.name,
      customerId: foundVehicle.value.ownerId,
      customerEmail: foundVehicle.value.ownerEmail,
      vehicleId: foundVehicle.value.id,
      vehicleInfo: `${foundVehicle.value.brand} ${foundVehicle.value.model} (${foundVehicle.value.year})`,
      licensePlate: foundVehicle.value.licensePlate,
      status: 'open' as JobStatus,
      services: createForm.value.services,
      notes: createForm.value.notes,
      totalCost: calculateCreateTotal(),
      totalLabor: 0,
      totalParts: calculateCreateTotal()
    }

    const result = await workshopsStore.createJobOrder(workshopId, orderData)

    if (result.success) {
      createSuccess.value = 'Ordem de serviço cadastrada com sucesso! O cliente receberá uma notificação para aprovar.'
      
      // Aguardar 2 segundos e fechar o modal
      setTimeout(() => {
        closeCreateModal()
        applyFilters()
      }, 2000)
    } else {
      createError.value = result.error || 'Erro ao criar ordem de serviço'
    }
  } catch (error: any) {
    console.error('Erro ao criar ordem:', error)
    createError.value = error.message || 'Erro ao criar ordem de serviço'
  } finally {
    submittingCreate.value = false
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  createForm.value = {
    licensePlate: '',
    services: [],
    notes: ''
  }
  foundVehicle.value = null
  createError.value = ''
  createSuccess.value = ''
}

// Adicionar serviço inicial ao abrir modal
const openCreateModal = () => {
  showCreateModal.value = true
  if (createForm.value.services.length === 0) {
    addServiceToCreate()
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
