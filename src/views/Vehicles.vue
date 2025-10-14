<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useVehiclesStore } from '../stores/vehicles'
import type { Vehicle, FuelType, VehicleType as AppVehicleType } from '../stores/vehicles'
import { FUEL_TYPE_LABELS } from '@/constants/vehicles'
import { fipeApi, type VehicleType } from '../services/fipeApi'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
import Input from '../components/Input.vue'
import Badge from '../components/Badge.vue'
import Alert from '../components/Alert.vue'
import Navbar from '../components/Navbar.vue'
import SearchableSelect from '../components/SearchableSelect.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

const vehiclesStore = useVehiclesStore()

const showAddForm = ref(false)
const editingVehicle = ref<Vehicle | null>(null)

// Modal de confirmação
const showDeleteModal = ref(false)
const vehicleToDelete = ref<Vehicle | null>(null)
const deletingVehicle = ref(false)

// FIPE API State
const vehicleType = ref<VehicleType>('cars')
const brands = ref<Array<{ code: string; name: string }>>([])
const models = ref<Array<{ code: string; name: string }>>([])
const years = ref<Array<{ code: string; name: string }>>([])

const loadingBrands = ref(false)
const loadingModels = ref(false)
const loadingYears = ref(false)

// Form data
const formData = ref({
  vehicleType: 'car' as AppVehicleType,
  make: '',
  model: '',
  year: new Date().getFullYear(),
  plate: '',
  color: '',
  mileage: 0,
  fuelType: 'flex' as FuelType,
  // FIPE data
  brandCode: '',
  modelCode: '',
  yearCode: ''
})

// Load brands when form opens
const loadBrands = async () => {
  try {
    loadingBrands.value = true
    brands.value = await fipeApi.getBrandsByType(vehicleType.value)
  } catch (error) {
    console.error('Erro ao carregar marcas:', error)
    brands.value = []
  } finally {
    loadingBrands.value = false
  }
}

// Load models when brand changes
watch(() => formData.value.brandCode, async (newBrandCode) => {
  if (!newBrandCode) {
    models.value = []
    years.value = []
    formData.value.modelCode = ''
    formData.value.yearCode = ''
    return
  }

  try {
    loadingModels.value = true
    models.value = await fipeApi.getModelsByBrand(vehicleType.value, newBrandCode)
    years.value = []
    formData.value.yearCode = ''
  } catch (error) {
    console.error('Erro ao carregar modelos:', error)
    models.value = []
  } finally {
    loadingModels.value = false
  }
})

// Load years when model changes
watch(() => formData.value.modelCode, async (newModelCode) => {
  if (!newModelCode || !formData.value.brandCode) {
    years.value = []
    formData.value.yearCode = ''
    return
  }

  try {
    loadingYears.value = true
    years.value = await fipeApi.getYearsByModel(
      vehicleType.value,
      formData.value.brandCode,
      newModelCode
    )
  } catch (error) {
    console.error('Erro ao carregar anos:', error)
    years.value = []
  } finally {
    loadingYears.value = false
  }
})

// Update form when brand is selected
const handleBrandSelect = (option: { code: string; name: string }) => {
  formData.value.make = option.name
}

// Update form when model is selected
const handleModelSelect = (option: { code: string; name: string }) => {
  formData.value.model = option.name
}

// Update form when year is selected
const handleYearSelect = (option: { code: string; name: string }) => {
  // Extract year from name (ex: "2023 Gasolina" -> 2023)
  const yearMatch = option.name.match(/^\d{4}/)
  if (yearMatch) {
    formData.value.year = parseInt(yearMatch[0])
  }
  
  // Try to extract fuel type from name
  const nameLower = option.name.toLowerCase()
  if (nameLower.includes('diesel')) {
    formData.value.fuelType = 'diesel'
  } else if (nameLower.includes('elétrico') || nameLower.includes('eletrico')) {
    formData.value.fuelType = 'electric'
  } else if (nameLower.includes('etanol') || nameLower.includes('álcool')) {
    formData.value.fuelType = 'ethanol'
  } else if (nameLower.includes('flex')) {
    formData.value.fuelType = 'flex'
  } else if (nameLower.includes('híbrido') || nameLower.includes('hibrido')) {
    formData.value.fuelType = nameLower.includes('plugin') ? 'hybrid-plugin' : 'hybrid-mild'
  } else if (nameLower.includes('gnv')) {
    formData.value.fuelType = 'gnv'
  } else if (nameLower.includes('gasolina')) {
    formData.value.fuelType = 'gasoline'
  }
}

