<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVehiclesStore } from '../stores/vehicles'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
import Badge from '../components/Badge.vue'
import Navbar from '../components/Navbar.vue'
import TransferModal from '../components/TransferModal.vue'

const route = useRoute()
const router = useRouter()
const vehiclesStore = useVehiclesStore()
const showTransferModal = ref(false)

const vehicleId = route.params.id as string

const vehicle = computed(() => vehiclesStore.getVehicleById(vehicleId))

const maintenanceHistory = computed(() => {
  return vehiclesStore.maintenanceRecords.filter(
    record => record.vehicleId === vehicleId
  ).sort((a, b) => b.date.getTime() - a.date.getTime())
})

const upcomingMaintenance = computed(() => {
  return maintenanceHistory.value.filter(
    record => record.nextDueDate && record.nextDueDate > new Date()
  ).sort((a, b) => a.nextDueDate!.getTime() - b.nextDueDate!.getTime())
})

const completedMaintenance = computed(() => {
  return maintenanceHistory.value.filter(
    record => !record.nextDueDate || record.nextDueDate <= new Date()
  )
})

const totalMaintenanceCost = computed(() => {
  return maintenanceHistory.value.reduce((sum, record) => sum + (record.cost || 0), 0)
})

const averageMaintenanceCost = computed(() => {
  const records = maintenanceHistory.value.filter(r => r.cost && r.cost > 0)
  if (records.length === 0) return 0
  return records.reduce((sum, r) => sum + (r.cost || 0), 0) / records.length
})

const lastMaintenanceDate = computed(() => {
  if (completedMaintenance.value.length === 0) return null
  return completedMaintenance.value[0].date
})

const nextMaintenanceDate = computed(() => {
  if (upcomingMaintenance.value.length === 0) return null
  return upcomingMaintenance.value[0].nextDueDate
})

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

const getFuelTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    gasoline: 'Gasolina / Flex',
    diesel: 'Diesel',
    electric: 'Elétrico',
    hybrid: 'Híbrido'
  }
  return labels[type] || type
}

const getFuelTypeBadgeVariant = (type: string) => {
  const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
    gasoline: 'default',
    diesel: 'warning',
    electric: 'success',
    hybrid: 'default'
  }
  return variants[type] || 'default'
}

const daysUntilNext = (date: Date) => {
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return days
}

const handleEdit = () => {
  router.push('/vehicles')
  // Idealmente, você passaria o ID do veículo para abrir o formulário de edição
}

const handleDelete = async () => {
  if (!vehicle.value) return
  
  if (confirm(`Tem certeza que deseja excluir o veículo ${vehicle.value.make} ${vehicle.value.model}?`)) {
    try {
      await vehiclesStore.deleteVehicle(vehicleId)
      router.push('/dashboard')
    } catch (error) {
      console.error('Erro ao excluir veículo:', error)
    }
  }
}

