<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVehiclesStore } from '../stores/vehicles'
import { FUEL_TYPE_LABELS, MAINTENANCE_TYPE_LABELS } from '@/constants/vehicles'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
import Badge from '../components/Badge.vue'
import Input from '../components/Input.vue'
import Navbar from '../components/Navbar.vue'
import TransferModal from '../components/TransferModal.vue'
import Tabs from '../components/Tabs.vue'
import TabPanel from '../components/TabPanel.vue'

const route = useRoute()
const router = useRouter()
const vehiclesStore = useVehiclesStore()
const showTransferModal = ref(false)
const isEditing = ref(false)
const activeTab = ref('info')

const vehicleId = route.params.id as string

// Form data for editing
const editForm = ref({
  make: '',
  model: '',
  year: 0,
  plate: '',
  color: '',
  mileage: 0
})

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

// Tabs configuration
const tabs = computed(() => [
  { 
    id: 'info', 
    label: 'Informações', 
    icon: '📋'
  },
  { 
    id: 'maintenance', 
    label: 'Manutenções', 
    icon: '🔧',
    badge: maintenanceHistory.value.length
  },
  { 
    id: 'stats', 
    label: 'Estatísticas', 
    icon: '📊',
    disabled: maintenanceHistory.value.length === 0
  },
  { 
    id: 'documents', 
    label: 'Documentos', 
    icon: '📄'
  },
  { 
    id: 'insurance', 
    label: 'Seguro', 
    icon: '🛡️',
    badge: isInsuranceExpired.value ? 1 : (isInsuranceExpiringSoon.value ? 1 : undefined)
  }
])

// Verificações de seguro
const isInsuranceExpired = computed(() => {
  if (!vehicle.value?.insuranceExpiryDate) return false
  return new Date(vehicle.value.insuranceExpiryDate) < new Date()
})

const isInsuranceExpiringSoon = computed(() => {
  if (!vehicle.value?.insuranceExpiryDate) return false
  const expiryDate = new Date(vehicle.value.insuranceExpiryDate)
  const today = new Date()
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return daysUntilExpiry > 0 && daysUntilExpiry <= 30
})

const getMaintenanceTypeLabel = (type: string) => {
  return MAINTENANCE_TYPE_LABELS[type as import('@/stores/vehicles').MaintenanceType] || type
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
  return FUEL_TYPE_LABELS[type as keyof typeof FUEL_TYPE_LABELS] || type
}

const getFuelTypeBadgeVariant = (type: string) => {
  const variants: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
    flex: 'default',
    gasoline: 'default',
    ethanol: 'success',
    diesel: 'warning',
    electric: 'success',
    'hybrid-plugin': 'success',
    'hybrid-mild': 'success',
    gnv: 'warning'
  }
  return variants[type] || 'default'
}

const daysUntilNext = (date: Date) => {
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return days
}

const startEditing = () => {
  if (!vehicle.value) return
  editForm.value = {
    make: vehicle.value.make,
    model: vehicle.value.model,
    year: vehicle.value.year,
    plate: vehicle.value.plate,
    color: vehicle.value.color || '',
    mileage: vehicle.value.mileage
  }
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
}

const saveEditing = async () => {
  if (!vehicle.value) return
  
  try {
    await vehiclesStore.updateVehicle(vehicleId, editForm.value)
    isEditing.value = false
  } catch (error) {
    console.error('Erro ao atualizar veículo:', error)
    alert('Erro ao atualizar veículo. Tente novamente.')
  }
}

