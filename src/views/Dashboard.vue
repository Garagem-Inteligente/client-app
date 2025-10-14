<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useVehiclesStore } from '../stores/vehicles'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
import Badge from '../components/Badge.vue'
import Alert from '../components/Alert.vue'
import Navbar from '../components/Navbar.vue'

const router = useRouter()
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

      <!-- Quick Actions -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-white mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Ações Rápidas
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <!-- Registrar Manutenção -->
          <button
            @click="router.push('/maintenance?action=new')"
            class="group flex items-center gap-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-blue-500/50 rounded-lg p-4 transition-all duration-200"
          >
            <div class="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
              <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div class="text-left flex-1">
              <p class="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">Registrar</p>
              <p class="text-xs text-gray-500">Manutenção</p>
            </div>
          </button>

          <!-- Adicionar Veículo -->
          <button
            @click="router.push('/vehicles?action=new')"
            class="group flex items-center gap-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-green-500/50 rounded-lg p-4 transition-all duration-200"
          >
            <div class="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
              <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 11l-2 0 0-1c0-.5.2-1.1.5-1.5l1.8-2.2c.4-.4 1-.7 1.7-.7l13 0c.7 0 1.3.3 1.7.7l1.8 2.2c.3.4.5 1 .5 1.5l0 1-2 0 0-1c0-.3-.1-.5-.3-.7l-1.8-2.2c-.2-.2-.4-.3-.7-.3l-13 0c-.3 0-.5.1-.7.3l-1.8 2.2c-.2.2-.3.4-.3.7l0 1zm-.5 1c-.3 0-.5.2-.5.5l0 2.5 0 2.5c0 .3.2.5.5.5l.5 0 0 1.5c0 .3.2.5.5.5l2 0c.3 0 .5-.2.5-.5l0-1.5 10 0 0 1.5c0 .3.2.5.5.5l2 0c.3 0 .5-.2.5-.5l0-1.5.5 0c.3 0 .5-.2.5-.5l0-2.5 0-2.5c0-.3-.2-.5-.5-.5zm2 1.5c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm11 0c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"/>
              </svg>
            </div>
            <div class="text-left flex-1">
              <p class="text-sm font-medium text-white group-hover:text-green-400 transition-colors">Adicionar</p>
              <p class="text-xs text-gray-500">Veículo</p>
            </div>
          </button>

          <!-- Ver Histórico -->
          <button
            @click="router.push('/maintenance')"
            class="group flex items-center gap-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-purple-500/50 rounded-lg p-4 transition-all duration-200"
          >
            <div class="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
              <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="text-left flex-1">
              <p class="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">Ver</p>
              <p class="text-xs text-gray-500">Histórico</p>
            </div>
          </button>

          <!-- Meus Veículos -->
          <button
            @click="router.push('/vehicles')"
            class="group flex items-center gap-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-orange-500/50 rounded-lg p-4 transition-all duration-200"
          >
            <div class="p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
              <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div class="text-left flex-1">
              <p class="text-sm font-medium text-white group-hover:text-orange-400 transition-colors">Meus</p>
              <p class="text-xs text-gray-500">Veículos</p>
            </div>
          </button>
        </div>
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
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <!-- Veículos Card -->
        <router-link to="/vehicles">
          <div class="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-4 sm:p-6 hover:border-blue-500/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
            <div class="flex items-start justify-between mb-3 sm:mb-4">
              <div>
                <p class="text-xs sm:text-sm text-gray-400 mb-1">Total de Veículos</p>
                <div class="text-2xl sm:text-3xl font-bold text-white">{{ vehiclesStore.vehicleCount }}</div>
              </div>
              <div class="p-2 sm:p-3 bg-blue-500/20 rounded-lg flex-shrink-0">
                <svg class="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 11l-2 0 0-1c0-.5.2-1.1.5-1.5l1.8-2.2c.4-.4 1-.7 1.7-.7l13 0c.7 0 1.3.3 1.7.7l1.8 2.2c.3.4.5 1 .5 1.5l0 1-2 0 0-1c0-.3-.1-.5-.3-.7l-1.8-2.2c-.2-.2-.4-.3-.7-.3l-13 0c-.3 0-.5.1-.7.3l-1.8 2.2c-.2.2-.3.4-.3.7l0 1zm-.5 1c-.3 0-.5.2-.5.5l0 2.5 0 2.5c0 .3.2.5.5.5l.5 0 0 1.5c0 .3.2.5.5.5l2 0c.3 0 .5-.2.5-.5l0-1.5 10 0 0 1.5c0 .3.2.5.5.5l2 0c.3 0 .5-.2.5-.5l0-1.5.5 0c.3 0 .5-.2.5-.5l0-2.5 0-2.5c0-.3-.2-.5-.5-.5zm2 1.5c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm11 0c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"/>
                </svg>
              </div>
            </div>
            <p class="text-xs text-gray-500">Veículos na sua garagem</p>
          </div>
        </router-link>

        <!-- Manutenções Card -->
        <router-link to="/maintenance">
          <div class="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-4 sm:p-6 hover:border-green-500/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
            <div class="flex items-start justify-between mb-3 sm:mb-4">
              <div>
                <p class="text-xs sm:text-sm text-gray-400 mb-1">Manutenções</p>
                <div class="text-2xl sm:text-3xl font-bold text-white">{{ vehiclesStore.totalMaintenanceRecords }}</div>
              </div>
              <div class="p-2 sm:p-3 bg-green-500/20 rounded-lg flex-shrink-0">
                <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <p class="text-xs text-gray-500">Registros no histórico</p>
          </div>
        </router-link>

        <!-- Custo Total Card -->
        <router-link to="/maintenance">
          <div class="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-4 sm:p-6 hover:border-purple-500/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
            <div class="flex items-start justify-between mb-3 sm:mb-4">
              <div class="min-w-0 flex-1 pr-2">
                <p class="text-xs sm:text-sm text-gray-400 mb-1">Custo Total</p>
                <div class="text-xl sm:text-2xl font-bold text-white truncate">{{ formatCurrency(totalCost) }}</div>
              </div>
              <div class="p-2 sm:p-3 bg-purple-500/20 rounded-lg flex-shrink-0">
                <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p class="text-xs text-gray-500">Investido em manutenções</p>
          </div>
        </router-link>

        <!-- Próximas Manutenções Card -->
        <router-link to="/maintenance">
          <div class="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-xl p-4 sm:p-6 hover:border-yellow-500/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
            <div class="flex items-start justify-between mb-3 sm:mb-4">
              <div>
                <p class="text-xs sm:text-sm text-gray-400 mb-1">Agendadas</p>
                <div class="text-2xl sm:text-3xl font-bold text-white">{{ vehiclesStore.upcomingMaintenance.length }}</div>
              </div>
              <div class="p-2 sm:p-3 bg-yellow-500/20 rounded-lg flex-shrink-0">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p class="text-xs text-gray-500">Próximas manutenções</p>
              <Badge v-if="overdueCount > 0" variant="error" size="sm" class="w-fit">{{ overdueCount }} atrasadas</Badge>
            </div>
          </div>
        </router-link>
      </div>
      
      <!-- Quick Actions -->
      <div class="mb-8">
        <h2 class="text-xl font-bold text-white mb-4">Ações Rápidas</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Adicionar Veículo Card -->
          <router-link to="/vehicles" class="group">
            <div class="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-2 border-blue-500/30 rounded-xl p-6 hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
              <div class="flex items-start space-x-4">
                <div class="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    Adicionar Veículo
                  </h3>
                  <p class="text-sm text-gray-400">
                    Cadastre um novo veículo na sua garagem
                  </p>
                </div>
                <svg class="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </router-link>
          
          <!-- Registrar Manutenção Card -->
          <router-link to="/maintenance" class="group">
            <div class="bg-gradient-to-br from-green-500/10 to-green-600/10 border-2 border-green-500/30 rounded-xl p-6 hover:border-green-500/60 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300">
              <div class="flex items-start space-x-4">
                <div class="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                  <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
                    Registrar Manutenção
                  </h3>
                  <p class="text-sm text-gray-400">
                    Adicione um novo registro de manutenção
                  </p>
                </div>
                <svg class="w-5 h-5 text-gray-500 group-hover:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </router-link>
        </div>
      </div>
      
      <!-- Meus Veículos - Full Width -->
      <Card title="Meus Veículos" class="mb-8 hover:shadow-xl transition-shadow duration-300">
          <div v-if="vehiclesStore.vehicles.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <p class="text-gray-400 mb-4">Nenhum veículo cadastrado</p>
            <router-link to="/vehicles">
              <Button variant="primary">Adicionar primeiro veículo</Button>
            </router-link>
          </div>
          
          <div v-else class="space-y-3">
            <router-link
              v-for="vehicle in vehiclesStore.vehicles.slice(0, 3)" 
              :key="vehicle.id"
              :to="`/vehicles/${vehicle.id}`"
              class="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 hover:border-blue-500/50 border border-transparent transition-all duration-200 cursor-pointer group"
            >
              <div class="flex items-center space-x-4">
                <div class="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 border border-blue-500/30 group-hover:border-blue-500/50 transition-all">
                  <svg class="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 11l-2 0 0-1c0-.5.2-1.1.5-1.5l1.8-2.2c.4-.4 1-.7 1.7-.7l13 0c.7 0 1.3.3 1.7.7l1.8 2.2c.3.4.5 1 .5 1.5l0 1-2 0 0-1c0-.3-.1-.5-.3-.7l-1.8-2.2c-.2-.2-.4-.3-.7-.3l-13 0c-.3 0-.5.1-.7.3l-1.8 2.2c-.2.2-.3.4-.3.7l0 1zm-.5 1c-.3 0-.5.2-.5.5l0 2.5 0 2.5c0 .3.2.5.5.5l.5 0 0 1.5c0 .3.2.5.5.5l2 0c.3 0 .5-.2.5-.5l0-1.5 10 0 0 1.5c0 .3.2.5.5.5l2 0c.3 0 .5-.2.5-.5l0-1.5.5 0c.3 0 .5-.2.5-.5l0-2.5 0-2.5c0-.3-.2-.5-.5-.5zm2 1.5c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm11 0c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-medium text-white group-hover:text-blue-400 transition-colors">
                    {{ vehicle.make }} {{ vehicle.model }}
                  </h3>
                  <p class="text-sm text-gray-400">
                    {{ vehicle.year }} • {{ vehicle.plate }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-3">
                <div class="text-right">
                  <p class="text-sm font-medium text-white">
                    {{ vehicle.mileage.toLocaleString('pt-BR') }} km
                  </p>
                  <Badge :variant="vehicle.fuelType === 'electric' ? 'success' : 'default'" size="sm">
                    {{ vehicle.fuelType === 'gasoline' ? 'Gasolina' : 
                       vehicle.fuelType === 'diesel' ? 'Diesel' :
                       vehicle.fuelType === 'electric' ? 'Elétrico' : 'Híbrido' }}
                  </Badge>
                </div>
                <svg class="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </router-link>
            
            <router-link to="/vehicles" v-if="vehiclesStore.vehicles.length > 3">
              <Button variant="outline" size="sm" class="w-full">
                Ver todos os veículos
              </Button>
            </router-link>
          </div>
        </Card>
      
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

      <!-- Manutenções Grid (Últimas + Próximas) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Últimas Manutenções Card -->
        <Card title="🔧 Últimas Manutenções" class="hover:shadow-xl transition-shadow duration-300">
          <div v-if="vehiclesStore.recentMaintenance.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p class="text-gray-400 mb-4">Nenhuma manutenção registrada</p>
            <router-link to="/maintenance">
              <Button variant="primary">Registrar manutenção</Button>
            </router-link>
          </div>
          
          <div v-else class="space-y-3">
            <div 
              v-for="maintenance in vehiclesStore.recentMaintenance" 
              :key="maintenance.id"
              class="flex items-center justify-between p-4 rounded-lg bg-gray-800 hover:bg-gray-750 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              @click="$router.push('/maintenance')"
            >
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-1">
                  <Badge variant="success">
                    {{ getMaintenanceTypeLabel(maintenance.type) }}
                  </Badge>
                </div>
                <p class="text-sm text-gray-400">
                  {{ vehiclesStore.getVehicleById(maintenance.vehicleId)?.make }} 
                  {{ vehiclesStore.getVehicleById(maintenance.vehicleId)?.model }}
                </p>
                <p class="text-xs text-gray-500 mt-1" v-if="maintenance.description">
                  {{ maintenance.description }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-white">
                  {{ formatDate(maintenance.date) }}
                </p>
                <p class="text-xs text-emerald-400 font-medium">
                  {{ formatCurrency(maintenance.cost) }}
                </p>
                <p class="text-xs text-gray-400" v-if="maintenance.mileage">
                  {{ maintenance.mileage.toLocaleString('pt-BR') }} km
                </p>
              </div>
            </div>
            
            <router-link to="/maintenance">
              <Button variant="outline" size="sm" class="w-full">
                Ver histórico completo
              </Button>
            </router-link>
          </div>
        </Card>

        <!-- Próximas Manutenções Card -->
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
      <!-- Fim Manutenções Grid -->
    </div>
    </div>
  </div>
</template>

<style scoped>
.bg-gray-750 {
  background-color: #2d3748;
}
</style>
