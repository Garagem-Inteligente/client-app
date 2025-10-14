<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6">Registrar Abastecimento</h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Data do Abastecimento -->
      <div>
        <label for="date" class="block text-sm font-medium mb-2">
          Data do Abastecimento
        </label>
        <input
          id="date"
          v-model="formData.date"
          type="date"
          :max="maxDate"
          required
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
        />
      </div>

      <!-- Tipo de Combustível -->
      <div>
        <label for="fuelType" class="block text-sm font-medium mb-2">
          Tipo de Combustível
        </label>
        <select
          id="fuelType"
          v-model="formData.fuelType"
          required
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
        >
          <option value="gasoline">Gasolina</option>
          <option value="ethanol">Etanol</option>
          <option value="diesel">Diesel</option>
          <option value="gnv">GNV</option>
          <option value="electric">Elétrico (kWh)</option>
        </select>
      </div>

      <!-- Quilometragem Atual -->
      <div>
        <label for="currentMileage" class="block text-sm font-medium mb-2">
          Quilometragem Atual (km)
        </label>
        <input
          id="currentMileage"
          v-model.number="formData.currentMileage"
          type="number"
          min="0"
          step="1"
          required
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
          @blur="validateMileage"
        />
        <p v-if="mileageError" class="text-red-500 text-sm mt-1">
          {{ mileageError }}
        </p>
      </div>

      <!-- Litros / kWh -->
      <div>
        <label for="liters" class="block text-sm font-medium mb-2">
          {{ formData.fuelType === 'electric' ? 'kWh' : 'Litros' }}
        </label>
        <input
          id="liters"
          v-model.number="formData.liters"
          type="number"
          min="0.01"
          step="0.01"
          required
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
          @input="calculateCostPerLiter"
        />
      </div>

      <!-- Valor Total -->
      <div>
        <label for="totalCost" class="block text-sm font-medium mb-2">
          Valor Total (R$)
        </label>
        <input
          id="totalCost"
          v-model.number="formData.totalCost"
          type="number"
          min="0.01"
          step="0.01"
          required
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
          @input="calculateCostPerLiter"
        />
      </div>

      <!-- Custo por Litro (calculado) -->
      <div v-if="costPerLiter > 0" class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p class="text-sm font-medium text-blue-900 dark:text-blue-100">
          Custo por {{ formData.fuelType === 'electric' ? 'kWh' : 'litro' }}: 
          <span class="text-lg font-bold">R$ {{ costPerLiter.toFixed(2) }}</span>
        </p>
      </div>

      <!-- Tanque Cheio -->
      <div class="flex items-center">
        <input
          id="isFullTank"
          v-model="formData.isFullTank"
          type="checkbox"
          class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label for="isFullTank" class="ml-2 text-sm font-medium">
          Tanque cheio (necessário para calcular consumo)
        </label>
      </div>

      <!-- Eficiência Calculada -->
      <div v-if="calculatedEfficiency" class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <p class="text-sm font-medium text-green-900 dark:text-green-100">
          <span class="text-2xl font-bold">{{ calculatedEfficiency.toFixed(2) }}</span>
          {{ formData.fuelType === 'electric' ? ' km/kWh' : ' km/l' }}
        </p>
        <p class="text-xs text-green-700 dark:text-green-300 mt-1">
          Distância percorrida: {{ distanceTraveled }} km
        </p>
      </div>

      <!-- Observações -->
      <div>
        <label for="notes" class="block text-sm font-medium mb-2">
          Observações (opcional)
        </label>
        <textarea
          id="notes"
          v-model="formData.notes"
          rows="3"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
          placeholder="Ex: Posto X, ar condicionado ligado, viagem..."
        />
      </div>

      <!-- Botões -->
      <div class="flex gap-4">
        <button
          type="submit"
          :disabled="loading || !!mileageError"
          class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ loading ? 'Salvando...' : 'Salvar Abastecimento' }}
        </button>
        <button
          type="button"
          @click="resetForm"
          class="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Limpar
        </button>
      </div>
    </form>

    <!-- Mensagens de Sucesso/Erro -->
    <div v-if="successMessage" class="mt-4 p-4 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="mt-4 p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFuelStore, type FuelRecordInput } from '@/stores/fuel'
import { useRoute } from 'vue-router'

const fuelStore = useFuelStore()
const route = useRoute()

const vehicleId = computed(() => route.params.id as string)

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const mileageError = ref('')

const formData = ref<Omit<FuelRecordInput, 'vehicleId'>>({
  date: new Date(),
  liters: 0,
  totalCost: 0,
  currentMileage: 0,
  fuelType: 'gasoline',
  isFullTank: false,
  notes: ''
})

const maxDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const costPerLiter = ref(0)
const calculatedEfficiency = ref(0)
const distanceTraveled = ref(0)

onMounted(async () => {
  // Buscar último registro para sugerir quilometragem
  await fuelStore.fetchFuelRecords()
  const lastRecord = fuelStore.getLastRecord(vehicleId.value)
  if (lastRecord) {
    formData.value.currentMileage = lastRecord.currentMileage
    formData.value.fuelType = lastRecord.fuelType
  }
})

const calculateCostPerLiter = () => {
  if (formData.value.liters > 0 && formData.value.totalCost > 0) {
    costPerLiter.value = formData.value.totalCost / formData.value.liters
  } else {
    costPerLiter.value = 0
  }
}

const validateMileage = () => {
  mileageError.value = ''
  const lastRecord = fuelStore.getLastRecord(vehicleId.value)
  
  if (lastRecord && formData.value.currentMileage < lastRecord.currentMileage) {
    mileageError.value = `A quilometragem não pode ser menor que o último registro (${lastRecord.currentMileage} km)`
  }

  // Calcular eficiência se for tanque cheio
  if (
    lastRecord &&
    formData.value.isFullTank &&
    lastRecord.isFullTank &&
    formData.value.liters > 0
  ) {
    distanceTraveled.value = formData.value.currentMileage - lastRecord.currentMileage
    if (distanceTraveled.value > 0) {
      calculatedEfficiency.value = distanceTraveled.value / formData.value.liters
    }
  } else {
    calculatedEfficiency.value = 0
    distanceTraveled.value = 0
  }
}

const handleSubmit = async () => {
  if (mileageError.value) return

  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const input: FuelRecordInput = {
      vehicleId: vehicleId.value,
      ...formData.value
    }

    await fuelStore.addFuelRecord(input)
    successMessage.value = 'Abastecimento registrado com sucesso!'
    
    // Resetar form após 2 segundos
    setTimeout(() => {
      resetForm()
      successMessage.value = ''
    }, 2000)
  } catch (err) {
    console.error('Erro ao salvar abastecimento:', err)
    errorMessage.value = 'Erro ao salvar abastecimento. Tente novamente.'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  const lastRecord = fuelStore.getLastRecord(vehicleId.value)
  formData.value = {
    date: new Date(),
    liters: 0,
    totalCost: 0,
    currentMileage: lastRecord?.currentMileage || 0,
    fuelType: lastRecord?.fuelType || 'gasoline',
    isFullTank: false,
    notes: ''
  }
  costPerLiter.value = 0
  calculatedEfficiency.value = 0
  distanceTraveled.value = 0
  mileageError.value = ''
}
</script>
