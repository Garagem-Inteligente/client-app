<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useVehiclesStore } from '../stores/vehicles'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
import Badge from '../components/Badge.vue'
import Alert from '../components/Alert.vue'
import Navbar from '../components/Navbar.vue'

const authStore = useAuthStore()
const vehiclesStore = useVehiclesStore()

onMounted(async () => {
  await vehiclesStore.fetchVehicles()
  await vehiclesStore.fetchMaintenanceRecords()
})

// Computed properties para estatísticas
const totalCost = computed(() => {
  return vehiclesStore.totalMaintenanceCost
})

const overdueCount = computed(() => {
  return vehiclesStore.overdueMaintenance.length
})

// Dias até a próxima manutenção
const daysUntilNext = (date: Date) => {
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return days
}

// Status da manutenção baseado em dias
const getMaintenanceStatus = (date: Date) => {
  const days = daysUntilNext(date)
  if (days < 0) return 'overdue'
  if (days <= 7) return 'urgent'
  if (days <= 30) return 'soon'
  return 'normal'
}

const getMaintenanceTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    oil_change: 'Troca de Óleo',
    tire_rotation: 'Rodízio de Pneus',
    brake_service: 'Serviço de Freios',
    general_inspection: 'Inspeção Geral',
    other: 'Outros'
  }
  return labels[type] || type
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const getFuelTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    gasoline: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
    diesel: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
    electric: 'M13 10V3L4 14h7v7l9-11h-7z',
    hybrid: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707'
  }
  return icons[type] || icons.gasoline
}
</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <Navbar />
    <div class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white">
          Bem-vindo, {{ authStore.userName }}!
        </h1>
        <p class="mt-2 text-gray-400">
          Gerencie seus veículos e acompanhe as manutenções
        </p>
      </div>
      
      <!-- Alertas de Manutenções Atrasadas -->
      <Alert 
        v-if="overdueCount > 0" 
        type="error" 
        class="mb-6"
      >
        <template #default>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span class="font-medium">Você tem {{ overdueCount }} manutenção(ões) atrasada(s)!</span>
            </div>
            <router-link to="/maintenance">
              <Button variant="outline" size="sm">Ver detalhes</Button>
            </router-link>
          </div>
        </template>
      </Alert>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Veículos Card -->
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-lg">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold mb-1">{{ vehiclesStore.vehicleCount }}</div>
          <p class="text-blue-100 text-sm">Veículos cadastrados</p>
        </div>

        <!-- Manutenções Card -->
        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-lg">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold mb-1">{{ vehiclesStore.totalMaintenanceRecords }}</div>
          <p class="text-green-100 text-sm">Total de manutenções</p>
        </div>

        <!-- Custo Total Card -->
        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-lg">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="text-3xl font-bold mb-1">{{ formatCurrency(totalCost) }}</div>
          <p class="text-purple-100 text-sm">Investido em manutenções</p>
        </div>

        <!-- Próximas Manutenções Card -->
        <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-lg">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <Badge :variant="overdueCount > 0 ? 'error' : 'warning'">{{ overdueCount > 0 ? overdueCount + ' atrasadas' : 'OK' }}</Badge>
          </div>
          <div class="text-3xl font-bold mb-1">{{ vehiclesStore.upcomingMaintenance.length }}</div>
          <p class="text-yellow-100 text-sm">Manutenções agendadas</p>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card title="Ações Rápidas">
          <div class="space-y-4">
            <router-link to="/vehicles">
              <Button variant="primary" size="lg" class="w-full">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Adicionar Veículo
              </Button>
            </router-link>
            
            <router-link to="/maintenance">
              <Button variant="secondary" size="lg" class="w-full">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Registrar Manutenção
              </Button>
            </router-link>
          </div>
        </Card>
        
        <!-- Recent Vehicles -->
        <Card title="Meus Veículos" class="hover:shadow-xl transition-shadow duration-300">
          <div v-if="vehiclesStore.vehicles.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <p class="text-gray-400 mb-4">Nenhum veículo cadastrado</p>
            <router-link to="/vehicles">
              <Button variant="primary">Adicionar primeiro veículo</Button>
            </router-link>
          </div>
          
          <div v-else class="space-y-4">
            <div 
              v-for="vehicle in vehiclesStore.vehicles.slice(0, 3)" 
              :key="vehicle.id"
              class="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors duration-200 cursor-pointer group"
            >
              <div class="flex items-center space-x-4">
                <div class="p-3 bg-gray-700 rounded-lg group-hover:bg-gray-600 transition-colors">
                  <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getFuelTypeIcon(vehicle.fuelType)" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-white">
                    {{ vehicle.make }} {{ vehicle.model }}
                  </h3>
                  <p class="text-sm text-gray-400">
                    {{ vehicle.year }} • {{ vehicle.plate }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-white">
                  {{ vehicle.mileage.toLocaleString('pt-BR') }} km
                </p>
                <Badge :variant="vehicle.fuelType === 'electric' ? 'success' : 'default'">
                  {{ vehicle.fuelType === 'gasoline' ? 'Gasolina' : 
                     vehicle.fuelType === 'diesel' ? 'Diesel' :
                     vehicle.fuelType === 'electric' ? 'Elétrico' : 'Híbrido' }}
                </Badge>
              </div>
            </div>
            
            <router-link to="/vehicles" v-if="vehiclesStore.vehicles.length > 3">
              <Button variant="outline" size="sm" class="w-full">
                Ver todos os veículos
              </Button>
            </router-link>
          </div>
        </Card>
      </div>
      
      <!-- Manutenções Atrasadas -->
      <Card v-if="overdueCount > 0" title="⚠️ Manutenções Atrasadas" class="mb-8 border-2 border-red-500/50">
        <div class="space-y-3">
          <div 
            v-for="maintenance in vehiclesStore.overdueMaintenance.slice(0, 3)" 
            :key="maintenance.id"
            class="flex items-center justify-between p-4 bg-red-900/20 border border-red-500/30 rounded-lg"
          >
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-1">
                <Badge variant="error">ATRASADA</Badge>
                <h3 class="font-medium text-white">
                  {{ getMaintenanceTypeLabel(maintenance.type) }}
                </h3>
              </div>
              <p class="text-sm text-gray-400">
                {{ vehiclesStore.getVehicleById(maintenance.vehicleId)?.make }} 
                {{ vehiclesStore.getVehicleById(maintenance.vehicleId)?.model }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-red-400">
                {{ formatDate(maintenance.nextDueDate!) }}
              </p>
              <p class="text-xs text-gray-400">
                {{ Math.abs(daysUntilNext(maintenance.nextDueDate!)) }} dias atrás
              </p>
            </div>
          </div>
        </div>
      </Card>

      <!-- Upcoming Maintenance -->
      <Card title="📅 Próximas Manutenções" class="hover:shadow-xl transition-shadow duration-300">
        <div v-if="vehiclesStore.upcomingMaintenance.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-gray-400 mb-4">Nenhuma manutenção agendada</p>
          <router-link to="/maintenance">
            <Button variant="primary">Agendar manutenção</Button>
          </router-link>
        </div>
        
        <div v-else class="space-y-3">
          <div 
            v-for="maintenance in vehiclesStore.upcomingMaintenance.slice(0, 5)" 
            :key="maintenance.id"
            :class="[
              'flex items-center justify-between p-4 rounded-lg transition-all duration-200 hover:scale-[1.02]',
              getMaintenanceStatus(maintenance.nextDueDate!) === 'urgent' 
                ? 'bg-orange-900/20 border border-orange-500/30' 
                : getMaintenanceStatus(maintenance.nextDueDate!) === 'soon'
                ? 'bg-yellow-900/20 border border-yellow-500/30'
                : 'bg-gray-800 hover:bg-gray-750'
            ]"
          >
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-1">
                <Badge 
                  :variant="getMaintenanceStatus(maintenance.nextDueDate!) === 'urgent' ? 'error' : 
                           getMaintenanceStatus(maintenance.nextDueDate!) === 'soon' ? 'warning' : 'default'"
                >
                  {{ daysUntilNext(maintenance.nextDueDate!) }} dias
                </Badge>
                <h3 class="font-medium text-white">
                  {{ getMaintenanceTypeLabel(maintenance.type) }}
                </h3>
              </div>
              <p class="text-sm text-gray-400">
                {{ vehiclesStore.getVehicleById(maintenance.vehicleId)?.make }} 
                {{ vehiclesStore.getVehicleById(maintenance.vehicleId)?.model }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-white">
                {{ formatDate(maintenance.nextDueDate!) }}
              </p>
              <p class="text-xs text-gray-400" v-if="maintenance.nextDueMileage">
                {{ maintenance.nextDueMileage.toLocaleString('pt-BR') }} km
              </p>
            </div>
          </div>
          
          <router-link to="/maintenance">
            <Button variant="outline" size="sm" class="w-full">
              Ver todas as manutenções
            </Button>
          </router-link>
        </div>
      </Card>
    </div>
    </div>
  </div>
</template>

<style scoped>
.bg-gray-750 {
  background-color: #2d3748;
}
</style>