onMounted(async () => {
  await vehiclesStore.fetchVehicles()
  await vehiclesStore.fetchMaintenanceRecords()
  
  if (!vehicle.value) {
    router.push('/vehicles')
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <Navbar />
    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Loading State -->
        <div v-if="!vehicle" class="text-center py-16">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p class="text-gray-400">Carregando informações do veículo...</p>
        </div>

        <div v-else>
          <!-- Header com Breadcrumb -->
          <div class="mb-6">
            <nav class="flex items-center space-x-2 text-sm mb-4">
              <router-link to="/dashboard" class="text-gray-400 hover:text-white transition-colors">
                Dashboard
              </router-link>
              <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              <router-link to="/vehicles" class="text-gray-400 hover:text-white transition-colors">
                Veículos
              </router-link>
              <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              <span class="text-white">{{ vehicle.make }} {{ vehicle.model }}</span>
            </nav>

            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div>
                <h1 class="text-3xl font-bold text-white mb-2">
                  {{ vehicle.make }} {{ vehicle.model }}
                </h1>
                <div class="flex flex-wrap items-center gap-3">
                  <Badge :variant="getFuelTypeBadgeVariant(vehicle.fuelType)">
                    {{ getFuelTypeLabel(vehicle.fuelType) }}
                  </Badge>
                  <span class="text-gray-400">{{ vehicle.year }}</span>
                  <span class="text-gray-600">•</span>
                  <span class="text-gray-400">{{ vehicle.plate }}</span>
                  <span class="text-gray-600" v-if="vehicle.color">•</span>
                  <span class="text-gray-400" v-if="vehicle.color">{{ vehicle.color }}</span>
                </div>
              </div>

              <div class="flex gap-3">
                <Button variant="primary" @click="showTransferModal = true">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Transferir
                </Button>
                <Button variant="outline" @click="handleEdit">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </Button>
                <Button variant="outline" @click="handleDelete" class="!text-red-400 !border-red-400/30 hover:!bg-red-400/10">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Excluir
                </Button>
              </div>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Quilometragem -->
            <div class="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-blue-500/20 rounded-lg">
                  <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div class="text-2xl font-bold text-white mb-1">
                {{ vehicle.mileage.toLocaleString('pt-BR') }} km
              </div>
              <p class="text-sm text-gray-400">Quilometragem atual</p>
            </div>

            <!-- Total Manutenções -->
            <div class="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-green-500/20 rounded-lg">
                  <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
              <div class="text-2xl font-bold text-white mb-1">
                {{ maintenanceHistory.length }}
              </div>
              <p class="text-sm text-gray-400">Manutenções realizadas</p>
            </div>

            <!-- Custo Total -->
            <div class="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-purple-500/20 rounded-lg">
                  <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="text-2xl font-bold text-white mb-1">
                {{ formatCurrency(totalMaintenanceCost) }}
              </div>
              <p class="text-sm text-gray-400">Investido em manutenções</p>
            </div>

            <!-- Próxima Manutenção -->
            <div class="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-xl p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="p-3 bg-yellow-500/20 rounded-lg">
                  <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="text-2xl font-bold text-white mb-1">
                {{ nextMaintenanceDate ? daysUntilNext(nextMaintenanceDate) + ' dias' : 'N/A' }}
              </div>
              <p class="text-sm text-gray-400">Próxima manutenção</p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Informações do Veículo -->
            <Card title="Informações do Veículo">
              <div class="space-y-4">
                <div class="flex justify-between py-3 border-b border-gray-700">
                  <span class="text-gray-400">Marca</span>
                  <span class="font-medium text-white">{{ vehicle.make }}</span>
                </div>
                <div class="flex justify-between py-3 border-b border-gray-700">
                  <span class="text-gray-400">Modelo</span>
                  <span class="font-medium text-white">{{ vehicle.model }}</span>
                </div>
                <div class="flex justify-between py-3 border-b border-gray-700">
                  <span class="text-gray-400">Ano</span>
                  <span class="font-medium text-white">{{ vehicle.year }}</span>
                </div>
                <div class="flex justify-between py-3 border-b border-gray-700">
                  <span class="text-gray-400">Placa</span>
                  <span class="font-medium text-white">{{ vehicle.plate }}</span>
                </div>
                <div class="flex justify-between py-3 border-b border-gray-700" v-if="vehicle.color">
                  <span class="text-gray-400">Cor</span>
                  <span class="font-medium text-white">{{ vehicle.color }}</span>
                </div>
                <div class="flex justify-between py-3 border-b border-gray-700">
                  <span class="text-gray-400">Combustível</span>
                  <Badge :variant="getFuelTypeBadgeVariant(vehicle.fuelType)">
                    {{ getFuelTypeLabel(vehicle.fuelType) }}
                  </Badge>
                </div>
                <div class="flex justify-between py-3 border-b border-gray-700">
                  <span class="text-gray-400">Quilometragem</span>
                  <span class="font-medium text-white">{{ vehicle.mileage.toLocaleString('pt-BR') }} km</span>
                </div>
                <div class="flex justify-between py-3 border-b border-gray-700">
                  <span class="text-gray-400">Última Manutenção</span>
                  <span class="font-medium text-white">
                    {{ lastMaintenanceDate ? formatDate(lastMaintenanceDate) : 'Nenhuma' }}
                  </span>
                </div>
                <div class="flex justify-between py-3">
                  <span class="text-gray-400">Custo Médio/Manutenção</span>
                  <span class="font-medium text-white">
                    {{ formatCurrency(averageMaintenanceCost) }}
                  </span>
                </div>
              </div>
            </Card>

            <!-- Próximas Manutenções -->
            <Card title="Próximas Manutenções">
              <div v-if="upcomingMaintenance.length === 0" class="text-center py-8">
                <svg class="mx-auto h-12 w-12 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-gray-400 mb-4">Nenhuma manutenção agendada</p>
                <router-link to="/maintenance">
                  <Button variant="primary" size="sm">Agendar manutenção</Button>
                </router-link>
              </div>

              <div v-else class="space-y-3">
                <div
                  v-for="maintenance in upcomingMaintenance.slice(0, 5)"
                  :key="maintenance.id"
                  class="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div class="flex items-start justify-between mb-2">
                    <h4 class="font-medium text-white">
                      {{ getMaintenanceTypeLabel(maintenance.type) }}
                    </h4>
                    <Badge :variant="daysUntilNext(maintenance.nextDueDate!) <= 7 ? 'error' : 'warning'" size="sm">
                      {{ daysUntilNext(maintenance.nextDueDate!) }} dias
                    </Badge>
                  </div>
                  <p class="text-sm text-gray-400">
                    {{ formatDate(maintenance.nextDueDate!) }}
                  </p>
                  <p class="text-sm text-gray-500 mt-1" v-if="maintenance.nextDueMileage">
                    {{ maintenance.nextDueMileage.toLocaleString('pt-BR') }} km
                  </p>
                </div>

                <router-link to="/maintenance">
                  <Button variant="outline" size="sm" class="w-full mt-4">
                    Ver todas
                  </Button>
                </router-link>
              </div>
            </Card>
          </div>

          <!-- Histórico de Manutenções -->
          <Card title="Histórico de Manutenções" class="mt-8">
            <div v-if="completedMaintenance.length === 0" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p class="text-gray-400 mb-4">Nenhuma manutenção registrada</p>
              <router-link to="/maintenance">
                <Button variant="primary" size="sm">Registrar primeira manutenção</Button>
              </router-link>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="maintenance in completedMaintenance"
                :key="maintenance.id"
                class="p-5 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <h4 class="font-semibold text-white text-lg">
                        {{ getMaintenanceTypeLabel(maintenance.type) }}
                      </h4>
                      <Badge variant="success" size="sm">Concluída</Badge>
                    </div>
                    
                    <div class="space-y-2 text-sm">
                      <div class="flex items-center text-gray-400">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {{ formatDate(maintenance.date) }}
                      </div>
                      
                      <div class="flex items-center text-gray-400">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {{ maintenance.mileage.toLocaleString('pt-BR') }} km
                      </div>
                      
                      <div v-if="maintenance.cost" class="flex items-center text-gray-400">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ formatCurrency(maintenance.cost) }}
                      </div>

                      <div v-if="maintenance.description" class="text-gray-400 mt-3 pl-6 border-l-2 border-gray-700">
                        {{ maintenance.description }}
                      </div>
                    </div>
                  </div>

                  <div v-if="maintenance.nextDueDate" class="sm:text-right">
                    <p class="text-xs text-gray-500 mb-1">Próxima manutenção</p>
                    <p class="text-sm font-medium text-white">
                      {{ formatDate(maintenance.nextDueDate) }}
                    </p>
                    <p class="text-xs text-gray-400 mt-1" v-if="maintenance.nextDueMileage">
                      {{ maintenance.nextDueMileage.toLocaleString('pt-BR') }} km
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>

    <!-- Transfer Modal -->
    <TransferModal
      v-if="vehicle"
      :show="showTransferModal"
      :vehicle-id="vehicle.id"
      :vehicle-name="`${vehicle.make} ${vehicle.model} (${vehicle.plate})`"
      @close="showTransferModal = false"
      @success="showTransferModal = false"
    />
  </div>
</template>