const handleEdit = () => {
  activeTab.value = 'info'
  startEditing()
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

const handleTabChange = (tabId: string) => {
  activeTab.value = tabId
  // Cancela edição ao mudar de aba
  if (isEditing.value && tabId !== 'info') {
    cancelEditing()
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

              <div class="flex flex-wrap gap-3">
                <Button variant="primary" @click="router.push(`/maintenance?action=new&vehicleId=${vehicleId}`)">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Nova Manutenção
                </Button>
                <Button variant="outline" @click="showTransferModal = true">
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

          <!-- Tabs -->
          <Tabs :tabs="tabs" :default-tab="activeTab" @change="handleTabChange">
            <template #default>
              
              <!-- TAB: Informações -->
              <TabPanel tab-id="info">
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
              <!-- Modo Visualização -->
              <div v-if="!isEditing" class="space-y-4">
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
                
                <div class="pt-4">
                  <Button variant="outline" size="sm" class="w-full" @click="startEditing">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar Informações
                  </Button>
                </div>
              </div>

              <!-- Modo Edição -->
              <div v-else class="space-y-4">
                <div class="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-4">
                  <p class="text-sm text-blue-300">
                    ✏️ Modo de edição ativado. Faça as alterações e clique em "Salvar" para confirmar.
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">Marca</label>
                  <Input v-model="editForm.make" placeholder="Ex: Toyota" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">Modelo</label>
                  <Input v-model="editForm.model" placeholder="Ex: Corolla" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">Ano</label>
                  <Input v-model.number="editForm.year" type="number" placeholder="Ex: 2023" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">Placa</label>
                  <Input v-model="editForm.plate" placeholder="Ex: ABC1234" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">Cor (Opcional)</label>
                  <Input v-model="editForm.color" placeholder="Ex: Prata" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">Quilometragem Atual</label>
                  <Input v-model.number="editForm.mileage" type="number" placeholder="Ex: 45000" />
                </div>

                <div class="flex gap-3 pt-4">
                  <Button 
                    variant="primary" 
                    class="flex-1"
                    @click="saveEditing"
                    :disabled="vehiclesStore.loading"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ vehiclesStore.loading ? 'Salvando...' : 'Salvar Alterações' }}
                  </Button>
                  <Button 
                    variant="outline" 
                    class="flex-1"
                    @click="cancelEditing"
                    :disabled="vehiclesStore.loading"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </Card>

            <!-- Quick Link Seguro -->
            <Card 
              title="Seguro" 
              class="border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-blue-600/5 cursor-pointer hover:border-blue-500/50 transition-all"
              @click="activeTab = 'insurance'"
            >
              <div class="space-y-4">
                <div v-if="vehicle.insuranceCompany" class="text-center py-6">
                  <div class="text-2xl font-bold text-white mb-2">
                    {{ vehicle.insuranceCompany }}
                  </div>
                  <p class="text-sm text-gray-400 mb-4">
                    Vence em {{ vehicle.insuranceExpiryDate ? formatDate(vehicle.insuranceExpiryDate) : 'N/A' }}
                  </p>
                  <Badge 
                    v-if="isInsuranceExpired" 
                    variant="error"
                  >
                    ⚠️ Vencido
                  </Badge>
                  <Badge 
                    v-else-if="isInsuranceExpiringSoon" 
                    variant="warning"
                  >
                    📅 Renovar em breve
                  </Badge>
                  <Badge v-else variant="success">
                    ✓ Em dia
                  </Badge>
                </div>
                <div v-else class="text-center py-6">
                  <p class="text-gray-400 mb-4">Sem dados de seguro</p>
                  <Badge variant="warning">Adicionar Dados</Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  class="w-full"
                  @click.stop="activeTab = 'insurance'"
                >
                  Ver Detalhes do Seguro
                </Button>
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
              </TabPanel>

              <!-- TAB: Manutenções -->
              <TabPanel tab-id="maintenance">
                <!-- Histórico de Manutenções -->
                <Card title="Histórico Completo de Manutenções">
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
              </TabPanel>

              <!-- TAB: Estatísticas -->
              <TabPanel tab-id="stats">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card title="Custo Total">
                    <div class="text-center py-6">
                      <div class="text-3xl font-bold text-purple-400 mb-2">
                        {{ formatCurrency(totalMaintenanceCost) }}
                      </div>
                      <p class="text-sm text-gray-400">Investido em manutenções</p>
                    </div>
                  </Card>

                  <Card title="Custo Médio">
                    <div class="text-center py-6">
                      <div class="text-3xl font-bold text-blue-400 mb-2">
                        {{ formatCurrency(averageMaintenanceCost) }}
                      </div>
                      <p class="text-sm text-gray-400">Por manutenção</p>
                    </div>
                  </Card>

                  <Card title="Total de Manutenções">
                    <div class="text-center py-6">
                      <div class="text-3xl font-bold text-green-400 mb-2">
                        {{ maintenanceHistory.length }}
                      </div>
                      <p class="text-sm text-gray-400">Registros no histórico</p>
                    </div>
                  </Card>

                  <Card title="Próximas Manutenções">
                    <div class="text-center py-6">
                      <div class="text-3xl font-bold text-yellow-400 mb-2">
                        {{ upcomingMaintenance.length }}
                      </div>
                      <p class="text-sm text-gray-400">Agendadas</p>
                    </div>
                  </Card>

                  <Card title="Manutenções Concluídas">
                    <div class="text-center py-6">
                      <div class="text-3xl font-bold text-emerald-400 mb-2">
                        {{ completedMaintenance.length }}
                      </div>
                      <p class="text-sm text-gray-400">Finalizadas</p>
                    </div>
                  </Card>

                  <Card title="Última Manutenção">
                    <div class="text-center py-6">
                      <div class="text-xl font-bold text-white mb-2">
                        {{ lastMaintenanceDate ? formatDate(lastMaintenanceDate) : 'N/A' }}
                      </div>
                      <p class="text-sm text-gray-400">Data do último serviço</p>
                    </div>
                  </Card>
                </div>

                <div class="mt-8 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                  <h3 class="text-lg font-semibold text-white mb-4">📊 Gráficos em Breve</h3>
                  <p class="text-gray-400 mb-4">
                    Em breve você terá acesso a gráficos detalhados sobre:
                  </p>
                  <ul class="space-y-2 text-gray-400">
                    <li class="flex items-center gap-2">
                      <span class="text-blue-400">📈</span>
                      Evolução de custos mensais
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="text-green-400">📊</span>
                      Custos por tipo de manutenção
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="text-yellow-400">📉</span>
                      Manutenções preventivas vs corretivas
                    </li>
                  </ul>
                </div>
              </TabPanel>

              <!-- TAB: Documentos -->
              <TabPanel tab-id="documents">
                <div class="space-y-6">
                  <Card title="Documentos do Veículo">
                    <div class="text-center py-12">
                      <div class="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <h3 class="text-lg font-medium text-white mb-2">Upload de Documentos</h3>
                      <p class="text-gray-400 mb-6">
                        Em breve você poderá fazer upload de documentos como CRLV, apólice de seguro, notas fiscais, etc.
                      </p>
                      <Badge variant="warning">Em Desenvolvimento</Badge>
                    </div>
                  </Card>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="📄 CRLV">
                      <div class="space-y-3 text-sm">
                        <div class="flex justify-between py-2 border-b border-gray-700">
                          <span class="text-gray-400">Status</span>
                          <Badge variant="warning" size="sm">Pendente</Badge>
                        </div>
                        <p class="text-gray-500 text-xs">
                          Adicione o documento do seu veículo para ter acesso rápido quando necessário.
                        </p>
                      </div>
                    </Card>

                    <Card title="📋 Apólice de Seguro">
                      <div class="space-y-3 text-sm">
                        <div class="flex justify-between py-2 border-b border-gray-700">
                          <span class="text-gray-400">Status</span>
                          <Badge variant="warning" size="sm">Pendente</Badge>
                        </div>
                        <p class="text-gray-500 text-xs">
                          Mantenha uma cópia digital da sua apólice de seguro sempre disponível.
                        </p>
                      </div>
                    </Card>
                  </div>
                </div>
              </TabPanel>

              <!-- TAB: Seguro -->
              <TabPanel tab-id="insurance">
                <div v-if="!vehicle.insuranceCompany && !vehicle.insurancePolicyNumber" class="text-center py-16">
                  <div class="mx-auto w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                    <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold text-white mb-2">Sem Informações de Seguro</h3>
                  <p class="text-gray-400 mb-6">
                    Adicione as informações do seguro do seu veículo para ter acesso rápido quando necessário.
                  </p>
                  <router-link to="/vehicles">
                    <Button variant="primary">Adicionar Dados do Seguro</Button>
                  </router-link>
                </div>

                <div v-else class="space-y-6">
                  <!-- Alert de Vencimento -->
                  <div v-if="isInsuranceExpired" class="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div class="flex items-start gap-3">
                      <svg class="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <h4 class="font-semibold text-red-400 mb-1">⚠️ Seguro Vencido</h4>
                        <p class="text-sm text-red-300">
                          Seu seguro está vencido. Entre em contato com a seguradora para renovar.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div v-else-if="isInsuranceExpiringSoon" class="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div class="flex items-start gap-3">
                      <svg class="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 class="font-semibold text-yellow-400 mb-1">📅 Renovação Próxima</h4>
                        <p class="text-sm text-yellow-300">
                          Seu seguro vence em breve. Considere renová-lo para manter a cobertura.
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Informações do Seguro -->
                  <Card title="Informações do Seguro" class="border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-blue-600/5">
                    <div class="space-y-4">
                      <div v-if="vehicle.insuranceCompany" class="flex items-start justify-between py-3 border-b border-gray-700">
                        <span class="text-gray-400">Seguradora</span>
                        <span class="font-medium text-white">{{ vehicle.insuranceCompany }}</span>
                      </div>
                      
                      <div v-if="vehicle.insurancePolicyNumber" class="flex items-start justify-between py-3 border-b border-gray-700">
                        <span class="text-gray-400">Número da Apólice</span>
                        <span class="font-medium text-white font-mono">{{ vehicle.insurancePolicyNumber }}</span>
                      </div>
                      
                      <div v-if="vehicle.insuranceExpiryDate" class="flex items-start justify-between py-3 border-b border-gray-700">
                        <span class="text-gray-400">Vencimento</span>
                        <div class="text-right">
                          <span class="font-medium text-white">{{ formatDate(vehicle.insuranceExpiryDate) }}</span>
                          <Badge 
                            v-if="isInsuranceExpiringSoon" 
                            variant="warning" 
                            size="sm" 
                            class="ml-2"
                          >
                            Renovar em breve
                          </Badge>
                          <Badge 
                            v-else-if="isInsuranceExpired" 
                            variant="error" 
                            size="sm" 
                            class="ml-2"
                          >
                            Vencido
                          </Badge>
                        </div>
                      </div>
                      
                      <div v-if="vehicle.insuranceValue" class="flex items-start justify-between py-3 border-b border-gray-700">
                        <span class="text-gray-400">Valor Anual</span>
                        <span class="font-semibold text-emerald-400 text-lg">{{ formatCurrency(vehicle.insuranceValue) }}</span>
                      </div>
                      
                      <div v-if="vehicle.insurancePhone" class="pt-4">
                        <a 
                          :href="`tel:${vehicle.insurancePhone}`"
                          class="flex items-center justify-center gap-3 w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>Ligar para Seguradora</span>
                          <span class="text-sm text-green-100">{{ vehicle.insurancePhone }}</span>
                        </a>
                      </div>
                    </div>
                  </Card>

                  <!-- Dicas sobre Seguro -->
                  <Card title="💡 Dicas Importantes">
                    <div class="space-y-3 text-sm text-gray-400">
                      <div class="flex items-start gap-3">
                        <span class="text-blue-400 mt-0.5">✓</span>
                        <p>Mantenha sempre uma cópia da apólice no veículo</p>
                      </div>
                      <div class="flex items-start gap-3">
                        <span class="text-blue-400 mt-0.5">✓</span>
                        <p>Revise anualmente as coberturas do seu seguro</p>
                      </div>
                      <div class="flex items-start gap-3">
                        <span class="text-blue-400 mt-0.5">✓</span>
                        <p>Compare preços de outras seguradoras antes de renovar</p>
                      </div>
                      <div class="flex items-start gap-3">
                        <span class="text-blue-400 mt-0.5">✓</span>
                        <p>Mantenha o pagamento em dia para não perder a cobertura</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabPanel>

            </template>
          </Tabs>
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