const resetForm = () => {
  formData.value = {
    vehicleType: 'car',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    plate: '',
    color: '',
    mileage: 0,
    fuelType: 'flex',
    brandCode: '',
    modelCode: '',
    yearCode: ''
  }
  brands.value = []
  models.value = []
  years.value = []
  editingVehicle.value = null
  showAddForm.value = false
}

const handleSubmit = async () => {
  try {
    const vehicleData = {
      vehicleType: formData.value.vehicleType,
      make: formData.value.make,
      model: formData.value.model,
      year: formData.value.year,
      plate: formData.value.plate,
      color: formData.value.color,
      mileage: formData.value.mileage,
      fuelType: formData.value.fuelType
    }

    if (editingVehicle.value) {
      await vehiclesStore.updateVehicle(editingVehicle.value.id, vehicleData)
    } else {
      await vehiclesStore.addVehicle(vehicleData)
    }
    resetForm()
  } catch (error) {
    console.error('Error saving vehicle:', error)
  }
}

const startEdit = (vehicle: Vehicle) => {
  editingVehicle.value = vehicle
  formData.value = {
    vehicleType: vehicle.vehicleType,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    plate: vehicle.plate,
    color: vehicle.color || '',
    mileage: vehicle.mileage,
    fuelType: vehicle.fuelType,
    brandCode: '',
    modelCode: '',
    yearCode: ''
  }
  showAddForm.value = true
  // Don't load FIPE data when editing, user can change manually
}

const handleDelete = (vehicle: Vehicle) => {
  vehicleToDelete.value = vehicle
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!vehicleToDelete.value) return
  
  try {
    deletingVehicle.value = true
    await vehiclesStore.deleteVehicle(vehicleToDelete.value.id)
    showDeleteModal.value = false
    vehicleToDelete.value = null
  } catch (error) {
    console.error('Error deleting vehicle:', error)
  } finally {
    deletingVehicle.value = false
  }
}

const cancelDelete = () => {
  showDeleteModal.value = false
  vehicleToDelete.value = null
}

const getFuelTypeLabel = (type: FuelType) => {
  return FUEL_TYPE_LABELS[type] || type
}

