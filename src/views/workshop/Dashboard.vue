<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <WorkshopHeader />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Header Section - Above the fold -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Visão geral da sua oficina</p>
      </div>

      <!-- Quick Actions - Above the fold -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Ações Rápidas</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
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

      <!-- Stats Cards - Above the fold -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <!-- Revenue Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Receita Mensal</h2>
          <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <div v-else class="h-64">
            <Line :data="revenueChartData" :options="chartOptions" />
          </div>
        </div>

        <!-- Orders by Status Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Distribuição de Ordens</h2>
          <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <div v-else class="h-64">
            <Doughnut :data="statusChartData" :options="doughnutOptions" />
          </div>
        </div>

        <!-- Top Services Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Serviços Mais Realizados</h2>
          <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <div v-else class="h-64">
            <Bar :data="servicesChartData" :options="barChartOptions" />
          </div>
        </div>

        <!-- Monthly Performance -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Performance Mensal</h2>
          <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <div v-else class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Receita Total</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  R$ {{ monthlyStats.totalRevenue.toFixed(2) }}
                </p>
              </div>
              <div class="flex items-center text-green-600 dark:text-green-400">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span class="text-sm font-medium">{{ monthlyStats.growth }}%</span>
              </div>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div class="flex justify-between mb-2">
                <span class="text-sm text-gray-600 dark:text-gray-400">Ordens Completadas</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ monthlyStats.completedThisMonth }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-sm text-gray-600 dark:text-gray-400">Ticket Médio</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">R$ {{ monthlyStats.averageTicket.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-sm text-gray-600 dark:text-gray-400">Taxa de Conclusão</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ monthlyStats.completionRate }}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Novos Clientes</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ monthlyStats.newClients }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Job Orders -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Ordens de Serviço Recentes</h2>
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
import WorkshopHeader from '@/components/WorkshopHeader.vue'
import StatCard from '@/components/StatCard.vue'
import Button from '@/components/Button.vue'
import Badge from '@/components/Badge.vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line, Bar, Doughnut } from 'vue-chartjs'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const workshopsStore = useWorkshopsStore()
const loading = ref(true)

const stats = ref({
  totalClients: 0,
  pendingOrders: 0,
  completedOrders: 0,
  averageRating: 0
})

const monthlyStats = ref({
  totalRevenue: 0,
  growth: 0,
  completedThisMonth: 0,
  averageTicket: 0,
  completionRate: 0,
  newClients: 0
})

// Chart data
const revenueChartData = ref({
  labels: [] as string[],
  datasets: [
    {
      label: 'Receita (R$)',
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      data: [] as number[],
      tension: 0.4
    }
  ]
})

const statusChartData = ref({
  labels: ['Abertas', 'Em Andamento', 'Aguardando Aprovação', 'Concluídas', 'Canceladas'],
  datasets: [
    {
      backgroundColor: [
        'rgba(251, 191, 36, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      data: [] as number[]
    }
  ]
})

const servicesChartData = ref({
  labels: [] as string[],
  datasets: [
    {
      label: 'Quantidade',
      backgroundColor: 'rgba(168, 85, 247, 0.8)',
      borderColor: 'rgb(168, 85, 247)',
      data: [] as number[]
    }
  ]
})

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: 'rgb(156, 163, 175)'
      }
    }
  },
  scales: {
    y: {
      ticks: {
        color: 'rgb(156, 163, 175)'
      },
      grid: {
        color: 'rgba(156, 163, 175, 0.1)'
      }
    },
    x: {
      ticks: {
        color: 'rgb(156, 163, 175)'
      },
      grid: {
        color: 'rgba(156, 163, 175, 0.1)'
      }
    }
  }
} as const

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      ticks: {
        color: 'rgb(156, 163, 175)'
      },
      grid: {
        color: 'rgba(156, 163, 175, 0.1)'
      }
    },
    x: {
      ticks: {
        color: 'rgb(156, 163, 175)'
      },
      grid: {
        color: 'rgba(156, 163, 175, 0.1)'
      }
    }
  }
} as const

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: 'rgb(156, 163, 175)',
        padding: 10
      }
    }
  }
} as const

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

