<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVehiclesStore } from '../stores/vehicles'
import type { Vehicle } from '../stores/vehicles'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
import Input from '../components/Input.vue'
import Badge from '../components/Badge.vue'
import Alert from '../components/Alert.vue'
import Navbar from '../components/Navbar.vue'

const vehiclesStore = useVehiclesStore()

const showAddForm = ref(false)
const editingVehicle = ref<Vehicle | null>(null)

// Form data
const formData = ref({
  make: '',
  model: '',
  year: new Date().getFullYear(),
  plate: '',
  color: '',
  mileage: 0,
  fuelType: 'gasoline' as 'gasoline' | 'diesel' | 'electric' | 'hybrid'
})

const resetForm = () => {
  formData.value = {
    make: '',
    model: '',
    year: new Date().getFullYear(),
    plate: '',
    color: '',
    mileage: 0,
    fuelType: 'gasoline'
  }
  editingVehicle.value = null
  showAddForm.value = false
}

const handleSubmit = async () => {
  try {
    if (editingVehicle.value) {
      await vehiclesStore.updateVehicle(editingVehicle.value.id, formData.value)
    } else {
      await vehiclesStore.addVehicle(formData.value)
    }
    resetForm()
  } catch (error) {
    console.error('Error saving vehicle:', error)
  }
}

const startEdit = (vehicle: Vehicle) => {
  editingVehicle.value = vehicle
  formData.value = {
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    plate: vehicle.plate,
    color: vehicle.color || '',
    mileage: vehicle.mileage,
    fuelType: vehicle.fuelType
  }
  showAddForm.value = true
}

const handleDelete = async (vehicle: Vehicle) => {
  if (confirm(`Tem certeza que deseja excluir o veículo ${vehicle.make} ${vehicle.model}?`)) {
    try {
      await vehiclesStore.deleteVehicle(vehicle.id)
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    }
  }
}

const getFuelTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    gasoline: 'Gasolina',
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

onMounted(() => {
  vehiclesStore.fetchVehicles()
})
</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <Navbar />
    <div class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-white">Meus Veículos</h1>
          <p class="mt-2 text-gray-400">
            Gerencie seus veículos e informações
          </p>
        </div>
        
        <Button 
          v-if="!showAddForm"
          @click="showAddForm = true" 
          variant="primary"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Adicionar Veículo
        </Button>
      </div>
      
      <!-- Add/Edit Form -->
      <Card v-if="showAddForm" :title="editingVehicle ? 'Editar Veículo' : 'Adicionar Veículo'" class="mb-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <Alert 
            v-if="vehiclesStore.error" 
            type="error" 
            :message="vehiclesStore.error"
            @close="vehiclesStore.clearError"
          />
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="make" class="block text-sm font-medium text-gray-300 mb-2">
                Marca *
              </label>
              <Input
                id="make"
                v-model="formData.make"
                type="text"
                placeholder="Ex: Toyota, Honda, Ford"
                required
                :disabled="vehiclesStore.loading"
              />
            </div>
            
            <div>
              <label for="model" class="block text-sm font-medium text-gray-300 mb-2">
                Modelo *
              </label>
              <Input
                id="model"
                v-model="formData.model"
                type="text"
                placeholder="Ex: Corolla, Civic, Focus"
                required
                :disabled="vehiclesStore.loading"
              />
            </div>
            
            <div>
              <label for="year" class="block text-sm font-medium text-gray-300 mb-2">
                Ano *
              </label>
              <Input
                id="year"
                v-model.number="formData.year"
                type="number"
                :min="1900"
                :max="new Date().getFullYear() + 1"
                required
                :disabled="vehiclesStore.loading"
              />
            </div>
            
            <div>
              <label for="plate" class="block text-sm font-medium text-gray-300 mb-2">
                Placa *
              </label>
              <Input
                id="plate"
                v-model="formData.plate"
                type="text"
                placeholder="ABC-1234"
                required
                :disabled="vehiclesStore.loading"
              />
            </div>
            
            <div>
              <label for="color" class="block text-sm font-medium text-gray-300 mb-2">
                Cor
              </label>
              <Input
                id="color"
                v-model="formData.color"
                type="text"
                placeholder="Ex: Branco, Preto, Prata"
                :disabled="vehiclesStore.loading"
              />
            </div>
            
            <div>
              <label for="mileage" class="block text-sm font-medium text-gray-300 mb-2">
                Quilometragem *
              </label>
              <Input
                id="mileage"
                v-model.number="formData.mileage"
                type="number"
                min="0"
                placeholder="0"
                required
                :disabled="vehiclesStore.loading"
              />
            </div>
            
            <div class="md:col-span-2">
              <label for="fuelType" class="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Combustível *
              </label>
              <select
                id="fuelType"
                v-model="formData.fuelType"
                class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                :disabled="vehiclesStore.loading"
              >
                <option value="gasoline">Gasolina</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Elétrico</option>
                <option value="hybrid">Híbrido</option>
              </select>
            </div>
          </div>
          
          <div class="flex justify-end space-x-4">
            <Button 
              type="button" 
              @click="resetForm" 
              variant="outline"
              :disabled="vehiclesStore.loading"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              :loading="vehiclesStore.loading"
              :disabled="!formData.make || !formData.model || !formData.plate"
            >
              {{ editingVehicle ? 'Atualizar' : 'Adicionar' }}
            </Button>
          </div>
        </form>
      </Card>
      
      <!-- Vehicles List -->
      <div v-if="vehiclesStore.vehicles.length === 0 && !showAddForm" class="text-center py-16">
        <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <h3 class="text-lg font-medium text-white mb-2">Nenhum veículo cadastrado</h3>
        <p class="text-gray-400 mb-6">Comece adicionando seu primeiro veículo</p>
        <Button @click="showAddForm = true" variant="primary">
          Adicionar primeiro veículo
        </Button>
      </div>
      
      <div v-else-if="!showAddForm" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          v-for="vehicle in vehiclesStore.vehicles" 
          :key="vehicle.id"
          :title="`${vehicle.make} ${vehicle.model}`"
        >
          <div class="space-y-4">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm text-gray-400">Ano</p>
                <p class="font-medium text-white">{{ vehicle.year }}</p>
              </div>
              <Badge :variant="getFuelTypeBadgeVariant(vehicle.fuelType)">
                {{ getFuelTypeLabel(vehicle.fuelType) }}
              </Badge>
            </div>
            
            <div>
              <p class="text-sm text-gray-400">Placa</p>
              <p class="font-medium text-white">{{ vehicle.plate }}</p>
            </div>
            
            <div v-if="vehicle.color">
              <p class="text-sm text-gray-400">Cor</p>
              <p class="font-medium text-white">{{ vehicle.color }}</p>
            </div>
            
            <div>
              <p class="text-sm text-gray-400">Quilometragem</p>
              <p class="font-medium text-white">{{ vehicle.mileage.toLocaleString('pt-BR') }} km</p>
            </div>
            
            <div class="flex space-x-2 pt-4">
              <Button 
                @click="startEdit(vehicle)" 
                variant="outline" 
                size="sm"
                class="flex-1"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </Button>
              <Button 
                @click="handleDelete(vehicle)" 
                variant="outline" 
                size="sm"
                class="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
    </div>
  </div>
</template>