const getFuelTypeBadgeVariant = (type: FuelType) => {
  const variants: Record<FuelType, 'default' | 'success' | 'warning' | 'error'> = {
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

// Watch form visibility to load brands
watch(showAddForm, (isOpen) => {
  if (isOpen && !editingVehicle.value) {
    loadBrands()
  }
})

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
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
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
          class="w-full sm:w-auto"
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

          <!-- Info alert -->
          <Alert v-if="!editingVehicle" type="info" class="text-sm">
            Use os campos de busca abaixo para encontrar seu veículo na tabela FIPE
          </Alert>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <!-- Brand Select with FIPE -->
            <div v-if="!editingVehicle">
              <SearchableSelect
                v-model="formData.brandCode"
                :options="brands"
                label="Marca"
                placeholder="Digite para buscar a marca..."
                :loading="loadingBrands"
                :disabled="vehiclesStore.loading"
                required
                @select="handleBrandSelect"
              />
            </div>

            <!-- Manual Brand Input (for editing) -->
            <div v-else>
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
            
            <!-- Model Select with FIPE -->
            <div v-if="!editingVehicle">
              <SearchableSelect
                v-model="formData.modelCode"
                :options="models"
                label="Modelo"
                placeholder="Selecione primeiro a marca..."
                :loading="loadingModels"
                :disabled="vehiclesStore.loading || !formData.brandCode"
                required
                @select="handleModelSelect"
              />
            </div>

            <!-- Manual Model Input (for editing) -->
            <div v-else>
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
            
            <!-- Year Select with FIPE -->
            <div v-if="!editingVehicle">
              <SearchableSelect
                v-model="formData.yearCode"
                :options="years"
                label="Ano"
                placeholder="Selecione primeiro o modelo..."
                :loading="loadingYears"
                :disabled="vehiclesStore.loading || !formData.modelCode"
                required
                @select="handleYearSelect"
              />
            </div>

            <!-- Manual Year Input (for editing) -->
            <div v-else>
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
                <option value="gasoline">Gasolina / Flex</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Elétrico</option>
                <option value="hybrid">Híbrido</option>
              </select>
            </div>
          </div>
          
          <div class="flex flex-col-reverse sm:flex-row justify-end gap-3">
            <Button 
              type="button" 
              @click="resetForm" 
              variant="outline"
              :disabled="vehiclesStore.loading"
              class="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              :disabled="!formData.make || !formData.model || !formData.plate || vehiclesStore.loading"
              class="w-full sm:w-auto"
            >
              <span v-if="vehiclesStore.loading">Salvando...</span>
              <span v-else>{{ editingVehicle ? 'Atualizar' : 'Adicionar' }}</span>
            </Button>
          </div>
        </form>
      </Card>
      
      <!-- Empty State -->
      <div v-if="vehiclesStore.vehicles.length === 0 && !showAddForm" class="text-center py-16">
        <svg class="mx-auto h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <h3 class="text-xl font-medium text-white mb-2">Nenhum veículo cadastrado</h3>
        <p class="text-gray-400 mb-6 max-w-md mx-auto">
          Comece adicionando seu primeiro veículo e mantenha um histórico completo de manutenções
        </p>
        <Button @click="showAddForm = true" variant="primary">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Adicionar primeiro veículo
        </Button>
      </div>
      
      <!-- Vehicles Grid -->
      <div v-else-if="!showAddForm" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card 
          v-for="vehicle in vehiclesStore.vehicles" 
          :key="vehicle.id"
          :title="`${vehicle.make} ${vehicle.model}`"
          class="hover:border-gray-600 transition-all cursor-pointer group"
          @click="$router.push(`/vehicles/${vehicle.id}`)"
        >
          <div class="space-y-3 sm:space-y-4 group-hover:opacity-90 transition-opacity">
            <!-- Header -->
            <div class="flex justify-between items-start mb-3 sm:mb-4 gap-2">
              <div class="min-w-0 flex-1">
                <p class="text-xs sm:text-sm text-gray-400">Ano</p>
                <p class="font-medium text-white">{{ vehicle.year }}</p>
              </div>
              <Badge :variant="getFuelTypeBadgeVariant(vehicle.fuelType)" size="sm" class="flex-shrink-0">
                {{ getFuelTypeLabel(vehicle.fuelType) }}
              </Badge>
            </div>
            
            <!-- Details -->
            <div class="space-y-2 sm:space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-400">Placa</span>
                <span class="font-medium text-white">{{ vehicle.plate }}</span>
              </div>
              
              <div v-if="vehicle.color" class="flex justify-between">
                <span class="text-sm text-gray-400">Cor</span>
                <span class="font-medium text-white">{{ vehicle.color }}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-sm text-gray-400">Quilometragem</span>
                <span class="font-medium text-white">{{ vehicle.mileage.toLocaleString('pt-BR') }} km</span>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4 border-t border-gray-700">
              <Button 
                @click.stop="startEdit(vehicle)" 
                variant="outline" 
                size="sm"
                class="flex-1 w-full sm:w-auto"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </Button>
              <Button 
                @click.stop="handleDelete(vehicle)" 
                variant="outline"
                size="sm"
                class="flex-1 w-full sm:w-auto !text-red-400 !border-red-400/30 hover:!bg-red-400/10"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Excluir
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
    </div>
  </div>

  <!-- Modal de confirmação de exclusão -->
  <ConfirmModal
    :isOpen="showDeleteModal"
    @update:isOpen="showDeleteModal = $event"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
    title="Excluir Veículo"
    :message="`Tem certeza que deseja excluir o veículo ${vehicleToDelete?.make} ${vehicleToDelete?.model}?`"
    confirmText="Excluir"
    cancelText="Cancelar"
    variant="danger"
    :loading="deletingVehicle"
  />
</template>