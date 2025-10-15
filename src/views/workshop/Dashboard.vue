<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard da Oficina</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Bem-vindo ao painel de controle da sua oficina</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total de Clientes"
          :value="stats.totalClients"
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          color="blue"
        />
        <StatCard
          title="Ordens Pendentes"
          :value="stats.pendingOrders"
          icon="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          color="yellow"
        />
        <StatCard
          title="Ordens Concluídas"
          :value="stats.completedOrders"
          icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          color="green"
        />
        <StatCard
          title="Avaliação Média"
          :value="`${stats.averageRating.toFixed(1)} ⭐`"
          icon="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          color="purple"
        />
      </div>

      <!-- Quick Actions -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Ações Rápidas</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button @click="$router.push('/workshop/job-orders')" class="justify-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nova Ordem de Serviço
          </Button>
          <Button variant="outline" @click="$router.push('/workshop/reviews')" class="justify-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Ver Avaliações
          </Button>
          <Button variant="outline" @click="$router.push('/workshop/profile')" class="justify-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configurações
          </Button>
        </div>
      </div>

      <!-- Recent Job Orders -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Ordens de Serviço Recentes</h2>
          <router-link to="/workshop/job-orders" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium">
            Ver todas →
          </router-link>
        </div>
        
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <div v-else-if="recentOrders.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
          Nenhuma ordem de serviço encontrada
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="order in recentOrders"
            :key="order.id"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium text-gray-900 dark:text-white">
                {{ order.customerEmail || 'Cliente' }}
              </h3>
              <Badge :variant="getStatusVariant(order.status)">
                {{ getStatusLabel(order.status) }}
              </Badge>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Veículo ID: {{ order.vehicleId.substring(0, 8) }}... | Total: R$ {{ order.totalCost.toFixed(2) }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-500">
              {{ formatDate(order.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useWorkshopsStore } from '@/stores/workshops'
import StatCard from '@/components/StatCard.vue'
import Button from '@/components/Button.vue'
import Badge from '@/components/Badge.vue'

const workshopsStore = useWorkshopsStore()
const loading = ref(true)

const stats = ref({
  totalClients: 0,
  pendingOrders: 0,
  completedOrders: 0,
  averageRating: 0
})

const recentOrders = computed(() => {
  return workshopsStore.jobOrders.slice(0, 5)
})

const getStatusVariant = (status: string) => {
  const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
    draft: 'default',
    open: 'warning',
    'in-progress': 'default',
    'awaiting-approval': 'warning',
    completed: 'success',
    cancelled: 'error'
  }
  return variants[status] || 'default'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    draft: 'Rascunho',
    open: 'Aberta',
    'in-progress': 'Em Andamento',
    'awaiting-approval': 'Aguardando Aprovação',
    completed: 'Concluída',
    cancelled: 'Cancelada'
  }
  return labels[status] || status
}

const formatDate = (date: any) => {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : new Date(date)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

onMounted(async () => {
  try {
    // Buscar workshop do usuário logado
    const myWorkshop = workshopsStore.myWorkshops[0]
    
    if (myWorkshop) {
      // Buscar ordens de serviço
      await workshopsStore.fetchJobOrders(myWorkshop.id)
      
      // Calcular estatísticas
      const orders = workshopsStore.jobOrders
      stats.value.totalClients = new Set(orders.map(o => o.customerId).filter(Boolean)).size
      stats.value.pendingOrders = orders.filter(o => o.status === 'open' || o.status === 'awaiting-approval').length
      stats.value.completedOrders = orders.filter(o => o.status === 'completed').length
      
      // Buscar avaliações
      await workshopsStore.fetchReviews(myWorkshop.id)
      stats.value.averageRating = workshopsStore.averageRating(myWorkshop.id)
    }
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error)
  } finally {
    loading.value = false
  }
})
</script>
