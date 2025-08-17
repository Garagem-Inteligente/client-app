<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useVehiclesStore } from '../stores/vehicles'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
import Badge from '../components/Badge.vue'

const authStore = useAuthStore()
const vehiclesStore = useVehiclesStore()

onMounted(() => {
  vehiclesStore.fetchVehicles()
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

// const formatCurrency = (value: number) => {
//   return new Intl.NumberFormat('pt-BR', {
//     style: 'currency',
//     currency: 'BRL'
//   }).format(value)
// }
</script>

<template>
  <div class="min-h-screen bg-gray-900 py-8">
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
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Veículos">
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-400 mb-2">
              {{ vehiclesStore.vehicleCount }}
            </div>
            <p class="text-gray-400">Veículos cadastrados</p>
          </div>
        </Card>
        
        <Card title="Manutenções">
          <div class="text-center">
            <div class="text-3xl font-bold text-green-400 mb-2">
              {{ vehiclesStore.totalMaintenanceRecords }}
            </div>
            <p class="text-gray-400">Registros de manutenção</p>
          </div>
        </Card>
        
        <Card title="Próximas">
          <div class="text-center">
            <div class="text-3xl font-bold text-yellow-400 mb-2">
              {{ vehiclesStore.upcomingMaintenance.length }}
            </div>
            <p class="text-gray-400">Manutenções agendadas</p>
          </div>
        </Card>
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
        <Card title="Meus Veículos">
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
              class="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
            >
              <div>
                <h3 class="font-medium text-white">
                  {{ vehicle.make }} {{ vehicle.model }}
                </h3>
                <p class="text-sm text-gray-400">
                  {{ vehicle.year }} • {{ vehicle.plate }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-400">
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
      
      <!-- Upcoming Maintenance -->
      <Card title="Próximas Manutenções">
        <div v-if="vehiclesStore.upcomingMaintenance.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-gray-400 mb-4">Nenhuma manutenção agendada</p>
          <router-link to="/maintenance">
            <Button variant="primary">Agendar manutenção</Button>
          </router-link>
        </div>
        
        <div v-else class="space-y-4">
          <div 
            v-for="maintenance in vehiclesStore.upcomingMaintenance.slice(0, 5)" 
            :key="maintenance.id"
            class="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
          >
            <div class="flex-1">
              <h3 class="font-medium text-white">
                {{ getMaintenanceTypeLabel(maintenance.type) }}
              </h3>
              <p class="text-sm text-gray-400">
                {{ vehiclesStore.getVehicleById(maintenance.vehicleId)?.make }} 
                {{ vehiclesStore.getVehicleById(maintenance.vehicleId)?.model }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-yellow-400">
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
</template>