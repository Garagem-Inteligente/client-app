<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <Navbar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Minhas Ordens de Serviço</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Acompanhe o status dos seus serviços</p>
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
          {{ selectedStatus ? 'Tente ajustar os filtros' : 'Você ainda não solicitou nenhum serviço' }}
        </p>
        <Button class="mt-4" @click="router.push('/workshops')">
          Buscar Oficinas
        </Button>
      </div>

      <!-- Lista de Ordens -->
      <div v-else class="space-y-4">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div class="flex flex-col md:flex-row md:items-start md:justify-between">
            <!-- Informações Principais -->
            <div class="flex-1">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Ordem #{{ order.id?.substring(0, 8) }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {{ getWorkshopName(order.workshopId) }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Criada em {{ formatDate(order.createdAt) }}
                  </p>
                </div>
                <Badge :variant="getStatusVariant(order.status)">
                  {{ getStatusLabel(order.status) }}
                </Badge>
              </div>

              <!-- Veículo -->
              <div class="mb-4">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Veículo:</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ getVehicleInfo(order.vehicleId) }}
                </p>
              </div>

              <!-- Serviços -->
              <div v-if="order.services && order.services.length > 0" class="mb-4">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Serviços:</p>
                <ul class="space-y-1">
                  <li
                    v-for="(service, index) in order.services"
                    :key="index"
                    class="text-sm text-gray-600 dark:text-gray-400 flex justify-between"
                  >
                    <span>• {{ service.name }} ({{ service.qty }}x)</span>
                    <span class="font-medium">
                      R$ {{ (service.unitPrice * service.qty).toFixed(2) }}
                    </span>
                  </li>
                </ul>
              </div>

              <!-- Notas -->
              <div v-if="order.notes" class="mb-4">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Observações:</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ order.notes }}</p>
              </div>

              <!-- Total -->
              <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
                  <span class="text-lg font-bold text-blue-600 dark:text-blue-400">
                    R$ {{ order.totalCost.toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Ações -->
            <div class="mt-4 md:mt-0 md:ml-6 flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                @click="viewOrderDetail(order)"
              >
                Ver Detalhes
              </Button>
              <Button
                v-if="order.status === 'awaiting-approval'"
                variant="primary"
                size="sm"
                @click="showApprovalModal(order)"
              >
                Aprovar Orçamento
              </Button>
              <Button
                v-if="order.status === 'completed' && !hasReview(order.workshopId)"
                variant="success"
                size="sm"
                @click="showReviewModal(order)"
              >
                Avaliar Oficina
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes da Ordem -->
    <div
      v-if="selectedOrder"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click.self="selectedOrder = null"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              Detalhes da Ordem #{{ selectedOrder.id?.substring(0, 8) }}
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

          <div class="space-y-6">
            <!-- Status e Data -->
            <div>
              <div class="flex items-center gap-4">
                <Badge :variant="getStatusVariant(selectedOrder.status)">
                  {{ getStatusLabel(selectedOrder.status) }}
                </Badge>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  Criada em {{ formatDate(selectedOrder.createdAt) }}
                </span>
              </div>
            </div>

            <!-- Oficina e Veículo -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Oficina</p>
                <p class="text-gray-900 dark:text-white">{{ getWorkshopName(selectedOrder.workshopId) }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Veículo</p>
                <p class="text-gray-900 dark:text-white">{{ getVehicleInfo(selectedOrder.vehicleId) }}</p>
              </div>
            </div>

            <!-- Serviços Detalhados -->
            <div v-if="selectedOrder.services && selectedOrder.services.length > 0">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Serviços</p>
              <div class="space-y-3">
                <div
                  v-for="(service, index) in selectedOrder.services"
                  :key="index"
                  class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <p class="font-medium text-gray-900 dark:text-white mb-2">
                    {{ service.name }}
                    <span v-if="service.description" class="text-sm text-gray-600 dark:text-gray-400">
                      - {{ service.description }}
                    </span>
                  </p>
                  <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <div class="flex justify-between">
                      <span>Quantidade:</span>
                      <span>{{ service.qty }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>Preço unitário:</span>
                      <span>R$ {{ service.unitPrice.toFixed(2) }}</span>
                    </div>
                    <div class="flex justify-between font-medium text-gray-900 dark:text-white">
                      <span>Subtotal:</span>
                      <span>R$ {{ (service.unitPrice * service.qty).toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total -->
            <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="flex justify-between items-center text-xl">
                <span class="font-semibold text-gray-900 dark:text-white">Total:</span>
                <span class="font-bold text-blue-600 dark:text-blue-400">
                  R$ {{ selectedOrder.totalCost.toFixed(2) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Aprovação -->
    <div
      v-if="orderToApprove"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click.self="orderToApprove = null"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
        <div class="p-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Aprovar Orçamento</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Deseja aprovar o orçamento de <span class="font-medium">R$ {{ orderToApprove.totalCost.toFixed(2) }}</span>?
          </p>
          <div class="flex gap-3 justify-end">
            <Button variant="outline" @click="orderToApprove = null">
              Cancelar
            </Button>
            <Button variant="danger" @click="rejectOrder">
              Rejeitar
            </Button>
            <Button variant="success" @click="approveOrder">
              Aprovar
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Avaliação -->
    <div
      v-if="orderToReview"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click.self="orderToReview = null"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
        <div class="p-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Avaliar Oficina</h2>
          
          <Alert v-if="reviewError" variant="error" class="mb-4">
            {{ reviewError }}
          </Alert>

          <form @submit.prevent="submitReview" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Avaliação
              </label>
              <div class="flex gap-2">
                <button
                  v-for="i in 5"
                  :key="i"
                  type="button"
                  @click="reviewForm.rating = i"
                  class="focus:outline-none"
                >
                  <svg
                    :class="[
                      'w-8 h-8',
                      i <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                    ]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Comentário
              </label>
              <textarea
                v-model="reviewForm.comment"
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Conte sobre sua experiência..."
              ></textarea>
            </div>

            <div class="flex gap-3 justify-end">
              <Button type="button" variant="outline" @click="orderToReview = null">
                Cancelar
              </Button>
              <Button type="submit" variant="primary" :disabled="submittingReview || reviewForm.rating === 0">
                {{ submittingReview ? 'Enviando...' : 'Enviar Avaliação' }}
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
import { useRouter } from 'vue-router'
import { useWorkshopsStore, type JobOrder, type JobStatus } from '@/stores/workshops'
import { useVehiclesStore } from '@/stores/vehicles'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'
import Button from '@/components/Button.vue'
import Badge from '@/components/Badge.vue'
import Alert from '@/components/Alert.vue'

const router = useRouter()
const workshopsStore = useWorkshopsStore()
const vehiclesStore = useVehiclesStore()
const authStore = useAuthStore()

const loading = ref(true)
const selectedStatus = ref<JobStatus | ''>('')
const selectedOrder = ref<JobOrder | null>(null)
const orderToApprove = ref<JobOrder | null>(null)
const orderToReview = ref<JobOrder | null>(null)
const submittingReview = ref(false)
const reviewError = ref('')

const reviewForm = ref({
  rating: 0,
  comment: ''
})

const filteredOrders = computed(() => {
  if (!selectedStatus.value) {
    return workshopsStore.jobOrders
  }
  return workshopsStore.jobOrders.filter(order => order.status === selectedStatus.value)
})

const applyFilters = async () => {
  loading.value = true
  await workshopsStore.fetchMyJobOrders(selectedStatus.value || undefined)
  loading.value = false
}

const clearFilters = () => {
  selectedStatus.value = ''
  applyFilters()
}

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

const getWorkshopName = (workshopId: string) => {
  const workshop = workshopsStore.workshopById(workshopId)
  return workshop?.name || 'Oficina desconhecida'
}

const getVehicleInfo = (vehicleId: string) => {
  const vehicle = vehiclesStore.vehicles.find(v => v.id === vehicleId)
  if (!vehicle) return 'Veículo não encontrado'
  return `${vehicle.make} ${vehicle.model} (${vehicle.plate})`
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const viewOrderDetail = (order: JobOrder) => {
  selectedOrder.value = order
}

const showApprovalModal = (order: JobOrder) => {
  orderToApprove.value = order
}

const showReviewModal = (order: JobOrder) => {
  orderToReview.value = order
  reviewForm.value = { rating: 0, comment: '' }
  reviewError.value = ''
}

const hasReview = (workshopId: string) => {
  // Verificar se já existe uma avaliação do usuário para esta oficina
  return workshopsStore.reviews.some(
    review => review.workshopId === workshopId && review.userId === authStore.user?.id
  )
}

const approveOrder = async () => {
  if (!orderToApprove.value) return
  
  try {
    await workshopsStore.updateJobOrderStatus(
      orderToApprove.value.workshopId,
      orderToApprove.value.id!,
      'in-progress'
    )
    orderToApprove.value = null
    await applyFilters()
  } catch (error: any) {
    console.error('Erro ao aprovar ordem:', error)
    alert('Erro ao aprovar ordem de serviço')
  }
}

const rejectOrder = async () => {
  if (!orderToApprove.value) return
  
  try {
    await workshopsStore.updateJobOrderStatus(
      orderToApprove.value.workshopId,
      orderToApprove.value.id!,
      'cancelled'
    )
    orderToApprove.value = null
    await applyFilters()
  } catch (error: any) {
    console.error('Erro ao rejeitar ordem:', error)
    alert('Erro ao rejeitar ordem de serviço')
  }
}

const submitReview = async () => {
  if (!orderToReview.value || !authStore.user) return
  
  if (reviewForm.value.rating === 0) {
    reviewError.value = 'Por favor, selecione uma avaliação'
    return
  }

  submittingReview.value = true
  reviewError.value = ''

  try {
    await workshopsStore.createReview({
      workshopId: orderToReview.value.workshopId,
      userId: authStore.user.id,
      userName: authStore.user.name,
      rating: reviewForm.value.rating,
      comment: reviewForm.value.comment || undefined
    })

    orderToReview.value = null
    reviewForm.value = { rating: 0, comment: '' }
  } catch (error: any) {
    console.error('Erro ao enviar avaliação:', error)
    reviewError.value = error.message || 'Erro ao enviar avaliação'
  } finally {
    submittingReview.value = false
  }
}

onMounted(async () => {
  try {
    await Promise.all([
      workshopsStore.fetchMyJobOrders(),
      vehiclesStore.fetchVehicles(),
      workshopsStore.fetchWorkshops()
    ])
  } catch (error: any) {
    console.error('Erro ao carregar dados:', error)
  } finally {
    loading.value = false
  }
})
</script>