const calculateMonthlyRevenue = (orders: any[]) => {
  const monthlyData: Record<string, number> = {}
  const last6Months: string[] = []
  
  // Generate last 6 months labels
  for (let i = 5; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthLabel = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
    last6Months.push(monthLabel)
    monthlyData[monthKey] = 0
  }
  
  // Calculate revenue per month
  orders.forEach(order => {
    if (order.status === 'completed' && order.completedAt) {
      const date = (order.completedAt as any).toDate ? (order.completedAt as any).toDate() : new Date(order.completedAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (monthKey in monthlyData) {
        monthlyData[monthKey] += order.totalCost || 0
      }
    }
  })
  
  return {
    labels: last6Months,
    data: Object.values(monthlyData)
  }
}

const calculateTopServices = (orders: any[]) => {
  const serviceCount: Record<string, number> = {}
  
  orders.forEach(order => {
    if (order.services) {
      order.services.forEach((service: any) => {
        if (service.name) {
          serviceCount[service.name] = (serviceCount[service.name] || 0) + 1
        }
      })
    }
  })
  
  // Get top 5 services
  const sorted = Object.entries(serviceCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
  
  return {
    labels: sorted.map(([name]) => name),
    data: sorted.map(([, count]) => count)
  }
}

const calculateStatusDistribution = (orders: any[]) => {
  const statusCount = {
    open: 0,
    'in-progress': 0,
    'awaiting-approval': 0,
    completed: 0,
    cancelled: 0
  }
  
  orders.forEach(order => {
    if (order.status in statusCount) {
      statusCount[order.status as keyof typeof statusCount]++
    }
  })
  
  return Object.values(statusCount)
}

onMounted(async () => {
  try {
    // Buscar workshop do usuário logado
    await workshopsStore.fetchWorkshops()
    const myWorkshop = workshopsStore.myWorkshops[0]
    
    if (myWorkshop) {
      // Buscar ordens de serviço
      await workshopsStore.fetchJobOrders(myWorkshop.id)
      
      // Calcular estatísticas
      const orders = workshopsStore.jobOrders
      const completedOrders = orders.filter(o => o.status === 'completed')
      
      stats.value.totalClients = new Set(orders.map(o => o.customerId).filter(Boolean)).size
      stats.value.pendingOrders = orders.filter(o => o.status === 'open' || o.status === 'awaiting-approval').length
      stats.value.completedOrders = completedOrders.length
      
      // Buscar avaliações
      await workshopsStore.fetchReviews(myWorkshop.id)
      stats.value.averageRating = workshopsStore.averageRating(myWorkshop.id)
      
      // Calculate monthly stats
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const thisMonthOrders = completedOrders.filter(o => {
        if (!o.completedAt) return false
        const date = (o.completedAt as any).toDate ? (o.completedAt as any).toDate() : new Date(o.completedAt)
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear
      })
      
      monthlyStats.value.completedThisMonth = thisMonthOrders.length
      monthlyStats.value.totalRevenue = thisMonthOrders.reduce((sum, o) => sum + (o.totalCost || 0), 0)
      monthlyStats.value.averageTicket = monthlyStats.value.completedThisMonth > 0 
        ? monthlyStats.value.totalRevenue / monthlyStats.value.completedThisMonth 
        : 0
      monthlyStats.value.completionRate = orders.length > 0 
        ? Math.round((completedOrders.length / orders.length) * 100) 
        : 0
      
      // Calculate growth (comparing to previous month)
      const lastMonth = new Date()
      lastMonth.setMonth(lastMonth.getMonth() - 1)
      const lastMonthOrders = completedOrders.filter(o => {
        if (!o.completedAt) return false
        const date = (o.completedAt as any).toDate ? (o.completedAt as any).toDate() : new Date(o.completedAt)
        return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear()
      })
      const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + (o.totalCost || 0), 0)
      monthlyStats.value.growth = lastMonthRevenue > 0 
        ? Math.round(((monthlyStats.value.totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
        : 0
      
      // Count new clients this month
      const clientsThisMonth = new Set(thisMonthOrders.map(o => o.customerId).filter(Boolean))
      monthlyStats.value.newClients = clientsThisMonth.size
      
      // Populate chart data
      const revenueData = calculateMonthlyRevenue(orders)
      revenueChartData.value.labels = revenueData.labels
      revenueChartData.value.datasets[0].data = revenueData.data
      
      const servicesData = calculateTopServices(orders)
      servicesChartData.value.labels = servicesData.labels
      servicesChartData.value.datasets[0].data = servicesData.data
      
      statusChartData.value.datasets[0].data = calculateStatusDistribution(orders)
    }
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error)
  } finally {
    loading.value = false
  }
})
</script>
